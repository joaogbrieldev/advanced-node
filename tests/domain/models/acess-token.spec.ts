import { AcessToken } from "@/domain/models";

describe("AcessToken", () => {
  it("should be able to create a new access token", () => {
    const sut = new AcessToken("any_token");
    expect(sut).toEqual({ value: "any_token" });
  });
  it("should create a new access token using factory method", () => {
    const sut = AcessToken.create("factory_token");
    expect(sut).toEqual({ value: "factory_token" });
  });
  it("should expire in 30 minutes", () => {
    expect(AcessToken.expirationInMs).toBe(1800000);
  });
});
