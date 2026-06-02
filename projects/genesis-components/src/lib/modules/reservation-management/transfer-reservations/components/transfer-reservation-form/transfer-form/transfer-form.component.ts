import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { DxDataGridModule, DxFormComponent, DxFormModule } from 'devextreme-angular';
import { DxiColumnModule, DxoLookupModule, DxoSelectionModule, DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { CodeNamePair, TransferRouteType, Utility } from 'genesis-coreservice';
import moment from 'moment/moment';
import { TransferReservationService } from '../../../services/transfer-reservation.service';
import { GoogleLookupService } from '../../../../../../services/google-lookup.service';
import { FlightDateModel } from '../../../../flight-reservations/models/flight.models';
import { LookupService } from '../../../../../../services/lookup.service';
import { CreateReservationModel, TransferExtraModel } from '../../../models/reservation.models';

@Component({
  selector: 'transfer-form',
  templateUrl: './transfer-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxiColumnModule,
    DxoLookupModule,
    DxoSelectionModule,
    DxoToolbarModule,
    TranslocoModule],
  providers: [
    TransferReservationService,
    LookupService,
    GoogleLookupService
  ]
})
export class TransferFormComponent {
  @Input() data: CreateReservationModel;
  @Input() disabledNote: boolean = false;
  @Input() hasTotalAmountInput: boolean = false;
  @Input() transferRouteTypeOptions: any = {};
  @Input() currenciesLookUpOptions: any = {};
  @Input() extrasDataSource: TransferExtraModel[] = [];

  @Output() fromLocationChanged = new EventEmitter<any>();
  @Output() toLocationChanged = new EventEmitter<any>();
  @Output() operatorChanged = new EventEmitter<any>();
  @Output() oprVoucherChanged = new EventEmitter<string>();

  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  fromLocationLookupOptions: any;
  toLocationLookupOptions: any;
  flightLookUpOptions: any;

  oprVoucherLookUpOptions = {
    onValueChanged: this.onoprVoucherValueChanged.bind(this)
  };

  terminalDataSource: CodeNamePair[] = [];
  codeNameTemplate = Utility.codeNameTemplate;
  extraTemplate = Utility.extraTemplate;
  organizationLookUpOptions: any;

  protected readonly TransferRouteType = TransferRouteType;

  constructor(
    protected transferService: TransferReservationService,
    private readonly googleLookupService: GoogleLookupService,
    public lookupService: LookupService,
  ) {
    this.fromLocationLookupOptions = {
      ...this.googleLookupService.placeLookupService,
      onSelectionChanged: this.onFromLocationValueChanged.bind(this)
    };
    this.toLocationLookupOptions = {
      ...this.googleLookupService.placeLookupService,
      onSelectionChanged: this.onToLocationValueChanged.bind(this)
    };

    this.flightLookUpOptions = {
      ...this.lookupService.flightLookUpOptions,
      onSelectionChanged: this.onFlightRouteSelectionChanged.bind(this)
    };
    this.organizationLookUpOptions = {
      ...this.lookupService.organizationLookUpOptions,
      onValueChanged: this.onOperatorValueChanged.bind(this)
    };
  }

  onTransferDateValueChanged = (e: any) => {
    if (!this.data.flightDate) {
      const date = moment(e.value).format('YYYY-MM-DD');
      this.data.flightDate = date;
    }
  }

  onFromLocationValueChanged(e: any) {
    if (e.selectedItem?.placeId) {
      this.data.fromLocation = e.selectedItem;
      this.fromLocationChanged.emit(e.selectedItem);
    }
  }

  onToLocationValueChanged(e: any) {
    if (e.selectedItem?.placeId) {
      this.data.toLocation = e.selectedItem;
      this.toLocationChanged.emit(e.selectedItem);
    }
  }

  onOperatorValueChanged(e: any) {
    if (e.value) {
      this.data.operatorId = e.value;
      this.operatorChanged.emit(e.value);
      this.data.reservationExtras = [];
      this.transferService.GetTransferExtrasByOperatorId(e.value).then((res: TransferExtraModel[]) => {
        this.extrasDataSource = res;
      });
    }
  }

  onoprVoucherValueChanged(e: any) {
    this.data.oprVoucher = e.value;
    this.oprVoucherChanged.emit(e.value);
  }

  onDepartureDateValueChanged = (e: any) => {
    if (this.data.flightCode) {
      const date = moment(e.value).format(Utility.DefaultDateOnlyFormat);
      this.transferService.GetFlightDateByCode(this.data.flightCode, date).then((res: FlightDateModel) => {
        this.data.departureTime = res.departureTime;
        this.data.arrivalTime = res.arrivalTime;
      });
    }
  };

  onFlightRouteSelectionChanged(e: any) {
    if (e.selectedItem) {
      let airportCode = this.data.transferRouteType == TransferRouteType.Arrival ? e.selectedItem.toAirport : e.selectedItem.fromAirport;
      this.transferService.GetTerminals({ airportCode }).then((res: CodeNamePair[]) => {
        this.terminalDataSource = res;
      });
    }
  }

  public isValidated() {
    return this.form.instance.validate().isValid;
  }
}