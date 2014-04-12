
/**
 * Tests dependencies.
 */

var list = require('..');
var assert = require('assert');
var client = require('redis').createClient();

describe('list', function() {

	var queue;
	beforeEach(function() {
		queue = list('list:test');
	});

	describe('api', function() {

		it('should have a add handler', function() {
			assert(queue.add);
		});

		it('should have a del handler', function() {
			assert(queue.del);
		});

		it('should have a get handler', function() {
			assert(queue.get);
		});

		it('should have a push handler', function() {
			assert(queue.push);
		});

		it('should have a range handler', function() {
			assert(queue.range);
		});

		it('should have a has handler', function() {
			assert(queue.has);
		});

	});

	describe('add', function() {

		it('should generate uniq id', function(done) {
			queue.add(function(err, id) {
				if(id) done();
			});
		});

		it('should add id into a redis queue', function(done) {
			queue.add(function(err, id) {
				client.zrank('list:test', id, function(err, res) {
					if(res) done();
				});
			});
		});

		it('should set options into id hash fields', function(done) {
			queue.add({
				name: 'redis'
			}, function(err, id) {
				client.hgetall('list:test:' + id, function(err, res) {
					if(res.name === 'redis') done();
				});
			});
		});
		
	});

	describe('get', function() {

		it('should return options if exists in list', function(done) {
			queue.add({
				name: 'bredele'
			}, function(err, id) {
				queue.get(id, function(err, data) {
					if(!err && data.name === 'bredele') done();
				});
			});
		});

	});

});