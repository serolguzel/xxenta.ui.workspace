import { inject, Injectable } from '@angular/core';
import { CodeNamePair, CommandResponse, CoreService, TransferRouteType } from 'genesis-coreservice';
import { AirportPlanningResponse, ChangeReservationGuestStatus, GetAuditTrails, GetTransferTaskStat, TransferAuditTrailModel } from '../models/airport.models';
import { TranslocoService } from '@jsverse/transloco';
import { ReservationNoteModel } from '../../../components/transfer/transfer-plan-notes/note.models';
import { ReservationDetailModel } from '../../reservation-management';

@Injectable({
  providedIn: 'root'
})
export class AirportService extends CoreService {
  private translocoService = inject(TranslocoService);

  public GetTransferTaskStat(request: GetTransferTaskStat): Promise<AirportPlanningResponse> {
    return this.getCall('TransferTask/GetTransferTaskStat', request);
  }

  public GetAuditTrails(request: GetAuditTrails): Promise<TransferAuditTrailModel[]> {
    return this.getCall(`AuditTrail`, request);
  }

  public GetReservationByVoucher(voucher: string, request: any): Promise<ReservationDetailModel> {
    return this.getCall(`Reservation/GetReservationByVoucher/${voucher}`, request);
  }

  public TransferBookingNotes(bookingId: string): Promise<ReservationNoteModel[]> {
    return this.getCall(`Reservation/Notes/${bookingId}`);
  }

  public ChangeReservationGuestStatus(bookingId: string, request: ChangeReservationGuestStatus): Promise<CommandResponse<boolean>> {
        return this.postCall(`Reservation/Guest/ChangeStatus/${bookingId}`, request);
    }

  public transferRouteTypes: CodeNamePair[] = [
    { code: TransferRouteType.Arrival, name: this.translocoService.translate('labels.arrival') },
    { code: TransferRouteType.Departure, name: this.translocoService.translate('labels.departure') },
    { code: TransferRouteType.Intermediate, name: this.translocoService.translate('labels.intermediate') }
  ];
}
