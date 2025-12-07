import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { IBackup } from "pg-mem";
import { getConnection, getRepository, Repository } from "typeorm";
import { makeFakeDb } from "../mocks";

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
