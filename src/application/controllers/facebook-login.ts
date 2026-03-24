import { RequiredFieldError } from "@/application/errors";
import {
    HttpResponse,
    badRequest,
    unauthorized,
    serverError,
    ok,
} from "@/application/helpers";
import { IFacebookAuthentication } from "@/domain/features/facebook-authentication";
import { AcessToken } from "@/domain/models";

type HttpRequest = {
    token: string;
};

type Model =
    | Error
    | {
          accessToken: string;
      };

export class FacebookLoginController {
    constructor(
        private readonly facebookAuthenticationService: IFacebookAuthentication,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
        try {
            const error = this.validate(httpRequest);
            if (error) {
                return badRequest(new RequiredFieldError("Token"));
            }
            const acessToken = await this.facebookAuthenticationService.perform(
                {
                    token: httpRequest.token,
                },
            );
            if (acessToken instanceof AcessToken) {
                return ok({ accessToken: acessToken.value });
            } else {
                return unauthorized();
            }
        } catch (error) {
            return serverError(error as Error);
        }
    }

    private validate(httpRequest: HttpRequest): Error | undefined {
        if (
            httpRequest.token === undefined ||
            httpRequest.token === null ||
            httpRequest.token === ""
        ) {
            return new RequiredFieldError("Token");
        }
    }
}
