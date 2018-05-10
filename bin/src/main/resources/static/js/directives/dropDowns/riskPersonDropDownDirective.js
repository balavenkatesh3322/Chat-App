//riskPersonDropDownDirective.js

angular.module('customDirectives')
	.controller('riskPersonDropDownDirectiveController', ['$scope','$rootScope','$http','riskAssessmentDataService', function($scope,$rootScope,$http,riskAssessmentDataService) {

		
		riskAssessmentDataService.getPersonList($http,function(data){
			var _index = 0;
			$scope.personList = data;
			if($rootScope.isNew){
				$scope.selectedPerson = data[0];
			} else {
				setTimeout(function(){
					console.log($rootScope.riskContentItem.riskMaster.headrankcode);
					for(var i = 0; i<data.length;i++){
						if(data[i].rankcode ==$rootScope.riskContentItem.riskMaster.personsrankcode ){
							$scope.selectedPerson = data[i];
							$rootScope.$digest();
							return false;
						}
					}
					
				},1000)
			}
			setTimeout(function(){
				initMultiSelection();
				setTimeout(function(){
					$('#riskPerson_chosen .chosen-drop ul.chosen-results').unbind("click");
					$('#riskPerson_chosen .chosen-drop ul.chosen-results').bind("click",function(){
					$('#riskPerson_chosen').find('ul.chosen-results li.active-result.result-selected').each(function(index,data){
						 _index = parseInt($(this).attr('data-option-array-index'));
					});
					$rootScope.riskContentItem.riskMaster.personsrankcode = data[_index].rankcode;
					});
					
					$rootScope.riskContentItem.riskMaster.personsrankcode = data[_index].rankcode;
				}, 1000)
				
			}, 500)
		});
		
		$scope.updateRiskPerson= function (){
			
			$rootScope.riskContentItem.riskMaster.personsrankcode  = $scope.selectedPerson.rankcode;
		}
	
	}])
	.directive('riskPersonDropDownDirective', function() {
  return {
    templateUrl: 'templates/dropDowns/riskPersonDropDownDirectiveTemplate.html'
  };
});

