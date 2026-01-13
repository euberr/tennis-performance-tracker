import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../core/storage.service';
import { DailyMetrics } from '../core/models/daily-metrics.model';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-daily-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './daily-metrics.component.html',
  styleUrls: ['./daily-metrics.component.css']
})
export class DailyMetricsComponent implements OnInit {
  metrics: DailyMetrics[] = [];
  showForm: boolean = false;
  editingMetrics: DailyMetrics | null = null;
  
  formData: Partial<DailyMetrics> = {
    date: new Date().toISOString().split('T')[0],
    weightKg: undefined,
    sleepHours: undefined,
    sleepQuality: 5,
    stress: 5,
    soreness: 5,
    energyMorning: 5,
    notes: '',
    tags: []
  };

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.storageService.getDailyMetrics().subscribe(metrics => {
      this.metrics = metrics.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  startAdd(): void {
    this.editingMetrics = null;
    this.formData = {
      date: new Date().toISOString().split('T')[0],
      weightKg: undefined,
      sleepHours: undefined,
      sleepQuality: 5,
      stress: 5,
      soreness: 5,
      energyMorning: 5,
      notes: '',
      tags: []
    };
    this.showForm = true;
  }

  startEdit(metrics: DailyMetrics): void {
    this.editingMetrics = metrics;
    this.formData = { ...metrics };
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingMetrics = null;
  }

  save(): void {
    if (!this.formData.date) {
      alert('Seleziona una data');
      return;
    }

    const metrics: DailyMetrics = {
      date: this.formData.date!,
      weightKg: this.formData.weightKg,
      sleepHours: this.formData.sleepHours,
      sleepQuality: this.formData.sleepQuality || 5,
      stress: this.formData.stress || 5,
      soreness: this.formData.soreness || 5,
      energyMorning: this.formData.energyMorning || 5,
      notes: this.formData.notes,
      tags: this.formData.tags || []
    };

    this.storageService.saveDailyMetrics(metrics).subscribe(() => {
      this.loadMetrics();
      this.cancel();
    });
  }

  delete(date: string): void {
    if (confirm('Sei sicuro di voler eliminare queste metriche?')) {
      this.storageService.deleteDailyMetrics(date).subscribe(() => {
        this.loadMetrics();
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }
}
