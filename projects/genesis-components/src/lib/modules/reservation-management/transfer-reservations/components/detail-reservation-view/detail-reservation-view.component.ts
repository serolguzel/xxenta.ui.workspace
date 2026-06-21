import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CodeNamePair, Response } from 'genesis-coreservice';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TransferReservationService } from '../../services/transfer-reservation.service';
import { FlightGuestListViewComponent } from '../../../flight-reservations/flight-guest-list-view/flight-guest-list-view.component';
import { ReservationGuestModel, ReservationModel } from '../../models/reservation.models';

@Component({
  selector: 'detail-reservation-view',
  templateUrl: './detail-reservation-view.component.html',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    TranslocoModule,
    TabsModule,
    TableModule,
    FlightGuestListViewComponent
  ],
  providers: [
    TransferReservationService
  ]
})
export class DetailReservationViewComponent implements OnInit {
  private readonly transferService = inject(TransferReservationService);
  private readonly cdr = inject(ChangeDetectorRef);

  guests: ReservationGuestModel[] = [];
  @Input() key: string;
  @Input() rowData: any = {};
  referenceData: Response<ReservationModel> = <Response<ReservationModel>>{};
  transfers: ReservationModel[] = [];
  transferRouteTypes: CodeNamePair[] = this.transferService.transferRouteTypes;

  ngOnInit(): void {
    this.transferService.GetReservationGuestsByReservationId(this.key).then((res: ReservationGuestModel[]) => {
      this.guests = res;
      this.cdr.detectChanges();
    });

    this.transferService.GetReservationByReferenceId(this.key).then((res: Response<ReservationModel>) => {
      this.referenceData = res;
      if (!res.hasError) {
        this.transfers.push(res.data);
      }
      this.cdr.detectChanges();
    });
  }

  routeTypeName(code: any): string {
    return this.transferRouteTypes.find(t => t.code === code)?.name ?? code;
  }
}
