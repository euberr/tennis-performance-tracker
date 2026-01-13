import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'tp-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <div class="tp-empty-state">
      <div class="tp-empty-icon" *ngIf="icon">
        <lucide-angular [name]="icon" [size]="48"></lucide-angular>
      </div>
      <h3 class="tp-empty-title">{{ title }}</h3>
      <p class="tp-empty-description" *ngIf="description">{{ description }}</p>
      <div class="tp-empty-action" *ngIf="actionLabel">
        <app-button 
          [label]="actionLabel" 
          [variant]="actionVariant" 
          (clicked)="handleAction()">
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .tp-empty-state {
      text-align: center;
      padding: var(--spacing-xxl) var(--spacing-lg);
      color: var(--neutral-gray);
    }

    .tp-empty-icon {
      margin-bottom: var(--spacing-md);
      color: var(--neutral-gray);
    }

    .tp-empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-gray-dark);
      margin-bottom: var(--spacing-sm);
    }

    .tp-empty-description {
      color: var(--neutral-gray);
      margin-bottom: var(--spacing-lg);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .tp-empty-action {
      margin-top: var(--spacing-lg);
    }
  `]
})
export class TpEmptyStateComponent {
  @Input() icon?: string;
  @Input() title: string = 'Nessun dato';
  @Input() description?: string;
  @Input() actionLabel?: string;
  @Input() actionVariant: 'primary' | 'secondary' = 'primary';
  @Output() onAction = new EventEmitter<void>();

  handleAction(): void {
    this.onAction.emit();
  }
}
