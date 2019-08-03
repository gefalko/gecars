const dataSer = require('../services/data.service');

module.exports.createOrder = function(req, res){    
    console.log("create order ->", req.body);
   const filters = req.body.filters;
    //1. save filters


   delete req.body.filters; 
   
   dataSer.createOrder(req.body).then(function(order){
        
       const promises = [];

       for(let filter of filters){
           filter.order = order._id;
           promises.push(dataSer.createFilter(filter));
       }

       Promise.all(promises).then(function(filters){
           for(let filter of filters){
               order.filters.push(filter._id);
           } 
           order.save().then(function(){
                console.log("Order from db->",order);
                res.send(200,order._id);
           });
       });
       
   });
}
