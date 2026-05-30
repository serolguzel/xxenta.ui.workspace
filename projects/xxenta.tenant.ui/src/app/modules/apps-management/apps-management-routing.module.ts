import { Routes } from "@angular/router";
import { AppsComponent } from "./apps/apps.component";
import { AppsManagementComponent } from "./apps-management.component";
import { AppsDetailComponent } from "./apps-detail/apps-detail.component";
import { initialAppPageResolver } from "../services/apps-page.resolver";
import { AppsNavigationsComponent } from "./apps-navigations/apps-navigations.component";
import { AppsCustomerUsingComponent } from "./apps-customer-using/apps-customer-using.component";
import { SubAppsComponentComponent } from "./sub-apps-component/sub-apps-component.component";

export default [
    {
        path: '',
        component: AppsComponent
    },
    {
        path: '',
        component: AppsManagementComponent,
        children: [
            {
                path: 'detail/:appId',
                component: AppsDetailComponent,
                resolve: {
                    apps: initialAppPageResolver
                }
            },
            {
                path: 'navigations/:appId',
                component: AppsNavigationsComponent,
                resolve: {
                    apps: initialAppPageResolver
                }
            },
            {
                path: 'customer-using/:appId',
                component: AppsCustomerUsingComponent,
                resolve: {
                    apps: initialAppPageResolver
                }
            },
            {
                path: 'sub-apps/:appId',
                component: SubAppsComponentComponent,
                resolve: {
                    apps: initialAppPageResolver
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
] as Routes;