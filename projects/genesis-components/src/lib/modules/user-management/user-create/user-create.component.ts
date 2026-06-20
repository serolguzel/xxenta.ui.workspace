import { Component, OnInit } from '@angular/core';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LookupService } from '../../../services/lookup.service';
import { UsersComOptions } from '../users-com-options.model';
import { CreateUser } from '../components/user-form/user-form.models';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { CommandResponse, UserType } from 'genesis-coreservice';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  standalone: true,
  imports: [
    UserFormComponent,
    GenesisBreadcrumbsComponent
],
  providers: [
    UserService,
    LookupService
  ]
})
export class UserCreateComponent implements OnInit {
  user: CreateUser = <CreateUser>{};
  breadcrumbs: Array<BreadcrumbsModel> = [];
  options: UsersComOptions = <UsersComOptions>{};
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data as UsersComOptions;

    this.breadcrumbs = [
      {
        title: this.translocoService.translate(this.options.backPageTitle!),
        link: this.options.backRoute
      },
      {
        title: this.translocoService.translate(this.options.pageTitle!)
      }
    ];
    if(this.options.userType){
      this.user.userType = this.options.userType;
    }else{
      this.user.userType = UserType.User;
    }
    
  }

  save(e: CreateUser) {
    if(e.email)
      e.emailConfirmed = false;
    else
      e.emailConfirmed = true;
    if(!e.userType)
      e.userType = UserType.User;
    this.userService.CreateUser(e).then((res: CommandResponse<string>) => {
      if (res) {
        this.router.navigate([`${this.options.detailBaseRoute}/${res.aggregatorId}`]);
      }
    });
  }
}
