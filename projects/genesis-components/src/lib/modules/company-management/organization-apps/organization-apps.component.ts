import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxDataGridModule, DxLookupModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { OrganizationService } from '../services/organization.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';


@Component({
  selector: 'app-organization-apps',
  templateUrl: './organization-apps.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxLookupModule,
    DxTemplateModule,
    DxButtonModule,
    TranslocoModule
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationAppsComponent implements OnInit {
  dataSource: CustomStore;
  priceCalculatorTypes: any;
  pamentTypes: any;
  presentationTypes: any;
  organizationId: string = '';
  constructor(
    private router: Router,
    private readonly organizationService: OrganizationService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.priceCalculatorTypes = this.organizationService.priceCalculatorTypes;
    this.pamentTypes = this.organizationService.paymentTypes;
    this.presentationTypes = this.organizationService.presentationTypes;
  }

  async ngOnInit(): Promise<void> {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.dataSource = new DataSourceBuilder(this.organizationService)
      .load(`OrganizationApps/${this.organizationId}`)
      .insert(`OrganizationApps/${this.organizationId}`)
      .updateFullModel(`OrganizationApps/${this.organizationId}`)
      .remove(`OrganizationApps/${this.organizationId}`)
      .setKey('appId')
      .build();
  }

  saveApp = (e: any) => {
    this.router.navigate([`/tenant/tenants/apps/${this.organizationId}/add-app`], { relativeTo: this.activatedRoute });
  }

  editAgency = (e: any) => {
    this.router.navigate([`detail/${e.row.key}`], { relativeTo: this.activatedRoute });
  }

  onRowUpdating = (e: any) => {
    const assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }

  onRowInserting = (e: any) => {
    e.data.organizationId = this.activatedRoute.snapshot.params['organizationId'];
  }

  onInitNewRow = (e: any) => {
    e.data.organizationId = this.activatedRoute.snapshot.params['organizationId'];
  }
}
