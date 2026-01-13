import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../core/storage.service';
import { TrainingSession } from '../core/models/training-session.model';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  sessions: TrainingSession[] = [];
  showForm: boolean = false;
  editingSession: TrainingSession | null = null;
  
  formData: Partial<TrainingSession> = {
    date: new Date().toISOString().split('T')[0],
    type: 'tennis',
    durationMin: 60,
    rpe: 5,
    sessionScore: 5,
    soreness: 5,
    sleepQuality: 5,
    notes: '',
    tags: []
  };

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.storageService.getTrainingSessions().subscribe(sessions => {
      this.sessions = sessions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  startAdd(): void {
    this.editingSession = null;
    this.formData = {
      date: new Date().toISOString().split('T')[0],
      type: 'tennis',
      durationMin: 60,
      rpe: 5,
      sessionScore: 5,
      soreness: 5,
      sleepQuality: 5,
      notes: '',
      tags: []
    };
    this.showForm = true;
  }

  startEdit(session: TrainingSession): void {
    this.editingSession = session;
    this.formData = { ...session };
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingSession = null;
  }

  save(): void {
    if (!this.formData.date || !this.formData.type) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const session: TrainingSession = {
      id: this.editingSession?.id || this.generateId(),
      date: this.formData.date!,
      type: this.formData.type!,
      durationMin: this.formData.durationMin || 60,
      rpe: this.formData.rpe || 5,
      sessionScore: this.formData.sessionScore || 5,
      soreness: this.formData.soreness || 5,
      sleepQuality: this.formData.sleepQuality || 5,
      notes: this.formData.notes,
      tags: this.formData.tags || []
    };

    this.storageService.saveTrainingSession(session).subscribe(() => {
      this.loadSessions();
      this.cancel();
    });
  }

  delete(id: string): void {
    if (confirm('Sei sicuro di voler eliminare questa sessione?')) {
      this.storageService.deleteTrainingSession(id).subscribe(() => {
        this.loadSessions();
      });
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }

  getTypeName(type: string): string {
    const names: { [key: string]: string } = {
      'tennis': 'Tennis',
      'gym': 'Palestra',
      'run': 'Corsa',
      'mobility': 'Mobilità',
      'technique': 'Tecnica',
      'sparring': 'Sparring'
    };
    return names[type] || type;
  }
}
