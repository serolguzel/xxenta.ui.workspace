import { ApiClientConfig, IAppConfig, IAuthConfig } from "genesis-coreservice";

export const environment = {
  production: false,
  hmr: false,
  apiClientConfig: <ApiClientConfig>(<unknown>{
    apiHost: 'https://xtenant.weorbis.com/v1',
    notifyHost: 'https://xtenant.weorbis.com',
    notifyHubName: 'PushNotification',
  }),
  authConfig: <IAuthConfig><unknown>{
    issuer: 'https://xid.weorbis.com/',
    redirectUri: 'http://localhost:4000/callback',
    postLogoutRedirectUri: 'http://localhost:4000/logout',
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
    authPageLogo: 'https://meta.weorbis.com/xxenta/logos/xxenta_letters.png',
    sideBarLogo: 'https://meta.weorbis.com/xxenta/logos/xxenta_symbol.png',
    sideBarCompanyName: 'BACKOFFICE',
    sideBarFlueLogo: 'https://meta.weorbis.com/xxenta/logos/xxenta_symbol.png',
    showLanguage: false,
    showNotification: true,
    showApps: true,
    showChatAgent: false,
    defaultRoute: 'tenant/dashboard',
    userProfileRoute: 'http://localhost:4700/profile/dashboard',
    userSettingRoute: 'http://localhost:4700/profile/payments',
    paymentUrl: 'http://localhost:4700/profile/subscriptions'
  }
};
