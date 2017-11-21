function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

export default function filterEntities(list = [], query, mapper) {
  if (query === '' || query == null) return list;
  const regex = new RegExp(query.split('').map(escapeRegExp).join('.*'));
  return list.filter(id => regex.test(mapper(id)));
}
