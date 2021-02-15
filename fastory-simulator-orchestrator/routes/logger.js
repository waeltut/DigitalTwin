var express = require('express');
var router = express.Router();
var Rest = require('../public/javascripts/restLib.js');
var REST = new Rest();
var fs = require('fs');
/** Variables **/
var simulatorHostname = 'http://localhost:3000';
var Urls = [
	simulatorHostname+'/RTU/SimCNV1/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV1/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV1/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV1/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV2/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV2/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV2/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV2/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV2/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV3/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV3/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV3/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV3/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV3/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV4/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV4/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV4/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV4/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV4/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV5/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV5/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV5/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV5/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV5/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV6/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV6/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV6/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV6/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV6/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV7/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV7/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV7/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV7/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV8/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV8/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV8/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV8/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV8/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV9/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV9/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV9/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV9/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV9/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV10/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV10/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV10/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV10/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV10/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV11/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV11/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV11/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV11/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV11/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV12/events/Z1_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV12/events/Z2_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV12/events/Z3_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV12/events/Z4_Changed/notifs',
	simulatorHostname+'/RTU/SimCNV12/events/Z5_Changed/notifs',
	simulatorHostname+'/RTU/SimROB1/events/PaperLoaded/notifs',
	simulatorHostname+'/RTU/SimROB1/events/PaperUnloaded/notifs',
	simulatorHostname+'/RTU/SimROB2/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB2/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB2/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB3/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB3/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB3/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB4/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB4/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB4/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB5/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB5/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB5/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB6/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB6/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB6/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB7/events/PalletLoaded/notifs',
	simulatorHostname+'/RTU/SimROB7/events/PalletUnloaded/notifs',
	simulatorHostname+'/RTU/SimROB8/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB8/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB8/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB9/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB9/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB9/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB10/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB10/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB10/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB11/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB11/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB11/events/DrawEndExecution/notifs',
	simulatorHostname+'/RTU/SimROB12/events/PenChanged/notifs',
	simulatorHostname+'/RTU/SimROB12/events/DrawStartExecution/notifs',
	simulatorHostname+'/RTU/SimROB12/events/DrawEndExecution/notifs'
];
var baseURL = 'http://localhost:1338/logger';
/** functions **/
function subscribe() {
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

function saveEvent(event){
	var d = new Date();
	fs.appendFile('./events-log/'+d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear()+'_'+d.getHours()+'.json','|'+d.getTime()+'|'+JSON.stringify(event)+'|\n',function(err){
			if (err) throw err;
		});
		
}
/** routes **/
router.get('/subscribe', function (req, res) {
	subscribe();
	res.end()
});
router.get('/logs', function (req, res) {
	res.end()
});
router.post('/event', function (req, res, next) {
	// this service is invoked once the pallet reaches Zone1 for each CNV
	res.end();
	// save the event in jason file
	saveEvent(req.body);
});
/** exports **/

module.exports = router;