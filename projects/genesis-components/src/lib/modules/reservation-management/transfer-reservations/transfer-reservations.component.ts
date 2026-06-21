import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterLink
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService, CodeNamePair, ConstantRoles, QueryParamsService, Utility } from 'genesis-coreservice';
import moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { filter, Subject, takeUntil } from 'rxjs';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent, GenesisSummary } from '../../../components/common';
import { ChangeFlightTimesComponent } from '../../../components/transfer/change-flight-times/change-flight-times.component';
import { ChangeMultipleTerminalComponent } from '../../../components/transfer/change-multiple-terminal/change-multiple-terminal.component';
import { LookupService } from '../../../services/lookup.service';
import { ReservationEventService } from '../services/reservation-event.service';
import { DetailReservationViewComponent } from './components/detail-reservation-view/detail-reservation-view.component';
import { ReservationExcelExportComponent } from './components/reservation-excel-export/reservation-excel-export.component';
import { ChangeMultipleTerminalModel, UpdateTransferReservationFlight } from './models/transfer-res.models';
import { TransferReservationService } from './services/transfer-reservation.service';

@Component({
  selector: 'app-transfer-reservations',
  templateUrl: './transfer-reservations.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    TranslocoModule,
    ClipboardModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
    DetailReservationViewComponent,
    ChangeMultipleTerminalComponent,
    ReservationExcelExportComponent,
    ChangeFlightTimesComponent,
  ],
  providers: [TransferReservationService, LookupService],
})
export class TransferReservationsComponent implements OnInit, OnDestroy {
  @ViewChild(GenesisDataTableComponent) grid!: GenesisDataTableComponent;
  @ViewChild(ChangeMultipleTerminalComponent, { static: false }) changeMultipleTerminalComponent!: ChangeMultipleTerminalComponent;
  @ViewChild(ChangeFlightTimesComponent, { static: false }) changeFlightTimesComponent!: ChangeFlightTimesComponent;

  private readonly transferService = inject(TransferReservationService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly eventService = inject(ReservationEventService);
  private readonly translocoService = inject(TranslocoService);
  private readonly queryParamsService = inject(QueryParamsService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly lookupService = inject(LookupService);

  /** Server-side load path (eski Reservation CustomStore). */
  loadPath = 'Reservation';
  /** GenesisDataTable.extraParams -> her load isteğine eklenen filtre alanları. */
  filter: any = { requireTotalCount: true };

  transferRouteTypes: CodeNamePair[] = [];

  // --- Toolbar filtre kontrolleri (p-select/p-datepicker [(ngModel)]) ---
  ownerValue: string | null = null;
  ownerItems: any[] = [];
  beginDate: Date | null = null;
  endDate: Date | null = null;
  transferRouteTypeValue: string | null = null;
  operatorValue: string | null = null;
  operatorItems: any[] = [];
  transferTypeValue: string | null = null;
  transferTypeItems: any[] = [];

  hasOwner = false;

  // --- Yan paneller ---
  changeMultipleTerminalVisible = false;
  excelExportVisible = false;
  changeFlightTimeVisible = false;

  options: any = {};
  now: Date = new Date();
  copyValue = '';

  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  columns: GenesisColumn[] = [
    { field: 'sysVoucher', header: this.translocoService.translate('labels.sys-voucher'), sortable: true },
    { field: 'oprVoucher', header: this.translocoService.translate('labels.opr-voucher'), sortable: true },
    { field: 'subVoucher', header: this.translocoService.translate('labels.sub-voucher'), sortable: true },
    { field: 'pickupTime', header: this.translocoService.translate('labels.pickup-time'), sortable: true },
    { field: 'flight.code', header: this.translocoService.translate('labels.flight-code') },
    { field: 'flight.arrivalTime', header: this.translocoService.translate('labels.flight-time') },
    { field: 'transferDate', header: this.translocoService.translate('labels.transfer-date'), type: 'date' },
    { field: 'saleDate', header: this.translocoService.translate('labels.sale-date'), type: 'date', hidden: true },
    { field: 'transferRouteType', header: this.translocoService.translate('labels.direction') },
    { field: 'fromLocation.name', header: this.translocoService.translate('labels.from') },
    { field: 'toLocation.name', header: this.translocoService.translate('labels.to') },
    { field: 'adult', header: this.translocoService.translate('labels.adult') },
    { field: 'child', header: this.translocoService.translate('labels.child') },
    { field: 'infant', header: this.translocoService.translate('labels.infant') },
    { field: 'transferType.code', header: this.translocoService.translate('labels.transfer-type') },
    { field: 'operator.name', header: this.translocoService.translate('labels.operator') },
    { field: 'flight.terminal.id', header: this.translocoService.translate('labels.terminal') },
    { field: 'createDate', header: this.translocoService.translate('labels.create-date'), type: 'date', hidden: true },
  ];

  summary: GenesisSummary[] = [
    { column: 'oprVoucher', type: 'count' },
    { column: 'adult', type: 'sum' },
    { column: 'child', type: 'sum' },
    { column: 'infant', type: 'sum' },
  ];

  async ngOnInit(): Promise<void> {
    this.options = this.activatedRoute.snapshot.data;
    this.transferRouteTypes = this.transferService.transferRouteTypes;

    this.eventService.pageTitleChange$ = this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle']);

    this.setQueryString();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll)).subscribe(() => {
        this.setQueryString();
        this.reloadGrid();
      });
    this.updateQueryParams();

    // Toolbar lookup'ları (eski DevExtreme CustomStore -> array options).
    this.loadOperators();
    this.loadTransferTypes();

    const data = await this.authService.getProfile();
    this.hasOwner = (data?.role?.includes(ConstantRoles.SystemAdmin) || data?.role?.includes(ConstantRoles.SuperAdmin) || data?.role?.includes(ConstantRoles.Admin)) ?? false;
    if (this.hasOwner) {
      this.ownerValue = this.filter.ownerId ?? data.ownerId;
      if (!this.filter.ownerId && data.ownerId) {
        this.filter.ownerId = data.ownerId;
      }
      this.ownerItems = await this.transferService.getCall('Organization/GetSubOrganizationsLookup');
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  // --- Lookup yüklemeleri (getCall -> array, sonra detectChanges) ---
  private loadOperators(): void {
    this.transferService.getCall('OrganizationPartner/GetPartnersLookup', {
      requireTotalCount: false,
      organizationTypes: JSON.stringify(['Agency', 'Operator']),
    }).then((data: any) => {
      this.operatorItems = Array.isArray(data) ? data : (data?.data ?? []);
      this.cdr.detectChanges();
    });
  }

  private loadTransferTypes(): void {
    this.transferService.getCall('TransferType/GetTransferTypesLookup').then((data: any) => {
      this.transferTypeItems = Array.isArray(data) ? data : (data?.data ?? []);
      this.cdr.detectChanges();
    });
  }

  /** extraParams güncellendikten sonra tabloyu yeniden yükler. */
  private reloadGrid(): void {
    this.grid?.reload();
  }

  // --- Toolbar filtre değişimleri (extraParams güncelle + reload + queryParams) ---
  onOwnerValueChanged(value: string | null): void {
    if (value) this.filter.ownerId = value; else delete this.filter.ownerId;
    this.reloadGrid();
    this.updateQueryParams();
  }

  onTransferRouteTypeValueChanged(value: string | null): void {
    if (value) this.filter.transferRouteType = value; else delete this.filter.transferRouteType;
    this.reloadGrid();
    this.updateQueryParams();
  }

  onCompanyValueChanged(value: string | null): void {
    if (value) this.filter.operatorId = value; else delete this.filter.operatorId;
    this.reloadGrid();
    this.updateQueryParams();
  }

  onTransferTypeValueChanged(value: string | null): void {
    if (value) this.filter.transferTypeId = value; else delete this.filter.transferTypeId;
    this.reloadGrid();
    this.updateQueryParams();
  }

  onBeginDateValueChanged(value: Date | null): void {
    if (value) this.filter.beginDate = moment(value).format('YYYY-MM-DD'); else delete this.filter.beginDate;
    this.reloadGrid();
    this.updateQueryParams();
  }

  onEndDateValueChanged(value: Date | null): void {
    if (value) this.filter.endDate = moment(value).format('YYYY-MM-DD'); else delete this.filter.endDate;
    this.reloadGrid();
    this.updateQueryParams();
  }

  // --- Toolbar aksiyonları ---
  onRefresh(): void {
    this.reloadGrid();
  }

  onChangeMultipleTerminal(): void {
    this.changeMultipleTerminalComponent.setRouteType(<ChangeMultipleTerminalModel>{
      routeType: this.filter.transferRouteType
    });
    this.changeMultipleTerminalVisible = true;
  }

  onChangeFlightTimes(): void {
    this.changeFlightTimesComponent.setNewModel(<UpdateTransferReservationFlight>{});
    this.changeFlightTimeVisible = true;
  }

  onChangeMultipleTerminalCancel(e: boolean): void {
    this.changeMultipleTerminalVisible = e;
  }

  onChangeExcelExport(): void {
    this.excelExportVisible = true;
  }

  onExcelExportCancel(e: boolean): void {
    this.excelExportVisible = e;
  }

  onChangeFlightTimeCancel(e: boolean): void {
    this.changeFlightTimeVisible = e;
  }

  createItem(): void {
    const routePath = this.options.createTransferReservation();
    this.router.navigate([routePath], { relativeTo: this.activatedRoute });
  }

  onCopy(value: string): void {
    this.copyValue = value;
  }

  setQueryString(): void {
    const qs: any = this.activatedRoute.snapshot.queryParams;
    if (qs.search) {
      this.filter.search = qs.search;
    } else {
      this.filter.search = null;
    }

    if (qs.beginDate && moment(qs.beginDate, Utility.DefaultDateOnlyFormat, true).isValid()) {
      this.filter.beginDate = qs.beginDate;
      this.beginDate = moment(qs.beginDate).toDate();
    } else {
      const date = moment(this.now, Utility.DefaultDateOnlyFormat).format(Utility.DefaultDateOnlyFormat);
      this.filter.beginDate = date;
      this.beginDate = moment(date).toDate();
    }

    if (qs.endDate && moment(qs.endDate, Utility.DefaultDateOnlyFormat, true).isValid()) {
      this.filter.endDate = qs.endDate;
      this.endDate = moment(qs.endDate, Utility.DefaultDateOnlyFormat).toDate();
    } else {
      const end = moment(this.now, Utility.DefaultDateOnlyFormat).add(1, 'days').format(Utility.DefaultDateOnlyFormat);
      this.filter.endDate = end;
      this.endDate = moment(end).toDate();
    }

    if (qs.transferRouteType) {
      this.filter.transferRouteType = qs.transferRouteType;
      this.transferRouteTypeValue = qs.transferRouteType;
    }
    if (qs.ownerId) {
      this.filter.ownerId = qs.ownerId;
      this.ownerValue = qs.ownerId;
    }
    if (qs.operatorId) {
      this.filter.operatorId = qs.operatorId;
      this.operatorValue = qs.operatorId;
    }
    if (qs.transferTypeId) {
      this.filter.transferTypeId = qs.transferTypeId;
      this.transferTypeValue = qs.transferTypeId;
    }
  }

  private updateQueryParams(): void {
    const params: Partial<any> = {};
    if (this.filter.transferTypeId) params['transferTypeId'] = this.filter.transferTypeId;
    if (this.filter.ownerId) params['ownerId'] = this.filter.ownerId;
    if (this.filter.operatorId) params['operatorId'] = this.filter.operatorId;
    if (this.filter.transferRouteType) params['transferRouteType'] = this.filter.transferRouteType;
    if (this.filter.voucher) params['voucher'] = this.filter.voucher;
    if (this.filter.search) params['search'] = this.filter.search;
    if (this.filter.beginDate) params['beginDate'] = this.filter.beginDate;
    if (this.filter.endDate) params['endDate'] = this.filter.endDate;
    this.queryParamsService.setQueryParams(params);
  }
}
