export interface CreateClientModel {
    ownerId: string;
    operatorCode:string | null;
    clientId: string;
    clientSecret: string | null;
    clientSecrets: ClientSecretModel[];
    clientName: string;
    allowOfflineAccess: boolean;
    accessTokenLifetime: number;
    allowedGrantTypes: string[];
    allowedScopes: string[];
    redirectUris: string[];
    postLogoutRedirectUris: string[];
    allowedCorsOrigins: string[];
}

export interface ClientSecretModel {
    value: string;
    secret: string;
}