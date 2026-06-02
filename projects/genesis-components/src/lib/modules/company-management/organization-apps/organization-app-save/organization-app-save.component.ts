import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent, DxDataGridModule, DxFormComponent, DxFormModule, DxToolbarModule } from 'devextreme-angular';
import { IdNamePair } from 'genesis-coreservice';
import { CreateOrganizationApp, OrganizationAppsModel } from '../../company.models';
import { TranslocoModule } from '@jsverse/transloco';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'lib-organization-app-save',
  templateUrl: './organization-app-save.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxToolbarModule,
    TranslocoModule
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationAppSaveComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  model: CreateOrganizationApp = <CreateOrganizationApp><unknown>{
    subApps: []
  };
  apps: IdNamePair[] = [];
  subApps: OrganizationAppsModel[] = [];
  selectedItems: string[] = [];
  currenciesDataSoruce: any;
  priceCalculatorTypes: any;
  pamentTypes: any;
  presentationTypes: any;
  organizationId: string = '';
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.save.bind(this)
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };
  constructor(
    private router: Router,
    private readonly organizationService: OrganizationService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
    this.priceCalculatorTypes = this.organizationService.priceCalculatorTypes;
    this.pamentTypes = this.organizationService.paymentTypes;
    this.presentationTypes = this.organizationService.presentationTypes;
  }

  async ngOnInit(): Promise<void> {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    let appId = this.activatedRoute.snapshot.params['appId'];
    this.apps = await this.organizationService.GetAppsLookup();
    if (appId) {
      let queryRequest = {
        organizationId: this.organizationId,
        appId: appId
      };
      var app = await this.organizationService.GetOrganizationAppByAppId(queryRequest);
      this.model = this.CreateMap(app);
      this.subApps = app.subApps ?? [];
      this.selectedItems = app.subApps?.filter(x => x.isSelected).map(x => x.appId) ?? [];
    } else {
      this.model.organizationId = this.organizationId;
    }
  }

  save() {
    let appId = this.activatedRoute.snapshot.params['appId'];
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      var selectted = this.dataGrid.instance.getSelectedRowsData();
      this.model.subApps = selectted.map(x => <CreateOrganizationApp>{
        appId: x.appId,
        organizationId: this.organizationId,
        price: x.price,
        currency: x.currency,
        appType: x.appType,
        url: x.url,
        priceCalculatorType: x.priceCalculatorType,
        paymentType: x.paymentType
      });
      if (appId) {
        this.organizationService.UpdateOrganizationApp(this.model);
      } else {
        this.organizationService.CreateOrganizationApp(this.model);
      }

    }
  }

  cancel() {
    this.router.navigate([`/tenant/tenants/apps/${this.organizationId}`]);
  }
  onAppValueChanged = (e: any) => {
    this.getSubApps(e.value);
    this.dataGrid.instance.refresh();
  }

  getSubApps(parentId: string): void {
    let appId = this.activatedRoute.snapshot.params['appId'];
    if (!appId) {
      let queryRequest = {
        appId: parentId
      };
      this.organizationService.GetOrganizationAppByAppId(queryRequest).then((res: OrganizationAppsModel) => {
        this.subApps = res.subApps?.map(x => {
          return <OrganizationAppsModel>{
            appId: x.appId,
            organizationId: this.organizationId,
            price: x.price,
            currency: res?.currency != null ? res.currency : 'EUR',
            appType: x.appType,
            app: x.app,
            presentationType: x.presentationType,
            organization: <IdNamePair>{
              id: this.organizationId
            }
          }
        }) ?? [];
      });
    }
  }

  private CreateMap(item: OrganizationAppsModel): CreateOrganizationApp {
    return <CreateOrganizationApp>{
      organizationId: item.organizationId,
      appId: item.appId,
      price: item.price,
      currency: item.currency,
      url: item.url,
      priceCalculatorType: item.priceCalculatorType,
      paymentType: item.paymentType,
      appType: item.appType,
      subApps: item.subApps != null ? item.subApps.map(x => this.CreateMap(x)) : []
    };
  }
}
