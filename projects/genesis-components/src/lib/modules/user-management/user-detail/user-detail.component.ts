import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { CreateUser, UpdateUser, userMapping, UserModel } from '../components/user-form/user-form.models';
import { UserService } from '../services/user.service';
import { UsersComOptions } from '../users-com-options.model';
import { AuthService, ConstantRoles } from 'genesis-coreservice';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  standalone: true,
  imports: [NgClass, UserFormComponent],
  providers: [UserService]
})
export class UserDetailComponent implements OnInit {
  user: UpdateUser = <UpdateUser>{};
  hasUpdate: boolean = false;
  disableDeleteButton: boolean = true;
  options: UsersComOptions = <UsersComOptions>{};

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.options = this.activatedRoute.snapshot.data as UsersComOptions;
    let userId = this.activatedRoute.snapshot.params['userId'];
    var user = await this.authService.getProfile();
    var hasPermission = (user.role?.includes(ConstantRoles.SystemAdmin) || user.role?.includes(ConstantRoles.SuperAdmin)) ?? false;
    this.disableDeleteButton = !hasPermission;
    this.userService.GetUserById(userId).then((res: UserModel) => {
      this.user = userMapping.UserModelToUpdateUserModel(res);
      this.changeDetectorRef.markForCheck();
    });
  }

  onSaveClick(e: CreateUser | UpdateUser) {
    this.userService.UpdateUser(e.id!, e as UpdateUser);
  }

  onDeleteClick(e: CreateUser | UpdateUser) {
    this.userService.DeleteUser(e.id!);
  }

  onCancelClick(e: CreateUser | UpdateUser) {
    let userId = this.activatedRoute.snapshot.params['userId'];
    this.userService.GetUserById(userId).then((res: UserModel) => {
      this.user = userMapping.UserModelToUpdateUserModel(res);
    });
  }
}