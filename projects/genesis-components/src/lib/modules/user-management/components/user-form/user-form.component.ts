import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  DxDateBoxModule,
  DxFormComponent,
  DxFormModule,
  DxLookupModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxToolbarModule
} from 'devextreme-angular';
import { CommonDatas } from 'genesis-shell';
import { LookupService } from '../../../../services/lookup.service';
import { CreateUser, UpdateUser } from './user-form.models';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxTextAreaModule,
    DxLookupModule,
    DxToolbarModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    TranslocoModule
  ],
  providers: [LookupService]
})
export class UserFormComponent {
  @ViewChild(DxFormComponent, { static: false }) form?: DxFormComponent;

  @Input() disableSaveButton: boolean = true;
  @Input() disableDeleteButton: boolean = true;
  @Input() visibleCustomerLookup: boolean = false;
  @Input() visibleUserType: boolean = false;
  @Input() model: CreateUser | UpdateUser = <CreateUser | UpdateUser>{};

  @Output() onSaveClick: EventEmitter<CreateUser | UpdateUser> = new EventEmitter<CreateUser | UpdateUser>();
  @Output() onCancelClick: EventEmitter<CreateUser | UpdateUser> = new EventEmitter<CreateUser | UpdateUser>();
  @Output() onDeleteClick: EventEmitter<CreateUser | UpdateUser> = new EventEmitter<CreateUser | UpdateUser>();
  
  txtPhoneOptions: any = {
    mask: '(000) 000-0000',
    maskRules: { X: '/[02-9]/' }
  };

  customerLookUpOptions: any;
  genders = CommonDatas.genders;
  userTypes = CommonDatas.userTypes;

  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.save.bind(this)
  };

  btnDelete = {
    icon: 'trash',
    text: 'Delete',
    type: "danger",
    onClick: this.delete.bind(this)
  };

  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };

  constructor(
    private translocoService: TranslocoService,
    public lookupService: LookupService) {
    this.customerLookUpOptions = this.lookupService.customerLookUpOptions({isTenant: true});
   }

  save() {
    const valid = this.form?.instance.validate().isValid;
    if (valid) {
      this.onSaveClick.emit(this.model);
    }
  }
  
  delete() {
    let title = this.translocoService.translate('messages.are-you-sure');
    let description = this.translocoService.translate('messages.delete-confirmation-description');
    let confirmPopup = confirm(description, title);
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onDeleteClick.emit(this.model);
      }
    });
  }

  cancel() {
    this.onCancelClick.emit(this.model);
  }
}
