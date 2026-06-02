import { UserType } from "genesis-coreservice";

export interface UsersComOptions {
    pageTitle?: string;
    backPageTitle?: string;
    backRoute?: string;
    createRoute?: string;
    detailBaseRoute?: string | null;
    loadPath?: string;
    extraParams?: any;
    paddingCss?: string;
    userType?: UserType;
    permissions?: PermissionOptions | null;
}

export interface PermissionOptions {
    visibleCustomerLookup?: boolean;
    visibleUserType?: boolean;
    disableSaveButton?: boolean;
    
}