

    
(function() {

    angular
        .module('gecar')
        .service('dataSer', dataSer);

    dataSer.$inject = ['$http'];
    function dataSer ($http) {

        const getMakes = function () {
            console.log("get makes");
            return new Promise(function(resolve){
                $http.get('/api/makes').then(function(res){
                    console.log('->',res);
                    resolve(res.data);
                });
            });
        };

        const prepareYears = function(){
            const years = [1900,1950,1970,1980,1985];

            for(let i = 1986; i <=  new Date().getFullYear(); i++){
                years.push(i);
            }
            return years;
        };

        const getProviders = function(){
           
            return new Promise(function(resolve){
                $http.get('/api/providers').then(function(res){
                    console.log('->',res);
                    resolve(res.data);
                });
            });
            /*
            return [
                {name:'ebay.co.uk', country:'Anglija', image:'/img/sources/ebay-logo-new.jpg'},
                {name:'autotrader.com', country:'Anglija', image:'/img/sources/auto-trader.png'},
                {name:'gumtree.com', country:'Anglija', image:'/img/sources/gumtree.jpg'},
                {name:'autoplius.lt', country:'Lietuva', image:'/img/sources/autoplius-logo.svg'},
                {name:'autogidas.lt', country:'Lietuva', image:'/img/sources/ag-logo.svg'},
                {name:'autobilis.lt', country:'Lietuva', image:'/img/sources/autobilis.png'}
            ];
            */
        }

        const getFuelTypes = function(){
            return new Promise(function(resolve){
                $http.get('/api/fuelsTypes').then(function(res){
                    console.log('fuels.types http get response ->',res);
                    resolve(res.data);
                });
            });
        }

        

        return {
            getMakes     : getMakes,
            prepareYears : prepareYears,
            getProviders : getProviders,
            getFuelTypes : getFuelTypes
        };
    }

})();



(function(){

   angular.module('gecar').service('dialogsSer', dialogsSer);

   dialogsSer.$inject = ['$mdDialog'];

   function dialogsSer($mdDialog){

        

       function openLoginDialog(ev, orOpenOrderDialog){ 
           console.log('Open login dielog, order', orOpenOrderDialog); 
           $mdDialog.show({
                locals: {orOpenOrderDialog:orOpenOrderDialog},
                controller:'loginCtrl', 
                templateUrl: '/views/login.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });
        }


        function opeenUserDataDialog(ev){
        }


        function openOrderDialog(ev){
            $mdDialog.show({
                controller:'confirmOrderCtrl as coc', 
                templateUrl: '/views/order.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });
        }


        return {
            openLoginDialog:openLoginDialog,
            opeenUserDataDialog:opeenUserDataDialog,
            openOrderDialog:openOrderDialog
        };

   }  
   

})();



(function(){

    angular.module('gecar').service('orderSer', orderSer);

    orderSer.$inject = ['authSer', '$http'];

    function orderSer(authSer, $http){
        
        const self = this;

        self.basket = {
            price:0,
            filters:[]
        };

        self.addFilterToBasket = function(filter){
            self.basket.filters.push(filter);
            self.countBasketPrice();
        }


        self.countBasketPrice = function(){
            self.basket.price = 0;
            console.log("Count basket price:",self.basket.filters);
            console.log(self.basket.filters);
            for(let filter of self.basket.filters){
                self.basket.price+=filter.price;
            }
        };

        function prepareOrderProviders(providers){
            const nproviders = [];
            console.log("Set providers - > ",providers);
            for(let i=0; i<providers.length; i++){
                nproviders.push(providers[i]._id);
            }
            
            return nproviders;
        }

        function prepareOrderFilter(filter){
            console.log("Preparing filter -> ",filter);
            return {
                make:filter.make._id,
                model:filter.model._id,
                providers:prepareOrderProviders(filter.providers),
                priceFrom:filter.priceFrom,
                priceTo:filter.priceTo,
                yearFrom:filter.yearFrom,
                yearTo:filter.yearTo,
                fuel2:filter.fuelType._id
            };
        };

        function prepareOrderFilters(filters){
            const nFilters = [];
            console.log("Prepare filters -> ",filters);
            for(let i=0; i<filters.length; i++){
                let filter = filters[i];
                console.log("Filter -> ", filter);
                nFilters.push(prepareOrderFilter(filter));
            }
            return nFilters;
        }


        self.createOrder = function(orderData){
            console.log("ordersSer:CREATING ORDER:");
            console.log("filters",self.basket.filters);
            
            const order = {
                filters:prepareOrderFilters(self.basket.filters),
                duration: orderData.orderDuration,
                user: authSer.currentUser()._id
            };

            return new Promise(function(resolve){
                $http.post('/api/create/order', order).then(function(res){
                    resolve(res.data);
                });
            });

        };

        return self;
    }
}());


(function(){


   angular.module('gecar').service('paymentsSer', paymentsSer);

   paymentsSer.$inject = ['$httpParamSerializer', 'md5', '$location'];

   function paymentsSer($httpParamSerializer, md5, $location){
     const self = this;

     let host = $location.host();
     if(host == 'localhost'){
        host+=':3000';
     }   
     
     console.log("INIT PAYMENTS SERVICE");
     // paysera
     const projectId = 96399;   
     const signPassword = 'c61f09172291b2268d13e1b8b8301e43';
     const url = 'https://www.paysera.com/pay/';
     const acceptUrl = 'http://'+host+'/payment/accept';
     const cancelUrl = 'http://'+host+'/payment/cancel';
     const callbackUrl = 'http://'+host+'/payment/callback';
     const version = 1.6;
     const test = 1;

     const query = {
         projectid:projectId,
         accepturl:acceptUrl,
         cancelurl:cancelUrl,
         callbackurl:callbackUrl,
         version:version,
         test:test
     }

     self.startPayment = function(orderId, amount, email){
        query.orderid = orderId; 
        query.amount = amount;
        query.p_email = email;


        const b64 =  window.btoa($httpParamSerializer(query));
        const pquery = b64.replace('/','_').replace('+','-'); 
        const sign =  md5.createHash(pquery+""+ signPassword);
        console.log("start payment. sign:", pquery, sign);
        window.location.replace(url+"?data="+pquery+"&sign="+sign);
     }

     return self;
   }    
})();

(function(){

   angular.module('gecar').service('userSer', userSer);

   userSer.$inject = ['authSer', '$http'];

   function userSer(authSer, $http){
        const self = this;

        self.getOrders = getOrders;
        self.updateOrders = updateOrders;
        self.orders = null;

        function getOrders(){
            return new Promise(function(resolve){

                if(self.orders)resolve(self.orders);
                else{
                    updateOrders().then(function(orders){
                        resolve(orders);
                    })
                }
            });

        }

        function updateOrders(){
            return new Promise(function(resolve){
                $http.get('/api/user/orders/'+authSer.currentUser()._id).then(function(res){
                    self.orders = res.data;
                    resolve(res.data);
                });
            });
        }

        return self;
   }

})();

