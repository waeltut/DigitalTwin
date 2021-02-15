var Client = require('node-rest-client').Client;
var client = new Client();
var colors = require('colors');
var FUN = function(){};
FUN.prototype ={
	GET:function(URL,Args,callback)
	{
		var args = {headers:{"Content-Type": "application/json"}, data:{},requestConfig:{timeout:5000, noDelay:true, keepAlive:true,keepAliveDelay:5000},responseConfig:{timeout:5000}};
		var req = client.get(URL, args, function(data,response){
			callback(data,response);
		});
		req.on('requestTimeout',function(req){
			console.log(('request from '+URL+' has expired').yellow);
			req.abort();
		});
		req.on('responseTimeout',function(res){
			console.log(('response to '+URL+' has expired').yellow);
		});
		req.on('error', function(err){
			console.log('request error'.red,err.code.red);
		});
	},
	PUT:function(URL,Args,callback)
	{
		var args = {headers:{"Content-Type": "application/json"}, data:{},requestConfig:{timeout:5000, noDelay:true, keepAlive:true,keepAliveDelay:5000},responseConfig:{timeout:5000}};
		args.data = Args;
		var req = client.put(URL, args, function(data,response){
			callback(data,response);
		});
		req.on('requestTimeout',function(req){
			console.log(('request from '+URL+' has expired').yellow);
			req.abort();
		});
		req.on('responseTimeout',function(res){
			console.log(('response to '+URL+' has expired').yellow);
		});
		req.on('error', function(err){
			console.log('request error'.red,err.code.red);
		});
	},
	POST:function(URL,Args,callback)
	{
		var args = {headers:{"Content-Type": "application/json"}, data:{},requestConfig:{timeout:5000, noDelay:true, keepAlive:true,keepAliveDelay:5000},responseConfig:{timeout:5000}};
		args.data = Args;
		var req = client.post(URL, args, function(data,response){
			callback(data,response);
		});
		req.on('requestTimeout',function(req){
			console.log(('request from '+URL+' has expired').yellow);
			req.abort();
		});
		req.on('responseTimeout',function(res){
			console.log(('response to '+URL+' has expired').yellow);
		});
		req.on('error', function(err){
			console.log('request error'.red,err.code.red);
		});
	},
	DELETE:function(URL,Args,callback)
	{
		var args = {headers:{"Content-Type": "application/json"}, data:{},requestConfig:{timeout:5000, noDelay:true, keepAlive:true,keepAliveDelay:5000},responseConfig:{timeout:5000}};
		args.data = Args;
		var req = client.delete(URL, args, function(data,response){
			callback(data,response);
		});
		req.on('requestTimeout',function(req){
			console.log(('request from '+URL+' has expired').yellow);
			req.abort();
		});
		req.on('responseTimeout',function(res){
			console.log(('response to '+URL+' has expired').yellow);
		});
		req.on('error', function(err){
			console.log('request error'.red,err.code.red);
		});
	}
};
module.exports=FUN;





