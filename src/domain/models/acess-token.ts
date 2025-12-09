export class AcessToken {
  constructor(readonly value: string) {}

  static create(value: string): AcessToken {
    return new AcessToken(value);
  }

  static get expirationInMs(): number {
    return 30 * 60 * 1000;
  }
}
