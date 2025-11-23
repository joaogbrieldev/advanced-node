export interface IHttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<HttpGetClient.Result>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: Record<string, string>;
  };
  export type Result = any;
}
