import { Component, OnInit } from '@angular/core';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { Router } from '@angular/router';
import { ClientFormComponent, CreateClientModel } from 'genesis-components';
import { AuthService, CommandResponse, UserModel } from 'genesis-coreservice';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  standalone: true,
  imports: [
    GenesisBreadcrumbsComponent,
    ClientFormComponent
  ],
  providers: [
    TenantService
  ]
})
export class ClientCreateComponent implements OnInit {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  client: CreateClientModel = <CreateClientModel><unknown>{
    allowOfflineAccess: true,
    accessTokenLifetime: 72000,
    redirectUris: [],
    postLogoutRedirectUris: [],
    allowedCorsOrigins: [],
    allowedGrantTypes: [],
    allowedScopes: [],
    requirePkce: true,
    requireClientSecret: false,
    requireConsent: false,
  };

  hasCreate: boolean = false;
  constructor(
    private tenantService: TenantService,
    private authService: AuthService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.breadcrumbs = [
      {
        title: 'Clients',
        link: '/tenant/clients'
      },
      {
        title: 'Create Client'
      }
    ];
    this.authService.getProfile().then((data: UserModel) => {
      this.hasCreate = data.isSystemAdmin || false;
    });

  }

  save(e: CreateClientModel) {
    this.tenantService.CreateClient(e).then((res: CommandResponse<string>) => {
      if (res) {
        this.router.navigate([`/tenant/clients/detail/${res.aggregatorId}`]);
      }
    });
  }
}