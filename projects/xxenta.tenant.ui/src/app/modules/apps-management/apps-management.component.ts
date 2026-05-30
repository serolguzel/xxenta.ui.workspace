import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsModel, GenesisChildSidebarComponent, GenesisNavigationItem } from 'genesis-shell';
import { Subject, takeUntil } from 'rxjs';
import { ParamsEventService } from '../services/params-event.service';
import { AppsModel } from '../services/models/tenant.models';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-apps-management',
  templateUrl: './apps-management.component.html',
  standalone: true,
  imports: [
    GenesisChildSidebarComponent
  ],
  providers: [
    TenantService
  ]
})
export class AppsManagementComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  childMenuData: GenesisNavigationItem[] = [];
  backLink: BreadcrumbsModel = {
    title: 'Back',
    link: '/tenant/apps'
  };
  app: AppsModel = <AppsModel>{};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private eventService: ParamsEventService,
    private tenantService: TenantService) {
    
  }

  ngOnInit(): void {
    this.eventService.getAppIdChange$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((appId: string) => {
      this.breadcrumbs = [
        {
          title: 'Apps',
          link: '/tenant/apps'
        }
      ];
      this.tenantService.GetAppById(appId).then((res: AppsModel) => {
        this.app = res;
        this.breadcrumbs.push({
          title: res.name,
        });
        this.setMenuData(res);
      });
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private setMenuData(data: AppsModel) {
    this.childMenuData = [
      {
        title: data.name || 'Actions',
        subtitle: data.description,
        type: 'group',
        children: [
          {
            title: 'Application Detail',
            type: 'basic',
            icon: 'heroicons_solid:user',
            link: `detail/${data.id}`
          },
          {
            title: 'Sub Apps & Services',
            type: 'basic',
            icon: 'app_registration',
            link: `sub-apps/${data.id}`
          },
          {
            title: 'Navigations',
            type: 'basic',
            icon: 'navigation',
            link: `navigations/${data.id}`
          },
          {
            title: 'Customers Using',
            type: 'basic',
            icon: 'apps',
            link: `customer-using/${data.id}`
          }
        ]
      }
    ];
  }


}
