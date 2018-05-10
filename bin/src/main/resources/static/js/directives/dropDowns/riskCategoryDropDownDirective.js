//riskCategoryDropDownDirective.js

angular.module('customDirectives')
	.controller('riskCategoryDropDownDirectiveController', ['$scope','$rootScope','$http','riskAssessmentDataService', function($scope,$rootScope,$http,riskAssessmentDataService) {

		riskAssessmentDataService.getCategoryList($http,function(data){
			var _index = 0;
			$scope.categoryList = data;
			if($rootScope.isNew){
				$scope.selectedCategory =  data[0];
			} else {
				setTimeout(function(){
					console.log($rootScope.riskContentItem.riskMaster.categorycode);
					for(var i = 0; i<data.length;i++){
						if(data[i].catcode ==$rootScope.riskContentItem.riskMaster.categorycode ){
							$scope.selectedCategory = data[i];
							$rootScope.$digest();
							false;
						}
					}
					
				},1000)
				
					
			}
			/*
			setTimeout(function(){
				//initMultiSelection();
				setTimeout(function(){
					$('#riskCategory_chosen .chosen-drop ul.chosen-results').unbind("click");
					$('#riskCategory_chosen .chosen-drop ul.chosen-results').bind("click",function(){
					$('#riskCategory_chosen').find('ul.chosen-results li.active-result.result-selected').each(function(index,data){
						 _index = parseInt($(this).attr('data-option-array-index'));
						//alert(_index);
						//return false;
					});
					$rootScope.riskContentItem.riskMaster.categorycode = data[_index].catcode;
					});
					
					$rootScope.riskContentItem.riskMaster.categorycode = data[_index].catcode;
				}, 1000)
			}, 500)*/
			//initMultiSelection();
		});
		
		$scope.updateCategory = function (){
		//	$rootScope.riskCategory  = $rootScope.selectedCategory;
			$rootScope.riskContentItem.riskMaster.categorycode = $scope.selectedCategory.catcode;
		}
		
		/*$scope.initCategory = function(){
			$rootScope.selectedCategory = 
		}*/
		
		
	}])
	.directive('riskCategoryDropDownDirective', function() {
  return {
	  templateUrl: 'templates/dropDowns/riskCategoryDropDownDirectiveTemplate.html'
  };
});

