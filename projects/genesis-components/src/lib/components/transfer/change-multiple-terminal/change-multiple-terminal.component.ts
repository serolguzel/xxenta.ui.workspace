import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DxFormComponent, DxFormModule, DxPopupModule, DxToolbarModule } from 'devextreme-angular';
import { CodeNamePair, CommandResponse, CoreService, TransferRouteType, Utility } from 'genesis-coreservice';
import moment from 'moment';
import { ChangeMultipleTerminalModel } from '../../../modules/reservation-management/transfer-reservations/models/transfer-res.models';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'change-multiple-terminal',
  templateUrl: './change-multiple-terminal.component.html',
  standalone: true,
  imports: [
    DxPopupModule,
    DxFormModule,
    DxToolbarModule,
    TranslocoModule
  ]
})
export class ChangeMultipleTerminalComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Input() visible: boolean = false;
  @Input() transferRouteType: TransferRouteType = TransferRouteType.Arrival;
  @Output() onCancelClick: EventEmitter<boolean>;
  @Output() onProcessClick: EventEmitter<boolean>;

  flightLookUpOptions: any;
  transferRouteTypeOptions: any;
  codeNameTemplate = Utility.codeNameTemplate;
  terminalDataSource: CodeNamePair[] = [];
  model: ChangeMultipleTerminalModel = <ChangeMultipleTerminalModel>{};
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: 'default',
    onClick: this.save.bind(this),
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.onHidden.bind(this)
  };

  constructor(
    private lookupService: LookupService,
    private coreService: CoreService,
    private translocoService: TranslocoService
  ) {
    this.onCancelClick = new EventEmitter<boolean>();
    this.onProcessClick = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.model.routeType = this.transferRouteType;
    this.flightLookUpOptions = {
      ...this.lookupService.flightLookUpOptions,
      onSelectionChanged: this.onFlightRouteSelectionChanged.bind(this)
    };
    this.transferRouteTypeOptions = {
      placeholder: this.translocoService.translate('labels.select-direction'),
      dataSource: this.transferRouteTypes,
      displayExpr: 'name',
      valueExpr: 'code',
      showClearButton: true
    };
  }

  onHidden() {
    this.onCancelClick.emit(false);
  }
  public setRouteType(data: ChangeMultipleTerminalModel) {
    this.model = data;
  }
  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.model.transferDate = moment(this.model.transferDate).format('YYYY-MM-DD');
      this.ChangeMultipleTerminalOfFlight(this.model).then(() => {
        this.onProcessClick.emit(false);
      });
    }
  }

  onFlightRouteSelectionChanged(e: any) {
    if (e.selectedItem) {
      let airportCode = this.model.routeType == undefined || this.model.routeType == TransferRouteType.Arrival ? e.selectedItem.toAirport : e.selectedItem.fromAirport;
      this.GetTerminals({ airportCode }).then((res: CodeNamePair[]) => {
        this.terminalDataSource = res;
      });
    }
  }

  public ChangeMultipleTerminalOfFlight(request: ChangeMultipleTerminalModel): Promise<CommandResponse<boolean>> {
    return this.coreService.postCall('TransferReservationFlight/ChangeMultipleTerminalOfFlight', request);
  }

  public GetTerminals(request?: { airportCode?: string }): Promise<CodeNamePair[]> {
    return this.coreService.getCall(`Terminal`, request);
  }

  get transferRouteTypes(): CodeNamePair[] {
    return [
      { code: TransferRouteType.Arrival, name: this.translocoService.translate('labels.arrival') },
      { code: TransferRouteType.Departure, name: this.translocoService.translate('labels.departure') },
      { code: TransferRouteType.Intermediate, name: this.translocoService.translate('labels.intermediate') }
    ];
  }
}
