var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();
var colors = require('colors');

var robots = {
	"ROB1" : "11",
	"ROB2" : "1",
	"ROB3" : "N/A",
	"ROB4" : "N/A",
	"ROB5" : "N/A",
	"ROB6" : "1",
	"ROB7" : "N/A",
	"ROB8" : "N/A",
	"ROB9" : "1",
	"ROB10" : "1",
	"ROB11" : "1",
	"ROB12" : "1"
};

function postRequest(URL, body, headers, callback) {
	var args = {
		headers : headers,
		data : body,
		requestConfig : {
			timeout : 5000,
			noDelay : true,
			keepAlive : true,
			keepAliveDelay : 5000
		},
		responseConfig : {
			timeout : 5000
		}
	};
	var req = client.post(URL, args, function (data, response) {
			callback(data.toString(), response);
		});
	req.on('requestTimeout', function (req) {
		console.log(('request from ' + URL + ' has expired').yellow);
		req.abort();
	});
	req.on('responseTimeout', function (res) {
		console.log(('response to ' + URL + ' has expired').yellow);
	});
	req.on('error', function (err) {
		console.log('request error'.red, err.code.red);
	});
}

var headers={
	"Content-type": "application/x-www-form-urlencoded",
	"Accept": "text/html,application/xhtml+xml,application/xml",
	"Cache-Control":"max-age=0",
	"Connection":"keep-alive"
}

/* GET users listing. */
router.get('/run', function (req, res, next) {
	var i =1;
	var cnvUrl,robUrl;
	var s = setInterval(function(){
		var rtu_cnv,rtu_rob;
		if(i == 1){
			rtu_rob = 11;
			rtu_cnv = 12;
			cnvUrl = 'http://192.168.'+i+'.'+rtu_cnv+'/config/options.html';
			robUrl = 'http://192.168.'+i+'.'+rtu_rob+'/config/options.html';
			postRequest(robUrl, 'boot=run&__end=', headers, function(data,response){
				console.log('Done in '+i+'-'+rtu_rob+' : ' + response.statusCode);
				postRequest(cnvUrl, 'boot=run&__end=', headers, function(data,response){
					console.log('Done in '+i+'-'+rtu_cnv+' : ' + response.statusCode);
					i++;
				});
			});
		}
		else if(i==7){
			postRequest('http://192.168.7.2/config/options.html','boot=run&__end=', headers, function(data,response){
				console.log('Done in 7-2 : ' + response.statusCode);
				i++;
			});
		}
		else{
			rtu_rob = 1;
			rtu_cnv = 2;
			cnvUrl = 'http://192.168.'+i+'.'+rtu_cnv+'/config/options.html';
			robUrl = 'http://192.168.'+i+'.'+rtu_rob+'/config/options.html';
			postRequest(robUrl, 'boot=run&__end=', headers, function(data,response){
				console.log('Done in '+i+'-'+rtu_rob+' : ' + response.statusCode);
				postRequest(cnvUrl, 'boot=run&__end=', headers, function(data,response){
					console.log('Done in '+i+'-'+rtu_cnv+' : ' + response.statusCode);
					i++;
					if(i==13)
					{
						res.end()
						clearInterval(s);
						return;
					}
				});
			});
		}	
	},500);
});

router.get('/run/:rtuid', function (req, res, next) {
	var rtu;
	var ws = req.params.rtuid.substring(3);
	if(ws == '1'){
		rtu = (req.params.rtuid.indexOf('ROB')!= -1) ? '11':'12';
	}
	else{
		rtu = (req.params.rtuid.indexOf('ROB')!= -1) ? '1':'2';
	}
	var url = 'http://192.168.'+ws+'.'+rtu+'/config/options.html';
	postRequest(url, 'boot=run&__end=', headers, function(data,response){
		res.send('Done : ' + response.statusCode);
	});
});

router.get('/config', function (req, res, next) {
	var i =1;
	var cnvUrl,robUrl;
	var s = setInterval(function(){
		var rtu_cnv,rtu_rob;
		if(i == 1){
			rtu_rob = 11;
			rtu_cnv = 12;
			cnvUrl = 'http://192.168.'+i+'.'+rtu_cnv+'/config/options.html';
			robUrl = 'http://192.168.'+i+'.'+rtu_rob+'/config/options.html';
			postRequest(robUrl, 'boot=config&__end=', headers, function(data,response){
				console.log('Done in '+i+'-'+rtu_rob+' : ' + response.statusCode);
				postRequest(cnvUrl, 'boot=config&__end=', headers, function(data,response){
					console.log('Done in '+i+'-'+rtu_cnv+' : ' + response.statusCode);
					i++;
				});
			});
		}
		else if(i==7){
			postRequest('http://192.168.7.2/config/options.html','boot=config&__end=', headers, function(data,response){
				console.log('Done in 7-2 : ' + response.statusCode);
				i++;
			});
		}
		else{
			rtu_rob = 1;
			rtu_cnv = 2;
			cnvUrl = 'http://192.168.'+i+'.'+rtu_cnv+'/config/options.html';
			robUrl = 'http://192.168.'+i+'.'+rtu_rob+'/config/options.html';
			postRequest(robUrl, 'boot=config&__end=', headers, function(data,response){
				console.log('Done in '+i+'-'+rtu_rob+' : ' + response.statusCode);
				postRequest(cnvUrl, 'boot=config&__end=', headers, function(data,response){
					console.log('Done in '+i+'-'+rtu_cnv+' : ' + response.statusCode);
					i++;
					if(i==13)
					{
						res.end()
						clearInterval(s);
						return;
					}
				});
			});
		}	
	},500);
});

router.get('/config/:rtuid', function (req, res, next) {
	var rtu;
	var ws = req.params.rtuid.substring(3);
	if(ws == '1'){
		rtu = (req.params.rtuid.indexOf('ROB')!= -1) ? '11':'12';
	}
	else{
		rtu = (req.params.rtuid.indexOf('ROB')!= -1) ? '1':'2';
	}
	var url = 'http://192.168.'+ws+'.'+rtu+'/config/options.html';
	postRequest(url, 'boot=config&__end=', headers, function(data,response){
		res.send('Done : ' + response.statusCode);
	});
});

router.get('/reboot', function (req, res, next) {
	var i =1;
	var cnvUrl,robUrl;
	var s = setInterval(function(){
		var rtu_cnv,rtu_rob;
		if(i == 1){
			rtu_rob = 11;
			rtu_cnv = 12;
			cnvUrl = 'http://192.168.'+i+'.'+rtu_cnv+'/config/sysreset.html';
			robUrl = 'http://192.168.'+i+'.'+rtu_rob+'/config/sysreset.html';
			postRequest(robUrl, 'reboot=reboot&__end=', headers, function(data,response){
				console.log('Done in '+i+'-'+rtu_rob+' : ' + response.statusCode);
				postRequest(cnvUrl, 'reboot=reboot&__end=', headers, function(data,response){
					console.log('Done in '+i+'-'+rtu_cnv+' : ' + response.statusCode);
					i++;
				});
			});
		}
		else if(i==7){
			postRequest('http://192.168.7.2/config/sysreset.html','reboot=reboot&__end=', headers, function(data,response){
				console.log('Done in 7-2 : ' + response.statusCode);
				i++;
			});
		}
		else{
			rtu_rob = 1;
			rtu_cnv = 2;
			cnvUrl = 'http://192.168.'+i+'.'+rtu_cnv+'/config/sysreset.html';
			robUrl = 'http://192.168.'+i+'.'+rtu_rob+'/config/sysreset.html';
			postRequest(robUrl, 'reboot=reboot&__end=', headers, function(data,response){
				console.log('Done in '+i+'-'+rtu_rob+' : ' + response.statusCode);
				postRequest(cnvUrl, 'reboot=reboot&__end=', headers, function(data,response){
					console.log('Done in '+i+'-'+rtu_cnv+' : ' + response.statusCode);
					i++;
					if(i==13)
					{
						res.end()
						clearInterval(s);
						return;
					}
				});
			});
		}	
	},500);
});

router.get('/reboot/:rtuid', function (req, res, next) {
	var rtu;
	var ws = req.params.rtuid.substring(3);
	if(ws == '1'){
		rtu = (req.params.rtuid.indexOf('ROB')!= -1) ? '11':'12';
	}
	else{
		rtu = (req.params.rtuid.indexOf('ROB')!= -1) ? '1':'2';
	}
	var url = 'http://192.168.'+ws+'.'+rtu+'/config/sysreset.html';
	postRequest(url, 'reboot=reboot&__end=', headers, function(data,response){
		res.send('Done : ' + response.statusCode);
	});
});

router.get('/calibrate-robots',function(req,res){
	var i = 1;
	var robUrl;
	var s = setInterval(function(){
		if(robots['ROB'+i]!='N/A'){
			robUrl = 'http://192.168.'+i+'.'+robots['ROB'+i]+'/rest/services/Calibrate';
			postRequest(robUrl, {}, {"Content-type": "application/json"}, function(data,response){
				i++;
				if(i == 13)
				{
					res.end()
					clearInterval(s);
					return;
				}
			});
		}
		else{
			i++;
			if(i == 13)
			{
				res.end()
				clearInterval(s);
				return;
			}
		}
	},500);
});

module.exports = router;
