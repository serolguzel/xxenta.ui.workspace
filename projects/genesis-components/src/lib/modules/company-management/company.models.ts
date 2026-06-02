import { BaseEntityModel, CompanyLookupModel, IdNamePair } from "genesis-coreservice";

export interface Permission {
    create: boolean;
    update: boolean;
    delete: boolean;
    trash: boolean;
}

export enum OrganizationType {
    Agency = 'Agency',
    Operator = 'Operator',
    Supplier = 'Supplier',
    TourCompany = 'TourCompany',
    VehicleCompany = 'VehicleCompany',
    GuideCompany = 'GuideCompany',
}

export interface CreateOrganization {
    code: string;
    name: string;
    officialName: string | null;
    parentId: string | null;
    webSite: string | null;
    cityId: string | null;
    countryId: string | null;
    address: string | null;
    lock: boolean;
    isTenant: boolean;
    organizationTypes: OrganizationType[];
}

export interface UpdateOrganization extends CreateOrganization {
    id: string;
    isDeleted: boolean;
}

export interface OrganizationModel extends BaseEntityModel, UpdateOrganization {

}

export interface OrganizationRecursiveModel extends CompanyLookupModel {
    parentId: string | null;
    isTenant: boolean;
    parent: OrganizationRecursiveModel | null;
}

export interface CreateOrganizationLogo {
    name: string;
    logo: string;
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
    price: number | null,
    currency: string | null;
    appType: AppType,
    presentationType: AppPresentationType;
}

export enum AppPresentationType {
    Saleable = 'Saleable',
    Default = 'Default',
    UnSaleable = 'UnSaleable'
}

export interface DisabledOrganization {
    organizationId: string;
    lock: boolean;
}

export interface OrganizationSettingsModel {
    id: number;
    key: string;
    value: string;
    organizationId: string;
}

export interface SaveSettings {
    key: string;
    value: string;
}

export interface OrganizationAppsModel {
    appId: string;
    organizationId: string;
    registerDate: string;
    price: number;
    currency: string;
    url: string | null;
    app: AppModel;
    organization: IdNamePair;
    priceCalculatorType: PriceCalculatorType;
    presentationType: AppPresentationType;
    paymentType: PaymentType;
    appType: AppType,
    isSelected: boolean;
    subApps: OrganizationAppsModel[] | null
}

export interface CreateOrganizationApp {
    organizationId: string;
    appId: string;
    parentId: string | null;
    price: number;
    currency: string;
    url: string | null;
    priceCalculatorType: PriceCalculatorType;
    paymentType: PaymentType;
    appType: AppType,
    subApps: CreateOrganizationApp[] | null;
}

export enum PriceCalculatorType {
    None,
    Fix,
    PerPax,
    PerReservation,
    PerRequest
}

export enum PaymentType {
    None = 'None',
    PerMonth = 'PerMonth',
    PerYear = 'PerYear'
}

export enum AppType {
    Web = 'Web',
    Mobile = 'Mobile',
    TV = 'TV',
    Watch = 'Watch',
    IntegrationService = 'IntegrationService'
}

export interface NavigationModel extends BaseEntityModel {
    title: string;
    subtitle: string | null;
    type: NavigationType;
    active: boolean | null;
    disabled: boolean | null;
    translationKey: string | null;
    appsId: string;
}

export enum NavigationType {
    aside,
    basic,
    collapsable,
    divider,
    group,
    spacer
}

export interface AppModel {
    id: string;
    name: string;
    icon: string | null;
}

export interface SubscriptionModel {
  appId: string;
  parentId: string | null;
  appName: string;
  appDescription: string | null;
  appIcon: string | null;
  organizationId: string | null;
  registerDate: string | null;
  price: number;
  totalAmount: number;
  currency: string | null;
  isLock: boolean;
  priceCalculatorType: PriceCalculatorType;
  paymentType: PaymentType;
  presentationType: AppPresentationType;
  appType: AppType;
  isSelected: boolean;
  subApps: SubscriptionModel[] | null;
  unSubscribe: boolean;
}