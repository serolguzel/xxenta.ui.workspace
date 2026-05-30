import { ClientSecretModel } from "genesis-components";

export interface ClientModel {
    id: number;
    ownerId: string;
    operatorCode: string | null;
    enabled: boolean;
    clientId: string;
    protocolType: string;
    requireClientSecret: boolean;
    clientName: string;
    description: string;
    clientUri: string;
    logoUri: string;
    requireConsent: boolean;
    allowRememberConsent: boolean;
    alwaysIncludeUserClaimsInIdToken: boolean;
    requirePkce: boolean;
    allowPlainTextPkce: boolean;
    requireRequestObject: boolean;
    allowAccessTokensViaBrowser: boolean;
    frontChannelLogoutUri: string;
    frontChannelLogoutSessionRequired: boolean;
    backChannelLogoutUri: string;
    backChannelLogoutSessionRequired: boolean;
    allowOfflineAccess: boolean;
    identityTokenLifetime: number;
    allowedIdentityTokenSigningAlgorithms: string;
    accessTokenLifetime: number;
    authorizationCodeLifetime: number;
    consentLifetime: number | null;
    absoluteRefreshTokenLifetime: number;
    slidingRefreshTokenLifetime: number;
    refreshTokenUsage: number;
    updateAccessTokenClaimsOnRefresh: boolean;
    refreshTokenExpiration: number;
    accessTokenType: number;
    enableLocalLogin: boolean;
    includeJwtId: boolean;
    alwaysSendClientClaims: boolean;
    clientClaimsPrefix: string;
    pairWiseSubjectSalt: string;
    created: string;
    updated: string | null;
    lastAccessed: string | null;
    userSsoLifetime: number | null;
    userCodeType: string;
    deviceCodeLifetime: number;
    nonEditable: boolean;
    allowedGrantTypes: string[];
    clientSecrets: ClientSecretModel[];

    allowedScopes: string[];
    redirectUris: string[];
    postLogoutRedirectUris: string[];
    allowedCorsOrigins: string[];
}

export interface ClientPermissionModel {
    client: ClientModel;
    claims: ClientClaimModel[];
}


export interface ClientClaimModel {
    id: number;
    type: string;
    value: string;
    description: string;
}

export interface ClaimValuesModel {
    code: string;
    state: string;
    hasTenant: boolean;
    description: string | null;
}

export interface RolePermissionModel {
    moduleName: string;
    permissions: RolePermission[];
}

export interface RolePermission {
    module: string;
    roleId: string;
    claimValue: string;
    hasRole: boolean;
}