import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { PositionConfig } from 'devextreme/animation/position';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService } from 'genesis-coreservice';
import { OrganizationsDetailComponent } from '../components/organizations-detail/organizations-detail.component';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxButtonModule,

    OrganizationsDetailComponent
  ]
})
export class OrganizationsComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSource: CustomStore = new CustomStore();
  options: any = {};
  
  popupPosition: PositionConfig = {
    of: window, at: 'top', my: 'top', offset: { y: 10 },
  };
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.options = this.activatedRoute.snapshot.data;
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Organization/GetOrganizations', { requireTotalCount: true, ...this.options.params })
      .insert('Organization')
      .updateFullModel('Organization', "id")
      .remove('Organization')
      .setKey("id")
      .build();
  }

  createOrganization = (e: any) => {
    this.router.navigate([this.options.createRoute]);
  }

  loadData() {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Organization/GetOrganizations', { requireTotalCount: true })
      .insert('Organization')
      .updateFullModel('Organization', "id")
      .remove('Organization')
      .setKey("id")
      .build();
  }
}
