import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { GetPushProcesses } from './pushlog.models';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-pushlog-component',
  templateUrl: './pushlog-component.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxTemplateModule,
    TranslocoModule,
    RouterLink
  ]
})
export class PushlogComponentComponent implements OnInit {
  dataSource: CustomStore;
  filter: GetPushProcesses = <GetPushProcesses>{};
  selectedTransferDate: Date = new Date();
  filterTextBoxOptions: any;
  codeTextBoxOptions: any;

  constructor(
    private coreService: CoreService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.filterTextBoxOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.search') + ':',
      onValueChanged: this.onFilterValueChanged.bind(this)
    };
    this.codeTextBoxOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.code') + ':',
      onValueChanged: this.onCodeValueChanged.bind(this)
    };

    this.loadData();
  }

  loadData() {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Push', { requireTotalCount: true, ...this.filter })
      .setKey("id")
      .build()
  }

  onFilterValueChanged(e: any) {
    this.filter.filterText = e.value;
    this.loadData();
  }

  onCodeValueChanged(e: any) {
    this.filter.code = e.value;
    this.loadData();
  }

}
