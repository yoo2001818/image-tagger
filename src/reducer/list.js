// A list reducer helper used to implement pagination.
export default function listReducer(state = {}, action) {
  const { name } = action.meta;
  return Object.assign({}, state, {
    [name]: Object.assign({}, state[name], (() => {
      if (action.meta.pending) {
        const { filter, nextId } = action.payload;
        return {
          pending: true,
          items: nextId == null ? [] : state[name].items,
          filter: filter,
        };
      } else {
        if (action.error) {
          return {};
          /*
            pending: false,
          };
          */
        } else {
          const { items, nextId } = action.payload.result;
          return {
            pending: false,
            nextId,
            hasNext: nextId != null,
            items: ((state[name] || {}).items || []).concat(items),
          };
        }
      }
    })()),
  });
}
