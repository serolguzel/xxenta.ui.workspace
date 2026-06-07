import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxFormComponent, DxFormModule, DxToolbarModule } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { UpdateUserEmail } from '../components/user-form/user-form.models';
import { CoreService } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'user-email-form',
  templateUrl: './user-email.component.html',
  standalone: true,
  imports: [
    DxFormModule,
    DxToolbarModule,
    TranslocoModule
  ]
})
export class UserEmailComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Output() onCancelClick: EventEmitter<UpdateUserEmail>;
  @Input() data: UpdateUserEmail = <UpdateUserEmail>{};

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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute
  ) {
      this.onCancelClick = new EventEmitter();
  }
  async ngOnInit(): Promise<void> {
    this.data.userId = this.activatedRoute.snapshot.params['userId'];
    let res = await this.coreService.getCall(`User/GetUserLookUpById/${this.data.userId}`);
    if (res) {
      this.data.email = res.email;
      this.changeDetectorRef.markForCheck();
    }
  }

  save() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      this.coreService.putCall(`User/UpdateUserEmail/${this.data.userId}`, this.data);
    }
  }

  cancel() {
    this.onCancelClick.emit(this.data);
  }
}
