import { Injectable } from '@angular/core';
import { CommandResponse, CoreService, Response } from 'genesis-coreservice';
import { MailTemplateBaseModel, SendEmailEventRequest, TemplateDetailModel } from './public-api';

@Injectable({
  providedIn: 'root'
})
export class TemplateService extends CoreService {
  GetTemplateById(templateId: string): Promise<TemplateDetailModel> {
    return this.getCall(`Template/GetTemplateById/${templateId}`);
  }

  CreateTemplate(model: TemplateDetailModel): Promise<any> {
    return this.postCall(`Template`, model);
  }

  UpdateTemplate(templateId: string, model: TemplateDetailModel): Promise<CommandResponse<string>> {
    return this.putCall(`Template/${templateId}`, model);
  }

  SendTestEmail(model: SendEmailEventRequest): Promise<Response<boolean>> {
    return this.postCall(`Mail/Send`, model);
  }

  GetTemplateMeta() : Promise<MailTemplateBaseModel> {
    return this.getCall(`Template/GetTemplateMeta`);
  }
}
