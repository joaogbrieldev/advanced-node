import { ILoadFacebookUserApi } from "@/domain/data/contracts/apis";
import {
  ICreateFacebookAccountRepository,
  ILoadUserAccountRepository,
} from "@/domain/data/contracts/repos";
import { FacebookAuthenticationService } from "@/domain/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors/authentication";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthentication", () => {
  let sut: FacebookAuthenticationService;
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  const token = "any_token";
  let userAccountRepo: MockProxy<
    ILoadUserAccountRepository & ICreateFacebookAccountRepository
  >;

  beforeEach(() => {
    facebookApi = mock<ILoadFacebookUserApi>();
    userAccountRepo = mock<
      ILoadUserAccountRepository & ICreateFacebookAccountRepository
    >();
    facebookApi.loadUser.mockResolvedValue({
      facebookId: "any_facebook_id",
      email: "any_email",
      name: "any_name",
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });
  it("should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValue(undefined);
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });
  it("should call LoadUserByEmailRepo when LoadFacebookUserApi returns user data", async () => {
    await sut.perform({ token });
    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: "any_email",
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });
  it("should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined", async () => {
    userAccountRepo.load.mockResolvedValue(undefined);
    await sut.perform({ token });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      facebookId: "any_facebook_id",
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
