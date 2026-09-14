export type WasteType = 'dry' | 'wet' | 'both' | 'e-waste';

export type BinStatus = 'normal' | 'filling' | 'full' | 'maintenance';

export type BuildingZone = 
  | 'brahmaputra-hostel'
  | 'kosi-hostel'
  | 'bhagmati-hostel'
  | 'ganga-girls-hostel'
  | 'nano-building'
  | 'cse-dept'
  | 'alaknanda-bhawan'
  | 'ece-dept'
  | 'auditorium-cwrs'
  | 'amphitheatre'
  | 'it-lab'
  | 'basketball-court'
  | 'play-ground'
  | 'sac-building'
  | 'civil-dept'
  | 'main-building'
  | 'central-library'
  | 'indian-bank-atm'
  | 'cafeteria'
  | 'stationery'
  | 'shop-2'
  | 'parking-area'
  | 'physics-dept'
  | 'chemistry-dept'
  | 'main-gate-internal'
  | 'kosi-ext'
  | 'kosi-exit'
  | 'east-gardens'
  | 'gandhi-ghat';

export interface CampusBin {
  id: string;
  name: string;
  locationName: string;
  zone: BuildingZone;
  floor: string;
  landmark: string;
  coords: { x: number; y: number }; // Percentage on map 0-100
  types: WasteType[];
  fillLevel: number; // 0 to 100
  status: BinStatus;
  lastEmptied: string;
  capacityLiters: number;
  hasDry: boolean;
  hasWet: boolean;
  hasEwaste: boolean;
  photoUrl?: string;
  reportedCount: number;
}

export interface WasteItem {
  id: string;
  name: string;
  category: 'wet' | 'dry' | 'e-waste' | 'hazardous';
  binColor: 'green' | 'blue' | 'black' | 'red';
  binName: string;
  description: string;
  tip: string;
  recyclable: boolean;
  biodegradable: boolean;
  popular?: boolean;
}

export interface ReportTicket {
  id: string;
  binId: string;
  binName: string;
  locationName: string;
  issueType: 'overflowing' | 'damaged' | 'missing' | 'smell' | 'wrong_waste';
  details: string;
  reportedAt: string;
  status: 'pending' | 'cleaning_dispatched' | 'resolved';
  reportedBy: string;
}

export interface CampusZoneInfo {
  id: BuildingZone;
  name: string;
  shortName: string;
  coords: { x: number; y: number; width: number; height: number };
  color: string;
  description: string;
}
