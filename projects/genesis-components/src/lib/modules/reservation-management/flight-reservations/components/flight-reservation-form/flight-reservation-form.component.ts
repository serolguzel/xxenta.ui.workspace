import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChildren,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {
    DxDataGridModule,
    DxFormModule,
    DxLoadPanelModule,
    DxTemplateHost,
    DxTemplateModule,
    DxToolbarModule,
    NestedOptionHost,
} from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import { cloneDeep } from 'lodash';
import moment from 'moment/moment';
import { FlightFormComponent } from './flight-form/flight-form.component';
import { FlightGuestsComponent } from './flight-guests/flight-guests.component';
import { CreateFlightBooking, CreateFlightBookingModel, RouteType } from '../../models/flight.models';
import { LookupService } from '../../../../../services/lookup.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'flight-reservation-form',
    templateUrl: './flight-reservation-form.component.html',
    standalone: true,
    imports: [
        CommonModule,
        DxFormModule,
        DxDataGridModule,
        DxTemplateModule,
        DxToolbarModule,
        MatDividerModule,
        FlightFormComponent,
        FlightGuestsComponent,
        DxLoadPanelModule,
        TranslocoModule
    ],
    providers: [
        LookupService,
        DxTemplateHost,
        NestedOptionHost,
    ],
})
export class FlightReservationFormComponent implements OnInit {
    @Input() data: CreateFlightBooking;
    @Input() hasSaveButton: boolean = false;
    @Input() hasDeleteButton: boolean = false;
    @Input() hasTotalAmountInput: boolean = false;
    @Input() canAddDepartureFlight: boolean = false;
    @Input() loadingVisible: boolean = false;
    @Output() onDepartureDateValueChanged: EventEmitter<any>;
    @Output() onSaveClick: EventEmitter<CreateFlightBooking>;
    @Output() onDeleteClick: EventEmitter<unknown>;
    @Output() onCancelClick: EventEmitter<boolean>;

    @ViewChildren(FlightFormComponent) flightForms: FlightFormComponent[];

    ifGuestsFormHasError: boolean = false;
    btnSave = {
        icon: 'save',
        text: 'Kaydet',
        type: 'default',
        onClick: this.saveClick.bind(this),
    };

    btnDelete = {
        icon: 'trash',
        text: 'Sil',
        type: 'danger',
        onClick: this.deleteClick.bind(this),
    };

    addArrivalFlightButton = {
        icon: 'add',
        text: 'Dönüş Ucuşu Ekle',
        type: 'warning',
        onClick: this.addArrivalFlight.bind(this),
    };
    currenciesLookUpOptions: any = {};

    constructor(
        public lookupService: LookupService,
    ) {
        this.onSaveClick = new EventEmitter();
        this.onDeleteClick = new EventEmitter();
        this.onCancelClick = new EventEmitter();
        this.onDepartureDateValueChanged = new EventEmitter();
    }
    async ngOnInit(): Promise<void> {
        this.currenciesLookUpOptions = await this.lookupService.GetOrganizationCurrenciesOptions();
    }

    saveClick() {
        if (this.checkIfFormValidated()) {
            const manipulatedData: CreateFlightBooking = cloneDeep(this.data);
            manipulatedData.guests.forEach((el) => {
                if (!el.id) {
                    el.id = null;
                }
            });
            manipulatedData.flights.map((flight) => {
                flight.departureDate = moment(flight.departureDate).format(
                    'YYYY-MM-DD',
                );
                flight.departureTime = moment(flight.departureTime).format(
                    'HH:mm',
                );
                flight.arrivalTime = moment(flight.arrivalTime).format('HH:mm');
            });
            this.onSaveClick.emit(manipulatedData);
        }
    }

    checkIfFormValidated() {
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

    deleteClick() {
        let confirmPopup = confirm(
            'Silmek istediğinize emin misiniz?',
            'Emin misiniz?',
        );
        confirmPopup.then((dialogResult) => {
            if (dialogResult) {
                this.onDeleteClick.emit(this.data);
            }
        });
    }

    addArrivalFlight() {
        if (this.data.flights.length < 2) {
            this.data.flights.push(<CreateFlightBookingModel>{
                routeType: RouteType.Departure,
            });
        }
    }

    async deleteFlight() {
        let confirmPopup = await confirm(
            'Silmek istediğinize emin misiniz?',
            'Emin misiniz?',
        );
        if (confirmPopup) {
            this.data.flights.pop();
        }
    }

    departureValueChanged(e: any) {
        this.onDepartureDateValueChanged.emit(e);
    }

    protected readonly RouteType = RouteType;
}
