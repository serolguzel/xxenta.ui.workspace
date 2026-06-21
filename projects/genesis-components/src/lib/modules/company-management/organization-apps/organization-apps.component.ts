import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: 'app-organization-apps',
  templateUrl: './organization-apps.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoModule,
    ButtonModule,
    GenesisDataTableComponent,
    GenesisCellDirective
  ],
  providers: [OrganizationService]
})
export class OrganizationAppsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  organizationId: string = '';
  loadPath: string = '';
  deletePath: string = '';

  columns: GenesisColumn[] = [
    { field: 'app.name', header: this.translocoService.translate('labels.app'), filter: true },
    { field: 'organization.name', header: this.translocoService.translate('labels.customer'), filter: true },
    { field: 'registerDate', header: this.translocoService.translate('labels.register-date') },
    { field: 'price', header: this.translocoService.translate('labels.price') },
    { field: 'priceCalculatorType', header: this.translocoService.translate('labels.price-calculator-type') },
    { field: 'paymentType', header: this.translocoService.translate('labels.payment-type') },
  ];

  ngOnInit(): void {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadPath = `OrganizationApps/${this.organizationId}`;
    this.deletePath = `OrganizationApps/${this.organizationId}`;
  }

  saveApp(): void {
    this.router.navigate([`/tenant/tenants/apps/${this.organizationId}/add-app`], { relativeTo: this.activatedRoute });
  }
}
