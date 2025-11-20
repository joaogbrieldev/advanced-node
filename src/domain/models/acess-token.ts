export class AcessToken {
  constructor(private readonly value: string) {}

  static create(value: string): AcessToken {
    return new AcessToken(value);
  }
}
