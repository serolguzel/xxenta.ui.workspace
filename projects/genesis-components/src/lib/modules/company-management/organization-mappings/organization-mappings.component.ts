import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-mappings',
  templateUrl: './organization-mappings.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ]
})
export class OrganizationMappingsComponent implements OnInit {
  dataSource: CustomStore;
  pageTitle: string = 'Mappings';
  constructor(
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
    private readonly translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    this.pageTitle = this.translocoService.translate(pageTitleKey);
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];

    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`OrganizationMapping/${organizationId}`)
      .insert(`OrganizationMapping/${organizationId}`)
      .updateFullModel('OrganizationMapping', "id")
      .remove('OrganizationMapping')
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
}
