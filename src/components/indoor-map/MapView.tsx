"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Department, Location, NavigationPoint, ViewBox } from './types';

interface MapViewProps {
  departments: Department[];
  navigationPoints: NavigationPoint[];
  userLocation: Location;
  viewBox: ViewBox;
  zoom: number;
  selectedDepartment: Department | null;
  currentSection: string | null;
  onDepartmentSelect: (department: Department) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

const MapView: React.FC<MapViewProps> = ({
  departments,
  navigationPoints,
  userLocation,
  viewBox,
  zoom,
  selectedDepartment,
  currentSection,
  onDepartmentSelect,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onDoubleClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentPath, setCurrentPath] = useState<Location[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // Generate waypoints for smooth movement
  const generateWaypoints = (from: Location, to: Location): Location[] => {
    const waypoints: Location[] = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      waypoints.push({
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress
      });
    }
    
    return waypoints;
  };

  // Update path when selected department changes
  useEffect(() => {
    if (selectedDepartment) {
      const targetCenter = getRectCenter(
        selectedDepartment.x,
        selectedDepartment.y,
        selectedDepartment.width,
        selectedDepartment.height
      );
      const newPath = generateWaypoints(userLocation, targetCenter);
      setCurrentPath(newPath);
      setCurrentPathIndex(0);
      setIsMoving(true);
    }
  }, [selectedDepartment]);

  // Animate user movement along path
  useEffect(() => {
    if (isMoving && currentPath.length > 0) {
      const moveInterval = setInterval(() => {
        setCurrentPathIndex(prev => {
          if (prev >= currentPath.length - 1) {
            setIsMoving(false);
            clearInterval(moveInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(moveInterval);
    }
  }, [isMoving, currentPath]);

  // Get current user position based on path animation
  const getCurrentUserPosition = (): Location => {
    if (currentPath.length === 0 || currentPathIndex >= currentPath.length) {
      return userLocation;
    }
    return currentPath[currentPathIndex];
  };

  const getNavigationIcon = (type: NavigationPoint['type']): string => {
    switch (type) {
      case 'entrance':
        return 'M 0,0 L 10,0 L 10,10 L 0,10 Z M 2,2 L 8,2 L 8,8 L 2,8 Z';
      case 'escalator':
        return 'M 0,0 L 10,0 L 10,10 L 0,10 Z M 2,2 L 8,2 L 8,8 L 2,8 Z M 3,3 L 7,3 L 7,7 L 3,7 Z';
      case 'restroom':
        return 'M 0,0 L 10,0 L 10,10 L 0,10 Z M 2,2 L 8,2 L 8,8 L 2,8 Z M 3,3 L 7,3 L 7,7 L 3,7 Z';
      case 'information':
        return 'M 0,0 L 10,0 L 10,10 L 0,10 Z M 2,2 L 8,2 L 8,8 L 2,8 Z M 3,3 L 7,3 L 7,7 L 3,7 Z';
      default:
        return 'M 0,0 L 10,0 L 10,10 L 0,10 Z';
    }
  };

  // Center of a rect
  const getRectCenter = (x: number, y: number, width: number, height: number) => ({
    x: x + width / 2,
    y: y + height / 2,
  });

  // Navigation path: simple straight line for demo
  const getNavPath = (from: {x: number, y: number}, to: {x: number, y: number}) =>
    `M ${from.x},${from.y} L ${to.x},${to.y}`;

  return (
    <div className="relative border rounded-lg bg-[#fafbfc] shadow-lg overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-[600px] cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoom})`, background: '#fafbfc' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDoubleClick={onDoubleClick}
      >
        {/* Background grid */}
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid) #fafbfc" />

        {/* Departments as rects */}
        {departments.map((dept) => {
          const isCurrentSection = currentSection === dept.id;
          const showAisles = selectedDepartment?.id === dept.id;
          const center = getRectCenter(dept.x, dept.y, dept.width, dept.height);
          return (
            <g key={dept.id} onClick={() => onDepartmentSelect(dept)} className="cursor-pointer transition-all duration-200">
              <rect
                x={dept.x}
                y={dept.y}
                width={dept.width}
                height={dept.height}
                fill={selectedDepartment?.id === dept.id ? '#3b82f6' : dept.color}
                stroke={isCurrentSection ? '#3b82f6' : '#b0b0b0'}
                strokeWidth={isCurrentSection ? 6 : 3}
                rx={22}
                style={{ filter: 'drop-shadow(0 4px 16px #3b82f622)' }}
                className="hover:opacity-95 transition-opacity"
              />
              {/* Department icon (if present) */}
              {dept.icon && (
                <text
                  x={center.x}
                  y={center.y - 38}
                  fontSize={38}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {dept.icon}
                </text>
              )}
              {/* Department name */}
              <text
                x={center.x}
                y={center.y - 2}
                fontSize={26}
                fontWeight="bold"
                className="fill-gray-900"
                style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 2px 8px #fff', pointerEvents: 'none' }}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {dept.name}
              </text>
              {/* Department category */}
              <text
                x={center.x}
                y={center.y + 28}
                fontSize={18}
                className="fill-gray-700"
                style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 4px #fff', pointerEvents: 'none' }}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {dept.category}
              </text>
              {/* Only show aisle rects/labels for selected department */}
              {showAisles && dept.aisles?.map((aisle) => {
                const aisleCenter = getRectCenter(aisle.x, aisle.y, aisle.width, aisle.height);
                return (
                  <g key={aisle.id}>
                    <rect
                      x={aisle.x}
                      y={aisle.y}
                      width={aisle.width}
                      height={aisle.height}
                      fill="#fff"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      rx={6}
                      className="hover:opacity-90 transition-opacity"
                    />
                    <text
                      x={aisleCenter.x}
                      y={aisleCenter.y}
                      className="text-sm font-medium fill-blue-700"
                      style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 4px #fff' }}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {aisle.category}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Navigation points */}
        {navigationPoints.map((point) => (
          <g key={point.id} transform={`translate(${point.location.x},${point.location.y})`}>
            <path
              d={getNavigationIcon(point.type)}
              fill="#64748b"
              transform="scale(0.7)"
              className="hover:opacity-80 transition-opacity"
            />
            <text
              x="20"
              y="0"
              className="text-sm fill-gray-900 font-medium"
              style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 4px #fff' }}
            >
              {point.name}
            </text>
          </g>
        ))}

        {/* Path to selected department (blue) */}
        {selectedDepartment && currentPath.length > 0 && (
          <path
            d={`M ${currentPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
            stroke="#3b82f6"
            strokeWidth="4"
            strokeDasharray="8,6"
            fill="none"
            className="animate-pulse"
          />
        )}

        {/* User location marker with smooth movement */}
        <g transform={`translate(${getCurrentUserPosition().x},${getCurrentUserPosition().y})`}>
          <circle r="8" fill="#ef4444" />
          <circle r="14" fill="none" stroke="#ef4444" strokeWidth="3" className="animate-ping" />
          {/* Direction indicator */}
          {isMoving && currentPathIndex < currentPath.length - 1 && (
            <path
              d={`M 0,0 L ${currentPath[currentPathIndex + 1].x - getCurrentUserPosition().x},${currentPath[currentPathIndex + 1].y - getCurrentUserPosition().y}`}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default MapView; 