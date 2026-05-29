import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { genesisLoadingInterceptor, GenesisLoadingService } from 'genesis-coreservice';
import {
    GENESIS_CONFIG,
    GenesisConfig,
    GenesisMediaWatcherService,
    GenesisPlatformService,
    GenesisSplashScreenService,
    GenesisUtilsService
} from 'genesis-shell';
import { GENESIS_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from './mock-api/mock-api-services';
// import { MatDialogModule } from '@angular/material/dialog';

export type GenesisProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    genesis?: GenesisConfig
}
/**
 * Genesis provider
 */
export const provideGenesis = (config: GenesisProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
         {
            provide : GENESIS_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : GENESIS_CONFIG,
            useValue: config?.genesis ?? {},
        },

        // importProvidersFrom(MatDialogModule),
        // {
        //     provide : ENVIRONMENT_INITIALIZER,
        //     useValue: () => inject(GenesisConfirmationService),
        //     multi   : true,
        // },

        provideHttpClient(withFetch(), withInterceptors([genesisLoadingInterceptor]), withInterceptorsFromDi()),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(GenesisLoadingService),
            multi   : true,
        },

        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(GenesisMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(GenesisPlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(GenesisSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(GenesisUtilsService),
            multi   : true,
        }
    ];

     // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
