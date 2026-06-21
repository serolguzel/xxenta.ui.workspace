import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ActivatedRoute } from '@angular/router';
import { CoreService, Utility } from 'genesis-coreservice';
import { ButtonModule } from 'primeng/button';
import { CheckIcon } from 'primeng/icons/check';
import { TimesIcon } from 'primeng/icons/times';

@Component({
  selector: 'user-picture-form',
  templateUrl: './user-picture.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    ImageCropperComponent,
    ButtonModule,
    CheckIcon,
    TimesIcon,
  ]
})
export class UserPictureComponent implements OnInit {
  @ViewChild(ImageCropperComponent, { static: false }) cropper?: ImageCropperComponent;
  @Output() onCancelClick = new EventEmitter<string>();

  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  userId: string = '';

  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute
  ) {}

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

  loadImageFailed() {}

  save() {
    if (this.croppedImage !== '') {
      this.coreService.postCall(`User/ChangeProfilePicture/${this.userId}`, {
        picture: this.croppedImage,
        userId: this.userId
      });
    }
  }

  cancel() {
    this.onCancelClick.emit(this.croppedImage);
  }
}
