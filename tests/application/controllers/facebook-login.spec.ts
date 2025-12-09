import { AuthenticationError } from "@/domain/errors";
import { IFacebookAuthentication } from "@/domain/features/facebook-authentication";
import { AcessToken } from "@/domain/models";
import { mock, MockProxy } from "jest-mock-extended";

class FacebookLoginController {
  constructor(
    private readonly facebookAuthenticationService: IFacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (
        httpRequest.token === undefined ||
        httpRequest.token === null ||
        httpRequest.token === ""
      ) {
        return {
          statusCode: 400,
          data: new Error("Token is required"),
        };
      }
      const acessToken = await this.facebookAuthenticationService.perform({
        token: httpRequest.token,
      });
      if (acessToken instanceof AcessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: acessToken.value,
          },
        };
      } else {
        return {
          statusCode: 401,
          data: acessToken,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error),
      };
    }
  }
}

type HttpResponse = {
  statusCode: number;
  data: any;
};

class ServerError extends Error {
  constructor(error?: Error) {
    super("Internal server error");
    this.name = "ServerError";
    this.stack = error?.stack;
  }
}

describe("FacebookLoginController", () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<IFacebookAuthentication>;
  beforeAll(() => {
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AcessToken("any_token"));
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
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token: "any_token" });
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new Error("Authentication failed"),
    });
  });
  it("should return 200 if authentication succeeds", async () => {
    const httpResponse = await sut.handle({ token: "any_token" });
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: "any_token",
      },
    });
  });
  it("should return 500 if FacebookAuthentication throws", async () => {
    const error = new Error("infra_error");
    facebookAuth.perform.mockRejectedValueOnce(new Error("infra_error"));
    const httpResponse = await sut.handle({ token: "any_token" });
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
