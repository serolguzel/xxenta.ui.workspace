import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownButtonModule,
  DxLookupModule,
  DxSelectBoxModule,
  DxTemplateModule,
} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
import { filter, Subject, takeUntil } from 'rxjs';
import { Utility, TransferRouteType } from 'genesis-coreservice';

import { AirportService } from './services/airport.service';
import { PassengerMoreDetailComponent } from './components/passenger-more-detail/passenger-more-detail.component';
import { AirportPlanningModel, AirportPlanningResponse, GetAirportTransferDetails, GetTransferTaskStat } from './models/airport.models';
import { OrganizationType } from '../company-management/company.models';
import { LookupService } from '../../services/lookup.service';
import { SummaryMiniComponent } from '../../widgets/summary-mini/summary-mini.component';
import { DataSourceBuilder } from '../../services/data-source-builder';

@Component({
  selector: 'app-airport-planning',
  templateUrl: './airport-planning.page.html',
  styleUrls: ['./airport-planning.page.scss'],
  standalone: true,
  preserveWhitespaces: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    DxDataGridModule,
    DxTemplateModule,
    PassengerMoreDetailComponent,
    TranslocoModule,
    DxDateBoxModule,
    DxButtonModule,
    DxLookupModule,
    DxSelectBoxModule,
    DxDropDownButtonModule,

    SummaryMiniComponent
  ],
  providers: [AirportService, LookupService],
})
export class AirportPlanningPage implements OnInit, OnDestroy {
  @ViewChild('reservationGrid', { static: false }) reservationGrid: DxDataGridComponent;
  gridInstance: any;
  dataSource: CustomStore;
  request: GetAirportTransferDetails = <GetAirportTransferDetails>{};
  data: AirportPlanningResponse = <AirportPlanningResponse>{};
  selectedData: AirportPlanningModel = <AirportPlanningModel>{};

  selectedTransferDate: Date = new Date();
  searchText: string | null = null;
  menus: any[] = [
    { value: 1, name: 'Change Transfer Order', icon: 'refresh' },
    { value: 2, name: 'Uçuş Ekle', icon: 'assets/icons/flight_64.png' },
  ];
  companyOptions: any;
  hotelOptions: any;
  tagBoxFligthOptions: any;
  todayButtonOptions: any;
  routeTypeOptions: any;

  prevDayButtonOptions = {
    icon: 'chevronprev',
    stylingMode: 'text',
    onClick: this.setPrevDay.bind(this)
  };

  nextDayButtonOptions = {
    icon: 'chevronnext',
    stylingMode: 'text',
    onClick: this.setNextDay.bind(this)
  };

  refreshButtonOptions = {
    icon: 'refresh',
    onClick: this.onRefresh.bind(this)
  };

  transferRouteTypes: any[];
  codeNameTemplate = Utility.codeNameTemplate;

  private readonly unsubscribeAll: Subject<any> = new Subject<any>();
  options: any = {};
  constructor(
    private readonly airportService: AirportService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService,
    public lookupService: LookupService,
  ) { }

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
    this.transferRouteTypes = this.airportService.transferRouteTypes;
    this.companyOptions = {
      width: 200,
      value: null,
      placeholder: this.translocoService.translate('labels.select-operator'),
      onValueChanged: this.companyOnValueChanged.bind(this),
      ...this.lookupService.lookUpCompanyOptions([OrganizationType.Operator]),
    };
    this.hotelOptions = {
      width: 200,
      value: null,
      placeholder: this.translocoService.translate('labels.select-hotel'),
      onValueChanged: this.hotelOnValueChanged.bind(this),
      ...this.lookupService.hotelLookUpValuePlaceIdOptions,
    };
    this.tagBoxFligthOptions = {
      width: 250,
      value: null,
      placeholder: this.translocoService.translate('labels.select-flight'),
      onValueChanged: this.flightOnValueChanged.bind(this),
      ...this.lookupService.flightTagBoxOptions,
    };
    this.todayButtonOptions = {
      text: this.translocoService.translate('labels.today'),
      stylingMode: 'text',
      onClick: this.setToday.bind(this)
    };
    this.routeTypeOptions = {
      value: TransferRouteType.Arrival,
      items: this.airportService.transferRouteTypes,
      displayExpr: 'name',
      valueExpr: 'code',
      showClearButton: true,
      placeholder: this.translocoService.translate('labels.transfer-routes'),
      onValueChanged: this.onRouteTypeValueChanged.bind(this)
    };
    this.setQueryString();
    this.loadData();
    this.getStat();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll)
    ).subscribe(() => {
      this.setQueryString();
      this.getStat();
      this.loadData();
    });
    this.search();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
  
  onRefresh() {
    this.reservationGrid.instance.refresh();
  }

  loadData() {
    this.dataSource = new DataSourceBuilder(this.airportService)
      .load('Reservation/GetGuestTraffic', {
        requireTotalCount: true,
        ...this.request,
      })
      .setKey('id')
      .build();
  }

  getStat() {
    let statRequest = <GetTransferTaskStat>{
      transferDate: this.request.transferDate,
    };

    this.airportService
      .GetTransferTaskStat(statRequest)
      .then((res: AirportPlanningResponse) => {
        this.data = res;
      });
  }

  getStatusIcon(rowData: any): string | null {
    if (rowData.noShow) {
      return 'assets/icons/hide_64.png';
    } else if (rowData.selfTransfer) {
      return 'assets/icons/self-service_64.png';
    } else if (rowData.isGetOn || rowData.isDeskOn) {
      return 'assets/icons/check-mark_64.png';
    } else {
      return null;
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
          [this.options.createFlightReservationViaVoucher(data.data.voucher)],
          { relativeTo: this.activatedRoute, state: { transferRouteType: data.data.transferRouteType } });
        break;
    }
  }

  companyOnValueChanged(e: any) {
    if (e.value) {
      this.request['operatorId'] = e.value;
    } else {
      delete this.request['operatorId'];
    }
    this.search();
  }

  search() {
    const queryParams = { ...this.request };
    if (this.searchText) {
      queryParams['searchText'] = this.searchText;
    } else {
      delete queryParams['searchText'];
    }
    this.router.navigate([], { queryParams });
  }

  hotelOnValueChanged(e: any) {
    if (e.value) {
      this.request['placeId'] = e.value;
    } else {
      delete this.request['placeId'];
    }
    this.search();
  }

  flightOnValueChanged(e: any) {
    if (e.value) {
      this.request['flightCodes'] = e.value;
    } else {
      delete this.request['flightCodes'];
    }
    this.search();
  }

  onTourDateValueChanged(e: any) {
    this.selectedTransferDate = e.value || new Date();
    this.request['transferDate'] = moment(this.selectedTransferDate).format('YYYY-MM-DD');
    this.getStat();
    this.search();
  }

  onRouteTypeValueChanged(e: any) {
    if (e.value) {
      this.request['routeType'] = e.value;
    } else {
      delete this.request['routeType'];
    }
    this.search();
  }

  setQueryString() {
    const qs = this.activatedRoute.snapshot.queryParams as GetAirportTransferDetails;
    this.selectedTransferDate = qs.transferDate ? new Date(qs.transferDate) : new Date();
    this.request['transferDate'] = moment(this.selectedTransferDate).format('YYYY-MM-DD');
    this.companyOptions.value = qs.operatorId ?? null;
    this.request['operatorId'] = qs.operatorId ?? undefined;
    this.hotelOptions.value = qs.placeId ?? null;
    this.request['placeId'] = qs.placeId ?? undefined;
    this.tagBoxFligthOptions.value = qs.flightCodes ?? null;
    this.request['flightCodes'] = qs.flightCodes ?? undefined;
    this.searchText = qs.searchText ?? null;
    this.request['routeType'] = qs.routeType ?? TransferRouteType.Arrival;
    this.routeTypeOptions.value = qs.routeType ?? TransferRouteType.Arrival;
  }

  setPrevDay() {
    const current = new Date(this.selectedTransferDate);
    current.setDate(current.getDate() - 1);
    this.selectedTransferDate = current;
    this.request['transferDate'] = moment(current).format('YYYY-MM-DD');
    this.onTourDateValueChanged({ value: current });
  }

  setNextDay() {
    const current = new Date(this.selectedTransferDate);
    current.setDate(current.getDate() + 1);
    this.selectedTransferDate = current;
    this.request['transferDate'] = moment(current).format('YYYY-MM-DD');
    this.onTourDateValueChanged({ value: current });
  }

  setToday() {
    this.selectedTransferDate = new Date();
    this.request['transferDate'] = moment(this.selectedTransferDate).format('YYYY-MM-DD');
    this.onTourDateValueChanged({ value: this.selectedTransferDate });
  }

  onGridInitialized(e: any) {
    this.gridInstance = e.component;
  }

  onGridOptionChanged(e: any) {
    if (e.fullName === 'searchPanel.text') {
      this.searchText = e.value || null;
      this.search();
    }
  }

  onContentReady(e: any) {
    if (this.searchText && this.gridInstance) {
      this.gridInstance.searchByText(this.searchText);
    }
  }
}
