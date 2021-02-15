var express = require('express');
var router = express.Router();

var Orders = {};

router.get('/:id',function(req, res){
	if(req.params.id in Orders){res.send(Orders[req.params.id]);}
	else{res.status(404).end();}	
});

router.get('/',function(req, res){
	res.send(Orders);
});

router.post('/',function(req,res){
	console.log(JSON.stringify(req.body));
	Orders[req.body.order.$.id]={
		id:req.body.order.$.id,
		time:new Date(),
		products:[]
	};
	var tempProduct;
	req.body.order.product.forEach(function(product){
		tempProduct = {
			screen:{
				model:product.screen[0].$.model, 
				color:product.screen[0].$.color
			},
			keyboard:{
				model:product.keyboard[0].$.model, 
				color:product.keyboard[0].$.color
			},
			frame:{
				model:product.frame[0].$.model, 
				color:product.frame[0].$.color
			}, 
			quantity:parseInt(product.$.quantity)
		}
		Orders[req.body.order.$.id].products.push(tempProduct);
	});
	res.end();
});
 
module.exports = router;
