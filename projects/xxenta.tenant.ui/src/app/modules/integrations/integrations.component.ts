import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { TenantService } from '../services/tenant.service';
import CustomStore from 'devextreme/data/custom_store';
import { TranslocoModule } from '@jsverse/transloco';
import { BadgeTaskStatusComponent, DataSourceBuilder } from 'genesis-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    TranslocoModule,
    BadgeTaskStatusComponent
  ],
  providers: [
    TenantService
  ]
})
export class IntegrationsComponent implements OnInit {
  dataSource: CustomStore;
  appsDataSource: CustomStore;
  isUpdateCode: boolean = false;
  constructor(
    private tenantService: TenantService
  ) {

  }
  ngOnInit(): void {
    this.appsDataSource = new DataSourceBuilder(this.tenantService)
      .load('Apps/GetAppsLookup')
      .setKey('id')
      .build();

    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('Integration', { requireTotalCount: true })
      .insert('Integration')
      .updateFullModel('Integration')
      .remove('Integration')
      .setKey("id")
      .build();
  }
  
  onInitNewRow = (e: any) => {
    this.isUpdateCode = false;
  }
  onEditingStart = (e: any) => {
    this.isUpdateCode = true;
  }

  onRowUpdating = (e: any) => {
    e.newData = { ...e.oldData, ...e.newData };
  }

  onRowUpdated = (e: any) => {
    this.isUpdateCode = false;
  }
}
