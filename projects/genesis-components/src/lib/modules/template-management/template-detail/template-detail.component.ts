import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AngularSplitModule } from 'angular-split';
import { CommandResponse } from 'genesis-coreservice';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { filter, Subject, takeUntil } from 'rxjs';
import { EmailNamePair, MailTemplateBaseModel, NotificationChannel, SendEmailEventRequest, TemplateDetailModel } from '../template.models';
import { TemplateService } from '../template.service';

/** Bir dizideki tüm değerlerin geçerli e-posta olmasını doğrular. */
function emailArrayValidator(control: AbstractControl) {
  const emails = control.value;
  if (!emails || !Array.isArray(emails) || emails.length === 0) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalid = emails.some((e: any) => !e || typeof e !== 'string' || !emailRegex.test(e.trim()));
  return invalid ? { invalidEmail: true } : null;
}

@Component({
  selector: 'lib-template-detail',
  standalone: true,
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    AngularSplitModule,
    GenesisBreadcrumbsComponent,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    AutoCompleteModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
  ],
  providers: [TemplateService]
})
export class TemplateDetailComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);
  private readonly templateService = inject(TemplateService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  breadcrumbs: Array<BreadcrumbsModel> = [];
  languageDataSource: any[] = [];
  data: TemplateDetailModel = <TemplateDetailModel>{};
  copyData: TemplateDetailModel = <TemplateDetailModel>{};
  sendEmailData: SendEmailEventRequest = <SendEmailEventRequest>{};
  baseMeta: MailTemplateBaseModel = <MailTemplateBaseModel>{};
  sotificationChannels: string[] = Object.values(NotificationChannel);
  activeTab: 'html' | 'css' = 'html';
  showSendEmailPopup: boolean = false;
  showCopyPopup: boolean = false;
  isMailTemplate: boolean = false;
  isCopy: boolean = false;
  private _previewHtml: SafeHtml = '';

  form!: FormGroup;
  sendEmailForm!: FormGroup;
  copyForm!: FormGroup;

  private unsubscribeAll: Subject<any> = new Subject<any>();
  options: any = {};

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
    this.languageDataSource = this.templateService.GetLanguages;

    this.form = this.fb.group({
      title: [null, Validators.required],
      code: [null, Validators.required],
      language: [null, Validators.required],
      templateStatus: [null, Validators.required],
    });

    this.sendEmailForm = this.fb.group({
      title: [null, Validators.required],
      displayName: [null, Validators.required],
      emails: [null, [Validators.required, emailArrayValidator]],
    });

    this.copyForm = this.fb.group({
      language: [null, Validators.required],
    });

    const templateId = this.activatedRoute.snapshot.params['templateId'];
    if (templateId) {
      this.isCopy = true;
      this.loadTemplate(templateId);
    } else {
      this.isCopy = false;
      this.initializeNewTemplate();
    }

    this.templateService.GetTemplateMeta().then((res: MailTemplateBaseModel) => {
      if (res) {
        this.baseMeta = res;
        this.updatePreview();
      }
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        const id = this.activatedRoute.snapshot.params['templateId'];
        if (id) {
          this.loadTemplate(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  // --- Popup açma/kapama ---
  openSendEmailPopup(): void {
    this.sendEmailData.title = this.data.title;
    this.sendEmailForm.patchValue({ title: this.data.title });
    this.showSendEmailPopup = true;
  }

  openCopyPopup(): void {
    this.copyData = <TemplateDetailModel>{
      code: this.data.code,
      title: this.data.title,
      body: this.data.body,
      templateStatus: this.data.templateStatus,
      itemType: this.data.itemType
    };
    this.copyForm.reset();
    this.showCopyPopup = true;
  }

  closeSendEmilPopup(): void { this.showSendEmailPopup = false; }
  closeCopyPopup(): void { this.showCopyPopup = false; }

  loadTemplate(templateId: string): void {
    this.templateService.GetTemplateById(templateId).then((res: TemplateDetailModel) => {
      this.data = res;
      this.form.patchValue({
        title: res.title,
        code: res.code,
        language: res.language,
        templateStatus: res.templateStatus,
      });
      const isMail = res.templateStatus?.find(x => x == NotificationChannel.EMAIL);
      this.isMailTemplate = isMail != null;
      this.breadcrumbs = [
        { title: this.translocoService.translate('labels.back'), link: this.options.backRoute },
        { title: res.title }
      ];
      this.updatePreview();
    });
  }

  onStatusValueChanged(event: { value: string[] }): void {
    const isMail = event.value?.find((x: any) => x == NotificationChannel.EMAIL);
    this.isMailTemplate = isMail != null;
  }

  get previewHtml(): SafeHtml {
    return this._previewHtml;
  }

  updatePreview(): void {
    let temp = this.data.body;
    if (this.baseMeta.bodyHtml != undefined) {
      temp = this.baseMeta.bodyHtml.replace('{ContentHtml}', this.data.body);
      temp = temp.replace('{HeaderHtml}', this.baseMeta.header!);
      temp = temp.replace('{FooterHtml}', this.baseMeta?.footer!);
    }
    this._previewHtml = this.sanitizer.bypassSecurityTrustHtml(temp);
    this.changeDetectorRef.detectChanges();
  }

  onSave(): void {
    const templateId = this.activatedRoute.snapshot.params['templateId'];
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    Object.assign(this.data, this.form.value);

    if (templateId) {
      this.templateService.UpdateTemplate(templateId, this.data);
    } else {
      this.templateService.CreateTemplate(this.data).then((res: CommandResponse<string>) => {
        if (res?.aggregatorId) {
          this.router.navigate([`${this.options.detailRoute}/${res.aggregatorId}`]);
        }
      });
    }
  }

  onCopy(): void {
    this.copyForm.markAllAsTouched();
    if (!this.copyForm.valid) return;
    this.copyData.language = this.copyForm.value.language;
    this.templateService.CreateTemplate(this.copyData).then((res: CommandResponse<string>) => {
      if (res?.aggregatorId) {
        this.router.navigate([`${this.options.detailRoute}/${res.aggregatorId}`]);
      }
    });
  }

  sendTestEmail(): void {
    this.sendEmailForm.markAllAsTouched();
    if (!this.sendEmailForm.valid) return;
    const value = this.sendEmailForm.value;
    const request = <SendEmailEventRequest>{
      displayName: value.displayName,
      title: value.title,
      body: this.data.body,
      receivers: (value.emails as string[]).map(x => <EmailNamePair>{ email: x, name: x })
    };
    this.templateService.SendTestEmail(request);
  }

  onHtmlContentChange(): void {
    this.updatePreview();
  }

  initializeNewTemplate(): void {
    const defaultHtml = `
      <div class="content">
          <h1>Mail Başlığı</h1>
          <p>Mail içeriğiniz buraya gelecek.</p>
          <div class="credentials-box" style="display: none;">
              <strong>Kullanıcı Bilgileriniz:</strong>
              <p>E-posta: @Model.Email</p>
              <p>Şifre: @Model.TemporaryPassword</p>
          </div>
          <a href="@Model.LoginUrl" class="button">Hesabıma Giriş Yap</a>
      </div>
    `.trim();

    this.data.body = defaultHtml;
    this.data.title = 'New Mail Template';
    this.form.patchValue({ title: this.data.title });

    this.breadcrumbs = [
      { title: this.translocoService.translate('labels.back'), link: this.options.backRoute },
      { title: this.data.title }
    ];
    this.updatePreview();
  }
}
