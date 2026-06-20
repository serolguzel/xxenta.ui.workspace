import { Gender, UserType } from "genesis-coreservice";

export interface BaseUser {
    firstName: string;
    lastName: string;
    userName: string;
    email: string | null;
    ownerId: string | null;
    phoneAreaCode: string | null;
    phoneNumber: string | null;
    picture: string | null;
    defaultRoute: string | null;
    departmentId: string | null;
    gender: Gender | null;
    userType: UserType;
    identityNumber: string | null;
    isActive: boolean;
    emailConfirmed: boolean;
}

export interface CreateUser extends BaseUser {
    id?: string;
}

export interface UpdateUser extends BaseUser {
    id: string;
}

export interface UserModel extends BaseUser {
    id: string;
    userName: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    lockoutEnabled: boolean;
    company?: UserModelCompany | null;
}

export interface UserModelCompany {
    id: string;
    name: string;
    code: string;
    logos: string[];
}

export interface UpdateUserEmail {
    userId: string;
    email: string;
}

export interface ChangePasswordAdmin {
    userId: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserRoleModel {
    userId: string;
    roleIds: string[];
}

export interface RoleResponse {
    id: string;
    name: string;
    normalizedName: string;
}

export interface UserRoleResponse {
    userId: string;
    roleId: string;
}

export const userMapping = {
    UserModelToUpdateUserModel(data: UserModel): UpdateUser {
        return {
            id: data.id,
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            ownerId: data.ownerId,
            phoneAreaCode: data.phoneAreaCode,
            phoneNumber: data.phoneNumber,
            picture: data.picture,
            defaultRoute: data.defaultRoute,
            departmentId: data.departmentId,
            gender: data.gender,
            userType: data.userType ?? UserType.User,
            identityNumber: data.identityNumber,
            isActive: data.isActive,
            emailConfirmed: data.emailConfirmed
        };
    }
};