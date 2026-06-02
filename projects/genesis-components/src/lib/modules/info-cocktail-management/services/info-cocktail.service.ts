import { inject, Injectable } from '@angular/core';
import { CodeNamePair, CommandResponse, CoreService, 
  TransferRouteType, 
  UserLookupModel } from 'genesis-coreservice';

import { TranslocoService } from '@jsverse/transloco';


@Injectable({
  providedIn: 'root'
})
export class InfoCocktailService extends CoreService {
  private translocoService = inject(TranslocoService);

  public transferRouteTypes: CodeNamePair[] = [
    { code: TransferRouteType.Arrival, name: this.translocoService.translate('labels.arrival') },
    { code: TransferRouteType.Departure, name: this.translocoService.translate('labels.departure') },
    { code: TransferRouteType.Intermediate, name: this.translocoService.translate('labels.intermediate') }
  ];
}
