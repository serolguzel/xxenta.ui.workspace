import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CommandResponse, CoreService } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ChangePasswordAdmin } from '../components/user-form/user-form.models';

function passwordMatchValidator(group: AbstractControl) {
  const pwd = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!pwd || !confirm) return null;
  return pwd === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'user-reset-password-form',
  templateUrl: './user-reset-password.component.html',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
  ]
})
export class UserResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);

  @Output() onCancelClick = new EventEmitter<ChangePasswordAdmin>();

  form!: FormGroup;
  saving = false;
  showPassword = false;
  showConfirmPassword = false;
  specialChars = '.-+=_,!@$#*<>[]{}';

  ngOnInit() {
    const userId = this.activatedRoute.snapshot.params['userId'];
    this.form = this.fb.group({
      userId: [userId],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get newPassword(): boolean {
    const value: string = this.form?.get('newPassword')?.value;
    return !!value && value.length > 7;
  }

  get upperCase(): boolean {
    const value: string = this.form?.get('newPassword')?.value;
    if (!value) return false;
    return /[A-Z]/.test(value);
  }

  get lowerCase(): boolean {
    const value: string = this.form?.get('newPassword')?.value;
    if (!value) return false;
    return /[a-z]/.test(value);
  }

  get isNumber(): boolean {
    const value: string = this.form?.get('newPassword')?.value;
    if (!value) return false;
    return /[0-9]/.test(value);
  }

  get isSpecialChar(): boolean {
    const value: string = this.form?.get('newPassword')?.value;
    if (!value) return false;
    return [...value].some(c => this.specialChars.includes(c));
  }

  save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.saving = true;
    const model: ChangePasswordAdmin = this.form.getRawValue();
    this.coreService.postCall('User/ChangePasswordAdmin', model)
      .then((_: CommandResponse<string>) => {
        this.saving = false;
      })
      .catch(() => {
        this.saving = false;
      });
  }

  cancel() {
    this.onCancelClick.emit(this.form.getRawValue());
  }
}
