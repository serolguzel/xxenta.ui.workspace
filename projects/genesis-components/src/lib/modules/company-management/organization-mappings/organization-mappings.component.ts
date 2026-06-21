import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'app-organization-mappings',
  templateUrl: './organization-mappings.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    FloatLabelModule,
    InputTextModule,
    GenesisDataTableComponent,
    GenesisCellDirective
  ]
})
export class OrganizationMappingsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  loadPath: string = '';
  pageTitle: string = '';

  columns: GenesisColumn[] = [
    { field: 'oprVoucher', header: this.translocoService.translate('labels.opr-voucher'), filter: true },
    { field: 'externalProvider', header: this.translocoService.translate('labels.external-provider'), filter: true },
  ];

  ngOnInit(): void {
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    this.pageTitle = this.translocoService.translate(pageTitleKey);
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadPath = `OrganizationMapping/${organizationId}`;
  }
}
