export interface Match {
  id: string;
  date: string; // ISO date string
  tournamentId?: string;
  opponentName: string;
  opponentLevel: string;
  surface: 'clay' | 'grass' | 'hard' | 'indoor';
  matchType?: 'singolare' | 'doppio'; // Tipo di incontro
  partnerName?: string; // Nome partner per match di doppio
  score: string[]; // e.g. ["6-4", "3-6", "10-8"]
  outcome: 'W' | 'L';
  performanceScore: number; // 1-10
  rpe: number; // 1-10 - Sforzo percepito
  energy: number; // 1-10
  focus: number; // 1-10
  notes?: string;
  tags: string[];
}
