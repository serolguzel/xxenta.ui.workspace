import { Routes } from "@angular/router";
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
    OrganizationParnterPermissionsComponent
} from "genesis-components";
import { CompanyManagementComponent } from "./company-management.component";


export default [
    {
        path: '',
        component: OrganizationsComponent,
        data: {
            params: {
                isTenant: false
            },
            pageTitle: 'Organizations',
            createRoute: 'tenant/customers/create-customer'
        }
    },
    {
        path: 'create-customer',
        component: OrganizationCreateComponent
    },

    {
        path: '',
        component: CompanyManagementComponent,
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
                path: 'apps/:organizationId',
                component: OrganizationAppsComponent,
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
                    createRoute: 'tenant/companies/branches/:organizationId/create',
                    detailRoute: '/tenant/companies/detail'
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
                    backRoute: 'tenant/companies/branches/:organizationId'
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
                path: 'settings/:organizationId',
                component: OrganizationSettingsComponent,
                resolve: {
                    organizationId: initialOrganizationResolver
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
] as Routes;