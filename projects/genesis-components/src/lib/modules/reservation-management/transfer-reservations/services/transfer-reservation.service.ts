import { inject, Injectable } from '@angular/core';
import { CodeNamePair, CommandResponse, CoreService, TransferRouteType, Response, UserLookupModel } from 'genesis-coreservice';
import { CancelReservation, CancelReservationResponse, GetTransferPlanByReservationResponse, ReservationExcelExport } from '../models/transfer-res.models';
import { FlightDateModel } from '../../flight-reservations/models/flight.models';
import { TranslocoService } from '@jsverse/transloco';
import { GetAuditTrails, TransferAuditTrailModel } from '../../../airport-planning/models/airport.models';
import { CreateReservation, ReservationGuestModel, ReservationModel, TransferExtraModel, UpdateReservation } from '../models/reservation.models';

@Injectable({
  providedIn: 'root'
})
export class TransferReservationService extends CoreService {
  private translocoService = inject(TranslocoService);

  public GetTransferExtrasByOperatorId(operatorId: string): Promise<TransferExtraModel[]> {
    return this.getCall(`TransferExtras/${operatorId}`);
  }

  public GetFlightDateByCode(code: string, date: string): Promise<FlightDateModel> {
    return this.getCall(`FlightRoute/GetFlightDateByCode/${code}`, { date: date });
  }

  public GetTerminals(request?: { airportCode?: string }): Promise<CodeNamePair[]> {
    return this.getCall(`Terminal`, request);
  }
  /* Reservation */
  public CreateReservation(request: CreateReservation): Promise<CommandResponse<string>> {
    return this.postCall('Reservation', request);
  }

  public UpdateReservation(id: string, request: UpdateReservation): Promise<CommandResponse<string>> {
    return this.putCall(`Reservation/${id}`, request);
  }

  public GetReservationById(id: string): Promise<ReservationModel> {
    return this.getCall(`Reservation/${id}`);
  }

  public GetReservationGuestsByReservationId(transferBookingId: string): Promise<ReservationGuestModel[]> {
    return this.getCall(`Reservation/Guest/${transferBookingId}`);
  }

  public GetReservationByReferenceId(referenceId: string): Promise<Response<ReservationModel>> {
    return this.getCall(`Reservation/Reference/${referenceId}`);
  }

  public TrashReservation(transferBookingId: string): Promise<CommandResponse<string>> {
    return this.deleteCall(`Reservation/${transferBookingId}`);
  }
  public CancelReservation(transferBookingId: string, request: CancelReservation): Promise<CancelReservationResponse> {
    return this.postCall(`Reservation/Cancel/${transferBookingId}`, request);
  }

  public GetTransferPlanByReservationId(reservationId: string): Promise<GetTransferPlanByReservationResponse> {
    return this.getCall(`TransferPlan/GetTransferPlanByReservationId/${reservationId}`);
  }
  /* Reservation */


  public ReservationExcelExport(request: ReservationExcelExport): Promise<any> {
    return this.getFileCall('FileExport/ReservationExcelExport', request);
  }

  public GetAuditTrails(request: GetAuditTrails): Promise<TransferAuditTrailModel[]> {
    return this.getCall(`AuditTrail`, request);
  }

  public GetUserLookupById(userId: string): Promise<UserLookupModel> {
    return this.getCall(`User/GetUserLookupById/${userId}`);
  }

  public actionMenuItems = [
    { value: 1, name: 'Detay', icon: 'assets/icons/transfer-plan_32.png' },
    { value: 2, name: 'Uçuş Ekle', icon: 'assets/icons/flight_64.png' },
  ];

  public transferRouteTypes: CodeNamePair[] = [
    { code: TransferRouteType.Arrival, name: this.translocoService.translate('labels.arrival') },
    { code: TransferRouteType.Departure, name: this.translocoService.translate('labels.departure') },
    { code: TransferRouteType.Intermediate, name: this.translocoService.translate('labels.intermediate') }
  ];

}
