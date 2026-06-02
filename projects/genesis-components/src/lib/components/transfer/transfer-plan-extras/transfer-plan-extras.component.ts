import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { DxDataGridModule } from 'devextreme-angular';
import { ReservationExtraModel } from '../../../modules/reservation-management';

@Component({
  selector: 'app-transfer-plan-extras',
  templateUrl: './transfer-plan-extras.component.html',
  standalone: true,
  imports: [MatIconModule, TranslocoModule, DxDataGridModule, CommonModule],
})
export class TransferPlanExtrasComponent {
  @Input({ required: true }) extras: ReservationExtraModel[] = [];
}
