import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService } from 'genesis-coreservice';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'lib-templates',
  standalone: true,
  templateUrl: './templates.component.html',
  imports: [
    RouterLink,
    DxButtonModule,
    DxDataGridModule
  ]
})
export class TemplatesComponent implements OnInit {
  dataSource: CustomStore = new CustomStore();
  options: any = {};
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.options = this.activatedRoute.snapshot.data;
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('Template', { requireTotalCount: true })
      .insert('Template')
      .updateFullModel('Template', "id")
      .remove('Template')
      .setKey("id")
      .build();
  }

  createTemplate = (e: any) => {
    this.router.navigate([this.options.createRoute]);
  }
}
