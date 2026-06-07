import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent, DxFormModule, DxTagBoxModule, DxToolbarModule } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { RoleResponse, UserRoleModel, UserRoleResponse } from '../components/user-form/user-form.models';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'user-roles-form',
  templateUrl: './user-roles.component.html',
  standalone: true,
  imports: [
    DxFormModule,
    DxTagBoxModule,
    DxToolbarModule,
    TranslocoModule
  ]
})
export class UserRolesComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  model: UserRoleModel = <UserRoleModel>{};
  roles: RoleResponse[] = [];
  userToolbars: any[] = [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.userToolbars = [{
      id: 'save',
      disabled: false,
      location: 'after',
      locateInMenu: '',
      widget: 'dxButton',
      options: {
        icon: 'save',
        text: 'Save',
        type: "default",
        onClick: this.save.bind(this)
      }
    }];
  }

  async ngOnInit() {
    this.model.userId = this.activatedRoute.snapshot.params['userId'];
    this.roles = await this.coreService.getCall(`Role`) as RoleResponse[];
    this.model.roleIds = [];
    var response = await this.coreService.getCall(`Role/${this.model.userId}`) as UserRoleResponse[];
    if (response) {
      this.model.roleIds = response.map(x => x.roleId);
      this.changeDetectorRef.markForCheck();
    }
  }

  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.coreService.postCall(`Role/${this.model.userId}`, this.model);
    }
  }
}
