import { BadRequestError } from './errors';

export default function cast(schema, value) {
  let output = {};
  for (let key in schema) {
    let type;
    let required = false;
    if (schema[key].charAt(0) === '!') {
      type = schema[key].slice(1);
      required = true;
    } else {
      type = schema[key];
    }
    if (value[key] == null) {
      if (required) throw new BadRequestError();
      continue;
    }
    switch (type) {
      case 'string':
        output[key] = value[key];
        break;
      case 'number':
        output[key] = parseFloat(value[key]);
        break;
      case 'integer':
        output[key] = parseInt(value[key], 10);
        break;
      case 'boolean':
        output[key] = ['1', 'true', 'yes', 'Y'].includes(value[key]);
        break;
    }
  }
  return output;
}
