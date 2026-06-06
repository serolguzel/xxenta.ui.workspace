import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxFormComponent, DxFormModule, DxLookupModule, DxToolbarModule, DxTooltipModule } from 'devextreme-angular';
import { NgFor, NgIf } from '@angular/common';
import { confirm } from 'devextreme/ui/dialog';
import { CodeNamePair, CoreService, Utility } from 'genesis-coreservice';
import { CreateClientModel } from './client-form.models';
import { ClientOpitons } from './client-options';
import { TranslocoModule } from '@jsverse/transloco';


@Component({
  selector: 'client-form',
  templateUrl: './client-form.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    DxFormModule,
    DxLookupModule,
    DxToolbarModule,
    DxTooltipModule,
    TranslocoModule
  ]
})
export class ClientFormComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Output() onSaveClick: EventEmitter<CreateClientModel>;
  @Output() onCancelClick: EventEmitter<CreateClientModel>;
  @Output() onDeleteClick: EventEmitter<CreateClientModel>;
  @Input() data: CreateClientModel = <CreateClientModel>{};
  @Input() options: ClientOpitons = <ClientOpitons>{
    showOwnerLookup: false,
    showAllowedGrantType: true,
    showOperatorCode: true,
    showAllowedScope: true,
    accessTokenLifetime: true
  };
  @Input() tenantsLookUpOptions: any = {};
  @Input() hasSaveButton: boolean = false;
  @Input() hasDeleteButton: boolean = false;
  @Input() deleteButtonVisible: boolean = false;

  allowedGrantTypes: CodeNamePair[] = [
    {
      code: 'gt:implicit',
      name: 'Implicit'
    },
    {
      code: 'gt:authorization_code',
      name: 'Code'
    },
    {
      code: 'gt:refresh_token',
      name: 'RefreshToken'
    },
    {
      code: 'gt:urn:ietf:params:oauth:grant-type:token-exchange',
      name: 'TokenExchange'
    },
    {
      code: 'gt:client_credentials',
      name: 'ClientCredentials'
    },
    {
      code: 'gt:password',
      name: 'Password'
    },
    {
      code: 'gt:urn:ietf:params:oauth:grant-type:device_code',
      name: 'DeviceFlow'
    }
  ]
  isTooltipVisible: boolean = false;
  scopes: CodeNamePair[] = [];
  codeNameTemplate = Utility.codeNameTemplate;
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.onSave.bind(this)
  };
  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };

  btnDelete = {
    icon: 'trash',
    text: 'Delete',
    onClick: this.delete.bind(this)
  };

  redirectUrisOptions: any[] = [];
  postLogoutRedirectUrisOptions: any[] = [];
  allowedCorsOriginsOptions: any[] = [];

  addRedirectUrisButtonOptions: any;
  addPostLogoutRedirectUrisButtonOptions: any;
  addAllowedCorsOriginsButtonOptions: any;

  isCode: boolean = false;



  constructor(
    private coreService: CoreService,

  ) {
    this.onSaveClick = new EventEmitter();
    this.onCancelClick = new EventEmitter();
    this.onDeleteClick = new EventEmitter();
  }
  ngOnInit(): void {

    this.addRedirectUrisButtonOptions = {
      icon: 'add',
      text: 'Add Uri',
      onClick: () => {
        this.data.redirectUris.push('');
        this.redirectUrisOptions = this.getRedirectUrisOptions(this.data.redirectUris);
      }
    };

    this.addPostLogoutRedirectUrisButtonOptions = {
      icon: 'add',
      text: 'Add Logout Uri',
      onClick: () => {
        this.data.postLogoutRedirectUris.push('');
        this.postLogoutRedirectUrisOptions = this.getPostLogoutRedirectUrisOptions(this.data.postLogoutRedirectUris);
      }
    };

    this.addAllowedCorsOriginsButtonOptions = {
      icon: 'add',
      text: 'Add Cors Origin',
      onClick: () => {
        this.data.allowedCorsOrigins.push('');
        this.allowedCorsOriginsOptions = this.getAllowedCorsOriginsOptions(this.data.allowedCorsOrigins);
      }
    };
    if (!this.options.showAllowedGrantType) {
      this.data.allowedGrantTypes = ['client_credentials'];
    }
    if(!this.options.showAllowedScope){
      this.data.allowedScopes = ['IdentityServerApi'];
    }
    this.coreService.getCall('Client/GetScopes').then((res: CodeNamePair[]) => {
      if (res) {
        this.scopes = res;
      }
    });
  }

  onSave() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.onSaveClick.emit(this.data);
    }
  }

  cancel() {
    this.onCancelClick.emit(this.data);
  }

  delete() {
    let confirmPopup = confirm('Are you sure you want to delete this item?', "Are you sure?");
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.onDeleteClick.emit(this.data);
      }
    });
  }

  setIsCode(data: CreateClientModel) {
    this.isCode = data.allowedGrantTypes.includes('authorization_code');
  }

  setOptions(item: CreateClientModel) {
    this.redirectUrisOptions = this.getRedirectUrisOptions(item.redirectUris) ?? [];
    this.postLogoutRedirectUrisOptions = this.getPostLogoutRedirectUrisOptions(item.postLogoutRedirectUris) ?? [];
    this.allowedCorsOriginsOptions = this.getAllowedCorsOriginsOptions(item.allowedCorsOrigins) ?? [];
  }

  allowedGrantTypeValueChanged = (e: any) => {
    this.isCode = e.value.includes('authorization_code');
  }

  getRedirectUrisOptions(uris: string[]) {
    const options = [];
    for (let i = 0; i < uris.length; i++) {
      options.push(this.generateNewRedirectUrisOptions(i));
    }
    return options;
  }

  getPostLogoutRedirectUrisOptions(uris: string[]) {
    const options = [];
    for (let i = 0; i < uris.length; i++) {
      options.push(this.generateNewPostLogoutRedirectUrisOptions(i));
    }
    return options;
  }

  getAllowedCorsOriginsOptions(uris: string[]) {
    const options = [];
    for (let i = 0; i < uris.length; i++) {
      options.push(this.generateNewAllowedCorsOriginsOptions(i));
    }
    return options;
  }

  generateNewRedirectUrisOptions(index: number) {
    return {
      buttons: [{
        name: 'trash',
        location: 'after',
        options: {
          stylingMode: 'text',
          icon: 'trash',
          onClick: () => {
            this.data.redirectUris.splice(index, 1);
            this.redirectUrisOptions = this.getRedirectUrisOptions(this.data.redirectUris);
          },
        },
      }],
    };
  }

  generateNewPostLogoutRedirectUrisOptions(index: number) {
    return {
      buttons: [{
        name: 'trash',
        location: 'after',
        options: {
          stylingMode: 'text',
          icon: 'trash',
          onClick: () => {
            this.data.postLogoutRedirectUris.splice(index, 1);
            this.postLogoutRedirectUrisOptions = this.getPostLogoutRedirectUrisOptions(this.data.redirectUris);
          },
        },
      }],
    };
  }

  generateNewAllowedCorsOriginsOptions(index: number) {
    return {
      buttons: [{
        name: 'trash',
        location: 'after',
        options: {
          stylingMode: 'text',
          icon: 'trash',
          onClick: () => {
            this.data.allowedCorsOrigins.splice(index, 1);
            this.allowedCorsOriginsOptions = this.getAllowedCorsOriginsOptions(this.data.allowedCorsOrigins);
          },
        },
      }],
    };
  }
}
