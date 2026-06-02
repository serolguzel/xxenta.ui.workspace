import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import { filter, Subject, takeUntil } from 'rxjs';
import { ReservationEventService } from '../../services/reservation-event.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DxFormModule, DxLoadPanelModule, DxPopupModule, DxTemplateModule, DxToolbarModule } from 'devextreme-angular';
import { AuthService, CommandResponse, ConstantRoles, UserLookupModel, UserModel } from 'genesis-coreservice';
import { TransferResAuditTrailComponent } from '../../../../components/transfer/transfer-res-audit-trail/transfer-res-audit-trail.component';
import { ReservationNotesComponent } from '../../../../components/transfer/reservation-notes/reservation-notes.component';
import { ActivityTimelineComponent } from '../../../../timelines/activity/activity-timeline.component';
import { TransferReservationFormComponent } from '../components/transfer-reservation-form/transfer-reservation-form.component';
import { TransferReservationService } from '../services/transfer-reservation.service';
import { GetAuditTrails, TransferAuditTrailModel } from '../../../airport-planning/models/airport.models';
import { ActivityTimeLineModel } from '../../../../timelines/activity/activity.models';
import { auditTrail } from '../../../airport-planning/models/audit-trail.mapping';
import { CreateReservation, ReservationModel, TransferExtraModel } from '../models/reservation.models';
import { ReservationMapper } from '../models/reservation.mappings';
import { CancelReservation, CancelReservationResponse, GetTransferPlanByReservationResponse } from '../models/transfer-res.models';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-detail-reservation',
  templateUrl: './detail-reservation.component.html',
  standalone: true,
  imports: [
    NgIf,
    TransferResAuditTrailComponent,
    DxLoadPanelModule,
    DxPopupModule,
    DxTemplateModule,
    DxFormModule,
    DxToolbarModule,
    MatTabsModule,
    MatDividerModule,
    ReservationNotesComponent,
    ActivityTimelineComponent,
    TranslocoModule,
    TransferReservationFormComponent,
    RouterLink
],
  providers: [TransferReservationService],
})
export class DetailReservationComponent implements OnInit, OnDestroy {
  formData: CreateReservation = <CreateReservation><unknown>{
    guests: [],
    bookings: [],
  };
  user: UserModel;
  item: ReservationModel = <ReservationModel>{};
  transferPlan: GetTransferPlanByReservationResponse = <GetTransferPlanByReservationResponse>{};
  createdUser: UserLookupModel;
  transferCancelModel: CancelReservation = <CancelReservation>{
    cancelNote: '',
  };
  extrasDataSource: TransferExtraModel[] = [];
  auditTrails: ActivityTimeLineModel[] = [];
  loadingVisible: boolean = false;
  isPopupVisible: boolean = false;
  formDisabled: boolean = false;
  hasCancelButton: boolean = false;
  hasSaveButton: boolean = false;
  hasTotalAmountInput: boolean = false;
  hasDeleteButton: boolean = false;

  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  btnTransferCancelOption: any;

  reservationDetailLink: string;
  options: any = {};
  constructor(
    private readonly transferService: TransferReservationService,
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly eventService: ReservationEventService,
    private readonly router: Router,
    private readonly translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
    this.btnTransferCancelOption = {
      text: this.translocoService.translate('labels.save'),
      icon: 'save',
      type: 'default',
      locateInMenu: 'always',
      useSubmitBehavior: true,
      onClick: this.saveTransferCancelClick.bind(this),
    };
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll),
    )
      .subscribe(() => {
        this.loadData();
      });
    this.loadData();
    this.initializeAsyncData();
  }

  private async initializeAsyncData(): Promise<void> {
    const permissions = await this.authService.getPermissions();
    this.user = await this.authService.getProfile();
    this.hasTotalAmountInput = permissions?.includes('Transfer.Input.TotalAmount',);
    this.hasDeleteButton = (this.user.role?.includes(ConstantRoles.SystemAdmin) || this.user.role?.includes(ConstantRoles.SuperAdmin) || this.user.role?.includes(ConstantRoles.Admin)) ?? false;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadData() {
    let id = this.activatedRoute.snapshot.params['id'];

    this.transferService.GetReservationById(id).then((res: ReservationModel) => {
      if (res) {
        this.formData = ReservationMapper.CreateReservationMap(res);
        this.item = res;
        let pageTitle = `${res.oprVoucher}-${this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle'])}`;
        this.eventService.pageTitleChange$ = pageTitle;
        this.formDisabled = res.cancel || res.isLock;
        this.hasCancelButton = !res.cancel && !res.isLock;
        this.hasSaveButton = res.cancel || res.isLock;
        this.reservationDetailLink = this.options.editTransferReservation(this.item.return?.id);
        this.transferService.GetTransferExtrasByOperatorId(res.operator?.id!)
          .then((res) => {
            this.extrasDataSource = res;
          });
        this.transferService.GetTransferPlanByReservationId(id).then((plan: GetTransferPlanByReservationResponse) => {
          this.transferPlan = plan;
        });
        this.GetAuditTrails(res.id);
        this.setCreatedUser(res.createBy);
      }
    });
  }

  GetAuditTrails(id: string) {
    this.transferService.GetAuditTrails(<GetAuditTrails>{
      entityId: id,
    }).then((res: TransferAuditTrailModel[]) => {
      this.auditTrails = res.map((auditTrailData) => auditTrail.AuditTrailMap(auditTrailData));
    });
  }

  async setCreatedUser(userId: string) {
    var result = await this.transferService.GetUserLookupById(userId);
    this.createdUser = result;
  }

  onSaveClick(data: CreateReservation) {
    this.loadingVisible = true;
    var model = ReservationMapper.UpdateReservationMap(data);
    this.transferService.UpdateReservation(this.item.id, model)
      .then((x) => {
        this.GetAuditTrails(this.item.id);
      })
      .finally(() => {
        this.loadingVisible = false;
      });
  }

  onDeleteClick(item: CreateReservation) {
    const deleteConfirm = this.translocoService.translate('messages.are-you-sure-delete');
    const deleteConfirmTitle = this.translocoService.translate('messages.are-you-sure');
    let confirmPopup = confirm(deleteConfirm, deleteConfirmTitle);
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.transferService.TrashReservation(this.item.id).then((res: CommandResponse<string>) => {
          if (res) {
            this.router.navigate([
              this.options.transferList(),
            ]);
          }
        });
      }
    });
  }

  saveTransferCancelClick() {
    this.transferCancelModel.cancel = true;
    this.transferService.CancelReservation(this.item.id, this.transferCancelModel)
      .then((res: CancelReservationResponse) => {
        if (res?.cancel) {
          this.formDisabled = res.cancel;
          this.hasCancelButton = res.cancel;
          this.hasSaveButton = res.cancel;
          this.item.cancel = res.cancel;
          this.item.cancelDate = res.cancelDate;
        }
        this.isPopupVisible = false;
      });
  }

  onCancelClick() {
    this.isPopupVisible = true;
  }

  onHidden(e: any) {
    this.isPopupVisible = false;
  }
}
