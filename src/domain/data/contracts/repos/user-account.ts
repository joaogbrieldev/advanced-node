export interface ILoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };
  export type Result =
    | undefined
    | {
        id: string;
        name: string;
        email: string;
      };
}

export interface ICreateFacebookAccountRepository {
  createFromFacebook: (
    params: CreateFacebookAccountRepository.Params
  ) => Promise<void>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string;
    email: string;
    facebookId: string;
  };
}
