//approvalProcessDirectiveController.js
app
	.controller('approvalProcessDirectiveController', ['$scope','$rootScope', function($scope,$rootScope) {
	
		
	}])
	.directive('approvalProcessDirective', function() {
		
  return {
	  link: function($scope, element, attrs) {
		  (function init() {
		        // load data, init scope, etc.
			initMultiSelection();
		    })();
      },
    templateUrl: 'templates/approvalProcess/approvalProcess.html'
  };
});

