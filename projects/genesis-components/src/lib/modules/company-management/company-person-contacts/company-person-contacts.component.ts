import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'app-company-person-contacts',
  templateUrl: './company-person-contacts.component.html',
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
export class CompanyPersonContactsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  loadPath: string = '';

  contactTypes = [
    { id: 'ReservationAuthorized', name: 'Reservation Authorized' },
    { id: 'InvoiceAuthorized', name: 'Invoice Authorized' },
    { id: 'ContractAuthorized', name: 'Contract Authorized' }
  ];

  columns: GenesisColumn[] = [
    { field: 'firstName', header: this.translocoService.translate('labels.first-name'), filter: true },
    { field: 'lastName', header: this.translocoService.translate('labels.last-name'), filter: true },
    { field: 'contactType', header: this.translocoService.translate('labels.contact-type'), filter: true },
    { field: 'email', header: this.translocoService.translate('labels.email'), filter: true },
    { field: 'confirmEmail', header: this.translocoService.translate('labels.confirm-email'), type: 'boolean' },
    { field: 'phone', header: this.translocoService.translate('labels.phone'), filter: true },
    { field: 'confirmPhone', header: this.translocoService.translate('labels.confirm-phone'), type: 'boolean' },
    { field: 'isDefault', header: this.translocoService.translate('labels.is-default'), type: 'boolean' },
    { field: 'isDeleted', header: this.translocoService.translate('labels.is-deleted'), type: 'boolean' },
  ];

  ngOnInit(): void {
    const companyId = this.activatedRoute.snapshot.params['companyId'];
    this.loadPath = `CompanyContactPerson/${companyId}`;
  }
}
