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

export interface IUpdateUserAccountRepository {
  updateWithFacebook: (
    params: UpdateUserAccountRepository.Params
  ) => Promise<void>;
}

export namespace UpdateUserAccountRepository {
  export type Params = {
    id: string;
    name: string;
    facebookId: string;
  };
}
