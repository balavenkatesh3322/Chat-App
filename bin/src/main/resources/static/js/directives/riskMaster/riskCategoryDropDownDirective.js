//riskCategoryDropDownDirective.js

angular.module('customDirectives')
	.controller('riskCategoryDropDownDirectiveController', ['$scope','$rootScope','riskCategoryDropDownService', function($scope,$rootScope,riskCategoryDropDownService) {

		$scope.categoryList = riskCategoryDropDownService.getRiskCategoryDropDownItems();
		
		$scope.selectedCategory =  $scope.categoryList[0];
		
		$scope.updateCategory = function (){
			$rootScope.riskCategory  = $scope.selectedCategory.trim();
		}
	}])
	.directive('riskCategoryDropDownDirective', function() {
  return {
    templateUrl: 'riskMasterViews/riskCategoryDropDownDirectiveTemplate.html'
  };
});

