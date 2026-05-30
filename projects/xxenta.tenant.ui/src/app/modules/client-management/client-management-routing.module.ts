import { Routes } from "@angular/router";
import { ClientsComponent } from "./clients/clients.component";
import { ClientDetailComponent } from "./client-detail/client-detail.component";
import { ClientCreateComponent } from "./client-create/client-create.component";
import { ClientManagementComponent } from "./client-management.component";
import { initialClientPageResolver } from "../services/client-page.resolver";
import { ClientPermissionsComponent } from "./client-permissions/client-permissions.component";
export default [
    {
        path: '',
        component: ClientsComponent
    },
    {
        path: 'create-client',
        component: ClientCreateComponent
    },
    {
        path: '',
        component: ClientManagementComponent,
        children: [
            {
                path: 'detail/:clientId',
                component: ClientDetailComponent,
                resolve: {
                    client: initialClientPageResolver
                }
            },
            {
                path: 'permissions/:clientId',
                component: ClientPermissionsComponent,
                resolve: {
                    client: initialClientPageResolver
                }
            }
        ]

    },
    
    {
        path: '**',
        redirectTo: ''
    }
] as Routes;