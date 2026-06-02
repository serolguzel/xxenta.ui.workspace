import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
    DxFormModule, NestedOptionHost, DxTemplateHost, DxFormComponent,
} from "devextreme-angular";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import { CreateFlightBookingModel } from '../../../models/flight.models';
import { LookupService } from '../../../../../../services/lookup.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-flight-form',
    templateUrl: './flight-form.component.html',
    standalone: true,
    imports: [
        NgIf,
        DxFormModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        TranslocoModule
    ],
    providers: [
        LookupService,
        DxTemplateHost,
        NestedOptionHost
    ]
})
export class FlightFormComponent {
    @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
    @Input() title: string;
    @Input() flight: CreateFlightBookingModel;
    @Input() hasTotalAmountInput: boolean;
    @Input() onClickRemoveButton?: () => void;
    @Input() currenciesLookUpOptions: any = {};
    @Output() onDepartureDateValueChanged: EventEmitter<any>;
    flightLookUpOptions: any;

    constructor(
        public lookupService: LookupService,
    ) {
        this.onDepartureDateValueChanged = new EventEmitter();
        this.flightLookUpOptions = {
            ...this.lookupService.flightLookUpOptions,
            onSelectionChanged: this.onFlightSelectionChanged.bind(this),
        };
    }

    public isValidated() {
        return this.form.instance.validate().isValid;
    }

    onFlightSelectionChanged(e: any) {
        const item = e.selectedItem;
        this.flight.flightCode = item.code;
        if (item.fromAirport && item.toAirport) {
            this.flight.fromAirport = item.fromAirport;
            this.flight.toAirport = item.toAirport;
        }
    }
    departureDateValueChanged = (e: any) => {
        this.onDepartureDateValueChanged.emit({
            ...e,
            routeType: this.flight.routeType,
        });
    }
}
