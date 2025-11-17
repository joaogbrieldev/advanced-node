import { ILoadFacebookUserApi } from "@/domain/data/contracts/apis";
import { FacebookAuthenticationService } from "@/domain/data/services/facebook-authentication";
import { AuthenticationError } from "@/domain/errors/authentication";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthentication", () => {
  let sut: FacebookAuthenticationService;
  let loadFacebookUserApi: MockProxy<ILoadFacebookUserApi>;
  const token = "any_token";

  beforeEach(() => {
    loadFacebookUserApi = mock<ILoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
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
});
