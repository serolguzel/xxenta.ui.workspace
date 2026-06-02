import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DxFormComponent, DxFormModule, DxPopupModule, DxToolbarModule } from 'devextreme-angular';
import moment from 'moment';
import { ReservationExcelExport } from '../../models/transfer-res.models';
import { TransferReservationService } from '../../services/transfer-reservation.service';
import { LookupService} from '../../../../../services/lookup.service';

@Component({
  selector: 'reservation-excel-export',
  templateUrl: './reservation-excel-export.component.html',
  standalone: true,
  imports: [
    DxPopupModule,
    DxFormModule,
    DxToolbarModule,
    TranslocoModule
  ]
})
export class ReservationExcelExportComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Input() visible: boolean = false;
  @Input() transferDate: string;
  @Output() onCancelClick: EventEmitter<boolean>;
  model: ReservationExcelExport = <ReservationExcelExport>{};
  companyOptions: any;
  transferRouteTypeOptions: any;
  btnSave = {
    icon: 'xlsxfile',
    text: 'Export',
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
    private transferService: TransferReservationService,
    private translocoService: TranslocoService
  ) {
    this.onCancelClick = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.model.transferDate = this.transferDate;
    this.companyOptions = {
      ...this.lookupService.organizationLookUpOptions,
      placeholder: this.translocoService.translate('reservations.operator') + ':',
    };
    this.transferRouteTypeOptions = {
      placeholder: this.translocoService.translate('labels.select-direction'),
      dataSource: this.transferService.transferRouteTypes,
      displayExpr: 'name',
      valueExpr: 'code',
      showClearButton: true
    };
  }

  onHidden() {
    this.onCancelClick.emit(false);
  }
  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.model.transferDate = moment(this.model.transferDate).format('YYYY-MM-DD');
      this.transferService.ReservationExcelExport(this.model).then((response: any) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `reservations-${this.model.transferDate}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        link.remove();
      });
    }
  }
}
