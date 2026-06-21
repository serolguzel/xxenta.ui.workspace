import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationAccountingInfoDto } from '../../services/models/tenant.models';
import { TenantService } from '../../services/tenant.service';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { CommandResponse } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-organization-accounting-info',
  templateUrl: './organization-accounting-info.component.html',
  styleUrl: './organization-accounting-info.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule
  ],
  providers: [
    TenantService
  ]
})
export class OrganizationAccountingInfoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tenantService = inject(TenantService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  data: OrganizationAccountingInfoDto = <OrganizationAccountingInfoDto>{};
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      officialName: [null, Validators.required],
      officialAddress: [null, Validators.required],
      taxNumber: [null, Validators.required],
      taxOffice: [null],
    });

    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.data.organizationId = organizationId;
    this.loadData(organizationId);
  }

  loadData(organizationId: string) {
    this.tenantService.GetOrganizationAccountingInfo(organizationId).then((res) => {
      if (res) {
        this.data = res;
        this.form.patchValue(res);
      } else {
        this.data = <OrganizationAccountingInfoDto>{ organizationId };
        this.form.reset();
      }
      this.cdr.detectChanges();
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.data = { ...this.data, ...this.form.getRawValue() };
      if (this.data.id) {
        this.tenantService.UpdateOrganizationAccountingInfo(this.data).then((res: CommandResponse<string>) => {
          this.loadData(this.data.organizationId);
        });
      } else {
        this.tenantService.CreateOrganizationAccountingInfo(this.data).then((res: CommandResponse<string>) => {
          this.loadData(this.data.organizationId);
        });
      }
    }
  }

  cancel() {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadData(organizationId);
  }
}
