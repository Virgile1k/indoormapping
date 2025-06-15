"use client";

import React, { useState, useEffect } from 'react';
import SearchControls from './indoor-map/SearchControls';
import MapView from './indoor-map/MapView';
import DepartmentDetails from './indoor-map/DepartmentDetails';
import LegendAndControls from './indoor-map/LegendAndControls';
import { Department, Location, NavigationPoint, ViewBox } from './indoor-map/types';

const IndoorMap: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Location>({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Location | null>(null);
  const [viewBox, setViewBox] = useState<ViewBox>({ x: 0, y: 0, width: 1200, height: 600 });
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // Sample data (rect-based, larger, with icons and parking lot)
  const departments: Department[] = [
    {
      id: 'meat',
      name: 'Meat Department',
      x: 100, y: 100, width: 260, height: 180,
      category: 'Grocery',
      floor: 1,
      color: '#FFE4E1',
      description: 'Fresh meat and seafood selection',
      openingHours: '7:00 AM - 9:00 PM',
      icon: '🥩',
      aisles: [
        { id: 'meat1', x: 130, y: 150, width: 80, height: 30, category: 'Red Meat', products: [
          { name: 'Beef', price: '$8.99/lb', description: 'Premium Angus Beef' },
          { name: 'Pork', price: '$6.99/lb', description: 'Farm Fresh Pork' },
          { name: 'Lamb', price: '$12.99/lb', description: 'New Zealand Lamb' }
        ]},
        { id: 'meat2', x: 230, y: 150, width: 80, height: 30, category: 'Poultry', products: [
          { name: 'Chicken', price: '$4.99/lb', description: 'Free Range Chicken' },
          { name: 'Turkey', price: '$5.99/lb', description: 'Whole Turkey' },
          { name: 'Duck', price: '$9.99/lb', description: 'Fresh Duck' }
        ]},
        { id: 'meat3', x: 180, y: 200, width: 80, height: 30, category: 'Seafood', products: [
          { name: 'Salmon', price: '$14.99/lb', description: 'Wild Caught Salmon' },
          { name: 'Shrimp', price: '$12.99/lb', description: 'Gulf Shrimp' },
          { name: 'Tuna', price: '$16.99/lb', description: 'Fresh Tuna' }
        ]}
      ]
    },
    {
      id: 'produce',
      name: 'Produce Section',
      x: 400, y: 100, width: 260, height: 180,
      category: 'Grocery',
      floor: 1,
      color: '#E0FFE0',
      description: 'Fresh fruits and vegetables',
      openingHours: '7:00 AM - 9:00 PM',
      icon: '🥦',
      aisles: [
        { id: 'produce1', x: 430, y: 150, width: 80, height: 30, category: 'Fruits', products: [
          { name: 'Apples', price: '$1.99/lb', description: 'Organic Apples' },
          { name: 'Oranges', price: '$2.99/lb', description: 'Florida Oranges' },
          { name: 'Bananas', price: '$0.69/lb', description: 'Fresh Bananas' }
        ]},
        { id: 'produce2', x: 530, y: 150, width: 80, height: 30, category: 'Vegetables', products: [
          { name: 'Carrots', price: '$1.49/lb', description: 'Organic Carrots' },
          { name: 'Potatoes', price: '$0.99/lb', description: 'Russet Potatoes' },
          { name: 'Tomatoes', price: '$2.49/lb', description: 'Vine-Ripened Tomatoes' }
        ]}
      ]
    },
    {
      id: 'bakery',
      name: 'Bakery',
      x: 700, y: 100, width: 260, height: 180,
      category: 'Grocery',
      floor: 1,
      color: '#FFF0E0',
      description: 'Freshly baked bread and pastries',
      openingHours: '6:00 AM - 8:00 PM',
      icon: '🥐',
      aisles: [
        { id: 'bakery1', x: 730, y: 150, width: 80, height: 30, category: 'Bread', products: [
          { name: 'Sourdough', price: '$4.99', description: 'Artisan Sourdough Bread' },
          { name: 'Baguette', price: '$3.99', description: 'French Baguette' },
          { name: 'Whole Grain', price: '$5.99', description: 'Multigrain Bread' }
        ]},
        { id: 'bakery2', x: 830, y: 150, width: 80, height: 30, category: 'Pastries', products: [
          { name: 'Croissants', price: '$2.99', description: 'Butter Croissants' },
          { name: 'Muffins', price: '$3.49', description: 'Fresh Baked Muffins' },
          { name: 'Cookies', price: '$1.99', description: 'Homemade Cookies' }
        ]}
      ]
    },
    {
      id: 'parking',
      name: 'Parking Lot',
      x: 100, y: 320, width: 860, height: 120,
      category: 'Parking',
      floor: 1,
      color: '#e0e7ff',
      description: 'Spacious parking for all visitors',
      openingHours: 'Open 24/7',
      icon: '🅿️',
      aisles: []
    }
  ];

  const navigationPoints: NavigationPoint[] = [
    {
      id: 'entrance',
      name: 'Main Entrance',
      location: { x: 50, y: 50 },
      connections: ['escalator1'],
      type: 'entrance'
    },
    {
      id: 'escalator1',
      name: 'Escalator',
      location: { x: 150, y: 150 },
      connections: ['entrance', 'escalator2'],
      type: 'escalator'
    },
    {
      id: 'restroom1',
      name: 'Restroom',
      location: { x: 400, y: 400 },
      connections: [],
      type: 'restroom'
    },
    {
      id: 'info',
      name: 'Information Desk',
      location: { x: 200, y: 50 },
      connections: [],
      type: 'information'
    }
  ];

  // Update filtered departments when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.aisles?.some(aisle => 
          aisle.products.some(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const step = 20;
      const zoomFactor = 1 / zoom;

      switch(e.key) {
        case 'ArrowUp':
          setUserLocation(prev => ({ ...prev, y: Math.max(prev.y - step * zoomFactor, 0) }));
          break;
        case 'ArrowDown':
          setUserLocation(prev => ({ ...prev, y: Math.min(prev.y + step * zoomFactor, 600) }));
          break;
        case 'ArrowLeft':
          setUserLocation(prev => ({ ...prev, x: Math.max(prev.x - step * zoomFactor, 0) }));
          break;
        case 'ArrowRight':
          setUserLocation(prev => ({ ...prev, x: Math.min(prev.x + step * zoomFactor, 1200) }));
          break;
        case '+':
        case '=':
          setZoom(z => Math.min(z + 0.1, 2));
          break;
        case '-':
          setZoom(z => Math.max(z - 0.1, 0.5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [zoom]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      
      setViewBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(prev.x - dx, 1200 - prev.width)),
        y: Math.max(0, Math.min(prev.y - dy, 600 - prev.height))
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as SVGElement;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setUserLocation({ x, y });
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setCurrentSection(department.id);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <SearchControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentFloor={currentFloor}
        onFloorChange={setCurrentFloor}
        onZoomIn={() => setZoom(z => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom(z => Math.max(z - 0.1, 0.5))}
      />

      <MapView
        departments={searchQuery ? filteredDepartments : departments}
        navigationPoints={navigationPoints}
        userLocation={userLocation}
        viewBox={viewBox}
        zoom={zoom}
        selectedDepartment={selectedDepartment}
        currentSection={currentSection}
        onDepartmentSelect={handleDepartmentSelect}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />

      {selectedDepartment && (
        <DepartmentDetails
          department={selectedDepartment}
          onSetLocation={setUserLocation}
        />
      )}

      <LegendAndControls />
    </div>
  );
};

export default IndoorMap; 