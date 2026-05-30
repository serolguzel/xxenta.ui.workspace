import { Routes } from "@angular/router";
import { UserManagementComponent } from "./user-management.component";
import { initialUserPageResolver } from "../services/user-page.resolver";
import {
    UserCreateComponent,
    UserDetailComponent,
    UserEmailComponent,
    UserPermissionsComponent,
    UserPictureComponent,
    UserResetPasswordComponent,
    UserRolesComponent,
    UsersComponent
} from "genesis-components";

export default [
    {
        path: '',
        component: UsersComponent,
        data: {
            createRoute: 'tenant/users/create-user',
            pageTitle: 'Users',
            loadPath: 'User',
            paddingCss: 'p-6',
            detailBaseRoute: '',
            extraParams: {
                requireTotalCount: true
            }
        }
    },
    {
        path: 'create-user',
        component: UserCreateComponent,
        data: {
            pageTitle: 'Create Users',
            backPageTitle: 'Users',
            backRoute: 'tenant/users',
            detailBaseRoute: '/tenant/users/detail',
            permissions: {
                visibleUserType: true,
                disableSaveButton: false,
                visibleCustomerLookup: true
            }
        }
    },
    {
        path: '',
        component: UserManagementComponent,
        children: [
            {
                path: 'detail/:userId',
                component: UserDetailComponent,
                data: {
                    permissions: {
                        disableSaveButton: false,
                        visibleCustomerLookup: true,
                        visibleUserType: true
                    }
                },
                resolve: {
                    hotel: initialUserPageResolver
                }
            },
            {
                path: 'reset-password/:userId',
                component: UserResetPasswordComponent,
                resolve: {
                    hotel: initialUserPageResolver
                }
            },
            {
                path: 'email/:userId',
                component: UserEmailComponent,
                resolve: {
                    hotel: initialUserPageResolver
                }
            },
            {
                path: 'roles/:userId',
                component: UserRolesComponent,
                resolve: {
                    hotel: initialUserPageResolver
                }
            },
            {
                path: 'picture/:userId',
                component: UserPictureComponent,
                resolve: {
                    risk: initialUserPageResolver
                }
            },
            {
                path: 'permission-settings/:userId',
                component: UserPermissionsComponent,
                resolve: {
                    risk: initialUserPageResolver
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
] as Routes;