import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxDataGridModule, DxTabPanelModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Response } from 'genesis-coreservice';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { TransferReservationService } from '../../services/transfer-reservation.service';
import { FlightGuestListViewComponent } from '../../../flight-reservations/flight-guest-list-view/flight-guest-list-view.component';
import { ReservationGuestModel, ReservationModel } from '../../models/reservation.models';
import { DataSourceBuilder } from '../../../../../services/data-source-builder';

@Component({
  selector: 'detail-reservation-view',
  templateUrl: './detail-reservation-view.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatIconModule,
    TranslocoModule,
    DxTabPanelModule,
    DxTemplateModule,
    DxDataGridModule,
    FlightGuestListViewComponent
  ],
  providers: [
    TransferReservationService
  ]
})
export class DetailReservationViewComponent implements OnInit {
  guests: ReservationGuestModel[] = [];
  @Input() key: string;
  @Input() rowData: any = {};
  referenceData: Response<ReservationModel> = <Response<ReservationModel>>{};
  transfers: ReservationModel[] = [];
  transferRouteTypes: any;
  vehicleTypesDataSource: CustomStore;

  constructor(private readonly transferService: TransferReservationService) {
    this.transferRouteTypes = this.transferService.transferRouteTypes;
   }

  ngOnInit(): void {
    this.transferService.GetReservationGuestsByReservationId(this.key).then((res: ReservationGuestModel[]) => {
      this.guests = res;
    });

    this.transferService.GetReservationByReferenceId(this.key).then((res: Response<ReservationModel>) => {
      this.referenceData = res;
      if (!res.hasError) {
        this.transfers.push(res.data);
      }
    });

    this.vehicleTypesDataSource = new DataSourceBuilder(this.transferService)
      .load('VehicleType/GetVehicleTypesLookup')
      .byKey('VehicleType/GetVehicleTypesLookup')
      .setKey('code')
      .build();
  }
}
