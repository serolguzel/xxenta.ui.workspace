import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CommandResponse } from 'genesis-coreservice';
import { GenesisAlertComponent } from 'genesis-shell';
import { ApiScopeModel } from '../services/models/tenant.models';
import { TenantService } from '../services/tenant.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from 'genesis-components';

@Component({
  selector: 'app-api-resources',
  templateUrl: './api-resources.component.html',
  standalone: true,
  imports: [
    GenesisAlertComponent,
    DxDataGridModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class ApiResourcesComponent implements OnInit {
  dataSource: CustomStore;
  scopesDataSource: ApiScopeModel[] = [];
  constructor(
    private tenantService: TenantService
  ) {

  }
  async ngOnInit(): Promise<void> {
    this.scopesDataSource = await this.tenantService.GetApiScopes();
    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('ApiResource', { requireTotalCount: true })
      .insert('ApiResource')
      .remove('ApiResource')
      .setKey("name")
      .build();
  }

  onInitNewRow = (e: any) => {
    e.data['secret'] = crypto.randomUUID();
  }

  validationCallback = (e: any) => {
    if (e.value) {
      return this.tenantService.ExistApiResourceName(e.value).then((res: CommandResponse<boolean>) => {
        return !res.aggregatorId;
      });

    } else {
      return false;
    }
  }

  scopeCellTemplate = (container: any, options: any) => {
    const noBreakSpace = '\u00A0';
    const text = (options.value || []).map((element: any) => element).join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  }
}
