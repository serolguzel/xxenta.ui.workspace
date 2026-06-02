import { Injectable } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import { CoreService, GenesisLoadingService, Utility, Response, SnackbarService } from "genesis-coreservice";

@Injectable({
    providedIn: 'root'
})
export class GoogleLookupService {
    constructor(
        private readonly genesisLoadingService: GenesisLoadingService,
        private readonly snackBar: SnackbarService,
        private coreService: CoreService) { }
    public placeLookupService = {
        dataSource: new DataSource({
            store: new CustomStore({
                key: ['placeId', 'name', 'latitude', 'longitude', 'placeType', 'id'],
                load: this.process,
                byKey: (key) => key
            }),
            paginate: false,
        }),
        searchEnabled: true,
        minSearchLength: 3,
        searchTimeout: 500,
        displayExpr: 'name',
        itemTemplate: Utility.nameAddressTemplate,
        dropDownOptions: {
            hideOnOutsideClick: true,
            title: 'Search:'
        },
    }

    private async process(loadOptions: any): Promise<any> {
        this.genesisLoadingService.show();
        const searchText = loadOptions.searchValue || '';
        try {
            let response: Response<GoogleMapsSearchResponse[]> = await this.coreService.getCall('Location', { searchText: searchText });
            this.genesisLoadingService.hide();
            if (response.hasError) {
                this.snackBar.Warning(response.message);
            } else {
                return ({
                    data: response.data,
                    totalCount: response.data.length
                });
            }
        } catch {
            this.genesisLoadingService.hide();
            return ({
                data: [],
                totalCount: 0
            });
        }
    }
}

export interface GoogleMapsSearchResponse extends SinglePlace {
    city: string | null;
    district: string | null;
    town: string | null;
    languageCode: string | null;
}

export interface SinglePlace {
    placeId: string;
    latitude: number;
    longitude: number;
    name: string;
    placeType: string | null;
    address: string | null;
    website: string | null;
}