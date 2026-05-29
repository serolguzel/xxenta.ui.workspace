/* eslint-disable */

import { GenesisNavigationItem } from "genesis-shell";

export const defaultNavigation: GenesisNavigationItem[] = [
    {
        id   : 'tenant-dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/tenant/dashboard'
    },
    {
        id   : 'tenant-tenants',
        title: 'Tenants',
        type : 'basic',
        icon : 'heroicons_solid:building-office',
        link : '/tenant/tenants'
    },
    {
        id   : 'tenant-companies',
        title: 'Companies',
        type : 'basic',
        icon : 'heroicons_solid:building-office-2',
        link : '/tenant/companies'
    },
    {
        id   : 'tenant-users',
        title: 'Users',
        type : 'basic',
        icon : 'heroicons_solid:users',
        link : '/tenant/users'
    },
    {
        id   : 'tenant-apps',
        title: 'Apps',
        type : 'basic',
        icon : 'apps',
        link : '/tenant/apps'
    },
    {
        id   : 'tenant-invoices',
        title: 'Invoices',
        type : 'basic',
        icon : 'heroicons_solid:document-text',
        link : '/tenant/invoices'
    },
    {
        id: 'tenenat_divider_1',
        type: 'divider'
    },
    {
        id   : 'tenant-integrations',
        title: 'Integrations',
        type : 'basic',
        icon : 'api',
        link : '/tenant/integrations'
    },
    {
        id   : 'tenant-configurations',
        title: 'Configurations',
        type : 'basic',
        icon : 'heroicons_solid:cog',
        link : '/tenant/configurations'
    },
    {
        id: 'tenenat_divider_2',
        type: 'divider'
    },
    {
        id   : 'tenant-role-permissions',
        title: 'Role Permissions',
        type : 'basic',
        icon : 'security',
        link : '/tenant/role-permissions'
    },
    {
        id   : 'tenant-clients',
        title: 'Clients',
        type : 'basic',
        icon : 'supervised_user_circle',
        link : '/tenant/clients'
    },
    {
        id   : 'tenant-api-scopes',
        title: 'Api Scopes',
        type : 'basic',
        icon : 'supervised_user_circle',
        link : '/tenant/api-scopes'
    },
    {
        id   : 'tenant-api-resources',
        title: 'Api Resources',
        type : 'basic',
        icon : 'supervised_user_circle',
        link : '/tenant/api-resources'
    },
    {
        id   : 'tenant-claims',
        title: 'Claims',
        type : 'basic',
        icon : 'supervised_user_circle',
        link : '/tenant/claims'
    }
];
export const compactNavigation: GenesisNavigationItem[] = [
   
];
export const futuristicNavigation: GenesisNavigationItem[] = [
    
];
export const horizontalNavigation: GenesisNavigationItem[] = [
    
];
