import { ILoadFacebookUserApi } from "@/domain/data/contracts/apis";
import { FacebookAuthenticationService } from "@/domain/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors/authentication";
import { mock, MockProxy } from "jest-mock-extended";

interface ISutTypes {
  sut: FacebookAuthenticationService;
  loadFacebookUserApi: MockProxy<ILoadFacebookUserApi>;
}

const makeSut = (): ISutTypes => {
  const loadFacebookUserApi = mock<ILoadFacebookUserApi>();
  loadFacebookUserApi.loadUser.mockResolvedValue(undefined);
  const sut = new FacebookAuthenticationService(loadFacebookUserApi);
  return {
    sut,
    loadFacebookUserApi,
  };
};

describe("FacebookAuthentication", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const { sut, loadFacebookUserApi } = makeSut();
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });
  it("should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    const { sut, loadFacebookUserApi } = makeSut();
    loadFacebookUserApi.loadUser.mockResolvedValue(undefined);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
