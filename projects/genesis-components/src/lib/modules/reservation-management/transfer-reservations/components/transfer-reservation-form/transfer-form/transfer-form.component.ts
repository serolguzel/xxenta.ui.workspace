import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { CodeNamePair, CoreService, Response, TransferRouteType, Utility } from 'genesis-coreservice';
import moment from 'moment/moment';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { OrganizationType } from '../../../../../company-management';
import { FlightDateModel } from '../../../../flight-reservations/models/flight.models';
import { CreateReservationModel, LocationModel, TransferExtraModel } from '../../../models/reservation.models';
import { TransferReservationService } from '../../../services/transfer-reservation.service';

@Component({
  selector: 'transfer-form',
  templateUrl: './transfer-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
  ],
})
export class TransferFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coreService = inject(CoreService);
  private readonly transferService = inject(TransferReservationService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() data: CreateReservationModel;
  @Input() disabledNote: boolean = false;
  @Input() hasTotalAmountInput: boolean = false;
  @Input() extrasDataSource: TransferExtraModel[] = [];

  @Output() fromLocationChanged = new EventEmitter<any>();
  @Output() toLocationChanged = new EventEmitter<any>();
  @Output() operatorChanged = new EventEmitter<any>();
  @Output() oprVoucherChanged = new EventEmitter<string>();

  form!: FormGroup;

  fromLocationDataSource: LocationModel[] = [];
  toLocationDataSource: LocationModel[] = [];
  transferTypeDataSource: any[] = [];
  operatorDataSource: any[] = [];
  flightDataSource: any[] = [];
  terminalDataSource: CodeNamePair[] = [];

  protected readonly TransferRouteType = TransferRouteType;

  ngOnInit(): void {
    this.form = this.fb.group({
      fromLocation: [this.data.fromLocation ?? null, Validators.required],
      toLocation: [this.data.toLocation ?? null, Validators.required],
      transferTypeId: [this.data.transferTypeId ?? null, Validators.required],
      transferDate: [this.toDate(this.data.transferDate), Validators.required],
      pickupTime: [this.toTime(this.data.pickupTime)],
      operatorId: [this.data.operatorId ?? null, Validators.required],
      oprVoucher: [this.data.oprVoucher ?? null],
      subVoucher: [this.data.subVoucher ?? null],
      reservationExtras: [this.data.reservationExtras ?? null],
      note: [this.data.note ?? null],
      flightCode: [this.data.flightCode ?? null],
      terminalCode: [this.data.terminalCode ?? null],
      flightDate: [this.toDate(this.data.flightDate)],
      departureTime: [this.toTime(this.data.departureTime)],
      arrivalTime: [this.toTime(this.data.arrivalTime)],
    });

    this.loadTransferTypes();
    this.loadOperators();
    this.loadFlights();

    if (this.data.fromLocation) {
      this.fromLocationDataSource = [this.data.fromLocation];
    }
    if (this.data.toLocation) {
      this.toLocationDataSource = [this.data.toLocation];
    }
  }

  private toDate(value: string | null | undefined): Date | null {
    return value ? moment(value).toDate() : null;
  }

  private toTime(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }
    const parsed = moment(value, ['HH:mm', 'HH:mm:ss', moment.ISO_8601]);
    return parsed.isValid() ? parsed.toDate() : null;
  }

  private loadTransferTypes(): void {
    this.coreService.getCall('TransferType/GetTransferTypesLookup').then((res: any) => {
      this.transferTypeDataSource = Array.isArray(res) ? res : (res?.data ?? []);
      this.cdr.detectChanges();
    });
  }

  private loadOperators(): void {
    this.coreService
      .getCall('OrganizationPartner/GetPartnersLookup', {
        requireTotalCount: false,
        organizationTypes: JSON.stringify([OrganizationType.Agency, OrganizationType.Operator]),
      })
      .then((res: any) => {
        this.operatorDataSource = Array.isArray(res) ? res : (res?.data ?? []);
        this.cdr.detectChanges();
      });
  }

  private loadFlights(): void {
    this.coreService.getCall('FlightRoute/GetFlightsLookup').then((res: any) => {
      this.flightDataSource = Array.isArray(res) ? res : (res?.data ?? []);
      this.cdr.detectChanges();
    });
  }

  onLocationFilter(event: { filter: string }, field: 'from' | 'to'): void {
    const searchText = event?.filter ?? '';
    if (searchText.length < 3) {
      return;
    }
    this.coreService.getCall('Location', { searchText }).then((response: Response<LocationModel[]>) => {
      const data = response?.data ?? [];
      if (field === 'from') {
        this.fromLocationDataSource = data;
      } else {
        this.toLocationDataSource = data;
      }
      this.cdr.detectChanges();
    });
  }

  onFromLocationChange(event: { value: LocationModel }): void {
    const location = event.value;
    this.data.fromLocation = location;
    if (location?.placeId) {
      this.fromLocationChanged.emit(location);
    }
  }

  onToLocationChange(event: { value: LocationModel }): void {
    const location = event.value;
    this.data.toLocation = location;
    if (location?.placeId) {
      this.toLocationChanged.emit(location);
    }
  }

  onTransferDateChange(value: Date): void {
    this.data.transferDate = value ? moment(value).format('YYYY-MM-DD') : null;
    if (!this.data.flightDate && value) {
      this.data.flightDate = moment(value).format('YYYY-MM-DD');
      this.form.patchValue({ flightDate: value });
    }
  }

  onOperatorChange(event: { value: string }): void {
    const operatorId = event.value;
    this.data.operatorId = operatorId;
    if (operatorId) {
      this.operatorChanged.emit(operatorId);
      this.data.reservationExtras = [];
      this.form.patchValue({ reservationExtras: [] });
      this.transferService.GetTransferExtrasByOperatorId(operatorId).then((res: TransferExtraModel[]) => {
        this.extrasDataSource = res;
        this.cdr.detectChanges();
      });
    }
  }

  onOprVoucherChange(value: string): void {
    this.data.oprVoucher = value;
    this.oprVoucherChanged.emit(value);
  }

  onFlightChange(event: { value: string }): void {
    this.data.flightCode = event.value;
    const selected = this.flightDataSource.find((f) => f.code === event.value);
    if (selected) {
      const airportCode =
        this.data.transferRouteType == TransferRouteType.Arrival ? selected.toAirport : selected.fromAirport;
      this.transferService.GetTerminals({ airportCode }).then((res: CodeNamePair[]) => {
        this.terminalDataSource = res;
        this.cdr.detectChanges();
      });
    }
  }

  onFlightDateChange(value: Date): void {
    this.data.flightDate = value ? moment(value).format(Utility.DefaultDateOnlyFormat) : null;
    if (this.data.flightCode && value) {
      const date = moment(value).format(Utility.DefaultDateOnlyFormat);
      this.transferService.GetFlightDateByCode(this.data.flightCode, date).then((res: FlightDateModel) => {
        this.data.departureTime = res.departureTime;
        this.data.arrivalTime = res.arrivalTime;
        this.form.patchValue({
          departureTime: this.toTime(res.departureTime),
          arrivalTime: this.toTime(res.arrivalTime),
        });
        this.cdr.detectChanges();
      });
    }
  }

  public isValidated(): boolean {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.syncToData();
    }
    return this.form.valid;
  }

  private syncToData(): void {
    const value = this.form.getRawValue();
    this.data.fromLocation = value.fromLocation;
    this.data.toLocation = value.toLocation;
    this.data.transferTypeId = value.transferTypeId;
    this.data.transferDate = value.transferDate ? moment(value.transferDate).format('YYYY-MM-DD') : null;
    this.data.pickupTime = value.pickupTime ? moment(value.pickupTime).format('HH:mm') : null;
    this.data.operatorId = value.operatorId;
    this.data.oprVoucher = value.oprVoucher;
    this.data.subVoucher = value.subVoucher;
    this.data.reservationExtras = value.reservationExtras;
    this.data.note = value.note;
    this.data.flightCode = value.flightCode;
    this.data.terminalCode = value.terminalCode;
    this.data.flightDate = value.flightDate ? moment(value.flightDate).format('YYYY-MM-DD') : null;
    this.data.departureTime = value.departureTime ? moment(value.departureTime).format('HH:mm') : null;
    this.data.arrivalTime = value.arrivalTime ? moment(value.arrivalTime).format('HH:mm') : null;
  }
}
