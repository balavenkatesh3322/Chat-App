//jobCompletionDirective.js
angular.module('customDirectives')
	.controller('jobCompletionDirectiveController', ['$scope','$rootScope', function($scope,$rootScope) {

		/*$scope.selectJobStartDate  = function (jobcommencedate){
			alert(jobcommencedate);
		};*/
		
		$scope.showtextradio = function(value,text){
			alert(value);
			if(value == 'Y'){
				$rootScope.riskContentItem.riskMaster.isAdequate = "Y";
			}else {
				$rootScope.riskContentItem.riskMaster.isAdequate = "N";
			}
		
		}
	}])
	.directive('jobCompletionDirective', function() {
  return {
    templateUrl: 'templates/completionJob/jobCompletion.html'
  };
});

