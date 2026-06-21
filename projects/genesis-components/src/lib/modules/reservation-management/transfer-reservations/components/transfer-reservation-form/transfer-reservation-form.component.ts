import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation,
  QueryList,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GuestTitle, GuestType, SnackbarService, Static, TransferRouteType, Utility } from 'genesis-coreservice';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import moment from 'moment';
import { GuestListDataGridComponent } from '../../../../../components/transfer/guest-list-data-grid/guest-list-data-grid.component';
import { ReservationMapper } from '../../models/reservation.mappings';
import { CreateReservation, CreateReservationModel, ReservationGuestBaseModel, TransferExtraModel } from '../../models/reservation.models';
import { TransferReservationService } from '../../services/transfer-reservation.service';
import { TransferFormComponent } from './transfer-form/transfer-form.component';

@Component({
  selector: 'transfer-reservation-form',
  templateUrl: './transfer-reservation-form.component.html',
  exportAs: 'genTransferReservationForm',
  standalone: true,
  styleUrls: ['./transfer-reservation-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    MatDividerModule,
    ButtonModule,
    ConfirmDialogModule,
    InputNumberModule,
    SelectButtonModule,
    GuestListDataGridComponent,
    TransferFormComponent,
  ],
  providers: [TransferReservationService, ConfirmationService],
})
export class TransferReservationFormComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  protected readonly transferService = inject(TransferReservationService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly translocoService = inject(TranslocoService);
  private readonly confirmationService = inject(ConfirmationService);

  @ViewChildren(TransferFormComponent) transferForms!: QueryList<TransferFormComponent>;

  @Input() disabledNote: boolean;
  @Input() extrasDataSource: TransferExtraModel[] = [];
  @Input() data: CreateReservation = <CreateReservation><unknown>{
    guests: [],
    bookings: [
      <CreateReservationModel>{
        transferRouteType: TransferRouteType.Arrival,
      },
    ],
  };
  @Input() hasTotalAmountInput: boolean = false;
  @Input() hasSaveButton: boolean = false;
  @Input() hasCancelButton: boolean = false;
  @Input() hasDeleteButton: boolean = false;
  @Input() formDisabled: boolean = false;

  @Output() onSaveClick = new EventEmitter<CreateReservation>();
  @Output() onDeleteClick = new EventEmitter<CreateReservation>();
  @Output() onCancelClick = new EventEmitter<boolean>();

  guestTitles = Static.guestTitles;
  transferRouteType: TransferRouteType = TransferRouteType.Arrival;
  ifGuestsFormHasError: boolean = false;

  paxForm!: FormGroup;
  routeTypeOptions: { code: TransferRouteType; name: string }[] = [];

  ngOnInit(): void {
    this.routeTypeOptions = [
      { code: TransferRouteType.Arrival, name: this.translocoService.translate('labels.arrival') },
      { code: TransferRouteType.Departure, name: this.translocoService.translate('labels.departure') },
      { code: TransferRouteType.TwoWay, name: this.translocoService.translate('labels.twoway') },
      { code: TransferRouteType.Intermediate, name: this.translocoService.translate('labels.intermediate') },
    ];

    this.paxForm = this.fb.group({
      adult: [this.data.adult ?? 1, [Validators.required, Validators.min(1)]],
      child: [this.data.child ?? 0, Validators.min(0)],
      infant: [this.data.infant ?? 0, Validators.min(0)],
    });

    if (this.formDisabled) {
      this.paxForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue?.bookings?.length) {
      this.transferRouteType = changes['data'].currentValue.bookings[0].transferRouteType;
    }
  }

  checkIfValidate(): boolean {
    const now = moment(new Date(), Utility.DefaultDateOnlyFormat).year();
    const ageCheck = this.data.guests.find((x) => x.guestType != GuestType.Adult && now - moment(x.birthDate, Utility.DefaultDateOnlyFormat).year() >= 18);
    const exist = this.data.guests.find((x) => x.guestType == GuestType.Adult);
    const snackbarMessage = this.translocoService.translate('reservations.message.guests-required');

    if (this.data.guests.length < 1) {
      this.snackbarService.Warning(snackbarMessage);
      this.ifGuestsFormHasError = true;
      return false;
    }

    if (!exist) {
      this.snackbarService.Warning(snackbarMessage);
      this.ifGuestsFormHasError = true;
      return false;
    }

    if (ageCheck) {
      const guestTypeKey = `reservations.guest-types.${ageCheck.guestType.toLowerCase()}`;
      const guestTypeTranslated = this.translocoService.translate(guestTypeKey);
      const message = this.translocoService.translate('reservations.message.age-restriction', { guestType: guestTypeTranslated });
      this.snackbarService.Warning(message);
      this.ifGuestsFormHasError = true;
      return false;
    }

    this.ifGuestsFormHasError = false;
    return this.transferForms.reduce((state, form) => state && (form?.isValidated() ?? true), true);
  }

  onRouteTypeChanged(value: TransferRouteType): void {
    if (this.data.bookings.length === 2) {
      if (value === TransferRouteType.Arrival || value === TransferRouteType.Intermediate) {
        this.data.bookings.splice(1, 1);
      } else {
        this.data.bookings.splice(0, 1);
      }
      this.data.bookings[0].transferRouteType = value;
    } else if (value === TransferRouteType.TwoWay) {
      const start = this.transferRouteType === TransferRouteType.Arrival ? 1 : 0;
      this.data.bookings.splice(start, 0, <CreateReservationModel>{
        transferRouteType: this.transferRouteType === TransferRouteType.Arrival ? TransferRouteType.Departure : TransferRouteType.Arrival,
        fromLocation: this.data.bookings[0].toLocation,
        toLocation: this.data.bookings[0].fromLocation,
        transferTypeId: this.data.bookings[0].transferTypeId,
        operatorId: this.data.bookings[0].operatorId,
        oprVoucher: this.data.bookings[0].oprVoucher,
        transferDate: this.data.bookings[0].transferDate,
        reservationExtras: this.data.bookings[0].reservationExtras,
      });
      if (this.transferRouteType === TransferRouteType.Intermediate) {
        this.data.bookings[1].transferRouteType = TransferRouteType.Departure;
      }
    } else {
      this.data.bookings[0].transferRouteType = value;
    }
    this.transferRouteType = value;
  }

  onLocationChanged(newLocation: any, field: 'from' | 'to', index: number): void {
    if (this.transferRouteType === TransferRouteType.TwoWay && this.data.bookings.length === 2) {
      const otherIndex = 1 - index;
      const otherBooking = this.data.bookings[otherIndex];
      if (field === 'from') {
        otherBooking.toLocation = newLocation;
      } else if (field === 'to') {
        otherBooking.fromLocation = newLocation;
      }
    }
  }

  onOperatorChanged(newOperatorId: any, index: number): void {
    if (this.transferRouteType === TransferRouteType.TwoWay && this.data.bookings.length === 2) {
      const otherIndex = 1 - index;
      this.data.bookings[otherIndex].operatorId = newOperatorId;
    }
  }

  onoprVoucherChanged(newOprVoucher: string, index: number): void {
    if (this.transferRouteType === TransferRouteType.TwoWay && this.data.bookings.length === 2) {
      const otherIndex = 1 - index;
      this.data.bookings[otherIndex].oprVoucher = newOprVoucher;
    }
  }

  onAdultValueChanged(value: number): void {
    this.data.adult = value;
    const count = this.data.guests.filter((x) => x.guestType == GuestType.Adult);
    if (count.length == 0) return;
    if (count.length != value) {
      const leadAdult = this.data.guests.find((x) => x.guestType == GuestType.Adult && x.isLead);
      for (let i = 0; i < value - count.length; i++) {
        const element = ReservationMapper.GuestBaseModelMap(leadAdult);
        element.id = crypto.randomUUID();
        this.data.guests.push(element);
      }
    }
  }

  onChildValueChanged(value: number): void {
    this.data.child = value;
    const count = this.data.guests.filter((x) => x.guestType == GuestType.Child);
    if (count.length != value) {
      const leadAdult = this.data.guests.find((x) => x.guestType == GuestType.Adult && x.isLead);
      for (let i = 0; i < value; i++) {
        const element = ReservationMapper.GuestBaseModelMap(leadAdult);
        element.guestType = GuestType.Child;
        element.title = GuestTitle.Chd;
        element.id = crypto.randomUUID();
        this.data.guests.push(element);
      }
    }
  }

  onInfantValueChanged(value: number): void {
    this.data.infant = value;
    const count = this.data.guests.filter((x) => x.guestType == GuestType.Infant);
    if (count.length != value) {
      const leadAdult = this.data.guests.find((x) => x.guestType == GuestType.Adult && x.isLead);
      for (let i = 0; i < value; i++) {
        const element = ReservationMapper.GuestBaseModelMap(leadAdult);
        element.guestType = GuestType.Infant;
        element.title = GuestTitle.Inf;
        element.id = crypto.randomUUID();
        this.data.guests.push(element);
      }
    }
  }

  saveClick(): void {
    if (this.checkIfValidate()) {
      this.onSaveClick.emit(this.data);
    }
  }

  deleteClick(): void {
    this.confirmationService.confirm({
      header: this.translocoService.translate('generic.message.confirmation'),
      message: this.translocoService.translate('labels.delete-confirm'),
      accept: () => this.onDeleteClick.emit(this.data),
    });
  }

  cancelClick(): void {
    this.confirmationService.confirm({
      header: this.translocoService.translate('generic.message.confirmation'),
      message: this.translocoService.translate('labels.cancel-confirm'),
      accept: () => this.onCancelClick.emit(true),
    });
  }

  onRowInserted = (e: any) => {
    this.confirmationService.confirm({
      header: this.translocoService.translate('generic.message.confirmation'),
      message: this.translocoService.translate('reservations.message.update-pax'),
      accept: () => this.sumPax(),
    });
    this.makeIsLead(e.data);
  };

  onRowInserting = (e: any) => {
    this.manipulatingData(e.data);
  };

  onRowRemoving = (_e: any) => {};

  onRowRemoved = (e: any) => {
    this.confirmationService.confirm({
      header: this.translocoService.translate('generic.message.confirmation'),
      message: this.translocoService.translate('reservations.message.update-pax'),
      accept: () => this.sumPax(),
    });
    this.makeIsLead(e);
  };

  onRowUpdating = (e: any) => {
    const assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
    this.manipulatingData(e.newData);
  };

  onRowUpdated = (e: any) => {
    this.confirmationService.confirm({
      header: this.translocoService.translate('generic.message.confirmation'),
      message: this.translocoService.translate('reservations.message.update-pax'),
      accept: () => this.sumPax(),
    });
    this.makeIsLead(e.data);
  };

  sumPax(): void {
    const adult = this.data.guests.filter((x) => x.guestType == GuestType.Adult);
    const child = this.data.guests.filter((x) => x.guestType == GuestType.Child);
    const infant = this.data.guests.filter((x) => x.guestType == GuestType.Infant);
    this.data.adult = adult.length;
    this.data.child = child.length;
    this.data.infant = infant.length;
    this.paxForm.patchValue(
      { adult: adult.length, child: child.length, infant: infant.length },
      { emitEvent: false },
    );
  }

  makeIsLead(e: ReservationGuestBaseModel): void {
    if (e.isLead && e.guestType == GuestType.Adult) {
      const others = this.data.guests.filter((x) => x.id != e.id);
      others.forEach((x) => (x.isLead = false));
    } else {
      const adults = this.data.guests.filter((x) => x.guestType == GuestType.Adult);
      if (adults.length > 0) {
        const lead = adults.filter((x) => x.isLead);
        if (lead.length == 0) {
          for (let i = 0; i < this.data.guests.length; i++) {
            const element = this.data.guests[i];
            const isLead = this.data.guests.filter((x) => x.isLead);
            if (element.guestType == GuestType.Adult && isLead.length == 0) {
              element.isLead = true;
            }
          }
        }
      }
    }
  }

  manipulatingData(data: any): void {
    data.firstName = data.firstName.toUpperCase();
    data.lastName = data.lastName.toUpperCase();
    if (data.title == 'Mr' || data.title == 'Mrs' || data.title == 'Grp') {
      data.guestType = GuestType.Adult;
      data.age = data.age < 1 ? 18 : data.age;
    }
    if (data.title == 'Chd') {
      data.guestType = GuestType.Child;
    }
    if (data.title == 'Inf') {
      data.guestType = GuestType.Infant;
    }
  }
}
