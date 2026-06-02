import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  DxCheckBoxModule,
  DxDataGridModule,
  DxFormComponent,
  DxFormModule,
  DxListModule,
  DxRadioGroupModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';

import { GuestTitle, GuestType, SnackbarService, Static, TransferRouteType, Utility } from 'genesis-coreservice';
import { TransferFormComponent } from './transfer-form/transfer-form.component';
import { TransferReservationService } from '../../services/transfer-reservation.service';
import { GuestListDataGridComponent } from '../../../../../components/transfer/guest-list-data-grid/guest-list-data-grid.component';
import { CreateReservation, CreateReservationModel, ReservationGuestBaseModel, TransferExtraModel } from '../../models/reservation.models';
import moment from 'moment';
import { ReservationMapper } from '../../models/reservation.mappings';


@Component({
  selector: 'transfer-reservation-form',
  templateUrl: './transfer-reservation-form.component.html',
  exportAs: 'genTransferReservationForm',
  standalone: true,
  styleUrls: ['./transfer-reservation-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxToolbarModule,
    DxTemplateModule,
    DxRadioGroupModule,
    DxCheckBoxModule,
    DxListModule,
    GuestListDataGridComponent,
    DxSelectBoxModule,
    TranslocoModule,
    MatDividerModule,
    TransferFormComponent,
  ],
  providers: [TransferReservationService],
})
export class TransferReservationFormComponent implements OnInit, OnChanges {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @ViewChildren(TransferFormComponent) transferForms: TransferFormComponent[];
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

  @Output() onSaveClick: EventEmitter<CreateReservation>;
  @Output() onDeleteClick: EventEmitter<CreateReservation>;
  @Output() onCancelClick: EventEmitter<boolean>;

  guestTitles = Static.guestTitles;

  transferRouteType: TransferRouteType = TransferRouteType.Arrival;
  ifGuestsFormHasError: boolean = false;

  btnSave: any;
  btnTransferCancel: any;
  btnDelete: any;
  transferRouteTypeOptions: any;

  constructor(
    protected transferService: TransferReservationService,
    private readonly snackbarService: SnackbarService,
    private readonly translocoService: TranslocoService,
  ) {
    this.onSaveClick = new EventEmitter();
    this.onDeleteClick = new EventEmitter();
    this.onCancelClick = new EventEmitter();
    this.btnSave = {
      icon: 'save',
      text: this.translocoService.translate('labels.save'),
      type: 'default',
      onClick: this.saveClick.bind(this),
    };
    this.btnTransferCancel = {
      icon: 'clear',
      text: this.translocoService.translate('labels.cancel'),
      onClick: this.cancelClick.bind(this),
    };
    this.btnDelete = {
      icon: 'trash',
      text: this.translocoService.translate('labels.delete'),
      type: 'danger',
      onClick: this.deleteClick.bind(this),
    };
    this.transferRouteTypeOptions = {
      dataSource: [
        { code: TransferRouteType.Arrival, name: this.translocoService.translate('labels.arrival') },
        { code: TransferRouteType.Departure, name: this.translocoService.translate('labels.departure') },
        { code: TransferRouteType.TwoWay, name: this.translocoService.translate('labels.twoway') },
        { code: TransferRouteType.Intermediate, name: this.translocoService.translate('labels.intermediate') },
      ],
      valueExpr: 'code',
      layout: 'horizontal',
    };
  }

  async ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']?.currentValue.bookings.length) {
      this.transferRouteType =
        changes['data'].currentValue.bookings[0].transferRouteType;
    }
  }

  checkIfValidate() {
    var now = moment(new Date(), Utility.DefaultDateOnlyFormat).year()
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

  getTransferRouteTypeLabel(code: TransferRouteType) {
    return this.translocoService.translate(`labels.${code.toLowerCase()}`);
  }

  onRouteTypeChanged(e: any) {
    if (this.data.bookings.length === 2) {
      if (e.value === TransferRouteType.Arrival || e.value === TransferRouteType.Intermediate) {
        this.data.bookings.splice(1, 1);
      } else {
        this.data.bookings.splice(0, 1);
      }
      this.data.bookings[0].transferRouteType = e.value;
    } else if (e.value === TransferRouteType.TwoWay) {
      var start = this.transferRouteType === TransferRouteType.Arrival ? 1 : 0;
      this.data.bookings.splice(start, 0, <CreateReservationModel>{
        transferRouteType: this.transferRouteType === TransferRouteType.Arrival ? TransferRouteType.Departure : TransferRouteType.Arrival,
        fromLocation: this.data.bookings[0].toLocation,
        toLocation: this.data.bookings[0].fromLocation,
        transferTypeId: this.data.bookings[0].transferTypeId,
        operatorId: this.data.bookings[0].operatorId,
        oprVoucher: this.data.bookings[0].oprVoucher,
        transferDate: this.data.bookings[0].transferDate,
        reservationExtras: this.data.bookings[0].reservationExtras
      });
      if (this.transferRouteType === TransferRouteType.Intermediate) {
        this.data.bookings[1].transferRouteType = TransferRouteType.Departure;
      }
    } else {
      this.data.bookings[0].transferRouteType = e.value;
    }
    this.transferRouteType = e.value;
  }

  onLocationChanged(newLocation: any, field: 'from' | 'to', index: number) {
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

  onOperatorChanged(newOperatorId: any, index: number) {
    if (this.transferRouteType === TransferRouteType.TwoWay && this.data.bookings.length === 2) {
      const otherIndex = 1 - index;
      this.data.bookings[otherIndex].operatorId = newOperatorId;
    }
  }

  onoprVoucherChanged(newOprVoucher: string, index: number) {
    if (this.transferRouteType === TransferRouteType.TwoWay && this.data.bookings.length === 2) {
      const otherIndex = 1 - index;
      this.data.bookings[otherIndex].oprVoucher = newOprVoucher;
    }
  }

  onAdultValueChanged = (e: any) => {
    var count = this.data.guests.filter(x => x.guestType == GuestType.Adult);
    if (count.length == 0)
      return;
    if (count.length != e.value) {
      var leadAdult = this.data.guests.find(x => x.guestType == GuestType.Adult && x.isLead);
      for (let i = 0; i < e.value - count.length; i++) {
        const element = ReservationMapper.GuestBaseModelMap(leadAdult);
        element.id = crypto.randomUUID();
        this.data.guests.push(element);
      }
    }
  }

  onChildValueChanged = (e: any) => {
    var count = this.data.guests.filter(x => x.guestType == GuestType.Child);
    if (count.length != e.value) {
      var leadAdult = this.data.guests.find(x => x.guestType == GuestType.Adult && x.isLead);
      for (let i = 0; i < e.value; i++) {
        const element = ReservationMapper.GuestBaseModelMap(leadAdult);
        element.guestType = GuestType.Child;
        element.title = GuestTitle.Chd;
        element.id = crypto.randomUUID();
        this.data.guests.push(element);
      }
    }
  }

  onInfantValueChanged = (e: any) => {
    var count = this.data.guests.filter(x => x.guestType == GuestType.Infant);
    if (count.length != e.value) {
      var leadAdult = this.data.guests.find(x => x.guestType == GuestType.Adult && x.isLead);
      for (let i = 0; i < e.value; i++) {
        const element = ReservationMapper.GuestBaseModelMap(leadAdult);
        element.guestType = GuestType.Infant;
        element.title = GuestTitle.Inf;
        element.id = crypto.randomUUID();
        this.data.guests.push(element);
      }
    }
  }

  saveClick() {
    if (this.checkIfValidate()) {
      this.onSaveClick.emit(this.data);
    }
  }

  deleteClick() {
    const confirmPopup = confirm(this.translocoService.translate('labels.delete-confirm'), this.translocoService.translate('generic.message.confirmation'));
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onDeleteClick.emit(this.data);
      }
    });
  }

  cancelClick() {
    const confirmPopup = confirm(
      this.translocoService.translate('labels.cancel-confirm'),
      this.translocoService.translate('generic.message.confirmation'),
    );
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onCancelClick.emit(true);
      }
    });
  }

  onRowInserted = (e: any) => {
    const confirmPopup = confirm(
      this.translocoService.translate('reservations.message.update-pax'),
      this.translocoService.translate('generic.message.confirmation'),
    );
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.sumPax();
      }
    });
    this.makeIsLead(e.data);
  };

  onRowInserting = (e: any) => {
    this.manipulatingData(e.data);
  };

  onRowRemoving = (e: any) => {
  };

  onRowRemoved = (e: any) => {
    const confirmPopup = confirm(this.translocoService.translate('reservations.message.update-pax'), this.translocoService.translate('generic.message.confirmation'));
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.sumPax();
      }
    });
    this.makeIsLead(e);
  };

  onRowUpdating = (e: any) => {
    const assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
    this.manipulatingData(e.newData);
  };

  onRowUpdated = (e: any) => {
    const confirmPopup = confirm(this.translocoService.translate('reservations.message.update-pax'), this.translocoService.translate('generic.message.confirmation'));
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.sumPax();
      }
    });
    this.makeIsLead(e.data);
  };

  sumPax() {
    const adult = this.data.guests.filter((x) => x.guestType == GuestType.Adult);
    const child = this.data.guests.filter((x) => x.guestType == GuestType.Child);
    const infant = this.data.guests.filter((x) => x.guestType == GuestType.Infant);
    this.data.adult = adult.length;
    this.data.child = child.length;
    this.data.infant = infant.length;
  }

  makeIsLead(e: ReservationGuestBaseModel) {
    if (e.isLead && e.guestType == GuestType.Adult) {
      var others = this.data.guests.filter(x => x.id != e.id);
      others.forEach(x => x.isLead = false);
    } else {
      var adults = this.data.guests.filter((x) => x.guestType == GuestType.Adult);
      if (adults.length > 0) {
        var lead = adults.filter(x => x.isLead);
        if (lead.length == 0) {
          for (let i = 0; i < this.data.guests.length; i++) {
            const element = this.data.guests[i];
            var isLead = this.data.guests.filter(x => x.isLead);
            if (element.guestType == GuestType.Adult && isLead.length == 0) {
              element.isLead = true;
            }
          }
        }
      }
    }
  }
  manipulatingData(data: any) {
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