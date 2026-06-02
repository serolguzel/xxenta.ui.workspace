import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DxFormComponent, DxFormModule, DxLookupModule, DxTagBoxModule, DxToolbarModule, DxTooltipModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { confirm } from 'devextreme/ui/dialog';
import { IdNamePair } from 'genesis-coreservice';
import { OrganizationService } from '../../services/organization.service';
import { UpdateOrganization } from '../../company.models';
import { FormOptions } from './form-options';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../../services/data-source-builder';

@Component({
  selector: 'organization-form',
  templateUrl: './organization-form.component.html',
  standalone: true,
  imports: [
    DxFormModule,
    DxLookupModule,
    DxToolbarModule,
    DxTagBoxModule,
    DxTooltipModule,
    TranslocoModule
  ]
})
export class OrganizationFormComponent implements OnInit, OnChanges {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Output() onSaveClick: EventEmitter<UpdateOrganization>;
  @Output() onCancelClick: EventEmitter<UpdateOrganization>;
  @Output() onDeleteClick: EventEmitter<UpdateOrganization>;
  @Output() onPassiveClick: EventEmitter<UpdateOrganization>;
  @Output() onReActiveClick: EventEmitter<UpdateOrganization>;
  @Input() data: UpdateOrganization = <UpdateOrganization>{
    countryId: 'TR',
    lock: false
  };
  @Input() disabledoprVoucher: boolean = true;
  @Input() hasSaveButton: boolean = false;
  @Input() options: FormOptions = <FormOptions>{};
  drpDownMenuOptions = {
    text: "Options",
    icon: 'preferences',
    width: 120,
    displayExpr: "name",
    keyExpr: "id",
    items: [
      { value: 10, name: 'Passive', icon: 'eyeclose', visible: true },
      { value: 11, name: 'Re Active', icon: 'eyeopen', visible: false },
      { value: 20, name: 'Delete', icon: 'trash', visible: true }],
    onItemClick: this.optionClick.bind(this),
    dropDownOptions: {
      width: 120
    }
  };
  organizationTypes: any;
  isTooltipVisible: boolean = false;
  countryDataSource: CustomStore;
  cityDataSource: IdNamePair[] = [];
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.save.bind(this)
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };
  btnDelete = {
    icon: 'trash',
    text: 'Delete',
    type: "danger",
    onClick: this.deleteItem.bind(this)
  };
  constructor(
    private organizationService: OrganizationService
  ) {
    this.onSaveClick = new EventEmitter();
    this.onCancelClick = new EventEmitter();
    this.onDeleteClick = new EventEmitter();
    this.onPassiveClick = new EventEmitter();
    this.onReActiveClick = new EventEmitter();
    this.organizationTypes = this.organizationService.OrganizationTypes;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue) {
      var item = changes['data'].currentValue as UpdateOrganization;
      this.drpDownMenuOptions.items.forEach(x => {
        if (x.value == 10 && item.lock) {
          x.visible = false;
        }
        if (x.value == 11 && item.lock) {
          x.visible = true;
        }
        if(this.data.isDeleted && x.value == 20){
          x.visible = false;
        }
      });
    }
  }
  ngOnInit(): void {
    this.countryDataSource = new DataSourceBuilder(this.organizationService)
      .load('Country/GetCountriesLookup', { requireTotalCount: true })
      .byKey('Country/GetCountriesLookup')
      .setKey("id")
      .build();
  }

  onCountrySelectionChanged = (e: any) => {
    this.organizationService.GetCitiesByCountryId(e.selectedItem.id)
      .then((res: IdNamePair[]) => {
        this.cityDataSource = res;
      });
  }

  save() {
    const valid = this.form.instance.validate().isValid;
    if (valid) {
      this.onSaveClick.emit(this.data);
    }
  }

  cancel() {
    this.onCancelClick.emit(this.data);
  }

  optionClick(e: any) {
    switch (e.itemData.value) {
      case 10:
        this.disabledItem();
        break;
      case 11:
        this.enabledItem();
        break;
      case 20:
        this.deleteItem();
        break;
    }
  }

  deleteItem() {
    let confirmPopup = confirm('Are you sure?', "Are you sure?");
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onDeleteClick.emit(this.data);
      }
    });
  }

  disabledItem() {
    let confirmPopup = confirm('Are you sure to make this company passive?<br/> <b> If you make it passive, all users of the company are going to be made inactive too.<b/>', "Are you sure?");
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onPassiveClick.emit(this.data);
      }
    });
  }
  enabledItem() {
    let confirmPopup = confirm('Are you sure to make this company active?<br/> <b> If you make it active, all users of the company are going to be made active too.<b/>', "Are you sure?");
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onReActiveClick.emit(this.data);
      }
    });
  }
}