import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { GenesisNavigationItem } from 'genesis-shell';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from './data';
import { GenesisMockApiService } from '../../mock-api-services/mock-api.service';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: GenesisNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: GenesisNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: GenesisNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: GenesisNavigationItem[] = horizontalNavigation;

    constructor(private _genesisMockApiService: GenesisMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._genesisMockApiService
            .onGet('api/common/navigation')
            .reply(() => {

                this._compactNavigation.forEach((compactNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if (defaultNavItem.id === compactNavItem.id) {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                this._futuristicNavigation.forEach((futuristicNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if (defaultNavItem.id === futuristicNavItem.id) {
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                this._horizontalNavigation.forEach((horizontalNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if (defaultNavItem.id === horizontalNavItem.id) {
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                return [
                    200,
                    {
                        compact: cloneDeep(this._compactNavigation),
                        default: cloneDeep(this._defaultNavigation),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation),
                    },
                ];
            });
    }
}
