import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { CommonDatas } from 'genesis-shell';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { LookupService } from '../../../../services/lookup.service';
import { CreateUser, UpdateUser } from './user-form.models';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    SelectModule,
  ],
  providers: [LookupService, ConfirmationService]
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly coreService = inject(CoreService);

  @Input() disableSaveButton: boolean = true;
  @Input() disableDeleteButton: boolean = true;
  @Input() visibleCustomerLookup: boolean = false;
  @Input() visibleUserType: boolean = false;

  @Input() set model(value: CreateUser | UpdateUser) {
    this._model = value ?? ({} as CreateUser);
    if (this.form) {
      this.form.patchValue(value);
      if ((value as UpdateUser)?.id) {
        this.form.get('userName')?.disable();
      } else {
        this.form.get('userName')?.enable();
      }
    }
  }
  get model(): CreateUser | UpdateUser { return this._model; }
  private _model: CreateUser | UpdateUser = {} as CreateUser;

  @Output() onSaveClick = new EventEmitter<CreateUser | UpdateUser>();
  @Output() onCancelClick = new EventEmitter<CreateUser | UpdateUser>();
  @Output() onDeleteClick = new EventEmitter<CreateUser | UpdateUser>();

  form!: FormGroup;
  genders = CommonDatas.genders;
  userTypes = CommonDatas.userTypes;
  customers: any[] = [];
  phoneCodes: any[] = [];

  ngOnInit() {
    this.buildForm();
    this.loadLookupData();
  }

  private buildForm() {
    const m = this._model as UpdateUser;
    this.form = this.fb.group({
      userName: [{ value: m.userName ?? null, disabled: !!m.id }, Validators.required],
      userType: [m.userType ?? null],
      gender: [m.gender ?? null, this.visibleUserType ? Validators.required : null],
      firstName: [m.firstName ?? null, Validators.required],
      lastName: [m.lastName ?? null, Validators.required],
      email: [m.email ?? null, Validators.email],
      identityNumber: [m.identityNumber ?? null],
      phoneAreaCode: [m.phoneAreaCode ?? null],
      phoneNumber: [m.phoneNumber ?? null],
      ownerId: [m.ownerId ?? null, this.visibleCustomerLookup ? Validators.required : null],
      isActive: [m.isActive ?? false],
      emailConfirmed: [m.emailConfirmed ?? false],
    });
  }

  private async loadLookupData() {
    const [phoneRaw, customerRaw] = await Promise.all([
      this.coreService.getCall('Country/GetCountriesLookup', { isPhoneAreaCodeNotNull: 'Y' }),
      this.visibleCustomerLookup
        ? this.coreService.getCall('Organization/GetOrganizationsLookup', { isTenant: true })
        : Promise.resolve([])
    ]);

    const toArray = (raw: any) => Array.isArray(raw) ? raw : (raw?.data ?? []);

    this.phoneCodes = toArray(phoneRaw).map((item: any) => ({
      ...item,
      displayName: `${item.phoneCode} (${item.name})`
    }));
    this.customers = toArray(customerRaw);
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.onSaveClick.emit({ ...this._model, ...this.form.getRawValue() });
    }
  }

  delete() {
    this.confirmationService.confirm({
      message: this.translocoService.translate('messages.delete-confirmation-description'),
      header: this.translocoService.translate('messages.are-you-sure'),
      accept: () => this.onDeleteClick.emit(this._model)
    });
  }

  cancel() {
    this.onCancelClick.emit(this._model);
  }
}
