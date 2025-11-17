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
  let loadFacebookUserApi: MockProxy<ILoadFacebookUserApi>;
  const token = "any_token";
  let loadUserAccountRepo: MockProxy<ILoadUserAccountRepository>;
  let createFacebookAccountRepo: MockProxy<ICreateFacebookAccountRepository>;

  beforeEach(() => {
    loadFacebookUserApi = mock<ILoadFacebookUserApi>();
    loadUserAccountRepo = mock<ILoadUserAccountRepository>();
    createFacebookAccountRepo = mock<ICreateFacebookAccountRepository>();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      facebookId: "any_facebook_id",
      email: "any_email",
      name: "any_name",
    });
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });
  it("should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    loadFacebookUserApi.loadUser.mockResolvedValue(undefined);
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });
  it("should call LoadUserByEmailRepo when LoadFacebookUserApi returns user data", async () => {
    await sut.perform({ token });
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: "any_email",
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
  it("should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined", async () => {
    loadUserAccountRepo.load.mockResolvedValue(undefined);
    await sut.perform({ token });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      facebookId: "any_facebook_id",
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(
      1
    );
  });
});
