import { Routes } from '@angular/router';
import { AuthGuard } from 'genesis-coreservice';
import { CallbackComponent, LayoutComponent, LoginComponent, LogoutComponent } from 'genesis-shell';

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
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard-routing.module'),
                canActivate: [AuthGuard]
            }
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
