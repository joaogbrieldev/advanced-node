import { AuthenticationError } from "@/domain/errors";
import { IAcessToken } from "@/domain/models";

export type FacebookAuthenticationParams = {
  token: string;
};

export type FacebookAuthenticationResult = IAcessToken | AuthenticationError;

export interface IFacebookAuthentication {
  perform: (
    params: FacebookAuthenticationParams
  ) => Promise<FacebookAuthenticationResult>;
}
