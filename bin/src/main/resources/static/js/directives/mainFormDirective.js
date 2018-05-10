//mainFormDirective.js
angular.module('customDirectives',[])
	.controller('mainFormDirectiveController', ['$scope','$rootScope','$http','riskAssessmentDataService','riskContentItemService', function($scope,$rootScope,$http,riskAssessmentDataService,riskContentItemService) {
		// initilaize main rskItem to be saved
		$rootScope.addDisabled = true;
		$rootScope.riskContentItem = {};
		$rootScope.riskContentItem.rskwfHistory = {};
		$rootScope.riskContentItem.riskMaster = {
				activeStatus:"INP"
		};
		$rootScope.riskContentItem.initialRskList = {
				1:{
					existingControlMeasures:[],
					additionalControlMeasures:[]
					
				}
		}
		$rootScope.riskContentItem.rskwfHistory = {};
		var companyAdditionalRisk = {
				controltype:'Section3',
				controlmeasure:''
		};
		$rootScope.riskContentItem.companyAdditionalRisk = [];
		$rootScope.riskContentItem.companyAdditionalRisk.push(companyAdditionalRisk);
		console.log($rootScope.riskContentItem.companyAdditionalRisk[0]);
		$rootScope.approver = {};
		
		$rootScope.savedFormData = {};
		$rootScope.riskMaster = {};
		$rootScope.riskWorkFlow = {
				id:{
					
				}
		};
		
		var existingControlmeasureObj ={
				controltype:'Section1',
				controlmeasure:''
		};
		var additionalControlMeasureObj = {
				controltype:'Section2',
				controlmeasure:''
		};
		$scope.getLength = function(obj) {
		    return Object.keys(obj).length;
		}
		$rootScope.isSubmitted = false;
		
		// new form 
		if($rootScope.isNew) {
			// get active form number for the form
			riskAssessmentDataService.getActiveFormNumber($http,function(data){
				if(data){
					//$rootScope.riskMaster = {};
					$rootScope.riskContentItem.riskMaster.formnumber = data[0].actFormno;
					$rootScope.riskContentItem.riskMaster.revnumber = data [0].actRevno;
					$rootScope.riskContentItem.riskMaster.revdate = (new Date(data [0].reviseddate)).toISOString().slice(0,10);
					$rootScope.riskContentItem.riskMaster.crdate = (new Date()).toISOString().slice(0,10);
				}
			});
			
			if($rootScope.userRole == 'SHIP_TIER_2'){
				alert("coming in here");
				
				// get updated module index for new form
					riskAssessmentDataService.getUpdatedModuleIndex($http,function(data){
						 //EI/ELSA/2016/001 -- pattern
						var idxValue = "";
						if(data[0].idxvalue.length>2){
							idxValue = data[0].idxvalue;
						}else {
							idxValue = ("00"+data[0].idxvalue).slice(-3);
						}
						
						var moduleIndex = data[0].idxprefix+"/"+$rootScope.shipCode+"/"+data[0].fnyear+"/"+idxValue;
						$rootScope.riskContentItem.riskMaster.rskid = moduleIndex;
						$rootScope.riskContentItem.riskMaster.assessmentdate = (new Date()).toISOString().slice(0,10);
						$rootScope.riskContentItem.riskMaster.vesselcode = $rootScope.shipCode;
						//$rootScope.riskContentItem.riskMaster = $rootScope.riskMaster;
						$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
						$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
						$rootScope.riskContentItem.rskwfHistory.formstatus = "INT";
						$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
						$rootScope.riskContentItem.rskwfHistory.rolecode = 'ROLE001';
						//$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
						riskContentItemService.saveRiskContentItem($http,$rootScope,'/v1/riskcontent',function(data){
					     
						});
			
				});
			} 
			
		} else
		//already Saved Form
		{
			// setTimeout(function(){
			$http({
			       method: 'GET',
			       url: "/get-session-data/"
			   }).then(
			       function(response) {
			    	   //$scope.formStatus = response.data;
			    	   $scope.captainName = response.data.captainName;
			    	   $rootScope.shipName = response.data.vesselName;
					   $rootScope.shipCode = response.data.vesselcode;
					   $rootScope.username = response.data.usercode;	
					   $rootScope.rankCode = response.data.rankcode;
					   $rootScope.rolecode = response.data.rolecode;
					  
					   riskAssessmentDataService.getSavedRskMaster($http,$rootScope.rskId,$rootScope.username,function(data){
							console.log(data);
							$rootScope.riskContentItem = data;
							riskAssessmentDataService.getRiskAssessmentAction($http,$rootScope.riskContentItem.riskMaster.rskid,function (data){
				    			$rootScope.Actiondata = data.data;
				    		});
							/*if(!$rootScope.riskContentItem.initialRskList.hasOwnProperty(1)){
								$rootScope.currentHazardNumber = 1;
								$rootScope.riskContentItem.initialRskList = {
										1:{
											existingControlMeasures:[],
											additionalControlMeasures:[]
											
										}
								}
							}else {*/
								$rootScope.currentHazardNumber = 1;
								var emptyRiskList = true;
								angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
										var hazardItem = {};
										var obj = angular.copy(value);
										hazardItem.hazardno = obj.hazardno;
										hazardItem.activity = obj.activity;
										hazardItem.hazardcode = obj.hazardcode;
										hazardItem.existingControlMeasures = obj.existingControlMeasures[0];
										hazardItem.additionalControlMeasures = obj.additionalControlMeasures[0];
										$rootScope.hazardItemList.push(hazardItem);
										$rootScope.currentHazardNumber = key;
										emptyRiskList = false;
									});
								if(!emptyRiskList){
									$rootScope.currentHazardNumber++;									 
								} else {
									$rootScope.currentHazardNumber = 1;
									$rootScope.riskContentItem.initialRskList = {
											1:{
												existingControlMeasures:[],
												additionalControlMeasures:[]
												
											}
									}
								}
								for(var i = 1;i<= $rootScope.riskContentItem.initialRskList[i].existingControlMeasures.length;i++){
									    $('#initalRiskLevel1').val($rootScope.riskContentItem.initialRskList[i].existingControlMeasures[i].frequency);
										$('#initalRiskLevel2').val($rootScope.riskContentItem.initialRskList[i].existingControlMeasures[i].consequence);
								      }
								for(var i = 1;i<= $rootScope.riskContentItem.initialRskList[i].additionalControlMeasures.length;i++){
									$('#riskControlLevel1').val($rootScope.riskContentItem.initialRskList[i].additionalControlMeasures[i].frequency );
									$('#riskControlLevel2').val($rootScope.riskContentItem.initialRskList[i].additionalControlMeasures[i].consequence);
					            	
					            }
							//}
							
							
							
						});
			       });
			// },1000);
			}
		
		$rootScope.formSaved = false;
		 
		$rootScope.saveSection1 = function() {
			if(!$rootScope.validateForm()){
				return false;
			} else {
				//alert('ok');
				//$rootScope.riskContentItem.rskwfHistory
				if($rootScope.riskContentItem.rskwfHistory == null){
					$rootScope.riskContentItem.rskwfHistory = {};
				}
				if($rootScope.hazardItemList.length>0){
					var lastItem = $rootScope.hazardItemList[$rootScope.hazardItemList.length-1].hazardno;
					delete $rootScope.riskContentItem.initialRskList[parseInt(lastItem)+1];
					
				}
				$rootScope.riskContentItem.rskwfHistory.formstatus = "INT";
				$rootScope.riskContentItem.rskwfHistory.stageid=$rootScope.Actiondata[0][2];
				console.log("$rootScope.rskMasterUpdateUrl------------>",$rootScope.rskMasterUpdateUrl)
				
				riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
					if(data){
						alert("content updated");
					}
					
				});
			}	
		}
		
		$rootScope.sendSection1 = function(){
			if(!$rootScope.validateForm()){
				return false;
			} else{
				$rootScope.riskContentItem.riskMaster.activeStatus = 'INP';
				$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
				if($rootScope.riskContentItem.rskwfHistory == null){
					$rootScope.riskContentItem.rskwfHistory = {};
				}
				$rootScope.riskContentItem.rskwfHistory.formstatus = $rootScope.Actiondata[0][0];
				$rootScope.riskContentItem.rskwfHistory.stageid=$rootScope.Actiondata[0][2];
				riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
					if(data){
						alert("content updated");
						riskAssessmentDataService.getRiskAssessmentAction($http,$rootScope.riskContentItem.riskMaster.rskid,function (data){
			    			$rootScope.Actiondata = data.data;
			    			console.log("$scope.Actiondata");
			    			// $scope.$apply();
			
			    		});
					}
					
				});
			}
		};
		$rootScope.saveShipTier1 = function(){
			if($rootScope.riskContentItem.rskwfHistory == null){
				$rootScope.riskContentItem.rskwfHistory = {};
			}
			if($rootScope.hazardItemList.length>0){
			//	delete $rootScope.riskContentItem.initialRskList[$rootScope.hazardItemList.length+1];
			}
			$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.rskwfHistory.formstatus = "INT";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"2";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			//$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory.rolecode = $rootScope.rolecode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = null;
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				if(data.status ==0){
					alert("content updated");
				}
				
			});
			
		}
		
		$rootScope.hideApproveShipTier1 = function(){
			var showApprove = false;
			 angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {		
					 console.log(value);
					 for(var i =0;i<value.additionalControlMeasures.length;i++){
						 if(value.additionalControlMeasures[i].risklevel == 'High' || value.additionalControlMeasures[i].risklevel == 'Very High'){
							 showApprove = true;
							 false;
						 }
					 }
				});
		return showApprove;
		}
		
		
		$rootScope.approveSection2 = function(){
			$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.rskwfHistory.formstatus = "APR";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"2";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory.rolecode = 'ROLE002';
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				if(data.status ==0){
					alert("content updated");
				}
				
			});
		}
		
		$rootScope.closeOutSection2 = function(){
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.rskwfHistory.formstatus = "CLO";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"2";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				if(data.status ==0){
					alert("content updated");
				}
				
			});
		}
		
		
		$rootScope.approveSection1 = function(){
		
		if($rootScope.riskContentItem.rskwfHistory == null){
			$rootScope.riskContentItem.rskwfHistory = {};
		}
		
		$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
		$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
		$rootScope.riskContentItem.rskwfHistory.formstatus = "APR";
		$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
		$rootScope.riskContentItem.rskwfHistory.stageid=$rootScope.Actiondata[0][2];
		$rootScope.riskContentItem.rskwfHistory.rolecode = $rootScope.rolecode;
		$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
		riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
			if(data){
				alert("content updated");
				riskAssessmentDataService.getRiskAssessmentAction($http,$rootScope.riskContentItem.riskMaster.rskid,function (data){
	    			$rootScope.Actiondata = data.data;
	    			console.log("$scope.Actiondata");
	    			 $scope.$apply();
	
	    		});
			}
			
		});};
		
		$rootScope.disableEdit =function(){
			if($rootScope.userRole == 'SHORE_TIER_1' || $rootScope.userRole == 'SHORE_TIER_2'){
				return true;
			}
			else if($rootScope.riskContentItem.rskwfHistory){
				if($rootScope.riskContentItem.rskwfHistory.userid == $rootScope.username && $rootScope.riskContentItem.rskwfHistory.formstatus !='INT' ){
					return true;
				} else {
					return false;
				}
			}
		};
		
		$rootScope.approveSection3 =function(){
				$rootScope.riskContentItem.riskMaster.activeStatus = "APR";
				$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
				$rootScope.riskContentItem.rskwfHistory = {};
				$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
				$rootScope.riskContentItem.rskwfHistory.formstatus = "APR";
				//$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
				$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
				$rootScope.riskContentItem.rskwfHistory.rolecode = 'ROLE002';
				
				$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
				$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
				
			    angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
					  //this.push(key + ': ' + value);
					value.status = 50000;
					});
				riskContentItemService.saveRiskContentItem($http,$rootScope,'/v1/riskcontentupdate',function(data){
					if(data.status ==0){
						alert("content updated");
						$rootScope.section3Updated = true;
						$rootScope.approver.name = $rootScope.username;
						$rootScope.approver.rank = $rootScope.riskContentItem.riskMaster.headrankcode;
						$rootScope.approver.date = (new Date()).toISOString().slice(0,10);
					}
					
				});
			};
		
			$rootScope.reviewSection3 =function(){
				$rootScope.riskContentItem.riskMaster.activeStatus = "REV";
				$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
				$rootScope.riskContentItem.rskwfHistory = {};
				$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
				$rootScope.riskContentItem.rskwfHistory.formstatus = "REV";
				$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
				$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
				$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
				
			    angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
					  //this.push(key + ': ' + value);
					value.status = 50000;
					});
				riskContentItemService.saveRiskContentItem($http,$rootScope,'/v1/riskcontentupdate',function(data){
					if(data.status ==0){
						alert("content updated");
						$rootScope.section3Updated = true;
						$rootScope.approver.name = $rootScope.username;
						$rootScope.approver.rank = $rootScope.riskContentItem.riskMaster.headrankcode;
						$rootScope.approver.date = (new Date()).toISOString().slice(0,10);
					}
					
				});
			};	
			
		$rootScope.closeOutForm = function(){
			var jobStartedDate = $( "input[name='jobCommencedDate']" ).val();
			var jobCompletedDate = $( "input[name='jobCompletedDate']" ).val();
			$rootScope.riskContentItem.riskMaster.activeStatus = "CLO";
			$rootScope.riskContentItem.riskMaster.currankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory = {};
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.rskwfHistory.formstatus = "CLO";
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.rankCode;
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			
			$rootScope.riskContentItem.riskMaster.jobcommencedate = (new Date(jobStartedDate)).toISOString().slice(0,10);;
			$rootScope.riskContentItem.riskMaster.jobcompleteddate = (new Date(jobCompletedDate)).toISOString().slice(0,10);;
			
			angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {
				  //this.push(key + ': ' + value);
				value.status = 50000;
				});
			/*$rootScope.riskContentItem.initialRskList.each(function(){
				
			});*/
			riskContentItemService.saveRiskContentItem($http,$rootScope,'/v1/riskcontentupdate',function(data){
				if(data.status ==0){
					alert("content updated");
				}
				
			});
			
		
			
		};
		
		$rootScope.isAddButtonDisabled = function (){
			var error = "";
			if($rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber]){
			var existingControlMeasures = $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].existingControlMeasures;
			for(var i =0 ; i<existingControlMeasures.length;i++){
				error =  existingControlMeasures[i].controlmeasure.length == 0?'err':'';
				var existingRskLevel = existingControlMeasures[i].risklevel;
				if(existingRskLevel =='Medium' || existingRskLevel == 'Low' || existingRskLevel =='Very Low'){
					
				}else if(existingRskLevel =='High' || existingRskLevel =='Very High'){
					
					var additionalControlMeasures = $rootScope.riskContentItem.initialRskList[$rootScope.currentHazardNumber].additionalControlMeasures;
						for(var j =0 ; j<additionalControlMeasures.length;j++){
							error =  additionalControlMeasures[j].controlmeasure.length == 0?'err':'';
							var additionalRskLevel = additionalControlMeasures[j].risklevel;
							if(additionalRskLevel =='Medium' || additionalRskLevel == 'Low' || additionalRskLevel =='Very Low' ||additionalRskLevel =='High' || additionalRskLevel =='Very High' ){
								
							} else {
								error += 'err';
							}
						}
				}else{
					error += 'err';
				}
			}
			}else {
				error += 'err';
			}

			if(error.length==0){
				$rootScope.addDisabled = false;
			}
			return error.length>1;
		};
		
		$rootScope.setRAUser = function(param){
			switch (param) {
			case "IN00003":
				$rootScope.userRole = 'SHIP_TIER_2';
				$rootScope.username =  "IN00003";
				break;
			case "KLSG002":
				$rootScope.userRole = 'SHIP_TIER_1';
				$rootScope.username =  "KLSG002";
				break;
			case "KLSG003":
				$rootScope.userRole = 'SHORE_TIER_2';
				 $rootScope.username =  "KLSG003";
				break;
			case "KLSG004":
				$rootScope.userRole = 'SHORE_TIER_1';
				 $rootScope.username =  "KLSG004";
				break;
			default:
				$rootScope.userRole = 'DEFAULT';
				break;
			}
			
			riskAssessmentDataService.getSavedRskMaster($http,$rootScope.riskContentItem.riskMaster.rskid,$rootScope.riskContentItem.riskMaster.formnumber,$rootScope.username,function(data){
				console.log(data);
				if(data.rskwfHistory.formstatus !=null){
					$rootScope.riskContentItem.rskwfHistory = data.rskwfHistory;
				}
			});
			
			$rootScope.disableAfterCloseOut =function(){
				 if($rootScope.riskContentItem.rskwfHistory){
					if($rootScope.riskContentItem.rskwfHistory.formstatus =='CLO' ){
						return true;
					} else {
						return false;
					}
				}
			};
			
		}
		$rootScope.validateForm = function(){
			var error = '';
			if(!$rootScope.riskContentItem.riskMaster.taskname || $rootScope.riskContentItem.riskMaster.taskname == ''){
				$rootScope.tasknameerror ='Please specify task';
				error +="tasknameerror";
			} 
			if(!$rootScope.riskContentItem.riskMaster.eqpused || $rootScope.riskContentItem.riskMaster.eqpused == ''){
				error +="equiperror";
				$rootScope.equiperror = 'Please specify equipments';
			}
			
			console.log("printing the rootscope", $rootScope);
			return error.length>0?false:true;
			
		};
	}])
	.directive('mainFormDirective', function() {
		
  return {
	  link: function($scope, element, attrs) {
		  (function init() {
		        // load data, init scope, etc.
				initMultiSelection();
		    })();
      },
    templateUrl: 'templates/mainForm/mainForm.html'
  };
});

