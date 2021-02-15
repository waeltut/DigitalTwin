var Client = require('node-rest-client').Client;
var client = new Client();
var colors = require('colors');
var FUN = function(){};
FUN.prototype ={
	asyncLoop:function(iterations, func, callback) 
	{
		var index = 0;
		var done = false;
		var loop = {
			next: function() {
				if (done) {
					return;
				}
				if (index < iterations) {
					index++;
					func(loop);
				} else {
					done = true;
					callback();
				}
			},
			iteration: function() {
				return index - 1;
			},
			break: function() {
				done = true;
				callback();
			}
		};
		loop.next();
		return loop;
	}
};
module.exports=FUN;





