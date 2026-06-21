import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { InputTextModule } from 'primeng/inputtext';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { GetPushProcesses } from './pushlog.models';

@Component({
  selector: 'app-pushlog-component',
  templateUrl: './pushlog-component.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    RouterLink,
    InputTextModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class PushlogComponentComponent {
  private readonly translocoService = inject(TranslocoService);

  @ViewChild('grid') grid!: GenesisDataTableComponent;

  filter: GetPushProcesses = <GetPushProcesses>{};

  columns: GenesisColumn[] = [
    { field: 'code', header: this.translocoService.translate('labels.code'), filter: true },
    { field: 'description', header: this.translocoService.translate('labels.description'), filter: true },
    { field: 'transferDate', header: this.translocoService.translate('labels.transfer-date'), type: 'date' },
    { field: 'isSuccess', header: this.translocoService.translate('labels.status'), type: 'boolean' },
    { field: 'createDate', header: this.translocoService.translate('labels.create-date'), type: 'datetime' },
  ];

  onFilterChange(): void {
    this.grid?.reload();
  }
}
