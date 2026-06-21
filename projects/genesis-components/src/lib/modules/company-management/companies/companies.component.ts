import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { Permission } from '../company.models';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoModule,
    ButtonModule,
    TagModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class CompaniesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  permission: Permission = {} as Permission;
  pageTitle: string = '';

  columns: GenesisColumn[] = [
    { field: 'name', header: this.translocoService.translate('labels.name'), sortable: true, filter: true },
    { field: 'officialName', header: this.translocoService.translate('labels.official-name'), sortable: true, filter: true },
    { field: 'code', header: this.translocoService.translate('labels.code'), sortable: true, filter: true },
    { field: 'countryId', header: this.translocoService.translate('labels.country') },
    { field: 'organizationTypes', header: this.translocoService.translate('labels.organization-types') },
  ];

  ngOnInit() {
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    this.pageTitle = this.translocoService.translate(pageTitleKey);
  }

  createAgency(): void {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  editAgency(company: any): void {
    this.router.navigate([`detail/${company.id}`], { relativeTo: this.activatedRoute });
  }
}
