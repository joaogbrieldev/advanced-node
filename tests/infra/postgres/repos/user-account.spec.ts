import {
  ILoadUserAccountRepository,
  LoadUserAccountRepository,
} from "@/domain/data/contracts/repos";
import { newDb } from "pg-mem";
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "nome", nullable: true })
  name!: string;

  @Column()
  email!: string;

  @Column({ name: "id_facebook", nullable: true })
  facebookId!: string;
}

class PgUserAccountRepository implements ILoadUserAccountRepository {
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
}

describe("PgUserAccountRepository", () => {
  describe("load", () => {
    it("should return an account if email exists", async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: "postgres",
        entities: [PgUser],
      });
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({
        email: "john.doe@example.com",
      });
      const sut = new PgUserAccountRepository();
      const userAccount = await sut.load({ email: "john.doe@example.com" });
      expect(userAccount).toEqual({
        id: "1",
      });
    });
  });
});
