import { ILoadFacebookUserApi } from "@/domain/data/contracts/apis";
import {
  ILoadUserAccountRepository,
  ISaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";
import { FacebookAuthenticationService } from "@/domain/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors/authentication";
import { FacebookAccount } from "@/domain/models";
import { mock, MockProxy } from "jest-mock-extended";
import { mocked } from "ts-jest/utils";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthentication", () => {
  let sut: FacebookAuthenticationService;
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  const token = "any_token";
  let userAccountRepo: MockProxy<
    ILoadUserAccountRepository & ISaveWithFacebookRepository
  >;

  beforeEach(() => {
    facebookApi = mock<ILoadFacebookUserApi>();
    userAccountRepo = mock<
      ILoadUserAccountRepository & ISaveWithFacebookRepository
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
  it("should call SaveWithFacebookRepo with FacebookAccount", async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({
      any: "any",
    }));
    mocked(FacebookAccount).mockImplementation(facebookAccountStub);
    userAccountRepo.load.mockResolvedValue(undefined);
    await sut.perform({ token });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: "any",
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});
