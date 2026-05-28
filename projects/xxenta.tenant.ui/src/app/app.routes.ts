import { Routes } from '@angular/router';
import { AuthGuard } from 'genesis-coreservice';
import { LayoutComponent } from 'genesis-shell';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'dashboard' 
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
