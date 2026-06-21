import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-api-scopes',
  templateUrl: './api-scopes.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
  ],
  providers: [
    TenantService
  ]
})
export class ApiScopesComponent {
  columns: GenesisColumn[] = [
    { field: 'name', header: 'Name', filter: true },
    { field: 'displayName', header: 'Display Name', filter: true },
    { field: 'description', header: 'Description', filter: true },
    { field: 'required', header: 'Required', type: 'boolean' },
    { field: 'emphasize', header: 'Emphasize', type: 'boolean' },
    { field: 'showInDiscoveryDocument', header: 'Show In Discovery Document', type: 'boolean' },
  ];
}
