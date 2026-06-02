import { Injectable } from '@angular/core';
import { CodeNamePair, CommandResponse, CompanyLookupModel, CoreService, IdNamePair } from 'genesis-coreservice';
import { AppsModel, CreateOrganization, CreateOrganizationApp, CreateOrganizationLogo, DisabledOrganization, NavigationModel, OrganizationAppsModel, OrganizationModel, OrganizationRecursiveModel, OrganizationSettingsModel, SaveSettings, SubscriptionModel, UpdateOrganization } from '../company.models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends CoreService {
  public CreateOrganization(request: CreateOrganization): Promise<CommandResponse<string>> {
    return this.postCall('Organization', request);
  }

  public GetOrganizationById(id: string): Promise<OrganizationModel> {
    return this.getCall(`Organization/${id}`);
  }

  public GetOrganizationRecursiveById(id: string): Promise<OrganizationRecursiveModel> {
    return this.getCall(`Organization/GetOrganizationRecursiveById/${id}`);
  }

  public UpdateOrganization(request: UpdateOrganization): Promise<CommandResponse<string>> {
    return this.putCall(`Organization/${request.id}`, request);
  }

  public ExistOrganizationCode(code: string): Promise<CommandResponse<boolean>> {
    return this.postCallWithoutToast(`Organization/Existing/${code}`);
  }

  public DeleteOrganization(id: string): Promise<CommandResponse<string>> {
    return this.deleteCall(`Organization/${id}`);
  }

  public DisabledOrganization(request: DisabledOrganization): Promise<CommandResponse<boolean>> {
    return this.postCall('Organization/DisabledOrganization', request);
  }

  public GetOrganizationsLookup(organizationId: string): Promise<CompanyLookupModel> {
    return this.getCall(`Organization/GetOrganizationsLookup/${organizationId}`);
  }

  public CreateOrganizationLogo(organizationId: string, request: CreateOrganizationLogo): Promise<CommandResponse<boolean>> {
    return this.postCall(`OrganizationLogo/${organizationId}`, request);
  }

  public GetCitiesByCountryId(countryId: string): Promise<IdNamePair[]> {
    return this.getCall(`Cities/${countryId}`);
  }

  public GetAppsLookup(): Promise<IdNamePair[]> {
    return this.getCall('Apps/GetAppsLookup');
  }

  public GetApps(request?: any): Promise<AppsModel[]> {
    return this.getCall('Apps', request);
  }

  public GetSettings(ownerId: string): Promise<OrganizationSettingsModel[]> {
    return this.getCall(`Setting/${ownerId}`);
  }
  public SaveSettings(ownerId: string, request: SaveSettings): Promise<CommandResponse<number>> {
    return this.postCall(`Setting/${ownerId}`, request);
  }

  public DeleteSettings(ownerId: string, key: string): Promise<CommandResponse<boolean>> {
    return this.deleteCall(`Setting/${ownerId}/${key}`);
  }

  public GetOrganizationApps(ownerId: string): Promise<OrganizationAppsModel[]> {
    return this.getCall(`OrganizationApps/${ownerId}`);
  }

  public GetOrganizationAppByAppId(request: any): Promise<OrganizationAppsModel> {
    return this.getCall(`OrganizationApps/GetOrganizationAppByAppId`, request);
  }
  
  public CreateOrganizationApp(request: CreateOrganizationApp): Promise<CommandResponse<boolean>> {
    return this.postCall(`OrganizationApps/${request.organizationId}`, request);
  }

  public UpdateOrganizationApp(request: CreateOrganizationApp): Promise<CommandResponse<boolean>> {
    return this.putCall(`OrganizationApps/${request.organizationId}/${request.appId}`, request);
  }

  public GetNavigationsByAppId(appId: string): Promise<NavigationModel[]> {
    return this.getCall(`Navigation/${appId}`);
  }
  get priceCalculatorTypes(): string[] {
    return ['None', 'Fix', 'PerPax', 'PerReservation', 'PerRequest'];
  }
  get paymentTypes(): string[] {
    return ['None', 'PerMonth', 'PerYear'];
  }
  get weOrbisCurrencies(): string[] {
    return ['EUR', 'USD', 'TRY'];
  }
  get appTypes(): string[] {
    return ["Web", "Mobile", "TV", "Watch", "IntegrationService"];
  }
  get OrganizationTypes(): CodeNamePair[] {
    return [
      { code: 'Agency', name: 'Agency' },
      { code: 'Operator', name: 'Operator' },
      { code: 'Supplier', name: 'Supplier' },
      { code: 'TourCompany', name: 'Tour Company' },
      { code: 'VehicleCompany', name: 'Vehicle Company' },
      { code: 'GuideCompany', name: 'Guide Company' }
    ]
  }

  get presentationTypes(): IdNamePair[] {
    return [
      { id: 'Saleable', name: 'Saleable' },
      { id: 'Default', name: 'Default' },
      { id: 'UnSaleable', name: 'UnSaleable' }
    ];
  }

  get stateTypes(): CodeNamePair[] {
    return [
      { code: 'HotelReservation', name: 'HotelReservation' },
      { code: 'Transfer', name: 'Transfer' },
      { code: 'Excursion', name: 'Excursion' }
    ];
  }
}