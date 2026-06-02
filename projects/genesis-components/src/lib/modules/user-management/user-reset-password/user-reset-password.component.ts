import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DxButtonModule, DxFormComponent, DxFormModule, DxLoadPanelModule, DxTextBoxModule, DxToolbarModule } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { ChangePasswordAdmin } from '../components/user-form/user-form.models';
import { CommandResponse, CoreService } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

@Component({
  selector: 'user-reset-password-form',
  templateUrl: './user-reset-password.component.html',
  standalone: true,
  imports: [
    NgClass,
    DxFormModule,
    DxToolbarModule,
    DxLoadPanelModule,
    DxTextBoxModule,
    DxButtonModule,
    TranslocoModule
  ],
})
export class UserResetPasswordComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Output() onCancelClick: EventEmitter<ChangePasswordAdmin>;
  loadingVisible: boolean = false;
  passwordMode: DxTextBoxTypes.TextBoxType = 'password';
  rePasswordMode: DxTextBoxTypes.TextBoxType = 'password';

  specialChars = ".-+=_,!@$#*<>[]{}";
  model: ChangePasswordAdmin = <ChangePasswordAdmin>{};
  passwordButtonIcon: string = 'eyeopen';
  rePasswordButtonIcon: string = 'eyeopen';

  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    disabled: false,
    onClick: this.save.bind(this)
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.onCancelClick = new EventEmitter();
  }

  ngOnInit() {
    this.model.userId = this.activatedRoute.snapshot.params['userId'];
  }

  passwordOnClick = (e: any) => {
    this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
    this.passwordButtonIcon = this.passwordMode === 'text' ? 'eyeclose' : 'eyeopen';
  }

  rePasswordOnClick = (e: any) => {
    this.rePasswordMode = this.rePasswordMode === 'text' ? 'password' : 'text';
    this.rePasswordButtonIcon = this.rePasswordMode === 'text' ? 'eyeclose' : 'eyeopen';
  }

  passwordComparison = () => this.model.newPassword;

  get newPassword() {
    var value = this.model.newPassword;
    if (value == null) return false;
    return value.length > 7;
  }

  get upperCase() {
    var value = this.model.newPassword;
    if (value == null) return false;
    var asscii = [];
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);
      asscii.push(code)
    }
    var find = asscii.find(x => x >= 65 && x <= 90) ?? 0;
    return find > 0;
  }

  get lowerCase() {
    var value = this.model.newPassword;
    if (value == null) return false;
    var chars = [];
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);
      chars.push(code)
    }
    var find = chars.find(x => x >= 97 && x <= 122) ?? 0;
    return find > 0;
  }

  get isNumber() {
    var value = this.model.newPassword;
    if (value == null) return false;
    var chars = [];
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);
      chars.push(code)
    }
    var find = chars.find(x => x >= 48 && x <= 57) ?? 0;
    return find > 0;
  }

  get isSpecialChar() {
    var value = this.model.newPassword;
    if (value == null) return false;
    var result = false;
    for (let i = 0; i < value.length; i++) {
      let code = value[i];
      var exists = this.specialChars.includes(code);
      if (exists) {
        result = true;
        break;
      }
    }
    return result;
  }

  save() {
    var valid = this.form.instance.validate().isValid;
    this.btnSave.disabled = true;
    if (valid) {
      this.coreService.postCall("User/ChangePasswordAdmin", this.model)
        .then((x: CommandResponse<string>) => {
          this.btnSave.disabled = false;
        });
    } else {
      this.btnSave.disabled = false;
    }
  }

  cancel() {
    this.onCancelClick.emit(this.model);
  }
}
