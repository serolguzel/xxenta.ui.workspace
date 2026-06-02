import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { CreateUser, UpdateUser, userMapping, UserModel } from '../components/user-form/user-form.models';
import { UserService } from '../services/user.service';
import { UsersComOptions } from '../users-com-options.model';

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
  hasDelete: boolean = false;
  options: UsersComOptions = <UsersComOptions>{};

  constructor(
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data as UsersComOptions;
    let userId = this.activatedRoute.snapshot.params['userId'];
    this.userService.GetUserById(userId).then((res: UserModel) => {
      this.user = userMapping.UserModelToUpdateUserModel(res);
    });
  }

  onSaveClick(e: CreateUser | UpdateUser) {
    this.userService.UpdateUser(e.id!, e as UpdateUser);
  }

  onCancelClick(e: CreateUser | UpdateUser) {
    let userId = this.activatedRoute.snapshot.params['userId'];
    this.userService.GetUserById(userId).then((res: UserModel) => {
      this.user = userMapping.UserModelToUpdateUserModel(res);
    });
  }
}