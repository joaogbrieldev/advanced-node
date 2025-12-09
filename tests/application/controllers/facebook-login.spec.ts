import { IFacebookAuthentication } from "@/domain/features/facebook-authentication";
import { mock } from "jest-mock-extended";

class FacebookLoginController {
  constructor(
    private readonly facebookAuthenticationService: IFacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthenticationService.perform({
      token: httpRequest.token,
    });
    return {
      statusCode: 400,
      data: new Error("Token is required"),
    };
  }
}

type HttpResponse = {
  statusCode: number;
  data: any;
};

describe("FacebookLoginController", () => {
  let sut: FacebookLoginController;
  let facebookAuth: IFacebookAuthentication;
  beforeAll(() => {
    facebookAuth = mock();
  });
  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });
  it("should return 400 if token is empty", async () => {
    const httpResponse = await sut.handle({ token: "" });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("Token is required"),
    });
  });
  it("should return 400 if token is null", async () => {
    const httpResponse = await sut.handle({ token: null });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("Token is required"),
    });
  });
  it("should return 400 if token is undefined", async () => {
    const httpResponse = await sut.handle({ token: undefined });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("Token is required"),
    });
  });
  it("should call FacebookAuthentication with correct values", async () => {
    await sut.handle({ token: "any_token" });
    expect(facebookAuth.perform).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });
  it("should return 401 if authentication fails", async () => {
    const httpResponse = await sut.handle({ token: undefined });
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("Token is required"),
    });
  });
});
