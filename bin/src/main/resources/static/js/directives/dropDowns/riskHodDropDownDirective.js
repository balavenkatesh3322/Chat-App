//riskHoDDropDownDirective.js

angular.module('customDirectives')
	.controller('riskHodDropDownDirectiveController', ['$scope', '$rootScope','$http','riskAssessmentDataService', function($scope,$rootScope,$http,riskAssessmentDataService) {

		riskAssessmentDataService.getPersonList($http,function(data){
			var _index =0;
			$scope.hodList = data;
			if($rootScope.isNew){
				$scope.selectedHoD = data[0];
			} else {
				setTimeout(function(){
					console.log($rootScope.riskContentItem.riskMaster.headrankcode);
					for(var i = 0; i<data.length;i++){
						if(data[i].rankcode ==$rootScope.riskContentItem.riskMaster.headrankcode ){
							//$('#riskHod_chosen .chosen-single.chosen-default span').html(data[i].rankname);
							$scope.selectedHoD = data[i];
							$rootScope.$digest();
							return false;
						}
					}
					
				},1000)
			}
			
			setTimeout(function(){
				initMultiSelection();
				setTimeout(function(){
					$('#riskHod_chosen .chosen-drop ul.chosen-results').unbind("click");
					$('#riskHod_chosen .chosen-drop ul.chosen-results').bind("click",function(){
					$('#riskHod_chosen').find('ul.chosen-results li.active-result.result-selected').each(function(index,data){
						 _index = parseInt($(this).attr('data-option-array-index'));
					});
					$rootScope.riskContentItem.riskMaster.headrankcode = data[_index].rankcode;
					});
					
					$rootScope.riskContentItem.riskMaster.headrankcode = data[_index].rankcode;
				}, 1000)
			}, 500)
		});
		
		$scope.updateHod = function (){
			$rootScope.riskContentItem.riskMaster.headrankcode  = $scope.selectedHoD.rankcode;
		};
		
	}])
	.directive('riskHodDropDownDirective', function() {
  return {
    templateUrl: 'templates/dropDowns/riskHodDropDownDirectiveTemplate.html'
  };
});

