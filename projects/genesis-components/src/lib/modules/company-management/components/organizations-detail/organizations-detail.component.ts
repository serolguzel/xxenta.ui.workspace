import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TagModule } from 'primeng/tag';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../../components/common';

@Component({
  selector: 'organizations-detail',
  templateUrl: './organizations-detail.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoModule,
    TagModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class OrganizationsDetailComponent implements OnInit {
  private readonly translocoService = inject(TranslocoService);

  @Input() parentId: string = '';
  @Input() isTenant: boolean = true;

  extraParams: any = {};

  columns: GenesisColumn[] = [
    { field: 'name', header: this.translocoService.translate('labels.name'), sortable: true, filter: true },
    { field: 'officialName', header: this.translocoService.translate('labels.official-name'), sortable: true, filter: true },
    { field: 'code', header: this.translocoService.translate('labels.code'), sortable: true, filter: true },
    { field: 'countryId', header: this.translocoService.translate('labels.country') },
    { field: 'organizationTypes', header: this.translocoService.translate('labels.organization-types') },
    { field: 'isDeleted', header: this.translocoService.translate('labels.is-deleted'), type: 'boolean' },
    { field: 'isTenant', header: this.translocoService.translate('labels.is-tenant'), type: 'boolean' },
  ];

  ngOnInit(): void {
    this.extraParams = { parentId: this.parentId, isTenant: this.isTenant };
  }
}
