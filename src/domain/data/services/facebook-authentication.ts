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
import { ITokenGenerator } from "../contracts/crypto";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository &
      ISaveWithFacebookRepository,
    private readonly crypto: ITokenGenerator
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
      const { id } = await this.userAccountRepo.saveWithFacebook(
        facebookAccount
      );
      await this.crypto.generateToken({ key: id });
    }
    return new AuthenticationError();
  }
}
