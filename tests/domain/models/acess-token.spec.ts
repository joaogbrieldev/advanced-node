import { AcessToken } from "@/domain/models";

describe("AcessToken", () => {
  it("should be able to create a new access token", () => {
    const sut = new AcessToken("any_token");
    expect(sut).toEqual({ value: "any_token" });
  });
});
