import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { BadgeTaskStatusComponent, GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    BadgeTaskStatusComponent,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
  providers: [
    TenantService
  ]
})
export class IntegrationsComponent implements OnInit {
  private readonly translocoService = inject(TranslocoService);
  private readonly tenantService = inject(TenantService);
  private readonly cdr = inject(ChangeDetectorRef);

  apps: any[] = [];

  columns: GenesisColumn[] = [
    { field: 'code', header: this.translocoService.translate('labels.code'), filter: true },
    { field: 'name', header: this.translocoService.translate('labels.name'), filter: true },
    { field: 'price', header: this.translocoService.translate('labels.price') },
    { field: 'description', header: this.translocoService.translate('labels.description'), filter: true },
    { field: 'icon', header: this.translocoService.translate('labels.icon') },
    { field: 'appIds', header: this.translocoService.translate('labels.apps'), sortable: false },
  ];

  async ngOnInit(): Promise<void> {
    const apps = await this.tenantService.getCall('Apps/GetAppsLookup');
    this.apps = Array.isArray(apps) ? apps : (apps?.data ?? []);
    this.cdr.detectChanges();
  }
}
