import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceBuilder, LookupService } from 'genesis-components';
import { CoreService } from 'genesis-coreservice';

@Component({
  selector: 'app-apps-customer-using',
  templateUrl: './apps-customer-using.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    TranslocoModule
  ]
})
export class AppsCustomerUsingComponent implements OnInit {
  dataSource: CustomStore;
  appsDataSource: CustomStore;
  customerLookUpOptions: any = this.lookupService.customerLookUpOptions({});

  constructor(
    private readonly coreService: CoreService,
    private readonly lookupService: LookupService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    let appId = this.activatedRoute.snapshot.params.appId;
    this.appsDataSource = new DataSourceBuilder(this.coreService)
      .load('Apps/GetAppsLookup')
      .setKey('id')
      .build();

    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`OrganizationApps/${appId}`, { requireTotalCount: true })
      .setKey("organizationId")
      .build();
  }
}
