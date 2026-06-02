import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { OrganizationService } from '../services/organization.service';
import { LookupService } from '../../../services/lookup.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-partner',
  templateUrl: './organization-partner.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    TranslocoModule
  ],
  providers: [
    LookupService
  ]
})
export class OrganizationPartnerComponent implements OnInit {
  dataSource: CustomStore;
  isUpdate: boolean = false;
  customerLookUpOptions: any;
  constructor(
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    public lookupService: LookupService
  ) {
    this.customerLookUpOptions = this.lookupService.customerLookUpOptions({});
  }
  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];

    this.dataSource = new DataSourceBuilder(this.organizationService)
      .load(`OrganizationPartner/${organizationId}`)
      .insert(`OrganizationPartner/AddPartner/${organizationId}`)
      .remove('OrganizationPartner')
      .setKey('id')
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
  onInitNewRow = (e: any) => {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    e.data['fromOrganizationId'] = organizationId;
    e.data['fromConfirm'] = true;
    e.data['toConfirm'] = true;
  }
}
