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
  products: Product[];
  category: string;
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

export interface NavigationPoint {
  id: string;
  name: string;
  location: Location;
  connections: string[];
  type: 'entrance' | 'escalator' | 'elevator' | 'restroom' | 'information';
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
} 