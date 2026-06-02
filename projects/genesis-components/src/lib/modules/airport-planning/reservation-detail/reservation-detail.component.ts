import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownButtonModule,
  DxFormModule,
  DxLoadPanelModule,
  DxPopupModule,
  DxRangeSliderModule,
  DxSelectBoxModule,
  DxSwitchModule,
  DxTemplateModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { APP_CONFIG_GEN, CommandResponse, GuestTitle, GuestType, IAppConfig, Utility } from 'genesis-coreservice';
import { filter, Subject, takeUntil } from 'rxjs';
import { ReservationNoteModel } from '../../../components/transfer/transfer-plan-notes/note.models';
import { ChangeReservationGuestStatus, GetAuditTrails, TransferAuditTrailModel } from '../models/airport.models';
import { AirportService } from '../services/airport.service';
import { auditTrail } from '../models/audit-trail.mapping';
import { TransferPlanNotesComponent } from '../../../components/transfer/transfer-plan-notes/transfer-plan-notes.component';
import { TransferResAuditTrailComponent } from '../../../components/transfer/transfer-res-audit-trail/transfer-res-audit-trail.component';
import { TransferPlanExtrasComponent } from '../../../components/transfer/transfer-plan-extras/transfer-plan-extras.component';
import { ActivityTimeLineModel } from '../../../timelines/activity/activity.models';
import { ReservationDetailModel, ReservationExtraModel, ReservationGuestModel } from '../../reservation-management';
import { ReservationMapper } from '../../reservation-management/transfer-reservations/models/reservation.mappings';

@Component({
  selector: 'app-airport-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TransferResAuditTrailComponent,
    DxSwitchModule,
    DxTextBoxModule,
    DxToolbarModule,
    DxTemplateModule,
    DxButtonModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxTemplateModule,
    DxDateBoxModule,
    DxRangeSliderModule,
    DxToolbarModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxPopupModule,
    DxButtonModule,
    DxLoadPanelModule,
    DxTextBoxModule,
    MatStepperModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    TransferPlanNotesComponent,
    TranslocoModule,
    TransferPlanExtrasComponent,
  ],
  providers: [AirportService],
})
export class AirportReservationDetailComponent implements OnInit, OnDestroy {
  item: ReservationDetailModel = <ReservationDetailModel><unknown>{
    guests: [],
  };
  reservationExtras: ReservationExtraModel[] = [];
  voucher: string = '';
  externalVoucher: string | null;
  btnVoucher = {
    icon: 'search',
    onClick: this.goToReservationClick.bind(this),
  };
  btnPrint: any;
  deskOn: boolean = false;
  selfTransfer: boolean = false;
  noShow: boolean = false;
  auditTrails: ActivityTimeLineModel[] = [];
  qrCodeData?: string;
  qrCodeUrl: string = '';
  transferNotes: ReservationNoteModel[] = [];
  maskName = Utility.maskName;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();
  options: any = {};
  constructor(
    private readonly airportService: AirportService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translocoService: TranslocoService,
    @Inject(APP_CONFIG_GEN) public appConfig: IAppConfig,
  ) { }

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
    this.btnPrint = {
      icon: 'print',
      text: this.translocoService.translate('labels.print'),
      type: 'default',
      onClick: this.print.bind(this),
    };
    this.loadData();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe(() => {
        this.loadData();
      });
    this.GetAuditTrails(this.item.id);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  GetAuditTrails(id: string) {
    this.airportService
      .GetAuditTrails(<GetAuditTrails>{
        entityId: id,
        entityName: 'ReservationGuest',
      })
      .then((transferAuditTrails: TransferAuditTrailModel[]) => {
        this.auditTrails = transferAuditTrails.map((auditTrailItem) =>
          auditTrail.AuditTrailMap(auditTrailItem),
        );
      });
  }

  loadData() {
    this.voucher = this.activatedRoute.snapshot.params['voucher'];
    let routeType = this.activatedRoute.snapshot.queryParams['routeType'];
    this.airportService
      .GetReservationByVoucher(this.voucher, { routeType: routeType })
      .then((res: ReservationDetailModel) => {
        if (res) {
          this.item = res;
          this.reservationExtras = this.item.reservationExtras?.map(y => ReservationMapper.ReservationExtraModelMap(y, this.item.oprVoucher!)) || [];
          this.setCheckTrueFalse();
          let voucher = res.sysVoucher;
          this.externalVoucher = res.oprVoucher;
          if (res.oprVoucher != undefined || res.oprVoucher != null) {
            voucher = `${voucher}@${res.oprVoucher}`;
          }
          this.loadNotes();
          this.qrCodeData = `${this.appConfig.whereIsMyBusUrl}?voucher=${voucher}@${res.oprVoucher}`;

          for (const guest of this.item.guests!) {
            if (guest.guestType == GuestType.Adult && guest.title == GuestTitle.Mr) {
              guest.profile = 'assets/icons/adult_128.png';
            }
            if (guest.guestType == GuestType.Adult && guest.title == GuestTitle.Mrs) {
              guest.profile = 'assets/icons/adult_mrs_128.png';
            }
            if (guest.guestType == GuestType.Adult && guest.title == GuestTitle.Grp) {
              guest.profile = 'assets/icons/group_user_128.png';
            }
            if (guest.guestType == GuestType.Child) {
              guest.profile = 'assets/icons/child_128.png';
            }
            if (guest.guestType == GuestType.Infant) {
              guest.profile = 'assets/icons/infant_128.png';
            }
          }
        }
      });
  }

  selectedTabChanged = (e: any) => {
    if (e.index == 0) {
      this.airportService
        .TransferBookingNotes(this.item.id)
        .then((res: ReservationNoteModel[]) => {
          this.transferNotes = res;
        });
    }
  }

  loadNotes() {
    this.airportService
      .TransferBookingNotes(this.item.id)
      .then((res: ReservationNoteModel[]) => {
        this.transferNotes = res;
      });
  }

  print(): Promise<any> {
    let me = this;
    const printContents = document.getElementById('printcontent')?.innerHTML ?? '';
    const popupWin = window.open(
      '',
      '_blank',
      'top=100,left=100,height=600,width=1000',
    );
    if (!popupWin) return Promise.reject('popup blocked');
    return new Promise((resolve, reject) => {
      popupWin.document.open();
      const html = `
      <html>
        <head>
          <title>Print</title>
          <style type="text/css">
          body {
            height: 295px;
            width: 767px
            overflow: hidden;
            font-family: Arial, Helvetica, sans-serif;
            position: relative;
            margin: 0;
            padding: 0;
          }

          #print {
  width: 767px;
  height: 310px;
  border: 1px solid red;
  background-repeat: no-repeat;
  background-size: 767px 310px;
}

.print-card {
  width: 767px;
  height: 310px;
  position: absolute;
  z-index: 0;
  opacity: 0.4;
}

.sheet {
  margin: 0;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  page-break-after: always;
  height: 295px; //78mm
  width: 767px; // 203mm;
  float: left;
  font-family: Arial, Helvetica, sans-serif;
  z-index: 10;
}

@page {
  margin: 0
}

.info-content {
  position: absolute;
  top: 80px;
  height: 189px;
  width: 559px;
  color: black;
}

.info-content .barcode-content {
  position: absolute;
  top: 0px;
  left: 390px;
  z-index: 999;
}
.info-content .barcode-content .barcode-title {
  position: absolute;
  top: -35px;
  font-size: 15px;
  text-align: center;
  letter-spacing: 0px;
  color: white;
  width: 25mm;
  color: black;
  font-weight: bold;
}

.barcode-content2 {
  position: absolute;
  top: 100px;
  right: 83px;
  z-index: 999;
}

.barcode-content2 .barcode-title {
  font-size: 12px;
  text-align: center;
  letter-spacing: 0px;
  color: white;
  width: 25mm;
  background-color: black;
  font-weight: bold;
}

.message1 {
  position: absolute;
  font-size: 12px;
  text-align: center;
  top: 195px;
  left: 390px;
  font-weight: bold;
}

.message2 {
  position: absolute;
  font-size: 15px;
  text-align: center;
  top: 54px;
  left: 560px;
  font-weight: bold;
}

.message3 {
  position: absolute;
  font-size: 12px;
  text-align: center;
  top: 200px;
  left: 560px;
}

.barcode_image {
  width: 100px !important;
  height: 100px !important;
}

.barcode_image2 {
  width: 100px !important;
  height: 100px !important;
}
          </style>
        </head>
    <body>${printContents}</body>
      </html>`;
      popupWin.document.write(html);
      popupWin.document.close();
      popupWin.focus();
      popupWin.print();
      setInterval(function () {
        popupWin.close();
      }, 300);

      popupWin.onafterprint = () => {
        me.changeDetectorRef.markForCheck();
        resolve('');
      };
    });
  }

  goToReservationClick() {
    let query = this.activatedRoute.snapshot.queryParams;
    this.router.navigate(
      [this.options.reservationDetail(this.voucher)], { relativeTo: this.activatedRoute, queryParams: query });
  }

  onAllValuesChanged(e: any, key: string) {
    this.item.guests?.forEach((guest) => {
      switch (key) {
        case 'IsDeskOn':
          guest.isDeskOn = e.checked;
          guest.noShow = false;
          guest.selfTransfer = false;
          break;
        case 'SelfTransfer':
          guest.isDeskOn = false;
          guest.noShow = false;
          guest.selfTransfer = e.checked;
          break;
        case 'NoShow':
          guest.isDeskOn = false;
          guest.noShow = e.checked;
          guest.selfTransfer = false;
          break;
      }
    });
    var guests = this.item.guests?.map((x) => x.id) ?? [];
    this.changeStatus(key, e.checked, guests);
    this.setCheckTrueFalse();
  }

  onItemDeskOnValueChanged = (e: any, guest: ReservationGuestModel) => {
    guest.isDeskOn = e.checked;
    guest.noShow = false;
    guest.selfTransfer = false;
    this.changeStatus('IsDeskOn', e.checked, [guest.id!]);
  };

  onItemSelfTransferValueChanged = (e: any, guest: ReservationGuestModel) => {
    guest.isDeskOn = false;
    guest.noShow = false;
    guest.selfTransfer = e.checked;
    this.changeStatus('SelfTransfer', e.checked, [guest.id!]);
  };

  onItemNoShowValueChanged = (e: any, guest: ReservationGuestModel) => {
    guest.isDeskOn = false;
    guest.noShow = e.checked;
    guest.selfTransfer = false;
    this.changeStatus('NoShow', e.checked, [guest.id!]);
  };

  changeStatus(field: string, value: boolean, guestIds?: (string | undefined)[]) {
    let requestModel = <ChangeReservationGuestStatus>{
      guestIds: guestIds,
      field: field,
      value: value,
    };
    this.airportService
      .ChangeReservationGuestStatus(this.item.id, requestModel)
      .then((res: CommandResponse<boolean>) => {
        if (res) {
          this.loadData();
        }
      });
  }

  setCheckTrueFalse() {
    this.deskOn = this.checkIfAllValuesTrue('isDeskOn');
    this.selfTransfer = this.checkIfAllValuesTrue('selfTransfer');
    this.noShow = this.checkIfAllValuesTrue('noShow');
  }

  checkIfAllValuesTrue(key: keyof ReservationGuestModel): boolean {
    let result = true;
    if (!this.item.guests || this.item.guests.length == 0) {
      return false;
    }
    for (let i = 0; i < this.item.guests.length; i++) {
      let x = this.item.guests[i];
      if (x[key] == false) {
        result = false;
        break;
      }
    }
    return result;
  }
}
