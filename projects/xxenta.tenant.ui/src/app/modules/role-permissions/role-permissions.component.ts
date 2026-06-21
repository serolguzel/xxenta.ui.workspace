import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { RoleResponse } from 'genesis-components';
import { RolePermission, RolePermissionModel } from '../services/models/client.model';
import { TenantService } from '../services/tenant.service';
import { AddOrRemoveRolePermission } from '../services/models/tenant.models';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  standalone: true,
  imports: [
    FormsModule,
    GenesisBreadcrumbsComponent,
    AccordionModule,
    SelectModule,
    ToggleSwitchModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class RolePermissionsComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly tenantService = inject(TenantService);
  readonly translocoService = inject(TranslocoService);

  breadcrumbs: Array<BreadcrumbsModel> = [];
  roles: RoleResponse[] = [];
  compyData: RolePermissionModel[] = [];
  data: RolePermissionModel[] = [];
  selectedRole: string;
  filterText: string = '';

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
        this.changeDetectorRef.detectChanges();
      });
  }

  loadData() {
    this.tenantService.GetRolePermissions(this.selectedRole).then((res: RolePermissionModel[]) => {
      this.data = res ?? [];
      this.compyData = res ?? [];
      this.changeDetectorRef.detectChanges();
    });
  }

  onRoleValueChanged = (e: { value: string }) => {
    this.filterText = '';
    this.selectedRole = e.value;
    this.loadData();
  }

  onFilterChanged = (value: string) => {
    this.filterText = value;
    if (value && value.length > 0) {
      this.data = this.filterItem(value);
    } else {
      this.data = this.compyData;
    }
  }

  onRowValueChanged = (e: { checked: boolean }, item: RolePermission) => {
    const model = <AddOrRemoveRolePermission>{
      roleId: this.selectedRole,
      claimValue: item.claimValue,
      hasRole: e.checked
    };
    this.tenantService.AddOrRemoveRolePermission(model);
  }

  filterItem(value: string): RolePermissionModel[] {
    const resultItems: RolePermissionModel[] = [];
    for (let i = 0; i < this.compyData.length; i++) {
      const element = this.compyData[i];
      const existChildItem = element.permissions.filter(x => x.claimValue.includes(value));
      if (element.moduleName.includes(value) || existChildItem.length > 0) {
        const model = <RolePermissionModel>{
          moduleName: element.moduleName,
          permissions: existChildItem
        };
        resultItems.push(model);
      }
    }
    return resultItems;
  }
}
