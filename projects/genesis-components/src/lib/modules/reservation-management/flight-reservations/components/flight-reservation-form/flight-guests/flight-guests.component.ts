import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService, Static } from 'genesis-coreservice';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { FlightGuestModel } from '../../../models/flight.models';

@Component({
  selector: 'app-flight-guests',
  templateUrl: './flight-guests.component.html',
  styles: ['.redOutline{outline:red solid 1px;}'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TableModule,
  ],
  providers: [ConfirmationService],
})
export class FlightGuestsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coreService = inject(CoreService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translocoService = inject(TranslocoService);

  @Input() guests: FlightGuestModel[] = [];
  @Input() hasError: boolean = false;

  guestTitles = Static.guestTitles;
  guestTypes = Static.guestTypes;
  countries: any[] = [];
  phoneCodes: any[] = [];

  form!: FormGroup;
  editVisible: boolean = false;
  private editIndex: number = -1;

  // code -> translated name (örn. labels.mr)
  titleDisplay = (item: any): string => {
    if (!item) return '';
    return this.translocoService.translate(`labels.${String(item.code).toLowerCase()}`);
  };

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, Validators.required],
      guestType: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      nationality: [null],
      age: [null],
      phoneAreaCode: [null],
      idOrPassportNo: [null],
      email: [null],
      phoneNumber: [null],
    });

    this.coreService.getCall('Country/GetCountriesLookup', { requireTotalCount: true })
      .then((res: any) => { this.countries = this.toArray(res); this.cdr.detectChanges(); });

    this.coreService.getCall('Country/GetCountriesLookup', { requireTotalCount: true, isPhoneAreaCodeNotNull: 'Y' })
      .then((res: any) => { this.phoneCodes = this.toArray(res); this.cdr.detectChanges(); });
  }

  addGuest(): void {
    this.editIndex = -1;
    this.form.reset();
    this.editVisible = true;
  }

  editGuest(guest: FlightGuestModel, index: number): void {
    this.editIndex = index;
    this.form.reset();
    this.form.patchValue(guest);
    this.editVisible = true;
  }

  saveGuest(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const value = this.form.getRawValue();
    // Üst bileşen data.guests dizisini referansla okuduğu için yerinde değiştir.
    if (this.editIndex >= 0) {
      Object.assign(this.guests[this.editIndex], value);
    } else {
      this.guests.push(value as FlightGuestModel);
    }
    this.hasError = false;
    this.editVisible = false;
    this.cdr.detectChanges();
  }

  deleteGuest(index: number): void {
    this.confirmationService.confirm({
      header: 'Emin misiniz?',
      message: 'Silmek istediğinize emin misiniz?',
      accept: () => {
        this.guests.splice(index, 1);
        this.cdr.detectChanges();
      },
    });
  }

  cancelEdit(): void {
    this.editVisible = false;
  }

  private toArray(res: any): any[] {
    return Array.isArray(res) ? res : (res?.data ?? []);
  }
}
