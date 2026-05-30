import { AppPresentationType } from "genesis-components";
import { BaseEntityModel, IdNameCodePair } from "genesis-coreservice";

export interface CreateCustomer {
    name: string;
    code: string;
    keyUser: CustomerKeyUser;
}

export interface UpdateCustomer extends CreateCustomer {
    id: string | null;
    keyUserId: string | null;
}

export interface CustomerKeyUser {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface CustomerModel extends BaseEntityModel, UpdateCustomer {

}

export interface ChangePasswordAdmin {
    userId: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AppsModel {
    id: string;
    code: string;
    name: string;
    description: string | null;
    icon: string | null;
    link: string;
    useRouter: boolean;
    noShow: boolean;
    parentId: string | null;
    presentationType: AppPresentationType;
    clientId: string;
    price?: number;
    currency?: string;
}


export interface SaveMailSetting {
    customerId: string;
    host: string;
    port: number;
    username: string;
    pasword: string;
    displayName: string;
}

export interface MailSettingModel extends BaseEntityModel, SaveMailSetting {

}

export interface ApiScopeModel {
    name: string;
    displayName: string;
}

export interface AddOrRemoveRolePermission {
    roleId: string;
    claimValue: string;
    hasRole: boolean;
}

export interface SendNotificationToAllClients {
    text: string;
}

export interface DeleteAllProgressResponse {
    message: string;
    status: string;
}
export interface OrganizationAccountingInfoDto {
    id: string;
    organizationId: string;
    officialName: string;
    officialAddress: string;
    taxNumber: string;
    taxOffice: string | null;
    organization: IdNameCodePair<string>;
}