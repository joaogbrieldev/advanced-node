import { AuthenticationError } from "@/domain/errors/authentication";

class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: ILoadFacebookUserApi
  ) {}

  async perform(
    params: LoadFacebookUserApi.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}

interface ILoadFacebookUserApi {
  loadUser: (
    token: LoadFacebookUserApi.Params
  ) => Promise<LoadFacebookUserApi.Result>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
  export type Result = undefined;
}

class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string;
  result = undefined;
  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe("FacebookAuthentication", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApi.token).toBe("any_token");
  });
  it("should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    loadFacebookUserApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
