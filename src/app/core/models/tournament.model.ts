export interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  surface: 'clay' | 'grass' | 'hard' | 'indoor';
  category: string;
  notes?: string;
}
