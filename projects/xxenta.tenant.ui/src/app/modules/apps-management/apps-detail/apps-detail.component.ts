import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { OrganizationService } from 'genesis-components';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AppsModel } from '../../services/models/tenant.models';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-apps-detail',
  templateUrl: './apps-detail.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    CheckboxModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule
  ]
})
export class AppsDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly tenantService = inject(TenantService);
  private readonly organizationService = inject(OrganizationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  app: AppsModel = <AppsModel>{};
  presentationTypes = this.tenantService.presentationTypes;
  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;

  form: FormGroup = this.fb.group({
    code: [null, Validators.required],
    name: [null, Validators.required],
    description: [null, Validators.required],
    icon: [null, Validators.required],
    link: [null],
    clientId: [null],
    price: [null],
    currency: [null],
    noShow: [false],
    presentationType: [null]
  });

  ngOnInit(): void {
    const appId = this.activatedRoute.snapshot.params['appId'];
    this.loadApp(appId);
  }

  private loadApp(appId: string): void {
    this.tenantService.GetAppById(appId).then((res: AppsModel) => {
      this.app = res;
      this.form.patchValue(res);
      this.cdr.detectChanges();
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.tenantService.UpdateApps(this.app.id, { ...this.app, ...this.form.getRawValue() });
    }
  }

  cancel(): void {
    const appId = this.activatedRoute.snapshot.params['appId'];
    this.loadApp(appId);
  }
}
