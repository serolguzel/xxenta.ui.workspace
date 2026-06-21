import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { QueryParamsService, Utility } from 'genesis-coreservice';
import moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { LoggingType, LogRequest } from './logs.model';

@Component({
  selector: 'app-logs-component',
  templateUrl: './logs-component.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    RouterLink,
    MatIconModule,
    ClipboardModule,
    ButtonModule,
    DatePickerModule,
    InputTextModule,
    SelectModule,
    TooltipModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
})
export class LogsComponentComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly queryParamsService = inject(QueryParamsService);
  private readonly translocoService = inject(TranslocoService);

  @ViewChild('grid') grid!: GenesisDataTableComponent;

  filter: LogRequest = <LogRequest>{};
  createDateValue: Date | null = null;
  compyValue: string = '';

  loggingTypes = Object.keys(LoggingType)
    .filter(k => isNaN(Number(k)))
    .map(k => ({ id: k, text: k }));

  columns: GenesisColumn[] = [
    { field: 'message', header: this.translocoService.translate('labels.message') },
    { field: 'voucher', header: this.translocoService.translate('labels.voucher') },
    { field: 'source', header: this.translocoService.translate('labels.source') },
    { field: 'loggingType', header: this.translocoService.translate('labels.logging-type') },
    { field: 'level', header: this.translocoService.translate('labels.level') },
    { field: 'host', header: this.translocoService.translate('labels.host') },
    { field: 'path', header: this.translocoService.translate('labels.path'), hidden: true },
    { field: 'method', header: this.translocoService.translate('labels.method') },
    { field: 'correlationId', header: this.translocoService.translate('labels.correlation-id') },
    { field: 'timestamp', header: this.translocoService.translate('labels.create-date'), type: 'datetime' },
  ];

  ngOnInit(): void {
    this.setQueryString();
  }

  onCopy(value: string): void {
    this.compyValue = value;
  }

  onRefresh(): void {
    this.grid?.reload();
  }

  onDateChange(): void {
    if (this.createDateValue) {
      this.filter.createDate = moment(this.createDateValue).format(Utility.DefaultDateOnlyFormat);
    } else {
      delete this.filter.createDate;
    }
    this.applyFilter();
  }

  onFilterChange(): void {
    // boş alanları temizle (server'a gereksiz parametre gitmesin)
    (['message', 'source', 'voucher', 'host', 'correlationId', 'loggingType'] as const).forEach(k => {
      if (!this.filter[k]) delete this.filter[k];
    });
    this.applyFilter();
  }

  private applyFilter(): void {
    this.grid?.reload();
    this.updateQueryParams();
  }

  private setQueryString(): void {
    const qs = this.activatedRoute.snapshot.queryParams as LogRequest;

    if (qs.createDate && moment(qs.createDate, Utility.DefaultDateOnlyFormat, true).isValid()) {
      this.filter.createDate = moment(qs.createDate).format(Utility.DefaultDateOnlyFormat);
      this.createDateValue = moment(qs.createDate).toDate();
    }
    if (qs.source) this.filter.source = qs.source;
    if (qs.voucher) this.filter.voucher = qs.voucher;
    if (qs.message) this.filter.message = qs.message;
    if (qs.host) this.filter.host = qs.host;
    if (qs.correlationId) this.filter.correlationId = qs.correlationId;
    if (qs.loggingType) this.filter.loggingType = qs.loggingType;
  }

  private updateQueryParams(): void {
    const params: Partial<any> = {};
    if (this.filter.source) params['source'] = this.filter.source;
    if (this.filter.voucher) params['voucher'] = this.filter.voucher;
    if (this.filter.message) params['message'] = this.filter.message;
    if (this.filter.host) params['host'] = this.filter.host;
    if (this.filter.path) params['path'] = this.filter.path;
    if (this.filter.correlationId) params['correlationId'] = this.filter.correlationId;
    if (this.filter.createDate) params['createDate'] = this.filter.createDate;
    this.queryParamsService.setQueryParams(params);
  }
}
