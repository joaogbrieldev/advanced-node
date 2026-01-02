import { FacebookLoginController } from "@/application/controlers/facebook-login";
import { RequiredFieldError, ServerError } from "@/application/errors";
import { badRequest, unauthorized } from "@/application/helpers";
import { AuthenticationError } from "@/domain/errors";
import { IFacebookAuthentication } from "@/domain/features/facebook-authentication";
import { AcessToken } from "@/domain/models";
import { mock, MockProxy } from "jest-mock-extended";

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
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError("Token")));
  });
  it("should return 400 if token is null", async () => {
    const httpResponse = await sut.handle({ token: null });
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError("Token")));
  });
  it("should return 400 if token is undefined", async () => {
    const httpResponse = await sut.handle({ token: undefined });
    expect(httpResponse).toEqual(badRequest(new RequiredFieldError("Token")));
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
    expect(httpResponse).toEqual(unauthorized());
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
