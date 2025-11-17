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
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository &
      ICreateFacebookAccountRepository
  ) {}

  async perform(
    params: LoadFacebookUserApi.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      await this.userAccountRepo.load({ email: fbData.email });
      await this.userAccountRepo.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}
