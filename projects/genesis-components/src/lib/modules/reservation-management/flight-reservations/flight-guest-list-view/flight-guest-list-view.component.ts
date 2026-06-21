import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';
import { ReservationGuestModel } from '../../transfer-reservations/models/reservation.models';

@Component({
  selector: 'flight-guest-list-view',
  templateUrl: './flight-guest-list-view.component.html',
  standalone: true,
  imports: [
    TableModule,
    TranslocoModule,
  ]
})
export class FlightGuestListViewComponent {
  @Input() guests: ReservationGuestModel[] = [];
}
