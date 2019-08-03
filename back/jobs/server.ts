const express = require('express')
const app = express();
const path    = require("path");
const ser = require('./../services/data.service.ts');
const bodyParser = require('body-parser');

require('./../config/passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/css', express.static(path.join(__dirname, '../front/css')));
app.use('/font', express.static(path.join(__dirname, '../front/font')));
app.use('/fonts', express.static(path.join(__dirname, '../front/fonts')));
app.use('/img', express.static(path.join(__dirname, '../front/img')));
app.use('/js', express.static(path.join(__dirname, '../front/js')));
app.use('/css', express.static(path.join(__dirname, '../front/css')));
app.use('/min', express.static(path.join(__dirname, '../front/min')));
app.use('/app', express.static(path.join(__dirname, '../front/app')));
app.use('/views', express.static(path.join(__dirname, '../front/views')));
app.use('/ng2', express.static(path.join(__dirname, '../front/ng2')));
app.use('/admin', express.static(path.join(__dirname, '../front/admin')));
app.use('/front/lib', express.static(path.join(__dirname, '../front/node_modules')));


const authCtrl = require('./../controllers/auth.controller.js');

app.use('/api/register', authCtrl.register); 
app.use('/api/login', authCtrl.login);

const paymentsCtrl = require('./../controllers/payments.controller.js');

app.use('/payment/accept',paymentsCtrl.accept);
app.use('/payment/cancel',paymentsCtrl.cancel);
app.use('/payment/callback',paymentsCtrl.callback);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

app.get('/p/sucess', function (req, res) {
    console.log('cool');
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

app.get('/settings', function (req, res) {
    console.log('cool');
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

app.get('/orders', function (req, res) {
    console.log('cool');
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

app.get('/api/makes',function(req, res){
    ser.loadAllMakesFull().then(function(makes){
        res.send(200,makes);
    });
});

app.get('/api/providers',function(req, res){
    ser.getProviders().then(function(providers){
        res.send(200, providers);
    });
});

app.get('/api/fuelsTypes',function(req, res){
    ser.getFuelTypes().then(function(fuelTypes){
        res.send(200, fuelTypes);
    });
});

app.get('/api/user/exist/:email',function(req, res){
    ser.findUser(req.params.email).then(function(user){
        res.send(200,(user !== null));
    });
});


app.get('/api/users',function(req, res){
    ser.getUsers().then(function(users){
        res.send(200, users);
    });
});

app.get('/api/user/orders/:userId',function(req, res){
    ser.findUserOrders(req.params.userId).then(function(orders){
        res.send(200,orders);
    });
});

const orderCtrl = require('./../controllers/orders.controller.js');


app.use('/api/create/order', orderCtrl.createOrder);

app.use(require("express-chrome-logger"));

// providers testing 

app.get('/test/do/:filterId/:providerId', (req, res) => {

    const filterId = req.params.filterId;
    const providerId = req.params.providerId;
    
    testSer.doTest(res, filterId, providerId).then(function(ads){
        res.send(200, ads);
    });

});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
