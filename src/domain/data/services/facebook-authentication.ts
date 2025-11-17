import { AuthenticationError } from "@/domain/errors/authentication";

import {
  ILoadFacebookUserApi,
  LoadFacebookUserApi,
} from "@/domain/data/contracts/apis";
import {
  ICreateFacebookAccountRepository,
  ILoadUserAccountRepository,
} from "@/domain/data/contracts/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: ILoadFacebookUserApi,
    private readonly loadUserAccountRepository: ILoadUserAccountRepository,
    private readonly createFacebookAccountRepository: ICreateFacebookAccountRepository
  ) {}

  async perform(
    params: LoadFacebookUserApi.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(params);
    if (fbData !== undefined) {
      await this.loadUserAccountRepository.load({ email: fbData.email });
      await this.createFacebookAccountRepository.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}
