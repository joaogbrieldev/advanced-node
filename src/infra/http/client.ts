export interface IHttpGetClient {
  get: <T = any>(params: HttpGetClient.Params) => Promise<T>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: Record<string, string>;
  };
  export type Result = any;
}
