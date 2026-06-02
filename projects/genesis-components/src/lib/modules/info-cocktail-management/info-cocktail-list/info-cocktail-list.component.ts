import { DatePipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { AuthService, ConstantRoles, SnackbarService, TransferRouteType, UserType } from 'genesis-coreservice';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { GuideEventService } from '../services/guide-event.service';
import { CreateInfoCocktail } from '../models/info-cocktail.models';
import { InfoCocktailService } from '../services/info-cocktail.service';
import { BadgeTaskStatusComponent } from '../../../badges/badge-taskstatus/badge-taskstatus.component';
import { LookupService } from '../../../services/lookup.service';
import { GuestItemsComponent } from '../components/guest-items/guest-items.component';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';


@Component({
  selector: 'info-cocktail-list',
  templateUrl: './info-cocktail-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgForOf,
    DatePipe,
    DxTemplateModule,
    DxDataGridModule,
    TranslocoModule,
    GuestItemsComponent,
    BadgeTaskStatusComponent
  ],
  providers: [
    LookupService,
    InfoCocktailService
  ]
})
export class InfoCocktailListComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent, { static: false }) reservationGrid: DxDataGridComponent;
  dataSource: CustomStore;
  filter: any = {
    requireTotalCount: true
  };
  date: Date;
  isAdmin: boolean = false;
  companyOptions: any;
  transferRouteTypes: any;
  guideOptions: any;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public lookupService: LookupService,
    private authService: AuthService,
    private infoCocktailService: InfoCocktailService,
    private eventService: GuideEventService,
    private snackBar: SnackbarService
  ) {
    this.companyOptions = {
      width: 240,
      onValueChanged: this.onCompanyValueChanged.bind(this),
      ...this.lookupService.organizationLookUpOptions,
      placholder: 'Operatör:',
    };
    this.transferRouteTypes = this.infoCocktailService.transferRouteTypes;
    this.guideOptions = this.lookupService.userLookupOptions({ userType: UserType.Guide });
  }

  async ngOnInit() {
    var user = await this.authService.getProfile();
    this.isAdmin = (user?.role?.includes(ConstantRoles.SystemAdmin) || user?.role?.includes(ConstantRoles.SuperAdmin) || user?.role?.includes(ConstantRoles.Admin)) ?? false;
    this.date = new Date();
    this.filter['transferRouteType'] = TransferRouteType.Arrival;
    this.filter['transferDate'] = moment(this.date).add(0, 'days').format('YYYY-MM-DD');

    this.dataSource = new DataSourceBuilder(this.infoCocktailService)
      .load('InfoCockTail', this.filter)
      .updateFullModel('InfoCockTail')
      .setKey("hotelId")
      .build();

    this.eventService.getReloadEvent$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: Notification) => {
        if (res) {
          this.reservationGrid.instance.refresh();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
  search = (e: any) => {
    this.dataSource = new DataSourceBuilder(this.infoCocktailService)
      .load('InfoCockTail', this.filter)
      .updateFullModel('InfoCockTail')
      .setKey("hotelId")
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    let data = <CreateInfoCocktail>{
      reservationIds: assign.items.map((x: any) => x.reservationId),
      hotelId: assign.hotelId,
      guideId: assign.guideId,
      beginTime: assign.beginTime,
      date: assign.date
    };
    e.newData = data;
  }

  onEditingStart = (e: any) => {
    if (e.data.guides.length > 1) {
      e.cancel = true;
      this.snackBar.Warning("Bu otelde birden fazla rehber görevli. Lütfen düzenlemenizi oda bazlı yapınız!");
      return;
    }
  }

  onTransferRouteTypeValueChanged(e: any) {
    if (e.value) {
      this.filter['transferRouteType'] = e.value;
    } else {
      delete this.filter['transferRouteType'];
    }
  }

  onCompanyValueChanged(e: any) {
    if (e.value) {
      this.filter['operatorId'] = e.value;
    } else {
      delete this.filter['operatorId'];
    }
  }

  onVehicleTypeValueChanged(e: any) {
    if (e.value) {
      this.filter['vehicleTypeId'] = e.value;
    } else {
      delete this.filter['vehicleTypeId'];
    }
  }

  onDateValueChanged = (e: any) => {
    if (e.value) {
      this.filter['transferDate'] = moment(e.value).format('YYYY-MM-DD');
    } else {
      delete this.filter['transferDate'];
    }
  }

  private getUserInfo(data: any): any {
    var guide = data.guides.filter((y: any) => y.id == data.guideId);
    return guide;
  }
}
