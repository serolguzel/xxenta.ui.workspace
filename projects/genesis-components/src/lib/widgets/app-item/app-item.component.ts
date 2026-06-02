import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-item',
  templateUrl: './app-item.component.html',
  standalone: true,
  imports: [
    NgClass,
    MatIcon
  ]
})
export class AppItemComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() routerLink: string = '';
  @Input() summaryLabel: string = '';
  @Input() width: string = 'h-[36px]';
  @Input() height: string = 'w-[36px]';
  @Input() cssClass: string = 'p-6';
  constructor() { }

  ngOnInit() {
  }

}
