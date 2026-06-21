import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CodeNamePair, CoreService } from 'genesis-coreservice';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { OrganizationType } from '../company.models';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: 'app-organization-parnter-permissions',
  templateUrl: './organization-parnter-permissions.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    MultiSelectModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
  providers: [OrganizationService]
})
export class OrganizationParnterPermissionsComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly organizationService = inject(OrganizationService);
  private readonly cdr = inject(ChangeDetectorRef);

  loadPath: string = '';
  extraParams: any = {};
  newRowDefaults: any = {};

  partners: any[] = [];
  operators: any[] = [];
  stateTypes: CodeNamePair[] = [];

  columns: GenesisColumn[] = [
    { field: 'partnerName', header: 'labels.partner', filter: true },
    { field: 'operatorName', header: 'labels.operator', filter: true },
    { field: 'stateTypes', header: 'labels.state-types' },
    { field: 'read', header: 'labels.read', type: 'boolean' },
    { field: 'write', header: 'labels.write', type: 'boolean' },
  ];

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    const partnerId = this.activatedRoute.snapshot.params['partnerId'];

    this.loadPath = `DataSharing/${organizationId}`;
    this.extraParams = { partnerId: partnerId };
    this.newRowDefaults = { ownerId: organizationId, partnerId: partnerId, read: false, write: false, stateTypes: [] };
    this.stateTypes = this.organizationService.stateTypes;

    this.coreService
      .getCall('Organization/GetOrganizationsLookup', { requireTotalCount: true, isTenant: true })
      .then((data: any) => {
        this.partners = Array.isArray(data) ? data : (data?.data ?? []);
        this.cdr.detectChanges();
      });

    this.coreService
      .getCall(`OrganizationPartner/GetPartnersLookup/${organizationId}`, {
        requireTotalCount: false,
        organizationTypes: JSON.stringify([OrganizationType.Agency, OrganizationType.Operator, OrganizationType.Supplier])
      })
      .then((data: any) => {
        this.operators = Array.isArray(data) ? data : (data?.data ?? []);
        this.cdr.detectChanges();
      });
  }
}
