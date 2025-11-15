class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: ILoadFacebookUserApi
  ) {}

  async perform(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
  }
}

interface ILoadFacebookUserApi {
  loadUser: (token: LoadFacebookUserApi.Params) => Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string;
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
  }
}

describe("FacebookAuthentication", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApi.token).toBe("any_token");
  });
});
