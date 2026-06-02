import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CoreService } from 'genesis-coreservice';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent, PrettyPrintJson } from 'genesis-shell';
import { SejourTransferProcessModel } from './process.models';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-process-detail',
  standalone: true,
  templateUrl: './process-detail.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    GenesisBreadcrumbsComponent,
    TranslocoModule
  ]
})
export class ProcessDetailComponent implements OnInit {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  data: SejourTransferProcessModel = <SejourTransferProcessModel>{};
  prettyPrintJson: any = PrettyPrintJson;
  constructor(
    private coreService: CoreService,
    private activateRoute: ActivatedRoute,
  ) {
  }
  ngOnInit(): void {
    var id = this.activateRoute.snapshot.params['id'];
    this.coreService.getCall(`Progress/GetSejourTransferProcess/${id}`).then((res: SejourTransferProcessModel) => {
      var json = JSON.parse(res.data);
      this.data = res;
      this.data.data = json;
    });
  }
}
