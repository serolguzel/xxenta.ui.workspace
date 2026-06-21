import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckIcon } from 'primeng/icons/check';
import { TimesIcon } from 'primeng/icons/times';
import { UpdateUserEmail } from '../components/user-form/user-form.models';

@Component({
  selector: 'user-email-form',
  templateUrl: './user-email.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    CheckIcon,
    TimesIcon,
  ]
})
export class UserEmailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);

  @Input() data: UpdateUserEmail = {} as UpdateUserEmail;
  @Output() onCancelClick = new EventEmitter<UpdateUserEmail>();

  form!: FormGroup;

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });

    this.data.userId = this.activatedRoute.snapshot.params['userId'];
    const res = await this.coreService.getCall(`User/GetUserLookUpById/${this.data.userId}`);
    if (res) {
      this.data.email = res.email;
      this.form.patchValue({ email: res.email });
    }
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.data.email = this.form.get('email')!.value;
      this.coreService.putCall(`User/UpdateUserEmail/${this.data.userId}`, this.data);
    }
  }

  cancel() {
    this.onCancelClick.emit(this.data);
  }
}
