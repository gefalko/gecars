
app.controller('AppCtrl', function($scope) {
        $scope.save = function() {
            return $scope.myForm;
        };
    });

    

(function(){

    angular.module('gecar').controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope','$mdDialog', '$timeout', 'authSer', 'dialogsSer', 'orOpenOrderDialog'];

    function loginCtrl($scope, $mdDialog, $timeout, authSer, dialogsSer, orOpenOrderDialog){

        $scope.showLogin = true;
        
        console.log("openOrderDialog?", orOpenOrderDialog);

        $scope.doLogin = function(loginData){
            if($scope.loginForm.$valid){
                console.log('login correct', loginData);
                authSer.login({email:loginData.email, password:loginData.pass}).then(function(data){
                    $mdDialog.hide();
                    if(orOpenOrderDialog){
                        dialogsSer.openOrderDialog();
                    }
                });
            }else{
                console.log('loggin form is not valid', loginData);
            }        
        }

        $scope.doRegistration = function(regData){
            console.log("Do registration", regData);
            if($scope.registrationForm.$valid){
                 
                authSer.register({email:regData.email,pass:regData.pass}).then(function(data){
                    $mdDialog.hide();
                    if(orOpenOrderDialog){
                        dialogsSer.openOrderDialog();
                    }
                });
                console.log('Registration form valid'); 
            }else{
                console.log('Registration form not valid');
            }
            
        }

        function closeAll(){
            $scope.showLogin = false;
            $scope.showRegistration = false;
        }

        $scope.openLogin = function(){
            closeAll();
            $scope.showLogin = true;
        }

        $scope.openRegistration = function(){
            closeAll();
            $scope.showRegistration = true;
            $timeout();
        }

    }
})();

(function(){


    angular.module('gecar').controller('confirmOrderCtrl', confirmOrderCtrl);

    confirmOrderCtrl.$inject = ['$scope', 'orderSer', 'paymentsSer', 'authSer'];

    function confirmOrderCtrl($scope, orderSer, paymentsSer, authSer){
        const coc = this;

        console.log("init confirmOrderCtrl");

        coc.order = {
            duration:'{"months":1, "discount":0}'
        };
        
        coc.basket = orderSer.basket;

        $scope.$watch(() => this.order, function (newVal) {
          console.log('Name changed to ' + newVal);
        });

        countPrice = function(){
            const duration = JSON.parse(coc.order.duration);
            console.log(duration,coc.basket);
            coc.order.discount = duration.discount;
            coc.order.orderDuration = duration.months;
            coc.order.fullPrice = coc.basket.price * coc.order.orderDuration;
            coc.order.discountSum = (coc.order.fullPrice/100*coc.order.discount).toFixed(2);
            coc.order.price = (coc.order.fullPrice - coc.order.discountSum).toFixed(2);
        }

        countPrice();

        $scope.$watch(function () {
            return coc.order.duration;
        },function(value){
            countPrice();
        });


        coc.startPaymentProcess = function(){
            console.log("Start payment");
            console.log("Filters:", coc.basket.filters);
            //create order and return order id
            

            orderSer.createOrder(coc.order).then(function(orderId){
                console.log("New order created: ",orderId);
                paymentsSer.startPayment(orderId, coc.order.price*100,  authSer.currentUser().email);
            })

            //paymentsSer.startPayment();
        }

    }   
 })();


(function(){

    angular.module('gecar').controller('infoCtrl', infoCtrl);

    infoCtrl.$inject = ['$location', 'authSer'];

    function infoCtrl($location, authSer){
        const self = this;
        
        self.email = authSer.currentUser().email;

        self.go = function(to){
            $location.path(to);
        }
    }
 })();
 
(function(){

    angular.module('gecar').controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['$location', 'userSer', '$timeout'];

    function accountCtrl($location, userSer, $timeout){
        const self = this;

        self.go = function(to){
            $location.path(to);
        };

        userSer.getOrders().then(function(orders){
            self.orders = orders;
            console.log("User orders ->",self.orders);
            $timeout();
        });
       

    }
 })();

 (function(){

    angular.module('gecar').controller('gemenuCtrl', gemenuCtrl);

    gemenuCtrl.$inject = ['$location', 'authSer', '$rootScope'];

    function gemenuCtrl($location, authSer, $rootScope){
        const self = this;

        self.items;
        self.go = go;

        setItems();

        function setItems(){
            if(authSer.isLoggedIn()){
                self.items = [
                    {name:'Naujas užsakymas', path:'/', active:true, public:true},
                    {name:'Mano užsakymai', path:'/orders', active:false, public:false},
                    {name:'Nustatymai', path:'/settings', active:false, public:false}
                ];
            }else{
                self.items = [{name:'Naujas užsakymas', path:'/', active:true, public:true}];
            }
        }

        function go(citem){

            if(citem.active)return;

            for(let item of self.items)
                item.active = false;

            citem.active = true;

            $location.path(citem.path);
        }
        
        $rootScope.$on('change-user-status', function(){
            console.log('on change-user-status');
            setItems();
        });
    }
 })();

(function(){

    angular.module('gecar').controller('menuCtrl', menuCtrl);

    menuCtrl.$inject = ['dialogsSer', 'authSer', '$rootScope', '$location'];

    function menuCtrl(dialogsSer, authSer, $rootScope, $location){

        const mc = this;

        const setUserData = function(){

            mc.isLoggedIn = authSer.isLoggedIn();
      
            console.log("menuCtrl: isLoggedIn:",mc.isLoggedIn);

            if(mc.isLoggedIn){
                mc.user = authSer.currentUser();
                console.log("menuCtrl: user:",mc.user);
            }else{
                mc.user = null;
            }
        }

        setUserData();

        mc.login = function(ev){
            console.log('login from menu');
            dialogsSer.openLoginDialog(ev);
        }

        mc.logout = function(){
            authSer.logout();
            $location.path("/");
        }       
        
        $rootScope.$on('change-user-status', function(){
            console.log('on change-user-status');
            setUserData();
        });

    
    }

})();

(function(){

    angular.module('gecar').controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['authSer'];

    function settingsCtrl(authSer){
        const self = this;

        self.email = authSer.currentUser().email;  

    }
 })();

