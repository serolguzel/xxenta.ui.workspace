import { Injectable } from '@angular/core';
import { CommandResponse, CoreService } from 'genesis-coreservice';
import { GetAuditTrails, TransferAuditTrailModel } from '../../../airport-planning/models/airport.models';
import { CreateFlightBooking, FlightBookingSingleModel, FlightDateModel, RouteType, UpdateFlightBookingModel } from '../models/flight.models';
import { ReservationGuestModel } from '../../transfer-reservations/models/reservation.models';


@Injectable({
  providedIn: 'root'
})
export class FlightService extends CoreService {
  public GetReservationGuestsByVoucher(voucher: string, routeType: RouteType): Promise<ReservationGuestModel[]> {
    return this.getCall(`Reservation/Guest/${voucher}/${routeType}`);
  }
  public GetFlightDateByCode(code: string, date: string): Promise<FlightDateModel> {
    return this.getCall(`FlightRoute/GetFlightDateByCode/${code}`, { date: date });
  }

  public CreateFlightBooking(request: CreateFlightBooking): Promise<CommandResponse<boolean>> {
    return this.postCall('FlightBooking', request);
  }

  public UpdateFlightBooking(id: string, request: UpdateFlightBookingModel): Promise<CommandResponse<boolean>> {
    return this.putCall(`FlightBooking/${id}`, request);
  }

  public GetFlightBookingById(id: string): Promise<FlightBookingSingleModel> {
    return this.getCall(`FlightBooking/${id}`);
  }

  public GetAuditTrails(request: GetAuditTrails): Promise<TransferAuditTrailModel[]> {
    return this.getCall(`AuditTrail`, request);
  }
}
