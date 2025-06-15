export interface Department {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  category: string;
  floor: number;
  color: string;
  description?: string;
  openingHours?: string;
  aisles?: Aisle[];
  icon?: string;
}

export interface Aisle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  category: string;
  products: Product[];
}

export interface Product {
  name: string;
  price?: string;
  description?: string;
  image?: string;
}

export interface Location {
  x: number;
  y: number;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type NavigationPointType = 'entrance' | 'escalator' | 'elevator' | 'restroom' | 'information';

export interface NavigationPoint {
  id: string;
  name: string;
  location: Location;
  connections: string[];
  type: NavigationPointType;
}

export interface SearchControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export interface MapViewProps {
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

export interface DepartmentDetailsProps {
  department: Department;
  onSetLocation: (location: Location) => void;
}

export interface LegendAndControlsProps {
  departments: Department[];
  onDepartmentSelect: (department: Department) => void;
} 