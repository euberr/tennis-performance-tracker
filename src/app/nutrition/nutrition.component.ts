import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../core/storage.service';
import { NutritionLog } from '../core/models/nutrition-log.model';
import { Match } from '../core/models/match.model';
import { TrainingSession } from '../core/models/training-session.model';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent implements OnInit {
  logs: NutritionLog[] = [];
  matches: Match[] = [];
  trainingSessions: TrainingSession[] = [];
  showForm: boolean = false;
  editingLog: NutritionLog | null = null;
  
  formData: Partial<NutritionLog> = {
    linkedType: 'match',
    linkedId: '',
    pre: {
      carbs: false,
      protein: false,
      caffeine: false,
      notes: ''
    },
    during: {
      waterMl: 0,
      electrolytes: false,
      carbs: false,
      notes: ''
    },
    post: {
      within60min: false,
      carbs: false,
      protein: false,
      notes: ''
    },
    gutComfort: 5,
    cramps: 1,
    energyImpact: 5
  };

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.storageService.getNutritionLogs().subscribe(logs => {
      this.logs = logs.sort((a, b) => {
        const aDate = this.getLinkedDate(a);
        const bDate = this.getLinkedDate(b);
        return bDate.getTime() - aDate.getTime();
      });
    });

    this.storageService.getMatches().subscribe(matches => {
      this.matches = matches;
    });

    this.storageService.getTrainingSessions().subscribe(sessions => {
      this.trainingSessions = sessions;
    });
  }

  getLinkedDate(log: NutritionLog): Date {
    if (log.linkedType === 'match') {
      const match = this.matches.find(m => m.id === log.linkedId);
      return match ? new Date(match.date) : new Date();
    } else {
      const session = this.trainingSessions.find(s => s.id === log.linkedId);
      return session ? new Date(session.date) : new Date();
    }
  }

  getLinkedName(log: NutritionLog): string {
    if (log.linkedType === 'match') {
      const match = this.matches.find(m => m.id === log.linkedId);
      return match ? `vs ${match.opponentName}` : 'N/A';
    } else {
      const session = this.trainingSessions.find(s => s.id === log.linkedId);
      return session ? `Allenamento ${session.type}` : 'N/A';
    }
  }

  startAdd(): void {
    this.editingLog = null;
    this.formData = {
      linkedType: 'match',
      linkedId: '',
      pre: {
        carbs: false,
        protein: false,
        caffeine: false,
        notes: ''
      },
      during: {
        waterMl: 0,
        electrolytes: false,
        carbs: false,
        notes: ''
      },
      post: {
        within60min: false,
        carbs: false,
        protein: false,
        notes: ''
      },
      gutComfort: 5,
      cramps: 1,
      energyImpact: 5
    };
    this.showForm = true;
  }

  startEdit(log: NutritionLog): void {
    this.editingLog = log;
    this.formData = { ...log };
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingLog = null;
  }

  save(): void {
    if (!this.formData.linkedId) {
      alert('Seleziona una partita o un allenamento');
      return;
    }

    const log: NutritionLog = {
      id: this.editingLog?.id || this.generateId(),
      linkedType: this.formData.linkedType!,
      linkedId: this.formData.linkedId!,
      pre: this.formData.pre!,
      during: this.formData.during!,
      post: this.formData.post!,
      gutComfort: this.formData.gutComfort || 5,
      cramps: this.formData.cramps || 1,
      energyImpact: this.formData.energyImpact || 5
    };

    this.storageService.saveNutritionLog(log).subscribe(() => {
      this.loadData();
      this.cancel();
    });
  }

  delete(id: string): void {
    if (confirm('Sei sicuro di voler eliminare questo log nutrizionale?')) {
      this.storageService.deleteNutritionLog(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  getAvailableItems(): Array<{ id: string; name: string }> {
    if (this.formData.linkedType === 'match') {
      return this.matches.map(m => ({ id: m.id, name: `vs ${m.opponentName} - ${new Date(m.date).toLocaleDateString('it-IT')}` }));
    } else {
      return this.trainingSessions.map(s => ({ id: s.id, name: `${s.type} - ${new Date(s.date).toLocaleDateString('it-IT')}` }));
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
