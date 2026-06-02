import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TaxWidgetModel } from './tax-widget.model';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'tax-widget',
  templateUrl: './tax-widget.component.html',
  standalone: true,
  imports: [
    NgClass,
    MatMenuModule,
    MatIconModule,
    DatePipe
  ]
})
export class TaxWidgetComponent {
  @Input() title: string = '';
  @Input() data: TaxWidgetModel = <TaxWidgetModel>{};
  @Input() fontColorCss: string = 'text-blue-600 dark:text-blue-500';
  @Input() dateRangeLabel: string = 'Date Range';
}