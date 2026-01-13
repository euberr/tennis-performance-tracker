import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StorageService } from '../../core/storage.service';
import { Tournament } from '../../core/models/tournament.model';
import { Match } from '../../core/models/match.model';
import { TpCardComponent } from '../../shared/ui/tp-card/tp-card.component';
import { TpBadgeComponent } from '../../shared/ui/tp-badge/tp-badge.component';
import { TpEmptyStateComponent } from '../../shared/ui/tp-empty-state/tp-empty-state.component';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    TpCardComponent,
    TpBadgeComponent,
    TpEmptyStateComponent
  ],
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {
  tournament: Tournament | null = null;
  matches: Match[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTournament(id);
    }
  }

  loadTournament(id: string): void {
    this.loading = true;
    this.storageService.getTournamentById(id).subscribe(tournament => {
      this.tournament = tournament;
      if (tournament) {
        this.loadMatches(id);
      } else {
        this.loading = false;
      }
    });
  }

  loadMatches(tournamentId: string): void {
    this.storageService.getMatchesByTournament(tournamentId).subscribe(matches => {
      // Retrocompatibilità: assegna 'singolare' se matchType mancante
      this.matches = matches.map(match => ({
        ...match,
        matchType: match.matchType || 'singolare'
      })).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.loading = false;
    });
  }

  addMatch(): void {
    if (this.tournament) {
      this.router.navigate(['/matches'], { 
        queryParams: { tournamentId: this.tournament.id } 
      });
    }
  }

  editMatch(match: Match): void {
    this.router.navigate(['/matches'], { 
      queryParams: { editId: match.id } 
    });
  }

  deleteMatch(id: string): void {
    if (confirm('Sei sicuro di voler eliminare questa partita?')) {
      this.storageService.deleteMatch(id).subscribe(() => {
        if (this.tournament) {
          this.loadMatches(this.tournament.id);
        }
      });
    }
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

  goBack(): void {
    this.router.navigate(['/tournaments']);
  }

  getMatchTypeName(matchType?: string): string {
    return matchType === 'doppio' ? 'Doppio' : 'Singolare';
  }

  getMatchTypeIcon(matchType?: string): string {
    return matchType === 'doppio' ? 'users' : 'user';
  }

  getRpeVariant(rpe: number): 'success' | 'warning' | 'danger' | 'neutral' {
    if (rpe <= 4) return 'success';
    if (rpe <= 6) return 'warning';
    if (rpe <= 8) return 'danger';
    return 'danger'; // 9-10
  }
}
