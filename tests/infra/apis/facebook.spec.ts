import { FacebookApi } from "@/infra/apis";
import { IHttpGetClient } from "@/infra/http";
import { mock, MockProxy } from "jest-mock-extended";

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
