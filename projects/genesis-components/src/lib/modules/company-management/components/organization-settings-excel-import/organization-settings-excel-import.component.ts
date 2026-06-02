import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrganizationSettingsModel } from '../../company.models';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'organization-settings-excel-import',
  standalone: true,
  imports: [],
  templateUrl: './organization-settings-excel-import.component.html'
})
export class OrganizationSettingsExcelImportComponent implements OnInit {
  @Input() data: OrganizationSettingsModel = <OrganizationSettingsModel>{};
  @Output() onDeleteClick: EventEmitter<OrganizationSettingsModel>;
  
  constructor() {
    this.onDeleteClick = new EventEmitter();
  }
  ngOnInit(): void {

  }

  onDelete(item: OrganizationSettingsModel) {
    let confirmPopup = confirm('Are tou sure to delete the item?', "Are you sure?");
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onDeleteClick.emit(item);
      }
    });
  }
}
