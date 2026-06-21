import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'lib-organization-currency',
  templateUrl: './organization-currency.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class OrganizationCurrencyComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  organizationId: string = '';
  basePath: string = '';
  currencies: any[] = [];

  columns: GenesisColumn[] = [
    { field: 'currencyCode', header: this.translocoService.translate('labels.currency'), filter: true },
    { field: 'isDefault', header: this.translocoService.translate('labels.is-default'), type: 'boolean' },
  ];

  ngOnInit(): void {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.basePath = `OrganizationCurrency/${this.organizationId}`;

    this.coreService.getCall('Currency/GetCurrenciesLookup').then((data: any) => {
      this.currencies = Array.isArray(data) ? data : (data?.data ?? []);
      this.cdr.detectChanges();
    });
  }
}
