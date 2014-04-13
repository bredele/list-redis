
/**
 * Tests dependencies.
 */

var list = require('..');
var assert = require('assert');
var client = require('redis').createClient();
var co = require('co');
var thunk = require('thunkify');

client.zrank = thunk(client.zrank);
client.hgetall = thunk(client.hgetall);

describe('list', function() {

  var queue;
  beforeEach(function() {
    queue = list('list:test');
  });

  describe('api', function() {

    it('should have a push handler', function() {
      assert(queue.push);
    });

    it('should have a del handler', function() {
      assert(queue.del);
    });

    it('should have a get handler', function() {
      assert(queue.get);
    });

    it('should have a move handler', function() {
      assert(queue.move);
    });

    // it('should have a range handler', function() {
    //  assert(queue.range);
    // });

    it('should have a has handler', function() {
      assert(queue.has);
    });


    it('should have a hash handler', function() {
      assert(queue.hash);
    });

  });

  describe('push', function() {

    it('should generate uniq id', function(done) {
      co(function *(){
        var res = yield queue.push();
        if(res) done();
      })();
    });

    it('should push id into a redis queue', function(done) {
      co(function *(){
        var id = yield queue.push();
        var res = client.zrank('list:test', id);
        if(res) done();
      })();
    });

    it('should set options into id hash fields', function(done) {
      co(function *(){
        var id = yield queue.push({
          name: 'redis'
        });
        var res = client.hgetall('list:test', id);
        if(res.name === 'redis') done();
      })();
    });
    
  });

  describe('get', function() {

    it('should return options if exists in list', function(done) {
      co(function *(){
        var id = yield queue.push({
          name: 'bredele'
        });
        var data = yield queue.get(id);
        if(data.name === 'bredele') done();
      })();
    });

  });

  describe('del', function() {
    
    it('should remove set from list', function(done) {
      co(function *(){
        var id = yield queue.push();
        yield queue.del(id);
        yield client.zrank('list:test', id);
        done();
      })();
    });

    it('should delete hash', function(done) {
      co(function *(){
        var id = yield queue.push({
          name: 'hello'
        });
        yield queue.del(id, true);
        yield client.hgetall('list:test', id);
        done();
      })();
    });
  });

  describe('has', function() {

    it('should return true if exists', function(done) {
      co(function *(){
        var id = yield queue.push();
        yield queue.has(id);
        done();
      })();
    });

  });


  describe('move', function() {

    it('should move set in other list', function(done) {
      var other = list('list:other');
      co(function *(){
        var id = yield queue.push();
        yield queue.move(id, other);
        var idx = yield queue.has(id);
        if(!idx) {
          yield other.has(id);
          done();
        }
      })();
    });
  
  });
});