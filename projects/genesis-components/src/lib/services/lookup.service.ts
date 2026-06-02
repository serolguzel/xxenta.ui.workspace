import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { CoreService, Utility } from 'genesis-coreservice';
import { OrganizationType } from '../modules/company-management';
import { DataSourceBuilder } from './data-source-builder';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private readonly coreService = inject(CoreService);
  private readonly translocoService = inject(TranslocoService);
  public companyLookupTitle = this.translocoService.translate('labels.operators');
  constructor() { }

  async GetOrganizationCurrenciesOptions() {
    var currencies = await this.coreService.getCall('OrganizationCurrency/GetCurrencies');
    return {
      dataSource: currencies,
      displayExpr: 'currencyCode',
      valueExpr: 'currencyCode',
      showClearButton: true,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.currencies')
      }
    }
  }

  public currenciesLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Currency/GetCurrenciesLookup', { requireTotalCount: true })
      .byKey('Currency/GetCurrenciesLookup')
      .setKey("id")
      .build(),
    displayExpr: 'name',
    valueExpr: 'code',
    searchExpr: ['name', 'code'],
    itemTemplate: Utility.codeNameTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.currencies')
    }
  }

  public hotelLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Hotel/GetHotelsLookup', { requireTotalCount: true })
      .byKey('Hotel/GetHotelLookupById')
      .setKey("id")
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'code'],
    itemTemplate: Utility.codeNameTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.hotels')
    }
  };


  public hotelLookUpValuePlaceIdOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Hotel/GetHotelsPlaceIdLookup', { requireTotalCount: true })
      .byKey('Hotel/GetHotelLookupByPlaceId')
      .setKey("placeId")
      .build(),
    displayExpr: 'name',
    valueExpr: 'placeId',
    searchExpr: ['name', 'code'],
    showClearButton: true,
    itemTemplate: Utility.codeNameTemplate,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.hotels')
    }
  };

  public hotelLookUpByParamsOptions(request?: any) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load('Hotel/GetHotelsLookup', { requireTotalCount: true, ...request })
        .byKey('Hotel/GetHotelLookupById')
        .setKey("id")
        .build(),
      displayExpr: 'name',
      valueExpr: 'id',
      searchExpr: ['name', 'code'],
      showClearButton: true,
      itemTemplate: Utility.codeNameTemplate,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.hotels')
      }
    };
  }

  public userLookupOptions(request?: any) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load(`User/GetUsersLookup`, { requireTotalCount: true, ...request })
        .byKey(`User/GetUserLookupById`)
        .setKey('id')
        .build(),
      displayExpr: 'displayName',
      valueExpr: 'id',
      searchExpr: ['firstName', 'lastName', 'email'],
      showClearButton: true,
      itemTemplate: Utility.userItemTemplate,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.users')
      },
    }
  }

  public userLookupByOwnerIdOptions(ownerId: string, request?: any) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load(`User/GetUsersLookup/${ownerId}`, { requireTotalCount: true, ...request })
        .byKey(`User/GetUserLookupById`)
        .setKey('id')
        .build(),
      displayExpr: 'displayName',
      valueExpr: 'id',
      searchExpr: ['firstName', 'lastName', 'email'],
      showClearButton: true,
      itemTemplate: Utility.userItemTemplate,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.users')
      },
    }
  }

  public customerLookUpOptions(request?: any, title?: string) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load('Organization/GetOrganizationsLookup', { requireTotalCount: true, ...request })
        .byKey('Organization/GetOrganizationsLookup')
        .setKey('id')
        .build(),
      displayExpr: 'name',
      valueExpr: 'id',
      searchExpr: ['name', 'id'],
      showClearButton: true,
      itemTemplate: Utility.codeNameTemplate,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: title ?? this.translocoService.translate('labels.customers')
      },
    };
  }

  public organizationLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('OrganizationPartner/GetPartnersLookup', { requireTotalCount: false, organizationTypes: JSON.stringify([OrganizationType.Agency, OrganizationType.Operator]) })
      .byKey('OrganizationPartner/GetPartnersLookup')
      .setKey('id')
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['fromOrganization.name', 'fromOrganization.code', 'toOrganization.name', 'toOrganization.code'],
    itemTemplate: Utility.companyTemplate,
    placeholder: this.translocoService.translate('labels.operators'),
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.companyLookupTitle
    }
  };

  public lookUpCompanyOptionsForTenant(organizationId: string, companyTypes: OrganizationType[], request?: any, title?: string) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load(`OrganizationPartner/GetPartnersLookup/${organizationId}`, { requireTotalCount: false, organizationTypes: JSON.stringify(companyTypes), ...request })
        .byKey(`OrganizationPartner/GetPartnersLookup/${organizationId}`)
        .setKey('id')
        .build(),
      displayExpr: 'name',
      valueExpr: 'id',
      showClearButton: true,
      searchExpr: ['fromOrganization.name', 'fromOrganization.code', 'toOrganization.name', 'toOrganization.code'],
      itemTemplate: Utility.companyTemplate,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: title ?? this.companyLookupTitle
      }
    };
  }

  public lookUpCompanyOptions(companyTypes: OrganizationType[], request?: any, title?: string) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load('OrganizationPartner/GetPartnersLookup', { requireTotalCount: false, organizationTypes: JSON.stringify(companyTypes), ...request })
        .byKey('OrganizationPartner/GetPartnersLookup')
        .setKey('id')
        .build(),
      displayExpr: 'name',
      valueExpr: 'id',
      showClearButton: true,
      searchExpr: ['fromOrganization.name', 'fromOrganization.code', 'toOrganization.name', 'toOrganization.code'],
      itemTemplate: Utility.companyTemplate,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: title ?? this.companyLookupTitle
      }
    };
  }

  public companyTagBoxDSOptions(companyTypes: OrganizationType[], placeholder?: string) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load('OrganizationPartner/GetPartnersLookup', { requireTotalCount: false, organizationTypes: JSON.stringify(companyTypes) })
        .byKey('OrganizationPartner/GetPartnersLookup')
        .setKey('id')
        .build(),
      displayExpr: 'name',
      valueExpr: 'id',
      searchExpr: ['fromOrganization.name', 'fromOrganization.code', 'toOrganization.name', 'toOrganization.code'],
      placeholder: placeholder,
      itemTemplate: Utility.companyTemplate,
      maxDisplayedTags: 5,
      showClearButton: true,
      searchEnabled: true,
      showSelectionControls: true,
      applyValueMode: 'useButtons'
    };
  }

  async GetSubOrganizationsLookupOptions() {
    var organiations = await this.coreService.getCall('Organization/GetSubOrganizationsLookup');
    return {
      dataSource: organiations,
      displayExpr: 'name',
      valueExpr: 'id',
      showClearButton: true,
      itemTemplate: Utility.codeNameTemplate,
      placeholder: this.translocoService.translate('labels.owner') + ':',
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.owner')
      }
    }
  }

  public countryLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Country/GetCountriesLookup', { requireTotalCount: true })
      .byKey('Country/GetCountriesLookup')
      .setKey("id")
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'id'],
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.countries')
    }
  }

  public countryPhoneCodesLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Country/GetCountriesLookup', { requireTotalCount: true, isPhoneAreaCodeNotNull: 'Y' })
      .byKey('Country/GetCountriesLookupByPhoneAreaCode')
      .setKey("phoneCode")
      .build(),
    displayExpr: Utility.phoneCodeDisplayValue,
    valueExpr: 'phoneCode',
    searchExpr: ['name', 'phoneCode'],
    itemTemplate: Utility.phoneCodesOfCountries,
    placeholder: this.translocoService.translate('labels.phone-codes'),
    showClearButton: true,
    disabled: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.phone-codes')
    }
  }

  public vehicleTypeLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('VehicleType/GetVehicleTypesLookup')
      .byKey('VehicleType/GetVehicleTypesLookup')
      .setKey('id')
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'code'],
    placeholder: `${this.translocoService.translate('labels.vehicle-type')}:`,
    showClearButton: true,
    itemTemplate: Utility.vehicleTypeCodeNameTemplate,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.vehicle-types')
    }
  };

  public transferTypesLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('TransferType/GetTransferTypesLookup')
      .byKey('TransferType/GetTransferTypesLookup')
      .setKey('id')
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'code', 'id'],
    placeholder: `${this.translocoService.translate('labels.transfer-type')}:`,
    showClearButton: true,
    itemTemplate: Utility.codeNameTemplate,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.transfer-types')
    }
  };

  public transferTypesTagBoxDSOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('TransferType/GetTransferTypesLookup')
      .byKey('TransferType/GetTransferTypesLookup')
      .setKey('code')
      .build(),
    displayExpr: 'name',
    valueExpr: 'code',
    searchExpr: ['name', 'code'],
    placeholder: this.translocoService.translate('labels.transfer-types'),
    itemTemplate: Utility.codeNameTemplate,
    maxDisplayedTags: 5,
    showClearButton: true,
    searchEnabled: true,
    showSelectionControls: true,
  };

  public airportAndHotelLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('HotelAirport/GetHotelsAndAirports', { requireTotalCount: true })
      .byKeyQuery('HotelAirport/GetHotelsAndAirport')
      .setArrayKey(['code', 'source'])
      .build(),
    displayExpr: 'name',
    valueExpr: ['code', 'source'],
    itemTemplate: Utility.codeNameTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.airports-hotels')
    }
  };

  public airportLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Airport/GetAirportsLookup')
      .byKey('Airport/GetAirportsLookup')
      .setKey('id')
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'id'],
    itemTemplate: Utility.idNameTemplate,
    placeholder: this.translocoService.translate('labels.airports'),
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.airports')
    }
  };

  public async airportTenantLookUpOptions(): Promise<any> {
    return {
      items: await this.coreService.getCall("OrganizationAirport/GetAirports"),
      displayExpr: 'name',
      valueExpr: 'code',
      itemTemplate: Utility.codeNameTemplate,
      placeholder: this.translocoService.translate('labels.airports'),
      showClearButton: true,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.airports')
      }
    };
  };

  public flightLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('FlightRoute/GetFlightsLookup')
      .byKey('FlightRoute/GetFlightsLookup')
      .setKey('id')
      .build(),
    displayExpr: Utility.getDisplayExprCodeBehind,
    valueExpr: 'code',
    searchExpr: ['airlineCode', 'code'],
    itemTemplate: Utility.flightLookUpTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.flights')
    }
  };

  public flightTagBoxOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('FlightRoute/GetFlightsLookup')
      .byKey('FlightRoute/GetFlightsLookup')
      .setKey('id')
      .build(),
    displayExpr: 'code',
    valueExpr: 'code',
    searchExpr: ['airlineCode', 'code'],
    itemTemplate: Utility.codeNameTemplate,
    maxDisplayedTags: 5,
    showClearButton: true,
    searchEnabled: true,
    showSelectionControls: true,
    applyValueMode: 'useButtons'
  };

  public regionsLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Region/GetRegionsLookup', { requireTotalCount: true })
      .byKey('Region/GetRegionsLookup')
      .setKey("id")
      .build(),
    displayExpr: Utility.getDisplayExprCode,
    valueExpr: 'id',
    searchExpr: ['name', 'code'],
    itemTemplate: Utility.codeNameTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.regions')
    }
  };

  public regionsLookUpOptionsByRequest(request?: any) {
    return {
      dataSource: new DataSourceBuilder(this.coreService)
        .load('Region/GetRegionsLookup', { requireTotalCount: true, ...request })
        .byKey('Region/GetRegionsLookup')
        .setKey("id")
        .build(),
      displayExpr: Utility.getDisplayExprCode,
      valueExpr: 'id',
      searchExpr: ['name', 'code'],
      itemTemplate: Utility.codeNameTemplate,
      showClearButton: true,
      dropDownOptions: {
        hideOnOutsideClick: true,
        title: this.translocoService.translate('labels.regions')
      }
    };
  }

  public airlinesLookUpOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Airline/GetAirlinesLookup', { requireTotalCount: true })
      .byKey('Airline/GetAirlinesLookup')
      .setKey("code")
      .build(),
    displayExpr: Utility.getDisplayExprCode,
    valueExpr: 'code',
    searchExpr: ['name', 'code'],
    itemTemplate: Utility.codeNameTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.airlines')
    }
  };

  public regionsTagBoxOptions(items: any[]) {
    return {
      dataSource: items,
      displayExpr: 'name',
      valueExpr: 'id',
      searchExpr: ['name', 'code'],
      showSelectionControls: true,
      placeholder: this.translocoService.translate('labels.regions'),
    };
  };

  public tagBoxOptions(items: any[], title: string) {
    return {
      dataSource: items,
      displayExpr: 'name',
      valueExpr: 'code',
      searchExpr: ['name', 'code'],
      showSelectionControls: true,
      showClearButton: true,
      placeholder: title
    };
  };

  public selectBoxOptions<T>(items: T[], placeholder: string) {
    return {
      dataSource: items,
      displayExpr: 'name',
      valueExpr: 'id',
      showClearButton: true,
      placeholder: placeholder
    };
  };

  public regionsTagBoxDSOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Region', { requireTotalCount: true })
      .byKey('Region')
      .setKey("id")
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'code'],
    placeholder: this.translocoService.translate('labels.regions'),
    itemTemplate: Utility.codeNameTemplate,
    maxDisplayedTags: 5,
    showClearButton: true,
    searchEnabled: true,
    showSelectionControls: true,
    applyValueMode: 'useButtons'
  };

  public transferRoutesTagBoxDSOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('TransferRoute/GetTransferRoutesLookUp', { requireTotalCount: false })
      .setKey("id")
      .build(),
    displayExpr: 'name',
    valueExpr: 'id',
    searchExpr: ['name', 'code'],
    placeholder: this.translocoService.translate('labels.transfer-routes'),
    itemTemplate: Utility.combineCodesNameTemplate,
    maxDisplayedTags: 5,
    showClearButton: true,
    searchEnabled: true,
    showSelectionControls: true,
  };

  public cardinalDirectionsOptions = {
    items: [
      { code: 'None', name: this.translocoService.translate('labels.none') },
      { code: 'East', name: this.translocoService.translate('labels.east') },
      { code: 'West', name: this.translocoService.translate('labels.west') },
      { code: 'North', name: this.translocoService.translate('labels.north') },
      { code: 'South', name: this.translocoService.translate('labels.south') },
    ],
    displayExpr: 'name',
    valueExpr: 'code',
    placeholder: `${this.translocoService.translate('labels.cardinal-direction')}:`,
    itemTemplate: Utility.codeNameTemplate
  };

  public vehiclesOptions = {
    dataSource: new DataSourceBuilder(this.coreService)
      .load('Vehicle/GetVehiclesLookup', { requireTotalCount: true })
      .byKey('Vehicle/GetVehiclesLookup')
      .setKey('id')
      .build(),
    displayExpr: (e: any) => {
      if (e) {
        if (e.driver)
          return `${e.windowNumber} - ${e.plateCode} (${e.driver?.displayName})`;
        else
          return `${e.windowNumber} - ${e.plateCode}`;
      }
      else
        return '';
    },
    valueExpr: 'id',
    searchExpr: ['name', 'plateCode', 'windowNumber'],
    placeholder: this.translocoService.translate('labels.vehicle'),
    itemTemplate: Utility.vehicleLookupTemplate,
    showClearButton: true,
    dropDownOptions: {
      hideOnOutsideClick: true,
      title: this.translocoService.translate('labels.vehicles')
    }
  }
}
