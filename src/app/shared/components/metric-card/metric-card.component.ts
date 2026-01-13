import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TpCardComponent } from '../../ui/tp-card/tp-card.component';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TpCardComponent],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() status?: 'good' | 'neutral' | 'warning';
  @Input() icon?: string; // lucide icon name
}
