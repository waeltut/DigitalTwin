var express = require('express');
var router = express.Router();
var Rest = require('../public/javascripts/restLib.js');
var REST = new Rest();
var UUID = require('node-uuid');
var fs = require('fs');
//_______________________________________________________________________________
/** Variables **/
var simulatorHostname = 'http://localhost:3000';
var Urls = [
	simulatorHostname+'/RTU/SimCNV1/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV2/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV3/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV4/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV5/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV6/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV7/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV8/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV9/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV10/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV11/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV12/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimROB2/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB3/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB4/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB5/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB6/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB8/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB9/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB10/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB11/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB12/events/PenChanged/notifs'
];
var baseURL = 'http://localhost:1338/orchestrator'
var robots = {
	"SimROB1" : "N/A",
	"SimROB2" : "RED",
	"SimROB3" : "RED",
	"SimROB4" : "RED",
	"SimROB5" : "RED",
	"SimROB6" : "RED",
	"SimROB7" : "N/A",
	"SimROB8" : "RED",
	"SimROB9" : "RED",
	"SimROB10" : "RED",
	"SimROB11" : "RED",
	"SimROB12" : "RED"
};
var pallets = {};
var callbacks = {};
var ordersQueue = [];
var recipe1 = ['TransZone12', 'TransZone23', 'TransZone35'];
var recipe2 = ['TransZone14', 'TransZone45'];
var d = new Date();
var lastHour=d.getHours();
var delay = 500; // in ms for delaying the response 
//_______________________________________________________________________________
/** functions **/
var subscribe = function(){
	var i = 0;
	var s = setInterval(function () {
			REST.POST(Urls[i], {
				destUrl : baseURL + "/event"
			}, function (data, response) {
				console.log('Subscription in:' + Urls[i])
				i++;
				if (i == Urls.length) {
					clearInterval(s);
				}
			});
		}, 250);
}
var getRecipe = function(WS, palletID, callback){
	var tempRecipe1 = recipe1.slice(0);
	var tempRecipe2 = recipe2.slice(0);
	if (WS == '1') {
		if (palletID in pallets && pallets[palletID].paper == 'pending') {
			// add Paper
			tempRecipe1.splice(2, 0, 'LoadPaper')
			return callback(tempRecipe1);
		} else if (palletID in pallets &&
			pallets[palletID].screen.status != 'pending' &&
			pallets[palletID].keyboard.status != 'pending' &&
			pallets[palletID].frame.status != 'pending') {
			// removepaper
			tempRecipe1.splice(2, 0, 'UnloadPaper','LoadPaper');
			getOrder(function(order){
				pallets[palletID] = order;
			});
			return callback(tempRecipe1);
		} else {
			// pass the pallet 1-2-3-5
			return callback(tempRecipe1);
		}
	} else if (WS == '7') {
		if (palletID in pallets) {
			// pass the pallet 1-2-3-5
			return callback(tempRecipe1);
		} else {
			// map the pallet or remove it(discuss it with Andrei)
			tempRecipe1.splice(2, 1);
			tempRecipe1.splice(2,0,'UnloadPallet');
			return callback(tempRecipe1);
		}
	} else {
		REST.POST(simulatorHostname+'/RTU/SimCNV'+WS+'/services/Z2', {}, function (data, response) {
			if (JSON.parse(data.toString()).PalletID != -1) {
				// pass the pallet 1-4-5
				return callback(tempRecipe2);
			} else {
				//console.log(pallets)
				if (palletID in pallets && pallets[palletID].paper != 'pending') {
					// pallet is mapped to an order
					if (robots['SimROB' + WS] == pallets[palletID].screen.color && pallets[palletID].screen.status == 'pending') {
						// this workstation can draw screen
						if (robots['SimROB' + WS] == pallets[palletID].keyboard.color && pallets[palletID].keyboard.status == 'pending') {
							// this workstation can draw keybaord
							if (robots['SimROB' + WS] == pallets[palletID].frame.color && pallets[palletID].frame.status == 'pending') {
								// this workstation can draw frame
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].frame.model + 0), 'Draw' + (pallets[palletID].screen.model + 3), 'Draw' + (pallets[palletID].keyboard.model + 6));
								return callback(tempRecipe1);
							} else {
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].keyboard.model + 6), 'Draw' + (pallets[palletID].screen.model + 3));
								return callback(tempRecipe1);
							}
						} else {
							if (robots['SimROB' + WS] == pallets[palletID].frame.color && pallets[palletID].frame.status == 'pending') {
								// this workstation can draw frame
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].screen.model + 3), 'Draw' + (pallets[palletID].frame.model + 0));
								return callback(tempRecipe1);
							} else {
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].screen.model + 3));
								return callback(tempRecipe1);
							}
						}
					} else {
						// this workstation can not draw screen
						if (robots['SimROB' + WS] == pallets[palletID].keyboard.color && pallets[palletID].keyboard.status == 'pending') {
							// this workstation can draw keybaord
							if (robots['SimROB' + WS] == pallets[palletID].frame.color && pallets[palletID].frame.status == 'pending') {
								// this workstation can draw frame
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].frame.model + 0), 'Draw' + (pallets[palletID].keyboard.model + 6));
								return callback(tempRecipe1);
							} else {
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].keyboard.model + 6));
								return callback(tempRecipe1);
							}
						} else {
							if (robots['SimROB' + WS] == pallets[palletID].frame.color && pallets[palletID].frame.status == 'pending') {
								// this workstation can draw frame
								tempRecipe1.splice(2, 0, 'Draw' + (pallets[palletID].frame.model + 0))
								return callback(tempRecipe1);
							} else {
								// pass the pallet
								REST.POST(simulatorHostname+'/RTU/SimCNV'+WS+'/services/Z3', {}, function (data, response) {
									if (JSON.parse(data.toString()).PalletID != -1) {
										return callback(tempRecipe2);
									} else {
										return callback(tempRecipe1);
									}
								});
							}
						}
					}
				} else {
					// Pallet is not mapped to an order
					REST.POST(simulatorHostname+'/RTU/SimCNV'+WS+'/services/Z3', {}, function (data, response) {
						if (JSON.parse(data.toString()).PalletID != -1) {
							return callback(tempRecipe2);
						} else {
							return callback(tempRecipe1);
						}
					});
				}
			}
		});
	}
}
var executeOrWait = function(serviceId, ws, palletID, callbackUrl){
	var rtuID;
	if (serviceId.indexOf('TransZone') != -1) {
		
			var to = serviceId.substring(serviceId.length - 1);
			var s = setInterval(function () {
					REST.POST(simulatorHostname+'/RTU/SimCNV'+ws+'/services/Z' + to, {}, function (data, response) {
						if (JSON.parse(data.toString()).PalletID == -1) {
							clearInterval(s);
							REST.POST(simulatorHostname+'/RTU/SimCNV'+ws+'/services/' + serviceId, {
								destUrl : callbackUrl
							}, function (data, response) {});
						}
					});
				}, 500);
		
		
	} 
	else if(serviceId.indexOf('UnloadPallet') != -1){
		REST.POST(simulatorHostname+'/RTU/SimROB7/services/' + serviceId, {destUrl : callbackUrl}, function (data, response) {});
	}
	else {
		if (ws == '1') {
			REST.POST(simulatorHostname+'/RTU/SimROB'+ws+'/services/'+ serviceId, {
				destUrl : callbackUrl
			}, function (data, response) {
				pallets[palletID].paper = 'Done';
				if (pallets[palletID].screen.status == 'Done') {
					//delete pallets[palletID]
				}
			});
		} else {
			REST.POST(simulatorHostname+'/RTU/SimROB'+ws+'/services/'+ serviceId, {
				destUrl : callbackUrl
			}, function (data, response) {
				if (serviceId.indexOf('Draw') != -1) {
					if (serviceId.indexOf('1') != -1 || serviceId.indexOf('2') != -1 || serviceId.indexOf('3') != -1) {
						pallets[palletID].frame.status = 'Done';
					}
					if (serviceId.indexOf('4') != -1 || serviceId.indexOf('5') != -1 || serviceId.indexOf('6') != -1) {
						pallets[palletID].screen.status = 'Done';
					}
					if (serviceId.indexOf('7') != -1 || serviceId.indexOf('8') != -1 || serviceId.indexOf('9') != -1) {
						pallets[palletID].keyboard.status = 'Done';
					}
				}
			});
		}
	}
}
var getOrder = function(callback){
	var order = ordersQueue.slice(0,1);
	ordersQueue.splice(0,1);
	console.log(order[0])
	console.log(ordersQueue)
	return callback(order[0]);	
}
//_______________________________________________________________________________
/** routes **/
router.get('/subscribe', function (req, res) {
	subscribe();
	res.end()
});

router.post('/event', function (req, res, next) {
	// this service is invoked once the pallet reaches Zone1 for each CNV
	res.end();
	if(req.body.id == 'Z1_Changed'){
	setTimeout(function () {
		var ws = req.body.senderID.substring(6);
		var palletID = req.body.payload.PalletID;
		if (palletID != -1) { // arriving pallet
			if ((!(palletID in pallets)) && ordersQueue.length != 0 && ws == '8') {
				getOrder(function(order){
					pallets[palletID] = order;
					getRecipe(ws, palletID, function (recipe) {
						//console.log(palletID + ' : ' + recipe);
						var id = UUID.v4();
						callbacks[id] = {};
						callbacks[id].recipe = recipe;
						callbacks[id].ws = ws;
						callbacks[id].palletID = palletID;
						executeOrWait(recipe[0], ws, palletID, baseURL + '/callback/' + id);
						callbacks[id].recipe.splice(0, 1);
					});
				});
			} else {
				getRecipe(ws, palletID, function (recipe) {
					console.log(palletID + ' : ' + recipe);
					var id = UUID.v4();
					callbacks[id] = {};
					callbacks[id].recipe = recipe;
					callbacks[id].ws = ws;
					callbacks[id].palletID = palletID;
					executeOrWait(recipe[0], ws, palletID, baseURL + '/callback/' + id);
					callbacks[id].recipe.splice(0, 1);
				});
			}
		}
	}, 500);
	}
	else if(req.body.id == 'PenChanged'){
		robots[req.body.senderID] = req.body.payload.PenColor;
	}
	
	
});

router.get('/callbacks', function (req, res) {
	res.send(callbacks);
});

router.get('/order-queue', function (req, res) {
	res.send(ordersQueue);
});

router.post('/callback/:callbackId', function (req, res) {
	res.end();
	setTimeout(function () {
		if (req.params.callbackId in callbacks) {
			executeOrWait(callbacks[req.params.callbackId].recipe[0], callbacks[req.params.callbackId].ws, callbacks[req.params.callbackId].palletID, baseURL + '/callback/' + req.params.callbackId);
			callbacks[req.params.callbackId].recipe.splice(0, 1);
			if (callbacks[req.params.callbackId].recipe.length == 0) {
				delete callbacks[req.params.callbackId];
			}
		}
	}, 500);
});

router.get('/pallets', function (req, res) {
	res.send(pallets);
});

router.post('/order', function (req, res, next) {
	//can be used directly
	res.end('ok');
	var tempOrder = {
		orderID : req.body.order.id,
		paper : 'pending',
		screen : {
			color : req.body.order.product.screen.color,
			model : parseInt(req.body.order.product.screen.model),
			status : 'pending'
		},
		keyboard : {
			color : req.body.order.product.keyboard.color,
			model : parseInt(req.body.order.product.keyboard.model),
			status : 'pending'
		},
		frame : {
			color : req.body.order.product.frame.color,
			model : parseInt(req.body.order.product.frame.model),
			status : 'pending'
		}
	}
	for (i =0;i<req.body.order.product.quantity;i++)ordersQueue.push(tempOrder);
});
//_______________________________________________________________________________
/** exports **/
module.exports = router;
