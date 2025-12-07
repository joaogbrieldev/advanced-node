import {
  ILoadUserAccountRepository,
  ISaveWithFacebookRepository,
  LoadUserAccountRepository,
  SaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities/user";
import { getRepository, Repository } from "typeorm";

export class PgUserAccountRepository
  implements ILoadUserAccountRepository, ISaveWithFacebookRepository
{
  private readonly pgUserRepo: Repository<PgUser>;
  constructor() {
    this.pgUserRepo = getRepository(PgUser);
  }

  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email });
    if (!pgUser) {
      return undefined;
    }
    return {
      id: pgUser.id.toString(),
      name: pgUser.name ?? undefined,
    };
  }

  async saveWithFacebook(
    params: SaveWithFacebookRepository.Params
  ): Promise<SaveWithFacebookRepository.Result> {
    let id: string;
    if (!params.id) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
      id = pgUser.id.toString();
    } else {
      await this.pgUserRepo.update(parseInt(params.id), {
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
      id = params.id;
    }
    return { id };
  }
}
