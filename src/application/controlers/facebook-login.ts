import { RequiredFieldError, ServerError } from "@/application/errors";
import { HttpResponse, badRequest } from "@/application/helpers";
import { IFacebookAuthentication } from "@/domain/features/facebook-authentication";
import { AcessToken } from "@/domain/models";

export class FacebookLoginController {
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
        return badRequest(new RequiredFieldError("Token"));
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
