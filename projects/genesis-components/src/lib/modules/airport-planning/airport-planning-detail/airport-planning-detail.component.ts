import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { AirportPlanningModel } from '../models/airport.models';

@Component({
  selector: 'airport-planning-detail',
  templateUrl: './airport-planning-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxTemplateModule,
    DxDataGridModule,
    TranslocoModule
  ]
})
export class AirportPlanningDetailComponent {
  @Input() key: string;
  @Input() data: AirportPlanningModel[] = [];
}
