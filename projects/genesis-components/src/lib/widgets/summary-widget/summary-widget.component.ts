import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SummaryWidgetModel, SummaryWidgetType } from './summary-widget.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'summary-widget',
  templateUrl: './summary-widget.component.html',
  standalone: true,
  imports: [
    NgClass,
    MatMenuModule,
    MatIconModule
  ]
})
export class SummaryWidgetComponent implements OnInit {
  @Input() title: string = '';
  @Input() summaryLabel: string = 'Completed';
  @Input() data: SummaryWidgetModel = <SummaryWidgetModel>{};
  @Input() theme: SummaryWidgetType = SummaryWidgetType.Summary;
  numberTextCss: string = 'text-blue-500';
  titleCss: string = 'dark:text-blue-500'
  ngOnInit(): void {
    this.themeCss();
  }

  themeCss() {
    if (this.theme == SummaryWidgetType.Summary) {
      this.numberTextCss = 'text-blue-500';
      this.titleCss = 'dark:text-blue-500';
    }
    switch (this.theme) {
      case SummaryWidgetType.Summary: {
        this.numberTextCss = 'text-blue-500';
        this.titleCss = 'dark:text-blue-500';
      }
      break;
      case SummaryWidgetType.Overdue: {
        this.numberTextCss = 'text-red-500';
        this.titleCss = 'dark:text-red-500';
      }
      break;
    }
  }
}