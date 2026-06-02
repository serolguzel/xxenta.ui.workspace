import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DxToolbarModule } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { CoreService, Utility } from 'genesis-coreservice';

@Component({
  selector: 'user-picture-form',
  templateUrl: './user-picture.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    ImageCropperComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DxToolbarModule
  ]
})
export class UserPictureComponent implements OnInit {
  @ViewChild(ImageCropperComponent, { static: false }) cropper?: ImageCropperComponent;
  @Output() onCancelClick: EventEmitter<string>;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  userId: string = '';
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
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute) {
    this.onCancelClick = new EventEmitter();
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['userId'];
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageLoaded() {
    this.cropperReady = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      Utility.blobToBase64(event.blob).then((result: unknown) => {
        this.croppedImage = result;
      });
    }
  }

  onFormSubmit(e: any) {
    e.preventDefault();
  }


  imageLoadFailed() {
  }

  loadImageFailed() { }

  save() {
    if (this.croppedImage != '') {
      let request = {
        picture: this.croppedImage,
        userId: this.userId
      };
      this.coreService.postCall(`User/ChangeProfilePicture/${this.userId}`, request);
    }
  }

  cancel() {
    this.onCancelClick.emit(this.croppedImage);
  }

}
