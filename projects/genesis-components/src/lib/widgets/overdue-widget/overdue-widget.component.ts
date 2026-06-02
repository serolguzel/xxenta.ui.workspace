import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SummaryWidgetModel } from './summary-widget.model';

@Component({
  selector: 'overdue-widget',
  templateUrl: './overdue-widget.component.html',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule
  ]
})
export class OverdueWidgetComponent {
  @Input() title: string = '';
  @Input() data: SummaryWidgetModel = <SummaryWidgetModel>{};
}