export class BadRequestError extends Error {
  constructor() {
    super('The request is malformed.');
    this.name = 'BadRequestError';
    this.httpCode = 400;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('You need to sign in to access this page.');
    this.name = 'UnauthorizedError';
    this.httpCode = 401;
  }
}

export class CredentialsIncorrectError extends Error {
  constructor() {
    super('Credentials you\'ve provided is not correct.');
    this.name = 'CredentialsIncorrectError';
    this.httpCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('You don\'t have permission to perform the action.');
    this.name = 'ForbiddenError';
    this.httpCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('The specified entity could not be found.');
    this.name = 'NotFoundError';
    this.httpCode = 404;
  }
}

export class InternalServerError extends Error {
  constructor() {
    super('The server has a problem processing the request.');
    this.name = 'InternalServerError';
    this.httpCode = 500;
  }
}

export class NotImplementedError extends Error {
  constructor() {
    super('The server doesn\'t have implementation to handle the request.');
    this.name = 'NotImplementedError';
    this.httpCode = 500;
  }
}
