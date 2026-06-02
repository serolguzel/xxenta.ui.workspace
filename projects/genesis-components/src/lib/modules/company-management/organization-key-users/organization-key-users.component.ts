import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { AuthService, CoreService } from 'genesis-coreservice';
import { LookupService } from '../../../services/lookup.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-key-users',
  templateUrl: './organization-key-users.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ],
  providers: [
    LookupService
  ]
})
export class OrganizationKeyUsersComponent implements OnInit {
  dataSource: CustomStore;
  pageTitle: string = 'Key Users';
  userOptions: any = {};
  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    this.pageTitle = this.translocoService.translate(pageTitleKey);
    this.userOptions = this.lookupService.userLookupByOwnerIdOptions(organizationId);
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`OrganizationKeyUser/${organizationId}`)
      .insert(`OrganizationKeyUser/${organizationId}`)
      .remove(`OrganizationKeyUser/${organizationId}`)
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
}
