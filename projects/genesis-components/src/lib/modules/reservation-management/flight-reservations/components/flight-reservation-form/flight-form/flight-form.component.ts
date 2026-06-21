import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CreateFlightBookingModel } from '../../../models/flight.models';

@Component({
  selector: 'app-flight-form',
  templateUrl: './flight-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
  ]
})
export class FlightFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coreService = inject(CoreService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() title!: string;
  @Input() flight!: CreateFlightBookingModel;
  @Input() hasTotalAmountInput: boolean = false;
  @Input() onClickRemoveButton?: () => void;
  @Input() currencies: any[] = [];
  @Output() onDepartureDateValueChanged = new EventEmitter<any>();

  form!: FormGroup;
  flights: any[] = [];
  airports: any[] = [];
  operators: any[] = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      pnrNumber: [this.flight?.pnrNumber ?? null, Validators.required],
      flightCode: [this.flight?.flightCode ?? null, Validators.required],
      departureDate: [this.toDate(this.flight?.departureDate), Validators.required],
      departureTime: [this.toDate(this.flight?.departureTime), Validators.required],
      arrivalTime: [this.toDate(this.flight?.arrivalTime), Validators.required],
      fromAirport: [this.flight?.fromAirport ?? null, Validators.required],
      toAirport: [this.flight?.toAirport ?? null, Validators.required],
      oprVoucher: [this.flight?.oprVoucher ?? null],
      operatorId: [this.flight?.operatorId ?? null],
      currency: [this.flight?.currency ?? null],
      purchaseAmount: [this.flight?.purchaseAmount ?? null],
      saleAmount: [this.flight?.saleAmount ?? null],
    });

    // Form değişikliklerini bağlı flight nesnesine yaz; üst bileşen kaydederken
    // cloneDeep(data) ile bu nesneyi okur.
    this.form.valueChanges.subscribe(value => {
      Object.assign(this.flight, value);
    });

    // Lookup verilerini çek.
    this.coreService.getCall('FlightRoute/GetFlightsLookup')
      .then((res: any) => { this.flights = this.toArray(res); this.cdr.detectChanges(); });

    this.coreService.getCall('Airport/GetAirportsLookup')
      .then((res: any) => { this.airports = this.toArray(res); this.cdr.detectChanges(); });

    this.coreService.getCall('OrganizationPartner/GetPartnersLookup', { requireTotalCount: false })
      .then((res: any) => { this.operators = this.toArray(res); this.cdr.detectChanges(); });
  }

  isValidated(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  onFlightSelectionChanged(event: { value: string }): void {
    const item = this.flights.find(f => f.code === event.value);
    if (!item) return;
    this.flight.flightCode = item.code;
    if (item.fromAirport && item.toAirport) {
      this.form.patchValue({ fromAirport: item.fromAirport, toAirport: item.toAirport });
    }
  }

  onDepartureDateChanged(value: Date): void {
    this.onDepartureDateValueChanged.emit({ value, routeType: this.flight.routeType });
    // Üst bileşen seçilen uçuşa göre departureTime/arrivalTime'ı asenkron günceller;
    // güncel değerleri saat alanlarına yansıt.
    setTimeout(() => {
      this.form.patchValue({
        departureTime: this.toDate(this.flight.departureTime),
        arrivalTime: this.toDate(this.flight.arrivalTime),
      }, { emitEvent: false });
      this.cdr.detectChanges();
    });
  }

  private toArray(res: any): any[] {
    return Array.isArray(res) ? res : (res?.data ?? []);
  }

  private toDate(value: any): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}
