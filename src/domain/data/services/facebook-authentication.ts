import { AuthenticationError } from "@/domain/errors/authentication";

import {
  ILoadFacebookUserApi,
  LoadFacebookUserApi,
} from "@/domain/data/contracts/apis";
import {
  ILoadUserAccountRepository,
  ISaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";

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
      await this.userAccountRepo.saveWithFacebook({
        id: accountData?.id,
        email: fbData.email,
        name: accountData?.name ?? fbData.name,
        facebookId: fbData.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
