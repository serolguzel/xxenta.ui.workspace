import { Component, Input } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { ReservationGuestModel } from '../../transfer-reservations/models/reservation.models';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'flight-guest-list-view',
  templateUrl: './flight-guest-list-view.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxTemplateModule,
    TranslocoModule
  ]
})
export class FlightGuestListViewComponent {
  @Input() guests: ReservationGuestModel[] = [];
}
