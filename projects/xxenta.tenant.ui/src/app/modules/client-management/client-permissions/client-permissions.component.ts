import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridModule, DxLookupModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ClaimValuesModel, ClientClaimModel, ClientPermissionModel } from '../../services/models/client.model';
import { TenantService } from '../../services/tenant.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DataSourceBuilder } from 'genesis-components';

@Component({
  selector: 'app-client-permissions',
  templateUrl: './client-permissions.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxLookupModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class ClientPermissionsComponent implements OnInit {
  dataSource: CustomStore;
  claimsDataSource: ClaimValuesModel[] = [];
  client: ClientPermissionModel = <ClientPermissionModel>{};
  constructor(
    private activatedRoute: ActivatedRoute,
    private tenantService: TenantService,
    public translocoService: TranslocoService) {

  }
  async ngOnInit(): Promise<void> {
    let clientId = this.activatedRoute.snapshot.params.clientId;
    this.claimsDataSource = await this.tenantService.GetClaims();

    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load(`Client/${clientId}/permissions`, { requireTotalCount: true })
      .insert(`Client/${clientId}/permissions`)
      .remove(`Client/${clientId}/permissions`)
      .setKey("id")
      .build();
  }

  onInitNewRow = (e: any) => {
    e.data = <ClientClaimModel>{
      type: 'permission'
    };
  }
  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
}