import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent, DxFormModule, DxTagBoxModule, DxToolbarModule } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { RoleResponse, UserRoleModel } from '../components/user-form/user-form.models';
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

  ngOnInit() {
    this.model.userId = this.activatedRoute.snapshot.params['userId'];
    Promise.all([
      this.coreService.getCall(`User/GetRoles`)
        .then((res: RoleResponse[]) => {
          this.roles = res;
        })
    ]).then(() => {
      this.coreService.getCall(`Role/GetUserRole/${this.model.userId}`).then((response: string[]) => {
        if (response) {
          this.model.roleIds = response;
        }
      });
    });
  }

  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.coreService.postCall(`Role/${this.model.userId}`, this.model);
    }
  }
}
