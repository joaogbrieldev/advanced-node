import { LoadFacebookUserApi } from "@/domain/data/contracts/apis";
import { mock, MockProxy } from "jest-mock-extended";

class FacebookApi {
  private readonly baseUrl: string = "https://graph.facebook.com";
  constructor(
    private readonly httpClient: IHttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      },
    });
  }
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: Record<string, string>;
  };
}

interface IHttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

describe("FacebookApi", () => {
  let sut: FacebookApi;
  let httpClient: MockProxy<IHttpGetClient>;
  let clientId: string;
  let clientSecret: string;

  beforeAll(() => {
    clientId = "any_client_id";
    clientSecret = "any_client_secret";
    httpClient = mock();
  });
  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });
  it("should get app token", async () => {
    const httpClient = mock<IHttpGetClient>();
    const sut = new FacebookApi(httpClient, clientId, clientSecret);
    await sut.loadUser({ token: "any_client_token" });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/oauth/access_token",
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      },
    });
  });
});
