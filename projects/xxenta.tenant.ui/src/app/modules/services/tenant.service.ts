import { Injectable } from '@angular/core';
import {
  AppsModel,
  CreateCustomer,
  CustomerModel, MailSettingModel,
  UpdateCustomer,
  ApiScopeModel,
  AddOrRemoveRolePermission,
  SendNotificationToAllClients,
  DeleteAllProgressResponse,
  OrganizationAccountingInfoDto
} from './models/tenant.models';
import { CommandResponse, UserLookupModel, Response, IdNamePair, CoreService, IdNameCodePair } from 'genesis-coreservice';
import { ClaimValuesModel, ClientModel, ClientPermissionModel, RolePermissionModel } from './models/client.model';
import { CreateClientModel, RoleResponse } from 'genesis-components';


@Injectable({
  providedIn: 'root'
})
export class TenantService extends CoreService {
  public GetCustomerById(customerId: string): Promise<CustomerModel> {
    return this.getCall(`Customer/${customerId}`);
  }

  public CreateCustomer(request: CreateCustomer): Promise<CommandResponse<string>> {
    return this.postCall('Customer', request);
  }

  public UpdateCustomer(request: UpdateCustomer): Promise<CommandResponse<string>> {
    return this.putCall(`Customer/${request.id}`, request);
  }

  public DeleteCustomer(customerId: string): Promise<CommandResponse<string>> {
    return this.deleteCall(`Customer/Delete/${customerId}`);
  }

  public GetUserLookUpById(userId: string): Promise<UserLookupModel> {
    return this.getCall(`User/GetUserLookUpById/${userId}`);
  }

  public ChangePasswordAdmin(request: any): Promise<CommandResponse<string>> {
    return this.postCall("User/ChangePasswordAdmin", request);
  }

  public GetRoles(): Promise<RoleResponse[]> {
    return this.getCall(`Role`);
  }

  public GetUserRoles(userId: string): Promise<string[]> {
    return this.getCall(`Role/GetUserRole/${userId}`);
  }

  public GetRolesByCurrentUserId(): Promise<RoleResponse[]> {
    return this.getCall('Role/GetRolesByCurrentUserId');
  }

  public GetAppById(appId: string): Promise<AppsModel> {
    return this.getCall(`Apps/${appId}`);
  }

  public ExistAppCode(code: string): Promise<CommandResponse<boolean>> {
    return this.postCallWithoutToast(`Apps/Existing/${code}`);
  }

  public GetMailSettingByCustomerId(customerId: string): Promise<Response<MailSettingModel>> {
    return this.getCall(`MailSetting/${customerId}`);
  }

  public UpdateApps(appId: string, request: AppsModel): Promise<CommandResponse<string>> {
    return this.putCall(`Apps/${appId}`, request);
  }

  // Client
  public CreateClient(request: CreateClientModel): Promise<CommandResponse<string>> {
    return this.postCall(`Client`, request);
  }

  public UpdateClient(request: CreateClientModel): Promise<CommandResponse<string>> {
    return this.putCall(`Client/${request.clientId}`, request);
  }

  public GetClientByClientId(clientId: string): Promise<ClientModel> {
    return this.getCall(`Client/${clientId}`);
  }

  public GetClientPermissions(clientId: string): Promise<ClientPermissionModel> {
    return this.getCall(`Client/${clientId}/permissions`);
  }

  public GetApiScopes(): Promise<ApiScopeModel[]> {
    return this.getCall(`ApiScope`);
  }

  public ExistApiScopeName(name: string): Promise<CommandResponse<boolean>> {
    return this.postCallWithoutToast(`ApiScope/Existing`, { name: name });
  }

  public ExistApiResourceName(name: string): Promise<CommandResponse<boolean>> {
    return this.postCallWithoutToast(`ApiResource/Existing`, { name: name });
  }

  public GetClaims(): Promise<ClaimValuesModel[]> {
    return this.getCall(`Claim`);
  }

  public GetRolePermissions(roleId: string): Promise<RolePermissionModel[]> {
    return this.getCall(`Role/GetRolePermissions/${roleId}`);
  }

  public AddOrRemoveRolePermission(request: AddOrRemoveRolePermission): Promise<CommandResponse<boolean>> {
    return this.postCall('Role/AddOrRemoveRolePermission', request);
  }
  public SendNotificationToAllClients(request: SendNotificationToAllClients): Promise<CommandResponse<boolean>> {
    return this.postCall('Customer/SendNotificationToAllClients', request);
  }

  public DeleteAllOwnerData(customerId: string): Promise<Response<DeleteAllProgressResponse[]>> {
    return this.deleteCall(`Customer/DeleteAllOwnerData/${customerId}`);
  }

  public ExistIntegrationByCode(code: string): Promise<CommandResponse<boolean>> {
    return this.postCallWithoutToast(`Integration/${code}`);
  }

  public GetIntegrationsLookup(): Promise<IdNameCodePair<string>[]> {
    return this.getCall(`Integration/GetIntegrationsLookup`);
  }

  public DeleteClient(clientId: string): Promise<CommandResponse<string>> {
    return this.deleteCall(`Client/${clientId}`);
  }

  public GetOrganizationAccountingInfo(organizationId: string): Promise<OrganizationAccountingInfoDto> {
    return this.getCall(`OrganizationAccountingInfo/${organizationId}`);
  }

  public CreateOrganizationAccountingInfo(request: OrganizationAccountingInfoDto): Promise<CommandResponse<string>> {
    return this.postCall(`OrganizationAccountingInfo`, request);
  }

  public UpdateOrganizationAccountingInfo(request: OrganizationAccountingInfoDto): Promise<CommandResponse<string>> {
    return this.putCall(`OrganizationAccountingInfo/${request.id}`, request);
  }

  public AddPaymentProcess(): Promise<CommandResponse<string>> {
    return this.postCall(`OrganizationPayment/AddPaymentProcess`, {});
  }

  public PricePushToAccountingProcess(): Promise<CommandResponse<string>> {
    return this.postCall(`Healthy/PricePushToAccountingProcess`, {});
  }

  public CustomerPushToAccountingProcess(): Promise<CommandResponse<string>> {
    return this.postCall(`Healthy/CustomerPushToAccountingProcess`, {});
  }

  presentationTypes: IdNamePair[] = [
    { id: 'Saleable', name: 'Saleable' },
    { id: 'Default', name: 'Default' },
    { id: 'UnSaleable', name: 'UnSaleable' }
  ];
}
