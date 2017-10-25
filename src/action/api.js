export const apiMarker = '__api__';

export default function apiMeta(method, endpoint, options) {
  return { [apiMarker]: true, pending: true, method, endpoint, options };
}
