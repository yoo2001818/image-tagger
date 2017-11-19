export default function getEntry(value, key) {
  if (value.modified && value.modified[key] != null) return value.modified[key];
  return value[key];
}
