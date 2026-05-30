import { Routes } from '@angular/router';
import { AuthGuard } from 'genesis-coreservice';
import { CallbackComponent, LayoutComponent, LoginComponent, LogoutComponent } from 'genesis-shell';
import { initialDataResolver } from './app.resolvers';
import { InvoicesComponent } from './modules/invoices/invoices.component';
import { ConfigurationsComponent } from './modules/configurations/configurations.component';
import { RolePermissionsComponent } from './modules/role-permissions/role-permissions.component';
import { IntegrationsComponent } from './modules/integrations/integrations.component';
import { ClaimsComponent } from './modules/claims/claims.component';
import { ApiResourcesComponent } from './modules/api-resources/api-resources.component';
import { ApiScopesComponent } from './modules/api-scopes/api-scopes.component';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'dashboard' 
    },
    {
        path: 'callback',
        component: CallbackComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        canActivate: [AuthGuard],
         children: [
            { 
                path: 'tenant/dashboard', 
                loadChildren: () => import('./modules/dashboard/dashboard-routing.module'),
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/tenants', 
                loadChildren: () => import('./modules/tenant-management/tenant-management-routing.module'),
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/companies', 
                loadChildren: () => import('./modules/company-management/company-management-routing.module'),
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/users', 
                loadChildren: () => import('./modules/user-management/user-management-routing.module'),
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/apps', 
                loadChildren: () => import('./modules/apps-management/apps-management-routing.module'),
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/clients', 
                loadChildren: () => import('./modules/client-management/client-management-routing.module'),
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/api-scopes', 
                component: ApiScopesComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/api-resources', 
                component: ApiResourcesComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/claims', 
                component: ClaimsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'tenant/role-permissions',
                component: RolePermissionsComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/integrations', 
                component: IntegrationsComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/configurations', 
                component: ConfigurationsComponent,
                canActivate: [AuthGuard]
            },
            { 
                path: 'tenant/invoices', 
                component: InvoicesComponent,
                canActivate: [AuthGuard]
            },
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
