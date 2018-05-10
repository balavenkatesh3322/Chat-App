//riskControlDirectiveController.js
angular.module('customDirectives')
	.controller('riskControlDirectiveController', ['$scope','$rootScope', function($scope,$rootScope) {
	
		
	}])
	.directive('riskControlDirective', function() {
		
  return {
	  link: function($scope, element, attrs) {
		  (function init() {
		        // load data, init scope, etc.
			initMultiSelection();
		    })();
      },
    templateUrl: 'templates/riskControl/riskControl.html'
  };
});

