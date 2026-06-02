import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommandResponse } from 'genesis-coreservice';
import { EmailNamePair, MailTemplateBaseModel, NotificationChannel, SendEmailEventRequest, TemplateDetailModel } from '../template.models';
import { DxFormModule, DxTemplateModule, DxTextAreaModule, DxToolbarModule, DxSelectBoxModule, DxFormComponent, DxPopupModule } from 'devextreme-angular';
import { AngularSplitModule } from 'angular-split';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { TemplateService } from '../template.service';

@Component({
  selector: 'lib-template-detail',
  standalone: true,
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    DxTextAreaModule,
    DxToolbarModule,
    DxTemplateModule,
    DxFormModule,
    DxSelectBoxModule,
    DxPopupModule,
    AngularSplitModule,
    TranslocoModule,
    GenesisBreadcrumbsComponent
  ],
  providers: [
    TemplateService
  ]
})
export class TemplateDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('templateForm') templateForm?: DxFormComponent;
  @ViewChild('testEmailForm') testEmailForm?: DxFormComponent;
  @ViewChild('copyForm') copyForm?: DxFormComponent;
  breadcrumbs: Array<BreadcrumbsModel> = [];
  languageDataSource: any;
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

  private unsubscribeAll: Subject<any> = new Subject<any>();
  btnSaveOpt: any;
  btnSendTestOpt: any;
  btnCopyPopupOpt: any;

  options: any = {};

  constructor(
    private translocoService: TranslocoService,
    private templateService: TemplateService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
    this.languageDataSource = this.templateService.GetLanguages;
    this.btnSaveOpt = {
      icon: 'save',
      text: this.translocoService.translate('labels.save'),
      onClick: () => this.onSave()
    };
    this.btnSendTestOpt = {
      icon: 'email',
      text: this.translocoService.translate('labels.send_test_email'),
      onClick: () => {
        this.sendEmailData.title = this.data.title;
        this.showSendEmailPopup = true;
      }
    };
    this.btnCopyPopupOpt = {
      icon: 'copy',
      text: this.translocoService.translate('labels.copy'),
      onClick: () => {
        this.copyData = <TemplateDetailModel>{
          code: this.data.code,
          title: this.data.title,
          body: this.data.body,
          templateStatus: this.data.templateStatus,
          itemType: this.data.itemType
        };
        this.showCopyPopup = true;
      }
    };
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

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  closeSendEmilPopup() {
    this.showSendEmailPopup = false;
  }

  closeCopyPopup() {
    this.showCopyPopup = false;
  }

  loadTemplate(templateId: string) {
    this.templateService.GetTemplateById(templateId).then((res: TemplateDetailModel) => {
      this.data = res;
      var isMail = res.templateStatus?.find(x => x == NotificationChannel.EMAIL);
      this.isMailTemplate = isMail != null;
      this.breadcrumbs = [
        {
          title: this.translocoService.translate('labels.back'),
          link: this.options.backRoute
        },
        {
          title: res.title
        }
      ];
    });
  }

  onStatusValueChanged = (e: any) => {
    var isMail = e.value.find((x: any) => x == NotificationChannel.EMAIL);
    this.isMailTemplate = isMail != null;
  }

  validateEmailArray = (params: any) => {
    const emails = params.value;

    if (!emails || !Array.isArray(emails)) {
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email =>
      !email || typeof email !== 'string' || !emailRegex.test(email.trim())
    );

    if (invalidEmails.length > 0) {
      console.warn(this.translocoService.translate('messages.invalid-emails', { emails: invalidEmails.join(', ') }));
    }

    return invalidEmails.length === 0;
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

  onSave() {
    const templateId = this.activatedRoute.snapshot.params['templateId'];
    const valid = this.templateForm?.instance.validate().isValid;
    if (valid) {
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
  }

  onCopy = () => {
    const valid = this.copyForm?.instance.validate().isValid;
    if (valid) {
      this.templateService.CreateTemplate(this.copyData).then((res: CommandResponse<string>) => {
        if (res?.aggregatorId) {
          this.router.navigate([`${this.options.detailRoute}/${res.aggregatorId}`]);
        }
      });
    }
  }


  sendTestEmail = () => {
    const valid = this.testEmailForm?.instance.validate().isValid;
    if (valid) {
      var request = <SendEmailEventRequest>{
        displayName: this.sendEmailData.displayName,
        title: this.sendEmailData.title,
        body: this.data.body,
        receivers: this.sendEmailData.emails.map(x => <EmailNamePair>{
          email: x,
          name: x
        })
      };
      this.templateService.SendTestEmail(request);
    }
  }

  onHtmlContentChange(event: any) {
    this.updatePreview();
  }

  onSubjectChange(event: any) {
    this.data.title = event.value;
  }

  initializeNewTemplate() {
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

    this.data.body = defaultHtml;;
    this.data.title = "New Mail Template";

    this.breadcrumbs = [
      {
        title: this.translocoService.translate('labels.back'),
        link: this.options.backRoute
      },
      {
        title: this.data.title
      }
    ];
    this.updatePreview();
  }
}