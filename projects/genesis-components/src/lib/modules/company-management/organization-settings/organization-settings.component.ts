import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CommandResponse } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { OrganizationSettingsModel, SaveSettings } from '../company.models';
import { OrganizationSettingsExcelImportComponent } from '../components/organization-settings-excel-import/organization-settings-excel-import.component';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    OrganizationSettingsExcelImportComponent,
  ],
  providers: [OrganizationService]
})
export class OrganizationSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly organizationService = inject(OrganizationService);

  settings: OrganizationSettingsModel[] = [];
  form: FormGroup = this.fb.group({
    key: [null, Validators.required],
    value: [null, Validators.required],
  });

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.organizationService.GetSettings(organizationId).then((res: OrganizationSettingsModel[]) => {
      this.settings = res;
    });
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    const model = this.form.getRawValue() as SaveSettings;
    this.organizationService.SaveSettings(organizationId, model).then((res: CommandResponse<number>) => {
      this.settings.push({
        id: res.aggregatorId,
        organizationId,
        key: model.key,
        value: model.value,
      } as OrganizationSettingsModel);
    });
  }

  deleteItem(item: OrganizationSettingsModel): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.organizationService.DeleteSettings(organizationId, item.key).then((res: CommandResponse<boolean>) => {
      if (res.aggregatorId) {
        const index = this.settings.findIndex(x => x.id === item.id);
        this.settings.splice(index, 1);
      }
    });
  }
}
