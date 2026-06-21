import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
  QueryList,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { cloneDeep } from 'lodash';
import moment from 'moment/moment';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CreateFlightBooking, CreateFlightBookingModel, RouteType } from '../../models/flight.models';
import { FlightFormComponent } from './flight-form/flight-form.component';
import { FlightGuestsComponent } from './flight-guests/flight-guests.component';

@Component({
  selector: 'flight-reservation-form',
  templateUrl: './flight-reservation-form.component.html',
  standalone: true,
  imports: [
    TranslocoModule,
    ButtonModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    FlightFormComponent,
    FlightGuestsComponent,
  ],
  providers: [ConfirmationService],
})
export class FlightReservationFormComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly confirmationService = inject(ConfirmationService);

  @Input() data!: CreateFlightBooking;
  @Input() hasSaveButton: boolean = false;
  @Input() hasDeleteButton: boolean = false;
  @Input() hasTotalAmountInput: boolean = false;
  @Input() canAddDepartureFlight: boolean = false;
  @Input() loadingVisible: boolean = false;

  @Output() onDepartureDateValueChanged = new EventEmitter<any>();
  @Output() onSaveClick = new EventEmitter<CreateFlightBooking>();
  @Output() onDeleteClick = new EventEmitter<unknown>();
  @Output() onCancelClick = new EventEmitter<boolean>();

  @ViewChildren(FlightFormComponent) flightForms!: QueryList<FlightFormComponent>;

  ifGuestsFormHasError: boolean = false;
  currencies: any[] = [];

  protected readonly RouteType = RouteType;

  ngOnInit(): void {
    this.coreService.getCall('OrganizationCurrency/GetCurrencies').then((res: any) => {
      this.currencies = Array.isArray(res) ? res : (res?.data ?? []);
    });
  }

  saveClick(): void {
    if (this.checkIfFormValidated()) {
      const manipulatedData: CreateFlightBooking = cloneDeep(this.data);
      manipulatedData.guests.forEach((el) => {
        if (!el.id) {
          el.id = null as any;
        }
      });
      manipulatedData.flights.forEach((flight) => {
        flight.departureDate = moment(flight.departureDate).format('YYYY-MM-DD');
        flight.departureTime = moment(flight.departureTime).format('HH:mm');
        flight.arrivalTime = moment(flight.arrivalTime).format('HH:mm');
      });
      this.onSaveClick.emit(manipulatedData);
    }
  }

  checkIfFormValidated(): boolean {
    let isValidated = true;
    this.flightForms.forEach((form) => {
      if (!form.isValidated()) {
        isValidated = false;
      }
    });
    if (!this.data.guests.length) {
      isValidated = false;
      this.ifGuestsFormHasError = true;
    } else {
      this.ifGuestsFormHasError = false;
    }
    return isValidated;
  }

  deleteClick(): void {
    this.confirmationService.confirm({
      header: 'Emin misiniz?',
      message: 'Silmek istediğinize emin misiniz?',
      accept: () => this.onDeleteClick.emit(this.data),
    });
  }

  addArrivalFlight(): void {
    if (this.data.flights.length < 2) {
      this.data.flights.push(<CreateFlightBookingModel>{
        routeType: RouteType.Departure,
      });
    }
  }

  deleteFlight(): void {
    this.confirmationService.confirm({
      header: 'Emin misiniz?',
      message: 'Silmek istediğinize emin misiniz?',
      accept: () => this.data.flights.pop(),
    });
  }

  departureValueChanged(e: any): void {
    this.onDepartureDateValueChanged.emit(e);
  }
}
