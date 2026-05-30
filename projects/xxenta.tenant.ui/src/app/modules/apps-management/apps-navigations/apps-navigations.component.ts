import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceBuilder, RoleResponse } from 'genesis-components';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-apps-navigations',
  templateUrl: './apps-navigations.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    TranslocoModule
  ]
})
export class AppsNavigationsComponent implements OnInit {

  dataSource: CustomStore;
  navigationTypes: string[] = ['aside', 'basic', 'collapsable', 'divider', 'group', 'spacer'];
  appId: string = '';
  roles: RoleResponse[] = [];
  constructor(
    private readonly coreService: CoreService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.appId = this.activatedRoute.snapshot.params.appId;
    this.coreService.getCall(`User/GetRoles`)
            .then((res: RoleResponse[]) => {
              this.roles = res;
            })
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`Navigation/${this.appId}`, { requireTotalCount: true })
      .insert('Navigation')
      .updateFullModel('Navigation', "id")
      .remove('Navigation')
      .setKey("id")
      .build();
  }

  onInitNewRow = (e: any) => {
    e.data.appsId = this.appId;
  }

  onRowUpdating = (e: any) => {
    const assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
}
