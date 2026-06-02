import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridModule, DxDateBoxModule, DxFormComponent, DxFormModule, DxNumberBoxModule, DxRadioGroupModule, DxSelectBoxModule, DxToolbarModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CodeNamePair, CoreService, Utility } from 'genesis-coreservice';
import { GenesisAlertComponent } from 'genesis-shell';
import { CreateFlights, Direction } from './flight-route-model';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../services/data-source-builder';

@Component({
  selector: 'flight-route-form',
  standalone: true,
  imports: [
    GenesisAlertComponent,
    DxFormModule,
    DxToolbarModule,
    DxNumberBoxModule,
    DxRadioGroupModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    TranslocoModule
  ],
  templateUrl: './flight-route-form.component.html'
})
export class FlightRouteFormComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Input() data: CreateFlights = <CreateFlights>{
    direction: Direction.Arrival,
    toAirport: 'AYT',
  };
  airlineDataSource: CustomStore;
  airportDataSource: CustomStore;
  terminalDataSource: CodeNamePair[] = [];
  getDisplayExprCode = Utility.getDisplayExprCode;
  codeNameTemplate = Utility.codeNameTemplate;
  idNameTemplate = Utility.idNameTemplate;
  getDisplayExprId = Utility.getDisplayExprId;
  @Output() onSaveClick: EventEmitter<CreateFlights>;
  @Output() onCancelClick: EventEmitter<CreateFlights>;
  isSelected: boolean = false;
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.save.bind(this)
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };

  constructor(
    private coreService: CoreService
  ) {
    this.onSaveClick = new EventEmitter();
    this.onCancelClick = new EventEmitter();
  }

  async ngOnInit(): Promise<void> {
    this.airlineDataSource = new DataSourceBuilder(this.coreService)
      .load('Airline/GetAirlinesLookup', { requireTotalCount: true })
      .byKey('Airline/GetAirlinesLookup')
      .setKey("code")
      .build();

    this.airportDataSource = new DataSourceBuilder(this.coreService)
      .load('Airport/GetAirportsLookup', { requireTotalCount: true })
      .byKey('Airport/GetAirportsLookup')
      .setKey("id")
      .build();

    this.coreService.getCall('Terminal').then((res: CodeNamePair[]) => {
      this.terminalDataSource = res;
    });
  }

  airlineOnValueChanged = (e: any) => {
    this.isSelected = e.value != '';
  }
  flightCodeOnValueChanged = (e: any) => {
    this.isSelected = e.value != '';
    this.data.flightNumber = e.value;
  }

  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.onSaveClick.emit(this.data);
    }
  }

  cancel() {
    this.onCancelClick.emit(this.data);
  }
}
