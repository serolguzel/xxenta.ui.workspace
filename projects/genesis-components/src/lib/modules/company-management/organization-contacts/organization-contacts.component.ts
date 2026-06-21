import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'app-organization-contacts',
  templateUrl: './organization-contacts.component.html',
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
export class OrganizationContactsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  loadPath: string = '';
  contactTypes = [{ id: 'Email', name: 'Email' }, { id: 'Phone', name: 'Phone' }];

  columns: GenesisColumn[] = [
    { field: 'text', header: 'Text', filter: true },
    { field: 'contactType', header: 'Contact Type', filter: true },
    { field: 'confirm', header: 'Confirm', type: 'boolean' },
    { field: 'isDefault', header: 'Is Default', type: 'boolean' },
    { field: 'isDeleted', header: 'Is Deleted', type: 'boolean' },
  ];

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadPath = `OrganizationContact/${organizationId}`;
  }
}
