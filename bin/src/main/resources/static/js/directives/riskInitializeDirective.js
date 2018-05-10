//riskInitializeDirectiveController.js
angular.module('customDirectives')
	.controller('riskInitializeDirectiveController', ['$scope','$rootScope','$http','riskAssessmentDataService', function($scope,$rootScope,$http,riskAssessmentDataService) {
		$rootScope.isEditable = false;
		$rootScope.rskMasterUpdateUrl = "/v1/saveriskassessmentcompositeform";
		
		$scope.riskLevelTwo = "N/A";
		$scope.risk = "N/A";
			
		var initialRiskItem = {};
		var existingControlmeasureObj ={
				controltype:'Section1',
				controlmeasure:''
		};
		var additionalControlMeasureObj = {
				controltype:'Section2',
				controlmeasure:''
		};
		//$rootScope.globalHazrdList = {};
		$rootScope.hazardItemList = [];
		
			
		$scope.addFirstExistingControlMeasure = function(){
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber] && $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures) {
				if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.length == 0){
					$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].hazardno = $rootScope.currentHazardNumber;
					existingControlmeasureObj.hazardno = $rootScope.currentHazardNumber;
					$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.push(existingControlmeasureObj);
				}
			} else {
				var obj  = $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber];
				obj.hazardno = $rootScope.currentHazardNumber;
				obj.existingControlMeasures = [];
				obj.additionalControlMeasures = [];
				var newExistingControlMeasure = angular.copy(obj);
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.push(newExistingControlMeasure);
			}
			
			
		};
		
		$scope.addExistingControlMeasure = function(){
			var newExistingControlMeasure = angular.copy(existingControlmeasureObj);
			
			newExistingControlMeasure.hazardno = $rootScope.currentHazardNumber;
			newExistingControlMeasure.controlmeasure = '';
			
			console.log("ADD THE VALUE--->",  $rootScope.currentHazardNumber, newExistingControlMeasure);
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]){
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.push(newExistingControlMeasure);
			}
		};
		
		$scope.removeControlMeasure = function(index){
			//if(index !=0){
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.splice(index,1);
			//}
		}
		
		$scope.addFirstAdditionalControlMeasure = function(){
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.length == 0){
				additionalControlMeasureObj.hazardno = $rootScope.currentHazardNumber;
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.push(additionalControlMeasureObj);
			}
		};
		
		$scope.addAdditionalControlMeasure = function(){
			var newAdditionalControlMeasure = angular.copy(additionalControlMeasureObj);
			newAdditionalControlMeasure.hazardno = $rootScope.currentHazardNumber;
			newAdditionalControlMeasure.controlmeasure='';
			$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.push(newAdditionalControlMeasure);
			
		}
		
		$scope.removeAdditionalControlMeasure = function(index){
			//if(index !=0){
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.splice(index,1);
			//}
		}
		// not new form 
		if(!$rootScope.isNew)
		{
			
		}
		
		riskAssessmentDataService.getActiveHazardList($http,function(data){
			var _index = 0;
			$scope.activeHazardList = data;
			//$scope.selectedHazard =  data[0];	
			$scope.updateHazardItem(data);
		});
		
		$scope.updateHazardItem = function(data){
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]){
				for(var i = 0; i<data.length;i++){
					if(data[i].hazardcode == $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].hazardcode ){
						$scope.selectedHazard =  data[i];	
					}
				}
			}
		}
		
		$scope.updateHazardItemCode = function (){
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].hazardcode = $scope.selectedHazard.hazardcode;
		}
		
		
		riskAssessmentDataService.getActiveHazardEffectList($http,function(data){
			var _index = 0;
			$scope.activeHazardEffectList = data;
			//$scope.selectedHazardEffect =  data[0];
			$scope.updateHazardEffItem(data);
			
		});
		
		$scope.updateHazardEffItem = function (data){
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]){
				if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]){
					for(var i = 0; i<data.length;i++){
						if(data[i].effhazardcode == $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].effhazardcode ){
							$scope.selectedHazardEffect =  data[i];	
						}
					}
				}
				
			}
		}
		$scope.updateHazardEffectItem = function (){
		//	rskInitItem.rskinitialrisk.effhazardcode  = $scope.selectedHazardEffect.effhazardcode;
			$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].effhazardcode = $scope.selectedHazardEffect.effhazardcode;
		}
		
		$rootScope.addCurrentItem = function() {
			if(!$rootScope.validateForm()) {
				return false;
			} else {
				var error = "";
				var emptyRiskList = true;
				angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
					var obj = angular.copy(value);
					console.log("OBJECT-->", obj);
					console.log("OBJECT-INNER->", obj.existingControlMeasures);
					if(obj.existingControlMeasures.length == 0 || obj.activity.length==0) {
						emptyRiskList = true;
					} else {
						if(obj.existingControlMeasures[0]){
							
							if(obj.existingControlMeasures[0].frequency == 'N/A' || obj.existingControlMeasures[0].consequence == 'N/A' || obj.existingControlMeasures[0].risklevel == 'N/A' || obj.existingControlMeasures[0].controlmeasure =='' ||!obj.existingControlMeasures[0].frequency ||!obj.existingControlMeasures[0].consequence||!obj.existingControlMeasures[0].risklevel) {
								error += "equiperror";
								emptyRiskList = true;
							} else {
								emptyRiskList = false;
								error = '';
							}
						}						
					}
					
				});
				
				if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]) {
					var existingControlMeasures = $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[0];
					if(existingControlMeasures) {
						if(existingControlMeasures.risklevel == 'Very High' || existingControlMeasures.risklevel == 'High'){
							var additionalControlMeasures = $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures[0];
							
							console.log($scope.riskLevelTwo  , "additionalControlMeasures--->", additionalControlMeasures);
							if(!additionalControlMeasures || !additionalControlMeasures.controlmeasure || additionalControlMeasures.risklevel === 'N/A' || $scope.riskLevelTwo === undefined) {
								alert("Please fill addtional Risk");
								return false;
							}
							
						}
					} 
					
					else {
						alert("Please fill existing Risk --- thsi one ");
						return false;
					}
				}
				
				if(error.length>0){
					console.log("HERE--------->", error);
					alert("Some field/fields is missing");
					return false;
				}
				
				if(!emptyRiskList) {
				
				var hazardItem = {};
				
				var emptyRiskList = true;
				$rootScope.currentHazardNumber = $rootScope.hazardItemList.length ==0?1:$rootScope.hazardItemList[$rootScope.hazardItemList.length-1].hazardno;
				angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
						$rootScope.currentHazardNumber = key;
						emptyRiskList = false;
				});
				
				
			   var newObject = angular.copy($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]);
	            $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber] = angular.copy(newObject);
	           
	            hazardItem.hazardno = $rootScope.currentHazardNumber;
	            $rootScope.currentHazardNumber++;
				
				hazardItem.activity = newObject.activity;
				hazardItem.hazardcode = newObject.hazardcode;
				hazardItem.existingControlMeasures = angular.copy(newObject.existingControlMeasures[0]);
				hazardItem.additionalControlMeasures = angular.copy(newObject.additionalControlMeasures[0]);
				
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber] = angular.copy(newObject);
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].hazardno = $rootScope.currentHazardNumber;
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].activity ="";
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].hazardcode =  "";
				$scope.selectedHazard = {};
				$scope.selectedHazardEffect = {};
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].effhazardcode = "";
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures = [];
				
				var existingControlmeasureObjCopy = angular.copy(existingControlmeasureObj);
				existingControlmeasureObjCopy.controlmeasure = '';
				existingControlmeasureObjCopy.risklevel="N/A";
				existingControlmeasureObjCopy.frequency="N/A";
				existingControlmeasureObjCopy.consequence="N/A";
				$('#initalRiskLevel1').val('N/A');
				$('#initalRiskLevel2').val('N/A');
				$scope.risk = "N/A"
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.push(existingControlmeasureObjCopy);
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures = [];
				
				var additionalControlMeasureObjCopy = angular.copy(additionalControlMeasureObj);
				additionalControlMeasureObjCopy.controlmeasure = '';
				additionalControlMeasureObjCopy.risklevel='N/A';
				additionalControlMeasureObjCopy.frequency='N/A'
				additionalControlMeasureObjCopy.consequence='N/A';
				$('#riskControlLevel1').val('N/A');
				$('#riskControlLevel2').val('N/A');
				$scope.riskLevelTwo = "N/A"
				$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.push(additionalControlMeasureObjCopy);
				
				$rootScope.hazardItemList.push(hazardItem);
				}
			}
		}
		
		
		
		
		
		
	 
	    $rootScope.editHazardItem = function(index){
	    	$rootScope.currentHazardNumber = parseInt(index);
	    	$rootScope.isEditable = true;
	    	$scope.updateHazardItem($scope.activeHazardList);
	    	$scope.updateHazardEffItem($scope.activeHazardEffectList);
	    	
	    	console.log("HERE IN THE UPDATE SECTION----->", $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[0]);
	    	
	    	$('#initalRiskLevel1').val($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[0].consequence);
			$('#initalRiskLevel2').val($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[0].frequency);
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.length>0){
				$('#riskControlLevel1').val($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures[0].consequence);
				$('#riskControlLevel2').val($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures[0].frequency);
				
			}
			
	    }
		
	    $rootScope.updateHazardItem = function(index){
	    	var hazardItem = {};
			var newObject = angular.copy($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]);
			hazardItem.hazardno = $rootScope.currentHazardNumber;
			hazardItem.activity = newObject.activity;
			hazardItem.hazardcode = newObject.hazardcode;
			hazardItem.existingControlMeasures = angular.copy(newObject.existingControlMeasures[0]);
			hazardItem.additionalControlMeasures = angular.copy(newObject.additionalControlMeasures[0]);
			$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber] = angular.copy(newObject);
			$rootScope.hazardItemList = [];
			angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
					var hazardItem = {};
					if(value.activity !=""){
						var obj = angular.copy(value);
						hazardItem.activity = obj.activity;
						hazardItem.hazardcode = obj.hazardcode;
						hazardItem.hazardno  = obj.hazardno;
						hazardItem.existingControlMeasures = obj.existingControlMeasures[0];
						hazardItem.additionalControlMeasures = obj.additionalControlMeasures[0];
						$rootScope.hazardItemList.push(hazardItem);
					}
					
				});
			$rootScope.currentHazardNumber = $rootScope.currentHazardNumber+1;
	    	$rootScope.isEditable = false;
	    	
	    	$scope.selectedHazard = {};
			$scope.selectedHazardEffect = {};
			$('#initalRiskLevel1').val('N/A');
			$('#initalRiskLevel2').val('N/A');
			$('#riskControlLevel1').val('N/A');
			$('#riskControlLevel2').val('N/A');
		
	    }
	    
	    $rootScope.cancelUpdate = function(index){
	    	$rootScope.currentHazardNumber = $rootScope.currentHazardNumber++;
	    	$rootScope.isEditable = false;
	    	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber] = {
	    			existingControlMeasures:[],
					additionalControlMeasures:[]
	    	};
	    	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].hazardno = existingControlmeasureObj.hazardno = $rootScope.currentHazardNumber;
			$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.push(existingControlmeasureObj);
			additionalControlMeasureObj.hazardno = $rootScope.currentHazardNumber;
			$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.push(additionalControlMeasureObj);
	    	$scope.selectedHazard = {};
			$scope.selectedHazardEffect = {};
			$('#initalRiskLevel1').val('N/A');
			$('#initalRiskLevel2').val('N/A');
			$('#riskControlLevel1').val('N/A');
			$('#riskControlLevel2').val('N/A');
	    }
	    
	    // remove hazrditem + controlItem
	    $rootScope.removeHazardItem = function(index){
	    	$rootScope.hazardItemList = [];
	    	delete $rootScope.riskContentItem.initialRskList[index+1]
	    	angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
				var hazardItem = {};
				var obj = angular.copy(value);
				hazardItem.activity = obj.activity;
				hazardItem.hazardcode = obj.hazardcode;
				hazardItem.hazardno  = obj.hazardno;
				hazardItem.existingControlMeasures = obj.existingControlMeasures[0];
				hazardItem.additionalControlMeasures = obj.additionalControlMeasures[0];
				if(obj.activity.length>0){
					$rootScope.hazardItemList.push(hazardItem);
				}

			});
	    	
	    	//$rootScope.hazardItemList.splice(index,1);
			}
	    
	    $rootScope.enableSave = function (){
	    	return $rootScope.hazardItemList.length>0;
	    }
	    
		$scope.calculateInitialRisk = function (id, id1, tdid) {
			$scope.addFirstExistingControlMeasure();
            var freq = $('#' + id).val();
            var cons= $('#' + id1).val();
            
            $scope.risk = "N/A";
            if (freq== 'N/A' || cons == 'N/A') {
                $('#' + tdid).val("N/A");
                $('#' + tdid).removeClass("bg-success");
                $('#' + tdid).removeClass("bg-info");
                $('#' + tdid).removeClass("bg-warning");
                $('#' + tdid).removeClass("bg-danger");
                $('#' + tdid).css({"background-color": "white", "color": "black"});
            } else {
                if ((freq == '1' && cons == '1') || (freq == '1' && cons == '2') || (freq == '2' && cons == '1')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.risk = "Very Low";
                    $('#' + tdid).addClass("bg-success");
                } else if ((cons == '1' && freq == '3') || (cons == '1' && freq == '4')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.risk = "Low";
                    $('#' + tdid).addClass("bg-info");
                } else if ((cons == '2' && freq == '2')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.risk = "Medium";
                    $('#' + tdid).css({"background-color": "#efde73", "color": "white"});
                } else if ((cons == '2' && freq == '3') || (cons == '3' && freq == '1')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.risk = "High";
                    $('#' + tdid).addClass("bg-warning");
                } else if ((cons == '2' && freq  == '4') || (cons == '3' && freq  == '2') || (cons == '3' && freq  == '3') || (cons == '3' && freq == '4')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.risk = "Very High";
                    $('#' + tdid).addClass("bg-danger");
                }
            }
           
            for(var i = 0;i< $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures.length;i++){
            	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[i].risklevel = $scope.risk;
            	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[i].frequency  = freq ;
            	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures[i].consequence = cons;
            }
            
            
            $scope.$apply();
        }
		
		$scope.calculateRiskControlLevel = function (id, id1, tdid) {
			$scope.addFirstAdditionalControlMeasure();
             var freq = $('#' + id).val();
            var cons = $('#' + id1).val();
            $scope.riskLevelTwo = 'N/A';
            if (freq == 'N/A' || cons == 'N/A') {
                $('#' + tdid).val("N/A");
                $('#' + tdid).removeClass("bg-success");
                $('#' + tdid).removeClass("bg-info");
                $('#' + tdid).removeClass("bg-warning");
                $('#' + tdid).removeClass("bg-danger");
                $('#' + tdid).css({"background-color": "white", "color": "black"});
            } else {
            	if ((freq == '1' && cons == '1') || (freq == '1' && cons == '2') || (freq == '2' && cons == '1')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.riskLevelTwo = "Very Low";
                    $('#' + tdid).addClass("bg-success");
            	} else if ((cons == '1' && freq == '3') || (cons == '1' && freq == '4')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.riskLevelTwo = "Low";
                    $('#' + tdid).addClass("bg-info");
            	} else if ((cons == '2' && freq == '2')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.riskLevelTwo = "Medium";
                    $('#' + tdid).css({"background-color": "#efde73", "color": "white"});
            	} else if ((cons == '2' && freq == '3') || (cons == '3' && freq == '1')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.riskLevelTwo = "High";
                    $('#' + tdid).addClass("bg-warning");
            	} else if ((cons == '2' && freq  == '4') || (cons == '3' && freq  == '2') || (cons == '3' && freq  == '3') || (cons == '3' && freq == '4')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $scope.riskLevelTwo = "Very High";
                    $('#' + tdid).addClass("bg-danger");
                }
            }
            
            var value2 = $('#fa_health').val();
            if (value2 == 'Very High' || value2 == 'High') {
                $('#showfields').show();
                $('#showfields1').show();
                $('#showfields2').show();
                $('#showfields3').show();
				$('#approvebutton').show();
                $('#approvebuttononhigh').hide();
                $('#sendbuttonon').show();

            } else if (value2 == 'Very Low' || value2 == 'Medium' || value2 == 'Low') {
                $('#showfields').hide();
                $('#showfields1').hide();
                $('#showfields2').hide();
                $('#showfields3').hide();
				$('#approvebutton').hide();
                $('#approvebuttononhigh').show();
                $('#sendbuttonon').hide();
            }
            
            for(var i = 0;i< $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures.length;i++){
            	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures[i].risklevel = $scope.riskLevelTwo;
            	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures[i].frequency  = freq;
            	$rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures[i].consequence = cons;
            	
            	
            }
            
             $scope.$apply();
        }
	}])
	.directive('riskInitializeDirective', function() {
		
  return {
	  link: function($scope,$rootScope, element, attrs) {
		  (function init() {
			 
			  
			  //riskContentItem.initialRskList[currentHazardNumber].existingControlMeasures[0].frequency
		  })();
      },
    templateUrl: 'templates/riskInitialize/riskInitilaize.html'
  };
});

