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
        name?: string;
      };
}

export interface ISaveWithFacebookRepository {
  saveWithFacebook: (
    params: SaveWithFacebookRepository.Params
  ) => Promise<SaveWithFacebookRepository.Result>;
}

export namespace SaveWithFacebookRepository {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };
  export type Result = {
    id: string;
  };
}
