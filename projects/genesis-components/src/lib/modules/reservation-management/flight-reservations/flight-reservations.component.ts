import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ReservationEventService } from '../services/reservation-event.service';
import { FlightGuestListViewComponent } from './flight-guest-list-view/flight-guest-list-view.component';
import { CoreService } from 'genesis-coreservice';
import { LookupService } from '../../../services/lookup.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
    selector: 'app-flight-reservations',
    templateUrl: './flight-reservations.component.html',
    standalone: true,
    imports: [
        RouterLink,
        DxTemplateModule,
        DxDataGridModule,
        FlightGuestListViewComponent,
        TranslocoModule
    ],
    providers: [LookupService],
})
export class FlightReservationsComponent implements OnInit {
    dataSource: CustomStore;
    filter: any = {
        requireTotalCount: true,
    };
    companyOptions: any;
    options: any = {};
    constructor(
        private coreService: CoreService,
        private lookupService: LookupService,
        private eventService: ReservationEventService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private readonly translocoService: TranslocoService,
    ) {
        this.companyOptions = {
            width: 240,
            onValueChanged: this.onCompanyValueChanged.bind(this),
            ...this.lookupService.organizationLookUpOptions,
            placholder: 'Operatör:',
        };
    }
    ngOnInit(): void {
        this.options = this.activatedRoute.snapshot.data;
        this.eventService.pageTitleChange$ = this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle']);

        this.dataSource = new DataSourceBuilder(this.coreService)
            .load('FlightBooking', this.filter)
            .setKey('id')
            .build();
    }

    search = (e: any) => {
        this.dataSource = new DataSourceBuilder(this.coreService)
            .load('FlightBooking', this.filter)
            .setKey('id')
            .build();
    };

    createItem = (e: any) => {
        this.router.navigate([this.options.createFlightReservation()], {
            relativeTo: this.activatedRoute,
        });
    };

    onCompanyValueChanged(e: any) {
        if (e.value) {
            this.filter['operatorId'] = e.value;
        } else {
            delete this.filter['operatorId'];
        }
    }
}
