import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { DxFormComponent, DxFormModule, DxPopupModule, DxToolbarModule } from 'devextreme-angular';
import moment from 'moment';
import { GenesisAlertComponent } from 'genesis-shell';
import { CommandResponse, CoreService } from 'genesis-coreservice';
import { UpdateTransferReservationFlight } from '../../../modules/reservation-management/transfer-reservations/models/transfer-res.models';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'change-flight-times',
  templateUrl: './change-flight-times.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxPopupModule,
    DxFormModule,
    DxToolbarModule,
    TranslocoModule,
    GenesisAlertComponent
  ]
})
export class ChangeFlightTimesComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Input() visible: boolean = false;
  @Output() onCancelClick: EventEmitter<boolean>;
  @Output() onProcessClick: EventEmitter<boolean>;

  model: UpdateTransferReservationFlight = <UpdateTransferReservationFlight>{};
  flightLookUpOptions: any;
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: 'default',
    onClick: this.save.bind(this),
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.onHidden.bind(this),
  };

  constructor(
    private coreService: CoreService,
    private lookupService: LookupService
  ) {
    this.onCancelClick = new EventEmitter<boolean>();
    this.onProcessClick = new EventEmitter<boolean>();
    this.flightLookUpOptions = {
    ...this.lookupService.flightLookUpOptions
  };
  }

  ngOnInit() {
    
  }

  public setNewModel(data: UpdateTransferReservationFlight) {
    this.model = data;
  }

  onHidden() {
    this.onCancelClick.emit(false);
  }

  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.model.arrivalTime = moment(this.model.arrivalTime).format('HH:mm');
      this.model.departureTime = moment(this.model.departureTime).format('HH:mm');
      this.model.flightDate = moment(this.model.flightDate).format('YYYY-MM-DD');
      this.UpdateTransferReservationFlight(this.model).then((res: CommandResponse<boolean>) => {
        this.onProcessClick.emit(false);
      });
    }
  }

  public UpdateTransferReservationFlight(request: UpdateTransferReservationFlight): Promise<CommandResponse<boolean>> {
        return this.coreService.postCall('TransferReservationFlight/UpdateTransferReservationFlight', request);
    }

}
