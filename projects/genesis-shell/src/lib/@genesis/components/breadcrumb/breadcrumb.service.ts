import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    UrlSegment,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    private breadcrumbsSubject = new BehaviorSubject<any[]>([]);
    breadcrumbs$ = this.breadcrumbsSubject.asObservable();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private translocoService: TranslocoService,
    ) {
        this.breadcrumbsSubject.next(this.buildBreadcrumbs(this.route.root));
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.buildBreadcrumbs(this.route.root)),
            )
            .subscribe((breadcrumbs) =>
                this.breadcrumbsSubject.next(breadcrumbs),
            );
    }

    private buildBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: any[] = [],
    ): any[] {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            if (child.snapshot) {
                const routeURL: string = child.snapshot.url
                    .map((segment) => segment.path)
                    .join('/');
                if (routeURL !== '') {
                    url += `/${routeURL}`;
                }

                if (child.snapshot.data['pageTitle']) {
                    const pageTitleKey = child.snapshot.data['pageTitle'];
                    breadcrumbs.push({
                        label: this.translocoService.translate(pageTitleKey),
                        url: url,
                    });
                }
            }

            return this.buildBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
