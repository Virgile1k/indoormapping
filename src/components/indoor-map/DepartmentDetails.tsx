"use client";

import React from 'react';
import { Department, Location } from './types';

interface DepartmentDetailsProps {
  department: Department;
  onSetLocation: (location: Location) => void;
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({
  department,
  onSetLocation,
}) => {
  const getDepartmentCenter = (path: string): Location => {
    const coordinates = path.split(/[MLZ\s]/).filter(Boolean);
    const x = parseFloat(coordinates[0] || '0');
    const y = parseFloat(coordinates[1] || '0');
    const width = parseFloat(coordinates[2] || '0') - x;
    const height = parseFloat(coordinates[5] || '0') - y;
    return {
      x: x + width / 2,
      y: y + height / 2
    };
  };

  return (
    <div className="mt-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{department.name}</h3>
          <p className="text-gray-600 mt-1">{department.description}</p>
          <div className="mt-2 flex gap-4">
            <span className="text-sm text-gray-500">Category: {department.category}</span>
            <span className="text-sm text-gray-500">Floor: {department.floor}</span>
            <span className="text-sm text-gray-500">Hours: {department.openingHours}</span>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => onSetLocation(getDepartmentCenter(department.path))}
        >
          Set as Current Location
        </button>
      </div>

      {department.aisles && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Products</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.aisles.map(aisle => (
              <div key={aisle.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <h5 className="font-medium text-gray-900 mb-2">{aisle.category}</h5>
                <ul className="space-y-2">
                  {aisle.products.map((product, index) => (
                    <li key={index} className="text-gray-600 hover:text-gray-900 transition-colors">
                      <span className="font-medium">{product.name}</span>
                      {product.price && <span className="ml-2 text-blue-600">{product.price}</span>}
                      {product.description && (
                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetails; 