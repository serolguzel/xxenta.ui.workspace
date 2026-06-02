import { Component, Input, OnInit } from '@angular/core';
import { SummaryWidgetModel } from '../summary-widget/summary-widget.model';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'summary-mini',
  templateUrl: './summary-mini.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
  ]
})
export class SummaryMiniComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() routerLink: string = '';
  @Input() queryParams: any = {};
  @Input() summaryLabel: string = 'Completed';
  @Input() width: string = 'h-[36px]';
  @Input() height: string = 'w-[36px]';
  @Input() cssClass: string = 'p-6';
  @Input() data: SummaryWidgetModel = <SummaryWidgetModel>{};
  constructor() { }

  ngOnInit() {
  }

}
