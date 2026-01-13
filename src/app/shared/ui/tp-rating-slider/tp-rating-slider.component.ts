import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tp-rating-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tp-rating-slider">
      <label class="tp-rating-label" *ngIf="label">{{ label }}</label>
      <div class="tp-rating-container">
        <div class="tp-rating-pills">
          <button
            *ngFor="let num of numbers"
            type="button"
            class="tp-rating-pill"
            [class.active]="value === num"
            [class.highlight]="num >= 7"
            (click)="setValue(num)">
            {{ num }}
          </button>
        </div>
        <div class="tp-rating-value" *ngIf="showValue">
          <span class="value-number">{{ value }}</span>
          <span class="value-label" *ngIf="valueLabel">{{ valueLabel }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tp-rating-slider {
      margin-bottom: var(--spacing-md);
    }

    .tp-rating-label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 500;
      color: var(--neutral-gray-dark);
      font-size: 0.875rem;
    }

    .tp-rating-container {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .tp-rating-pills {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
    }

    .tp-rating-pill {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      border: 2px solid var(--neutral-gray-light);
      background: var(--white);
      color: var(--neutral-gray-dark);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tp-rating-pill:hover {
      border-color: var(--field-green);
      background: rgba(11, 61, 46, 0.05);
    }

    .tp-rating-pill.active {
      background: var(--field-green);
      border-color: var(--field-green);
      color: var(--white);
    }

    .tp-rating-pill.highlight.active {
      background: var(--tennis-ball);
      border-color: var(--tennis-ball);
      color: var(--field-green);
    }

    .tp-rating-value {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-xs);
    }

    .value-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--field-green);
    }

    .value-label {
      font-size: 0.875rem;
      color: var(--neutral-gray);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TpRatingSliderComponent),
      multi: true
    }
  ]
})
export class TpRatingSliderComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() min: number = 1;
  @Input() max: number = 10;
  @Input() showValue: boolean = true;
  @Input() valueLabel?: string;
  @Output() valueChange = new EventEmitter<number>();

  value: number = 5;
  numbers: number[] = [];

  ngOnInit() {
    this.numbers = Array.from({ length: this.max - this.min + 1 }, (_, i) => i + this.min);
  }

  setValue(num: number): void {
    this.value = num;
    this.onChange(num);
    this.valueChange.emit(num);
  }

  // ControlValueAccessor
  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this.value = value || this.min;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
