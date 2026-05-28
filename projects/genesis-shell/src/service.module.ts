import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TenantApiService } from './lib/core/services/tenant-api.service';

@NgModule({
  imports: [
    MatSnackBarModule,
  ],
  declarations: [],
  providers: [
    TenantApiService
  ]
})
export class ServiceModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ServiceModule
  ) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}