
(function() {

    angular
        .module('gecar')
        .controller('orderCtrl', orderCtrl);

    orderCtrl.$inject = ['dataSer', '$timeout', '$scope', 'authSer', 'dialogsSer','orderSer'];
    function orderCtrl(dataSer, $timeout, $scope, authSer, dialogsSer, orderSer) {
        console.log("Strat orderCtrl");

        let oc = this;

        dataSer.getProviders().then(function(providers){
            oc.allProviders = providers;
        });

        dataSer.getFuelTypes().then(function(fuelTypes){
            oc.fuelTypes = fuelTypes;
        });

        oc.basket = orderSer.basket;

        console.log("Providers",oc.allProviders);

        dataSer.getMakes().then(function(makes){
            console.log(makes);
            oc.makes = makes;
            $timeout();
        });

        oc.years = dataSer.prepareYears();

        oc.filter = {
            price:1,
            providers:[],
        }


        const countFilterPrice = function(){
            if(oc.filter.providers.length>1)
                oc.filter.price = oc.filter.providers.length;
            else
                oc.filter.price = 1;
        }

        oc.addProvider = function(provider){
            oc.filter.providers.push(provider);
            countFilterPrice();
        }

        oc.removeProvider = function(provider){
            oc.filter.providers.splice(oc.filter.providers.indexOf(provider), 1);
            countFilterPrice();
        }



        oc.form={valid:true};

        function setError(msg){
            oc.form={valid:false};
            oc.form.msg = msg;
        }

        oc.addToBasket = function(filter, form){

	        console.log('filter', filter);	

            if (form.$valid && filter.providers.length > 0) {
                
		        //check price
                if(filter.priceFrom >= filter.priceTo){
                    setError('Kaina iki turi būti aukštesnė už kainą nuo');
                    return;
                } 
                
                oc.form={valid:true};
                
                orderSer.addFilterToBasket(filter);

                // create new filter
                

                oc.filter = {
                    providers: angular.copy(filter.providers),
                }
                   
                countFilterPrice();
            
                form.$setUntouched();
            } else {

               if(form.$valid){
                   setError('pasirinkite puslapius.');
               }else{
                    setError('* laukai yra privalomi.');
               }
            }
        }
        
        oc.startOrder = function(ev){
            console.log('startOrder',oc.order);
            console.log("LogedIn?",authSer.isLoggedIn());
            if(!authSer.isLoggedIn()){
                dialogsSer.openLoginDialog(ev, true);
            }else{
                dialogsSer.openOrderDialog(ev);
            }

        }


    }

})();

