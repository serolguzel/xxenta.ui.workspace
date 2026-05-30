import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsModel, GenesisChildSidebarComponent, GenesisNavigationItem } from 'genesis-shell';
import { Subject, takeUntil } from 'rxjs';
import { ParamsEventService } from '../services/params-event.service';
import { AppsModel } from '../services/models/tenant.models';

@Component({
    selector: 'app-client-management',
    templateUrl: './client-management.component.html',
    standalone: true,
    imports: [
        GenesisChildSidebarComponent
    ]
})
export class ClientManagementComponent implements OnInit, OnDestroy {
    breadcrumbs: Array<BreadcrumbsModel> = [];
    childMenuData: GenesisNavigationItem[] = [];
    backLink: BreadcrumbsModel = {
        title: 'Back',
        link: '/tenant/clients'
    };
    client: AppsModel = <AppsModel>{};
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private eventService: ParamsEventService) {

    }

    ngOnInit(): void {
        this.eventService.getClientIdChange$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((clientId: string) => {
                this.client.code = clientId;
                this.client.name = clientId;
                this.breadcrumbs = [
                    {
                        title: 'Clients',
                        link: '/tenant/clients'
                    },
                    {
                        title: 'Client Detail'
                    }
                ];
                this.setMenuData(clientId);
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    private setMenuData(data: string) {
        this.childMenuData = [
            {
                title: data || 'Actions',
                subtitle: 'Client',
                type: 'group',
                children: [
                    {
                        title: 'Client Detail',
                        type: 'basic',
                        icon: 'heroicons_solid:user-circle',
                        link: `detail/${data}`
                    },
                    {
                        title: 'Client Permissions',
                        type: 'basic',
                        icon: 'mat_solid:vpn_key',
                        link: `permissions/${data}`
                    }
                ]
            }
        ];
    }
}
