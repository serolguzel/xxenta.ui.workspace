import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, CommandResponse, Utility } from 'genesis-coreservice';
import { FlightReservationFormComponent } from '../components/flight-reservation-form/flight-reservation-form.component';
import { ActivityTimelineComponent} from '../../../../timelines/activity/activity-timeline.component';
import { ActivityTimeLineModel } from '../../../../timelines/activity/activity.models';
import { FlightService } from '../services/flight.service';
import { CreateFlightBooking, FlightDateModel } from '../models/flight.models';
import { LookupService } from '../../../../services/lookup.service';
import { GetAuditTrails, TransferAuditTrailModel } from '../../../airport-planning/models/airport.models';
import { auditTrail } from '../../../airport-planning/models/audit-trail.mapping';

@Component({
  selector: 'app-flight-booking-detail',
  templateUrl: './flight-booking-detail.component.html',
  standalone: true,
  imports: [
    FlightReservationFormComponent,
    ActivityTimelineComponent
  ],
  providers: [
    FlightService,
    LookupService
  ]
})
export class FlightBookingDetailComponent implements OnInit {
  loadingVisible: boolean = false;
  data: CreateFlightBooking = <CreateFlightBooking>{
    guests: [],
    flights: [],
  };
  hasTotalAmountInput: boolean = false;
  auditTrails: ActivityTimeLineModel[] = [];
  itemId: string = '';
  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
  }
  async ngOnInit(): Promise<void> {
    this.itemId = this.activatedRoute.snapshot.params['id'];
    let res = await this.flightService.GetFlightBookingById(this.itemId);
    if (res) {
      this.data = {
        guests: res.guests,
        flights: [{
          id: res.id,
          arrivalTime: Utility.TimeToDateFormat(res.arrivalTime!),
          departureTime: Utility.TimeToDateFormat(res.departureTime!),
          departureDate: res.departureDate,
          oprVoucher: res.oprVoucher,
          externalProvider: res.externalProvider,
          flightCode: res.flightCode,
          operatorId: res.operatorId,
          pnrNumber: res.pnrNumber,
          routeType: res.routeType,
          saleAmount: res.saleAmount,
          voucher: res.voucher,
          fromAirport: res.fromAirport,
          toAirport: res.toAirport,
          currency: res.currency,
          purchaseAmount: res.purchaseAmount,
        }],
      }
      this.GetAuditTrails(res.id!);
    }

    var permissions = await this.authService.getPermissions();
    this.hasTotalAmountInput = permissions?.includes('Transfer.Input.TotalAmount');
  }
  GetAuditTrails(id: string) {
    this.flightService.GetAuditTrails(<GetAuditTrails>{
      entityId: id
    }).then((res: TransferAuditTrailModel[]) => {
      this.auditTrails = res.map(x => auditTrail.AuditTrailMap(x));
    });
  }
  onDepartureDateValueChanged = (e: any) => {
    const index = this.data.flights.findIndex(item => item.routeType == e.routeType);
    if (this.data.flights[index].flightCode) {
      const date = Utility.ToDateOnlyFormat(e.value);
      this.flightService.GetFlightDateByCode(this.data.flights[index].flightCode, date).then((res: FlightDateModel) => {
        this.data.flights[index].departureTime = res.departureTime;
        this.data.flights[index].arrivalTime = res.arrivalTime;
      });
    }
  }

  onSaveClick(data: CreateFlightBooking) {
    this.loadingVisible = true;
    this.flightService.UpdateFlightBooking(data.flights[0].id!, {
      ...data.flights[0],
      guests: data.guests
    }).then((response: CommandResponse<boolean>) => {
      if (response?.aggregatorId) {
        this.GetAuditTrails(this.itemId);
      }
    }).finally(() => { this.loadingVisible = false; });
  }


}
