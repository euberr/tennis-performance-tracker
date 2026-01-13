import { Injectable } from '@angular/core';
import { Observable, from, of, firstValueFrom } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Tournament } from './models/tournament.model';
import { Match } from './models/match.model';
import { TrainingSession } from './models/training-session.model';
import { NutritionLog } from './models/nutrition-log.model';
import { DailyMetrics } from './models/daily-metrics.model';

const DB_NAME = 'TennisTrackerDB';
const DB_VERSION = 1;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private useIndexedDB = true;

  constructor() {
    if (!('indexedDB' in window)) {
      this.useIndexedDB = false;
      console.warn('IndexedDB not supported, using LocalStorage fallback');
    } else {
      this.dbPromise = this.openDatabase();
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('tournaments')) {
          db.createObjectStore('tournaments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('matches')) {
          db.createObjectStore('matches', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('trainingSessions')) {
          db.createObjectStore('trainingSessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('nutritionLogs')) {
          db.createObjectStore('nutritionLogs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('dailyMetrics')) {
          db.createObjectStore('dailyMetrics', { keyPath: 'date' });
        }
      };
    });
  }

  private getAll<T>(storeName: string): Observable<T[]> {
    if (this.useIndexedDB && this.dbPromise) {
      return from(this.dbPromise).pipe(
        switchMap(db => {
          return new Promise<T[]>((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
          });
        }),
        catchError(() => of(this.getFromLocalStorage<T>(storeName)))
      );
    }
    return of(this.getFromLocalStorage<T>(storeName));
  }

  private save<T>(storeName: string, item: T, idKey: keyof T = 'id' as keyof T): Observable<void> {
    if (this.useIndexedDB && this.dbPromise) {
      return from(this.dbPromise).pipe(
        switchMap(db => {
          return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(item);
            request.onsuccess = () => {
              this.saveToLocalStorage(storeName, item, idKey);
              resolve();
            };
            request.onerror = () => reject(request.error);
          });
        }),
        catchError(() => {
          this.saveToLocalStorage(storeName, item, idKey);
          return of(undefined);
        })
      );
    }
    this.saveToLocalStorage(storeName, item, idKey);
    return of(undefined);
  }

  private delete(storeName: string, id: string, idKey: string = 'id'): Observable<void> {
    if (this.useIndexedDB && this.dbPromise) {
      return from(this.dbPromise).pipe(
        switchMap(db => {
          return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            request.onsuccess = () => {
              this.deleteFromLocalStorage(storeName, id, idKey);
              resolve();
            };
            request.onerror = () => reject(request.error);
          });
        }),
        catchError(() => {
          this.deleteFromLocalStorage(storeName, id, idKey);
          return of(undefined);
        })
      );
    }
    this.deleteFromLocalStorage(storeName, id, idKey);
    return of(undefined);
  }

  // Tournament methods
  getTournaments(): Observable<Tournament[]> {
    return this.getAll<Tournament>('tournaments');
  }

  getTournamentById(id: string): Observable<Tournament | null> {
    return this.getTournaments().pipe(
      map(tournaments => tournaments.find(t => t.id === id) || null)
    );
  }

  saveTournament(tournament: Tournament): Observable<void> {
    return this.save('tournaments', tournament);
  }

  deleteTournament(id: string): Observable<void> {
    return this.delete('tournaments', id);
  }

  // Orphan matches when deleting tournament
  orphanMatchesByTournament(tournamentId: string): Observable<void> {
    return this.getMatches().pipe(
      switchMap(matches => {
        const matchesToUpdate = matches.filter(m => m.tournamentId === tournamentId);
        if (matchesToUpdate.length === 0) {
          return of(undefined);
        }
        
        const updatePromises = matchesToUpdate.map(match => {
          const updatedMatch = { ...match, tournamentId: undefined };
          return firstValueFrom(this.saveMatch(updatedMatch));
        });

        return from(Promise.all(updatePromises)).pipe(
          map(() => undefined)
        );
      })
    );
  }

  // Match methods
  getMatches(): Observable<Match[]> {
    return this.getAll<Match>('matches');
  }

  getMatchesByTournament(tournamentId: string): Observable<Match[]> {
    return this.getMatches().pipe(
      map(matches => matches.filter(m => m.tournamentId === tournamentId))
    );
  }

  saveMatch(match: Match): Observable<void> {
    return this.save('matches', match);
  }

  deleteMatch(id: string): Observable<void> {
    return this.delete('matches', id);
  }

  // TrainingSession methods
  getTrainingSessions(): Observable<TrainingSession[]> {
    return this.getAll<TrainingSession>('trainingSessions');
  }

  saveTrainingSession(session: TrainingSession): Observable<void> {
    return this.save('trainingSessions', session);
  }

  deleteTrainingSession(id: string): Observable<void> {
    return this.delete('trainingSessions', id);
  }

  // NutritionLog methods
  getNutritionLogs(): Observable<NutritionLog[]> {
    return this.getAll<NutritionLog>('nutritionLogs');
  }

  saveNutritionLog(log: NutritionLog): Observable<void> {
    return this.save('nutritionLogs', log);
  }

  deleteNutritionLog(id: string): Observable<void> {
    return this.delete('nutritionLogs', id);
  }

  // DailyMetrics methods
  getDailyMetrics(): Observable<DailyMetrics[]> {
    return this.getAll<DailyMetrics>('dailyMetrics');
  }

  saveDailyMetrics(metrics: DailyMetrics): Observable<void> {
    return this.save('dailyMetrics', metrics, 'date');
  }

  deleteDailyMetrics(date: string): Observable<void> {
    return this.delete('dailyMetrics', date, 'date');
  }

  // Export/Import
  exportAll(): Observable<any> {
    return new Observable(observer => {
      Promise.all([
        firstValueFrom(this.getTournaments()),
        firstValueFrom(this.getMatches()),
        firstValueFrom(this.getTrainingSessions()),
        firstValueFrom(this.getNutritionLogs()),
        firstValueFrom(this.getDailyMetrics())
      ]).then(([tournaments, matches, trainingSessions, nutritionLogs, dailyMetrics]) => {
        observer.next({
          tournaments: tournaments || [],
          matches: matches || [],
          trainingSessions: trainingSessions || [],
          nutritionLogs: nutritionLogs || [],
          dailyMetrics: dailyMetrics || [],
          exportDate: new Date().toISOString()
        });
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  importAll(data: any): Observable<void> {
    return new Observable(observer => {
      const promises: Promise<void>[] = [];

      if (data.tournaments) {
        data.tournaments.forEach((t: Tournament) => {
          promises.push(firstValueFrom(this.saveTournament(t)) as Promise<void>);
        });
      }
      if (data.matches) {
        data.matches.forEach((m: Match) => {
          promises.push(firstValueFrom(this.saveMatch(m)) as Promise<void>);
        });
      }
      if (data.trainingSessions) {
        data.trainingSessions.forEach((ts: TrainingSession) => {
          promises.push(firstValueFrom(this.saveTrainingSession(ts)) as Promise<void>);
        });
      }
      if (data.nutritionLogs) {
        data.nutritionLogs.forEach((nl: NutritionLog) => {
          promises.push(firstValueFrom(this.saveNutritionLog(nl)) as Promise<void>);
        });
      }
      if (data.dailyMetrics) {
        data.dailyMetrics.forEach((dm: DailyMetrics) => {
          promises.push(firstValueFrom(this.saveDailyMetrics(dm)) as Promise<void>);
        });
      }

      Promise.all(promises).then(() => {
        observer.next();
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  // LocalStorage fallback methods
  private getFromLocalStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage<T>(key: string, item: T, idKey: keyof T = 'id' as keyof T): void {
    try {
      const items = this.getFromLocalStorage<T>(key);
      const index = items.findIndex(i => (i as any)[idKey] === (item as any)[idKey]);
      if (index >= 0) {
        items[index] = item;
      } else {
        items.push(item);
      }
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('LocalStorage save error', error);
    }
  }

  private deleteFromLocalStorage<T>(key: string, id: string, idKey: string = 'id'): void {
    try {
      const items = this.getFromLocalStorage<T>(key);
      const filtered = items.filter(i => (i as any)[idKey] !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('LocalStorage delete error', error);
    }
  }
}
