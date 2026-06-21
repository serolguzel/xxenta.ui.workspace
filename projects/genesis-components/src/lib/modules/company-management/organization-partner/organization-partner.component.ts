import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'app-organization-partner',
  templateUrl: './organization-partner.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class OrganizationPartnerComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly coreService = inject(CoreService);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  loadPath: string = '';
  insertPath: string = '';
  newRowDefaults: any = {};
  partnerOptions: any[] = [];

  columns: GenesisColumn[] = [
    { field: 'fromOrganization.name', header: this.translocoService.translate('labels.from'), filter: true },
    { field: 'toOrganization.name', header: this.translocoService.translate('labels.to'), filter: true },
    { field: 'fromConfirm', header: this.translocoService.translate('labels.from-confirm'), type: 'boolean' },
    { field: 'toConfirm', header: this.translocoService.translate('labels.to-confirm'), type: 'boolean' },
  ];

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadPath = `OrganizationPartner/${organizationId}`;
    this.insertPath = `OrganizationPartner/AddPartner/${organizationId}`;
    this.newRowDefaults = { fromOrganizationId: organizationId, fromConfirm: true, toConfirm: true };

    this.coreService.getCall('Organization/GetOrganizationsLookup', { requireTotalCount: false }).then((data: any) => {
      this.partnerOptions = Array.isArray(data) ? data : (data?.data ?? []);
      this.cdr.detectChanges();
    });
  }
}
