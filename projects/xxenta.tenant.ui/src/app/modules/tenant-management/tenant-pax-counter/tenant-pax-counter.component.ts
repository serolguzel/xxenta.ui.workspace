import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GenesisColumn, GenesisDataTableComponent } from 'genesis-components';

@Component({
  selector: 'app-tenant-pax-counter',
  templateUrl: './tenant-pax-counter.component.html',
  standalone: true,
  imports: [
    TranslocoModule,
    GenesisDataTableComponent
  ]
})
export class TenantPaxCounterComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  loadPath: string = '';

  columns: GenesisColumn[] = [
    { field: 'total', header: this.translocoService.translate('labels.total'), type: 'text', sortable: true, filter: true },
    { field: 'beginDate', header: this.translocoService.translate('labels.begin-date'), type: 'date', sortable: true },
    { field: 'endDate', header: this.translocoService.translate('labels.end-date'), type: 'date', sortable: true },
    { field: 'createDate', header: this.translocoService.translate('labels.create-date'), type: 'datetime', sortable: true },
  ];

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadPath = `Customer/PaxCounter/${organizationId}`;
  }
}
