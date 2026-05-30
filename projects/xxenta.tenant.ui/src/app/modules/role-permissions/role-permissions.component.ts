import { Component, OnInit } from '@angular/core';
import { DxAccordionModule, DxSwitchModule, DxTemplateModule, DxTextBoxModule, DxToolbarModule } from 'devextreme-angular';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { NgFor } from '@angular/common';
import { RoleResponse } from 'genesis-components';
import { RolePermission, RolePermissionModel } from '../services/models/client.model';
import { TenantService } from '../services/tenant.service';
import { AddOrRemoveRolePermission } from '../services/models/tenant.models';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  standalone: true,
  imports: [
    NgFor,
    GenesisBreadcrumbsComponent,
    DxAccordionModule,
    DxTemplateModule,
    DxSwitchModule,
    DxTextBoxModule,
    DxToolbarModule
  ],
  providers: [
    TenantService
  ]
})
export class RolePermissionsComponent implements OnInit {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  roles: RoleResponse[] = [];
  compyData: RolePermissionModel[] = [];
  data: RolePermissionModel[] = [];
  selectedRole: string;
  filterText: string = '';

  constructor(
    private tenantService: TenantService,
    public translocoService: TranslocoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.breadcrumbs = [
      {
        title: this.translocoService.translate('labels.dashboard'),
        link: '/tenant/dashboard'
      },
      {
        title: this.translocoService.translate('labels.role-permissions')
      }
    ];
    this.tenantService.GetRoles()
      .then((res: RoleResponse[]) => {
        if (res) {
          this.roles = res;
          this.selectedRole = res[0].id;
          this.loadData();
        }
      });
  }

  loadData() {
    this.tenantService.GetRolePermissions(this.selectedRole).then((res: RolePermissionModel[]) => {
      this.data = [];
      this.compyData = [];
      this.data = res;
      this.compyData = res;
    });
  }

  onRoleValueChanged = (e: any) => {
    this.filterText = '';
    this.selectedRole = e.value;
    this.loadData();
  }

  onValueChanged = (e: any) => {
    this.filterText = e.value;
    if (e.value.length > 0) {
      this.data = this.filterItem(e.value);
    } else {
      this.data = this.compyData;
    }
  }

  onRowValueChanged = (e: any, item: RolePermission) => {
    let model = <AddOrRemoveRolePermission>{
      roleId: this.selectedRole,
      claimValue: item.claimValue,
      hasRole: e.value
    };
    this.tenantService.AddOrRemoveRolePermission(model);
  }

  filterItem(value: string): RolePermissionModel[] {
    let resultItems = [];
    for (let i = 0; i < this.compyData.length; i++) {
      const element = this.compyData[i];
      let existChildItem = element.permissions.filter(x => x.claimValue.includes(value));
      if (element.moduleName.includes(value) || existChildItem.length > 0) {
        let model = <RolePermissionModel>{
          moduleName: element.moduleName,
          permissions: existChildItem
        };
        resultItems.push(model);
      }
    }
    return resultItems;
  }
}
