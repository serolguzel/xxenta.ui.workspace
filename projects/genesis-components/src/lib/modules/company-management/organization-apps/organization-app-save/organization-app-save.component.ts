import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { IdNamePair } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { CreateOrganizationApp, OrganizationAppsModel } from '../../company.models';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'lib-organization-app-save',
  templateUrl: './organization-app-save.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TableModule,
  ],
  providers: [OrganizationService]
})
export class OrganizationAppSaveComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly organizationService = inject(OrganizationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    appId: [null, Validators.required],
    url: [null],
    price: [null],
    currency: [null],
    paymentType: [null],
    priceCalculatorType: [null],
  });

  apps: IdNamePair[] = [];
  subApps: OrganizationAppsModel[] = [];
  selectedRows: OrganizationAppsModel[] = [];
  organizationId: string = '';

  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
  priceCalculatorTypes = this.organizationService.priceCalculatorTypes;
  pamentTypes = this.organizationService.paymentTypes;
  presentationTypes = this.organizationService.presentationTypes;

  async ngOnInit(): Promise<void> {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    const appId = this.activatedRoute.snapshot.params['appId'];
    this.apps = await this.organizationService.GetAppsLookup();
    if (appId) {
      const queryRequest = { organizationId: this.organizationId, appId };
      const app = await this.organizationService.GetOrganizationAppByAppId(queryRequest);
      this.form.patchValue(this.CreateMap(app));
      this.subApps = app.subApps ?? [];
      this.selectedRows = (app.subApps ?? []).filter(x => x.isSelected);
    } else {
      this.form.patchValue({ organizationId: this.organizationId } as any);
    }
  }

  presentationTypeName(value: any): string {
    return this.presentationTypes.find(x => x.id === value)?.name ?? value;
  }

  save(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const appId = this.activatedRoute.snapshot.params['appId'];
    const model = { ...this.form.getRawValue(), organizationId: this.organizationId } as CreateOrganizationApp;
    model.subApps = this.selectedRows.map(x => ({
      appId: x.appId,
      organizationId: this.organizationId,
      price: x.price,
      currency: x.currency,
      appType: x.appType,
      url: x.url,
      priceCalculatorType: x.priceCalculatorType,
      paymentType: x.paymentType,
    } as unknown as CreateOrganizationApp));

    if (appId) {
      this.organizationService.UpdateOrganizationApp(model);
    } else {
      this.organizationService.CreateOrganizationApp(model);
    }
  }

  cancel(): void {
    this.router.navigate([`/tenant/tenants/apps/${this.organizationId}`]);
  }

  onAppValueChanged(event: { value: string }): void {
    this.getSubApps(event.value);
  }

  getSubApps(parentId: string): void {
    const appId = this.activatedRoute.snapshot.params['appId'];
    if (appId) {
      return;
    }
    const queryRequest = { appId: parentId };
    this.organizationService.GetOrganizationAppByAppId(queryRequest).then((res: OrganizationAppsModel) => {
      this.subApps = (res.subApps ?? []).map(x => ({
        appId: x.appId,
        organizationId: this.organizationId,
        price: x.price,
        currency: res?.currency != null ? res.currency : 'EUR',
        appType: x.appType,
        app: x.app,
        presentationType: x.presentationType,
        organization: { id: this.organizationId } as IdNamePair,
      } as OrganizationAppsModel));
      this.selectedRows = [];
    });
  }

  private CreateMap(item: OrganizationAppsModel): CreateOrganizationApp {
    return {
      organizationId: item.organizationId,
      appId: item.appId,
      price: item.price,
      currency: item.currency,
      url: item.url,
      priceCalculatorType: item.priceCalculatorType,
      paymentType: item.paymentType,
      appType: item.appType,
      subApps: item.subApps != null ? item.subApps.map(x => this.CreateMap(x)) : [],
    } as CreateOrganizationApp;
  }
}
