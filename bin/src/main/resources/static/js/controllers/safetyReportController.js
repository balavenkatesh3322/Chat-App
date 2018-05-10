app.controller('safetyReportCtrl', function($rootScope,$anchorScroll, Connectivity, toaster, $http, $location, $timeout, $window, $scope, safetyReportService, $routeParams) {
	 	$scope.safetyrecordid = $routeParams.id;	

	 	$scope.geterrorstatuscode ="0";
//	 	angular.element('#dupRecords').modal('show');
	 	// Mandatory L section
	 	$scope.mandSectionL1 = "Y";
	 	$scope.mandSectionL2 = "Y";
	 	$scope.mandSectionL3 = "Y";
	 	
	 	// M
	 	$scope.drillReportSectionData = [];
	 	// B
	 	$scope.outstandingItems = [];
	 	// G
	 	
	 	$scope.nearMissReports = [];
	 	
		$scope.previewFileName = "";
		
		$scope.previewObj  = {
				"title": $scope.previewFileName
		}
		
		var todayDate = new Date();

		/************** TO PREVIEW FILE *********************/
		$scope.previewFile = function(docid, docName) {
			$rootScope.showScreenOverlay = true;
			$http.get('/safetyreport/downloadDocument/?docId='+docid, {responseType:'blob'})
			.then(function(response){
	    		 var data = new Blob([response.data], {type: 'image/jpeg;charset=UTF-8'});
//	    		 var data = new Blob([response.data], {type: 'application/pdf'});
	    		 url = $window.URL || $window.webkitURL;
	    		    $scope.fileUrl = url.createObjectURL(data); 
//	    		    $scope.content = $scope.fileUrl;
	    		    toDataUrl($scope.fileUrl, function(base64Img) {
	    		    	$scope.imagetest = base64Img;
	    		    	  
	                     $scope.previewFileName = docName;
	                     $scope.previewObj  = {
	               			"title": $scope.previewFileName
	               		 }
	                     $rootScope.showScreenOverlay = false;
	    		    	  $scope.previewDialog.open();
	    		    });
	    	});
		}
		
		function toDataUrl(url, callback) {
			  var xhr = new XMLHttpRequest();
			  xhr.onload = function() {
			    var reader = new FileReader();
			    reader.onloadend = function() {
			      callback(reader.result);
			    }
			    reader.readAsDataURL(xhr.response);
			  };
			  xhr.open('GET', url);
			  xhr.responseType = 'blob';
			  xhr.send();
			}
		
		/****************************************/

		$scope.$on('$viewContentLoaded', function() {
			$scope.dialog.close();
			$scope.duplicateSigdialog.close();
			$scope.exceededRowsdialog.close();
			$scope.exceededFileSizedialog.close();
			$scope.exceededFileCountDialog.close();
			$scope.previewDialog.close();
			$scope.confirmDeleteDialog.close();
			$scope.reAssignDialog.close();
			$scope.duplicateRecordsConfirm.close();
			$scope.confirmDeleteMSectionRecords.close();
			$scope.confirmDeleteGSectionRecords.close();
			$scope.updateCrewSectionInfo.close();
		});
		/***********Date Picker validation**********/
	    $scope.validateDate = function(modelName, ngModelName, errorModelName, ifConditionModel,
	    		typeOfPicker){
		   if ($scope[modelName] != "" && $scope[modelName] != undefined) {
				var currentDate = Date.parse($scope[modelName]);
				// Check if Date parse is successful
				if (typeOfPicker == 'date') {
					var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
				} else {
					var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}) (AM|PM)$/;
				}
				if (!currentDate || !re.test($scope[modelName])) {
					$scope[modelName] = "";
					$scope[ngModelName] = "";
					$scope[errorModelName] = "That doesn't seem like a valid date";
					$scope[ifConditionModel] = true;
				} else {
					$scope[ifConditionModel] = false;
				}
			} else {
				$scope[ifConditionModel] = false;
			}
	    	}
	    /**************End of Date picker validation*******/
        $scope.validationDialogMsg = "Some mandatory field/fields are missing.";
        $scope.duplicateSigDialogMsg = "You have added duplicate rank in Signature section, which is not permitted.";
        $scope.exceededRowsDialogMsg = "You cannot make more than 15 entries.";
        $scope.exceededFileCountDialogMsg = "You cannot attach more than 3 files. Remove a file, then try."
        $scope.deleteDialogMsg = "You sure, that you want to delete this?";	
        $scope.updateCrewSectionInfoMsg = "Kindly revise the Crew Health Log Details."

        function thowsFileSizeExceededError(filename) {
        	$scope.fileSizeExceededDialogMsg = filename + " is more than 1 MB, cannot be uploaded";
        	$scope.exceededFileSizedialog.open();
        }
        
        function thowsUnsupportedFileError(filename) {
            $scope.fileSizeExceededDialogMsg = filename+ " is not supported format. Unable to upload.";
            $scope.exceededFileSizedialog.open();
        }
        
        $scope.actions = [
            { text: 'Ok'}
        ];
        
   	 	$scope.errorActions = [
	                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	               ];
        
        
        $scope.confirmDelete= function(docid) {
        	$scope.deleteDocId = docid;
        	$scope.confirmDeleteDialog.open();
        }
        
        $scope.deleteActions = [
                      {text: 'Yes', action: removeDocument},
                      { text: 'No'}
        ];
        
        // M section delete
        $scope.confirmDeleteMSectionRecordsf = function(index) {
        	$scope.indexDeleteMsection = index;
        	$scope.confirmDeleteMSectionRecords.open();
        }
        
        $scope.deleteActionsMSectionRecords = [
                                {text: 'Yes', action: deleteDrillReportSectionData},
                                { text: 'No'}
                  ];
        
        function deleteDrillReportSectionData() {
        	$scope.drillReportSectionData.splice($scope.indexDeleteMsection, 1);
        }
        
        //
        
        // G section delete
        $scope.confirmDeleteGSectionRecordsf = function(index) {
        	$scope.indexDeleteGsection = index;
        	$scope.confirmDeleteGSectionRecords.open();
        }
        
        $scope.deleteActionsGSectionRecords = [
                                {text: 'Yes', action: deleteNearmissReportSectionData},
                                { text: 'No'}
                  ];
        
        function deleteNearmissReportSectionData() {
        	$scope.nearMissReports.splice($scope.indexDeleteGsection, 1);
        }
        
        //
        
	$scope.hidebody = true;
	$scope.haspermission = false;
	$scope.unauthorize = function(arg1){
		if (arg1){
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	} 
	$scope.showModal = function(targetName){
		angular.element(targetName).modal('show'); 
	}
	$scope.datastatus = true;	
	
	/******* Limiting Date picker ***********/
    var date = new Date();
	$scope.restrictFutureDate = {
			max: date
	}
	
	$scope.restrictPastDate = {
			min: date
	}
	
	/**** REASSIGN*********/
	 $scope.reAssignDialogClick = function(targetName) {
    	$scope.targetName = targetName;
        $scope.reAssignDialog.open();
    }
 
    $scope.reassignActions = [{
    	text: 'Yes',
        action: function openOkAction(){
        	$scope.remarks="";
        	angular.element($scope.targetName).modal('show');
        }
    }, {
    	text: 'No'
    }];
  
    $scope.okAction= function (targetName) {
            if ($scope.remarks !== '' && $scope.remarks !== undefined) {
                $scope.saveFormData('reassign');
                angular.element(targetName).modal('hide');
            }else{
            	$scope.remarksMessageRequiredError=true;
            }
    }
	
	/***********Date Picker validation**********/
    $scope.validateDateDynamic = function(data, index, key,errorModelName, errorIndex){
    	if($scope[data][index][key]!="" && $scope[data][index][key] && $scope[data][index][key]!=undefined){
    	   var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}) (AM|PM)$/;
    	   var currentDate = Date.parse($scope[data][index][key]);
           //Check if Date parse is successful
           if (!currentDate || !re.test($scope[data][index][key])) {
          	 $scope[data][index][key] ="";
               $scope[errorModelName] = "That doesn't seem like a valid date";
               $scope[errorIndex]=index;
           }else{
          	 $scope[errorIndex] = -1;
           }
       }else{
    	   $scope[errorIndex] = -1;
       }
  	   
     }
    /**************End of Date picker validation*******/
	
	/********** Limiting Characters length ******/
	$scope.max200Length = 200;
	$scope.max300Length = 300;
    
	/*******************************************************************/
	 Connectivity.IsOk().then(function(response){
		 $rootScope.showScreenOverlay = true;
	    	$http({
	            method: 'POST',
	            url: "/get-safety-report-initial-load-data/",
	            data: {"safid": $scope.safetyrecordid}
	        }).then(
	            function(response) { 
	            	$scope.geterrormessages = response.data.message;	
	                $scope.geterrorstatus = response.data.errorstatus;
	                $scope.geterrorstatuscode = response.data.status;                
	                $scope.dataerror = response.data.message;      
	            	if((response.data.status==0 )||(response.data.errorstatus == "SV")) {  
	            		console.log("MAJOR ONE RESPONSE", response.data);
	            		
		    			$scope.actionData = response.data.data[0].buttonActionsData;
		    			if($scope.actionData[0] != undefined) {
			    			$scope.actionrights = $scope.actionData[0][0];
			    			$scope.defaultaction = $scope.actionData[0][1];
			    			$scope.stageid = $scope.actionData[0][2];
			    			$scope.reassignrights = $scope.actionData[0][3];
			    			$scope.deleteAction = $scope.actionData[1];
		    			}
		    			
	            	   $scope.wrkflowstatus = response.data.data[0].safetyWorkFlowHistoryData;
	            	   
	            	   for( i = 0 ; i < $scope.wrkflowstatus.length ; i++) {
	            		   if($scope.wrkflowstatus[i].cntrltype === 'CNT001') {
	            			   $scope.displayShoreWorkflow = true;
	            		   }
	            		   
	            		   if($scope.wrkflowstatus[i].cntrltype === 'CNT002') {
	            			   $scope.displayShipWorkflow = true;
	            		   }
	            	   }
	            	   
	   	               $scope.chatdata = response.data.data[0].communicationWindowList;
	   	               var revlen = response.data.data[0].formMasterData.length;
	   	               $scope.formNo = response.data.data[0].formMasterData[revlen-1].actFormno;
	   	               $scope.actRevno =  response.data.data[0].formMasterData[revlen-1].actRevno;
	   	               $scope.reviseddate = response.data.data[0].formMasterData[revlen-1].reviseddate;
	            	   
	                   $scope.filesData = response.data.data[0].formsDoc;  
	                   countActiveFiles();
	                   
	                   // ATTENDEES LIST 
	                   $scope.crewEmployeesList = [];
	                   $scope.crewEmployeesList = response.data.data[0].userDetailData;
	                   $scope.crewEmployees = [];
	                       
                       for( i = 0 ; i < $scope.crewEmployeesList.length ; i++) {
                       	var obj = {
                       			"code" : $scope.crewEmployeesList[i][0] +"-"+$scope.crewEmployeesList[i][2],
                       			"name" : $scope.crewEmployeesList[i][1] + " (" + $scope.crewEmployeesList[i][3] + ")"
                       	}
                           $scope.crewEmployees.push(obj);
                       	
                       }
                       console.log("$scope.crewEmployees", $scope.crewEmployees);
        		       $scope.selectAttendeesOptions = {
       		               placeholder: "Select Attendees",
       		               dataTextField: "name",
       		               dataValueField: "code",
       		               autoBind: true,
       		               autoClose: false,
       		               dataSource: { data: $scope.crewEmployees }
       		           };
	                   $scope.officeStaffAttendence = "";

	                   // NON ATTENDEES LIST
	                   $scope.nonCrewEmployeesList = [];
                       $scope.nonCrewEmployeesList = response.data.data[0].crewMasterData;
                                            
                       $scope.nonCrewEmployees = [];
                       $scope.fetchedNonAttendees = response.data.data[0].safetyNonAttendeesData;
                       
                       for( i = 0 ; i < $scope.nonCrewEmployeesList.length ; i++) {
                       	var obj = {
                       			"code" : $scope.nonCrewEmployeesList[i][0]+"-"+$scope.nonCrewEmployeesList[i][3],
                       			"name" : $scope.nonCrewEmployeesList[i][1] + " (" + $scope.nonCrewEmployeesList[i][2] + ")"
                       	}
                           $scope.nonCrewEmployees.push(obj);
                       	
                       }

                       $scope.selectNonAttendeesOptions = {
       		               placeholder: "Select Non Attendees",
       		               dataTextField: "name",
       		               dataValueField: "code",
       		               autoBind: true,
       		               autoClose: false,
       		               dataSource: { data: $scope.nonCrewEmployees }
       		           };
                       $scope.nonAttendees = "";
	                   
                       // RANKS LIST
	                   $scope.crewRanksList = [];
                       $scope.crewRanksList = response.data.data[0].rankMasterData;
                       $scope.addedSafetyConcernsRank = '';
                        $timeout(function(){
 	                       $scope.fetchedAttendees = response.data.data[0].safetyAttendeesData;
 	                       $scope.officeStaffAttendence = [];
 	                       for(i=0;i<$scope.fetchedAttendees.length;i++) {    				
 								$scope.officeStaffAttendence.push($scope.fetchedAttendees[i][0].attendeecode+"-"+$scope.fetchedAttendees[i][0].attendeerankcode);
 	                       }
                         },0);
                                                
                        $timeout(function(){
 	                       $scope.nonAttendees= [];
 	                       for(i=0;i<$scope.fetchedNonAttendees.length;i++) {    	
 								$scope.nonAttendees.push($scope.fetchedNonAttendees[i][0].nonattendeecode+"-"+$scope.fetchedNonAttendees[i][0].nonattendeerankcode);
 	                       }

                         },0);
		           		
		            	$scope.nearMissModule = response.data.data[0].nrmCode[0];
		            	$scope.accReportModule = response.data.data[0].artCode[0];		            
		       		 	
		       		 	// SAFETY TOPICS LIST (DROPDOWN)
		       	        $scope.safetyTopicsList = [];
		       	        $scope.safetyTopicsList = response.data.data[0].safetyTopicMasterData;

		       	        // SETTING THE MASTER DATA
	        			safetyData = response.data.data[0].safetyMeetingMasterData;
	        			
	        			$scope.isOfficeStaffAttendence = safetyData.isstaffattended;
		                $scope.vesselCode = safetyData.vslcode;      
		       		 	$scope.vesselName = safetyData.vslname; 
	        			$scope.remark = safetyData.remarks;
	        			$scope.isReviewedMinutesofPrevMeet = safetyData.ispremeetreview;
	        			$scope.meetingType = safetyData.meetingtype;
	        			$scope.ppm = safetyData.ppm;
	        			$scope.maxFileCount = safetyData.maxFileCount;
	        			$scope.chiefEngineer = safetyData.chiefEngName;
	        			$scope.master = safetyData.masterName;
	        			$scope.maxFileSize = safetyData.maxFileSize;
	                    $scope.dateFormat = safetyData.dateFormat;
	                    $scope.activeStatus = safetyData.activeStatus;
	                    if ($scope.activeStatus == "CLO") {
		                  	 $scope.exportDis = true;
		                      $scope.closeOutDis = true;
		                  }
	                    
	                    if ($scope.activeStatus == "VOI") {
		                      $scope.voidStatus = true;
		                  }
	                    $scope.currentUserCode = response.data.data[0].currentUserCode;
	                    $scope.prioritys = response.data.data[0].prioritydetails; 
	                    $scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
	                    $scope.mdlname = safetyData.mdlname;

	                    $scope.mandSectionL1 = safetyData.ismandatorysectionL1;
	                    $scope.mandSectionL2 = safetyData.ismandatorysectionL2;
	                    $scope.mandSectionL3 = safetyData.ismandatorysectionL3;
	                    $scope.safrfid = safetyData.safrfid;
	                    //Shore side data
	        	    	$scope.healthMeasures = safetyData.gshemeasures;
	        	    	$scope.drillFeedbacks = safetyData.drillfeedback;
	        	    	$scope.healthIssues = safetyData.healthissue;
	        	    	$scope.complaintIssues = safetyData.crewcomplaints;

	        			if(safetyData.reviewdate != null){
	        				var formatDate = new Date(safetyData.reviewdate);
	        				$scope.dateReviewed = (formatDate.getUTCFullYear()+ "-"+(formatDate.getUTCMonth()+1)+'-'+formatDate.getUTCDate()+"T"+formatDate.getUTCHours()+":"+formatDate.getUTCMinutes()+":00.000Z");
	        			}
	        			
	        			if(safetyData.residualdate != null){
	        				var cnvrtDate = new Date(safetyData.residualdate);
	        				$scope.testingDate = (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear();
	        			}
	        			
	        			if(safetyData.pslbdate != null){
	        				var cnvrtDate = new Date(safetyData.pslbdate);
	        				$scope.launchDatePSL = (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear();
	        			} 

	        			if(safetyData.sslbdate != null){
	        				var cnvrtDate = new Date(safetyData.sslbdate);
	        				$scope.launchDateSSL = (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear();
	        			} 
	        			
                        //Other Reports Data
 	                    $scope.otherReportsData = response.data.data[0].safetyOtherReportsData;
 	                    if($scope.otherReportsData.length > 0) {
 	                    	$scope.nearMissReports = $scope.otherReportsData;
 						}
 	                    
         		        // M: Section
         		        $scope.drillReportSectionData = response.data.data[0].safetyDrillAttachments;
         		       
 		       		 	// CREW HEALTH REPORTS
 		       	        $scope.crewHealthReports = [];
 		       	        $scope.crewHealthReports = response.data.data[0].crewHealthMasterData; 

	        			if(safetyData.meetingdate != null){
	        				var cnvrtDate = new Date(safetyData.meetingdate);
	        				var ampm = (cnvrtDate.getUTCHours() >= 12) ? "PM" : "AM";
	        				var hours = (cnvrtDate.getUTCHours() > 12) ? (cnvrtDate.getUTCHours() - 12) : (cnvrtDate.getUTCHours());
	        				$scope.dateTime =  ((cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear()+" "+ hours +":"+cnvrtDate.getUTCMinutes()+" "+ampm );
	        			} else{
	        				var cnvrtDate = new Date();
	        				var ampm = (cnvrtDate.getHours() >= 12) ? "PM" : "AM";
	        				var hours = (cnvrtDate.getHours() > 12) ? (cnvrtDate.getHours() - 12) : (cnvrtDate.getHours());
	        				$scope.dateTime =  ((cnvrtDate.getMonth()+1)+"/"+cnvrtDate.getDate()+"/"+cnvrtDate.getFullYear()+" "+ hours +":"+cnvrtDate.getMinutes()+" "+ampm );
	        				$scope.fetchNearMissData();
	        			}
	            		        			
	        			$scope.portSSL = safetyData.sslbportcode;
	        			$scope.portPSL = safetyData.pslbportcode;
	        			
	        			if($scope.portSSL != "" && $scope.portSSL != null  && $scope.portSSL != undefined ) {
	    					safetyReportService.getPortname($scope.portSSL).then(function(response) {    					
	    						$scope.portSSLName = response.data[0]; 
	    					});  
	        			}	
	    				
	    				if($scope.portPSL != "" && $scope.portPSL != null  && $scope.portPSL != undefined ) {
	    					safetyReportService.getPortname($scope.portPSL).then(function(response) {    					
	    						$scope.portPSLName = response.data[0]; 
	    					});  
	    				}
	    				
	        			$scope.calculateRisk("ppm");
	        	
	        			
	        			// SET SAFETY TOPICS TABLE
            			if(response.data.data[0].safetyTopicData.length > 0) {
            				$scope.safetyTopics = response.data.data[0].safetyTopicData;
            			} else {
            				$scope.safetyTopics = [{"topiccode": "", "topicdesc" : ""}];
            			}
	            		
            			if(response.data.data[0].safetyInformationData.length > 0) {
            				$scope.revisionsCirculars = response.data.data[0].safetyInformationData;
            			} else {
            				$scope.revisionsCirculars = [ {"information": ""} ];
            			}	
            			
            			if(response.data.data[0].safetyCompletedFindingsData.length > 0) {
            				$scope.findings  = response.data.data[0].safetyCompletedFindingsData;
            			} else {
            				$scope.findings = [{'completedfinding':""}];
            			}
	            		
            			if(response.data.data[0].safetyAuditFindingsData.length > 0) {	
            				$scope.auditfindings = response.data.data[0].safetyAuditFindingsData;
            			} else {
            				$scope.auditfindings = [ {'auditfinding' : ""} ];	
            			}
	            		
            			if(response.data.data[0].safetyRegulationsData.length > 0) {
            				$scope.regulations = response.data.data[0].safetyRegulationsData;
            			} else {
            				$scope.regulations = [{'regulationdesc':""}];	
            			}
            			
	            		$scope.crewHealthIds = [];
            			for( i= 0 ; i < response.data.data[0].safetyCrewHealthAttachmentsData.length ; i++) {
            				var obj = {
        						'id' : response.data.data[0].safetyCrewHealthAttachmentsData[i][0],
        						'date': response.data.data[0].safetyCrewHealthAttachmentsData[i][1]
            				}
            				$scope.crewHealthIds.push(obj);
            			}
            			
            			var fetchedSafetyConcerns = response.data.data[0].safetyConcernData;
            			$scope.safetyConcerns = [];
            			for(i = 0 ; i < fetchedSafetyConcerns.length ; i++) {
            				$scope.safetyConcerns.push(fetchedSafetyConcerns[i][0]);
            				$scope.safetyConcerns[i].assgndtocode = [ fetchedSafetyConcerns[i][0].assgndtocode, fetchedSafetyConcerns[i][2]];
            			}    			
	            		
            			if(response.data.data[0].safetyHealthMeasuresData.length > 0) {
            			$scope.crewHealthMeasures = response.data.data[0].safetyHealthMeasuresData;
            			} else {
            				$scope.crewHealthMeasures = [{'helthmeasure':""}];
            			}

            			if(response.data.data[0].safetyComplaintReviewData.length > 0) {
            				$scope.crewComplaints = response.data.data[0].safetyComplaintReviewData;
            			} else {
            				$scope.crewComplaints = [{'complaintsreview':""}];
            			}
	            		
            			if(response.data.data[0].safetyRiskReviewData.length > 0) {
            				$scope.riskReviews = response.data.data[0].safetyRiskReviewData;
            			} else { 
            				$scope.riskReviews = [{'riskreview':""}];
            			}
	            		
	            		var countList = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
            			var fetchedSignatures = response.data.data[0].safetyCommiteeSignData;
            			var sigids = ["sig1main", "sig2main", "sig3main", "sig4main", "sig5main", "sig6main", "sig7main", "sig8main"]
            			for(i = 0 ; i < fetchedSignatures.length ; i++) {
            				var rank_string = "addedDesignation" + countList[i];
            				var emp_string = "rankHolder" + countList[i];
            				$scope.existingSignatures.push(fetchedSignatures[i][0].signdetail);
            				$scope[rank_string] = fetchedSignatures[i][0].rankcode;
            				$scope[emp_string] = [ fetchedSignatures[i][0].empcode, fetchedSignatures[i][2]];
            				$scope.signatures[sigids[i]] = fetchedSignatures[i][0].signdetail;
            			}
            			
        			    setSignatures();
	            			            		
            			var fetchedSafetyInjuryDetails = response.data.data[0].safetyInjuryDetailsData;
            			injuryCount  = 0 ; 
            			nonInjuryCount = 0 ; 
            			nonInjuryDentalCount = 0;
            			
            			$scope.injuries = [];
            			$scope.nonInjuries= [];
            			$scope.nonInjuriesDental = [];
            			
            			for(i=0;i<fetchedSafetyInjuryDetails.length;i++) {
            				
            				if(fetchedSafetyInjuryDetails[i][0].injurytype === 1) {
            					$scope.injuries.push(fetchedSafetyInjuryDetails[i][0]);
                		        $scope.injuries[injuryCount].empcode = [ fetchedSafetyInjuryDetails[i][0].empcode, fetchedSafetyInjuryDetails[i][2]];
                		        injuryCount++;
            				}
            				
            				if(fetchedSafetyInjuryDetails[i][0].injurytype === 2) {
            					$scope.nonInjuries.push(fetchedSafetyInjuryDetails[i][0]);
            					
            					$scope.nonInjuries[nonInjuryCount].empcode = [ fetchedSafetyInjuryDetails[i][0].empcode, fetchedSafetyInjuryDetails[i][2]];
            					nonInjuryCount++;
            				}
            				
            				if(fetchedSafetyInjuryDetails[i][0].injurytype === 3) {
            					$scope.nonInjuriesDental.push(fetchedSafetyInjuryDetails[i][0]);
            					$scope.nonInjuriesDental[nonInjuryDentalCount].empcode = [fetchedSafetyInjuryDetails[i][0].empcode, fetchedSafetyInjuryDetails[i][2]];
            					nonInjuryDentalCount++;
            				}
            			}     			    			
	            		 		
	            		$scope.trainingConducts = [];
	            		$scope.videoTrainings= [];
            			if(response.data.data[0].safetyTrainingData.length > 0) {
        	    			for(i=0; i < response.data.data[0].safetyTrainingData.length ; i++) {

        	    				var cnvrtDate = new Date(response.data.data[0].safetyTrainingData[i].trainingdate);
        	    				var ampm = (cnvrtDate.getUTCHours() >= 12) ? "PM" : "AM";
        	    				var hours = (cnvrtDate.getUTCHours() > 12) ? (cnvrtDate.getUTCHours() - 12) : (cnvrtDate.getUTCHours());
        	    				response.data.data[0].safetyTrainingData[i].trainingdate =  ((cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear()+" "+ hours +":"+cnvrtDate.getUTCMinutes()+" "+ampm );
        	    				
        	    				if (response.data.data[0].safetyTrainingData[i].trainingtype === 1 && response.data.data[0].safetyTrainingData[i].trainingname) {
        	    					$scope.trainingConducts.push(response.data.data[0].safetyTrainingData[i]);
        	    				} else if(response.data.data[0].safetyTrainingData[i].trainingname) {
        	    					$scope.videoTrainings.push(response.data.data[0].safetyTrainingData[i]);
        	    				}
        	    			}
            			} else {
            		        $scope.videoTrainings = [{"trainingdate":"" , "trainingname":"" , "trainingtype": 2}];
            		        $scope.trainingConducts = [{"trainingdate":"" , "trainingname":"" , "trainingtype": 1}];
            			}

        		       if($scope.trainingConducts.length === 0) {
        		              $scope.trainingConducts = [{"trainingdate":"" , "trainingname":"" , "trainingtype": 1}];
        		       }
        		       
        		       if($scope.videoTrainings.length === 0) {
        		              $scope.videoTrainings = [{"trainingdate":"" , "trainingname":"" , "trainingtype": 2}];
        		       }
        		       
        		        // B: Outstanding Items
        		       $scope.outstandingItems = [];
        		       $scope.outstandingItems = response.data.data[0].outstandingItemsData;
        		       $rootScope.showScreenOverlay = false;
        		       
        		       
	            	} else {
	            		$rootScope.showScreenOverlay = false;
	            		$scope.errordetails = response.data.exceptionDetail;
	                	$scope.showexception = response.data.showerrormessage
	                	$scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;	
						$scope.dataerror = [response.data.message[0]]; 	
					}  
	            });
		 	}, function(error){	
		 	$rootScope.showScreenOverlay = false;
			  $scope.dataerror = "Server not reached";
		  })
		  
		/**************************************************************************************/  
	var setSignatures = function() {
		var img1 = document.createElement('IMG');
		var img2 = document.createElement('IMG');
		var img3 = document.createElement('IMG');
		var img4 = document.createElement('IMG');
		var img5 = document.createElement('IMG');
		var img6 = document.createElement('IMG');
		var img7 = document.createElement('IMG');
		var img8 = document.createElement('IMG');
		img1.onload = function () {
			var ctx = document.getElementById("sig1").getContext('2d');
		    ctx.drawImage(img1, 0, 0,300, 150);
		}
		img2.onload = function () {
			var ctx = document.getElementById("sig2").getContext('2d');
		    ctx.drawImage(img2, 0, 0,300, 150);
		}
		img3.onload = function () {
			var ctx = document.getElementById("sig3").getContext('2d');
		    ctx.drawImage(img3, 0, 0,300, 150);
		}
		img4.onload = function () {
			var ctx = document.getElementById("sig4").getContext('2d');
		    ctx.drawImage(img4, 0, 0,300, 150);
		}
		img5.onload = function () {
			var ctx = document.getElementById("sig5").getContext('2d');
		    ctx.drawImage(img5, 0, 0,300, 150);
		}
		img6.onload = function () {
			var ctx = document.getElementById("sig6").getContext('2d');
		    ctx.drawImage(img6, 0, 0,300, 150);
		}
		img7.onload = function () {
			var ctx = document.getElementById("sig7").getContext('2d');
		    ctx.drawImage(img7, 0, 0,300, 150);
		}
		img8.onload = function () {
			var ctx = document.getElementById("sig8").getContext('2d');
		    ctx.drawImage(img8, 0, 0,300, 150);
		}
		
		img1.src = "data:image/png;base64,"+$scope.existingSignatures[0];
		img2.src = "data:image/png;base64,"+$scope.existingSignatures[1];
		img3.src = "data:image/png;base64,"+$scope.existingSignatures[2];
		img4.src = "data:image/png;base64,"+$scope.existingSignatures[3];
		img5.src = "data:image/png;base64,"+$scope.existingSignatures[4];
		img6.src = "data:image/png;base64,"+$scope.existingSignatures[5];
		img7.src = "data:image/png;base64,"+$scope.existingSignatures[6];
		img8.src = "data:image/png;base64,"+$scope.existingSignatures[7];
	}
	 
    $scope.hideError = function(field) {
    	var fieldName = field + "RequiredError";
    	var rootName = field + "RootError";
    	$scope[fieldName] =  false;
    	$scope[rootName] =  false;
    }	
    	
  	$scope.signatures = {};
    	$scope.existingSignatures = [];
    
    	//Crew Health Reports
    	$scope.crewHealthIds = [];
    	$scope.showCrewHealthModal = false;

    	$scope.openCrewHealthModal = function() {
    		$scope.showCrewHealthModal = true;
    	}
    	
    	$scope.closeCrewHealthModal = function() {
    		$scope.showCrewHealthModal = false;
    	}
    	
        $scope.deleteCrewHealthId = function(index) {
        	$scope.crewHealthIds.splice(index , 1);
        }

	   function checkPresentInCrewHealthList(crewHealthId) {
	    	for(i = 0; i < $scope.crewHealthIds.length ; i++) {
	    		if($scope.crewHealthIds[i].id === crewHealthId) {
	    			return i;
	    		}
	    	}
	    	return -1;
	    }
	    
	    $scope.toggleCrewHealthSelect = function(crewHealthId, crewHealthDate){	
	    	var present = checkPresentInCrewHealthList(crewHealthId);
	    	if( present === -1 ){	
	    		var obj = {'id': crewHealthId,'date': crewHealthDate};
	    		$scope.crewHealthIds.push(obj);
	        } else {				        	
	        	$scope.crewHealthIds.splice(present , 1);
	        }
	    }

	    $scope.toggleCrewHealthLabel = function(crewHealthId){
	    	present = checkPresentInCrewHealthList(crewHealthId);
	        if(present === -1 ){				        	
	            return "Select";
	        } else{				        	
	            return "Selected";
	        }
	    }

    	$scope.viewFlag = false;   	    	
    	$scope.digitalSignatures =function(arg1,arg2,arg3){
    		$scope.signatures[arg3] = arg1;
    	}
    	
    	/**************************ATTACHMENTS************************************/
        function countActiveFiles() {
            $scope.activeFileCount = 0;
            for (i = 0; i < $scope.filesData.length; i++) {
                if ($scope.filesData[i].docstatus === 'A') {
                    $scope.activeFileCount++;
                }
            }
        }

        $scope.myFile = [];
        $rootScope.showScreenOverlay = false;

        $scope.uploadFile = function() {
        	$rootScope.showScreenOverlay = true;   
           	$scope.filemsg_error="";
               var file = $scope.myFile;
               if ($scope.myFile.length + $scope.activeFileCount > $scope.maxFileCount) {
                   $scope.exceededFileCountDialog.open();
                   $rootScope.showScreenOverlay = false;
                   return;
               }
               
               var listuplaod = [];
               
               var filesformdata = new FormData();
               filesformdata.append("formNumber", $scope.safetyrecordid);
               filesformdata.append("mdlCode", "SAF");
               filesformdata.append("attachmentTypeFolder", "Form Attachments");
               
               for (i = 0; i < $scope.myFile.length; i++) {
               	if (($scope.myFile[i]._file.name).split('.')[1]=='sql'){
               		thowsUnsupportedFileError($scope.myFile[i]._file.name);
               		$rootScope.showScreenOverlay = false;
               		 return;
               	}
               	
                   if ($scope.myFile[i]._file.size <= $scope.maxFileSize * 1048576) {
                       filesformdata.append('file'+i, $scope.myFile[i]._file);
                       $scope.hideFilesFlag = false; 
                          
                   } else {
                       thowsFileSizeExceededError($scope.myFile[i]._file.name);
                       $rootScope.showScreenOverlay = false;
                       return;
                   }
               };      
                       
                       var request = {
                           method: 'POST',
                           url: '/safetyreport/uploadDocuments/',
                           data: filesformdata,
                           transformRequest: angular.identity,
                           headers: {
                               'Content-Type': undefined
                           }
                       };

                       // SEND THE FILES.
                       $http(request)
                           .then(function(response) {
                           	$scope.geterrormessages=response.data.message;	
            	                $scope.geterrorstatus=response.data.errorstatus;
            	                $scope.geterrorstatuscode=response.data.status;                
            	                $scope.dataerror =response.data.message;                 
            	            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
                               $http({
                                   method: 'POST',
                                   url: "/safetyreport/fetchDocuments/",
                                   data: {
                                       "formNumber": $scope.safetyrecordid
                                   }
                               }).then(
                                   function(response) {
                                     	$scope.geterrormessages=response.data.message;	
            	 	   	                $scope.geterrorstatus=response.data.errorstatus;
            	 	   	                $scope.geterrorstatuscode=response.data.status;                
            	 	   	                $scope.dataerror =response.data.message;                 
            	 	   	            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
            	 	    		             $scope.filesData = response.data.data;
            	 	    		             countActiveFiles();
            	 	    		           $rootScope.showScreenOverlay = false;
            	 	   	           }else{
            	 	   	        	$rootScope.showScreenOverlay = false;
            	 	            		$scope.errordetails=response.data.exceptionDetail;
            	 	                	$scope.showexception=response.data.showerrormessage
            	 	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
            	 						$scope.dataerror = [response.data.message[0]]; 	
            	 					}
            	 	    		       });
            	            	}else{
            	            		$rootScope.showScreenOverlay = false;
            	            		$scope.errordetails=response.data.exceptionDetail;
            	                	$scope.showexception=response.data.showerrormessage
            	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
            						$scope.dataerror = [response.data.message[0]]; 	
            					}
            	       		     
                           });

               $scope.myFile = [];
           }; 

        $scope.removeFile = function(index) {
            $scope.myFile.splice(index, 1);
        }

        //Remove Document
        function removeDocument() {
            $http({
            	url: "/safetyreport/removeDocument/?docId=" + $scope.deleteDocId+"&formId="+$scope.safetyrecordid,
                dataType: 'json',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
            	 $scope.geterrormessages=response.data.message;	
                 $scope.geterrorstatus=response.data.errorstatus;
                 $scope.geterrorstatuscode=response.data.status;                
                 $scope.dataerror =response.data.message;    
    		if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 	     
                $http({
                    method: 'POST',
                    url: "/safetyreport/fetchDocuments/",
                    data: {"formNumber": $scope.safetyrecordid}
                }).then(
                    function(response) {
                    	$scope.geterrormessages=response.data.message;	
      	                $scope.geterrorstatus=response.data.errorstatus;
      	                $scope.geterrorstatuscode=response.data.status;                
      	                $scope.dataerror =response.data.message;    
                  	   if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
                        $scope.filesData = response.data.data;
                        countActiveFiles();
                  	 }else{
    	            		$scope.errordetails=response.data.exceptionDetail;
    	                	$scope.showexception=response.data.showerrormessage
    	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
    						$scope.dataerror = [response.data.message[0]]; 	
    					}
                    });
    			   }else{
               		$scope.errordetails=response.data.exceptionDetail;
                   	$scope.showexception=response.data.showerrormessage
                   	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
       				$scope.dataerror = [response.data.message[0]]; 	
       			}
            });
        };
        /****************************************************************************/
    	
    	// COMMUNICATION WINDOW
    	$scope.updateChat = function() {
    		 if (!$scope.msg){
    			 return null;
    		 }
    		 chat_data = {
	    				    'message': $scope.msg,
	    				    'formSerialId': $scope.safetyrecordid
    				    };
    		  $http({
    			  url: "/get-safety-chat-submission/",
    		      dataType: 'json',
    		      method: 'POST',
    		      data: chat_data,
    		      headers: {
    		          "Content-Type": "application/json"
    		      }
    		  }).then(function(response) {
    		      $http({
    		             method: 'POST',
    		             url: "/get-safety-chat-data-by-no/",
    		             data: $scope.safetyrecordid
    		         }).then(
    		             function(response) {
    		               $scope.chatdata = response.data;
    		               $scope.msg = "";
    		               setTimeout(function () {
    		            	   communication = document.getElementById('communication-window');
    		            	   communication.scrollTop  = communication.scrollHeight;
    		           }, 1);
    		               communication = document.getElementById('communication-window');
    		               communication.scrollTop  = communication.scrollHeight;
    		       })
    		  });
    		 };
    	
        // UTILS

    	function formatDate(date) {
    		date = new Date(date);
			return date.getMonth() + 1 + '/' + date.getDate() + "/" + date.getFullYear();
    	}
    	
        $scope.calculateRisk = function(id) {
            if ($scope.ppm > 1) {
                document.getElementById(id).style.backgroundColor = 'rgba(173, 10, 10, 0.42)';
            } else {
                document.getElementById(id).style.backgroundColor = 'white';
            }
        }
          	
        $scope.officeStaffAttendence = [];

        $scope.fetchAssignee2 = function() {
        	if($scope.vesselCode != undefined) {
	            safetyReportService.getEmployee($scope.addedInjuryRank, $scope.vesselCode).then(function(response) {
	                $scope.addedInjuryName = response.data[0];
	            });
        	}
        	$scope.addedInjuryRankRequiredError = false;
        }

        $scope.fetchAssignee3 = function() {
        	if($scope.vesselCode != undefined) {
	            safetyReportService.getEmployee($scope.addedNonInjuryRank, $scope.vesselCode).then(function(response) {
	                $scope.addedNonInjuryName = response.data[0];
	            });
        	}
        	$scope.addedNonInjuryRankRequiredError = false;
        }

        $scope.fetchAssignee4 = function() {
        	if($scope.vesselCode != undefined) {
	            safetyReportService.getEmployee($scope.addedNonInjuryRankDental, $scope.vesselCode).then(function(response) {
	                $scope.addedNonInjuryNameDental = response.data[0];
	            });
        	}   
        	$scope.addedNonInjuryRankDentalRequiredError = false;
        }

        $scope.dateTime;

        $scope.meetingType;

        $scope.isOfficeStaffAttendence;
        $scope.nonAttendees = [];
        $scope.remark;

        // A
        $scope.isReviewedMinutesofPrevMeet;

        // C: Safety Topics
        $scope.addSafetyTopic = function() {
            if (($scope.safetyTopics.length + 1) <= 15) {
            	ind = $scope.safetyTopics.length-1;
                if ($scope.safetyTopics[ind].topiccode !== '' &&
                	$scope.safetyTopics[ind].topiccode !== undefined &&
                	$scope.safetyTopics[ind].topicdesc !== undefined &&
                	$scope.safetyTopics[ind].topicdesc !== '') {

                    var obj = {
                        'topiccode': "",
                        'topicdesc': ""
                    }

                    $scope.safetyTopics.push(obj);
                    $scope.safetyTopicsRequiredError = false;

                }
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deleteSafetyTopic = function(index) {
        	if($scope.safetyTopics.length > 1) {
        		$scope.safetyTopics.splice(index, 1);
        	}
        }

        // D: KLQSMS Revisions, Circulars 
        $scope.addrevisionsCirculars = function() {
            if (($scope.revisionsCirculars.length + 1) <= 15) {
        			ind = $scope.revisionsCirculars.length-1;
        			if($scope.revisionsCirculars[ind].information) {    
        				var dataObj = {information: ''};
        				$scope.revisionsCirculars.push(dataObj);
        				$scope.revisionsCircularsRequiredError = false;
        			} 
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }

        
        $scope.deleterevisionsCirculars = function(index) {
        	if($scope.revisionsCirculars.length > 1) {
        		$scope.revisionsCirculars.splice(index, 1);
        	}
        }

        // E: Result of testing in drinking water:
        $scope.testingDate;
        $scope.ppm;

        // F: Findings from completed safety inspection 
        $scope.addfindings = function() {
            if (($scope.findings.length + 1) <= 15) {
            	ind = $scope.findings.length-1;
                if ($scope.findings[ind].completedfinding !== '' &&
                	$scope.findings[ind].completedfinding !== undefined) {

                    var obj = {
                        'completedfinding': ""
                    }
                    
                    $scope.findings.push(obj);
                    $scope.findingsRequiredError = false;
                } 
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deletefindings = function(index) {
        	if($scope.findings.length > 1) {
        		$scope.findings.splice(index, 1);
        	}
        }
 
        // G: Near Miss Data
        $scope.nearMissReports = [];
        $scope.fetchNearMissData = function() {
        	$rootScope.showScreenOverlay = true;
        	var currentDate = Date.parse($scope.dateTime);
        	var dateTime = angular.copy($scope.dateTime);
        	dateTime = new Date(dateTime);
            safetyReportService.getNearMissReports(dateTime,  $scope.safetyrecordid, $scope.vesselCode, new Date().getTimezoneOffset()).then(function(response) {
            $scope.nearMissReports= response.data;
            $rootScope.showScreenOverlay = false;
            }); 
            
            $scope.fetchDrillReportData();
            
            safetyReportService.getCrewHealthReportSectionData(dateTime,  $scope.safetyrecordid)
            .then(function(response) {
            	$scope.crewHealthReports =  response.data;
	            	
	           	 toaster.success({
	                 title: "Information",
	                 body: " Section G  (Near miss, Accident, Near miss Share) & Section M (Drill report) updated."
	             });
	        	 
	        	 
	        	 if($scope.crewHealthIds.length > 0) {
	        		 $scope.updateCrewSectionInfo.open();
	        	 }
        	 
            });
            
            
        }
        
        
        // M: Drill Report Data
        $scope.drillReportSectionData = [];
        $scope.fetchDrillReportData = function() {
        	$rootScope.showScreenOverlay = true;
        	var currentDate = Date.parse($scope.dateTime);
        	var dateTime = angular.copy($scope.dateTime);
        	dateTime = new Date(dateTime);
            safetyReportService.getDrillReportSectionData(dateTime,  $scope.safetyrecordid, new Date().getTimezoneOffset()).then(function(response) {
            $scope.drillReportSectionData = response.data;
            $rootScope.showScreenOverlay = false;
            }); 
        }
       

        // H: Findings from audit & inspection reports
        $scope.addauditfindings = function() {
            if (($scope.auditfindings.length + 1) <= 15) {
            	ind = $scope.auditfindings.length-1;
                if ($scope.auditfindings[ind].auditfinding !== '' &&
                    $scope.auditfindings[ind].auditfinding !== undefined) {

                    var obj = {
                        'auditfinding': ""
                    }

                    $scope.auditfindings.push(obj);
                    $scope.auditfindingsRequiredError = false;
                }
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deleteauditfindings = function(index) {
        	if($scope.auditfindings.length > 1) {
        		$scope.auditfindings.splice(index, 1);
        	}
        }

        // I:  New regulations or amendments
        $scope.addregulations = function() {
            if (($scope.regulations.length + 1) <= 15) {
            	ind = $scope.regulations.length-1;
                if ($scope.regulations[ind].regulationdesc !== '' &&
                	$scope.regulations[ind].regulationdesc !== undefined) {

                    var obj = {
                        'regulationdesc': ""
                    }

                    $scope.regulations.push(obj);
                    $scope.regulationsRequiredError = false;
                } 
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deleteregulations = function(index) {
        	if($scope.regulations.length >  1) {
        		$scope.regulations.splice(index, 1);
        	}
        }
        
        $scope.addedSafetyConcernsAssignee;
	        $scope.fetchAssignee = function() { 
	            safetyReportService.getEmployee($scope.addedSafetyConcernsRank, $scope.vesselCode).then(function(response) {
	            	$scope.addedSafetyConcernsAssignee = response.data[0];                
	            });
	            $scope.addedSafetyConcernsRankRequiredError = false;
	        }

        // J(1): Safety concerns raised and suggestions
        function clearSafetyConcernsValidationCheckErrors() {
        	$scope.addedSafetyConcernsRequiredError = false;  
        	$scope.addedSafetyConcernsDateRequiredError = false; 
        	$scope.addedSafetyConcernsActionRequiredError = false;   
        	$scope.addedSafetyConcernsRankRequiredError = false;   
        	$scope.addedSafetyConcernsPriorityRequiredError = false;   
        }
        
        function safetyConcernsValidationCheck() {
        	if(!$scope.addedSafetyConcernsRank || $scope.addedSafetyConcernsRank === undefined) {        		
        		$scope.addedSafetyConcernsRankRequiredError = true;
        	} else {
        		$scope.addedSafetyConcernsRankRequiredError = false;
        	}
        	
        	if($scope.addedSafetyConcerns === '' || $scope.addedSafetyConcerns === undefined) {
        		$scope.addedSafetyConcernsRequiredError= true;  
        	} else {
        		$scope.addedSafetyConcernsRequiredError = false; 
        	}
        	
        	if($scope.addedSafetyConcernsAction=== '' || $scope.addedSafetyConcernsAction === undefined) {
        		$scope.addedSafetyConcernsActionRequiredError = true;  
        	} else {
        		$scope.addedSafetyConcernsActionRequiredError = false; 
        	}
        	
        	if($scope.addedSafetyConcernsDate === '' || $scope.addedSafetyConcernsDate === null || $scope.addedSafetyConcernsDate === undefined) {
        		$scope.addedSafetyConcernsDateRequiredError = true;  
        	} else if(Date.parse($scope.addedSafetyConcernsDate ) < todayDate) {
            	$scope.addedSafetyConcernsDateRootError = true;
        	} else {
        		$scope.addedSafetyConcernsDateRequiredError = false;
        		$scope.addedSafetyConcernsDateRootError = false;
        	}
        	
        	if(!$scope.addedSafetyConcernsPriority) {
        		$scope.addedSafetyConcernsPriorityRequiredError = true;  
        	} else {
        		$scope.addedSafetyConcernsPriorityRequiredError = false;
        	}
        }
        
        $scope.clearsafetyConcern = function() {
            $scope.addedSafetyConcerns = '';
            $scope.addedSafetyConcernsDate = '';
            $scope.addedSafetyConcernsAction = '';
            $scope.addedSafetyConcernsAssignee = '';
            $scope.addedSafetyConcernsRank = '';
            $scope.addedSafetyConcernsPriority = '';
            $scope.isUpdateSafetyConcern = false;
            
            clearSafetyConcernsValidationCheckErrors();
        }

        $scope.safetyConcerns = [];
        $scope.addsafetyConcern = function() {
            if ($scope.addedSafetyConcerns !== '' &&
                $scope.addedSafetyConcerns !== undefined &&
                $scope.addedSafetyConcernsRank !== '' &&
                $scope.addedSafetyConcernsDate !== null &&
                $scope.addedSafetyConcernsDate !==  undefined &&
                $scope.addedSafetyConcernsAction !== '' &&
                $scope.addedSafetyConcernsAction !== undefined &&
                $scope.addedSafetyConcernsAssignee !== '' &&
                $scope.addedSafetyConcernsAssignee !== undefined &&
                $scope.addedSafetyConcernsPriority !== '' &&
                $scope.addedSafetyConcernsPriority !== undefined &&
                (Date.parse($scope.addedSafetyConcernsDate ) > todayDate)) {
                var obj = {
                    'safconcern': $scope.addedSafetyConcerns,
                    'rankcode': $scope.addedSafetyConcernsRank,
                    'targetdate': new Date($scope.addedSafetyConcernsDate),
                    'actionreq': $scope.addedSafetyConcernsAction,
                    'assgndtocode': $scope.addedSafetyConcernsAssignee,
                    'prioritycode': $scope.addedSafetyConcernsPriority
                }
                
    	        if($scope.isUpdateSafetyConcern === true) {
    	        	$scope.safetyConcerns[$scope.safetyConcernIndex].safconcern = $scope.addedSafetyConcerns;
    	        	$scope.safetyConcerns[$scope.safetyConcernIndex].rankcode = $scope.addedSafetyConcernsRank;
    	        	$scope.safetyConcerns[$scope.safetyConcernIndex].targetdate = new Date($scope.addedSafetyConcernsDate);
    	        	$scope.safetyConcerns[$scope.safetyConcernIndex].actionreq = $scope.addedSafetyConcernsAction;
    	        	$scope.safetyConcerns[$scope.safetyConcernIndex].assgndtocode = $scope.addedSafetyConcernsAssignee;
    	        	$scope.safetyConcerns[$scope.safetyConcernIndex].prioritycode = $scope.addedSafetyConcernsPriority;
    	        	$scope.isUpdateSafetyConcern = false;
    	        } else {
    	        	$scope.safetyConcerns.push(obj);
    	        } 
                               
                $scope.clearsafetyConcern();
                
                clearSafetyConcernsValidationCheckErrors();
            } else {
            	safetyConcernsValidationCheck(); 
            }
        }
        
        $scope.editSafetyConcerns = function(index) {
        	$scope.isUpdateSafetyConcern = true;
        	$scope.addedSafetyConcerns = $scope.safetyConcerns[index].safconcern;
        	$scope.addedSafetyConcernsRank = $scope.safetyConcerns[index].rankcode;
        	var cnvrtDate = new Date($scope.safetyConcerns[index].targetdate);
        	$scope.addedSafetyConcernsDate = (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear() ;
        	$scope.addedSafetyConcernsAction = $scope.safetyConcerns[index].actionreq;
            $scope.addedSafetyConcernsAssignee = $scope.safetyConcerns[index].assgndtocode;
            $scope.addedSafetyConcernsPriority = $scope.safetyConcerns[index].prioritycode;
            $scope.safetyConcernIndex = index;
        
        }
        
        $scope.deleteSafetyConcerns = function(index) {        	
            $scope.safetyConcerns.splice(index, 1);
            $scope.clearsafetyConcern();
        }

        // J(2): Review crew health & measures
        $scope.addcrewHealthMeasure = function() {
            if (($scope.crewHealthMeasures.length + 1) <= 15) {
            	ind = $scope.crewHealthMeasures.length-1;
                if ($scope.crewHealthMeasures[ind].helthmeasure !== '' &&
                	$scope.crewHealthMeasures[ind].helthmeasure !== undefined) {

                    var obj = {
                        'helthmeasure': ""
                    }

                    $scope.crewHealthMeasures.push(obj);
                    $scope.crewHealthMeasuresRequiredError = false;
                } 
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deletecrewHealthMeasures = function(index) {
        	if($scope.crewHealthMeasures.length > 1) {
        		$scope.crewHealthMeasures.splice(index, 1);
        	}
        }

        // J(3): Review of crew complaints
        $scope.addcrewComplaint = function() {
            if (($scope.crewComplaints.length + 1) <= 15) {
            	ind = $scope.crewComplaints.length-1;
                if ($scope.crewComplaints[ind].complaintsreview !== '' &&
                	$scope.crewComplaints[ind].complaintsreview !== undefined) {
                    var obj = {
                        'complaintsreview': ""
                    }

                    $scope.crewComplaints.push(obj);
                    $scope.crewComplaintsRequiredError = false;
                } 
            } else {
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deletecrewComplaint = function(index) {
        	if($scope.crewComplaints.length > 1) {
        		$scope.crewComplaints.splice(index, 1);
        	}
        }

        // K: Review of the risk assessment process
        $scope.addriskReview = function() {
            if (($scope.riskReviews.length + 1) <= 15) {
            	ind = $scope.riskReviews.length-1;
                if ($scope.riskReviews[ind].riskreview !== '' &&
                		$scope.riskReviews[ind].riskreview !== undefined) {

                    var obj = {
                    		'riskreview' : ""
                    }
                    
                    $scope.riskReviews.push(obj);
                    $scope.riskReviewsRequiredError = false;
                } 
            } else {
            	exceededRowsDialogMsg
            	$scope.exceededRowsdialog.open();
            }
        }
        
        $scope.deleteriskReview = function(index) {
        	if($scope.riskReviews.length > 1) {
        		$scope.riskReviews.splice(index, 1);
        	}
        }

        // L(1): Record of all accidental injuries

        $scope.clearinjury = function() {
            $scope.addedInjuryName = '';
            $scope.addedInjuryDetails = '';
            $scope.addedInjuryRemark = '';
            $scope.addedInjuryWorktimeLoss = '';
            $scope.addedInjuryRank = "";
            $scope.addedInjuryWorktimeLossHours = "";
            $scope.addedInjuryDate = "";
            $scope.isUpdateInjury= false;
            clearValidationCheckErrors();
        }
        
        function clearValidationCheckErrors() {
        	$scope.addedInjuryRankRequiredError = false;  
        	$scope.addedInjuryDetailsRequiredError = false; 
        	$scope.addedInjuryRemarkRequiredError = false;   
        	$scope.addedInjuryDateRequiredError = false;   
        	$scope.addedInjuryWorktimeLossRequiredError = false; 
        }
        
        function injuryValidationCheck() {
        	if(!$scope.addedInjuryRank || $scope.addedInjuryRank === undefined) {        		
        		$scope.addedInjuryRankRequiredError = true;
        	} else {
        		$scope.addedInjuryRankRequiredError = false;
        	}
        	
        	if($scope.addedInjuryDetails === '' || $scope.addedInjuryDetails === undefined) {
        		$scope.addedInjuryDetailsRequiredError = true;  
        	} else {
        		$scope.addedInjuryDetailsRequiredError = false; 
        	}
        	
        	if($scope.addedInjuryRemark === '' || $scope.addedInjuryRemark === undefined) {
        		$scope.addedInjuryRemarkRequiredError = true;  
        	} else {
        		$scope.addedInjuryRemarkRequiredError = false; 
        	}
        	
        	if($scope.addedInjuryDate === '' || $scope.addedInjuryDate === undefined) {
        		$scope.addedInjuryDateRequiredError = true;  
        	} else if(Date.parse($scope.addedInjuryDate ) > todayDate) {
            	$scope.addedInjuryDateRootError = true;
        	} else {
        		$scope.addedInjuryDateRequiredError = false;
        		$scope.addedInjuryDateRootError = false;
        	}
        	
        	if($scope.addedInjuryWorktimeLoss ===  undefined || $scope.addedInjuryWorktimeLoss === '') {
        		$scope.addedInjuryWorktimeLossRequiredError = true;  
        	} else {
        		$scope.addedInjuryWorktimeLossRequiredError = false; 
        	}
        	
        }

        $scope.injuries = [];
        var injuryDetailsTypeOne = 1;
        $scope.addinjury = function() {
            $scope.addedInjuryRank = document.getElementsByClassName("injury-rank")[0].value;
            if ($scope.addedInjuryRank !== '' &&
                $scope.addedInjuryDetails !== '' &&
                $scope.addedInjuryDetails !== undefined &&
                $scope.addedInjuryDate !== '' &&
                $scope.addedInjuryRemark !== '' &&
                $scope.addedInjuryRemark !== undefined &&
                $scope.addedInjuryWorktimeLoss !== undefined &&
                $scope.addedInjuryWorktimeLoss !== '' &&
                Date.parse($scope.addedInjuryDate ) < todayDate
            ) {
            	clearValidationCheckErrors();
            	
                if ($scope.addedInjuryWorktimeLoss === 'Y') {
                    if ($scope.addedInjuryWorktimeLossHours != '') {
                    	$scope.addedInjuryWorktimeLossHoursRequiredError = false;
                        if ($scope.addedInjuryWorktimeLossHours <= 250 
                        	&& $scope.addedInjuryWorktimeLossHours >= 0) {
                        	$scope.addedInjuryWorktimeLossHoursRootError = false;
                        } else {
                        	$scope.addedInjuryWorktimeLossHoursRootError = true;
                        	$scope.addedInjuryWorktimeLossHoursRequiredError = false;
                        	return;
                        }
                    } else {
                    	$scope.addedInjuryWorktimeLossHoursRequiredError = true;
                    	return;
                    }
                }
	
	            var obj = {
	                'rankcode': $scope.addedInjuryRank,
	                'empcode': $scope.addedInjuryName,
	                'injurydetail': $scope.addedInjuryDetails,
	                'injurydate': new Date($scope.addedInjuryDate),
	                'remark': $scope.addedInjuryRemark,
	                'islot': $scope.addedInjuryWorktimeLoss,
	                'lothrs': $scope.addedInjuryWorktimeLossHours,
	                'injurytype':  injuryDetailsTypeOne
	            }
	            
	        if($scope.isUpdateInjury === true) {
	        	$scope.injuries[$scope.injuryIndex].rankcode = $scope.addedInjuryRank;
	        	$scope.injuries[$scope.injuryIndex].empcode = $scope.addedInjuryName;
	        	$scope.injuries[$scope.injuryIndex].injurydetail = $scope.addedInjuryDetails;
	        	$scope.injuries[$scope.injuryIndex].injurydate = new Date($scope.addedInjuryDate);
	        	$scope.injuries[$scope.injuryIndex].remark = $scope.addedInjuryRemark;
	        	$scope.injuries[$scope.injuryIndex].islot = $scope.addedInjuryWorktimeLoss;
	        	
	        	if($scope.addedInjuryWorktimeLoss === 'N') {
	        		$scope.injuries[$scope.injuryIndex].lothrs = "";
	        	} else {
	        		$scope.injuries[$scope.injuryIndex].lothrs = $scope.addedInjuryWorktimeLossHours;
	        	}
	        	
	        	$scope.isUpdateInjury= false;
	        } else {
	        	 $scope.injuries.push(obj);
	        }   

	        clearValidationCheckErrors()    
            $scope.clearinjury();
            }
            else {
            	injuryValidationCheck();
            }
        
        }
        
        $scope.editInjury = function(index) {
        	$scope.isUpdateInjury= true;
        	$scope.addedInjuryRank = $scope.injuries[index].rankcode;
        	$scope.addedInjuryName = $scope.injuries[index].empcode;
        	$scope.addedInjuryDetails = $scope.injuries[index].injurydetail;
        	
        	var cnvrtDate = new Date($scope.injuries[index].injurydate);
        	$scope.addedInjuryDate = (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear() ;

        	$scope.addedInjuryRemark = $scope.injuries[index].remark;
        	$scope.addedInjuryWorktimeLoss = $scope.injuries[index].islot;
        	$scope.addedInjuryWorktimeLossHours = $scope.injuries[index].lothrs;
        	$scope.injuryIndex = index;       
       }
        
        $scope.deleteInjuries = function(index) {
            $scope.injuries.splice(index, 1);
            $scope.clearinjury();
        }

        $scope.clearNonInjury = function() {
            $scope.addedNonInjuryName = '';
            $scope.addedNonInjuryDetails = '';
            $scope.addedNonInjuryRemark = '';
            $scope.addedNonInjuryWorktimeLoss = '';
            $scope.addedInjuryDate = '';
            $scope.addedNonInjuryDate = '';
            $scope.addedNonInjuryRank = "";
            $scope.addedNonInjuryWorktimeLossHours = "";
            clearNonInjuryValidationCheckErrors();
        }

        // L(2): Non-Injury related record of all onboard illness 
        $scope.nonInjuries = [];
        $scope.addedNonInjuryWorktimeLoss;
        
        function clearNonInjuryValidationCheckErrors() {
        	$scope.addedNonInjuryRankRequiredError = false;  
        	$scope.addedNonInjuryDetailsRequiredError = false; 
        	$scope.addedNonInjuryRemarkRequiredError = false;   
        	$scope.addedNonInjuryDateRequiredError = false;   
        	$scope.addedNonInjuryWorktimeLossRequiredError = false; 
        	$scope.addedNonInjuryWorktimeLossHoursRootError = false;
        	$scope.isUpdateNonInjury= false;
        }
        
        function nonInjuryValidationCheck() {
        	if(!$scope.addedNonInjuryRank || $scope.addedNonInjuryRank === undefined) {        		
        		$scope.addedNonInjuryRankRequiredError = true;
        	} else {
        		$scope.addedNonInjuryRankRequiredError = false;
        	}
        	
        	if($scope.addedNonInjuryDetails === '' || $scope.addedNonInjuryDetails === undefined) {
        		$scope.addedNonInjuryDetailsRequiredError = true;  
        	} else {
        		$scope.addedNonInjuryDetailsRequiredError = false; 
        	}
        	
        	if($scope.addedNonInjuryRemark === '' || $scope.addedNonInjuryRemark === undefined) {
        		$scope.addedNonInjuryRemarkRequiredError = true;  
        	} else {
        		$scope.addedNonInjuryRemarkRequiredError = false; 
        	}
        	if($scope.addedNonInjuryDate === '' || $scope.addedNonInjuryDate === undefined) {
        		$scope.addedNonInjuryDateRequiredError = true;  
        	} else if(Date.parse($scope.addedNonInjuryDate ) > todayDate) {
            	$scope.addedNonInjuryDateRootError = true;
        	} else {
        		$scope.addedNonInjuryDateRequiredError = false;
        		$scope.addedNonInjuryDateRootError = false;
        	}
        	
        	if($scope.addedNonInjuryWorktimeLoss ===  undefined || $scope.addedNonInjuryWorktimeLoss === '') {
        		$scope.addedNonInjuryWorktimeLossRequiredError = true;  
        	} else {
        		$scope.addedNonInjuryWorktimeLossRequiredError = false; 
        	}
        }
        
        var injuryDetailsTypeTwo = 2;
        $scope.addNonInjury = function() {
            if ($scope.addedNonInjuryRank !== '' &&
                $scope.addedNonInjuryRank !== undefined &&
                $scope.addedNonInjuryDetails !== '' &&
                $scope.addedNonInjuryDetails !== undefined &&
                $scope.addedNonInjuryDate !== '' &&
                $scope.addedNonInjuryDate !== undefined &&
                $scope.addedNonInjuryRemark !== '' &&
                $scope.addedNonInjuryRemark !== undefined &&
                $scope.addedNonInjuryWorktimeLoss !== '' &&
                $scope.addedNonInjuryWorktimeLoss !== undefined &&
                Date.parse($scope.addedNonInjuryDate ) < todayDate
            ) {
            	
                if ($scope.addedNonInjuryWorktimeLoss === 'Y') {
                    if ($scope.addedNonInjuryWorktimeLossHours != '') {
                    	$scope.addedNonInjuryWorktimeLossHoursRequiredError = false;
                        if ($scope.addedNonInjuryWorktimeLossHours <= 250 
                        	&& $scope.addedNonInjuryWorktimeLossHours >= 0) {
                        	$scope.addedNonInjuryWorktimeLossHoursRootError = false;
                        } else {
                        	$scope.addedNonInjuryWorktimeLossHoursRootError = true;
                        	$scope.addedNonInjuryWorktimeLossHoursRequiredError = false;
                        	return;
                        }
                    } else {
                    	$scope.addedNonInjuryWorktimeLossHoursRequiredError = true;
                    	return;
                    }
                }

                var obj = {
                    'rankcode': $scope.addedNonInjuryRank,
                    'empcode': $scope.addedNonInjuryName,
                    'injurydetail': $scope.addedNonInjuryDetails,
                    'injurydate': new Date($scope.addedNonInjuryDate),
                    'remark': $scope.addedNonInjuryRemark,
                    'islot': $scope.addedNonInjuryWorktimeLoss,
                    'lothrs': $scope.addedNonInjuryWorktimeLossHours,
                    'injurytype': injuryDetailsTypeTwo
                }
                                
    	        if($scope.isUpdateNonInjury === true) {
    	        	$scope.nonInjuries[$scope.noninjuryIndex].rankcode = $scope.addedNonInjuryRank;
    	        	$scope.nonInjuries[$scope.noninjuryIndex].empcode = $scope.addedNonInjuryName;
    	        	$scope.nonInjuries[$scope.noninjuryIndex].injurydetail = $scope.addedNonInjuryDetails;
    	        	$scope.nonInjuries[$scope.noninjuryIndex].injurydate = new Date($scope.addedNonInjuryDate);
    	        	$scope.nonInjuries[$scope.noninjuryIndex].remark = $scope.addedNonInjuryRemark;
    	        	$scope.nonInjuries[$scope.noninjuryIndex].islot = $scope.addedNonInjuryWorktimeLoss;
    	        	if($scope.addedNonInjuryWorktimeLoss === 'N') {
    	        		$scope.nonInjuries[$scope.noninjuryIndex].lothrs = "";
    	        	} else {
    	        		$scope.nonInjuries[$scope.noninjuryIndex].lothrs = $scope.addedNonInjuryWorktimeLossHours;
    	        	}
    	        	
    	        	$scope.isUpdateNonInjury= false;
    	        	
    	        } else {
    	        	$scope.nonInjuries.push(obj);
    	        } 
                
                
                $scope.clearNonInjury();
                clearNonInjuryValidationCheckErrors();
            } else {
            	nonInjuryValidationCheck();
            }           
        }

        $scope.editNonInjury = function(index) {
        	$scope.isUpdateNonInjury= true;
        	$scope.addedNonInjuryRank = $scope.nonInjuries[index].rankcode;
        	$scope.addedNonInjuryName = $scope.nonInjuries[index].empcode;
        	$scope.addedNonInjuryDetails = $scope.nonInjuries[index].injurydetail;
        	
        	var cnvrtDate = new Date($scope.nonInjuries[index].injurydate);
        	$scope.addedNonInjuryDate= (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear();
        	
        	$scope.addedNonInjuryRemark = $scope.nonInjuries[index].remark;
        	$scope.addedNonInjuryWorktimeLoss = $scope.nonInjuries[index].islot;
        	$scope.addedNonInjuryWorktimeLossHours = $scope.nonInjuries[index].lothrs;
        	$scope.noninjuryIndex = index;
                                
       }
        
        $scope.deleteNonInjury = function(index) {
            $scope.nonInjuries.splice(index, 1);
            $scope.clearNonInjury();
        }

        //L(3): Non-injury related record of all on board (dental treatment cases)
        $scope.clearNonInjuryDental = function() {
            $scope.addedNonInjuryNameDental = '';
            $scope.addedNonInjuryDetailsDental = '';
            $scope.addedNonInjuryRemarkDental = '';
            $scope.addedNonInjuryWorktimeLossDental = '';
            $scope.addedNonInjuryDateDental = '';
            $scope.addedNonInjuryRankDental = '';
            $scope.addedNonInjuryWorktimeLossDentalHours = "";
            $scope.isUpdateNonInjuryDental= false;
            clearNonInjuryDentalValidationCheckErrors();
        }
        
        function clearNonInjuryDentalValidationCheckErrors() {
        	$scope.addedNonInjuryRankDentalRequiredError = false;  
        	$scope.addedNonInjuryDetailsDentalRequiredError = false; 
        	$scope.addedNonInjuryRemarkDentalRequiredError = false;   
        	$scope.addedNonInjuryDateDentalRequiredError = false;   
        	$scope.addedNonInjuryWorktimeLossDentalRequiredError = false; 
        }
        
        function nonInjuryDentalValidationCheck() {
        	if(!$scope.addedNonInjuryRankDental || $scope.addedNonInjuryRankDental === undefined) {        		
        		$scope.addedNonInjuryRankDentalRequiredError = true;
        	} else {
        		$scope.addedNonInjuryRankDentalRequiredError = false;
        	}
        	
        	if($scope.addedNonInjuryDetailsDental === '' || $scope.addedNonInjuryDetailsDental === undefined) {
        		$scope.addedNonInjuryDetailsDentalRequiredError = true;  
        	} else {
        		$scope.addedNonInjuryDetailsDentalRequiredError = false; 
        	}
        	
        	if($scope.addedNonInjuryRemarkDental === '' || $scope.addedNonInjuryRemarkDental === undefined) {
        		$scope.addedNonInjuryRemarkDentalRequiredError = true;  
        	} else {
        		$scope.addedNonInjuryRemarkDentalRequiredError = false; 
        	}
        	
        	if($scope.addedNonInjuryDateDental === '' || $scope.addedNonInjuryDateDental === undefined) {
        		$scope.addedNonInjuryDateDentalRequiredError = true;  
        	} else if(Date.parse($scope.addedNonInjuryDateDental ) > todayDate) {
            	$scope.addedNonInjuryDateDentalRootError = true;
        	} else {
        		$scope.addedNonInjuryDateDentalRequiredError = false;
        		$scope.addedNonInjuryDateDentalRootError = false;
        	}
        	
        	if($scope.addedNonInjuryWorktimeLossDental ===  undefined || $scope.addedNonInjuryWorktimeLossDental === '') {
        		$scope.addedNonInjuryWorktimeLossDentalRequiredError = true;  
        	} else {
        		$scope.addedNonInjuryWorktimeLossDentalRequiredError = false; 
        	}
        	
        }

        $scope.nonInjuriesDental = [];
        var injuryDetailsTypeThree = 3;
        $scope.addNonInjuryDental = function() {
            $scope.addedNonInjuryRankDental = document.getElementsByClassName("non-injury-dental-rank")[0].value;
            if ($scope.addedNonInjuryRankDental !== '' &&
                $scope.addedNonInjuryRankDental !== undefined &&
                $scope.addedNonInjuryDetailsDental !== '' &&
                $scope.addedNonInjuryDetailsDental !== undefined &&
                $scope.addedNonInjuryDateDental !== '' &&
                $scope.addedNonInjuryDateDental !== undefined &&
                $scope.addedNonInjuryRemarkDental !== '' &&
                $scope.addedNonInjuryRemarkDental !== undefined &&
                $scope.addedNonInjuryWorktimeLossDental !== '' &&
                $scope.addedNonInjuryWorktimeLossDental !== undefined &&
                Date.parse($scope.addedNonInjuryDateDental ) < todayDate
            ) {
            	
                if ($scope.addedNonInjuryWorktimeLossDental === 'Y') {
                    if ($scope.addedNonInjuryWorktimeLossDentalHours != '') {
                    	$scope.addedNonInjuryWorktimeLossDentalHoursRequiredError = false;
                        if ($scope.addedNonInjuryWorktimeLossDentalHours <= 250
                        	&& $scope.addedNonInjuryWorktimeLossDentalHours >= 0) {
                        	$scope.addedNonInjuryWorktimeLossDentalHoursRootError = false;
                        } else {
                        	$scope.addedNonInjuryWorktimeLossDentalHoursRootError = true;
                        	$scope.addedNonInjuryWorktimeLossDentalHoursRequiredError = false;
                        	return;
                        }
                    } else {
                    	$scope.addedNonInjuryWorktimeLossDentalHoursRequiredError = true;
                    	return;
                    }
                }

                var obj = {
                    'rankcode': $scope.addedNonInjuryRankDental,
                    'empcode': $scope.addedNonInjuryNameDental,
                    'injurydetail': $scope.addedNonInjuryDetailsDental,
                    'injurydate': new Date($scope.addedNonInjuryDateDental),
                    'remark': $scope.addedNonInjuryRemarkDental,
                    'islot': $scope.addedNonInjuryWorktimeLossDental,
                    'lothrs': $scope.addedNonInjuryWorktimeLossDentalHours,
                    "injurytype": injuryDetailsTypeThree
                }
                
    	        if($scope.isUpdateNonInjuryDental === true) {
    	        	$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].rankcode = $scope.addedNonInjuryRankDental;
    	        	$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].empcode = $scope.addedNonInjuryNameDental;
    	        	$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].injurydetail = $scope.addedNonInjuryDetailsDental;
    	        	$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].injurydate = new Date($scope.addedNonInjuryDateDental);
    	        	$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].remark = $scope.addedNonInjuryRemarkDental;
    	        	$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].islot = $scope.addedNonInjuryWorktimeLossDental;
    	        	
    	        	if($scope.addedInjuryWorktimeLoss === 'N') {
    	        		$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].lothrs = "";
    	        	} else {
    	        		$scope.nonInjuriesDental[$scope.nonInjuryDentalIndex].lothrs = $scope.addedNonInjuryWorktimeLossDentalHours;
    	        	}
    	        	
    	        	$scope.isUpdateNonInjuryDental= false;
    	        } else {
    	        	$scope.nonInjuriesDental.push(obj);
    	        }   

                
                $scope.clearNonInjuryDental();
                clearNonInjuryDentalValidationCheckErrors(); 
            } else {
            	nonInjuryDentalValidationCheck();
            }
        }
        
        $scope.editNonInjuryDental = function(index) {
        	$scope.isUpdateNonInjuryDental = true
        	$scope.addedNonInjuryRankDental = $scope.nonInjuriesDental[index].rankcode;
        	$scope.addedNonInjuryNameDental = $scope.nonInjuriesDental[index].empcode;
        	$scope.addedNonInjuryDetailsDental = $scope.nonInjuriesDental[index].injurydetail;
        	
        	var cnvrtDate = new Date($scope.nonInjuriesDental[index].injurydate);
        	$scope.addedNonInjuryDateDental= (cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear();

        	$scope.addedNonInjuryRemarkDental = $scope.nonInjuriesDental[index].remark;
        	$scope.addedNonInjuryWorktimeLossDental = $scope.nonInjuriesDental[index].islot;
        	$scope.addedNonInjuryWorktimeLossDentalHours = $scope.nonInjuriesDental[index].lothrs;
            $scope.nonInjuryDentalIndex = index;                    
       }
        
        $scope.deleteNonInjuryDental = function(index) {
            $scope.nonInjuriesDental.splice(index, 1);
        }


        // N: Record of on board training conducted
        $scope.addTrainingConduct = function() {
        	ind = $scope.trainingConducts.length-1;
            if ($scope.trainingConducts[ind].trainingdate !== '' &&
            	$scope.trainingConducts[ind].trainingdate !== undefined &&
            	$scope.trainingConducts[ind].trainingname !== undefined &&
            	$scope.trainingConducts[ind].trainingname !== '' &&
            	Date.parse($scope.trainingConducts[ind].trainingdate) < todayDate) {
            	
            	var obj = {"trainingdate":"" , "trainingname":"" , "trainingtype": 1};
                $scope.trainingConducts.push(obj);
                $scope.trainingConductsRequiredError = false;
                
            } else {
            	if(Date.parse($scope.trainingConducts[ind].trainingdate) > todayDate) {
                	$scope.trainingConductsRootError = true;
                	$scope.trainingConductsFlag = true;
                	return;
            	} else {
            		$scope.trainingConductsRootError = false;
            		$scope.trainingConductsFlag = false;
            	}
            } 
        }
        
        $scope.deleteTrainingConduct = function(index) {
        	if($scope.trainingConducts.length > 1) {
        		$scope.trainingConducts.splice(index, 1);
        	}
        }

        // O: Record of safety video training
        $scope.addvideoTrainings = function() {
        	ind = $scope.videoTrainings.length-1;
            if ($scope.videoTrainings[ind].trainingdate !== '' &&
            	$scope.videoTrainings[ind].trainingdate !== undefined &&
            	$scope.videoTrainings[ind].trainingname !== undefined &&
            	$scope.videoTrainings[ind].trainingname !== '' &&
            	Date.parse($scope.videoTrainings[ind].trainingdate) < todayDate) {
            	
            	var obj = {"trainingdate":"" , "trainingname":"" , "trainingtype": 2};

                $scope.videoTrainings.push(obj);
                $scope.videoTrainingsRequiredError = false;
            } else {
            	if(Date.parse($scope.videoTrainings[ind].trainingdate) > todayDate) {
                	$scope.videoTrainingsRootError = true;
                	$scope.videoTrainingsFlag = true;
                	return;
            	} else {
                	$scope.videoTrainingsRootError = false;
                	$scope.videoTrainingsFlag = false;
            	}
            }
        }
        
        $scope.deletevideoTraining = function(index) {
        	if($scope.videoTrainings.length > 1) {
        		$scope.videoTrainings.splice(index, 1);
        	}
        }
        
        $scope.portPSL;
        $scope.portSSL;
        
        $scope.rankHolderOne = "";
        $scope.fetchPersonWithDesignation = function(rank, rankHolder) {
        	if($scope.vesselCode != undefined) {
	            safetyReportService.getEmployee(rank, $scope.vesselCode).then(function(response) {
	                 var the_string = rankHolder;
	                 $scope[the_string] = response.data[0];    
	            });
        	}
        
        }
        
        function validateDuplicateRanks(rank) {
        	for(i = 0; i < $scope.safetyCommiteeSigns.length; i++) {
        		if($scope.safetyCommiteeSigns[i].rankcode === rank) {
        			return false;
        		}
        	}
        	return true;
        }

        
        $scope.safetyCommiteeSigns = [];
        var sigFlag = false;
        function setSafetyCommiteeObj(rank, emp, digitalSign) {   
        	
        	if(rank!=undefined && rank && emp && emp != undefined) {
	        	if(validateDuplicateRanks(rank) === false) {
	        		sigFlag = true;
	        	}
	        	
        		obj = { 
	        			"rankcode" : rank,
	        			"empcode" : emp[0],
				        "signdetail" : digitalSign
	        	}
        		
        		$scope.safetyCommiteeSigns.push(obj);
        	}
        }	
        
        
        
        $scope.portSSLList = [];
        $scope.portPSLList = [];
        $scope.ports = [];
        $scope.btnPortCodeActionPerformedSSL = function(){
        	$scope.showPortModalSSL = true;
        	$scope.portSSLList = [];
        	 $scope.ports = [];
        	 safetyReportService.getVesselMasterPortNames($scope.portSSL).then(function(response) {
             	$scope.ports = response.data;
             	angular.forEach($scope.ports, function(value, key) {
             		var portcode = value.portcode;
	        		var portname = value.portname;
	       		    $scope.portSSLList.push({"key":portcode, "value":portname});
	       		});
             });       	         	 
        }
        $scope.getPSLPortName=function(){
        	if($scope.portPSL.length==5){
        		safetyReportService.getVesselMasterPortNames($scope.portSSL).then(function(response) {
                 $scope.ports = response.data;
                 $scope.portSSLName=$scope.ports[0].portname;
             });	
        	}else{
        		 $scope.portSSLName="";
        	}
        }
        $scope.btnPortCodeActionPerformedPSL = function(){
        	$scope.showPortModalPSL = true;
        	$scope.portPSLList = [];
        	 $scope.ports = [];
        	 safetyReportService.getVesselMasterPortNames($scope.portPSL).then(function(response) {
             	$scope.ports = response.data;
             	angular.forEach($scope.ports, function(value, key) {
             		var portcode = value.portcode;
	        		var portname = value.portname;
	       		    $scope.portPSLList.push({"key":portcode, "value":portname});
	       		});
             });       	         	 
        }
        $scope.getPSLPortName=function(){
        	if($scope.portPSL.length==5){
        		safetyReportService.getVesselMasterPortNames($scope.portPSL).then(function(response) {
                 $scope.ports = response.data;
                 $scope.portPSLName=$scope.ports[0].portname;
             });	
        	}else{
        		 $scope.portPSLName="";
        	}
        }
        $scope.showPortModalSSL = false; 
        $scope.showPortModalPSL = false;
        
        $scope.hide = function() {
            $scope.showPortModalPSL = false; 
        }
        
        $scope.hideSSL = function() {
            $scope.showPortModalSSL = false; 
        }
        
        $scope.modalOneHide = function() {
        	$scope.showPortModal = false;
        }
        

        $scope.setValue = function(arg1,arg2) {
        	ind = $scope.emergencyDrills.length-1;
        	$scope.emergencyDrills[ind].portcode = arg1;
        	$scope.emergencyDrills[ind].portname = arg2;
        	$scope.showPortModal = false;
        	$scope.hide();
        }
        
        
        $scope.setValuePSL = function(arg1,arg2) {
        	$scope.portPSL=arg1;
        	$scope.portPSLName=arg2;   	
        	$scope.hide();
        }
        
        
        $scope.setValueSSL = function(arg1,arg2) {
        	$scope.portSSL=arg1;
        	$scope.portSSLName=arg2;   	
        	$scope.hideSSL();
        }

        $scope.resetErrors = function() {
            $scope.dateTimeRootError = false;
            $scope.dateTimeRequiredError = false;
            $scope.meetingTypeRequiredError = false;
            $scope.isOfficeStaffAttendenceRequiredError = false;
            $scope.remarkRequiredError = false;
            $scope.isReviewedMinutesofPrevMeetRequiredError = false;
            $scope.safetyTopicsRequiredError = false;
            $scope.revisionsCircularsRequiredError = false;
            $scope.residualDateRequiredError = false;
            $scope.residualDateRootError = false;
            $scope.ppmRequiredError = false;
            $scope.findingsRequiredError = false;
            $scope.auditfindingsRequiredError = false;
            $scope.regulationsRequiredError = false;
            
            clearSafetyConcernsValidationCheckErrors();
            
            $scope.crewHealthMeasuresRequiredError = false;
            $scope.crewComplaintsRequiredError = false;
            $scope.riskReviewsRequiredError = false;
            
            clearValidationCheckErrors();
            clearNonInjuryValidationCheckErrors();
            clearNonInjuryDentalValidationCheckErrors();
            
            $scope.emergencyDrillRequiredError = false;
            $scope.trainingConductsRequiredError = false;
            $scope.videoTrainingsRequiredError = false;
            $scope.launchDatePSLRequiredError = false;
            $scope.launchDateSSLRequiredError = false;
            $scope.portPSLRequiredError = false;
            $scope.portSSLRequiredError = false;
        }

        function validateSafetyMasterForm() {
            var raiseErrorFlag = false;
            var firstErrorProneField;
            $scope.resetErrors();
            $scope.actionFormHide=false;
            if (!$scope.dateTime) {
                $scope.dateTimeRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "dateTime";
            	} 
                raiseErrorFlag = true;
            }             

            if ($scope.meetingType === undefined || !$scope.meetingType) {
                $scope.meetingTypeRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "meetingType";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.isOfficeStaffAttendence === undefined || !$scope.isOfficeStaffAttendence) {
                $scope.isOfficeStaffAttendenceRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "isOfficeStaffAttendence";
            	}
                raiseErrorFlag = true;
            }
            
            if (!$scope.remark) {
                $scope.remarkRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "remark";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.isReviewedMinutesofPrevMeet === undefined || !$scope.isReviewedMinutesofPrevMeet) {
                $scope.isReviewedMinutesofPrevMeetRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "isReviewedMinutesofPrevMeet";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.safetyTopics[0].topicdesc === "") {
                $scope.safetyTopicsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "safetyTopics";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.revisionsCirculars[0].information === "") {
                $scope.revisionsCircularsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "revisionsCirculars";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.testingDate  === undefined) {
                $scope.residualDateRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "testingDate";
            	}
                raiseErrorFlag = true;
            }  
            
            if (!$scope.ppm) {
                $scope.ppmRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "ppm";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.findings[0].completedfinding === "") {
                $scope.findingsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "findings";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.auditfindings[0].auditfinding === "") {
                $scope.auditfindingsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "auditfindings";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.regulations[0].regulationdesc === "") {
                $scope.regulationsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "regulations";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.safetyConcerns.length === 0) {
            	safetyConcernsValidationCheck();
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "safetyConcerns";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.crewHealthMeasures[0].helthmeasure === "") {
                $scope.crewHealthMeasuresRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "crewHealthMeasures";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.crewComplaints[0].complaintsreview === "") {
                $scope.crewComplaintsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "crewComplaints";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.riskReviews[0].riskreview === "") {
                $scope.riskReviewsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "riskReviews";
            	}
                raiseErrorFlag = true;
            }

            if ($scope.injuries.length === 0 && $scope.mandSectionL1 === "Y") {
            	injuryValidationCheck();
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "injuries";
            	}
                raiseErrorFlag = true;

            }

            if ($scope.nonInjuries.length === 0 && $scope.mandSectionL2 === "Y") {
            	nonInjuryValidationCheck();
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "nonInjuries";
            	}
            	raiseErrorFlag = true;
            }
            
            if ($scope.nonInjuriesDental.length === 0 && $scope.mandSectionL3 === "Y") {
            	nonInjuryDentalValidationCheck();
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "nonInjuriesDental";
            	}
                raiseErrorFlag = true;
            }
            
            if ($scope.trainingConducts[0].trainingname === "") {
                $scope.trainingConductsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "trainingConducts";
            	}
                raiseErrorFlag = true;
            } 
            
            if ($scope.videoTrainings[0].trainingname === "") {
                $scope.videoTrainingsRequiredError = true;
            	if(raiseErrorFlag === false) {
            		firstErrorProneField = "videoTrainings";
            	}
                raiseErrorFlag = true;
            }
            
            if ($scope.myFile.length>0) {
            if ($scope.filesData.length<$scope.maxFileCount) {
       		 $scope.filemsg_error = "Please upload the selected file";
                if(raiseErrorFlag === false) {
            		firstErrorProneField = "showfields";
            	}
                raiseErrorFlag = true;
            }
            }
            if (raiseErrorFlag === true) {
            	// Redirect to the first erroneous field
                var old = $location.hash();
                $anchorScroll.yOffset = 150;
                $location.hash(firstErrorProneField);
                $anchorScroll();
                $location.hash(old);
                openAccordian();
                return true
                
            } else {
            	$scope.resetErrors();
                return false;
            }
        }
        
        function validateDates() {
        	var errorProneField = "";
        	var dateRaiseErrorFlag = false;
        	var tempDate = Date.parse($scope.dateTime);
        	
            if(tempDate > todayDate && $scope.dateTime != undefined) {
            	$scope.dateTimeRootError = true;
            	if(dateRaiseErrorFlag === false) {
            		errorProneField = "dateTime";
            	} 
            	dateRaiseErrorFlag = true;
        	} else {
        		$scope.dateTimeRootError = false;
        	}
            
        	var tempDate1 = Date.parse($scope.testingDate);
            if(tempDate1 > todayDate && $scope.testingDate != undefined) {
            	$scope.residualDateRootError = true;
            	if(dateRaiseErrorFlag === false) {
            		errorProneField = "testingDate";
            	} 
            	dateRaiseErrorFlag = true;
        	} else {
        		$scope.residualDateRootError = false;
        	}
            
        	var tempDate3 = Date.parse($scope.launchDatePSL);
            if(tempDate3 > todayDate && $scope.launchDatePSL != undefined) {
            	$scope.launchDatePSLRootError = true;
            	if(dateRaiseErrorFlag === false) {
            		errorProneField = "launchDatePSL";
            	} 
            	dateRaiseErrorFlag = true;
        	} else {
        		$scope.launchDatePSLRootError = false;
        	}
            
        	var tempDate2 = Date.parse($scope.launchDateSSL);
            if(tempDate2 > todayDate && $scope.launchDateSSL != undefined) {
            	$scope.launchDateSSLRootError = true;
            	if(dateRaiseErrorFlag === false) {
            		errorProneField = "launchDateSSL";
            	} 
            	dateRaiseErrorFlag = true;
        	} else {
        		$scope.launchDateSSLRootError = false;
        	}
            
		    for(i = 0 ; i < $scope.trainingConducts.length ; i++) {
		    	$scope.trainingConducts[i].trainingdate = new Date($scope.trainingConducts[i].trainingdate);

	            if($scope.trainingConducts[i].trainingdate > todayDate) {
	            	$scope.trainingConductsRootError = true;
	            	if(dateRaiseErrorFlag === false) {
	            		errorProneField = "trainingConducts";
	            	} 
	            	dateRaiseErrorFlag = true;
	        	} else {
	        		$scope.trainingConductsRootError = false;
	        	}

	            if($scope.trainingConducts.length > 0) {
		            if ($scope.trainingConducts[i].trainingname === "" || $scope.trainingConducts[i].trainingname === null) {
		            	$scope.trainingConducts.splice(i, 1);
		            }
	            }
	            
		    }
		    
		    for(i=0; i < $scope.videoTrainings.length ; i++) {
		    	$scope.videoTrainings[i].trainingdate = new Date($scope.videoTrainings[i].trainingdate);
		    	
	            if($scope.videoTrainings[i].trainingdate > todayDate) {
	            	$scope.videoTrainingsRootError = true;
	            	if(dateRaiseErrorFlag === false) {
	            		errorProneField = "videoTrainings";
	            	} 
	            	dateRaiseErrorFlag = true;
	        	} else {
	        		$scope.videoTrainingsRootError = false;
	        	}
	            
	            if($scope.videoTrainings.length > 0) {
		            if ($scope.videoTrainings[i].trainingname === "" || $scope.videoTrainings[i].trainingname === null) {
		            	$scope.videoTrainings.splice(i, 1);
		            }
	            }
		    }
       
            if (dateRaiseErrorFlag === true) {
            	// Redirect to the first erroneous field
                var old = $location.hash();
                $anchorScroll.yOffset = 150;
                $location.hash(errorProneField);
                $anchorScroll();
                $location.hash(old);
                openAccordian();                
            } 
            
             return errorProneField;

        }
        
        function openAccordian() {
 			var alphabets = ['c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

    		for( i = 0 ; i < alphabets.length ; i++) {
    			var str = '#safety_' + alphabets[i];
    			angular.element(str).collapse('show');
    			
    		    if( $('.header_collapse i').is('.fa-chevron-right') ) { 
    		        $('.header_collapse i').addClass('fa-chevron-down');
    		        $('.header_collapse i').removeClass('fa-chevron-right');
    		    }
    		}
        }

        var SAVE = "Save";
        var SEND = "Send";
        var APPROVED = "Approved"
        	
 		
      $scope.preApproving = function(btnClickType) {  	
        var serialNoList = []

	    for(i = 0 ; i < $scope.nearMissReports.length ; i++) {
	    	serialNoList.push($scope.nearMissReports[i].serialnumber);
	    }
        
		for(i = 0 ; i < $scope.drillReportSectionData.length ; i++) {
			serialNoList.push($scope.drillReportSectionData[i].drlid);
		}
	    
    	 safetyReportService.getDuplicateNearMissReports($scope.safetyrecordid, serialNoList).then(function(response) {   
    		 $scope.duplicateEntries = response.data;
    		 
    		 if($scope.duplicateEntries.length > 0) {
    			 angular.element('#dupRecords').modal('show');
    		 } else {
    			 $scope.saveFormData(btnClickType); 
    		 }
    	 });
        }
        
        $scope.saveFormData = function(btnClickType) {
        	 var userstatus=true;
        	 $rootScope.showScreenOverlay = true;
        	 
                var safetyMasterData = {
                	"timeoffset": new Date().getTimezoneOffset(),
                	"safid": $scope.safetyrecordid,
                    "vslcode": $scope.vesselCode,
                    "meetingdate": new Date($scope.dateTime),
                    "meetingtype": $scope.meetingType,
                    "isstaffattended": $scope.isOfficeStaffAttendence,
                    "remarks": $scope.remark,
                    "ispremeetreview": $scope.isReviewedMinutesofPrevMeet,
                    "residualdate": new Date($scope.testingDate),
                    "ppm": $scope.ppm,
                    "pslbdate": new Date($scope.launchDatePSL),
                    "pslbportcode": $scope.portPSL,
                    "sslbdate": new Date($scope.launchDateSSL),
                    "sslbportcode": $scope.portSSL,
                    "ismandatorysectionL1" : $scope.mandSectionL1,
                    "ismandatorysectionL2" : $scope.mandSectionL2,
                    "ismandatorysectionL3" : $scope.mandSectionL3,
                    "activeStatus": "INP",
                    'revdate': $scope.reviseddate,
                    "safrfid" : $scope.safrfid,
                }
                sigFlag = false;
      			$scope.safetyCommiteeSigns = [];
     			setSafetyCommiteeObj($scope.addedDesignationOne, $scope.rankHolderOne, $scope.signatures['sig1main']);
     			setSafetyCommiteeObj($scope.addedDesignationTwo, $scope.rankHolderTwo, $scope.signatures['sig2main']);
     			setSafetyCommiteeObj($scope.addedDesignationThree, $scope.rankHolderThree, $scope.signatures['sig3main']);
     			setSafetyCommiteeObj($scope.addedDesignationFour, $scope.rankHolderFour, $scope.signatures['sig4main']);
     			setSafetyCommiteeObj($scope.addedDesignationFive, $scope.rankHolderFive, $scope.signatures['sig5main']);
     			setSafetyCommiteeObj($scope.addedDesignationSix, $scope.rankHolderSix, $scope.signatures['sig6main']);
     			setSafetyCommiteeObj($scope.addedDesignationSeven, $scope.rankHolderSeven, $scope.signatures['sig7main']);
     			setSafetyCommiteeObj($scope.addedDesignationEight, $scope.rankHolderEight, $scope.signatures['sig8main']);
                
    			// Storing Safety Workflows History
                var safetyWorkFlowHistoryData  = {
                	"upddate" : new Date(),
                	"formstatus": "INP"
                }
                
                if (btnClickType === 'reassign') {
                	safetyWorkFlowHistoryData.formstatus = "RSN";
                	safetyWorkFlowHistoryData.remarks = $scope.remarks;
                	safetyMasterData.activeStatus = "RSN";
                	userstatus=false;
                }
                
     			if(sigFlag === true) {
     				$scope.duplicateSigdialog.open();
     				$rootScope.showScreenOverlay = false;
     				return;
     			}
                
                if (btnClickType === SEND) {
                	if (validateSafetyMasterForm() === true) {
                		$rootScope.showScreenOverlay = false;
                     	 toaster.error({
                             title: "Information",
                             body: "Data couldn't be sent. Please enter the required fields"
                         });
                		return;
                	}                	
                	safetyWorkFlowHistoryData.formstatus = "SUB";
                	safetyMasterData.activeStatus = "SUB";
                	safetyWorkFlowHistoryData.senddate = new Date();
                	userstatus=false;
                }
                                
                if (btnClickType === APPROVED) {
                	if (validateSafetyMasterForm() === true) {
                		$rootScope.showScreenOverlay = false;
                     	 toaster.error({
                             title: "Information",
                             body: "Data couldn't be sent. Please enter the required fields"
                         });
                		return;
                	}  
                	safetyWorkFlowHistoryData.formstatus = "APR";
                	safetyMasterData.activeStatus = "APR";
                	$scope.activeStatus = "APR";
                	userstatus=false;
                }
                
             	if (validateDates() != "") {
             		$rootScope.showScreenOverlay = false;
                	return;
                }
                                
			var officeStaffAttendenceList = [];
			for(i=0;i<$scope.officeStaffAttendence.length;i++) {
				var url1 = $scope.officeStaffAttendence[i].split('-');
				var obj = {
					"attendeecode": url1[0],
					"attendeerankcode" : url1[1],
					"safid": $scope.safetyrecordid	
				}
				
				officeStaffAttendenceList.push(obj);				
			}
			
			var nonAttendeesList = [];
			for(i=0;i<$scope.nonAttendees.length;i++) {
				var url = $scope.nonAttendees[i].split('-');
				var obj = {
					"nonattendeecode": url[0],
					"nonattendeerankcode" : url[1],
					"safid": $scope.safetyrecordid	
				}				
				nonAttendeesList.push(obj);				
			}
									
			var dupSafetyConcerns = angular.copy($scope.safetyConcerns);
			for (i=0; i<dupSafetyConcerns.length;i++) {		
				dupSafetyConcerns[i].assgndtocode = dupSafetyConcerns[i].assgndtocode[0];
			}
			
			var dupInjuries = angular.copy($scope.injuries);					
			for (i=0; i<dupInjuries.length;i++) {				
				dupInjuries[i].empcode = dupInjuries[i].empcode[0];
			}

			var dupNonInjuries = angular.copy($scope.nonInjuries);
			for (i=0; i<dupNonInjuries.length;i++) {				
				dupNonInjuries[i].empcode = dupNonInjuries[i].empcode[0];
			}	
			
			var dupNonInjuriesDental = angular.copy($scope.nonInjuriesDental);
			for (i=0; i<dupNonInjuriesDental .length;i++) {				
				dupNonInjuriesDental[i].empcode = dupNonInjuriesDental[i].empcode[0];
			}
			
		    var safetyOtherReportsData = [];
		    for(i = 0 ; i < $scope.nearMissReports.length ; i++) {
		    	var obj = {
	    			"fromtype" : $scope.nearMissReports[i].fromtype,
	    			"serialnumber" : $scope.nearMissReports[i].serialnumber,
	    			"vesselcode" : $scope.nearMissReports[i].vesselcode,
	    			"vesselname" :$scope.nearMissReports[i].vesselname,
	    			"location" : $scope.nearMissReports[i].location,
	    			"description" : $scope.nearMissReports[i].description,
	    			"docid" : $scope.nearMissReports[i].docid,
		    	}
		    	safetyOtherReportsData.push(obj);
		    }
						
			var safetyInjuryDetailsData = dupInjuries.concat(dupNonInjuries);
			safetyInjuryDetailsData = safetyInjuryDetailsData.concat(dupNonInjuriesDental);
					
		    var safetyTrainingData = $scope.trainingConducts.concat($scope.videoTrainings);	
			$scope.safetyCommiteeSigns = [];
			setSafetyCommiteeObj($scope.addedDesignationOne, $scope.rankHolderOne, $scope.signatures['sig1main']);
			setSafetyCommiteeObj($scope.addedDesignationTwo, $scope.rankHolderTwo, $scope.signatures['sig2main']);
			setSafetyCommiteeObj($scope.addedDesignationThree, $scope.rankHolderThree, $scope.signatures['sig3main']);
			setSafetyCommiteeObj($scope.addedDesignationFour, $scope.rankHolderFour, $scope.signatures['sig4main']);
			setSafetyCommiteeObj($scope.addedDesignationFive, $scope.rankHolderFive, $scope.signatures['sig5main']);
			setSafetyCommiteeObj($scope.addedDesignationSix, $scope.rankHolderSix, $scope.signatures['sig6main']);
			setSafetyCommiteeObj($scope.addedDesignationSeven, $scope.rankHolderSeven, $scope.signatures['sig7main']);
			setSafetyCommiteeObj($scope.addedDesignationEight, $scope.rankHolderEight, $scope.signatures['sig8main']);
					
			$scope.drillIdsData = []; 
			if($scope.drillReportSectionData != undefined) {
			    for(i = 0 ; i < $scope.drillReportSectionData.length ; i++) {
			    	var obj = {
			    			"drlid" : $scope.drillReportSectionData[i].drlid
			    	}
			    	$scope.drillIdsData.push(obj);
			    }
			}
		    		    
	    	$scope.crewHealthIdsData = [];
		    for(i = 0 ; i < $scope.crewHealthIds.length ; i++) {
		    	var obj = {
		    			"chid" : $scope.crewHealthIds[i].id
		    	}
		    	
		    	$scope.crewHealthIdsData.push(obj);
		    }
		    
		    var outstandingItemsData = [];
		    for (i=0; i < $scope.outstandingItems.length ; i++) {
		    	var obj = {
	    			"outstdsafid" : $scope.outstandingItems[i][1],
	    			"outstdconcernid": $scope.outstandingItems[i][5],
	    			"outstdactionreq": $scope.outstandingItems[i][2],
	    			"outstdtaskid": $scope.outstandingItems[i][0],
	    			"outstdtargetdate": $scope.outstandingItems[i][3],
	    			"processpercent": $scope.outstandingItems[i][4]
		    	}
		    	outstandingItemsData.push(obj);
		    }
        	
		   
		    for(i=0; i < $scope.safetyTopics.length ; i++) {
	            if ($scope.safetyTopics[i].topicdesc === "") {
	            	$scope.safetyTopics.splice(i, 1);
	            }
		    }
		    
		    for(i=0; i < $scope.revisionsCirculars.length ; i++) {
	            if ($scope.revisionsCirculars[i].information === "") {
	            	$scope.revisionsCirculars.splice(i, 1);
	            }
		    }    
		    
		    for(i=0; i < $scope.findings.length ; i++) {
	            if ($scope.findings[i].completedfinding === "") {
	            	$scope.findings.splice(i, 1);
	            }
		    }   

		    for(i=0; i < $scope.auditfindings.length ; i++) {
	            if ($scope.auditfindings[i].auditfinding === "") {
	            	$scope.auditfindings.splice(i, 1);
	            }
		    }    

		    for(i=0; i < $scope.regulations.length ; i++) {
	            if ($scope.regulations[i].regulationdesc === "") {
	            	$scope.regulations.splice(i, 1);
	            }
		    }    

		    for(i=0; i < $scope.crewHealthMeasures.length ; i++) {
	            if ($scope.crewHealthMeasures[i].helthmeasure === "") {
	            	$scope.crewHealthMeasures.splice(i, 1);
	            }
		    }    

		    for(i=0; i < $scope.crewComplaints.length ; i++) {
	            if ($scope.crewComplaints[i].complaintsreview === "") {
	            	$scope.crewComplaints.splice(i, 1);
	            }
		    } 
		    
		    
		    for(i=0; i < $scope.riskReviews.length ; i++) {	
	            if ($scope.riskReviews[i].riskreview === "") {
	            	$scope.riskReviews.splice(i, 1);
	            }
		    }    

		    for(i=0; i < $scope.trainingConducts.length ; i++) {	
	            if ($scope.trainingConducts[i].trainingname === "") {
	            	$scope.trainingConducts.splice(i, 1);
	            }
		    }
		    
		    for(i=0; i < $scope.videoTrainings.length ; i++) {
	            if ($scope.videoTrainings[i].trainingname === "") {
	            	$scope.videoTrainings.splice(i, 1);
	            }
		    }    
		    
            var compositeJson = {
            		safetyMeetingMaster: safetyMasterData,
            		safetyAttendees: officeStaffAttendenceList,
            		safetyNonAttendees: nonAttendeesList,
            		safetyTopic: $scope.safetyTopics,
            		safetyInformation: $scope.revisionsCirculars,
            		safetyCompletedFindings: $scope.findings,
            		safetyAuditFindings: $scope.auditfindings,
            		safetyRegulations: $scope.regulations,
            		safetyConcern: dupSafetyConcerns,
            		safetyHealthMeasures: $scope.crewHealthMeasures,
            		safetyComplaintReview: $scope.crewComplaints,
            		safetyRiskReview: $scope.riskReviews,
            		safetyInjuryDetails: safetyInjuryDetailsData,
            		safetyTraining: safetyTrainingData,
            		safetyWorkFlowHistory: safetyWorkFlowHistoryData,
            		stageid : $scope.stageid,
            		safetyCommiteeSign: $scope.safetyCommiteeSigns,
            		safetyCrewHealthAttachments: $scope.crewHealthIdsData,
            		safetyDrillAttachments: $scope.drillIdsData,
            		safetyOutstanding: outstandingItemsData,
            		safetyOtherReports: safetyOtherReportsData
            }
            
            Connectivity.IsOk().then(function(response) {    
            safetyReportService.saveSafetyReportCompositeForm(compositeJson).then(function(response) {               
         	   $scope.geterrormessages = response.data.message;	
               $scope.geterrorstatus = response.data.errorstatus;
               $scope.geterrorstatuscode = response.data.status;                
               $scope.dataerror = response.data.message;      	
               
				if(response.data.status==0 && response.data.length!=0 ){		
					
                	$scope.wrkflowstatus = response.data.data[0].safWHistory;
                	$scope.safrfid = response.data.data[0].refId;
                	
//					$scope.wrkflowstatus=response.data.data;
					toaster.success({title: "Information", body:response.data.successMessage});
					
	                if (btnClickType != SAVE ) {
						$scope.actionFormHide=true;
	                }
	                
        			if($scope.safetyTopics.length === 0) {
        				$scope.safetyTopics = [{"topiccode": "", "topicdesc" : ""}];
        			}
            		
        			if($scope.revisionsCirculars.length === 0) {
        				$scope.revisionsCirculars = [ {"information": ""} ];
        			}	
        			
        			if($scope.findings.length === 0) {
        				$scope.findings = [{'completedfinding':""}];
        			}
            		
        			if($scope.auditfindings.length === 0) {	
        				$scope.auditfindings = [ {'auditfinding' : ""} ];	
        			}
            		
        			if($scope.regulations.length === 0) {
        				$scope.regulations = [{'regulationdesc':""}];	
        			}
        			
        			if($scope.crewHealthMeasures.length === 0) {
        				$scope.crewHealthMeasures = [{'helthmeasure':""}];
        			}

        			if($scope.crewComplaints.length === 0) {
        				$scope.crewComplaints = [{'complaintsreview':""}];
        			}
            		
        			if($scope.riskReviews.length === 0) {
        				$scope.riskReviews = [{'riskreview':""}];
        			}

    		       if($scope.trainingConducts.length === 0) {
    		              $scope.trainingConducts = [{"trainingdate":"" , "trainingname":"" , "trainingtype": 1}];
    		       }
    		       
    		       if($scope.videoTrainings.length === 0) {
    		              $scope.videoTrainings = [{"trainingdate":"" , "trainingname":"" , "trainingtype": 2}];
    		       }
    		      
					$scope.resetErrors();
					$scope.displayShipWorkflow = true;
				} else {
					$rootScope.showScreenOverlay = false;
            		$scope.errordetails = response.data.exceptionDetail;
                	$scope.showexception = response.data.showerrormessage
                	$scope.detailerrormessages = response.data.exceptionDetail;	
					$scope.dataerror = [response.data.message[0]]; 
				} 
				
				$rootScope.showScreenOverlay = false;

			}), function errorCallback(response) {
            	$rootScope.showScreenOverlay = false;
				$scope.dataSaveStatus = "Data couldn't be sent. Please enter the required fields";
			};
		  }, function(error){
			  $rootScope.showScreenOverlay = false;
			  $scope.dialog.open();
			  $scope.dataerror = "Server not reached";
		  })		
        }   
        
        
        $scope.deleteActionPerformed = function(){
       	 form_data = {
                    'safid': $scope.safetyrecordid,
                };
       	 Connectivity.IsOk().then(function(response) {
       		safetyReportService.deleteSafetyReportMainForm(form_data).then(function(response) {
               	  $scope.geterrormessages = response.data.message;
                     $scope.geterrorstatus = response.data.errorstatus;
                     $scope.geterrorstatuscode = response.data.status;
                     if (response.data.status == 0 && response.data.length != 0) {
                         $scope.wrkflowstatus = response.data.data;
                         toaster.success({
                             title: "Information",
                             body: response.data.successMessage
                         });
                         $scope.actionFormHide = true;
                         $scope.voidStatus = true;
                         $scope.resetErrors();
                         $rootScope.showScreenOverlay = false;
                     } else {
                         if (response.data.exceptionDetail != null) {
                             $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                         }
                         $rootScope.showScreenOverlay = false;
                         $scope.errordetails = response.data.exceptionDetail;
                         $scope.showexception = response.data.showerrormessage
                         $scope.dataerror = response.data.message;
                     }
               	
                })
       	 }, function(error) {
                $scope.dataerror1 = "Server not reached";
                $scope.dialog.open();
            })
       }
        
        
      //Export Pdf............ 
        $scope.saveAsPDFDocument = function(){
        	formData = {
        			"safid": $scope.safetyrecordid,
        	}
        	safetyReportService.generateSafetyReportPdf(formData).then(function(response)  	        
        	 {
        		 var myBlob = new Blob([response.data], {type: "application/pdf"});
      	         var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
      	         var anchor = document.createElement("a");
      	         anchor.download = $scope.vesselname+"-"+"SafteyHealthEnvironmentMeeting"+"-"+$scope.safrfid;
      	         anchor.href = blobURL;
      	         anchor.click();
        	  	         
        	  });
        }
        
        //Export Excel 
        $scope.exportexcel = function(){
        	formData = {
        			"safid": $scope.safetyrecordid,
        	}
        	safetyReportService.generateSafetyReportExcel(formData).then(function(response)  	        
        	 {
        	  	         var myBlob = new Blob([response.data], {type: "application/vnd.ms-excel"});
        	  	         var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
        	  	         var anchor = document.createElement("a");
        	  	         anchor.download = $scope.vesselname+"-"+"SafteyHealthEnvironmentMeeting"+"-"+$scope.safetyrecordid;;
        	  	         anchor.href = blobURL;
        	  	         anchor.click();
        	  });
      } 
    });
