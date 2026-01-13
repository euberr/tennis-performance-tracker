export type TrainingType = 'tennis' | 'gym' | 'run' | 'mobility' | 'technique' | 'sparring';

export interface TrainingSession {
  id: string;
  date: string; // ISO date string
  type: TrainingType;
  durationMin: number;
  rpe: number; // 1-10
  sessionScore: number; // 1-10
  soreness: number; // 1-10
  sleepQuality: number; // 1-10
  notes?: string;
  tags: string[];
}
