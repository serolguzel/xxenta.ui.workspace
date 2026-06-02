import { NgClass } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import {
  DxButtonModule,
  DxFileUploaderModule,
  DxProgressBarModule,
  DxTabPanelModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { API_CONFIG_GEN, ApiClientConfig, AuthService } from 'genesis-coreservice'

export interface UploadOptions {
  folder?: string;
  multiple: boolean;
  allowedFileExtensions?: string[];
  fileName?: string;
}

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    MatButtonModule,
    MatIconModule,
    DxProgressBarModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxToolbarModule,
    DxTabPanelModule,
    TranslocoModule
  ],
})
export class ImageUploaderComponent implements OnInit {
  @Input() options: UploadOptions = <UploadOptions>{};
  @Output() onFileUploaded: EventEmitter<any>;
  isUploaded = false;
  textVisible = true;
  progressVisible = false;
  progressValue = 0;
  uploadUrl: string = '';
  uploadHeaders: any = {};
  btnRetrigger = {
    icon: 'info',
    type: 'default',
    text: 'Re-Trigger',
    stylingMode: 'contained',
    onClick: this.reTrigger.bind(this),
  };
  constructor(
    @Inject(API_CONFIG_GEN) public config: ApiClientConfig,
    private authService: AuthService
  ) { 
    this.onFileUploaded = new EventEmitter<any>();
  }

  async ngOnInit(): Promise<void> {

    let token = await this.authService.getAccessToken();
    this.uploadUrl = this.urlBuilder();
   
    this.uploadHeaders = {
      Authorization: `Bearer ${token}`,
    };
  }

  onUploaded(e: any) {
    this.textVisible = true;
    this.progressVisible = false;
    this.progressValue = 0;
    this.isUploaded = true;
    this.onFileUploaded.emit(e);
  }

  onProgress(e: any) {
    this.progressValue = (e.bytesLoaded / e.bytesTotal) * 100;
  }

  onUploadStarted(e: any) {
    this.isUploaded = false;
    this.progressVisible = true;
    this.uploadUrl = this.urlBuilder();
  }

  reTrigger(e: any) { }

  private urlBuilder(): string {
    var url = `${this.config.apiHost}/FileUploader`;
    if (!this.options.multiple) {
      url += '/Single';
    } else {
      url += '/Multiple';
    }
    if (this.options.folder)
      url += `/${this.options.folder}`;
    else
      url += '/tour_extras';

    if (this.options.fileName)
      url += `?fileName=${this.options.fileName}`;

    return url;
  }
}
