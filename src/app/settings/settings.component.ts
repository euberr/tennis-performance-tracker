import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../core/storage.service';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private storageService: StorageService) {}

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  exportData(): void {
    this.storageService.exportAll().subscribe(data => {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tennis-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Backup esportato con successo!');
    });
  }

  importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (confirm('Importare questi dati? I dati esistenti verranno sovrascritti.')) {
          this.storageService.importAll(data).subscribe(() => {
            alert('Dati importati con successo!');
            window.location.reload();
          });
        }
      } catch (error) {
        alert('Errore durante l\'importazione. Verifica che il file sia valido.');
      }
    };
    reader.readAsText(file);
  }
}
