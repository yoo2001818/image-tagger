export default function mergeEntities(dest, entities) {
  let output = Object.assign({}, dest);
  for (let key in entities) {
    output[key] = Object.assign({}, dest[key], entities[key]);
  }
  return output;
}
