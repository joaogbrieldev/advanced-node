import { AuthenticationError } from "@/domain/errors/authentication";

import {
  ILoadFacebookUserApi,
  LoadFacebookUserApi,
} from "@/domain/data/contracts/apis";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: ILoadFacebookUserApi
  ) {}

  async perform(
    params: LoadFacebookUserApi.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}
