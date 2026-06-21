import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { OrganizationType } from '../../company-management';
import { ReservationEventService } from '../services/reservation-event.service';
import { FlightGuestListViewComponent } from './flight-guest-list-view/flight-guest-list-view.component';

@Component({
    selector: 'app-flight-reservations',
    templateUrl: './flight-reservations.component.html',
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        TranslocoModule,
        ButtonModule,
        SelectModule,
        GenesisDataTableComponent,
        GenesisCellDirective,
        FlightGuestListViewComponent,
    ],
})
export class FlightReservationsComponent implements OnInit {
    private readonly coreService = inject(CoreService);
    private readonly eventService = inject(ReservationEventService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translocoService = inject(TranslocoService);
    private readonly cdr = inject(ChangeDetectorRef);

    @ViewChild(GenesisDataTableComponent) grid!: GenesisDataTableComponent;

    options: any = {};

    /** Server-side isteklere eklenecek filtre parametreleri. */
    extraParams: any = {};

    /** Operatör lookup'u (p-select option dizisi). */
    companyOptions: any[] = [];
    selectedOperatorId: string | null = null;

    columns: GenesisColumn[] = [
        { field: 'voucher', header: 'Voucher', filter: true },
        { field: 'oprVoucher', header: this.translocoService.translate('labels.opr-voucher'), filter: true },
        { field: 'pnrNumber', header: 'PNR', filter: true },
        { field: 'flightCode', header: this.translocoService.translate('labels.flight-code') },
        { field: 'terminalCode', header: this.translocoService.translate('labels.terminal') },
        { field: 'routeType', header: this.translocoService.translate('labels.direction'), filter: true },
        { field: 'departureDate', header: this.translocoService.translate('labels.flight-date'), type: 'date' },
        { field: 'departureTime', header: this.translocoService.translate('labels.departure-time') },
        { field: 'arrivalTime', header: this.translocoService.translate('labels.arrival-time') },
        { field: 'fromAirport', header: this.translocoService.translate('labels.from'), width: '180px' },
        { field: 'toAirport', header: this.translocoService.translate('labels.to') },
        { field: 'operator.name', header: this.translocoService.translate('labels.operator') },
        { field: 'createDate', header: this.translocoService.translate('labels.create-date'), type: 'date', hidden: true },
    ];

    ngOnInit(): void {
        this.options = this.activatedRoute.snapshot.data;
        this.eventService.pageTitleChange$ = this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle']);

        this.coreService
            .getCall('OrganizationPartner/GetPartnersLookup', {
                organizationTypes: JSON.stringify([OrganizationType.Agency, OrganizationType.Operator]),
            })
            .then((data: any) => {
                this.companyOptions = Array.isArray(data) ? data : (data?.data ?? []);
                this.cdr.detectChanges();
            });
    }

    onOperatorChange(): void {
        if (this.selectedOperatorId) {
            this.extraParams = { ...this.extraParams, operatorId: this.selectedOperatorId };
        } else {
            const { operatorId, ...rest } = this.extraParams;
            this.extraParams = rest;
        }
    }

    search(): void {
        this.grid?.reload();
    }

    createItem(): void {
        this.router.navigate([this.options.createFlightReservation()], {
            relativeTo: this.activatedRoute,
        });
    }
}
