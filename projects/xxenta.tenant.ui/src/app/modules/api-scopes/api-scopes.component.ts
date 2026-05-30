import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CommandResponse } from 'genesis-coreservice';
import { TenantService } from '../services/tenant.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from 'genesis-components';

@Component({
  selector: 'app-api-scopes',
  templateUrl: './api-scopes.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class ApiScopesComponent implements OnInit {
  dataSource: CustomStore;
  constructor(
    private tenantService: TenantService
  ) {
    
  }
  ngOnInit(): void {
    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('ApiScope', { requireTotalCount: true })
      .insert('ApiScope')
      .remove('ApiScope')
      .setKey("name")
      .build();
  }

  validationCallback = (e: any) => {
    if(e.value){
      return this.tenantService.ExistApiScopeName(e.value).then((res: CommandResponse<boolean>)=> {
        return !res.aggregatorId;
      });
     
    }else{
      return false;
    }
  }
}
