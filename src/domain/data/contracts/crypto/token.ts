export interface ITokenGenerator {
  generateToken: (params: ITokenGenerator.Params) => Promise<string>;
}
export namespace ITokenGenerator {
  export type Params = {
    key: string;
    expirationInMs: number;
  };
}
