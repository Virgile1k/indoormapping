"use client";

import React from 'react';

const LegendAndControls: React.FC = () => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-900">Legend</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#FFE4E1] border border-gray-400 mr-2"></div>
            <span className="text-gray-900">Meat Department</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#E0FFE0] border border-gray-400 mr-2"></div>
            <span className="text-gray-900">Produce</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#FFF0E0] border border-gray-400 mr-2"></div>
            <span className="text-gray-900">Bakery</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 10 10">
              <path d="M 0,0 L 10,0 L 10,10 L 0,10 Z M 2,2 L 8,2 L 8,8 L 2,8 Z" fill="#64748b" />
            </svg>
            <span className="text-gray-900">Entrance</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-900">Navigation Controls</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 font-medium">Keyboard Controls:</p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Arrow keys to move around</li>
              <li>+ and - keys to zoom in/out</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Mouse/Touch Controls:</p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Click and drag to pan the map</li>
              <li>Double-click to set your location</li>
              <li>Use + and - buttons to zoom</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegendAndControls; 