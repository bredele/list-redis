
/**
 * Module dependencies.
 * @api private
 */

var Store = require('datastore');
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
  //will need to pass options to set client
  this.client = client();
  this.name = name;
}




List.prototype.incr = function() {
  var promise = new Promise();
  this.client.incr(this.name + ':id', function(err, res) {
    if(err) promise.reject("an id can't be assigned");
    promise.resolve(res);
  });
  return promise;
};

List.prototype.hash = function() {
  
};

List.prototype.add = function(data, cb) {
  if(typeof data === 'function') cb = data;
  //do wee need to client and name?
  this.incr()
    .then(function(id) {

    }, cb);
};

List.prototype.del = function() {
  
};

List.prototype.get = function() {
  
};

List.prototype.range = function() {
  
};

List.prototype.push = function() {
  
};