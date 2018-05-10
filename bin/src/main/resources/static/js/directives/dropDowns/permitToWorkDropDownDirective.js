//permitToWorkDropDownDirective.js

angular.module('customDirectives')
	.controller('permitToWorkDropDownDirectiveController', ['$scope','$rootScope','$http','riskAssessmentDataService', function($scope,$rootScope,$http,riskAssessmentDataService) {

		riskAssessmentDataService.getPermitToWorkList($http,function(data){
			$rootScope.riskContentItem.riskMaster.permitcode = "";
			var _index = 0;
			$scope.permitToWorkList = data;
			
			if($rootScope.isNew){
				$scope.selectedPermit =  data[0];
			} else {
				setTimeout(function(){
					console.log($rootScope.riskContentItem.riskMaster.permitcode);
					for(var i = 0; i<data.length;i++){
						if(data[i].permitcode ==$rootScope.riskContentItem.riskMaster.permitcode ){
							//$('#permitToWork_chosen ul.chosen-choices li.search-field input').val(data[i].permitname);
							$scope.selectedPermit =  data[i];
							$rootScope.$digest();
							return false;
						}
					}
					
				},1000)
			}
			
			setTimeout(function(){
				initMultiSelection();
				setTimeout(function(){
					$('#permitToWork_chosen ul.chosen-choices').unbind("click");
					$('#permitToWork_chosen ul.chosen-choices').bind("click",function(){
				    $('#permitToWork_chosen ul.chosen-choices li.search-choice a').each(function(){
						 _index = parseInt($(this).attr('data-option-array-index'));
						 $rootScope.riskContentItem.riskMaster.permitcode += data[_index].permitcode +",";
					});
					
					});
					
					//$rootScope.riskMaster.permitcode = data[_index].permitcode;
				}, 1000)
			}, 500)
			//initMultiSelection();
		});
		
		$scope.updatePermitWork = function (){
			$rootScope.riskContentItem.riskMaster.permitcode  = $scope.selectedPermit.permitcode;
		}
	}])
	.directive('permitToWorkDropDownDirective', function() {
  return {
	  templateUrl: 'templates/dropDowns/permitToWorkDropDownDirectiveTemplate.html'
  };
});

