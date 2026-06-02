import { Component, OnInit } from '@angular/core';
import { LogModel } from '../logs.model';
import { CoreService } from 'genesis-coreservice';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent, PrettyPrintJson } from 'genesis-shell';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-log-detail-component',
  templateUrl: './log-detail-component.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    GenesisBreadcrumbsComponent,
    TranslocoModule
]
})
export class LogDetailComponentComponent implements OnInit {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  data: LogModel = <LogModel>{};
  prettyPrintJson: any = PrettyPrintJson;
  requestBody: any = {};
  responseBody: any = {};
  constructor(
    private coreService: CoreService,
    private activateRoute: ActivatedRoute,
    private translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.breadcrumbs = [
      {
        title: this.translocoService.translate('labels.logs'),
        link: '/logs/logs'
      },
      {
        title: this.translocoService.translate('labels.log-detail')
      }
    ];
    var id = this.activateRoute.snapshot.params['id'];
    this.coreService.getCall(`Logging/${id}`).then((res: LogModel) => {
      this.data = res;
      if(res.requestBody){
        this.requestBody = JSON.parse(res.requestBody);
      }
      if(res.responseBody){
        this.responseBody = JSON.parse(res.responseBody);
      }
    });
  }
}