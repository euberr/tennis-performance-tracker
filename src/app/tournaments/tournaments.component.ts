import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../core/storage.service';
import { Tournament } from '../core/models/tournament.model';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  tournaments: Tournament[] = [];
  showForm: boolean = false;
  editingTournament: Tournament | null = null;
  
  formData: Partial<Tournament> = {
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    surface: 'hard',
    category: '',
    notes: ''
  };

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.storageService.getTournaments().subscribe(tournaments => {
      this.tournaments = tournaments.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    });
  }

  startAdd(): void {
    this.editingTournament = null;
    this.formData = {
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      surface: 'hard',
      category: '',
      notes: ''
    };
    this.showForm = true;
  }

  startEdit(tournament: Tournament): void {
    this.editingTournament = tournament;
    this.formData = { ...tournament };
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingTournament = null;
  }

  save(): void {
    if (!this.formData.name || !this.formData.startDate || !this.formData.endDate) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const tournament: Tournament = {
      id: this.editingTournament?.id || this.generateId(),
      name: this.formData.name!,
      location: this.formData.location || '',
      startDate: this.formData.startDate!,
      endDate: this.formData.endDate!,
      surface: this.formData.surface || 'hard',
      category: this.formData.category || '',
      notes: this.formData.notes
    };

    this.storageService.saveTournament(tournament).subscribe(() => {
      this.loadTournaments();
      this.cancel();
    });
  }

  delete(id: string): void {
    // Check if tournament has matches
    this.storageService.getMatchesByTournament(id).subscribe(matches => {
      const matchCount = matches.length;
      let message = 'Sei sicuro di voler eliminare questo torneo?';
      
      if (matchCount > 0) {
        message += `\n\nQuesto torneo ha ${matchCount} partita(e) collegata(e). Le partite verranno mantenute ma il collegamento al torneo verrà rimosso.`;
      }

      if (confirm(message)) {
        // Orphan matches first
        if (matchCount > 0) {
          this.storageService.orphanMatchesByTournament(id).subscribe(() => {
            // Then delete tournament
            this.storageService.deleteTournament(id).subscribe(() => {
              this.loadTournaments();
            });
          });
        } else {
          // No matches, just delete
          this.storageService.deleteTournament(id).subscribe(() => {
            this.loadTournaments();
          });
        }
      }
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/tournaments', id]);
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
}
