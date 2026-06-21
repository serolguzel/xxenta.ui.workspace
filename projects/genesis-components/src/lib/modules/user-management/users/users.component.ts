import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { UsersComOptions } from '../users-com-options.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    TranslocoModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class UsersComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  options: UsersComOptions = {} as UsersComOptions;
  extraParams: any = {};

  columns: GenesisColumn[] = [
    { field: 'id', header: '', width: '60px' },
    { field: 'firstName', header: this.translocoService.translate('labels.first-name'), sortable: true, filter: true },
    { field: 'lastName', header: this.translocoService.translate('labels.last-name'), sortable: true, filter: true },
    { field: 'userName', header: this.translocoService.translate('labels.username'), sortable: true, filter: true },
    { field: 'email', header: this.translocoService.translate('labels.email'), sortable: true, filter: true },
    { field: 'gender', header: this.translocoService.translate('labels.gender'), sortable: true, filter: true },
    { field: 'company.name', header: this.translocoService.translate('labels.company-name') },
  ];

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data as UsersComOptions;
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    this.options.pageTitle = this.translocoService.translate(pageTitleKey);

    this.extraParams = { ...this.options.extraParams };
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    if (organizationId) {
      this.extraParams.ownerId = organizationId;
    }
  }

  detailRoute(id: string): string {
    return this.options.detailBaseRoute
      ? `${this.options.detailBaseRoute}/detail/${id}`
      : `detail/${id}`;
  }

  createUser(): void {
    this.router.navigate([this.options.createRoute]);
  }
}
