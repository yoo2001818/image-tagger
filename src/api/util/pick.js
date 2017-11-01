export default function pick(keys, value) {
  let output = [];
  keys.forEach(key => {
    if (value[key] != null) output[key] = value[key];
  });
  return output;
}
