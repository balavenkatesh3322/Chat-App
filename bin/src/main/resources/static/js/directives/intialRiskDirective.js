//assesmentDirective.js
// custom directive for loading packages
angular.module('customDirectives')
	.controller('intialRiskDirectiveController', ['$scope','$rootScope', function($scope, $rootScope) {
	
		var hazardItem = {
		}
		 
		$rootScope.riskContentItem.initialRskList  = [{
			hazardno:'',
			activity:'',
			effectOfHazard:'',
			controlMeasure: '',
			frequency:'',
			consequence:'',
			risk:'',
			riskId:''			
		}];
		
		// add new hazardItem
		$scope.addHazardItem = function($event){
			$rootScope.riskContentItem.initialRskList.push(hazardItem);
			
		};
		
		// remove Item from list
		$scope.removeHazardItem = function(hazardItem){
			 var index = $rootScope.riskContentItem.initialRskList.indexOf(hazardItem);
				 if($rootScope.riskContentItem.initialRskList.length > 1){
					 $rootScope.riskContentItem.initialRskList.splice(index, 1);     
				 }
		};
		
		// update 
		$scope.calculateRisk = function(hazardItem){
			if(hazardItem.frequency != undefined && hazardItem.consequence != undefined){
				if(hazardItem.frequency!=='N/A' && hazardItem.frequency!=='' && hazardItem.consequence!=='N/A' && hazardItem.consequence!==''){
					hazardItem.risk = parseInt(hazardItem.frequency) * parseInt(hazardItem.consequence);
				}
				else{
					hazardItem.risk = '';
				}
			}else {
				hazardItem.risk = '';
			}
			
		};
	}])
	.directive('intialRiskDirective', function() {
  return {
    templateUrl: 'intialRiskDirectiveTemplate.html'
  };
});

