import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tp-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="tp-badge" [class]="'tp-badge-' + variant" [class.large]="large">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .tp-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tp-badge.large {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: 0.875rem;
    }

    .tp-badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10B981;
    }

    .tp-badge-warn {
      background: rgba(245, 158, 11, 0.1);
      color: #F59E0B;
    }

    .tp-badge-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }

    .tp-badge-neutral {
      background: var(--neutral-gray-light);
      color: var(--neutral-gray-dark);
    }

    .tp-badge-primary {
      background: rgba(11, 61, 46, 0.1);
      color: var(--field-green);
    }
  `]
})
export class TpBadgeComponent {
  @Input() variant: 'success' | 'warn' | 'danger' | 'neutral' | 'primary' = 'neutral';
  @Input() large: boolean = false;
}
