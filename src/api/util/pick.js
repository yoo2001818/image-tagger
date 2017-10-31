export default function pick(keys, value) {
  let output = [];
  keys.forEach(key => {
    output[key] = value[key];
  });
  return output;
}
