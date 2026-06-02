import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationEventService } from '../../services/reservation-event.service';
import moment from 'moment';
import { AuthService } from 'genesis-coreservice';
import { FlightReservationFormComponent } from '../components/flight-reservation-form/flight-reservation-form.component';
import { FlightService } from '../services/flight.service';
import { CreateFlightBooking, FlightDateModel, FlightGuestModel, RouteType } from '../models/flight.models';
import { GuestModel } from '../../../airport-planning/models/airport.models';
import { TranslocoService } from '@jsverse/transloco';
import { ReservationGuestModel } from '../../transfer-reservations';

@Component({
    selector: 'app-create-fligt-booking',
    templateUrl: './create-fligt-booking.component.html',
    standalone: true,
    imports: [FlightReservationFormComponent],
    providers: [FlightService],
})
export class CreateFligtBookingComponent implements OnInit {
    loadingVisible: boolean = false;
    data: CreateFlightBooking = <CreateFlightBooking><unknown>{
        flights: [
            {
                routeType: RouteType.Arrival,
            },
        ],
        guests: [],
    };
    hasTotalAmountInput: boolean = false;
    constructor(
        private flightService: FlightService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private eventService: ReservationEventService,
        private router: Router,
        private readonly translocoService: TranslocoService,
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (
            navigation?.extras.state &&
            navigation?.extras.state['transferRouteType']
        ) {
            this.data.flights[0].routeType =
                navigation.extras.state['transferRouteType'];
        }
    }
    async ngOnInit(): Promise<void> {
        this.eventService.pageTitleChange$ =
            this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle']);
        const permissions = await this.authService.getPermissions();
        this.hasTotalAmountInput = permissions?.includes(
            'Transfer.Input.TotalAmount',
        );

        this.data.voucher = this.activatedRoute.snapshot.params['voucher'];
        this.data.flights[0].routeType = this.activatedRoute.snapshot.params['routeType'];
        if (this.data.voucher != undefined) {
            const guests = await this.flightService.GetReservationGuestsByVoucher(this.data.voucher, this.data.flights[0].routeType);
            if (guests) {
                this.data.guests = guests.map((x) =>
                    this.guestModelToFlightGuestMap(x),
                );
            }
        }
    }

    onDepartureDateValueChanged = (e: any) => {
        const index = this.data.flights.findIndex(
            (item) => item.routeType == e.routeType,
        );
        if (this.data.flights[index].flightCode) {
            const date = moment(e.value).format('YYYY-MM-DD');
            this.flightService
                .GetFlightDateByCode(this.data.flights[index].flightCode, date)
                .then((res: FlightDateModel) => {
                    this.data.flights[index].departureTime = res.departureTime;
                    this.data.flights[index].arrivalTime = res.arrivalTime;
                });
        }
    };

    onSaveClick(data: CreateFlightBooking) {
        this.loadingVisible = true;
        data.guests.map((guest) => {
            guest.id = null;
        });
        this.flightService
            .CreateFlightBooking(data)
            .then((response) => {
                if (response) {
                    this.data = <CreateFlightBooking><unknown>{
                        guests: [],
                        flights: [
                            {
                                routeType: RouteType.Departure,
                            },
                        ],
                    };
                }
            })
            .finally(() => {
                this.loadingVisible = false;
            });
    }

    guestModelToFlightGuestMap(x: ReservationGuestModel): FlightGuestModel {
        return <FlightGuestModel>{
            id: x.id,
            firstName: x.firstName,
            lastName: x.lastName,
            guestType: x.guestType,
            idOrPassportNo: x.idOrPassportNo,
            nationality: x.nationality,
            title: x.title,
            email: x.email,
            phoneNumber: x.phoneNumber
        };
    }
}
