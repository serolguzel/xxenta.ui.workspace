import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceBuilder } from 'genesis-components';
import { CoreService } from 'genesis-coreservice';

@Component({
  selector: 'app-tenant-pax-counter',
  templateUrl: './tenant-pax-counter.component.html',
  standalone: true,
  imports: [
    DxDataGridModule
  ]
})
export class TenantPaxCounterComponent implements OnInit {
  dataSource: CustomStore;
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];

    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`Customer/PaxCounter/${organizationId}`)
      .setKey('id')
      .build();
  }
}
