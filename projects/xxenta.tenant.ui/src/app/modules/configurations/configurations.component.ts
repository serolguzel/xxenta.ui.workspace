import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { TenantService } from '../services/tenant.service';
import CustomStore from 'devextreme/data/custom_store';
import { Utility } from 'genesis-coreservice';
import { DataSourceBuilder, LookupService } from 'genesis-components';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ],
  providers: [
    TenantService,
    LookupService
  ]
})
export class ConfigurationsComponent implements OnInit {
  dataSource: CustomStore;
  customerLookUpOptions: any = this.lookupService.customerLookUpOptions({isTenant: true}, this.translocoService.translate('labels.tenants'));
  integrationDataSource: any = {
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'code'],
    showClearButton: true,
    itemTemplate: Utility.codeNameTemplate,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: 'Integrations',
    },
  };
  constructor(
    private translocoService: TranslocoService,
    private tenantService: TenantService,
    private lookupService: LookupService
  ) {

  }
  async ngOnInit(): Promise<void> {
    this.integrationDataSource.items = await this.tenantService.GetIntegrationsLookup();

    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('Configuration', { requireTotalCount: true })
      .updateFullModel('Configuration')
      .insert('Configuration')
      .remove('Configuration')
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
     var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }

}
