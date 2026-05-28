import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { InvitationModel } from './invitation.types';

@Injectable({ providedIn: 'root' })
export class InvitationService {

    private _pushInvitation: ReplaySubject<InvitationModel> = new ReplaySubject<InvitationModel>(1);

    get getInvitation$(): Observable<InvitationModel> {
        return this._pushInvitation.asObservable();
    }

    set setInvitation$(invitation: InvitationModel) {
        this._pushInvitation.next(invitation);
    }
}
