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

  private resizeImage(dataUrl: string, maxSize: number = 96): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Image resize failed'))),
          'image/jpeg'
        );
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  save() {
    if (this.croppedImage !== '') {
      this.resizeImage(this.croppedImage, 96).then((blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, `${this.userId}.jpg`);
        formData.append('userId', this.userId);
        debugger;

        this.coreService.fileUpload(`User/ChangeProfilePicture`, formData);
      });
    }
  }

  cancel() {
    this.onCancelClick.emit(this.croppedImage);
  }
}
