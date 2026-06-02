import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute } from '@angular/router';
import {CoreService } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-contacts',
  templateUrl: './organization-contacts.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ]
})
export class OrganizationContactsComponent implements OnInit {
  dataSource: CustomStore;
  contactTypes: any[] = [{ id: 'Email', name: 'Email' }, { id: 'Phone', name: 'Phone' }]
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];

    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`OrganizationContact/${organizationId}`)
      .insert(`OrganizationContact/${organizationId}`)
      .updateFullModel('OrganizationContact', "id")
      .remove('OrganizationContact/Delete')
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
}
