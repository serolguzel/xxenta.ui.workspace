import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { TagModule } from 'primeng/tag';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { OrganizationsDetailComponent } from '../components/organizations-detail/organizations-detail.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TagModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
    OrganizationsDetailComponent,
  ]
})
export class OrganizationsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  options: any = {};

  columns: GenesisColumn[] = [
    { field: 'name', header: this.translocoService.translate('labels.name'), sortable: true, filter: true },
    { field: 'officialName', header: this.translocoService.translate('labels.official-name'), sortable: true, filter: true },
    { field: 'code', header: this.translocoService.translate('labels.code'), sortable: true, filter: true },
    { field: 'countryId', header: this.translocoService.translate('labels.country') },
    { field: 'organizationTypes', header: this.translocoService.translate('labels.organization-types') },
    { field: 'isDeleted', header: this.translocoService.translate('labels.is-deleted'), type: 'boolean' },
    { field: 'isTenant', header: this.translocoService.translate('labels.is-tenant'), type: 'boolean' },
  ];

  ngOnInit() {
    this.options = this.activatedRoute.snapshot.data;
  }

  createOrganization(): void {
    this.router.navigate([this.options.createRoute]);
  }
}
