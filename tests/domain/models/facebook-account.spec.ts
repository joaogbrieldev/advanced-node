import { FacebookAccount } from "@/domain/models";

describe("FacebookAccount", () => {
  const fbData = {
    name: "any_name",
    email: "any_email",
    facebookId: "any_facebook_id",
  };
  it("should create a facebook account", () => {
    const accountData = {
      id: "any_id",
    };

    const facebookAccount = new FacebookAccount(fbData, accountData);

    expect(facebookAccount.id).toBe("any_id");
    expect(facebookAccount.name).toBe("any_name");
    expect(facebookAccount.email).toBe("any_email");
    expect(facebookAccount.facebookId).toBe("any_facebook_id");
  });

  it("should create a facebook account with account data", () => {
    const accountData = {
      id: "any_id",
      name: "any_name",
    };
    const facebookAccount = new FacebookAccount(fbData, accountData);

    expect(facebookAccount.id).toBe("any_id");
    expect(facebookAccount.name).toBe("any_name");
    expect(facebookAccount.email).toBe("any_email");
    expect(facebookAccount.facebookId).toBe("any_facebook_id");
  });
});
