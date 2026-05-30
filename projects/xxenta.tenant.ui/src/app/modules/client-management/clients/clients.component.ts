import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { DxButtonModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceBuilder } from 'genesis-components';
import { CoreService } from 'genesis-coreservice';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DxButtonModule,
    DxDataGridModule,
    DxTemplateModule,
    TranslocoModule
  ]
})
export class ClientsComponent implements OnInit{
  dataSource: CustomStore;
  constructor(
    private coreService: CoreService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Client', { requireTotalCount: true })
      .remove('Client')
      .setKey("clientId")
      .build();
  }

  create = (e: any) => {
    this.router.navigate(['tenant/clients/create-client']);
  }
}
