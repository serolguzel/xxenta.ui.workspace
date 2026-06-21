import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: 'app-organization-branches',
  templateUrl: './organization-branches.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoModule,
    GenesisDataTableComponent,
    GenesisCellDirective
  ],
  providers: [OrganizationService]
})
export class OrganizationBranchesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  loadPath: string = '';
  options: any = {};

  columns: GenesisColumn[] = [
    { field: 'name', header: this.translocoService.translate('labels.name'), filter: true },
    { field: 'officialName', header: this.translocoService.translate('labels.official-name'), filter: true },
    { field: 'code', header: this.translocoService.translate('labels.code'), filter: true },
    { field: 'countryId', header: this.translocoService.translate('labels.country'), filter: true },
    { field: 'organizationTypes', header: this.translocoService.translate('labels.organization-types') },
    { field: 'isDeleted', header: this.translocoService.translate('labels.is-deleted'), type: 'boolean' },
  ];

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.options = this.activatedRoute.snapshot.data;
    this.loadPath = `OrganizationBranch/${organizationId}`;
  }

  createOrganization(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.router.navigate([this.options.createRoute.replace(':organizationId', organizationId)]);
  }
}
