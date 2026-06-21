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
  selector: 'lib-organization-airport',
  templateUrl: './organization-airport.component.html',
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
export class OrganizationAirportComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  organizationId: string = '';
  basePath: string = '';
  airports: any[] = [];

  columns: GenesisColumn[] = [
    { field: 'airportCode', header: this.translocoService.translate('labels.airport'), filter: true },
  ];

  ngOnInit(): void {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.basePath = `OrganizationAirport/${this.organizationId}`;

    this.coreService.getCall('Airport').then((data: any) => {
      this.airports = Array.isArray(data) ? data : (data?.data ?? []);
      this.cdr.detectChanges();
    });
  }
}
