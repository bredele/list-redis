
/**
 * Module dependencies.
 * @api private
 */

var client = require('redis').createClient;
var Promise = require('bredele-promise');

/**
 * Expose 'list'
 */

module.exports = List;


/**
 * list constructor.
 * @api public
 */

function List(name) {
  if(!(this instanceof List)) return new List(name);
  // will need to pass options to set client
  this.client = client();
  this.name = name;
}



/**
 * Increment id key in order to always 
 * get a uniq id.
 * 
 * @return {Promise}
 * @api private
 */

List.prototype.incr = function() {
  var promise = new Promise();
  this.client.incr(this.name + ':id', function(err, res) {
    if(err) promise.reject(err);
    promise.resolve(res);
  });
  return promise;
};


/**
 * Flatten object.
 * 
 * Examples:
 *
 *   flatten({
 *     repo: 'roach',
 *     type: 'github'
 *   });
 *   // => ['repo', 'github', 'type', 'github']
 *   
 * @param  {Object} obj 
 * @return {Array}
 * @api private
 */

function flatten(name, id, obj) {
  var arr = [name + ':' + id];
  for(var key in obj) {
    arr.push(key, obj[key]);
  }
  return arr;
}


/**
 * Hash options into hash keys
 * 
 * Hashes are identified with the 
 * list name suffixed by ':' and 
 * the id.
 * 
 * @param  {Integer} id
 * @param  {Object} data 
 * @api private
 */

List.prototype.hash = function(id, data) {
  var promise = new Promise();
  if(typeof data === 'object') {
    this.client.hmset(flatten(this.name, id, data), function(err) {
      if(err) promise.reject(err);
      promise.resolve();
    });
  }
  return promise;
};


/**
 * Add item into the list.
 *
 * Generate a uniq id and hashes options
 * if passed.
 * 
 * @param {Object | Function} data
 * @param {Function} cb
 * @api public
 */

List.prototype.add = function(data, cb) {
  if(typeof data === 'function') cb = data;
  this.incr()
    .then(function(id) {
      // we don't care if hash didn't work
      this.hash(id, data);
      this.client.zadd(this.name, id, id, function(err, res) {
        cb(err, id);
      });
    }.bind(this), cb);
};


List.prototype.del = function() {
  //boolean to remove hashes as well
};

List.prototype.has = function() {
  
};

/**
 * Get options for given id.
 *
 * Hashes can exist even if id is
 * not in the list.
 * 
 * @param  {Integer} id
 * @param  {Function} cb
 * @api public
 */

List.prototype.get = function(id, cb) {
  //NOTE: should we check if in list?
  this.client.hgetall(this.name + ':' + id, cb);
};


List.prototype.range = function() {
  
};


List.prototype.push = function() {
  
};