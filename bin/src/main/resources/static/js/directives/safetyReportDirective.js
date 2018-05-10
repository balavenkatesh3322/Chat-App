app.directive('validPositiveNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9\.]/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

app.directive('chosen', function($timeout) {
    var linker = function(scope, element, attr) {
        // update the select when data is loaded
        scope.$watchCollection(attr.chosen, function(newVal, oldVal) {
          $timeout(function() {
        	  
            element.trigger('chosen:updated');
          });
        });

        // update the select when the model changes
        scope.$watchCollection(attr.ngModel, function() {
          $timeout(function () {
            element.trigger('chosen:updated');
          });
        });
        element.chosen();
    };

    return {
        restrict: 'A',
        link: linker
    }
});


//app.directive('fileModel', ['$parse', function ($parse) {
//    return {
//        restrict: 'A',
//        link: function (scope, element, attrs) {
//            var model = $parse(attrs.fileModel);
//            var isMultiple = attrs.multiple;
//            var modelSetter = model.assign;
//            element.bind('change', function () {
//                var values = [];
//                angular.forEach(element[0].files, function (item) {
//                    var value = {
//                       // File Name 
//                        name: item.name,
//                        //File Size 
//                        size: item.size,
//                        //File URL to view 
//                        url: URL.createObjectURL(item),
//                        // File Input Value 
//                        _file: item
//                    };
//                    values.push(value);
//                });
//                scope.$apply(function () {
//                    if (isMultiple) {
//                        modelSetter(scope, values);
//                    } else {
//                        modelSetter(scope, values[0]);
//                    }
//                });
//            });
//        }
//    };
//} ]);

app.directive('signature', function($compile){
    return {
        template: '<div style="width:100%; height:100%;" ng-click="start()"tabindex="0" ng-blur="capture()"><canvas name="SigImg" id="{{sigId}}" style="height:100%; width:100%; background: #ebebe4;"></canvas><br/></div>', 
        restrict: 'E',
        scope:{imageName:'@', callbackFn: '&', sigId: '@', sigId2: '@', value: '@'},   
        link:function postLink(scope, element, attrs){
            var ctx;
            var tmr;
            scope.start = function(){
             document.getElementById(scope.sigId2).style.border = "2px solid #336699";
             if (!ctx){
              ctx = document.getElementById(scope.sigId).getContext('2d');
             }
             element.find('canvas')[0].focus();
             SetDisplayXSize( 500 );
             SetDisplayYSize( 100 );
             SetTabletState(0, tmr);
             SetJustifyMode(0);
             ClearTablet();
             tmr = SetTabletState(1, ctx, 50);
            }
            scope.capture = function(){
             document.getElementById(scope.sigId2).style.border = "1px solid #c0c0c0";
             if(NumberOfTabletPoints() != 0){
                  SetSigCompressionMode(1);
                  SetImageXSize(500);
                  SetImageYSize(100);
                  SetImagePenWidth(5);
                  GetSigImageB64(function(str){
                   var blob = new Blob([str], {type: 'image/png'});
                   var file = new File([blob], scope.imageName);
                   console.log(str, file);
                   scope.callbackFn({arg1: str, arg2: file, arg3: scope.sigId2});
                  });
             }
            }
        }
    };
});

