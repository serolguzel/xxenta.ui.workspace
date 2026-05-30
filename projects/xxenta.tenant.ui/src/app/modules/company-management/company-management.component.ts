import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsModel, GenesisChildSidebarComponent, GenesisNavigationItem } from 'genesis-shell';
import { Subject, takeUntil } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import { TenantService } from '../services/tenant.service';
import { OrganizationAppsModel, OrganizationEventService, OrganizationModel, OrganizationService } from 'genesis-components';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  standalone: true,
  imports: [
    GenesisChildSidebarComponent
  ],
  providers: [
    OrganizationService
  ]
})
export class CompanyManagementComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  childMenuData: GenesisNavigationItem[] = [];
  backLink: BreadcrumbsModel = {
    title: 'Back',
    link: '/tenant/companies'
  };
  customer: OrganizationModel = <OrganizationModel>{};
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private eventService: OrganizationEventService,
    private tenantService: TenantService,
    private organizationService: OrganizationService) {

  }

  ngOnInit(): void {
    this.eventService.getOrganizationIdChange$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((customerId: string) => {
        this.breadcrumbs = [
          {
            title: 'Customers',
            link: '/tenant/companies'
          }
        ];

        this.organizationService.GetOrganizationById(customerId).then((res: OrganizationModel) => {
          this.customer = res;
          this.breadcrumbs.push({
            title: res.name,
          });
          this.organizationService.GetOrganizationApps(res.id).then((apps: OrganizationAppsModel[]) => {
            this.setMenuData(res, apps);
          });

          this.eventService.setOrganizationChange$ = res;

        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private setMenuData(data: OrganizationModel, apps: OrganizationAppsModel[]) {
    let childItems: GenesisNavigationItem[] = [
      {
        title: 'Organization Detail',
        type: 'basic',
        icon: 'heroicons_solid:user',
        link: `detail/${data.id}`
      },
      {
        title: 'Contacts',
        type: 'basic',
        icon: 'mat_solid:contacts',
        link: `contacts/${data.id}`
      },
      {
        title: 'Currencies',
        type: 'basic',
        icon: 'heroicons_solid:currency-euro',
        link: `currencies/${data.id}`
      },
      {
        title: 'Branches',
        type: 'basic',
        icon: 'apartment',
        link: `branches/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null);
        }
      },
      {
        title: 'Partners',
        type: 'basic',
        icon: 'heroicons_solid:building-office-2',
        link: `partners/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null && data.isTenant);
        }
      },
      {
        title: 'Logos',
        type: 'basic',
        icon: 'heroicons_solid:star',
        link: `logos/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null);
        }
      },
      {
        title: 'Mappings',
        type: 'basic',
        icon: 'feather:git-merge',
        link: `mappings/${data.id}`
      },
      {
        type: 'divider'
      },
      {
        title: 'Applications',
        type: 'basic',
        icon: 'apps',
        link: `apps/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null && data.isTenant);
        }
      },
      {
        title: 'Users',
        type: 'basic',
        icon: 'heroicons_solid:users',
        link: `users/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null && data.isTenant);
        }
      },
      {
        title: 'Key Users',
        type: 'basic',
        icon: 'supervised_user_circle',
        link: `key-users/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null && data.isTenant);
        }
      },
      {
        title: 'Pax Counter',
        type: 'basic',
        icon: 'format_list_numbered',
        link: `pax-counter/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null);
        }
      },
      {
        type: 'divider'
      },
      {
        title: 'Settings',
        type: 'basic',
        icon: 'heroicons_outline:cog-8-tooth',
        link: `settings/${data.id}`,
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null);
        }
      },
      {
        type: 'divider'
      },
      {
        title: 'Delete All Datas',
        type: 'basic',
        icon: 'heroicons_solid:trash',
        function: () => {
          let confirmPopup = confirm(`${data.name} ait herşey geri dönüşümsüz silinecek. Silmek istediğinize emin misiniz?`, "Emin misiniz?");
          confirmPopup.then((dialogResult) => {
            if (dialogResult) {
              this.tenantService.DeleteAllOwnerData(data.id);
            }
          });
        },
        hidden: (item: GenesisNavigationItem) => {
          return !(data.parentId == null && data.isTenant);
        }
      }
    ];
    this.childMenuData = [
      {
        title: data.name || 'Actions',
        subtitle: 'Organization details, settings and users',
        type: 'group',
        children: childItems
      }
    ];
  }
}
