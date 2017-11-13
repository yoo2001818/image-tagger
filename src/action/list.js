import isEqual from 'lodash.isequal';

export function genLoadList(state, name, filter, reset, fetchList) {
  let entry = (state || {})[name];
  let loadNew = false;
  if (entry != null) {
    if (reset) loadNew = true;
    if (!isEqual(entry.filter, filter)) loadNew = true;
  } else {
    loadNew = true;
  }
  if (loadNew) {
    return fetchList(name, filter, null);
  } else {
    if (entry && (entry.pending || !entry.hasNext)) return;
    return fetchList(name, entry.filter, entry.nextId);
  }
}
