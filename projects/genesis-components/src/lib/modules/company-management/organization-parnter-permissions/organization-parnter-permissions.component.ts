import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CodeNamePair } from 'genesis-coreservice';
import { OrganizationService } from '../services/organization.service';
import { LookupService } from '../../../services/lookup.service';
import { OrganizationType } from '../company.models';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-parnter-permissions',
  templateUrl: './organization-parnter-permissions.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    TranslocoModule
  ],
  providers: [
    OrganizationService,
    LookupService
  ]
})
export class OrganizationParnterPermissionsComponent implements OnInit {
  dataSource: CustomStore;
  isUpdate: boolean = false;
  partnerLookUpOptions: any;
  customerLookUpOptions: any = {};
  stateTypes: CodeNamePair[];
  constructor(
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    public lookupService: LookupService
  ) {
    this.partnerLookUpOptions = this.lookupService.customerLookUpOptions({ isTenant: true });
    this.stateTypes = this.organizationService.stateTypes;
  }
  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    let partnerId = this.activatedRoute.snapshot.params['partnerId'];
    this.customerLookUpOptions = this.lookupService.lookUpCompanyOptionsForTenant(organizationId,[OrganizationType.Agency, OrganizationType.Operator, OrganizationType.Supplier]);
    this.dataSource = new DataSourceBuilder(this.organizationService)
      .load(`DataSharing/${organizationId}`, { partnerId: partnerId })
      .insert(`DataSharing`)
      .remove('DataSharing')
      .setKey('id')
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
  onInitNewRow = (e: any) => {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    let partnerId = this.activatedRoute.snapshot.params['partnerId'];
    e.data['ownerId'] = organizationId;
    e.data['partnerId'] = partnerId;
  }
}
