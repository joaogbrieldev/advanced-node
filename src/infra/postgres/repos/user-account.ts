import {
  ILoadUserAccountRepository,
  LoadUserAccountRepository,
  SaveWithFacebookRepository,
} from "@/domain/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities/user";
import { getRepository } from "typeorm";

export class PgUserAccountRepository implements ILoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email: params.email });
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
    const pgUserRepo = getRepository(PgUser);
    await pgUserRepo.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId,
    });
  }
}
