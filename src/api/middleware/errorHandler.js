import { InternalServerError } from '../util/errors';

export default function errorHandler(err, req, res, next) {
  let error = err;
  if (error.httpCode == null) {
    console.error(err.stack);
    error = new InternalServerError();
  }
  res.status(error.httpCode).json({
    name: error.name, message: error.message,
  });
}
