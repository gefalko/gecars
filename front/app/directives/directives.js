
(function(){

    angular.module('gecar').directive('compareTo', compareTo);

    function compareTo() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {
                 
                ngModel.$validators.compareTo = function(modelValue) {
 
                    console.log("compare:",modelValue,scope.otherModelValue);
                    return modelValue == scope.otherModelValue;
                };
     
                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    };
})();

(function(){

    console.log("Init directive getest");

    angular.module('gecar').directive('uniqueEmail', uniqueEmail);

    uniqueEmail.$inject = ['authSer'];

    function uniqueEmail(authSer) {
        console.log("getest");
        return {
            restric: 'A',
            require: "ngModel",
            link : function(scope, elem, attr, ngModel){
                ngModel.$asyncValidators.emailExist = function(email){
                    return new Promise(function (resolve,reject){
                        
                        authSer.orUserExist(email).then(function(orExist){
                            
                            if(orExist)reject();
                            else resolve();
                            
                        }).catch(function(error){
                            console.log("Error :",error);
                            reject();
                        });
                    });
                }

            }
            
    };
   }
})();

