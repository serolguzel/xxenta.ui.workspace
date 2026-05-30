import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserLookupModel } from 'genesis-coreservice';
import { BreadcrumbsModel, GenesisChildSidebarComponent, GenesisNavigationItem } from 'genesis-shell';
import { Subject, takeUntil } from 'rxjs';
import { ParamsEventService } from '../services/params-event.service';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    GenesisChildSidebarComponent
  ],
  providers: [
    TenantService
  ]
})
export class UserManagementComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  childMenuData: GenesisNavigationItem[] = [];
  backLink: BreadcrumbsModel = {
    title: 'Back',
    link: 'tenant/users'
  };
  user: UserLookupModel = <UserLookupModel>{};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private eventService: ParamsEventService,
    private tenantService: TenantService) { }

  ngOnInit(): void {
    this.eventService.getUserIdChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((userId: string) => {

        this.breadcrumbs = [
          {
            title: 'Users',
            link: '/tenant/users'
          }
        ];
        this.tenantService.GetUserLookUpById(userId).then((res: UserLookupModel) => {
          if (res) {
            this.user = res;
            this.breadcrumbs.push({
              title: res.displayName,
            });
            this.eventService.setUserChange$ = res;
            this.setMenuData(res);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private setMenuData(data: UserLookupModel) {
    this.childMenuData = [
      {
        title: data.displayName || 'Actions',
        subtitle: data.email,
        type: 'group',
        children: [
          {
            title: 'User Detail',
            type: 'basic',
            icon: 'heroicons_outline:user-circle',
            link: `detail/${data.id}`
          },
          {
            title: 'User Picture',
            type: 'basic',
            icon: 'mat_solid:add_photo_alternate',
            link: `picture/${data.id}`
          },
          {
            title: 'Reset Password',
            type: 'basic',
            icon: 'heroicons_solid:key',
            link: `reset-password/${data.id}`
          },
          {
            title: 'User Email',
            type: 'basic',
            icon: 'contact_mail',
            link: `email/${data.id}`
          },
          {
            title: 'User Roles',
            type: 'basic',
            icon: 'vpn_key',
            link: `roles/${data.id}`
          },
          {
            type: 'divider'
          },
          {
            title: 'Permission Settings',
            type: 'basic',
            icon: 'heroicons_outline:cog',
            link: `permission-settings/${data.id}`
          }
        ]
      }
    ];
  }
}