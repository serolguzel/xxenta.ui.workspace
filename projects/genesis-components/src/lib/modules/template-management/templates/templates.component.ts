import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TagModule } from 'primeng/tag';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'lib-templates',
  standalone: true,
  templateUrl: './templates.component.html',
  imports: [
    RouterLink,
    TranslocoModule,
    TagModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class TemplatesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  options: any = {};

  columns: GenesisColumn[] = [
    { field: 'code', header: this.translocoService.translate('labels.code'), sortable: true, filter: true },
    { field: 'title', header: this.translocoService.translate('labels.title'), sortable: true, filter: true },
    { field: 'language', header: this.translocoService.translate('labels.language'), filter: true },
    { field: 'templateStatus', header: this.translocoService.translate('labels.template-types') },
    { field: 'itemType', header: this.translocoService.translate('labels.type') },
  ];

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
  }

  createTemplate(): void {
    this.router.navigate([this.options.createRoute]);
  }
}
