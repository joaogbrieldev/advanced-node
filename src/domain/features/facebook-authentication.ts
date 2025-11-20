import { AuthenticationError } from "@/domain/errors";
import { AcessToken } from "../models";

export interface IFacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>;
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string;
  };
  export type Result = AcessToken | AuthenticationError;
}
