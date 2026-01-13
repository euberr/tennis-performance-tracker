import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tp-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tp-card" [class.clickable]="clickable" (click)="handleClick()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .tp-card {
      background: var(--white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-normal);
    }

    .tp-card.clickable {
      cursor: pointer;
    }

    .tp-card.clickable:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
  `]
})
export class TpCardComponent {
  @Input() clickable: boolean = false;
  @Input() onClick?: () => void;

  handleClick(): void {
    if (this.clickable && this.onClick) {
      this.onClick();
    }
  }
}
