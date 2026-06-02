import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { DxCheckBoxModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CoreService } from 'genesis-coreservice';
import { DataSourceBuilder } from '../../services/data-source-builder';

@Component({
  selector: 'tour-products',
  templateUrl: './tour-products.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    DxDataGridModule,
    DxTemplateModule,
    DxCheckBoxModule,
    TranslocoModule
  ]
})
export class TourProductsComponent implements OnInit {
  @Input() FilterValue: any[] = [];
  dataSource: CustomStore = new CustomStore();
  columnHidingEnabled: boolean = true;
  pageTitle: string = "Tour Products";
  constructor(private coreService: CoreService) {

  }

  ngOnInit(): void {
    this.dataSource = new DataSourceBuilder(this.coreService)
      .load('TourServiceDate', { requireTotalCount: true })
      .updateFullModel('TourServiceDate')
      .remove('TourServiceDate')
      .setKey("id")
      .build()
  }

  onValueChanged = (e: any) => {
    this.columnHidingEnabled = !this.columnHidingEnabled;
  }
}