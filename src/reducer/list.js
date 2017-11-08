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
          const { items, nextId } = action.payload;
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

export function normalizeListReducer(state = {
  lists: {}, entities: {},
}, action, getKey = v => v) {
  const { name } = action.meta;
  const { lists = {} } = state;
  let entities = Object.assign({}, state.entities);
  if (action.payload.items != null) {
    action.payload.items.forEach(v => {
      let k = getKey(v);
      entities[k] = Object.assign({}, entities[k], v);
    });
  }
  return Object.assign({}, state, {
    entities,
    lists: Object.assign({}, lists, {
      [name]: Object.assign({}, lists[name], (() => {
        const list = lists[name] || {};
        if (action.meta.pending) {
          const { filter, nextId } = action.payload;
          return {
            pending: true,
            refresh: nextId == null,
            items: list.items || [],
            filter: filter,
          };
        } else {
          if (action.error) {
            /*
            return {
              pending: false,
            };
            */
            return {};
          } else {
            const { items, nextId } = action.payload;
            return {
              pending: false,
              nextId,
              hasNext: nextId != null,
              refresh: false,
              items: (list.refresh ? [] : (list.items || []))
                .concat(items.map(getKey)),
            };
          }
        }
      })()),
    }),
  });
}
