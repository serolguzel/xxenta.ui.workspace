import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'lib-process-logs',
  standalone: true,
  templateUrl: './process-logs.component.html',
  imports: [
    TranslocoModule,
    RouterLink,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
})
export class ProcessLogsComponent {
  private readonly translocoService = inject(TranslocoService);

  columns: GenesisColumn[] = [
    { field: 'externalId', header: this.translocoService.translate('labels.external-id'), filter: true },
    { field: 'voucher', header: this.translocoService.translate('labels.voucher'), filter: true },
    { field: 'message', header: this.translocoService.translate('labels.message'), filter: true },
    { field: 'createDate', header: this.translocoService.translate('labels.create-date'), type: 'datetime' },
  ];
}
