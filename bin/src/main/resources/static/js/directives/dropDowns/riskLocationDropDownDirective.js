//riskLocationDropDownDirective.js

angular.module('customDirectives')
	.controller('riskLocationDropDownDirectiveController', ['$scope','$rootScope','$http','riskAssessmentDataService', function($scope,$rootScope,$http,riskAssessmentDataService) {
		
		riskAssessmentDataService.getLocationList($http,function(data){
			var _index = 0;
			$scope.locationList = data;
			if($rootScope.isNew){
				$scope.selectedLocation = data[0];
			} else {
			//	$scope.selectedLocation = data[0];
				setTimeout(function(){
					console.log($rootScope.riskContentItem.riskMaster.locationcode);
					for(var i = 0; i<data.length;i++){
						if(data[i].loccode ==$rootScope.riskContentItem.riskMaster.locationcode ){
							$scope.selectedLocation = data[i];
							$rootScope.$digest();
							return false;
						}
					}				
				},1000)
			}
				
			
			setTimeout(function(){
				initMultiSelection();
				setTimeout(function(){
					$('#riskLocation_chosen .chosen-drop ul.chosen-results').unbind("click");
					$('#riskLocation_chosen .chosen-drop ul.chosen-results').bind("click",function(){
					$('#riskLocation_chosen').find('ul.chosen-results li.active-result.result-selected').each(function(index,data){
						 _index = parseInt($(this).attr('data-option-array-index'));
					});
					$rootScope.riskContentItem.riskMaster.locationcode = data[_index].loccode;
					});
					
					if(!$rootScope.riskContentItem.riskMaster.locationcode){
						$rootScope.riskContentItem.riskMaster.locationcode = data[_index].loccode;
					} else {
						setTimeout(function(){
							$('#riskLocation_chosen').trigger("click")
							$('#riskLocation_chosen .chosen-drop ul.chosen-results li.active-result').each(function(index,data){
								 _index = parseInt($(this).attr('data-option-array-index'));
								 if(data[_index].loccode == $rootScope.riskContentItem.riskMaster.locationcode){
									 $(this).addClass('result-selected');
									 false;
								 }
							});
						}, 500)
						
					}
					
				}, 1000)
			}, 500)
		});
		
	
		$scope.updateLocation = function (){
				$rootScope.riskContentItem.riskMaster.locationCode = $scope.selectedLocation.loccode;
		};
		
	}])
	.directive('riskLocationDropDownDirective', function() {
  return {
    templateUrl: 'templates/dropDowns/riskLocationDropDownDirectiveTemplate.html'
  };
});

