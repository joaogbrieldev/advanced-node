import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { IBackup, newDb } from "pg-mem";
import { getConnection, getRepository, Repository } from "typeorm";

const makeFakeDb = async (entities?: any[]): Promise<any> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: entities ?? ["src/infra/postgres/entities/index.ts"],
  });
  await connection.synchronize();
  return db;
};

describe("PgUserAccountRepository", () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb();
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(async () => {
    backup.restore();
    sut = new PgUserAccountRepository();
  });

  describe("load", () => {
    it("should return an account if email exists", async () => {
      await pgUserRepo.save({ email: "john.doe@example.com" });
      const userAccount = await sut.load({ email: "john.doe@example.com" });
      expect(userAccount).toEqual({ id: "1", name: undefined });
    });
    it("should return undefined if email does not exist", async () => {
      const userAccount = await sut.load({ email: "john.doe@example.com" });
      expect(userAccount).toBeUndefined();
    });
  });
});
