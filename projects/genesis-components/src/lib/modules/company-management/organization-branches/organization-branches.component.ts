import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { CommandResponse } from 'genesis-coreservice';
import { OrganizationService } from '../services/organization.service';
import { DataSourceBuilder } from '../../../services/data-source-builder';
@Component({
  selector: 'app-organization-branches',
  templateUrl: './organization-branches.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxButtonModule,
    DxDataGridModule,
    DxTemplateModule
  ],
  providers: [OrganizationService]
})
export class OrganizationBranchesComponent implements OnInit {
  dataSource: CustomStore;
  countryDataSource: CustomStore;
  isUpdate: boolean = false;
  options: any = {};
  constructor(
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.options = this.activatedRoute.snapshot.data;
    this.countryDataSource = new DataSourceBuilder(this.organizationService)
      .load('Country/GetCountriesLookup', { requireTotalCount: true })
      .byKey('Country/GetCountriesLookup')
      .setKey("id")
      .build();

    this.dataSource = new DataSourceBuilder(this.organizationService)
      .load(`OrganizationBranch/${organizationId}`)
      .insert(`OrganizationBranch/${organizationId}`)
      .updateFullModel('Customer')
      .remove('Customer')
      .setKey('id')
      .build();
  }

  createOrganization = (e: any) => {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.router.navigate([this.options.createRoute.replace(':organizationId', organizationId)]);
  }

  onRowUpdated = (e: any) => {
    this.isUpdate = false;
  }

  validationCallback = (e: any) => {
    if (e.value) {
      return this.organizationService.ExistOrganizationCode(e.value).then((res: CommandResponse<boolean>) => {
        return !res.aggregatorId;
      });

    } else {
      return false;
    }
  }
}
