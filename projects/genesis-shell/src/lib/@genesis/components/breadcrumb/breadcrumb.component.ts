import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'lib-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: true,
    imports: [NgForOf, NgIf, RouterLink, MatIconModule],
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbs: any[] = [];

    constructor(private breadcrumbService: BreadcrumbService) {}

    ngOnInit(): void {
        this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
            this.breadcrumbs = breadcrumbs;
        });
    }
}
