"use client";

import React from 'react';

interface SearchControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  searchQuery,
  onSearchChange,
  currentFloor,
  onFloorChange,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Shopping Mall Navigation
      </h2>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search for departments, products, or categories..."
            className="w-full p-3 pl-10 border rounded-lg text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          className="p-3 border rounded-lg text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={currentFloor}
          onChange={(e) => onFloorChange(Number(e.target.value))}
        >
          <option value={1}>Floor 1</option>
          <option value={2}>Floor 2</option>
        </select>
        <div className="flex gap-2">
          <button
            className="p-3 border rounded-lg bg-white text-gray-900 hover:bg-gray-100 shadow-sm transition-colors"
            onClick={onZoomIn}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            className="p-3 border rounded-lg bg-white text-gray-900 hover:bg-gray-100 shadow-sm transition-colors"
            onClick={onZoomOut}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchControls; 