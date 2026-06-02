import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { Permission } from '../company.models';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxButtonModule,
    TranslocoModule
  ]
})
export class CompaniesComponent implements OnInit{
  dataSource: CustomStore;
  countryDataSoruce: CustomStore;
  permission: Permission = <Permission>{}
  pageTitle: string = '';
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly translocoService: TranslocoService
  ) {

  }

  ngOnInit() {
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    this.pageTitle = this.translocoService.translate(pageTitleKey);
    
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Organization', { requireTotalCount: true, isTenant: true})
      .setKey("id")
      .build();
  }

  createAgency = (e: any) => {
    this.router.navigate(['create'], {relativeTo: this.activatedRoute});
  }

  editAgency = (e: any) => {
    this.router.navigate([`detail/${e.row.key}`], {relativeTo: this.activatedRoute});
  }

  deleteAgency = (e: any) => {

  }
}
