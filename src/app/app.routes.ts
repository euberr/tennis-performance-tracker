import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tournaments',
    loadComponent: () => import('./tournaments/tournaments.component').then(m => m.TournamentsComponent)
  },
  {
    path: 'tournaments/:id',
    loadComponent: () => import('./tournaments/tournament-detail/tournament-detail.component').then(m => m.TournamentDetailComponent)
  },
  {
    path: 'matches',
    loadComponent: () => import('./matches/matches.component').then(m => m.MatchesComponent)
  },
  {
    path: 'training',
    loadComponent: () => import('./training/training.component').then(m => m.TrainingComponent)
  },
  {
    path: 'nutrition',
    loadComponent: () => import('./nutrition/nutrition.component').then(m => m.NutritionComponent)
  },
  {
    path: 'daily-metrics',
    loadComponent: () => import('./daily-metrics/daily-metrics.component').then(m => m.DailyMetricsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
  }
];
