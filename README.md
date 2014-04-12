# list-redis

  Create a list of hashes sorted by id backend by redis (useful to create queues with data).


## Installation

nodejs:

    $ npm install list-redis
    

## API

```js
var list = require('list-redis');
var queue = list('mylist');
```

  All functions take either an args Array plus optional callback because operations
  with redis are asynchronous.

### .add(hash, callback)

  Create new hash in list and return its id.

```js
queue.add({
  name: 'bredele'
}, function(err, id) {
  //do something
})
```

  Hashes are optional:

```js
queue.add(function(err, id) {
  //do something
})
```

### .get(id, callback)

  Get hash by id.

```js
queue.get(12, function(err, hash) {
  //do something
});
```

### .has(id, callback)

  Return true if list set exists.

```js
queue.has(12, function(err, exists) {
  //do something
});
```

### .del(id, callback)

  Delete list set.

```js
queue.del(12, function(err) {
  //do something
});
```

  Delete list set and hash:

 ```js
queue.del(12, true, function(err) {
  //do something
});
``` 

### .move(id, list, callback)

  Atomically removes the set of the list stored at source, and pushes the set to the list stored at destination.

```js
var other = list('otherList');
queue.move(12, other, function(){
  //do something optional
});
```