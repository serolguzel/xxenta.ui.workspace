import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService } from 'genesis-coreservice';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'lib-process-logs',
  standalone: true,
  templateUrl: './process-logs.component.html',
  imports: [
    DxDataGridModule,
    TranslocoModule,
    RouterLink
  ],
})
export class ProcessLogsComponent implements OnInit {
  dataSource: CustomStore;
  /**
   *
   */
  constructor(
    private coreService: CoreService
  ) {
  }
  ngOnInit(): void {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Progress/GetSejourTransferProcess', { requireTotalCount: true })
      .setKey("id")
      .build();
  }

}
