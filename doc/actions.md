# Actions

## API Requests
All API requests must go through normalizer.

It is important that all actions have the address of originating resource -
ID must be stored in action's meta.

### Pending
If pending, the meta must contain information to route to the resource.

### Success
If succeeded, just perform normalization normally - except for matching entity.

### Error
If errored, the meta must contain information to route the resource.

## Normal Actions
Other non-API inducing requests can choose to not to use normalizer. In this
case, all actions should still contain the address in meta data.

'Entities' reducer is responsible for merging the server's result then running
local reducer if the address is specified.
