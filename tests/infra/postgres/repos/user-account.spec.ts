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
  describe("save", () => {
    it("should create an account if id is undefined", async () => {
      await sut.saveWithFacebook({
        email: "john.doe@example.com",
        name: "John Doe",
        facebookId: "1234567890",
      });
      const pgUser = await pgUserRepo.findOne({
        email: "john.doe@example.com",
      });
      expect(pgUser?.id).toBe(1);
    });
    it("should update an account if id is defined", async () => {
      await pgUserRepo.save({
        email: "any_email",
        name: "any_name",
        facebookId: "any_fb_id",
      });
      await sut.saveWithFacebook({
        id: "1",
        email: "new_email",
        name: "new_name",
        facebookId: "new_fb_id",
      });
      const pgUser = await pgUserRepo.findOne({
        id: 1,
      });
      expect(pgUser).toEqual({
        id: 1,
        email: "new_email",
        name: "new_name",
        facebookId: "new_fb_id",
      });
    });
  });
});
