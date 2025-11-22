import { LoadFacebookUserApi } from "@/domain/data/contracts/apis";
import { mock } from "jest-mock-extended";

class FacebookApi {
  private readonly baseUrl: string = "https://graph.facebook.com";
  constructor(private readonly httpClient: IHttpGetClient) {}
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
    });
  }
}

namespace HttpGetClient {
  export type Params = {
    url: string;
  };
}

interface IHttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

describe("FacebookApi", () => {
  it("should get app token", async () => {
    const httpClient = mock<IHttpGetClient>();
    const sut = new FacebookApi(httpClient);
    const facebookUserApi = await sut.loadUser({ token: "any_client_token" });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/oauth/access_token",
    });
  });
});
