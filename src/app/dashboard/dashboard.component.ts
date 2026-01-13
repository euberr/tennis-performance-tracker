import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StorageService } from '../core/storage.service';
import { Match } from '../core/models/match.model';
import { TrainingSession } from '../core/models/training-session.model';
import { DailyMetrics } from '../core/models/daily-metrics.model';
import { MetricCardComponent } from '../shared/components/metric-card/metric-card.component';
import { TpCardComponent } from '../shared/ui/tp-card/tp-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, MetricCardComponent, TpCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  matches: Match[] = [];
  trainingSessions: TrainingSession[] = [];
  dailyMetrics: DailyMetrics[] = [];

  winRate: number = 0;
  winRateBySurface: { [key: string]: number } = {};
  surfaceKeys: string[] = [];
  weeklyTrainingHours: number = 0;
  weeklyTrainingLoad: number = 0;
  avgPerformanceScore: number = 0;
  avgWeight: number = 0;
  avgEnergy: number = 0;
  avgStress: number = 0;
  avgRpe: number = 0;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.storageService.getMatches().subscribe(matches => {
      this.matches = matches;
      this.calculateMatchStats();
    });

    this.storageService.getTrainingSessions().subscribe(sessions => {
      this.trainingSessions = sessions;
      this.calculateTrainingStats();
    });

    this.storageService.getDailyMetrics().subscribe(metrics => {
      this.dailyMetrics = metrics;
      this.calculateMetricsStats();
    });
  }

  calculateMatchStats(): void {
    if (this.matches.length === 0) return;

    const wins = this.matches.filter(m => m.outcome === 'W').length;
    this.winRate = Math.round((wins / this.matches.length) * 100);

    const surfaces = ['clay', 'grass', 'hard', 'indoor'];
    surfaces.forEach(surface => {
      const surfaceMatches = this.matches.filter(m => m.surface === surface);
      if (surfaceMatches.length > 0) {
        const surfaceWins = surfaceMatches.filter(m => m.outcome === 'W').length;
        this.winRateBySurface[surface] = Math.round((surfaceWins / surfaceMatches.length) * 100);
      }
    });
    this.surfaceKeys = Object.keys(this.winRateBySurface);

    const scores = this.matches.map(m => m.performanceScore).filter(s => s > 0);
    if (scores.length > 0) {
      this.avgPerformanceScore = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length * 10
      ) / 10;
    }
  }

  calculateTrainingStats(): void {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSessions = this.trainingSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekAgo;
    });

    this.weeklyTrainingHours = Math.round(
      recentSessions.reduce((sum, s) => sum + s.durationMin, 0) / 60 * 10
    ) / 10;

    this.weeklyTrainingLoad = recentSessions.reduce((sum, s) => sum + (s.durationMin * s.rpe), 0);

    const rpeValues = this.trainingSessions.map(s => s.rpe).filter(r => r > 0);
    if (rpeValues.length > 0) {
      this.avgRpe = Math.round(
        rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length * 10
      ) / 10;
    }
  }

  calculateMetricsStats(): void {
    const recentMetrics = this.dailyMetrics
      .filter(m => {
        const metricDate = new Date(m.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return metricDate >= weekAgo;
      })
      .filter(m => m.weightKg);

    if (recentMetrics.length > 0) {
      this.avgWeight = Math.round(
        recentMetrics.reduce((sum, m) => sum + (m.weightKg || 0), 0) / recentMetrics.length * 10
      ) / 10;
    }

    const energyValues = this.dailyMetrics.map(m => m.energyMorning).filter(e => e > 0);
    if (energyValues.length > 0) {
      this.avgEnergy = Math.round(
        energyValues.reduce((a, b) => a + b, 0) / energyValues.length * 10
      ) / 10;
    }

    const stressValues = this.dailyMetrics.map(m => m.stress).filter(s => s > 0);
    if (stressValues.length > 0) {
      this.avgStress = Math.round(
        stressValues.reduce((a, b) => a + b, 0) / stressValues.length * 10
      ) / 10;
    }
  }

  getStatusForValue(value: number, reverse: boolean = false): 'good' | 'neutral' | 'warning' {
    if (reverse) {
      return value <= 3 ? 'good' : value <= 6 ? 'neutral' : 'warning';
    }
    return value >= 7 ? 'good' : value >= 4 ? 'neutral' : 'warning';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
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
