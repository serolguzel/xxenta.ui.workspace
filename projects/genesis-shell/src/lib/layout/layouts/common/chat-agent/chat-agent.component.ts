import { CommonModule, DatePipe, DOCUMENT, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ChatResponse, ChatTransfer } from './chat-agent-models';
import { ChatAgentService } from './chat-agent.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'genesis-chat-agent',
  templateUrl: './chat-agent.component.html',
  styleUrls: ['./chat-agent.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    NgTemplateOutlet,
    DatePipe
  ],
  providers: [ChatAgentService]
})
export class GenesisChatAgentComponent implements OnInit {
  postModel: ChatTransfer = <ChatTransfer>{};
  isPanelOpened = false;
  agentSteps: string[] = [];
  isRecording = false;
  recordedAudio?: Blob;
  recordedAudioUrl = '';
  recordSeconds = 0;
  chatHistory: ChatResponse[] = [];
  data: any = {};
  file?: File;
  private _overlay: HTMLElement | null = null;
  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  private recordTimer?: any;

  constructor(
    private readonly chatAgentService: ChatAgentService,
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly _renderer2: Renderer2,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { 
    this.matIconRegistry.addSvgIcon(
      'xlsx-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/xlsx.svg')
    );
  }

  ngOnInit(): void {
    this.chatHistory = [{
      role: 'agent',
      isComplete: true,
      message: 'Hello! How can I assist you today?',
      createdAt: new Date()
    }];
    this.postModel.sessionId = crypto.randomUUID();
  }

  togglePanel(): void {
    this.isPanelOpened = !this.isPanelOpened;
    if (this.isPanelOpened) {
      this._showOverlay();
    } else {
      this._hideOverlay();
    }
  }

  sendMessage(): void {
    if (!this.postModel.commandText) return;
    this.chatHistory.push({
      role: 'user',
      message: this.postModel.commandText,
      isComplete: true,
      createdAt: new Date()
    });
    this.agentSteps = ['Thinking...'];
    const formData: FormData = new FormData();
    if( this.file) {
       formData.append('file', this.file);
    }
    formData.append('data', JSON.stringify(this.postModel));
    this.chatAgentService.Chat(formData).then((response: ChatResponse) => {
      this.agentSteps = [];
        if (response) {
          this.postModel.commandText = '';
          this.data = response.data;
          console.log('Response data:', this.data);
          response.role = 'agent';
          response.createdAt = new Date();
          this.chatHistory.push(response);
        }
    }).catch((err) => {
        this.agentSteps = [];
        this.chatHistory.push({
          role: 'agent',
          message: 'Sorry, something went wrong.',
          createdAt: new Date()
        });
        console.error('ChatAgentService error:', err);
      });

    // this.chatAgentService.ChatTransfer(this.postModel)
    //   .then((response: ChatResponse) => {
    //     this.agentSteps = [];
    //     if (response) {
    //       this.postModel.commandText = '';
    //       this.data = response.data;
    //       console.log('Response data:', this.data);
    //       response.role = 'agent';
    //       response.createdAt = new Date();
    //       this.chatHistory.push(response);
    //     }
    //   })
    //   .catch((err) => {
    //     this.agentSteps = [];
    //     this.chatHistory.push({
    //       role: 'agent',
    //       message: 'Sorry, something went wrong.',
    //       createdAt: new Date()
    //     });
    //     console.error('ChatAgentService error:', err);
    //   });
  }

  recordVoice(): void {
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.error('getUserMedia not supported on your browser!');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.isRecording = true;
        this.recordSeconds = 0;
        this.startRecordTimer();
        this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);
        this.mediaRecorder.onstop = () => {
          this.isRecording = false;
          this.stopRecordTimer();
          this.recordedAudio = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.recordedAudioUrl = URL.createObjectURL(this.recordedAudio);
          stream.getTracks().forEach(track => track.stop());
        };
        this.mediaRecorder.start();
      })
      .catch(error => console.error('Error accessing microphone:', error));
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  sendRecordedAudio(): void {
    if (!this.recordedAudio) return;
    this.discardRecordedAudio();
  }

  discardRecordedAudio(): void {
    if (this.recordedAudioUrl) URL.revokeObjectURL(this.recordedAudioUrl);
    this.recordedAudio = undefined;
    this.recordedAudioUrl = '';
  }

  attachFile(): void {
    let me = this;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xls,.xlsx,image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff';
    fileInput.onchange = () => {
      me.file = fileInput.files?.[0];
      console.log('File selected:', me.file);
    };
    fileInput.click();
  }

  resizeTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private startRecordTimer(): void {
    this.recordTimer = setInterval(() => this.recordSeconds++, 1000);
  }

  private stopRecordTimer(): void {
    if (this.recordTimer) {
      clearInterval(this.recordTimer);
      this.recordTimer = null;
    }
  }

  get recordTime(): string {
    const minutes = Math.floor(this.recordSeconds / 60);
    const seconds = this.recordSeconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  private _getContentContainer(): HTMLElement {
    const container = this._document.querySelector('.content-area') as HTMLElement;
    if (!container) {
      console.error('Content container (.content-area) not found');
    }
    return container;
  }

  private _showOverlay(): void {
    const contentContainer = this._getContentContainer();
    if (!contentContainer) return;

    this._overlay = this._renderer2.createElement('div');
    this._overlay?.classList.add('chat-agent-overlay');
    this._renderer2.appendChild(contentContainer, this._overlay);
    this._overlay?.addEventListener('click', () => this.togglePanel());
  }

  private _hideOverlay(): void {
    if (this._overlay) {
      this._renderer2.removeChild(this._getContentContainer(), this._overlay);
      this._overlay = null;
    }
  }

  get fileExtension(): string {
    if (!this.file) return '';
    const mimeType = this.file.type || '';
    return this.mimeToExt[mimeType as keyof typeof this.mimeToExt] || this.file.name.split('.').pop()?.toLowerCase() || '';
  }

  private mimeToExt = {
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'image/jpeg': 'jpg',
    'image/png': 'png',
  };
}