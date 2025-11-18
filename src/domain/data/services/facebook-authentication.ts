import { AuthenticationError } from "@/domain/errors/authentication";

import {
  ILoadFacebookUserApi,
  LoadFacebookUserApi,
} from "@/domain/data/contracts/apis";
import {
  ILoadUserAccountRepository,
  ISaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";
import { FacebookAccount } from "@/domain/models";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository &
      ISaveWithFacebookRepository
  ) {}

  async perform(
    params: LoadFacebookUserApi.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });
      const facebookAccount = new FacebookAccount(fbData, accountData);
      await this.userAccountRepo.saveWithFacebook(facebookAccount);
    }
    return new AuthenticationError();
  }
}
