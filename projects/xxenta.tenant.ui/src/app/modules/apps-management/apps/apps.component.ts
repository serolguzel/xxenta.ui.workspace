import { Component, OnInit } from '@angular/core';
import { DxDataGridModule, 
  DxLookupModule, 
  DxNumberBoxModule, 
  DxSelectBoxModule, DxTemplateModule, DxTooltipModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { RouterLink } from '@angular/router';
import { CommandResponse } from 'genesis-coreservice';
import { TenantService } from '../../services/tenant.service';
import { TranslocoModule } from '@jsverse/transloco';
import { SubAppsComponentComponent } from '../sub-apps-component/sub-apps-component.component';
import { DataSourceBuilder, OrganizationService } from 'genesis-components';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    TranslocoModule,
    SubAppsComponentComponent,

    DxLookupModule,
    DxTooltipModule
  ],
  providers: [
    TenantService
  ]
})
export class AppsComponent implements OnInit {
  dataSource: CustomStore;
  presentationTypes = this.tenantService.presentationTypes;
  appTypes = this.organizationService.appTypes;
  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
  isUpdate: boolean = false;
  constructor(
    private readonly organizationService: OrganizationService,
    private tenantService: TenantService
  ) {

  }

  ngOnInit() {
    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('Apps', { requireTotalCount: true })
      .insert('Apps')
      .updateFullModel('Apps', "id")
      .remove('Apps')
      .setKey("id")
      .build();
  }
  onInitNewRow = (e: any) => {
    this.isUpdate = false;
  }
  onEditingStart = (e: any) => {
    this.isUpdate = true;
  }
  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }

  validationCallback = (e: any) => {
    if (e.value && !this.isUpdate) {
      return this.tenantService.ExistAppCode(e.value).then((res: CommandResponse<boolean>) => {
        return !res.aggregatorId;
      });

    } else {
      return false;
    }
  }
}
