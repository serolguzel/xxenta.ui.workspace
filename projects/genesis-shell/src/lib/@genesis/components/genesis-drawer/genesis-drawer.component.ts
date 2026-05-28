import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from '../genesis-breadcrumbs';

@Component({
  selector: 'genesis-drawer',
  templateUrl: './genesis-drawer.component.html',
  styleUrl: './genesis-drawer.component.scss',
  standalone: true,
  imports: [
    NgClass,
    CdkScrollable,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    GenesisBreadcrumbsComponent
],
})
export class GenesisDrawerComponent {
  @Input() Breadcrumbs: Array<BreadcrumbsModel> = [];
  @Input() IsBgWhite: boolean = true;
  @Input() IsDefaultPadding: boolean = true;
  @Input() useNewBreadcrumb: boolean = false;
  @Input() drawerOpened: boolean = true;
  @Input() drawerMode: 'over' | 'side' = 'side';
  
}
