import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { AuthService, CommandResponse, ConstantRoles, CoreService, UserType } from 'genesis-coreservice';
import { GuideEventService } from '../../services/guide-event.service';
import { CreateInfoCocktail } from '../../models/info-cocktail.models';
import { LookupService } from '../../../../services/lookup.service';
import { TranslocoModule } from '@jsverse/transloco';


@Component({
  selector: 'guest-items',
  templateUrl: './guest-items.component.html',
  standalone: true,
  imports: [
    NgIf,
    DxTemplateModule,
    DxDataGridModule,
    TranslocoModule
  ],
  providers: [
    LookupService
  ]
})
export class GuestItemsComponent implements OnInit {
  @Input() data: any[] = [];
  isAdmin: boolean = false;
  guideOptions: any;

  constructor(
    public lookupService: LookupService,
    private coreService: CoreService,
    private authService: AuthService,
    private eventService: GuideEventService
  ) {
    this. guideOptions = this.lookupService.userLookupOptions({ userType: UserType.Guide });
   }

  async ngOnInit() {
    var user = await this.authService.getProfile();
    this.isAdmin = (user.role?.includes(ConstantRoles.SystemAdmin) || user.role?.includes(ConstantRoles.SuperAdmin) || user.role?.includes(ConstantRoles.Admin)) ?? false;
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    let data = <CreateInfoCocktail>{
      reservationIds: [assign.reservationId],
      hotelId: assign.hotelId,
      guideId: assign.guideId,
      beginTime: assign.beginTime,
      date: assign.date
    };
    e.newData = data;
    this.coreService.putCall(`InfoCockTail/${assign.id}`, data).then((res: CommandResponse<boolean>)=> {
      if(res){
        this.eventService.setReloadEvent$ = 1;
      }
    });
  }

  onRowUpdated = (e: any) => {
  }
}
