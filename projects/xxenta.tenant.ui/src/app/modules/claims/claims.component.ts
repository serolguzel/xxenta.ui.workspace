import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { TenantService } from '../services/tenant.service';
import CustomStore from 'devextreme/data/custom_store';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from 'genesis-components';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class ClaimsComponent implements OnInit {
  dataSource: CustomStore;
  constructor(
    private tenantService: TenantService
  ) {

  }
  ngOnInit(): void {
    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('Claim', { requireTotalCount: true })
      .insert('Claim')
      .updateFullModel('Claim')
      .setKey("code")
      .build();
  }
  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }
}
