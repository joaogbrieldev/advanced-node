import { ITokenGenerator } from "@/domain/data/contracts/crypto";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}
  async generateToken(params: ITokenGenerator.Params): Promise<string> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });
    return token;
  }
}

describe("JwtTokenGenerator", () => {
  let sut: JwtTokenGenerator;
  let fakeJwt: jest.Mocked<typeof jwt>;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => "any_token");
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator("any_secret");
  });

  it("should call sign with correct params", () => {
    sut.generateToken({ key: "any_key", expirationInMs: 1000 });
    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: "any_key" },
      "any_secret",
      {
        expiresIn: 1,
      }
    );
  });
  it("should return a token if JwtTokenGenerator succeeds", async () => {
    const token = await sut.generateToken({
      key: "any_key",
      expirationInMs: 1000,
    });
    expect(token).toBe("any_token");
  });
});
