import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from 'genesis-components';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    TranslocoModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class ClientsComponent {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  columns: GenesisColumn[] = [
    { field: 'clientId', header: this.translocoService.translate('labels.client-id'), filter: true },
    { field: 'clientName', header: this.translocoService.translate('labels.client-name'), filter: true },
    { field: 'protocolType', header: this.translocoService.translate('labels.protocol-type'), filter: true },
    { field: 'accessTokenType', header: this.translocoService.translate('labels.access-token-type'), filter: true },
    { field: 'enabled', header: this.translocoService.translate('labels.enabled'), type: 'boolean' },
    { field: 'allowOfflineAccess', header: this.translocoService.translate('labels.allow-offline-access'), type: 'boolean' },
    { field: 'identityTokenLifetime', header: this.translocoService.translate('labels.identity-token-lifetime') },
    { field: 'clientClaimsPrefix', header: this.translocoService.translate('labels.client-claims-prefix') },
    { field: 'created', header: this.translocoService.translate('labels.created'), type: 'datetime' },
  ];

  create(): void {
    this.router.navigate(['tenant/clients/create-client']);
  }
}
