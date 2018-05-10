//companyCommentDirectiveController.js
app
	.controller('companyCommentDirectiveController', ['$scope','$rootScope', function($scope,$rootScope) {
	
		
	}])
	.directive('companyCommentDirective', function() {
		
  return {
	  link: function($scope, element, attrs) {
		  (function init() {
		        // load data, init scope, etc.
			initMultiSelection();
		    })();
      },
    templateUrl: 'templates/companyComment/companyComment.html'
  };
});

