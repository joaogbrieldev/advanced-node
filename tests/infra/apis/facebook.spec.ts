import { FacebookApi } from "@/infra/apis";
import { IHttpGetClient } from "@/infra/http";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookApi", () => {
  let httpClient: MockProxy<IHttpGetClient>;
  let clientId: string;
  let clientSecret: string;

  beforeAll(() => {
    clientId = "any_client_id";
    clientSecret = "any_client_secret";
    httpClient = mock();
  });
  beforeEach(() => {
    httpClient.get.mockReset();
    httpClient.get
      .mockResolvedValueOnce({ access_token: "any_app_token" })
      .mockResolvedValueOnce({ data: { user_id: "any_user_id" } })
      .mockResolvedValueOnce({
        id: "any_user_id",
        name: "any_name",
        email: "any_email",
      });
  });
  it("should get app token", async () => {
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

  it("should get debug token", async () => {
    const sut = new FacebookApi(httpClient, clientId, clientSecret);
    await sut.loadUser({ token: "any_client_token" });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/debug_token",
      params: {
        input_token: "any_client_token",
        access_token: "any_app_token",
      },
    });
  });

  it("should get user info", async () => {
    const sut = new FacebookApi(httpClient, clientId, clientSecret);
    await sut.loadUser({ token: "any_client_token" });
    expect(httpClient.get).toHaveBeenNthCalledWith(3, {
      url: "https://graph.facebook.com/any_user_id",
      params: {
        fields: "id,name,email",
        access_token: "any_client_token",
      },
    });
  });

  it("should return facebook user", async () => {
    const sut = new FacebookApi(httpClient, clientId, clientSecret);
    const facebookUser = await sut.loadUser({ token: "any_client_token" });
    expect(facebookUser).toEqual({
      facebookId: "any_user_id",
      name: "any_name",
      email: "any_email",
    });
  });
});
