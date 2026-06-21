import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OrganizationSettingsModel } from '../../company.models';

@Component({
  selector: 'organization-settings-excel-import',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule],
  templateUrl: './organization-settings-excel-import.component.html',
  providers: [ConfirmationService]
})
export class OrganizationSettingsExcelImportComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translocoService = inject(TranslocoService);

  @Input() data: OrganizationSettingsModel = {} as OrganizationSettingsModel;
  @Output() onDeleteClick = new EventEmitter<OrganizationSettingsModel>();

  onDelete(item: OrganizationSettingsModel): void {
    this.confirmationService.confirm({
      header: this.translocoService.translate('messages.are-you-sure'),
      message: this.translocoService.translate('messages.delete-confirmation-description'),
      accept: () => this.onDeleteClick.emit(item)
    });
  }
}
