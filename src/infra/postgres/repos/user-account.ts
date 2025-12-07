import {
  ILoadUserAccountRepository,
  LoadUserAccountRepository,
  SaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities/user";
import { getRepository, Repository } from "typeorm";

export class PgUserAccountRepository implements ILoadUserAccountRepository {
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
  ): Promise<void> {
    if (!params.id) {
      await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    } else {
      await this.pgUserRepo.update(parseInt(params.id), {
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    }
  }
}
