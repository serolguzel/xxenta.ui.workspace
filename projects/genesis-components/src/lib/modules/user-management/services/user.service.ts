import { Injectable } from '@angular/core';
import { CreateUser, UpdateUser, UserModel } from '../components/user-form/user-form.models';
import { CommandResponse, CoreService, UserLookupModel } from 'genesis-coreservice';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CoreService {
  public CreateUser(request: CreateUser): Promise<CommandResponse<string>> {
    return this.postCall(`User`, request);
  }

  public GetUserById(userId: string): Promise<UserModel> {
    return this.getCall(`User/${userId}`);
  }

  public UpdateUser(userId: string, request: UpdateUser): Promise<CommandResponse<string>> {
    return this.putCall(`User/${userId}`, request);
  }

  public GetUserLookUpById(userId: string): Promise<UserLookupModel> {
    return this.getCall(`User/GetUserLookUpById/${userId}`);
  }
}

