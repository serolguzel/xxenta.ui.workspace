import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
  providers: [
    TenantService
  ]
})
export class ConfigurationsComponent implements OnInit {
  private readonly translocoService = inject(TranslocoService);
  private readonly tenantService = inject(TenantService);
  private readonly coreService = inject(CoreService);
  private readonly cdr = inject(ChangeDetectorRef);

  organizations: any[] = [];
  integrations: any[] = [];

  columns: GenesisColumn[] = [
    { field: 'organization.name', header: this.translocoService.translate('labels.organization'), filter: true },
    { field: 'integration.name', header: this.translocoService.translate('labels.integration'), filter: true },
    { field: 'key', header: this.translocoService.translate('labels.key'), filter: true },
    { field: 'value', header: this.translocoService.translate('labels.value'), filter: true },
    { field: 'isDefault', header: this.translocoService.translate('labels.is-default'), type: 'boolean' },
  ];

  async ngOnInit(): Promise<void> {
    const [organizations, integrations] = await Promise.all([
      this.coreService.getCall('Organization/GetOrganizationsLookup', { isTenant: true }),
      this.tenantService.GetIntegrationsLookup(),
    ]);
    this.organizations = Array.isArray(organizations) ? organizations : (organizations?.data ?? []);
    this.integrations = integrations ?? [];
    this.cdr.detectChanges();
  }
}
