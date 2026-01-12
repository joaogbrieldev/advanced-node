export class ServerError extends Error {
  constructor(error?: Error) {
    super("Internal server error");
    this.name = "ServerError";
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`${fieldName} is required`);
    this.name = "Error";
  }
}
