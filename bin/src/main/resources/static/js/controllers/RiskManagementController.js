   app.controller('riskManagementCtrl', function($anchorScroll,$rootScope, Connectivity, toaster, $http, $timeout, $location, $window, $scope, riskManagementService, $routeParams) {
	   
	   $scope.geterrorstatuscode ="0";
	   $scope.showApproveBtn = false;
	   $scope.max100Length = 100;
	   $scope.max200Length = 200;
		$scope.max250Length = 250;
		$scope.max500Length = 500;
		$scope.previewFileName = "";
		
		$scope.previewObj  = {
				"title": $scope.previewFileName
		}
		
	/**************************************************/
        $scope.jobcommencedate;
        $scope.fromDateObject = null;
        $scope.jobcompleteddate;
        $scope.toDateObject = null;
        
        $scope.maxDate = new Date();
        $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);
        
        $scope.fromDateChanged = function(){
          $scope.minDate = new Date($scope.jobcommencedate);
        };
        
        $scope.toDateChanged = function(){
          $scope.maxDate = new Date($scope.jobcompleteddate);
        }
        $scope.validateFreeText = function(modelName, errorModelName){
        	var regex = /.*[0-9A-Za-z].*$/i;
        	console.log(errorModelName);
        	if(!regex.test($scope[modelName]) && $scope[modelName]!=''){
        		$scope[errorModelName] = "That doesn't look like a valid entry"
        		return false;
        	}else{
        		$scope[errorModelName] ="";
        		return true;
        	}
        }
       
       /************** TO PREVIEW FILE *********************/
       
        $scope.previewFile = function(docid, docName) {
    	   
           $http.get('/riskassessment/downloadDocument/?docId=' + docid, {
                   responseType: 'blob'
               })
               .then(function(response) {
                   var data = new Blob([response.data], {
                       type: 'image/jpeg;charset=UTF-8'
                   });
                   // var data = new Blob([response.data], {type: 'application/pdf'});
                   url = $window.URL || $window.webkitURL;
                   $scope.fileUrl = url.createObjectURL(data);
                   // $scope.content = $scope.fileUrl;
                   toDataUrl($scope.fileUrl, function(base64Img) {
                       $scope.imagetest = base64Img;
                       
                       $scope.previewFileName = docName;
                       $scope.previewObj  = {
               				"title": $scope.previewFileName
               		   }
                       
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
           $scope.exceededFileSizedialog.close();
           $scope.exceededFileCountDialog.close();
           $scope.previewDialog.close();
           $scope.addMeasuresDialog.close();
           $scope.confirmDeleteDialog.close();
           $scope.reAssignDialog.close();
       });
       /***********Date Picker validation**********/
       $scope.validateDate = function(modelName, ngModelName, errorModelName, ifConditionModel, typeOfPicker) {
    	    if ($scope[modelName] != "" || $scope[modelName] != undefined) {
    	        var currentDate = Date.parse($scope[modelName]);
	    	    if (typeOfPicker=='date'){
	    	        var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
	    	    } else {
	    	        var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}) (AM|PM)$/;
	    	    }
	    	    if (!currentDate) {
	    	        $scope[modelName] = "";
	    	        $scope[ngModelName] = "";
	    	        $scope[errorModelName] = "That doesn't seem like a valid date";
	    	        $scope[ifConditionModel] = true;
	    	    } else {
	    	        $scope[ifConditionModel] = false;
	    	    }

    	    } else {
    	    //$scope[ifConditionModel] = false;
    	}

    	}
       /**************End of Date picker validation*******/
       $scope.validationDialogMsg = "Some mandatory field/fields are missing.";
       $scope.exceededFileCountDialogMsg = "You cannot attach more than 3 files. Remove a file, then try."
       $scope.addMeasuresValidationDialogMsg = "Additional Control Measures required where risk level is high/very high";
       $scope.deleteDialogMsg = "You sure, that you want to delete this?";

       $scope.deleteActions = [{
            	text: 'Yes',
            	action: removeDocument
           },
           {
        	   text: 'No'
           }
       ];
       $scope.validateFreeText = function(modelName, errorModelName){
       	var regex = /.*[0-9A-Za-z].*$/i;
       	if(!regex.test($scope[modelName]) && $scope[modelName]!=''){
       		$scope[errorModelName] = "That doesn't look like a valid entry"
       		return false;
       	}else{
       		$scope[errorModelName] ="";
       		return true;
       	}
       }
       $scope.validateFreeTextDynamic = function(data, index, key, errorModelName){
          	var regex = /.*[0-9A-Za-z].*$/i;
          	if(!regex.test($scope[data][index][key]) && $scope[data][index][key]!=''){
          		$scope[errorModelName] = "That doesn't look like a valid entry"
          		return false;
          	}else{
          		$scope[errorModelName] ="";
          		return true;
          	}
          }
       $scope.confirmDelete = function(docid) {
           $scope.deleteDocId = docid;
           $scope.confirmDeleteDialog.open();
       }

       function thowsFileSizeExceededError(filename) {
           $scope.fileSizeExceededDialogMsg = filename + " is more than 1 MB, cannot be uploaded";
           $scope.exceededFileSizedialog.open();
       }
       
       function thowsUnsupportedFileError(filename) {
           $scope.fileSizeExceededDialogMsg = filename+ " is not supported format. Unable to upload.";
           $scope.exceededFileSizedialog.open();
       }
       
       $scope.errorActions = [
  	                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
  	               ];

       $scope.actions = [{
           text: 'Ok'
       }];

       $scope.hidebody = true;
       $scope.datastatus = true;
       $scope.haspermission = false;
       $scope.unauthorize = function(arg1) {
           if (arg1) {
               $scope.haspermission = true;
           }
           $scope.hidebody = false;
       }

       $scope.max200Length = 200;
       
       
	    $scope.showReassignModal = function(targetName) {
	    	$scope.targetName = targetName;
	        $scope.reAssignDialog.open();
	    }
	 
	    $scope.reassignActions = [{
	    	text: 'Yes',
	        action: function openOkAction(){
	        	angular.element($scope.targetName).modal('show');
	        }
	    }, {
	    	text: 'No'
	    }];
	    
	    $scope.okAction = function(targetName) {
           if ($scope.remarks !== '' && $scope.remarks !== undefined) {
               $scope.saveFormData('reassign');
               $scope.reassignRemarksRequiredError = false;
               angular.element(targetName).modal('hide');
           } else {
        	   $scope.reassignRemarksRequiredError = true;
           }
       }
		   
       
  	   $scope.errorActions = [
  	 		                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
  	 		               ];
  	 	        

       /***** PREREQUISITES FOR THE FORM***********/

       $scope.hideError = function(field) {
           var fieldName = field + "RequiredError";
           $scope[fieldName] = false;
       }

       $scope.rskId = $routeParams.id;
       
       
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
       
//       $scope.uploadFile = function() {
//       	$scope.filemsg_error="";
//           var file = $scope.myFile;
//           if ($scope.myFile.length + $scope.activeFileCount > $scope.maxFileCount) {
//               $scope.exceededFileCountDialog.open();
//               return;
//           }
//           for (i = 0; i < $scope.myFile.length; i++) {
//           	if (($scope.myFile[i]._file.name).split('.')[1]=='sql'){
//           		thowsUnsupportedFileError($scope.myFile[i]._file.name);
//           		 return;
//           	}
//               if ($scope.myFile[i]._file.size <= $scope.maxFileSize * 1048576) {
//                   var filesformdata = new FormData();
//                   filesformdata.append('file', $scope.myFile[i]._file);
//                   filesformdata.append("formNumber", $scope.rskId);
//                   filesformdata.append("mdlCode", "RSK");
//                   filesformdata.append("attachmentTypeFolder", "Form Attachments");
//                   $rootScope.showScreenOverlay = true;
//                   $scope.hideFilesFlag = false;
//                   var request = {
//                       method: 'POST',
//                       url: '/riskassessment/uploadDocuments/',
//                       data: filesformdata,
//                       headers: {
//                           'Content-Type': undefined
//                       }
//                   };
//
//                   // SEND THE FILES.
//                   $http(request)
//                       .then(function(response) {
//                       	$scope.geterrormessages=response.data.message;	
//        	                $scope.geterrorstatus=response.data.errorstatus;
//        	                $scope.geterrorstatuscode=response.data.status;                
//        	                $scope.dataerror =response.data.message;                 
//        	            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
//                           $http({
//                               method: 'POST',
//                               url: "/riskassessment/fetchDocuments/",
//                               data: {
//                                   "formNumber": $scope.rskId
//                               }
//                           }).then(
//                               function(response) {
//                                 	$scope.geterrormessages=response.data.message;	
//        	 	   	                $scope.geterrorstatus=response.data.errorstatus;
//        	 	   	                $scope.geterrorstatuscode=response.data.status;                
//        	 	   	                $scope.dataerror =response.data.message;                 
//        	 	   	            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
//        	 	    		             $scope.filesData = response.data.data;
//        	 	    		             countActiveFiles();
//        	 	    		           $rootScope.showScreenOverlay = false;
//        	 	   	           }else{
//        	 	   	        	$rootScope.showScreenOverlay = false;
//        	 	            		$scope.errordetails=response.data.exceptionDetail;
//        	 	                	$scope.showexception=response.data.showerrormessage
//        	 	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
//        	 						$scope.dataerror = [response.data.message[0]]; 	
//        	 					}
//        	 	    		       });
//        	            	}else{
//        	            		$rootScope.showScreenOverlay = false;
//        	            		$scope.errordetails=response.data.exceptionDetail;
//        	                	$scope.showexception=response.data.showerrormessage
//        	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
//        						$scope.dataerror = [response.data.message[0]]; 	
//        					}
//        	       		     
//                       });
//
//               } else {
//                   thowsFileSizeExceededError($scope.myFile[i]._file.name);
//               }
//           };
//           $scope.myFile = [];
//       };
       
       
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
           filesformdata.append("formNumber", $scope.rskId);
           filesformdata.append("mdlCode", "RSK");
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
                       url: '/riskassessment/uploadDocuments/',
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
                               url: "/riskassessment/fetchDocuments/",
                               data: {
                                   "formNumber": $scope.rskId
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
           	url: "/riskassessment/removeDocument/?docId=" + $scope.deleteDocId+"&formId="+$scope.rskId,
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
                   url: "/riskassessment/fetchDocuments/",
                   data: {"formNumber": $scope.rskId}
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
           if (!$scope.msg) {
               return null;
           }
           chat_data = {
               'message': $scope.msg,
               'formSerialId': $scope.rskId
           };
           $http({
               url: "/risk-chat-submission/",
               dataType: 'json',
               method: 'POST',
               data: chat_data,
               headers: {
                   "Content-Type": "application/json"
               }
           }).then(function(response) {
               $http({
                   method: 'POST',
                   url: "/get-risk-chat-data-by-no/",
                   data: $scope.rskId
               }).then(
                   function(response) {
                       $scope.chatdata = response.data;
                       $scope.msg = "";
                       setTimeout(function() {
                           communication = document.getElementById('communication-window');
                           communication.scrollTop = communication.scrollHeight;
                       }, 1);
                       communication = document.getElementById('communication-window');
                       communication.scrollTop = communication.scrollHeight;
                   })
           });
       };
       
   	/*******************************************************************/
       
   $scope.isAdequate = "";
   $scope.jobComments = "";  
   $scope.jobcompleteddate; 
   $scope.jobcommencedate;
   $scope.companyAdditionalCtrlhazardNo = [];
  
  	 Connectivity.IsOk().then(function(response){
	    	$http({
	            method: 'POST',
	            url: "/get-risk-assessment-initial-load-data/",
	            data: {"rskid": $scope.rskId}
	        }).then(
	            function(response) { 
	            	$scope.geterrormessages = response.data.message;	
	                $scope.geterrorstatus = response.data.errorstatus;
	                $scope.geterrorstatuscode = response.data.status;                
	                $scope.dataerror = response.data.message;      
	                if((response.data.status==0 )||(response.data.errorstatus == "SV")) {  
	            		console.log("MAJOR ONE RESPONSE", response.data);
	            		
        	            $scope.isCloseOutStage = true;
        	            $scope.actionRights = response.data.data[0].buttonActionsData[0];
        	           
        	            if(response.data.data[0].buttonActionsData != undefined 
        	               && typeof(response.data.data[0].buttonActionsData[1]) === 'boolean') {
        	            	$scope.deleteAction = response.data.data[0].buttonActionsData[1];
        	            } else if (response.data.data[0].buttonActionsData[2] != undefined && (typeof(response.data.data[0].buttonActionsData[2]) === 'boolean')){
        	            	$scope.deleteAction = response.data.data[0].buttonActionsData[2];
        	            }
        	            
        	            if( $scope.actionRights != undefined) {
	        	            if ($scope.actionRights[0] == 'CLO') {
	        	               $scope.isCloseOutStage = false;
	        	            }
        	            }

    	                $scope.formNo = response.data.data[0].formMasterData[0].actFormno;
    	                $scope.revNo = response.data.data[0].formMasterData[0].actRevno;
    	                $scope.reviseddate = response.data.data[0].formMasterData[0].reviseddate;
    	                
    	                // Task 
    	                $scope.templates = [];
    	                $scope.showTemplateDialog = false;

	                    $scope.templates = response.data.data[0].rskmastertemplateData;
	                    if ($scope.templates.length != 0) {
	                            $scope.isTemplate = response.data.data[0].isTemplate;
	                    } else {
	                        $scope.isTemplate = false;
	                    }


                        $scope.locationList = response.data.data[0].nearmisslocationMasterData;

                        $scope.categoryList = response.data.data[0].rskcategorymasterData;
                        
                        $scope.hodsList =  response.data.data[0].riskHODsData;
                        
                        $scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
                        $scope.mdlname = response.data.data[0].modulename;
                    
                        $scope.permitToWorkList = response.data.data[0].rskpermitmasterData;
                        $scope.selectOptions = {
                            placeholder: "Select work permit",
                            dataTextField: "permitname",
                            dataValueField: "permitcode",
                            autoBind: true,
                            autoClose: false,
                            dataSource: {
                                data: $scope.permitToWorkList
                            }
                        };

                        $scope.personList = response.data.data[0].rankMasterData;
                        $scope.selectPersonsListOptions = {
                            placeholder: "Select rank name",
                            dataTextField: "rankname",
                            dataValueField: "rankcode",
                            autoBind: true,
                            autoClose: false,
                            dataSource: {
                                data: $scope.personList
                            }
                        };
                        
                        $scope.hazard = "";
                        $scope.hazardList = response.data.data[0].rskhazardmasterData;
                        $scope.hazardEffect = "";
                        $scope.hazardEffectList = response.data.data[0].rskefcthzardmasterData;
                        
                        // FETCH FILE ATTACHMENTS
                        $scope.filesData = response.data.data[0].formsDoc;
                        countActiveFiles();

                        // FETCH CHAT DATA	 
                        $scope.chatdata = response.data.data[0].communicationWindowList;
                        $scope.msg = "";
                        setTimeout(function() {
                            communication = document.getElementById('communication-window');
                            communication.scrollTop = communication.scrollHeight;
                        }, 1);
                        communication = document.getElementById('communication-window');
                        communication.scrollTop = communication.scrollHeight;
                        
                        // WORK FLOW HISTORY
                        $scope.wrkflowstatus = response.data.data[0].rskwfhistoryEntityData;
                        
 	            	   for( i = 0 ; i < $scope.wrkflowstatus.length ; i++) {
	            		   if($scope.wrkflowstatus[i].cntrltype === 'CNT001') {
	            			   $scope.displayShoreWorkflow = true;
	            		   }
	            		   
	            		   if($scope.wrkflowstatus[i].cntrltype === 'CNT002') {
	            			   $scope.displayShipWorkflow = true;
	            		   }
	            	   }
                        
                        // SESSSION DATA
//                        $scope.vesselName = response.data.data[0].sessionData.vesselName;
//                        $scope.vesselCode = response.data.data[0].sessionData.vesselcode;
                        
                        if (response.data.data[0].reviewerData.length > 0) {
                            $scope.approvalDate = response.data.data[0].reviewerData[0][0];
                            $scope.approvalRank = response.data.data[0].reviewerData[0][1];
                            $scope.approvalName = response.data.data[0].reviewerData[0][2];

                        }

                        if (response.data.data[0].approverData.length > 0) {
                            $scope.closerDate = response.data.data[0].approverData[0][0];
                            $scope.closerRank = response.data.data[0].approverData[0][1];
                            $scope.closerName = response.data.data[0].approverData[0][2];
                        }

                        // MASTER DATA
                        var riskMasterData = response.data.data[0].riskContentItemData.riskMaster;
                        $scope.activeStatus = riskMasterData.activeStatus;
                        
	                    if ($scope.activeStatus == "VOI") {
		                      $scope.voidStatus = true;
		                  }
	                    
                        $scope.rskrfid = riskMasterData.rskrfid;
                        
                        $scope.cateogory = riskMasterData.categorycode;
                        $scope.task = riskMasterData.taskname;
                        $scope.location = riskMasterData.locationcode;
                        $timeout(function(){
                     	   $scope.workPermit = [];
                            angular.forEach(response.data.data[0].riskContentItemData.rskPermitToCode, function(value, key) {
                                $scope.workPermit.push(value.permitCode);
                            });
                            $scope.workingPerson = [];
                            angular.forEach(response.data.data[0].riskContentItemData.rskWorkingPerson, function(value, key) {
                                $scope.workingPerson.push(value.rankcode);
                            });
                        },1000);

                        $scope.departmentHead = riskMasterData.headrankcode;

                        $scope.equipment = riskMasterData.eqpused;
                        $scope.assessDate = riskMasterData.assessmentdate;
                        $scope.maxFileCount = riskMasterData.maxFileCount;
                        $scope.maxFileSize = riskMasterData.maxFileSize;
                        $scope.dateFormat = riskMasterData.dateFormat;
                        $scope.companyComment = riskMasterData.cmpcomment;
                        
                        $scope.vesselName = riskMasterData.vslname;
                        $scope.vesselCode = riskMasterData.vesselcode;

                        $scope.isAdequate = riskMasterData.isAdequate;
                        
                        if (riskMasterData.jobcommencedate != null) {
	        				var cnvrtDate = new Date(riskMasterData.jobcommencedate);
	        				var ampm = (cnvrtDate.getHours() >= 12) ? "PM" : "AM";
	        				var hours = (cnvrtDate.getHours() > 12) ? (cnvrtDate.getHours() - 12) : (cnvrtDate.getHours());
	        				$scope.jobcommencedate =  ((cnvrtDate.getMonth()+1)+"/"+cnvrtDate.getDate()+"/"+cnvrtDate.getFullYear()+" "+ hours +":"+cnvrtDate.getMinutes()+" "+ampm );
	        			} 
                        
	        			if(riskMasterData.jobcompleteddate != null){
	        				var cnvrtDate = new Date(riskMasterData.jobcompleteddate);
	        				var ampm = (cnvrtDate.getHours() >= 12) ? "PM" : "AM";
	        				var hours = (cnvrtDate.getHours() > 12) ? (cnvrtDate.getHours() - 12) : (cnvrtDate.getHours());
	        				$scope.jobcompleteddate =  ((cnvrtDate.getMonth()+1)+"/"+cnvrtDate.getDate()+"/"+cnvrtDate.getFullYear()+" "+ hours +":"+cnvrtDate.getMinutes()+" "+ampm );
	        			} 

                        $scope.jobComments = riskMasterData.jobComments;

                        // Setting initial risk data
                        $scope.initialRskListObj = response.data.data[0].riskContentItemData.initialRskList;

                        $scope.companyAddCtrlList = response.data.data[0].riskContentItemData.companyAdditionalRisk;

                        maxkey = 0;
                        count = 0;
                        for (var key in $scope.initialRskListObj) {
                            if (parseInt(key) > maxkey) {
                                maxkey = key;
                            }
                            count++;
                            
                        }
                        
                		$scope.companyAddCtrlList = response.data.data[0].riskContentItemData.companyAdditionalRisk;
                		console.log("$scope.companyAddCtrlList--->", $scope.companyAddCtrlList);

                        $scope.hazardsCount = count;
                        $scope.hazardCountDB = maxkey;
                        $scope.hazardNo = parseInt($scope.hazardCountDB) + 1;
                        
        	            if( response.data.data[0].buttonActionsData[1] != undefined) {
	        	            if (response.data.data[0].buttonActionsData[1][0] == 'APR') {
	        	               $scope.toggleApprove = true;
	        	               showHideApprove();
	        	            }
        	            }
                        
                        

	            	} else {
	            		$scope.errordetails = response.data.exceptionDetail;
	                	$scope.showexception = response.data.showerrormessage
	                	$scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;	
						$scope.dataerror = [response.data.message[0]]; 	
					}  
	            });
		 	}, function(error){		 
			  $scope.dataerror = "Server not reached";
		  })

     /*****************TEMPLATE**************************/

       $scope.selectTemplate = function() {
           $scope.showTemplateDialog = true;
           resetSection1ValidationsErrors();
           resetSection2ValidationsErrors();
           resetValidationsErrors();
       }

       $scope.closeTemplateDialog = function() {
           $scope.showTemplateDialog = false;
       }

       $scope.populateTemplate = function(rskid) {
           riskManagementService.getSavedRskMaster(rskid).then(function(response) {
               var riskMasterData = response.data.data.riskMaster;
               //        		$scope.workPermit = riskMasterData.permitcode;
               $scope.cateogory = riskMasterData.categorycode;
               $scope.task = riskMasterData.taskname;
               $scope.location = riskMasterData.locationcode;

               $scope.workingPerson = riskMasterData.personsrankcode;
               $scope.departmentHead = riskMasterData.headrankcode;

               $scope.equipment = riskMasterData.eqpused;

               $scope.initialRskListObj = response.data.data.initialRskList;
               
               $scope.workPermit= [];
               angular.forEach(response.data.data.rskPermitToCode, function(value, key) {
                   $scope.workPermit.push(value.permitCode);
               });
               
               $scope.workingPerson = [];
               angular.forEach(response.data.data.rskWorkingPerson, function(value, key) {
                   $scope.workingPerson.push(value.rankcode);
               });

               for (var key in $scope.initialRskListObj) {
                   $scope.initialRskListObj[key].additionalControlMeasures = [{
                       measure: ''
                   }];
               }

               maxkey = 0;
               count = 0;
               for (var key in $scope.initialRskListObj) {
                   if (parseInt(key) > maxkey) {
                       maxkey = key;
                   }
                   count++;
               }
               $scope.hazardsCount = count;
               $scope.hazardCountDB = maxkey;
               $scope.hazardNo = parseInt($scope.hazardCountDB) + 1;

           });
       }

       /******************************************/

       $scope.assessDate;
       $scope.task;
       $scope.equipment;

       //Total No of Hazards Identified
       $scope.riskAssessments = [];

       /**************EVENTS*********************/

       $scope.isOtherHazardChosen = function() {
           $scope.hazardRequiredError = false;
           if ($scope.hazard === 'HAZ096') {
               $scope.isOtherHazard = true;
           } else {
               $scope.isOtherHazard = false;
           }
       }

       $scope.isOtherHazardEffectChosen = function() {
           $scope.hazardEffectRequiredError = false;
           if ($scope.hazardEffect === 'EHZ007') {
               $scope.isOtherHazardEffect = true;
           } else {
               $scope.isOtherHazardEffect = false;
           }
       }
       
       function showHideApprove() {
   		$scope.showApproveBtn = true; 
				for (var key in $scope.initialRskListObj) {
					for (i = 0 ; i < $scope.initialRskListObj[key].additionalControlMeasures.length ; i++) {
						if($scope.initialRskListObj[key].additionalControlMeasures[i].risklevel === "Very High" || 
								$scope.initialRskListObj[key].additionalControlMeasures[i].risklevel === "High") {
							$scope.showApproveBtn = false; 
						}
					}
				}
    	   }

       /**************SECTION 1 ***************/
       $scope.initialControlMeasure = [];

       $scope.activity;

       $scope.initialControlMeasure = [];

       $scope.iniCons = "N/A";
       $scope.iniFre = "N/A";
       $scope.riskLevel = "N/A";

       var elem = document.getElementById("riskLevel");

       function getRiskColor() {
           if (($scope.iniFre == '1' && $scope.iniCons == '1') || ($scope.iniFre == '1' && $scope.iniCons == '2') || ($scope.iniFre == '2' && $scope.iniCons == '1')) {
               $scope.riskLevel = "Very Low";
               elem.style.backgroundColor = "#93DB70";
           } else if (($scope.iniCons == '1' && $scope.iniFre == '3') || ($scope.iniCons == '1' && $scope.iniFre == '4')) {
               $scope.riskLevel = "Low";
               elem.style.backgroundColor = "#79CDCD";
           } else if (($scope.iniCons == '2' && $scope.iniFre == '2')) {
               $scope.riskLevel = "Medium";
               elem.style.backgroundColor = "#ffd27f";
           } else if (($scope.iniCons == '2' && $scope.iniFre == '3') || ($scope.iniCons == '3' && $scope.iniFre == '1')) {
               $scope.riskLevel = "High";
               elem.style.backgroundColor = "#ffa500";
           } else if (($scope.iniCons == '2' && $scope.iniFre == '4') || ($scope.iniCons == '3' && $scope.iniFre == '2') || ($scope.iniCons == '3' && $scope.iniFre == '3') || ($scope.iniCons == '3' && $scope.iniFre == '4')) {
               $scope.riskLevel = "Very High";
               elem.style.backgroundColor = "#ff6666";
           }
       }

       $scope.calculateInitialRisk = function() {
           if ($scope.iniFre == 'N/A' || $scope.iniCons == 'N/A') {
               $scope.riskLevel = "N/A";
               var elem = document.getElementById("riskLevel");
               elem.style.backgroundColor = "#C8C8C8";
           } else {
               getRiskColor();
           }
       }

       $scope.initialControlMeasure = [{
           measure: ''
       }];

       // DELETE
       $scope.deleteExistingControlMeasure = function(index) {
           if ($scope.initialControlMeasure.length > 1) {
               $scope.initialControlMeasure.splice(index, 1);
           }
       }

       // ADD
       $scope.addExistingControlMeasure = function() {
           ind = $scope.initialControlMeasure.length - 1;
           if ($scope.initialControlMeasure[ind].measure) {
        	   if($scope.validateFreeTextDynamic('initialControlMeasure', ind, 'measure', 'initialControlMeasuresFreeTextValidation')){
        		   var dataObj = {
                           measure: ''
                       };
                       $scope.initialControlMeasure.push(dataObj);
        	   }
        	   
           }
       }

       /**************SECTION 2 ***************/
       $scope.additionalControlMeasure = [{
           measure: ''
       }];
       var elem1 = document.getElementById("addRiskLevel");

       function getAdditionalRiskColor() {
           if (($scope.addFre == '1' && $scope.addCons == '1') || ($scope.addFre == '1' && $scope.addCons == '2') || ($scope.addFre == '2' && $scope.addCons == '1')) {
               $scope.additionalRiskLevel = "Very Low";
               elem1.style.backgroundColor = "#93DB70";
           } else if (($scope.addCons == '1' && $scope.addFre == '3') || ($scope.addCons == '1' && $scope.addFre == '4')) {
               $scope.additionalRiskLevel = "Low";
               elem1.style.backgroundColor = "#79CDCD";
           } else if (($scope.addCons == '2' && $scope.addFre == '2')) {
               $scope.additionalRiskLevel = "Medium";
               elem1.style.backgroundColor = "#ffd27f";
           } else if (($scope.addCons == '2' && $scope.addFre == '3') || ($scope.addCons == '3' && $scope.addFre == '1')) {
               $scope.additionalRiskLevel = "High";
               elem1.style.backgroundColor = "#ffa500";
           } else if (($scope.addCons == '2' && $scope.addFre == '4') || ($scope.addCons == '3' && $scope.addFre == '2') || ($scope.addCons == '3' && $scope.addFre == '3') || ($scope.addCons == '3' && $scope.addFre == '4')) {
               $scope.additionalRiskLevel = "Very High";
               elem1.style.backgroundColor = "#ff6666";
           }
       }

       $scope.addCons = "N/A";
       $scope.addFre = "N/A";
       $scope.additionalRiskLevel = "N/A";

       $scope.calculateAdditionalRisk = function() {
           if ($scope.addFre == 'N/A' || $scope.addCons == 'N/A') {
               $scope.additionalRiskLevel = "N/A";
               var elem1 = document.getElementById("addRiskLevel");
               elem1.style.backgroundColor = "#C8C8C8";
           } else {
               getAdditionalRiskColor();
           }
       }

       $scope.additionalControlMeasure = [{
           measure: ''
       }];

       // ADD 
       $scope.addAdditionalControlMeasure = function() {
//
//           if ($scope.addAdditionalControlMeasure.length === 0) {
//               var dataObj = {
//                   measure: ''
//               };
//               $scope.additionalControlMeasure.push(dataObj);
//           }

           ind = $scope.additionalControlMeasure.length - 1;
           if ($scope.additionalControlMeasure[ind].measure) {
        	   if($scope.validateFreeTextDynamic('additionalControlMeasure', ind, 'measure', 'additionalControlMeasuresFreeTextValidation')){
	               var dataObj = {
	                   measure: ''
	               };
	               $scope.additionalControlMeasure.push(dataObj);
               }
           }
       }

       // DELETE
       $scope.deleteAdditionalControlMeasure = function(index) {
           if ($scope.additionalControlMeasure.length > 1) {
               $scope.additionalControlMeasure.splice(index, 1);
           }
       }


       /*********  Risk Assessment and control rows **********/

       function clearRiskAssessment() {
           $scope.activity = "",
               $scope.hazard = "",
               $scope.initialControlMeasure = [{
                   measure: ''
               }];
           $scope.riskLevel = "N/A",
               $scope.additionalControlMeasure = [{
                   measure: ''
               }];
           $scope.additionalRiskLevel = "N/A";
           $scope.iniCons = "N/A";
           $scope.iniFre = "N/A";
           $scope.addCons = "N/A";
           $scope.addFre = "N/A";
           $scope.hazardEffect = "";

           var elem = document.getElementById("riskLevel");
           var elem1 = document.getElementById("addRiskLevel");
           elem1.style.backgroundColor = "#C8C8C8";
           elem.style.backgroundColor = "#C8C8C8";

       }

       // ADD
       riskrefidCount = 1;
       $scope.existingCtrlList = [];
       $scope.additionalCtrlList = [];
       $scope.initialRskListObj = {};
       $scope.otherHazardEffect = "";
       $scope.otherHazard = "";
       $scope.addRiskAssessment = function() {

           // STEP 1: Validate Section 1
           if (validateSection1() === false) {
               return;
           }

           // STEP 2: Validate Section 2 
           if ($scope.riskLevel === "Very High" || $scope.riskLevel === "High") {
               if (validateSection2() === false) {
                   return;
               }
           }

           // STEP 3: Generate riskrefid for rskinitialrisk table
           var riskrefid = $scope.rskId + '/' + $scope.hazardNo;

           // STEP 4: Create object for initialControlMeasure list
           $scope.existingCtrlList = [];
           for (i = 0; i < $scope.initialControlMeasure.length; i++) {
               var existingCtrlObj = {
                   "riskcontrolid": riskrefid + '/' + (i + 1),
                   "riskrefid": riskrefid,
                   "hazardno": $scope.hazardNo,
                   "controltype": 'Section1',
                   "controlmeasure": $scope.initialControlMeasure[i].measure,
                   "frequency": $scope.iniFre,
                   "consequence": $scope.iniCons,
                   "risklevel": $scope.riskLevel
               }
               $scope.existingCtrlList.push(existingCtrlObj);
           }

           // STEP 5: Create object for additionalControlMeasure list
           count = $scope.initialControlMeasure.length + 1;
           $scope.additionalCtrlList = [];
           for (i = 0; i < $scope.additionalControlMeasure.length; i++) {
               var additionalCtrlObj = {
                   "riskcontrolid": riskrefid + '/' + (count++),
                   "riskrefid": riskrefid,
                   "hazardno": $scope.hazardNo,
                   "controltype": 'Section2',
                   "controlmeasure": $scope.additionalControlMeasure[i].measure,
                   "frequency": $scope.addFre,
                   "consequence": $scope.addCons,
                   "risklevel": $scope.additionalRiskLevel
               }
               $scope.additionalCtrlList.push(additionalCtrlObj);
           }

           //STEP 6: Create final dictionary 
           $scope.initialRskListObj[$scope.hazardNo] = {
               "riskrefid": riskrefid,
               "hazardno": $scope.hazardNo,
               "rskid": $scope.rskId,
               "activity": $scope.activity,
               "hazardcode": $scope.hazard,
               "effhazardcode": $scope.hazardEffect,
               "existingControlMeasures": $scope.existingCtrlList,
               "othereffhazard": $scope.otherHazardEffect,
               "otherhazard": $scope.otherHazard,
               "additionalControlMeasures": $scope.additionalCtrlList
           }

           $scope.otherHazardEffect = "";
           $scope.otherHazard = "";
           $scope.hazardNo = $scope.hazardNo + 1;
           $scope.hazardsCount = $scope.hazardsCount + 1;
           clearRiskAssessment();
           
           if($scope.toggleApprove === true) {
        	   showHideApprove();
           }
           
           $scope.isOtherHazard = false;
           $scope.isOtherHazardEffect = false;
           
           return true;
       }

       // DELETE
       $scope.deleteRiskAssessment = function(hazardNo) {
           delete $scope.initialRskListObj[hazardNo];
           $scope.hazardsCount = $scope.hazardsCount - 1;
           
           if($scope.toggleApprove === true) {
        	   showHideApprove();
           }
       }

       // EDIT
       $scope.editdisabled = true;
       $scope.editRiskAssessment = function(hazardNo) {
           resetSection1ValidationsErrors();
           resetSection2ValidationsErrors();
           $scope.editdisabled = false;
           var editObj = $scope.initialRskListObj[hazardNo];
           $scope.currhazardNo = angular.copy($scope.hazardNo);
           $scope.hazardNo = hazardNo;

           $scope.activity = editObj.activity;
           $scope.hazard = editObj.hazardcode;
           $scope.riskLevel = editObj.existingControlMeasures[0].risklevel,
               $scope.iniCons = editObj.existingControlMeasures[0].consequence;
           $scope.iniFre = editObj.existingControlMeasures[0].frequency;
           $scope.hazardEffect = editObj.effhazardcode;

           if ($scope.hazardEffect === 'EHZ007') {
               $scope.otherHazardEffect = editObj.othereffhazard;
               $scope.isOtherHazardEffect = true;
           } else {
               $scope.isOtherHazardEffect = false;
           }

           if ($scope.hazard === 'HAZ096') {
               $scope.otherHazard = editObj.otherhazard;
               $scope.isOtherHazard = true;
           } else {
               $scope.isOtherHazard = false;
           }

           getRiskColor();
           if (editObj.additionalControlMeasures[0] != undefined) {
               $scope.additionalRiskLevel = editObj.additionalControlMeasures[0].risklevel;
               $scope.addCons = editObj.additionalControlMeasures[0].consequence;
               $scope.addFre = editObj.additionalControlMeasures[0].frequency;
           } else {
               $scope.additionalRiskLevel = "N/A";
               $scope.addCons = "N/A";
               $scope.addFre = "N/A";
               var elem1 = document.getElementById("addRiskLevel");
               elem1.style.backgroundColor = "#C8C8C8";
           }

           getAdditionalRiskColor();

           $scope.initialControlMeasure = [];
           for (i = 0; i < editObj.existingControlMeasures.length; i++) {
               var obj = {
                   "measure": editObj.existingControlMeasures[i].controlmeasure
               };
               $scope.initialControlMeasure.push(obj);
           }

           $scope.additionalControlMeasure = [];
           for (i = 0; i < editObj.additionalControlMeasures.length; i++) {
               var obj = {
                   "measure": editObj.additionalControlMeasures[i].controlmeasure
               };
               $scope.additionalControlMeasure.push(obj);
           }
           

           if($scope.toggleApprove === true) {
        	   showHideApprove();
           }
       }

       // CANCEL EDIT
       $scope.cancelEdit = function() {
           clearRiskAssessment();
           $scope.editdisabled = true;
           $scope.hazardNo = $scope.currhazardNo;
           $scope.isOtherHazardEffect = false;
           $scope.isOtherHazard = false;
       }

       $scope.update = function() {
           if ($scope.addRiskAssessment() === true) {;
               $scope.editdisabled = true;
               $scope.hazardNo = $scope.currhazardNo;
           }
       }

       /**************VALIDATIONS HERE*************************/

       $scope.validationError = "This field is required";

       function resetSection1ValidationsErrors() {
           $scope.activityRequiredError = false,
               $scope.hazardRequiredError = false,
               $scope.hazardEffectRequiredError = false;
           $scope.initialControlMeasureRequiredError = false,
               $scope.iniConsRequiredError = false;
           $scope.iniFreRequiredError = false;
		   $scope.otherHazardRequiredError = false;
		   $scope.otherHazardEffectRequiredError = false;
       }

       function validateSection1() {
           var raiseRequiredErrorFlag = false;
           resetSection1ValidationsErrors();

           if ($scope.activity === "" || $scope.activity === null || $scope.activity === undefined) {
               $scope.activityRequiredError = true,
                   raiseRequiredErrorFlag = true;
           }else{
        	   if (!$scope.validateFreeText('activity','activityFreeTextValidation')){
        		   raiseErrorFlag = true;
        	   }
           }

           if ($scope.hazard === "") {
               $scope.hazardRequiredError = true,
                   raiseRequiredErrorFlag = true;
           }

           if ($scope.hazardEffect === "") {
               $scope.hazardEffectRequiredError = true,
                   raiseRequiredErrorFlag = true;
           }
           
           if ($scope.hazardEffect === 'EHZ007') {
        	   if(!$scope.otherHazardEffect) {
        		   $scope.otherHazardEffectRequiredError = true;
        		   raiseRequiredErrorFlag = true;
        	   }               
           }

           if ($scope.hazard === 'HAZ096') {
        	   if(!$scope.otherHazard) {
        		   $scope.otherHazardRequiredError = true;
        		   raiseRequiredErrorFlag = true;
        	   }
           }

           if ($scope.initialControlMeasure[0].measure === "") {
               $scope.initialControlMeasureRequiredError = true
                   raiseRequiredErrorFlag = true;
           }

           if ($scope.iniCons === "N/A") {
               $scope.iniConsRequiredError = true,
                   raiseRequiredErrorFlag = true;
           }

           if ($scope.iniFre === "N/A") {
               $scope.iniFreRequiredError = true,
                   raiseRequiredErrorFlag = true;
           }

           if (raiseRequiredErrorFlag === true) {
               return false
           } else {
               resetSection1ValidationsErrors();
               return true;
           }

       }
       
       resetSection1ValidationsErrors()

       function resetSection2ValidationsErrors() {
           $scope.additionalControlMeasureRequiredError = false,
               $scope.addConsRequiredError = false;
           $scope.addFreRequiredError = false;
       }

       function validateSection2() {

           var raiseRequiredErrorFlag2 = false;
           resetSection2ValidationsErrors();

           if ($scope.addFre === "N/A" || $scope.addFre === undefined) {
               $scope.addFreRequiredError = true,
                   raiseRequiredErrorFlag2 = true;
           }

           if ($scope.addCons === "N/A" || $scope.addCons === undefined) {
               $scope.addConsRequiredError = true,
                   raiseRequiredErrorFlag2 = true;
           }

           if ($scope.additionalControlMeasure[0].measure === "" || $scope.additionalControlMeasure[0].measure === undefined) {
               $scope.additionalControlMeasureRequiredError = true,
                   raiseRequiredErrorFlag2 = true;
           }

           if (raiseRequiredErrorFlag2 === true) {
               return false
           } else {
               resetSection2ValidationsErrors();
               return true;
           }
       }


       function resetValidationsErrors() {
           $scope.categoryRequiredError = false;
           $scope.taskRequiredError = false;
           $scope.locationRequiredError = false;
           $scope.workingPersonRequiredError = false;
           $scope.equipmentRequiredError = false;
           $scope.departmentHeadRequiredError = false;
           $scope.isAdequateRequiredError = false;
           $scope.jobcommencedateRequiredError = false;
           $scope.jobCommentsRequiredError = false;
           $scope.jobcompleteddateRequiredError = false;
       }

       function isJobCompletionSectionValidated() {
           $scope.actionFormHide = false;
           var raiseErrorFlag = false;
           resetValidationsErrors();

           if (!$scope.isAdequate) {
               $scope.isAdequateRequiredError = true;
               raiseErrorFlag = true;
           }

           if (!$scope.jobComments) {
               $scope.jobCommentsRequiredError = true;
               raiseErrorFlag = true;
           }else{
        	   if (!$scope.validateFreeText('jobComments','comments_error')){
        		   raiseErrorFlag = true;
        	   }
           }

           if (!$scope.jobcompleteddate) {
               $scope.jobcompleteddateRequiredError = true;
               raiseErrorFlag = true;
           }

           if (!$scope.jobcommencedate) {
               $scope.jobcommencedateRequiredError = true;
               raiseErrorFlag = true;
           }

           if (raiseErrorFlag === true) {
               return false
           } else {
               resetValidationsErrors();
               return true;
           }

       }

       function isFormValidated() {
           $scope.actionFormHide = false;
           var raiseErrorFlag = false;
           resetValidationsErrors();
           
           if ($scope.cateogory === "" || $scope.cateogory === null) {
               $scope.categoryRequiredError = true;
	           	if(raiseErrorFlag === false) {
	        		firstErrorProneField = "categoryrsk";
	        	}
               raiseErrorFlag = true;
           }

           if (!$scope.task) {
               $scope.taskRequiredError = true;
	           	if(raiseErrorFlag === false) {
	        		firstErrorProneField = "taskrsk";
	        	}
               raiseErrorFlag = true;
           }else{
        	   if (!$scope.validateFreeText('task','taskFreeTextValidation')){
               	if(raiseErrorFlag === false) {
            		firstErrorProneField = "taskrsk";
            	}
        		   raiseErrorFlag = true;
        	   }
           }

           if ($scope.location === "" || $scope.location === null) {
               $scope.locationRequiredError = true;
           	if(raiseErrorFlag === false) {
        		firstErrorProneField = "locationrsk";
        	}
               raiseErrorFlag = true;
           }

           if ($scope.workingPerson.length === 0 || $scope.workingPerson === null) {
               $scope.workingPersonRequiredError = true;
           	if(raiseErrorFlag === false) {
        		firstErrorProneField = "persondoingworkrsk";
        	}
               raiseErrorFlag = true;
           }

           if (!$scope.equipment) {
               $scope.equipmentRequiredError = true;
           	if(raiseErrorFlag === false) {
        		firstErrorProneField = "eqprsk";
        	}
               raiseErrorFlag = true;
           }else{
        	   if (!$scope.validateFreeText('equipment','equipmentFreeTextValidation')){
        		   raiseErrorFlag = true;
               	if(raiseErrorFlag === false) {
            		firstErrorProneField = "eqprsk";
            	}
        	   }
           }

           if ($scope.departmentHead === "" || $scope.departmentHead === null) {
               $scope.departmentHeadRequiredError = true;
           	if(raiseErrorFlag === false) {
        		firstErrorProneField = "hodrsk";
        	}
               raiseErrorFlag = true;
           }

           if(angular.equals($scope.initialRskListObj, {}) === true) {
        	   	validateSection1()
              	if(raiseErrorFlag === false) {
            		firstErrorProneField = "section1Section2";
            	}
                   raiseErrorFlag = true;
           }

           if (raiseErrorFlag === true) {

               var old = $location.hash();
               $anchorScroll.yOffset = 250;
               $location.hash(firstErrorProneField);
               $anchorScroll();
               $location.hash(old);
               
               return false
           } else {
               resetValidationsErrors();
               return true;
           }

       }

       /******** ACTION BUTTONS HANDLERS **********************/
       
       function checkIncompleteEntryForHigherRsk() {
	       for (var key in $scope.initialRskListObj) {
	           if ($scope.initialRskListObj[key].existingControlMeasures[0].risklevel === "Very High" ||
	               $scope.initialRskListObj[key].existingControlMeasures[0].risklevel === "High") {
	               if ($scope.initialRskListObj[key].additionalControlMeasures[0] === undefined ||
	            	   $scope.initialRskListObj[key].additionalControlMeasures[0].measure === "") {
	                   $scope.addMeasuresDialog.open();
	                   $rootScope.showScreenOverlay = false;
	                   return true;
	               }
	           }
	       }
	       
	       return false;
       }
       
       var SEND = 'Send';
       var SAVE = 'Save';
       var APPROVED = 'Approve';
       var CLOSE = 'Close';
       var REASSIGN = 'reassign';

       $scope.saveFormData = function(btnClickType) {
    	   $rootScope.showScreenOverlay = true;
           // Storing Risk Workflows History
           $scope.displayShipWorkflow = true;
           var riskMasterData = {
               "categorycode": $scope.cateogory,
               "cmpcomment": null,
               "eqpused": $scope.equipment,
               "hazardcount": $scope.hazardsCount,
               "headrankcode": $scope.departmentHead,
               "istemplate": null,
               "locationcode": $scope.location,
               "rskid": $scope.rskId,
               "taskname": $scope.task,
               "activeStatus": "INP",
               "isAdequate": $scope.isAdequate,
               "jobcommencedate": new Date($scope.jobcommencedate),
               "jobComments": $scope.jobComments,
               "jobcompleteddate": new Date($scope.jobcompleteddate),
               "offset": new Date().getTimezoneOffset(),
               "rskrfid" : $scope.rskrfid
           }
           
           var rskwfHistoryData = {
               "upddate": new Date(),
               "formstatus": "INP",
               "stageid": $scope.actionRights[2]
           }

           var rskPermitToCodeData = [];
           for (i = 0; i < $scope.workPermit.length; i++) {
               var obj = {
                   permitCode: $scope.workPermit[i]
               }
               rskPermitToCodeData.push(obj);
           }

           var rskWorkingPersonData = [];
           for (i = 0; i < $scope.workingPerson.length; i++) {
               var obj = {
                   rankcode: $scope.workingPerson[i]
               }
               rskWorkingPersonData.push(obj);
           }

           if (btnClickType === SEND) {
               if (isFormValidated() === false) {
            	   $rootScope.showScreenOverlay = false;
              	 toaster.error({
                     title: "Information",
                     body: "Data couldn't be sent. Please enter the required fields"
                 });
                   return;
               }

               if (checkIncompleteEntryForHigherRsk() === true) {
            	   $rootScope.showScreenOverlay = false;
            	   return;
               }

               rskwfHistoryData.formstatus = "SUB";
               riskMasterData.activeStatus = "SUB";
               rskwfHistoryData.senddate = new Date();
               $rootScope.showScreenOverlay = false;
           }

           if (btnClickType === APPROVED) {
               if (isFormValidated() === false) {
            	   $rootScope.showScreenOverlay = false;
              	 toaster.error({
                     title: "Information",
                     body: "Data couldn't be sent. Please enter the required fields"
                 });
                   return;
               }
               
               if (checkIncompleteEntryForHigherRsk() === true) {
            	   $rootScope.showScreenOverlay = false;
            	   return;
               }
               
               rskwfHistoryData.formstatus = "APR";
               riskMasterData.activeStatus = "APR";
               $scope.activeStatus = "APR";

           }

           if (btnClickType == CLOSE) {
               if (isJobCompletionSectionValidated() === false) {
              	 toaster.error({
                     title: "Information",
                     body: "Data couldn't be sent. Please enter the required fields"
                 });
                   $scope.isCloReJ = false;
                   $rootScope.showScreenOverlay = false;
                   return;
               }

               rskwfHistoryData.formstatus = "CLO";
               riskMasterData.activeStatus = "CLO";
               $scope.activeStatus = "CLO";
               riskMasterData.isAdequate = $scope.isAdequate;
               riskMasterData.jobComments = $scope.jobComments;
               $scope.isCloReJ = false;
               $rootScope.showScreenOverlay = false;
           }

           if (btnClickType == REASSIGN) {
               rskwfHistoryData.formstatus = "RSN";
               rskwfHistoryData.remarks = $scope.remarks;
               riskMasterData.activeStatus = "RSN";
               $rootScope.showScreenOverlay = false;
           }

           var companyAdditionalRiskData = [];
           var formCompositeData = {
               riskMaster: riskMasterData,
               rskPermitToCode: rskPermitToCodeData,
               rskWorkingPerson: rskWorkingPersonData,
               initialRskList: $scope.initialRskListObj,
               rskwfHistory: rskwfHistoryData,
               companyAdditionalRisk: companyAdditionalRiskData,
               remarks: $scope.remarks
           }
           
           Connectivity.IsOk().then(function(response) {
               riskManagementService.saveRiskContentItem(formCompositeData).then(function(response) {
            	   $scope.geterrormessages = response.data.message;	
	                $scope.geterrorstatus = response.data.errorstatus;
	                $scope.geterrorstatuscode = response.data.status;                
	                $scope.dataerror = response.data.message;  
	                
					if(response.data.status==0 && response.data.length!=0 ){		
						
	                	$scope.wrkflowstatus = response.data.data[0].rskWHistory;
	                	$scope.rskrfid = response.data.data[0].refId;
	                	                
//                       if (response.data.status == 0 && response.data.length != 0) {
//                           $scope.wrkflowstatus = response.data.data;
                           	   toaster.success({title: "Information", body:response.data.successMessage});
                               if (btnClickType != SAVE) {   
                            	   $scope.actionFormHide = true;
                            	   $scope.actionRights[0] = "";
                               }

	                        // Call Actions
			    			 $http({
			    		            method: 'POST',
			    		            url: "/get-risk-actions/",
			    		            data: $scope.rskId
			    		        }).then(
			    		            function(response) {
			            	            
			            	            $scope.actionRights = response.data[0];			            	            
			            	            if( $scope.actionRights != undefined) {
			    	        	            if ($scope.actionRights[0] == 'CLO') {
			    	        	               $scope.isCloseOutStage = false;
			    	        	            }
			            	            }	
			            	            
			            	            $scope.toggleApprove = false;
			            	            if( response.data[1] != undefined) {
			    	        	            if (response.data[1][0] == 'APR') {
			    	        	               $scope.toggleApprove = true;
			    	        	               showHideApprove();
			    	        	            }
			            	            }			            	            
			            	            
			    		     });

                           resetSection1ValidationsErrors();
                           resetSection2ValidationsErrors();
                           resetValidationsErrors();
                       } else {
	                    	$scope.errordetails = response.data.exceptionDetail;
	   	                	$scope.showexception = response.data.showerrormessage
	   	                	$scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;	
	   						$scope.dataerror = [response.data.message[0]]; 
                       }
                       $rootScope.showScreenOverlay = false;

                   }),
                   function errorCallback(response) {
                       $scope.dataSaveStatus = "Data couldn't be sent. Please enter the required fields";
                   };
           }, function(error) {
               $scope.dialog.open();
               $scope.dataerror = "Server not reached";
           });


       }
       
       $scope.deleteActionPerformed = function(){
         	 form_data = {
                      'rskid': $scope.rskId,
                  };
         	 Connectivity.IsOk().then(function(response) {
         		riskManagementService.deleteRiskAssessmentMainForm(form_data).then(function(response) {
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
       
       
    // Export To PDF
	    $scope.saveAsPDFDocument = function() {
	        
	        form_data = {
	        		'rskid' : $scope.rskId,
	        		'vesselName' :$scope.vesselName,
	        		'assessDate' :new Date($scope.assessDate).toString(),
	    			'approvalDate': new Date($scope.approvalDate).toString(),
	    			'closerDate' : new Date($scope.closerDate).toString(), 
	    			'offset': new Date().getTimezoneOffset(),
	        };
		 
	        $http({
	            url: "/RiskAssessment-Export-PDF/",
	            data: form_data,
	            dataType: 'json',
	            method: 'POST',
	            responseType: 'arraybuffer',
	        /*    data: form_data = {
	            		'offset': new Date().getTimezoneOffset(),'offset': new Date().getTimezoneOffset(),
	            }*/
	         /*   data: form_data = {
	            		
	            		 "riskrefid" : riskrefid,
	    				 "hazardno" : $scope.hazardNo,		
	    				 "rskid" : $scope.rskId,
	    				 "activity" : $scope.activity,	
	    				 "hazardcode" :	$scope.hazard,
	    				 "effhazardcode" :	$scope.hazardEffect,
	    				 "existingControlMeasures" : $scope.existingCtrlList,
	    				 "additionalControlMeasures": $scope.additionalCtrlList,
	    				 "cmpcomment": $scope.companyComment,
	            },*/


	        }).then(
	                function(response) {
	                    var myBlob = new Blob([response.data], {
	                        type: "application/pdf"
	                    });
	                    var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
	                    var anchor = document.createElement("a");
	                    anchor.download = $scope.vesselName+"-"+"RiskAssessment"+"-"+ $scope.rskrfid;
	                    anchor.href = blobURL;
	                    anchor.click();


	                });
	    };

	    // Export To Excel
	    $scope.exportexcel = function() {
	    	form_data = {
	    			'rskid' : $scope.rskId,	
	    			'assessDate' :new Date($scope.assessDate).toString(),
	    			'approvalDate': new Date($scope.approvalDate).toString(),
	    			'closerDate' : new Date($scope.closerDate).toString(), 
	    			'offset': new Date().getTimezoneOffset(),
	    			 
				};
	        $http({
	            method: 'POST',
	            url: "/RiskAssessment-Export-excel/",
	            responseType: 'arraybuffer',
	            data: form_data
	        }).then(
	            function(response) {
	            
	                var myBlob = new Blob([response.data], {
	                    type: "application/vnd.ms-excel"
	                });
	                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
	                var anchor = document.createElement("a");
	                anchor.download =$scope.vesselName+"-"+"RiskAssementReport"+"-"+$scope.rskId+".xls";
	                anchor.href = blobURL;
	                anchor.click();


	            });
	    };
       
       
   });
   