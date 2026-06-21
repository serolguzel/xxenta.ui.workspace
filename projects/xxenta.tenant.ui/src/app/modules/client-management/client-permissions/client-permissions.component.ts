import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ClaimValuesModel } from '../../services/models/client.model';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-client-permissions',
  templateUrl: './client-permissions.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
  ],
  providers: [
    TenantService
  ]
})
export class ClientPermissionsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tenantService = inject(TenantService);
  private readonly cdr = inject(ChangeDetectorRef);

  loadPath: string = '';
  claimsDataSource: ClaimValuesModel[] = [];

  columns: GenesisColumn[] = [
    { field: 'type', header: 'Type', filter: true },
    { field: 'value', header: 'Value', filter: true },
    { field: 'description', header: 'Description', filter: true },
  ];

  async ngOnInit(): Promise<void> {
    const clientId = this.activatedRoute.snapshot.params['clientId'];
    this.loadPath = `Client/${clientId}/permissions`;
    this.claimsDataSource = await this.tenantService.GetClaims();
    this.cdr.detectChanges();
  }
}
