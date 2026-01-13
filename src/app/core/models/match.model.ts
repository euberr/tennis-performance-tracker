export interface Match {
  id: string;
  date: string; // ISO date string
  tournamentId?: string;
  opponentName: string;
  opponentLevel: string;
  surface: 'clay' | 'grass' | 'hard' | 'indoor';
  matchType?: 'singolare' | 'doppio'; // Tipo di incontro
  partnerName?: string; // Nome partner per match di doppio
  matchFormat?: 'one_set' | 'two_sets'; // Formato partita: 1 set o 2 set
  score: string[]; // e.g. ["6-4", "3-6", "10-8"]
  outcome: 'W' | 'L';
  performanceScore: number; // 1-10
  rpe: number; // 1-10 - Sforzo percepito
  energy: number; // 1-10
  focus: number; // 1-10
  notes?: string;
  tags: string[];
}

/**
 * Calcola la durata stimata in minuti in base al formato della partita
 * @param matchFormat Formato della partita ('one_set' o 'two_sets')
 * @returns Durata stimata in minuti (60 per 1 set, 90 per 2 set)
 */
export function getEstimatedDurationMinutes(matchFormat?: 'one_set' | 'two_sets'): number {
  if (matchFormat === 'one_set') {
    return 60;
  }
  // Default: two_sets o formato mancante (retrocompatibilità)
  return 90;
}
