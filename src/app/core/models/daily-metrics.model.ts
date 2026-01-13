export interface DailyMetrics {
  date: string; // ISO date string (unique)
  weightKg?: number;
  sleepHours?: number;
  sleepQuality: number; // 1-10
  stress: number; // 1-10
  soreness: number; // 1-10
  energyMorning: number; // 1-10
  notes?: string;
  tags: string[];
}
