import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
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
export class ClaimsComponent {
  columns: GenesisColumn[] = [
    { field: 'code', header: 'Code', filter: true },
    { field: 'state', header: 'State', filter: true },
    { field: 'hasTenant', header: 'Has Tenant', type: 'boolean' },
    { field: 'description', header: 'Description', filter: true },
  ];
}
