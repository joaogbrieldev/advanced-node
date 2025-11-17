import { AuthenticationError } from "@/domain/errors/authentication";

import {
  ILoadFacebookUserApi,
  LoadFacebookUserApi,
} from "@/domain/data/contracts/apis";
import { ILoadUserAccountRepository } from "@/domain/data/contracts/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: ILoadFacebookUserApi,
    private readonly loadUserAccountRepository: ILoadUserAccountRepository
  ) {}

  async perform(
    params: LoadFacebookUserApi.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(params);
    if (fbData !== undefined) {
      await this.loadUserAccountRepository.load({ email: fbData.email });
    }
    return new AuthenticationError();
  }
}
