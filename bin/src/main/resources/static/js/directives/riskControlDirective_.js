//assesmentDirective.js
// custom directive for loading packages
app
	.controller('riskControlDirectiveController', ['$scope','$rootScope', function($scope,$rootScope) {
	
		var controlItem = {
		};
		$rootScope.riskContentItem.controlRiskList = [{
			hazardNo:'',
			controlType:'',
			controlMeasure:'',
			frequency: '',
			consequence:'',
			riskLevel:'',
			targetDate:'',
			rskId:''
		}];
		
		// add new hazardItem
		$scope.addControlItem = function($event){
			$rootScope.riskContentItem.controlRiskList.push(controlItem);
		};
		
		// remove Item from list
		$scope.removeControlItem = function(controlItem){
			 var index = $rootScope.riskContentItem.controlRiskList.indexOf(controlItem);
				 if($rootScope.riskContentItem.controlRiskList.length > 1){
					 $rootScope.riskContentItem.controlRiskList.splice(index, 1);     
				 }
		};
		
		$scope.calculateRiskControl = function(controlAction){
			if(controlAction.frequency != undefined && controlAction.consequence != undefined){
			if(controlAction.frequency!=='N/A' && controlAction.frequency!=='' && controlAction.consequence!=='N/A' && controlAction.consequence!==''){
				controlAction.riskLevel = parseInt(controlAction.frequency) * parseInt(controlAction.consequence);
			}
			else{
				controlAction.riskLevel = '';
			}
			}else {
				controlAction.riskLevel = '';
			}
		};
		
	}])
	.directive('riskControlDirective', function() {
  return {
    templateUrl: 'riskControlDirectiveTemplate.html'
  };
});

