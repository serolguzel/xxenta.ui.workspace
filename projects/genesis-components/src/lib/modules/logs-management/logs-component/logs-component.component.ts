import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DxDataGridComponent, DxDataGridModule, DxTemplateModule, DxTooltipModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService, QueryParamsService, Utility } from 'genesis-coreservice';
import { LoggingType, LogRequest } from './logs.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import moment from 'moment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-logs-component',
  templateUrl: './logs-component.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxTooltipModule,
    TranslocoModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
    ClipboardModule
  ],
  providers: [],
})
export class LogsComponentComponent implements OnInit {
  @ViewChild('reservationGrid', { static: false }) logGrid?: DxDataGridComponent;
  dataSource: CustomStore;
  filter: LogRequest = <LogRequest>{};
  now: Date = new Date();
  createDateOptions: any;
  txtSourceOptions: any;
  txtVoucherOptions: any;
  txtMessageOptions: any;
  txtHostOptions: any;
  txtCorrelationIdOptions: any;
  lookupLoggingTypeOptions: any;

  refreshButtonOptions = {
    icon: 'refresh',
    onClick: this.onRefresh.bind(this)
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly queryParamsService: QueryParamsService,
    private readonly coreService: CoreService,
    private readonly translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.createDateOptions = {
      value: null,
      type: 'date',
      format: 'yyyy-MM-dd',
      displayFormat: 'dd.MM.yyyy',
      placeholder: this.translocoService.translate('labels.create-date'),
      onValueChanged: this.onCreateDateValueChanged.bind(this)
    };
    this.txtSourceOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.source') + ':',
      showClearButton: true,
      onValueChanged: this.onSourceValueChanged.bind(this)
    };
    this.txtVoucherOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.voucher') + ':',
      showClearButton: true,
      onValueChanged: this.onVoucherValueChanged.bind(this)
    };
    this.txtMessageOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.message') + ':',
      showClearButton: true,
      onValueChanged: this.onMessageValueChanged.bind(this)
    };
    this.txtHostOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.host') + ':',
      showClearButton: true,
      onValueChanged: this.onHostValueChanged.bind(this)
    };
    this.txtCorrelationIdOptions = {
      width: 200,
      placeholder: this.translocoService.translate('labels.correlation-id') + ':',
      showClearButton: true,
      onValueChanged: this.onCorrelationIdValueChanged.bind(this)
    };
    this.lookupLoggingTypeOptions = {
      value: '',
      width: 200,
      dataSource: Object.keys(LoggingType).filter(k => isNaN(Number(k))).map(k => ({ id: k, text: k })),
      displayExpr: 'text',
      valueExpr: 'id',
      placeholder: this.translocoService.translate('labels.logging-type') + ':',
      showClearButton: true,
      onValueChanged: this.onLoggingTypeValueChanged.bind(this)
    };
    this.setQueryString();
    this.loadData();
  }

  loadData() {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Logging', { requireTotalCount: true, ...this.filter })
      .setKey("id")
      .build();
  }

  compyValue: string = '';
  onCopy(value: string) {
    this.compyValue = value;
  }

  onRefresh() {
    this.logGrid?.instance.refresh();
  }

  onCreateDateValueChanged(e: any) {
    if (e.value) {
      this.filter.createDate = moment(e.value).format(Utility.DefaultDateOnlyFormat);
    } else {
      delete this.filter.createDate;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onSourceValueChanged(e: any) {
    if (e.value) {
      this.filter.source = e.value;
    } else {
      delete this.filter.source;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onVoucherValueChanged(e: any) {
    if (e.value) {
      this.filter.voucher = e.value;
    } else {
      delete this.filter.voucher;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onMessageValueChanged(e: any) {
    if (e.value) {
      this.filter.message = e.value;
    } else {
      delete this.filter.message;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onHostValueChanged(e: any) {
    if (e.value) {
      this.filter.host = e.value;
    } else {
      delete this.filter.host;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onPathValueChanged(e: any) {
    if (e.value) {
      this.filter.path = e.value;
    } else {
      delete this.filter.message;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onCorrelationIdValueChanged(e: any) {
    if (e.value) {
      this.filter.correlationId = e.value;
    } else {
      delete this.filter.correlationId;
    }
    this.loadData();
    this.updateQueryParams();
  }

  onLoggingTypeValueChanged(e: any) {
    if (e.value) {
      this.filter.loggingType = e.value;
    } else {
      delete this.filter.loggingType;
    }
    this.loadData();
    this.updateQueryParams();
  }

  private setQueryString() {
    const qs = this.activatedRoute.snapshot.queryParams as LogRequest;

    if (qs.createDate && moment(qs.createDate, Utility.DefaultDateOnlyFormat, true).isValid()) {
      this.filter.createDate = moment(qs.createDate).format(Utility.DefaultDateOnlyFormat);
      this.createDateOptions.value = moment(qs.createDate).toDate();
    }

    if (qs.source){
      this.filter.source = qs.source;
      this.txtSourceOptions.value = qs.source;
    }

    if (qs.voucher){
      this.filter.voucher = qs.voucher;
      this.txtVoucherOptions.value = qs.voucher;
    }

    if (qs.message){
      this.filter.message = qs.message;
      this.txtMessageOptions.value = qs.message;
    }

    if (qs.host){
      this.filter.host = qs.host;
      this.txtHostOptions.value = qs.host;
    }

    if (qs.correlationId){
      this.filter.correlationId = qs.correlationId;
      this.txtCorrelationIdOptions.value = qs.correlationId;
    }

    if (qs.loggingType){
      this.filter.loggingType = qs.loggingType;
      this.lookupLoggingTypeOptions.value = qs.loggingType;
    }
  }

  private updateQueryParams() {
    const params: Partial<any> = {};

    if (this.filter.source)
      params['source'] = this.filter.source;

    if (this.filter.voucher)
      params['voucher'] = this.filter.voucher;

    if (this.filter.message)
      params['message'] = this.filter.message;

    if (this.filter.host)
      params['host'] = this.filter.host;

    if (this.filter.path)
      params['path'] = this.filter.path;

    if (this.filter.correlationId)
      params['correlationId'] = this.filter.correlationId;

    if (this.filter.createDate)
      params['createDate'] = this.filter.createDate;

    this.queryParamsService.setQueryParams(params);
  }
}
