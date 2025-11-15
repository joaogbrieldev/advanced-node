import { AuthenticationError } from "@/domain/errors";
import { IAcessToken } from "@/domain/models";

export interface IFacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<Result>;
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string;
  };
}

export type Result = IAcessToken | AuthenticationError;
