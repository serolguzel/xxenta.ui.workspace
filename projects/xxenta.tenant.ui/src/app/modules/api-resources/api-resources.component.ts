import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { GenesisAlertComponent } from 'genesis-shell';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiScopeModel } from '../services/models/tenant.models';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-api-resources',
  templateUrl: './api-resources.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    GenesisAlertComponent,
    GenesisDataTableComponent,
    GenesisCellDirective,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
  ],
  providers: [
    TenantService
  ]
})
export class ApiResourcesComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly cdr = inject(ChangeDetectorRef);

  scopesDataSource: ApiScopeModel[] = [];

  get newRowDefaults() {
    return { secret: crypto.randomUUID(), enabled: false, nonEditable: false, scopes: [] };
  }

  columns: GenesisColumn[] = [
    { field: 'name', header: 'Name', filter: true },
    { field: 'displayName', header: 'Display Name', filter: true },
    { field: 'description', header: 'Description', filter: true },
    { field: 'secret', header: 'Secret', hidden: true },
    { field: 'enabled', header: 'Enabled', type: 'boolean' },
    { field: 'nonEditable', header: 'Non Editable', type: 'boolean' },
    { field: 'scopes', header: 'Scopes', sortable: false },
  ];

  async ngOnInit(): Promise<void> {
    this.scopesDataSource = await this.tenantService.GetApiScopes();
    this.cdr.detectChanges();
  }
}
