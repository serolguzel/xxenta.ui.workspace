import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ClientFormComponent, ClientSecretModel, CreateClientModel, LookupService } from 'genesis-components';
import { AuthService, CommandResponse, ConstantRoles, UserModel } from 'genesis-coreservice';
import { ClientModel } from '../../services/models/client.model';
import { TenantService } from '../../services/tenant.service';
import { DxButtonModule } from 'devextreme-angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ClientFormComponent,
    DxButtonModule,
    TranslocoModule
  ],
  providers: [
    TenantService,
    LookupService
  ]
})
export class ClientDetailComponent implements OnInit {
  @ViewChild(ClientFormComponent, { static: false }) clientForm: ClientFormComponent;
  client: CreateClientModel = <CreateClientModel>{
    clientSecrets: []
  };
  hasCreate: boolean = true;
  hasDeleteButton: boolean = false;
  tenantsLookUpOptions: any = this.lookupService.customerLookUpOptions({ isTenant: true });
  constructor(
    private tenantService: TenantService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private router: Router
  ) {

  }
  ngOnInit(): void {

    this.authService.getProfile().then((data: UserModel) => {
      var hasPermission = data.role.includes(ConstantRoles.SystemAdmin) || data.role.includes(ConstantRoles.SuperAdmin) || data.role.includes(ConstantRoles.Admin);
      this.hasCreate = hasPermission;
      this.hasDeleteButton = hasPermission;
    });
    let clientId = this.activatedRoute.snapshot.params.clientId;
    this.tenantService.GetClientByClientId(clientId).then((res: ClientModel) => {
      if (res) {
        this.client = this.Map(res);
        this.clientForm.setIsCode(this.client);
        this.clientForm.setOptions(this.client);
      }
    });
  }

  onSaveClick = (e: CreateClientModel) => {
    this.tenantService.UpdateClient(e);
  }

  deleteItem(e: CreateClientModel) {
    this.tenantService.DeleteClient(e.clientId).then((res: CommandResponse<string>) => {
      if (res) {
        this.router.navigate(['identity/clients']);
      }
    });
  }
  generateClinetSecret(e: any) {
    let clientSecret = crypto.randomUUID();
    this.client.clientSecret = clientSecret;
    if (this.client.clientSecrets.length > 0)
      this.client.clientSecrets[0].value = clientSecret;
    else {
      this.client.clientSecrets = [<ClientSecretModel>{ value: clientSecret }]
    }
  }

  private Map(data: ClientModel): CreateClientModel {
    if(data.clientSecrets?.length == 0){
      data.clientSecrets = [];
    }
    return <CreateClientModel>{
      ownerId: data.ownerId,
      clientId: data.clientId,
      operatorCode: data.operatorCode,
      clientName: data.clientName,
      clientSecrets: data.clientSecrets ?? [],
      allowedGrantTypes: data.allowedGrantTypes,
      allowOfflineAccess: data.allowOfflineAccess,
      accessTokenLifetime: data.accessTokenLifetime,
      allowedScopes: data.allowedScopes,
      redirectUris: data.redirectUris,
      postLogoutRedirectUris: data.postLogoutRedirectUris,
      allowedCorsOrigins: data.allowedCorsOrigins
    };
  }
}
