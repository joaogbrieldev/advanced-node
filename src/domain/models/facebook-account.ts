type FacebookData = {
  name: string;
  email: string;
  facebookId: string;
};

type AccountData = {
  id?: string;
  name?: string;
};

export class FacebookAccount {
  id?: string;
  email: string;
  name: string;
  facebookId: string;

  constructor(props: FacebookData, accountData?: AccountData) {
    this.id = accountData?.id;
    this.email = props.email;
    this.name = accountData?.name ?? props.name;
    this.facebookId = props.facebookId;
  }
}
