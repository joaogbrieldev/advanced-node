import { ITokenGenerator } from "@/domain/data/contracts/crypto";
import jwt from "jsonwebtoken";

export class JwtTokenGenerator {
  constructor(private readonly secret: string) {}
  async generateToken(params: ITokenGenerator.Params): Promise<string> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });
    return token;
  }
}
