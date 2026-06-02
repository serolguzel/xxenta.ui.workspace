import { Component, OnInit } from '@angular/core';
import { CoreService } from 'genesis-coreservice';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { PushModel } from '../pushlog.models';
import { PrettyPrintJson } from 'genesis-shell';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-puhslog-detail-component',
  templateUrl: './puhslog-detail-component.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    TranslocoModule
  ]
})
export class PushlogDetailComponentComponent implements OnInit {
  data: PushModel = <PushModel><unknown>{
    messages: []
  };
  prettyPrintJson: any = PrettyPrintJson;
  constructor(
    private coreService: CoreService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    var id = this.activateRoute.snapshot.params['id'];
    this.coreService.getCall(`Push/${id}`).then((res: PushModel) => {
      var json = res.data != null || res.data !== undefined ? JSON.parse(res.data!) : null;
      this.data = res;
      this.data.data = json;
    });
  }

}
