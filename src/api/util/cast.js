export default function cast(schema, value) {
  let output = {};
  for (let key in schema) {
    if (output[key] == null) continue;
    switch (schema[key]) {
      case 'string':
        output[key] = schema[key];
        break;
      case 'number':
        output[key] = parseFloat(schema[key]);
        break;
      case 'integer':
        output[key] = parseInt(schema[key], 10);
        break;
      case 'boolean':
        output[key] = ['1', 'true', 'yes', 'Y'].includes(schema[key]);
        break;
    }
  }
  return output;
}
