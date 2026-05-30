import { Routes } from "@angular/router";
import { TenantManagementComponent } from "./tenant-management.component";
import {
    OrganizationCreateComponent,
    OrganizationsComponent,
    UsersComponent,
    OrganizationDetailComponent,
    OrganizationContactsComponent,
    OrganizationBranchesComponent,
    OrganizationPartnerComponent,
    OrganizationAppsComponent,
    OrganizationCurrencyComponent,
    OrganizationSettingsComponent,
    OrganizationLogosComponent,
    initialOrganizationResolver,
    OrganizationMappingsComponent,
    OrganizationKeyUsersComponent,
    OrganizationParnterPermissionsComponent,
    OrganizationAppsNavigationComponent,
    OrganizationAppSaveComponent,
    OrganizationAirportComponent
} from "genesis-components";
import { TenantPaxCounterComponent } from "./tenant-pax-counter/tenant-pax-counter.component";
import { OrganizationAccountingInfoComponent } from "./organization-accounting-info/organization-accounting-info.component";

export default [
    {
        path: '',
        component: OrganizationsComponent,
        data: {
            params: {
                isTenant: true
            },
            pageTitle: 'Organizations',
            createRoute: 'tenant/tenants/create-customer'
        }
    },
    {
        path: 'create-customer',
        component: OrganizationCreateComponent
    },

    {
        path: '',
        component: TenantManagementComponent,
        children: [
            {
                path: 'detail/:organizationId',
                component: OrganizationDetailComponent,
                data: {
                    hideOptions: true,
                },
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'accounting-info/:organizationId',
                component: OrganizationAccountingInfoComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'apps/:organizationId',
                component: OrganizationAppsComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'apps/:organizationId/add-app',
                component: OrganizationAppSaveComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'apps/:organizationId/add-app/:appId',
                component: OrganizationAppSaveComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'apps-navigations/:organizationId/:appId',
                component: OrganizationAppsNavigationComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'contacts/:organizationId',
                component: OrganizationContactsComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'currencies/:organizationId',
                component: OrganizationCurrencyComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'branches/:organizationId',
                component: OrganizationBranchesComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                },
                data: {
                    createRoute: 'tenant/tenants/branches/:organizationId/create',
                    detailRoute: '/tenant/tenants/detail'
                }
            },
            {
                path: 'branches/:organizationId/create',
                component: OrganizationCreateComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                },
                data: {
                    hideCreadCrumb: true,
                    hideIsTenant: true,
                    backRoute: 'tenant/tenants/branches/:organizationId'
                }
            },
            {
                path: 'partners/:organizationId',
                component: OrganizationPartnerComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'partners/:organizationId/:partnerId',
                component: OrganizationParnterPermissionsComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'logos/:organizationId',
                component: OrganizationLogosComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'mappings/:organizationId',
                component: OrganizationMappingsComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                },
                data: {
                    pageTitle: 'Mappings'
                }
            },

            {
                path: 'users/:organizationId',
                component: UsersComponent,
                data: {
                    createRoute: '',
                    loadPath: 'User',
                    detailBaseRoute: '/tenant/users',
                    extraParams: {
                        ownerId: ''
                    }
                },
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'key-users/:organizationId',
                component: OrganizationKeyUsersComponent,
                data: {
                    pageTitle: 'Key Users'
                },
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'pax-counter/:organizationId',
                component: TenantPaxCounterComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'settings/:organizationId',
                component: OrganizationSettingsComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
            {
                path: 'airports/:organizationId',
                component: OrganizationAirportComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
] as Routes;