import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Utility } from 'genesis-coreservice';
import { ImageCroppedEvent, ImageCropperComponent, OutputFormat } from 'ngx-image-cropper';

@Component({
  selector: 'image-uploader-cropper',
  templateUrl: './image-uploader-cropper.component.html',
  styleUrls: ['./image-uploader-cropper.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    MatButtonModule,
    ImageCropperComponent,
  ]
})
export class ImageUploaderCropperComponent implements OnInit {
  @Output() onCancelClick: EventEmitter<string>;
  @Output() onSaveClick: EventEmitter<SaveEvent>;
  @Output() onImageCropped: EventEmitter<ImageCroppedEvent>;
  @Output() onFileChangeEvent: EventEmitter<any>;
  @Input() format: OutputFormat = 'jpeg';
  @Input() sizes: number[] = [128];
  defaultSize = 512;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  images: ImageModel[] = [];
  originalSize: any = {};
  constructor() {
    this.onCancelClick = new EventEmitter<string>();
    this.onSaveClick = new EventEmitter<SaveEvent>();
    this.onImageCropped = new EventEmitter<ImageCroppedEvent>();
    this.onFileChangeEvent = new EventEmitter<any>();
  }

  ngOnInit() {

  }

  async fileChangeEvent(event: any): Promise<void> {
    this.imageChangedEvent = event;
    this.onFileChangeEvent.emit(event);
    const files = event.target.files as FileList;
    this.originalSize = await Utility.getImageDimensions(files[0]);
  }

  save() {
    const files = this.imageChangedEvent.target.files as FileList;
    let saveEvent = <SaveEvent>{
      resizeImages: this.images,
      files: files
    };
    this.onSaveClick.emit(saveEvent);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.images = [];
    Utility.blobToBase64(event.blob!).then(async (result: any) => {
      this.croppedImage = result;
      for (let i = 0; i < this.sizes.length; i++) {
        const element = this.sizes[i];
        if (element != this.defaultSize) {
          var resize = await Utility.resizeImageFromBase64(result, element, element);
          this.images.push(<ImageModel>{
            image: resize,
            size: element
          });
        }
      }
      this.images.push(<ImageModel>{
        image: result,
        size: this.defaultSize
      });

    });
    this.onImageCropped.emit(event);
  }

  imageLoaded() {
    this.cropperReady = true;
  }
}

export interface ImageModel {
  image: string;
  size: number;
}

export interface SaveEvent {
  resizeImages: ImageModel[];
  files: FileList;
}