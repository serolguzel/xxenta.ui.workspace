import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxDataGridModule, DxTemplateModule, DxButtonModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { UsersComOptions } from '../users-com-options.model';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxButtonModule,
    TranslocoModule
]
})
export class UsersComponent implements OnInit {
  dataSource: CustomStore;
  pageTitle: string = '';
  options: UsersComOptions = <UsersComOptions>{};
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly translocoService: TranslocoService
  ) {

  }
  ngOnInit(): void {
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    console.log('pageTitleKey', pageTitleKey);
    this.pageTitle = this.translocoService.translate(pageTitleKey);
    this.options = this.activatedRoute.snapshot.data as UsersComOptions;
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    if (organizationId) {
      this.options.extraParams['ownerId'] = organizationId;
    }
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(this.options.loadPath!, this.options.extraParams)
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }

  createUser = (e: any) => {
    this.router.navigate([this.options.createRoute]);
  }

}
