import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { PositionConfig } from 'devextreme/animation/position';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService } from 'genesis-coreservice';
import { DataSourceBuilder } from '../../../../services/data-source-builder';

@Component({
  selector: 'organizations-detail',
  templateUrl: './organizations-detail.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxButtonModule
  ]
})
export class OrganizationsDetailComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @Input() parentId: string = '';
  @Input() isTenant: boolean = true;
  dataSource: CustomStore = new CustomStore();
  options: any = {};
  
  popupPosition: PositionConfig = {
    of: window, at: 'top', my: 'top', offset: { y: 10 },
  };
  constructor(
    private coreService: CoreService
  ) {

  }

  ngOnInit() {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Organization/GetOrganizations', { requireTotalCount: true, parentId: this.parentId, isTenant: this.isTenant })
      .insert('Organization')
      .updateFullModel('Organization', "id")
      .remove('Organization')
      .setKey("id")
      .build();
  }
}
