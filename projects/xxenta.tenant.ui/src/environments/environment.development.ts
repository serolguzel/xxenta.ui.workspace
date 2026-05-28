import { ApiClientConfig, IAppConfig, IAuthConfig } from "genesis-coreservice";

export const environment = {
  production: false,
  hmr: false,
  apiClientConfig: <ApiClientConfig>(<unknown>{
    apiHost: 'https://api-test.weorbis.com/v1',
    notifyHost: 'https://api-test.weorbis.com',
    notifyHubName: 'PushNotification',
  }),
  authConfig: <IAuthConfig><unknown>{
    issuer: 'https://auth-test.weorbis.com',
    redirectUri: 'http://localhost:4900/callback',
    postLogoutRedirectUri: 'http://localhost:4900/logout',
    clientId: 'genesis.guide.ui',
    dummyClientSecret: '466269bc-ff5f-46fa-9b2b-64891d0bf4a8',
    scope: 'address email offline_access permission profile phone owner_id IdentityServerApi openid role',
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
    sideBarLogo: 'https://meta.weorbis.com/logos/logo_circuler.png',
    sideBarCompanyName: 'GUIDE',
    sideBarFlueLogo: './images/logo/only_logo.png',
    showLanguage: true,
    showNotification: true,
    showApps: true,
    showChatAgent: false,
    defaultRoute: 'guide/dashboard',
    userProfileRoute: 'http://localhost:4700/profile/dashboard',
    userSettingRoute: 'http://localhost:4700/profile/payments',
    paymentUrl: 'http://localhost:4700/profile/subscriptions'
  }
};
