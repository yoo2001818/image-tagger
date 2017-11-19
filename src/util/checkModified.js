import deepEqual from 'fast-deep-equal';

export default function checkModified(original, modified) {
  let result = {};
  let passed = false;
  if (original.modified != null) {
    for (let key in original.modified) {
      if (!(key in modified)) {
        result[key] = original.modified[key];
        passed = true;
      }
    }
  }
  for (let key in modified) {
    if (!deepEqual(modified[key], original[key])) {
      result[key] = modified[key];
      passed = true;
    }
  }
  if (passed) return result;
  return null;
}
