import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterLink
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
    DxButtonModule,
    DxDataGridComponent,
    DxDataGridModule,
    DxDateBoxModule,
    DxDateRangeBoxModule,
    DxDropDownButtonModule,
    DxLookupModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTooltipModule
} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { AuthService, ConstantRoles, QueryParamsService, Utility } from 'genesis-coreservice';
import moment from 'moment';
import { filter, Subject, takeUntil } from 'rxjs';
import { ChangeFlightTimesComponent } from '../../../components/transfer/change-flight-times/change-flight-times.component';
import { ChangeMultipleTerminalComponent } from '../../../components/transfer/change-multiple-terminal/change-multiple-terminal.component';
import { LookupService } from '../../../services/lookup.service';
import { ReservationEventService } from '../services/reservation-event.service';
import { DetailReservationViewComponent } from './components/detail-reservation-view/detail-reservation-view.component';
import { ReservationExcelExportComponent } from './components/reservation-excel-export/reservation-excel-export.component';
import { ChangeMultipleTerminalModel, UpdateTransferReservationFlight } from './models/transfer-res.models';
import { TransferReservationService } from './services/transfer-reservation.service';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-transfer-reservations',
  templateUrl: './transfer-reservations.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxDropDownButtonModule,
    DetailReservationViewComponent,
    ChangeMultipleTerminalComponent,
    ReservationExcelExportComponent,
    ChangeFlightTimesComponent,
    DxDateBoxModule,
    DxDateRangeBoxModule,
    DxLookupModule,
    DxTooltipModule,
    DxSelectBoxModule,
    TranslocoModule,
    ClipboardModule
  ],
  providers: [TransferReservationService, LookupService],
})
export class TransferReservationsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('reservationGrid', { static: false }) reservationGrid: DxDataGridComponent;
  @ViewChild(ChangeMultipleTerminalComponent, { static: false }) changeMultipleTerminalComponent: ChangeMultipleTerminalComponent;
  @ViewChild(ChangeFlightTimesComponent, { static: false }) changeFlightTimesComponent: ChangeFlightTimesComponent;
  dataSource: CustomStore;
  transferRouteTypes: any[];
  filter: any = { requireTotalCount: true };

  transferRouteTypeOptions: any;

  ownerOptions: any = { };

  companyOptions: any;
  tansferOptions: any;

  now: Date = new Date();
  beginDateOptions: any = {
    value: null,
    type: 'date',
    displayFormat: 'dd.MM.yyyy',
    placeholder: 'Begin date:',
    showClearButton: true,
    onValueChanged: this.onBeginDateValueChanged.bind(this)
  };
  endDateOptions: any = {
    value: moment(this.now, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
    type: 'date',
    displayFormat: 'dd.MM.yyyy',
    placeholder: 'End date:',
    showClearButton: true,
    onValueChanged: this.onEndDateValueChanged.bind(this)
  };
  changeMultipleTerminalOptions: any;
  changeFlightTimeOptions: any;
  excelExportOptions: any;
  refreshButtonOptions = {
    icon: 'refresh',
    onClick: this.onRefresh.bind(this)
  };
  changeMultipleTerminalVisible: boolean = false;
  excelExportVisible: boolean = false;
  changeFlightTimeVisible: boolean = false;
  hasOwner: boolean = false;
  menus: any;
  selectedDate: Date;
  options: any = {};
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();
  private initialSearch: string;
  createItemOptions: any = { icon: 'add', onClick: this.createItem.bind(this) }

  constructor(
    private readonly transferService: TransferReservationService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly eventService: ReservationEventService,
    private readonly translocoService: TranslocoService,
    private readonly queryParamsService: QueryParamsService,
    private readonly authService: AuthService,
    public lookupService: LookupService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.options = this.activatedRoute.snapshot.data;
    this.transferRouteTypes = this.transferService.transferRouteTypes;
    this.menus = this.transferService.actionMenuItems;
    this.transferRouteTypeOptions = {
      value: '',
      placeholder: this.translocoService.translate('labels.select-direction'),
      onValueChanged: this.onTransferRouteTypeValueChanged.bind(this),
      dataSource: this.transferService.transferRouteTypes,
      displayExpr: 'name',
      valueExpr: 'code',
      showClearButton: true
    };
    this.companyOptions = {
      width: 240,
      onValueChanged: this.onCompanyValueChanged.bind(this),
      ...this.lookupService.organizationLookUpOptions,
      placeholder: this.translocoService.translate('labels.operator') + ':',
    };
    this.tansferOptions = {
      width: 200,
      onValueChanged: this.onTransferTypeValueChanged.bind(this),
      ...this.lookupService.transferTypesLookUpOptions,
    };
    this.changeMultipleTerminalOptions = {
      icon: 'airplane',
      text: this.translocoService.translate('labels.change-terminal'),
      onClick: this.onChangeMultipleTerminal.bind(this),
    };
    this.changeFlightTimeOptions = {
      icon: 'assets/icons/flight_time_24.png',
      text: this.translocoService.translate('labels.change-flight-times'),
      onClick: this.onChangeFlightTimes.bind(this),
    };
    this.excelExportOptions = {
      icon: 'xlsfile',
      text: this.translocoService.translate('labels.excel-export'),
      onClick: this.onChangeExcelExport.bind(this),
    };

    this.eventService.pageTitleChange$ = this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle']);
    this.setQueryString();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll)).subscribe((event: NavigationEnd) => {
        this.setQueryString();
        this.loadDataSource(this.filter);
      });
    this.loadDataSource(this.filter);
    this.updateQueryParams();

    var data = await this.authService.getProfile();
    this.hasOwner = (data?.role?.includes(ConstantRoles.SystemAdmin) || data?.role?.includes(ConstantRoles.SuperAdmin) || data?.role?.includes(ConstantRoles.Admin)) ?? false;
    if (this.hasOwner) {
      this.ownerOptions = {
        width: 240,
        value: data.ownerId,
        onValueChanged: this.onOwnerValueChanged.bind(this),
        ...await this.lookupService.GetSubOrganizationsLookupOptions(),
      };
    }
  }

  ngAfterViewInit(): void {
    if (this.initialSearch) {
      this.reservationGrid.instance.searchByText(this.initialSearch);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onRefresh() {
    this.reservationGrid.instance.refresh();
  }

  compyValue: string = '';
  onCopy(value: string) {
    this.compyValue = value;
  }

  setQueryString() {
    const qs: any = this.activatedRoute.snapshot.queryParams;
    if (qs.search) {
      this.filter.search = qs.search;
      this.initialSearch = qs.search;
    } else {
      this.filter.search = null;
      this.initialSearch = '';
    }
    if (qs.beginDate && moment(qs.beginDate, Utility.DefaultDateOnlyFormat, true).isValid()) {
      this.filter.beginDate = qs.beginDate;
      this.beginDateOptions.value = moment(qs.beginDate);
    } else {
      var date = moment(this.now, Utility.DefaultDateOnlyFormat).format(Utility.DefaultDateOnlyFormat);
      this.filter.beginDate = date;
      this.beginDateOptions.value = date;
    }

    if (qs.endDate && moment(qs.endDate, Utility.DefaultDateOnlyFormat, true).isValid()) {
      this.filter.endDate = qs.endDate;
      this.endDateOptions.value = moment(qs.endDate, Utility.DefaultDateOnlyFormat).toDate();
    } else {
      this.filter.endDate = moment(this.now, Utility.DefaultDateOnlyFormat).add(1, 'days').format(Utility.DefaultDateOnlyFormat);
    }

    if (qs.transferRouteType) {
      this.filter.transferRouteType = qs.transferRouteType;
      this.transferRouteTypeOptions.value = qs.transferRouteType;
    }
    if (qs.ownerId) {
      this.filter.ownerId = qs.ownerId;
    }
    if (qs.operatorId) {
      this.filter.operatorId = qs.operatorId;
    }

    if (qs.transferTypeId) {
      this.filter.transferTypeId = qs.transferTypeId;
      this.tansferOptions.value = qs.transferTypeId;
    }
  }

  onItemClick(e: any, data: any) {
    switch (e.itemData.value) {
      case 1:
        this.router.navigate(
          [this.options.editTransferReservation(data.key)],
          { relativeTo: this.activatedRoute });
        break;
      case 2:
        this.router.navigate(
          [this.options.createFlightReservationViaVoucher(data.data.sysVoucher, data.data.transferRouteType)],
          { relativeTo: this.activatedRoute, state: { transferRouteType: data.data.transferRouteType } });
        break;
    }
  }

  onChangeMultipleTerminal(e: any) {
    this.changeMultipleTerminalComponent.setRouteType(<ChangeMultipleTerminalModel>{
      routeType: this.filter.transferRouteType
    });
    this.changeMultipleTerminalVisible = true;
  }

  onChangeFlightTimes(e: any) {
    this.changeFlightTimesComponent.setNewModel(<UpdateTransferReservationFlight>{});
    this.changeFlightTimeVisible = true;
  }

  onChangeMultipleTerminalCancel(e: boolean) {
    this.changeMultipleTerminalVisible = e;
  }

  onChangeExcelExport(e: any) {
    this.excelExportVisible = true;
  }
  onExcelExportCancel(e: boolean) {
    this.excelExportVisible = e;
  }
  onChangeFlightTimeCancel(e: boolean) {
    this.changeFlightTimeVisible = e;
  }

  editItem(e: any) {
    this.router.navigate([this.options.editTransferReservation(e.row.key)], { relativeTo: this.activatedRoute });
  }

  createItem(e: any) {
    let routePath = this.options.createTransferReservation();
    this.router.navigate([routePath], { relativeTo: this.activatedRoute });
  }

  onTransferRouteTypeValueChanged(e: any) {
    if (e.value) {
      this.filter.transferRouteType = e.value;
    } else {
      delete this.filter.transferRouteType;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onOwnerValueChanged(e: any) {
    if (e.value) {
      this.filter.ownerId = e.value;
    } else {
      delete this.filter.ownerId;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onCompanyValueChanged(e: any) {
    if (e.value) {
      this.filter.operatorId = e.value;
    } else {
      delete this.filter.operatorId;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onTransferTypeValueChanged(e: any) {
    if (e.value) {
      this.filter.transferTypeId = e.value;
    } else {
      delete this.filter.transferTypeId;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onVoucherValueChanged(e: any) {
    if (e.value) {
      this.filter.voucher = e.value;
    } else {
      delete this.filter.voucher;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onBeginDateValueChanged(e: any) {
    if (e.value) {
      this.filter.beginDate = moment(e.value).format('YYYY-MM-DD');
    }
    else {
      delete this.filter.beginDate;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onEndDateValueChanged(e: any) {
    if (e.value) {
      this.filter.endDate = moment(e.value).format('YYYY-MM-DD');
    }
    else {
      delete this.filter.endDate;
    }
    this.loadDataSource(this.filter);
    this.updateQueryParams();
  }

  onOptionChanged(e: any) {
    if (e.fullName === 'searchPanel.text') {
      this.filter.search = e.value;
      this.updateQueryParams();
    }
  }

  private updateQueryParams() {
    const params: Partial<any> = {};

    if (this.filter.transferTypeId) {
      params['transferTypeId'] = this.filter.transferTypeId;
    }

    if (this.filter.ownerId) {
      params['ownerId'] = this.filter.ownerId;
    }

    if (this.filter.operatorId) {
      params['operatorId'] = this.filter.operatorId;
    }

    if (this.filter.transferRouteType) {
      params['transferRouteType'] = this.filter.transferRouteType;
    }

    if (this.filter.voucher) {
      params['voucher'] = this.filter.voucher;
    }

    if (this.filter.search) {
      params['search'] = this.filter.search;
    }

    if (this.filter.beginDate) {
      params['beginDate'] = this.filter.beginDate;
    }

    if (this.filter.endDate) {
      params['endDate'] = this.filter.endDate;
    }

    this.queryParamsService.setQueryParams(params);
  }

  private loadDataSource(filter: any) {
    this.dataSource = new DataSourceBuilder(this.transferService)
      .load('Reservation', filter)
      .setKey('id')
      .build();
  }
}
