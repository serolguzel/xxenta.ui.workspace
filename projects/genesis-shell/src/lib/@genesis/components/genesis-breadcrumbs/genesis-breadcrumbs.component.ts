import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreadcrumbsModel } from './breadcrumbs.model';

@Component({
  selector: 'genesis-breadcrumbs',
  templateUrl: './genesis-breadcrumbs.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgForOf,
    RouterLink,
    MatButtonModule,
    MatIconModule
  ]
})
export class GenesisBreadcrumbsComponent implements OnInit {
  @Input() Breadcrumbs: Array<BreadcrumbsModel> = [];
  ngOnInit(): void { }
}
