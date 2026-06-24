import { ApiClientConfig, IAppConfig, IAuthConfig } from "genesis-coreservice";

export const environment = {
  production: false,
  hmr: false,
  apiClientConfig: <ApiClientConfig>(<unknown>{
    apiHost: 'https://tenant-api.dev.xxenta.eu/v1',
    notifyHost: 'https://tenant-api.xxenta.eu',
    notifyHubName: 'PushNotification',
  }),
  authConfig: <IAuthConfig><unknown>{
    issuer: 'https://auth.dev.xxenta.eu/',
    redirectUri: 'https://tenant.dev.xxenta.eu/callback',
    postLogoutRedirectUri: 'https://tenant.dev.xxenta.eu/logout',
    clientId: 'xxenta.tenant.ui',
    dummyClientSecret: '812f66a1cdc44de5a5a9eb310e2baa86',
    scope: 'profile email roles xxenta.tenant.api owner_id permission',
    responseType: 'code',
    automaticSilentRenew: false,
    monitorSession: false,
    showDebugInformation: true,
    useSilentRefresh: true,
    sessionChecksEnabled: true,
    timeoutFactor: 12,
    disablePKCE: false,
  },
  appConfig: <IAppConfig>{
    authPageLogo: 'https://meta.weorbis.com/xxenta/logos/logo_letters.png',
    sideBarLogo: 'https://meta.weorbis.com/xxenta/logos/logo_symbol.png',
    sideBarCompanyName: 'BACKOFFICE',
    sideBarFlueLogo: 'https://meta.weorbis.com/xxenta/logos/logo_symbol.png',
    showLanguage: false,
    showNotification: true,
    showApps: true,
    showChatAgent: false,
    defaultRoute: 'tenant/dashboard',
    userProfileRoute: 'https://profile.xxenta.eu/profile/dashboard',
    userSettingRoute: 'https://profile.xxenta.eu/profile/payments',
    paymentUrl: 'https://profile.xxenta.eu/profile/subscriptions'
  }
};
