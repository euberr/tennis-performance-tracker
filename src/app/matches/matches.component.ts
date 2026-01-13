import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StorageService } from '../core/storage.service';
import { Match } from '../core/models/match.model';
import { Tournament } from '../core/models/tournament.model';
import { TpCardComponent } from '../shared/ui/tp-card/tp-card.component';
import { TpBadgeComponent } from '../shared/ui/tp-badge/tp-badge.component';
import { TpEmptyStateComponent } from '../shared/ui/tp-empty-state/tp-empty-state.component';
import { TpRatingSliderComponent } from '../shared/ui/tp-rating-slider/tp-rating-slider.component';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    TpCardComponent,
    TpBadgeComponent,
    TpEmptyStateComponent,
    TpRatingSliderComponent
  ],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  tournaments: Tournament[] = [];
  tournamentMap: { [key: string]: Tournament } = {};
  showForm: boolean = false;
  editingMatch: Match | null = null;
  selectedTournamentFilter: string = 'all'; // 'all', 'none', or tournamentId
  selectedMatchTypeFilter: string = 'all'; // 'all', 'singolare', 'doppio'
  
  formData: Partial<Match> = {
    date: new Date().toISOString().split('T')[0],
    tournamentId: '',
    opponentName: '',
    opponentLevel: '',
    surface: 'hard',
    matchType: 'singolare',
    partnerName: '',
    score: [],
    outcome: 'W',
    performanceScore: 5,
    rpe: 5,
    energy: 5,
    focus: 5,
    notes: '',
    tags: []
  };

  newScoreSet: string = '';

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for tournamentId in query params
    this.route.queryParams.subscribe(params => {
      const tournamentId = params['tournamentId'];
      const editId = params['editId'];
      
      if (tournamentId) {
        this.formData.tournamentId = tournamentId;
        this.startAdd();
      } else if (editId) {
        // Load match for editing
        this.loadData();
        this.storageService.getMatches().subscribe(matches => {
          const match = matches.find(m => m.id === editId);
          if (match) {
            this.startEdit(match);
          }
        });
      } else {
        this.loadData();
      }
    });
  }

  loadData(): void {
    // Load tournaments first for mapping
    this.storageService.getTournaments().subscribe(tournaments => {
      this.tournaments = tournaments;
      this.tournamentMap = {};
      tournaments.forEach(t => {
        this.tournamentMap[t.id] = t;
      });
      
      // Then load matches
      this.storageService.getMatches().subscribe(matches => {
        // Retrocompatibilità: assegna 'singolare' se matchType mancante
        this.matches = matches.map(match => ({
          ...match,
          matchType: match.matchType || 'singolare'
        })).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.applyFilter();
      });
    });
  }

  applyFilter(): void {
    let filtered = this.matches;
    
    // Filtro per torneo
    if (this.selectedTournamentFilter === 'all') {
      filtered = this.matches;
    } else if (this.selectedTournamentFilter === 'none') {
      filtered = this.matches.filter(m => !m.tournamentId);
    } else {
      filtered = this.matches.filter(m => m.tournamentId === this.selectedTournamentFilter);
    }
    
    // Filtro per tipo match
    if (this.selectedMatchTypeFilter !== 'all') {
      filtered = filtered.filter(m => {
        const matchType = m.matchType || 'singolare'; // Retrocompatibilità
        return matchType === this.selectedMatchTypeFilter;
      });
    }
    
    this.filteredMatches = filtered;
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  startAdd(): void {
    this.editingMatch = null;
    // tournamentId might be pre-filled from query params
    const tournamentId = this.formData.tournamentId || '';
    this.formData = {
      date: new Date().toISOString().split('T')[0],
      tournamentId: tournamentId,
      opponentName: '',
      opponentLevel: '',
      surface: 'hard',
      matchType: 'singolare',
      partnerName: '',
      score: [],
      outcome: 'W',
      performanceScore: 5,
      rpe: 5,
      energy: 5,
      focus: 5,
      notes: '',
      tags: []
    };
    this.newScoreSet = '';
    this.showForm = true;
  }

  startEdit(match: Match): void {
    this.editingMatch = match;
    this.formData = { 
      ...match,
      matchType: match.matchType || 'singolare' // Retrocompatibilità
    };
    this.newScoreSet = '';
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingMatch = null;
  }

  addScoreSet(): void {
    if (this.newScoreSet.trim()) {
      if (!this.formData.score) {
        this.formData.score = [];
      }
      this.formData.score.push(this.newScoreSet.trim());
      this.newScoreSet = '';
    }
  }

  removeScoreSet(index: number): void {
    if (this.formData.score) {
      this.formData.score.splice(index, 1);
    }
  }

  save(): void {
    if (!this.formData.date || !this.formData.opponentName) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const match: Match = {
      id: this.editingMatch?.id || this.generateId(),
      date: this.formData.date!,
      tournamentId: this.formData.tournamentId || undefined,
      opponentName: this.formData.opponentName!,
      opponentLevel: this.formData.opponentLevel || '',
      surface: this.formData.surface || 'hard',
      matchType: this.formData.matchType || 'singolare',
      partnerName: this.formData.matchType === 'doppio' ? (this.formData.partnerName || undefined) : undefined,
      score: this.formData.score || [],
      outcome: this.formData.outcome || 'W',
      performanceScore: this.formData.performanceScore || 5,
      rpe: this.formData.rpe || 5,
      energy: this.formData.energy || 5,
      focus: this.formData.focus || 5,
      notes: this.formData.notes,
      tags: this.formData.tags || []
    };

    this.storageService.saveMatch(match).subscribe(() => {
      // Clear query params if present
      this.router.navigate(['/matches'], { queryParams: {} });
      this.loadData();
      this.cancel();
    });
  }

  delete(id: string): void {
    if (confirm('Sei sicuro di voler eliminare questa partita?')) {
      this.storageService.deleteMatch(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }

  getSurfaceName(surface: string): string {
    const names: { [key: string]: string } = {
      'clay': 'Terra Rossa',
      'grass': 'Erba',
      'hard': 'Cemento',
      'indoor': 'Indoor'
    };
    return names[surface] || surface;
  }

  getTournamentName(id?: string): string {
    if (!id) return 'Nessun torneo';
    const tournament = this.tournamentMap[id];
    return tournament ? tournament.name : 'N/A';
  }

  navigateToTournament(tournamentId?: string): void {
    if (tournamentId) {
      this.router.navigate(['/tournaments', tournamentId]);
    }
  }

  getMatchTypeName(matchType?: string): string {
    return matchType === 'doppio' ? 'Doppio' : 'Singolare';
  }

  getMatchTypeIcon(matchType?: string): string {
    return matchType === 'doppio' ? 'users' : 'user';
  }

  getRpeColor(rpe: number): 'success' | 'warning' | 'danger' | 'neutral' {
    if (rpe <= 4) return 'success';
    if (rpe <= 6) return 'warning';
    if (rpe <= 8) return 'danger';
    return 'danger'; // 9-10
  }

  getRpeVariant(rpe: number): 'success' | 'warn' | 'danger' | 'neutral' {
    if (rpe <= 4) return 'success';
    if (rpe <= 6) return 'warn';
    if (rpe <= 8) return 'danger';
    return 'danger'; // 9-10
  }

  onMatchTypeChange(): void {
    // Reset partnerName quando si cambia da doppio a singolare
    if (this.formData.matchType !== 'doppio') {
      this.formData.partnerName = '';
    }
  }
}
