//riskHoDDropDownDirective.js

angular.module('customDirectives')
	.controller('riskHodDropDownDirectiveController', ['$scope', '$rootScope','$http','riskHodDropDownService', function($scope,$rootScope,$http,riskHodDropDownService) {

		riskHodDropDownService.getRiskHodList($http,function(data){
			$scope.hodList = data;
			$scope.selectedHoD = data[0];
		});
		
		$scope.updateHod = function (){
			$rootScope.riskContentItem.riskMaster.headRank  = $scope.selectedHoD.trim();
		};
		
	}])
	.directive('riskHodDropDownDirective', function() {
  return {
    templateUrl: 'riskMasterViews/riskHodDropDownDirectiveTemplate.html'
  };
});

