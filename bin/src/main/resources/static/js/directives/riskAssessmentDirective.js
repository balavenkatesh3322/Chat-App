/**
 * riskAssessmentDirectiveController.js
 */
app
	.controller('riskAssessmentDirectiveController', ['$scope','$rootScope','riskContentItemService','$http', function($scope,$rootScope,riskContentItemService,$http) {
		var companyAdditionalRisk = {
				controltype:'Section3',
				controlmeasure:'',
				risklevel:'N/A',
				frequency:'N/A',
				consequence:'N/A'
				
				
		};
		$rootScope.riskContentItem.companyAdditionalRisk = [];
		$rootScope.riskContentItem.companyAdditionalRisk.push(companyAdditionalRisk);
		
		
		$rootScope.showRiskAssesment = function (){
			var showRiskAssessment = false;
			angular.forEach($rootScope.riskContentItem.initialRskList, function(value, key) {		
				 console.log(value);
				 for(var i =0;i<value.additionalControlMeasures.length;i++){
					 if(value.additionalControlMeasures[i].risklevel == 'High' || value.additionalControlMeasures[i].risklevel == 'Very High'){
						 showRiskAssessment = true;
					 }
				 }
			});
			return showRiskAssessment;
		}
		
		// add multiple items for company additional Risk
		$rootScope.addCompanyAdditionalRisk = function(index){
			var obj = angular.copy(companyAdditionalRisk);
			obj.risklevel = obj.frequency = obj.consequence='N/A';
			$rootScope.riskContentItem.companyAdditionalRisk.push(obj);
		}
		
		// remove company additional risk
		$rootScope.removeCompanyAdditionalRisk = function(index){
			if(index !=0){
				$rootScope.riskContentItem.companyAdditionalRisk.splice(index,1);
			}
		}
		
		$rootScope.enableApproveSection3 = function(){
			$rootScope.enableReviewSection3 = false;
			var enableApproveSection3 = true;
			$rootScope.enableSaveSection3 = true;
			for(var i=0;i<$rootScope.riskContentItem.companyAdditionalRisk.length;i++){
				if($rootScope.riskContentItem.companyAdditionalRisk[i].risklevel =='High' || $rootScope.riskContentItem.companyAdditionalRisk[i].risklevel =='Very High'){
					enableApproveSection3 = false;
					$rootScope.enableReviewSection3 = true;
					false;
				}
			}
			return enableApproveSection3;
		}
		$rootScope.saveShoreTier2 = function(){
			if($rootScope.riskContentItem.rskwfHistory == null){
				$rootScope.riskContentItem.rskwfHistory = {};
			}
			if($rootScope.hazardItemList.length>0){
			//	delete $rootScope.riskContentItem.initialRskList[$rootScope.hazardItemList.length+1];
			}
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.rskwfHistory.formstatus = "INT";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"3";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = null;
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				if(data){
					alert("content updated");
				}
				
			});
			
		}
		
		$rootScope.approveShoreTier2 = function(){
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.riskMaster.activeStatus = "APR";
			$rootScope.riskContentItem.rskwfHistory.formstatus = "APR";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"3";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				
				$rootScope.approver.name = $rootScope.username;
				$rootScope.approver.rank = $rootScope.riskContentItem.riskMaster.headrankcode;
				$rootScope.approver.date = (new Date()).toISOString().slice(0,10);
				
				$rootScope.showShoreTier2CloseOut = true;
				//if(data.status ==0){
					//alert("content updated");
				//}
				
			});
		}
		
		$rootScope.approveShoreTier1 = function(){
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.riskMaster.activeStatus = "APR";
			$rootScope.riskContentItem.rskwfHistory.formstatus = "APR";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"4";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				
				$rootScope.approver.name = $rootScope.username;
				$rootScope.approver.rank = $rootScope.riskContentItem.riskMaster.headrankcode;
				$rootScope.approver.date = (new Date()).toISOString().slice(0,10);
				
				$rootScope.showShoreTier2CloseOut = true;
				//if(data.status ==0){
					//alert("content updated");
				//}
				
			});
		}
		
		$rootScope.shoreTier2CloseOut = function(){
			var jobStartedDate = $( "input[name='jobCommencedDate']" ).val();
			var jobCompletedDate = $( "input[name='jobCompletedDate']" ).val();
		
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.riskMaster.activeStatus = "CLO";
			$rootScope.riskContentItem.rskwfHistory.formstatus = "CLO";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+($rootScope.userRole == 'SHORE_TIER_2'?'3':'4');
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			
			$rootScope.riskContentItem.riskMaster.jobcommencedate = (new Date(jobStartedDate)).toISOString().slice(0,10);;
			$rootScope.riskContentItem.riskMaster.jobcompleteddate = (new Date(jobCompletedDate)).toISOString().slice(0,10);;
			
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				
				window.location.href = 'http://localhost:9090/RiskManagement.html';
			});
		}
		
		$rootScope.reviewSection3 = function(){
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.riskMaster.activeStatus = "REV";
			$rootScope.riskContentItem.rskwfHistory.formstatus = "REV";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"3";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
				
				window.location.href = 'http://localhost:9090/RiskManagement.html';
			});
			
		}
		
		$rootScope.rejectShoreTier1 = function(){
			$rootScope.riskContentItem.rskwfHistory.userid = $rootScope.username;
			$rootScope.riskContentItem.riskMaster.activeStatus = "RIJ";
			$rootScope.riskContentItem.rskwfHistory.formstatus = "RIJ";
			var refIfd = $rootScope.riskContentItem.rskwfHistory.rskwfid.split('-')[0]+"-"+"4";
			$rootScope.riskContentItem.rskwfHistory.rskwfid = refIfd;
			$rootScope.riskContentItem.rskwfHistory.rankid = $rootScope.riskContentItem.riskMaster.headrankcode;
			$rootScope.riskContentItem.rskwfHistory.upddate = (new Date()).toISOString().slice(0,10);
			$rootScope.riskContentItem.rskwfHistory.senddate = (new Date()).toISOString().slice(0,10);
			riskContentItemService.saveRiskContentItem($http,$rootScope,$rootScope.rskMasterUpdateUrl,function(data){
			
				window.location.href = 'http://localhost:9090/RiskManagement.html';
			});
		}
		$rootScope.calculateInitialRisk2 = function (id, id1, tdid) {
            var value = $('#' + id).val();
            var value1 = $('#' + id1).val();
            if (value == 'N/A' || value1 == 'N/A') {
                $('#' + tdid).html("N/A");
                $('#' + tdid).removeClass("bg-success");
                $('#' + tdid).removeClass("bg-info");
                $('#' + tdid).removeClass("bg-warning");
                $('#' + tdid).removeClass("bg-danger");
                $('#' + tdid).css({"background-color": "white", "color": "black"});
            } else {
                if ((value == '1' && value1 == '1') || (value == '1' && value1 == '2') || (value == '2' && value1 == '1')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $('#' + tdid).html("Very Low");
                    $('#' + tdid).addClass("bg-success");
                } else if ((value == '1' && value1 == '3') || (value == '1' && value1 == '4')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $('#' + tdid).html("Low");
                    $('#' + tdid).addClass("bg-info");
                } else if ((value == '2' && value1 == '2')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $('#' + tdid).html("Medium");
                    $('#' + tdid).css({"background-color": "#efde73", "color": "white"});
                } else if ((value == '2' && value1 == '3') || (value == '3' && value1 == '1')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $('#' + tdid).html("High");
                    $('#' + tdid).addClass("bg-warning");
                } else if ((value == '2' && value1 == '4') || (value == '3' && value1 == '2') || (value == '3' && value1 == '3') || (value == '3' && value1 == '4')) {
                    $('#' + tdid).removeClass("bg-success");
                    $('#' + tdid).removeClass("bg-info");
                    $('#' + tdid).removeClass("bg-warning");
                    $('#' + tdid).removeClass("bg-danger");
                    $('#' + tdid).html("Very High");
                    $('#' + tdid).addClass("bg-danger");
                }
            }
            if ($('#fa_environment').html() == 'High' || $('#fa_environment').html() == 'Very High') {
                $('#risk1').show();
                $('#risk2').show();
                $('#risk3').hide();
                $('#approvebutton').hide();
                $('#risk5').hide();
                $('#manager').show();
                $('#manager1').show();
                $('#manager2').show();
                $('#manager3').show();
                $('#manager4').show();
                $('#manager5').show();
                $('#manager6').show();
                $('#manager7').show();
                $('#manager8').show();
                $('#manager9').show();
                $('#manager10').show();
			    $('#manager11').show();
                $('#idreject').hide();
                $('#idreject1').hide();
                $('#idreject2').hide();
                $('#idreject3').hide();
				$('#idreject4').hide();
                $('#reviewprocess').show();
                $('#approveprocess').hide();
				$('#manager').hide();
				$('#manager3').hide();
				$('#manager4').hide();
				//$('#manager5').hide();
				$('#manager6').hide();
				$('#manager7').hide();
				$('#manager8').hide();
				$('#manager9').hide();
				$('#manager10').hide();
				$('#manager11').hide();
				$('#lastdiv').hide();
                $('#section5').show();
            } else if ($('#fa_environment').html() == 'Low' || $('#fa_environment').html() == 'Very Low' || $('#fa_environment').html() == 'Medium') {
                $('#risk1').hide();
                $('#risk2').hide();
                $('#risk3').show();
                $('#approvebutton').show();
                $('#lastdiv').show();
                $('#risk5').show();
                $('#manager').hide();
                $('#manager1').hide();
                $('#manager2').hide();
                $('#manager3').hide();
                $('#manager4').hide();
                $('#manager5').show();
                $('#manager6').show();
                $('#manager7').show();
                $('#manager8').show();
                $('#manager9').hide();
				$('#manager11').show();
                $('#manager10').hide();
                $('#idreject').show();
                $('#idreject1').show();
                $('#idreject2').show();
                $('#idreject3').show();
				$('#idreject4').show();
                $('#reviewprocess').hide();
                $('#approveprocess').show();
                $('#section5').show();
            }
            
            $rootScope.riskContentItem.companyAdditionalRisk[0].risklevel = $('#' + tdid).val();
            $rootScope.riskContentItem.companyAdditionalRisk[0].frequency  = value;
            $rootScope.riskContentItem.companyAdditionalRisk[0].consequence = value1;
        }
		
		$rootScope.getControlMeasure = function(controlMeasure){
			if(controlMeasure.frequency == 'N/A'  || controlMeasure.consequence == 'N/A'){
				controlMeasure.risklevel ='N/A';
			} else {
				if((controlMeasure.frequency == '1' && controlMeasure.consequence == '1') || (controlMeasure.frequency == '1'  || controlMeasure.consequence == '2') ||(controlMeasure.frequency == '2'  || controlMeasure.consequence == '1')){
					controlMeasure.risklevel ='Very Low';
				} else if((controlMeasure.frequency == '1' && controlMeasure.consequence == '3') || (controlMeasure.frequency == '1'  || controlMeasure.consequence == '4')){
					controlMeasure.risklevel ='Low';
				}else if((controlMeasure.frequency == '2' && controlMeasure.consequence == '2')){
					controlMeasure.risklevel ='Medium';
				}else if((controlMeasure.frequency == '2' && controlMeasure.consequence == '3') ||(controlMeasure.frequency == '3' && controlMeasure.consequence == '1')){
					controlMeasure.risklevel ='High';
				} else if((controlMeasure.frequency == '2' && controlMeasure.consequence == '4') || (controlMeasure.frequency == '3'  || controlMeasure.consequence == '2') ||(controlMeasure.frequency == '3'  || controlMeasure.consequence == '3')||(controlMeasure.frequency == '3'  || controlMeasure.consequence == '4')){
					controlMeasure.risklevel ='Very High';
				}
			}
			
			return controlMeasure.risklevel;
			
		};
		$rootScope.section3Enabled = function(){
			if($rootScope.companyAdditionalRisk[0]){
				var rskFequency =   $rootScope.riskContentItem.companyAdditionalRisk[0].frequency;
				var consequence =   $rootScope.riskContentItem.companyAdditionalRisk[0].consequence;
				if(rskFequency!=NaN && consequence!=NaN ){
					//alert(rskFequency);
					if(parseInt(rskFequency)<2 && parseInt(consequence)<3){
						return true;
					}
				}
				return false;

			}
		};
	}])
	.directive('riskAssessmentDirective', function() {
		
  return {
	  link: function($scope,$rootScope, element, attrs) {
		  (function init() {
		        // load data, init scope, etc.
			initMultiSelection();
			
		    })();
      },
    templateUrl: 'templates/riskAssessment/riskAssessment.html'
  };
});