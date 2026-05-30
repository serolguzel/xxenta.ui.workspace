import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DxDataGridModule, DxTemplateModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { TenantService } from '../../services/tenant.service';
import CustomStore from 'devextreme/data/custom_store';
import { CommandResponse } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder, OrganizationService } from 'genesis-components';

@Component({
  selector: 'app-sub-apps-component',
  templateUrl: './sub-apps-component.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class SubAppsComponentComponent implements OnInit {
  @Input() appId: string = '';
  dataSource: CustomStore;
  presentationTypes = this.tenantService.presentationTypes;
  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
  appTypes = this.organizationService.appTypes;
  isUpdate: boolean = false;
  constructor(
    private readonly organizationService: OrganizationService, 
    private tenantService: TenantService,
    private readonly activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    let applicationId = this.appId != '' ? this.appId : this.activatedRoute.snapshot.params.appId;
    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('Apps', { requireTotalCount: true, parentId: applicationId })
      .insert('Apps')
      .updateFullModel('Apps', "id")
      .remove('Apps')
      .setKey("id")
      .build();
  }

  onEditingStart = (e: any) => {
    this.isUpdate = true;
  }
  
  onInitNewRow = (e: any) => {
    this.isUpdate = false;
    let appId = this.activatedRoute.snapshot.params.appId;
    e.data['parentId'] = appId;
  }

  onRowUpdating = (e: any) => {
    this.isUpdate = true;
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
