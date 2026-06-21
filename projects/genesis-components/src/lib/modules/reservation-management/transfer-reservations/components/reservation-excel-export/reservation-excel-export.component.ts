import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { OrganizationType } from '../../../../company-management';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import moment from 'moment';
import { ReservationExcelExport } from '../../models/transfer-res.models';
import { TransferReservationService } from '../../services/transfer-reservation.service';

@Component({
  selector: 'reservation-excel-export',
  templateUrl: './reservation-excel-export.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    FloatLabelModule,
    SelectModule,
  ]
})
export class ReservationExcelExportComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transferService = inject(TransferReservationService);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() visible: boolean = false;
  @Input() transferDate: string;
  @Output() onCancelClick = new EventEmitter<boolean>();

  form!: FormGroup;
  operatorDataSource: any[] = [];
  routeTypeDataSource = this.transferService.transferRouteTypes;

  ngOnInit(): void {
    this.form = this.fb.group({
      transferDate: [this.transferDate ?? null, Validators.required],
      operatorId: [null],
      routeType: [null],
    });

    this.transferService
      .getCall('OrganizationPartner/GetPartnersLookup', {
        requireTotalCount: false,
        organizationTypes: JSON.stringify([OrganizationType.Agency, OrganizationType.Operator]),
      })
      .then((res: any) => {
        this.operatorDataSource = Array.isArray(res) ? res : (res?.data ?? []);
        this.cdr.detectChanges();
      });
  }

  onHidden(): void {
    this.onCancelClick.emit(false);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const model: ReservationExcelExport = {
      ...this.form.getRawValue(),
      transferDate: moment(this.form.value.transferDate).format('YYYY-MM-DD'),
    };
    this.transferService.ReservationExcelExport(model).then((response: any) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `reservations-${model.transferDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      link.remove();
    });
  }
}
