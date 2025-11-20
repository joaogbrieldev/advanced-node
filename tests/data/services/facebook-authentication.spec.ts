import { ILoadFacebookUserApi } from "@/domain/data/contracts/apis";
import { ITokenGenerator } from "@/domain/data/contracts/crypto";
import {
  ILoadUserAccountRepository,
  ISaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";
import { FacebookAuthenticationService } from "@/domain/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors/authentication";
import { AcessToken, FacebookAccount } from "@/domain/models";
import { mock, MockProxy } from "jest-mock-extended";
import { mocked } from "ts-jest/utils";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthentication", () => {
  let sut: FacebookAuthenticationService;
  let crypto: MockProxy<ITokenGenerator>;
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
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: "any_id" });
    facebookApi.loadUser.mockResolvedValue({
      facebookId: "any_facebook_id",
      email: "any_email",
      name: "any_name",
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_token");
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    );
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

  it("should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_id",
      expirationInMs: AcessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return AcessToken if success", async () => {
    const accessToken = await sut.perform({ token });
    expect(accessToken).toEqual(new AcessToken("any_token"));
  });

  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValue(new Error("token_generator_error"));
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(new Error("token_generator_error"));
  });
  it("should rethrow if SaveWithFacebookRepo throws", async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValue(
      new Error("save_with_facebook_error")
    );
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(
      new Error("save_with_facebook_error")
    );
  });
  it("should rethrow if LoadUserByEmailRepo throws", async () => {
    userAccountRepo.load.mockRejectedValue(
      new Error("load_user_by_email_error")
    );
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(
      new Error("load_user_by_email_error")
    );
  });
  it("should rethrow if LoadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValue(
      new Error("load_facebook_user_api_error")
    );
    const promise = sut.perform({ token });
    await expect(promise).rejects.toThrow(
      new Error("load_facebook_user_api_error")
    );
  });
});
