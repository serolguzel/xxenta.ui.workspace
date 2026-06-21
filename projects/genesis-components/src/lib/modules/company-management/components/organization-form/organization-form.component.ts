import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { IdNamePair } from 'genesis-coreservice';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { UpdateOrganization } from '../../company.models';
import { OrganizationService } from '../../services/organization.service';
import { FormOptions } from './form-options';

const URL_PATTERN = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

@Component({
  selector: 'organization-form',
  templateUrl: './organization-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    FloatLabelModule,
    InputTextModule,
    MenuModule,
    MultiSelectModule,
    SelectModule,
  ],
  providers: [ConfirmationService]
})
export class OrganizationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly organizationService = inject(OrganizationService);
  private readonly confirmationService = inject(ConfirmationService);

  @Output() onSaveClick = new EventEmitter<UpdateOrganization>();
  @Output() onCancelClick = new EventEmitter<UpdateOrganization>();
  @Output() onDeleteClick = new EventEmitter<UpdateOrganization>();
  @Output() onPassiveClick = new EventEmitter<UpdateOrganization>();
  @Output() onReActiveClick = new EventEmitter<UpdateOrganization>();

  @Input() set data(value: UpdateOrganization) {
    this._data = value ?? ({ countryId: 'TR', lock: false } as UpdateOrganization);
    if (this.form) {
      this.form.patchValue(this._data);
      this._data.lock ? this.form.disable() : this.form.enable();
      if (this._data.countryId) {
        this.loadCities(this._data.countryId);
      }
    }
    this.refreshMenuVisibility();
  }
  get data(): UpdateOrganization { return this._data; }
  private _data: UpdateOrganization = { countryId: 'TR', lock: false } as UpdateOrganization;

  @Input() disabledoprVoucher: boolean = true;
  @Input() hasSaveButton: boolean = false;
  @Input() options: FormOptions = {} as FormOptions;

  form!: FormGroup;
  organizationTypes = this.organizationService.OrganizationTypes;
  countryDataSource: any[] = [];
  cityDataSource: IdNamePair[] = [];

  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [this._data.code ?? null, Validators.required],
      name: [this._data.name ?? null, Validators.required],
      officialName: [this._data.officialName ?? null],
      organizationTypes: [this._data.organizationTypes ?? null, Validators.required],
      countryId: [this._data.countryId ?? 'TR', Validators.required],
      cityId: [this._data.cityId ?? null, Validators.required],
      isTenant: [this._data.isTenant ?? false],
      address: [this._data.address ?? null],
      webSite: [this._data.webSite ?? null, Validators.pattern(URL_PATTERN)],
    });

    if (this._data.lock) {
      this.form.disable();
    }

    this.buildMenu();

    this.organizationService.getCall('Country/GetCountriesLookup', { requireTotalCount: true })
      .then((res: any) => {
        this.countryDataSource = Array.isArray(res) ? res : (res?.data ?? []);
      });

    if (this._data.countryId) {
      this.loadCities(this._data.countryId);
    }
  }

  onCountryChange(event: { value: string }): void {
    this.form.patchValue({ cityId: null });
    this.loadCities(event.value);
  }

  private loadCities(countryId: string): void {
    this.organizationService.GetCitiesByCountryId(countryId)
      .then((res: IdNamePair[]) => this.cityDataSource = res ?? []);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.onSaveClick.emit({ ...this._data, ...this.form.getRawValue() });
    }
  }

  cancel(): void {
    this.onCancelClick.emit(this._data);
  }

  private buildMenu(): void {
    this.menuItems = [
      { label: 'Passive', icon: 'pi pi-eye-slash', command: () => this.disabledItem() },
      { label: 'Re Active', icon: 'pi pi-eye', visible: false, command: () => this.enabledItem() },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteItem() },
    ];
    this.refreshMenuVisibility();
  }

  private refreshMenuVisibility(): void {
    if (!this.menuItems.length) return;
    const [passive, reactive, del] = this.menuItems;
    if (this._data.lock) {
      passive.visible = false;
      reactive.visible = true;
    }
    if (this._data.isDeleted) {
      del.visible = false;
    }
  }

  deleteItem(): void {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure?',
      accept: () => this.onDeleteClick.emit(this._data)
    });
  }

  disabledItem(): void {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure to make this company passive?<br/> <b> If you make it passive, all users of the company are going to be made inactive too.</b>',
      accept: () => this.onPassiveClick.emit(this._data)
    });
  }

  enabledItem(): void {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure to make this company active?<br/> <b> If you make it active, all users of the company are going to be made active too.</b>',
      accept: () => this.onReActiveClick.emit(this._data)
    });
  }
}
