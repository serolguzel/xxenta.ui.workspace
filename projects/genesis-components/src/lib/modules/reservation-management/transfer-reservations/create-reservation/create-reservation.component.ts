import { Component, OnInit, ViewChild } from '@angular/core';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ReservationEventService } from '../../services/reservation-event.service';
import { AuthService, CommandResponse, SnackbarService, TransferRouteType, Utility } from 'genesis-coreservice';
import { TransferReservationService } from '../services/transfer-reservation.service';
import { TransferReservationFormComponent } from '../components/transfer-reservation-form/transfer-reservation-form.component';
import { LookupService} from '../../../../services/lookup.service';
import { CreateReservation, CreateReservationModel } from '../models/reservation.models';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-create-reservation',
    templateUrl: './create-reservation.component.html',
    styleUrls: ['./create-reservation.component.scss'],
    standalone: true,
    imports: [
    DxLoadPanelModule,
    TransferReservationFormComponent
],
    providers: [TransferReservationService, LookupService],
})
export class CreateReservationComponent implements OnInit {
    @ViewChild(TransferReservationFormComponent, { static: false })
    form: TransferReservationFormComponent;
    formData: CreateReservation = <CreateReservation><unknown>{
        guests: [],
        bookings: [
            <CreateReservationModel>{
                transferRouteType: TransferRouteType.Arrival,
            },
        ],
    };

    loadingVisible: boolean = false;
    hasDeleteButton: boolean = false;
    hasTotalAmountInput: boolean = false;
    constructor(
        private transferService: TransferReservationService,
        public lookupService: LookupService,
        private authService: AuthService,
        private snackbarService: SnackbarService,
        private eventService: ReservationEventService,
        private activatedRoute: ActivatedRoute,
        private readonly translocoService: TranslocoService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.eventService.pageTitleChange$ = this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle']);
        const permissions = await this.authService.getPermissions();
        this.hasTotalAmountInput = permissions?.includes('Transfer.Input.TotalAmount');
    }

    onSaveClick(item: CreateReservation) {
        this.loadingVisible = true;
        item.bookings.map((booking) => {
            booking.flightDate = moment(booking.flightDate).format(Utility.DefaultDateOnlyFormat);
            booking.transferDate = moment(booking.transferDate).format(Utility.DefaultDateOnlyFormat);
            if (typeof booking.arrivalTime === 'object') {
                booking.arrivalTime = moment(booking.arrivalTime).format(Utility.DefaultTimeFormat);
            }
            if (typeof booking.departureTime === 'object') {
                booking.departureTime = moment(booking.departureTime).format(Utility.DefaultTimeFormat);
            }
            if (typeof booking.pickupTime === 'object') {
                booking.pickupTime = moment(booking.pickupTime).format(Utility.DefaultTimeFormat);
            }
        });
        item.guests.map((guest)=>{
            if (typeof guest.birthDate === 'object') {
                guest.birthDate = moment(guest.birthDate).format(Utility.DefaultDateOnlyFormat);
            }
        });
        this.transferService
            .CreateReservation(item)
            .then((res: CommandResponse<string>) => {
                if (res) {
                    this.formData = <CreateReservation><unknown>{
                        guests: [],
                        bookings: [
                            <CreateReservationModel>{
                                transferRouteType: TransferRouteType.Arrival,
                            },
                        ],
                    };
                    this.snackbarService.Success(
                        `Voucher <a href="./transfer/reservations/edit/${res.aggregatorId}">${res.aggregatorId}</a>`,
                        'Voucher',
                        {
                            enableHtml: true,
                        },
                    );
                }
            })
            .finally(() => {
                this.loadingVisible = false;
            });
    }
}
