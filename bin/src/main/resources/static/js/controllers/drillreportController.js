app.controller('DrillReportCtrl', function(accidentReportService,$anchorScroll,Connectivity, toaster, $scope,$rootScope, $http, $window, $location, $filter, $timeout, $q, $routeParams) {

    var drlid = $routeParams.id;
//    $scope.latitude = "20"
    $scope.geterrorstatuscode ="0";
    $scope.reAssignDialogClick = function(targetName) {
    	$scope.targetName = targetName;
        $scope.reAssignDialog.open();
    }
 
    
    $scope.$watch('TimeofDrills', function() {
        var tempDate = $scope.TimeofDrills.split('/');
        tempDate = new Date(parseInt(tempDate[2]),parseInt(tempDate[0])-1, parseInt(tempDate[1]));
        if (tempDate < new Date()){
        	$scope.restrictFutureDate = {
	        		max: $scope.TimeofDrills,
	        }
        }else{
        	$scope.restrictFutureDate = {
	        		max: new Date()
	        }
        }        
    });
    
    $scope.$watch('drillData.eventtime', function() {
        var tempDate = $scope.drillData.eventtime.split('/');
        tempDate = new Date(parseInt(tempDate[2]),parseInt(tempDate[0])-1, parseInt(tempDate[1]));
        if (tempDate < new Date()){
        	$scope.restrictFutureDate = {
	        		max: $scope.drillData.eventtime,
	        }
        }else{
        	$scope.restrictFutureDate = {
	        		max: new Date()
	        }
        }        
    });
    
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
    
    $scope.reassignActions = [{
    	text: 'Yes',
        action: function openOkAction(){
        	angular.element($scope.targetName).modal('show');
        }
    }, {
    	text: 'No'
    }];
  
    $scope.changesea = function() {
        $scope.hideError('place');
        console.log($scope.placetype,"$scope.placetype")
        if ($scope.placetype == 'At Sea') {
            $scope.seashow = true;
            $scope.portshow = false;
        } else if ($scope.placetype == 'At Port') {
            $scope.portshow = true;
            $scope.seashow = false;
        } else {
            $scope.portshow = false;
            $scope.seashow = false;
        }
    }
    $scope.okAction= function (targetName) {
            if ($scope.remarks !== '' && $scope.remarks !== undefined) {
            	 $scope.saveForm('reassign');
                angular.element(targetName).modal('hide');
            }else{
            	$scope.remarksMessage_error="This field is required";
            }
    }
    $scope.hideError = function(field) {
    	var fieldName = field + "_error";
    	$scope[fieldName] =  " ";
    	if(field=='portcode'){
        	$scope.portname_error="";
        }
    }	
    
    $scope.latitude = "";
    
    $scope.max200Length = 200;
    $scope.max500Length = 500;
    $scope.max100Length = 100;
    
	$scope.previewFileName = "";
	
	$scope.previewObj  = {
			"title": $scope.previewFileName
	}

    /************** TO PREVIEW FILE *********************/
    $scope.previewFile = function(docid, docName) {
        $http.get('/drill/downloadDocument/?docId=' + docid, {
                responseType: 'blob'
            })
            .then(function(response) {
                var data = new Blob([response.data], {
                    type: 'image/jpeg;charset=UTF-8'
                });
                //    		 var data = new Blob([response.data], {type: 'application/pdf'});
                url = $window.URL || $window.webkitURL;
                $scope.fileUrl = url.createObjectURL(data);
                //    		    $scope.content = $scope.fileUrl;
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
        $scope.confirmDeleteDialog.close();
        $scope.dialog.close();
        $scope.reAssignDialog.close();

    });

    $scope.actions = [{
        text: 'Ok'
    }];
    
 	$scope.errorActions = [
 		                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
 		               ];

    $scope.exceededFileCountDialogMsg = "You cannot attach more than 3 files. Remove a file, then try.";
    $scope.deleteDialogMsg = "You sure, that you want to delete this?";
    $scope.deleteActions = [{
    	 text: 'Yes',
         action: removeDocument
        },
        {
        	 text: 'No'
        }
    ];

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

    $scope.actions = [{
        text: 'Ok'
    }];
    
    
    /***********Date Picker validation**********/
    $scope.validateDate = function(modelName, errorModelName){
    	
  	   var currentDate = Date.parse($scope[modelName]);
         //Check if Date parse is successful
         if (!currentDate) {
      	    $scope[modelName] ="";
             $scope[errorModelName] = "That doesn't seem like a valid date";
         }
     }
     $scope.validateDateDynamic = function(existingdrillData, index, key,errorModelName){
     	console.log($scope[existingdrillData], index , key, errorModelName)
   	   var currentDate = Date.parse($scope[existingdrillData][index][key]);
          //Check if Date parse is successful
          if (!currentDate) {
         	 $scope[existingdrillData][index][key] ="";
              $scope[errorModelName] = "That doesn't seem like a valid date";
              $scope.errorIndex=index;
              console.log($scope[errorModelName]);
          }else{
         	 $scope.errorIndex = -1;
          }
      }
     /**************End of Date picker validation*******/

     /*******************************************************************/
     Connectivity.IsOk().then(function(response) {
     	$rootScope.showScreenOverlay = true;
         $http({
             method: 'POST',
             url: "/get-drill-report-initial-load-data/",
             data: {
                 "drlid": drlid
             }
         }).then(function(response) {
        	 console.log(response , '  response  ????????&%^^^^^^^^^^^^^^^^^^^^^')
             	$rootScope.showScreenOverlay = false;
                 $scope.geterrormessages = response.data.message;
                 $scope.geterrorstatus = response.data.errorstatus;
                 $scope.geterrorstatuscode = response.data.status;
                 $scope.dataerror = response.data.message;
                 $scope.TimeofDrills = null;
                 if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                     console.log("MAJOR ONE RESPONSE", response.data);
                     
                     // Form Number
                     $scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
                     var formMasterData = response.data.data[0].formMasterData[0];
                     $scope.masterView = response.data.data[0].systemConfig;
                     
                     if($scope.masterView[0] !== $scope.masterView[1]){
                     	console.log($scope.masterView ,'$scope.masterView ??????%%%%%%%%%%% in if ')
                     	$scope.masterText = true;
                     }else{
                     	console.log($scope.masterView ,'$scope.masterView ??????%%%%%%%%%%% in else ')
                     	$scope.masterText = false;
                     }
                     
                     $scope.actFormno = formMasterData.actFormno;
                     $scope.actRevno = formMasterData.actRevno;
                     $scope.reviseddate = formMasterData.reviseddate;

                     $scope.filesData = response.data.data[0].formsDoc;
                     countActiveFiles();

                     $scope.typeofdrills = response.data.data[0].drilltypeMasterData;

                     var crewdetailsData = response.data.data[0].crewNamesData;
                     
                     $scope.crewdetails = [];
                     console.log(crewdetailsData , 'crewdetailsData ??????????????? ')
                     for(i = 0 ; i < crewdetailsData.length; i++) {
                     	var obj = {
                     			empCode: crewdetailsData[i][1]+"-"+crewdetailsData[i][3],
                     			empName: crewdetailsData[i][0] +" ( "+crewdetailsData[i][4]+" )"	
                     	}
                     	
                     	$scope.crewdetails.push(obj);
                     }    
                     $scope.selectOption1 = {
                 		placeholder: "Select Absentees",
                 		dataTextField: "empName",
                 		dataValueField: "empCode",
                 		autoBind: true,
                 		valuePrimitive: true,
                         autoClose: false,
                         dataSource: {
                             data: $scope.crewdetails
                         }
                     };
                     
                     var btnActions = response.data.data[0].buttonActionsData;
                     console.log(btnActions,' #################### btnActions ')
                     if(btnActions[0] != undefined) {
                     	$scope.actionRight = btnActions[0][0];
                     	$scope.permitRight = btnActions[0][1];
                     	$scope.stageId = btnActions[0][2]; 
                     	if( btnActions[0][3] != undefined) {
                     		$scope.isReassign = btnActions[0][3];
                     	}
                     	$scope.deleteAction=btnActions[1];
                     }
                     
                     var drillReportMasteData = response.data.data[0].drillReportMasteData;
                     
                     $scope.wrkflowstatus = response.data.data[0].drillWorkFlowHistData;
                     
                 	if($scope.wrkflowstatus.length > 0) {
          			   $scope.displayShipWorkflow = true;
          			}
  
                     $scope.formno = {
                             "actFormno": drillReportMasteData.formnumber
                         };
                     
                     $scope.drlid = {
                         "drlid": drillReportMasteData.drlid
                     };
                     
                     $scope.mdlname = drillReportMasteData.mdlname;
                     $scope.maxFileCount = drillReportMasteData.maxFileCount;
                     $scope.vesselCode = drillReportMasteData.vesselCode;
                     $scope.placetype = drillReportMasteData.shipposition;
                     $scope.changesea();
                     $scope.formatedDate = drillReportMasteData.dateFormat;
                     $scope.mastercode = drillReportMasteData.mastername;
                     $scope.nameOfMaster = drillReportMasteData.vslmastername;
                     $scope.VesselName = drillReportMasteData.vesselname;
                     $scope.portcode = drillReportMasteData.portcode;
                     $scope.latitude = drillReportMasteData.latitude;
                     $scope.longitude = drillReportMasteData.longitude;
                     $scope.DrillScenario = drillReportMasteData.drillscenario;
                     $scope.Debriefing = drillReportMasteData.debriefing;
                     $scope.MastersEvaluation = drillReportMasteData.masterevaluation;
                     $scope.NameOfMaster = drillReportMasteData.masterrankcode;
                     $scope.drillreportdate = drillReportMasteData.drillreportdate;
                     $scope.formno.actRevno = drillReportMasteData.revisionno;
                     $scope.formno.reviseddate = drillReportMasteData.revisiondate;
                     $scope.formnumber == drillReportMasteData.formnumber;
                     $scope.drillotherParticipant = drillReportMasteData.otherparticipant;
                     $scope.crUser = drillReportMasteData.cruser;
                     $scope.crDate = drillReportMasteData.crDate;
                     $scope.formstatus = drillReportMasteData.formstatus;
                     $scope.vesselCode = drillReportMasteData.vesselCode;
                     $scope.TimeofDrills = drillReportMasteData.drilldatetime;
                     $scope.typeofdrill = drillReportMasteData.drilltype;
                     $scope.chiefOff = drillReportMasteData.chiefOfficerName;
                     $scope.chiefEng = drillReportMasteData.chiefEngName;
                     $scope.chiefEngCode = drillReportMasteData.chiefEng;
                     $scope.chiefOfficerCode = drillReportMasteData.chiefOfficer;
                     $scope.maxFileSize = drillReportMasteData.maxFileSize;
                     $scope.dateFormat = drillReportMasteData.dateFormat;
                     $scope.activeStatus = drillReportMasteData.active_status; 
                     $scope.drlrfid = drillReportMasteData.drlrfid;
                     if (drillReportMasteData.active_status == "APR") {
                    	 $scope.exportDis = true;
                      $scope.closeOutDis = true;
                    }
         			if(drillReportMasteData.drilldatetime != null){
         				var cnvrtDate = new Date(drillReportMasteData.drilldatetime);
         				var ampm = (cnvrtDate.getUTCHours() >= 12) ? "PM" : "AM";
         				var hours = (cnvrtDate.getUTCHours() > 12) ? (cnvrtDate.getUTCHours() - 12) : (cnvrtDate.getUTCHours());
         				$scope.TimeofDrills =  ((cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear()+" "+ hours +":"+cnvrtDate.getUTCMinutes()+" "+ampm );
         			} 
                     
                     $scope.drillreportDetails = response.data.data[0].drillReportdetailData;
                     if ($scope.drillreportDetails.length > 0) {
                         $scope.existingdrillData = [];
                         for (var i = 0; i < $scope.drillreportDetails.length; i++) {
                         	
     	        			if($scope.drillreportDetails[i].eventtime != null){
     	        				var cnvrtDate = new Date($scope.drillreportDetails[i].eventtime);
     	        				var ampm = (cnvrtDate.getUTCHours() >= 12) ? "PM" : "AM";
     	        				var hours = (cnvrtDate.getUTCHours() > 12) ? (cnvrtDate.getUTCHours() - 12) : (cnvrtDate.getUTCHours());
     	        				$scope.drilldate =  ((cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear()+" "+ hours +":"+cnvrtDate.getUTCMinutes()+" "+ampm );
     	        			} 
     	        			
                             $scope.existingdrillData.push({
                                 'eventtime': $scope.drilldate,
                                 'eventdetails': $scope.drillreportDetails[i].eventdetails,
                                 'drldetailid' : $scope.drillreportDetails[i].drldetailid,
                                 'drlid' : $scope.drillreportDetails[i].drlid,
                                 'detailid' : $scope.drillreportDetails[i].detailid,
                                 'deleteFlag' : $scope.drillreportDetails[i].deleteFlag
                             });
                         }
                     }
                     
                     $scope.drillunparticipantsDetails = response.data.data[0].unparticipatedData;
                     
                     $timeout(function(){
                         for (var i = 0; i < $scope.drillunparticipantsDetails.length; i++) {
                             $scope.absentees.push($scope.drillunparticipantsDetails[i][1]+"-"+$scope.drillunparticipantsDetails[i][2]);
                         }
                       },2000);
                     
                     console.log("$scope.absentees============================================================",$scope.absentees);
                     
                     if (!$scope.portcode == '' || !$scope.portcode == undefined) {
                         $http({
                             method: 'POST',
                             url: "/get-drill-report-port-name/",
                             data: {
                                 "portcode": $scope.portcode
                             }
                         }).then(function(response) {
                             $scope.obj1 = [];
                             $scope.obj1 = response.data;

                             $scope.portname = $scope.obj1[0].portname;;
                         });
                     }


                 } else {
                     $scope.errordetails = response.data.exceptionDetail;
                     $scope.showexception = response.data.showerrormessage
                     $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                     $scope.dataerror = [response.data.message[0]];
                 }
                 $rootScope.showScreenOverlay = false;
             });
     }, function(error) {
         $scope.dataerror = "Server not reached";
     })

    /**********************************************************************************/


    $scope.hidebody = true;
    $scope.haspermission = false;
    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }
    $scope.showModal2 = function(targetName) {
        angular.element(targetName).modal('show');
    }
    $scope.monthPickerConfig = {
        max: new Date()
    };

    $scope.hideusercode = false;
    $scope.errorFlag = false;
    $scope.sea = true;
    $scope.port = false;
    $scope.existingdrillData = [{
        'eventtime': undefined,
        'eventdetails': undefined,
        'drldetailid' : undefined,
        'drlid' : undefined,
        'detailid' : undefined,
        'deleteFlag' : undefined
    }];

    var setSessionValues = function() {
        $scope.date = new Date();
        $scope.year = new Date().getFullYear()
        $scope.portListData = [];
    }
    setSessionValues();


    $scope.absentees = [];
//    $scope.followstring = [];
//
//    $scope.followerSelect = function(empid, empcode, rankcode, rankname) {
//        $scope.add = ({
//            'empid': empid,
//            'empname': empcode
//        });
//        var json = angular.toJson($scope.add);
//        var rankcodes = $scope.followstring.indexOf(json);
//        if (rankcodes === -1) {
//            $scope.followstring.push(json);
//            $scope.followgrid = true;
//            var jsonObj = JSON.parse(json);
//            $scope.follow.push(jsonObj);
//        } else {
//            $scope.followstring.splice($scope.followstring.indexOf(json), 1);
//            $scope.deleteExistingfollow(empid);
//
//
//        }
//    }
//
//    $scope.followerButtonLabel = function(empid, empcode) {
//        $scope.add = ({
//            'empid': empid,
//            'empname': empcode
//        });
//        var json = angular.toJson($scope.add);
//        var rankcodes = $scope.followstring.indexOf(json);
//        if (rankcodes === -1) {
//            return "Select";
//        } else {
//            return "Selected";
//        }
//    }

//
//    $scope.deleteExistingfollow = function(empid, empcode, rankcode, rankname) {
//
//        var index = -1;
//        var followdelete = eval($scope.follow);
//        for (var i = 0; i < followdelete.length; i++) {
//            if (followdelete[i].empid === empid) {
//                index = i;
//                break;
//            }
//        }
//        $scope.follow.splice(index, 1);
//    }

    $scope.adddrillReport = function() {
    	ind = $scope.existingdrillData.length-1;
    	if($scope.existingdrillData[ind].eventtime !== '' &&
    			$scope.existingdrillData[ind].eventtime !== undefined &&
    			$scope.existingdrillData[ind].eventdetails !== undefined &&
    			$scope.existingdrillData[ind].eventdetails !== '') {
	        $scope.existingdrillData.push({
	            'eventtime': "",
	            'eventdetails': "",
	            'drldetailid' : "",
                'drlid' : "",
                'detailid' : "",
                'deleteFlag' : ""
	        });
    	}    
    };
    $scope.deleteDrillDetailData=[];
    $scope.deletedrillReport = function(index) {
        if (index > 0) {
//        	$scope.deleteDrillDetailData.push($scope.existingdrillData[index]);
        	$scope.existingdrillData[index].deleteFlag = "D";
//            $scope.existingdrillData.splice(index, 1);
        }
    };

    $scope.showModal = false;
    $scope.hide = function() {
        $scope.showModal = false;
    }

//    $scope.follow = [];
//    $scope.followstring = [];
//
//    $scope.followerSelect = function(empid, empcode, rankcode, rankname) {
//        $scope.add = ({
//            'empid': empid,
//            'empname': empcode
//        });
//        var json = angular.toJson($scope.add);
//        var rankcodes = $scope.followstring.indexOf(json);
//        if (rankcodes === -1) {
//            $scope.followstring.push(json);
//            $scope.followgrid = true;
//            var jsonObj = JSON.parse(json);
//            $scope.follow.push(jsonObj);
//        } else {
//            $scope.followstring.splice($scope.followstring.indexOf(json), 1);
//            $scope.deleteExistingfollow(empid);
//
//
//        }
//    }

//    $scope.followerButtonLabel = function(empid, empcode) {
//        $scope.add = ({
//            'empid': empid,
//            'empname': empcode
//        });
//        var json = angular.toJson($scope.add);
//        var rankcodes = $scope.followstring.indexOf(json);
//        if (rankcodes === -1) {
//            return "Select";
//        } else {
//            return "Selected";
//        }
//    }


    $scope.deleteExistingfollow = function(empid, empcode, rankcode, rankname) {

        var index = -1;
        var followdelete = eval($scope.follow);
        for (var i = 0; i < followdelete.length; i++) {
            if (followdelete[i].empid === empid) {
                index = i;
                break;
            }
        }
        $scope.follow.splice(index, 1);
    }
    $scope.actionFormHide = false;

    // save Form to Drill Report Master
    $scope.saveForm = function(typeOfButtonClicked) {
        $scope.resetvalidation();
        $scope.isSaving = true;
        $scope.formstatus = "INP";
        $scope.actionFormHide = false;
        $scope.displayShipWorkflow = true;
        
        if (typeOfButtonClicked == 'send') {
            $scope.validation();
            if ($scope.errorFlag == false) {
                $scope.formstatus = "SUB"
            } else {
            	toaster.error({
                    title: "Information",
                    body: "Data couldn't be sent. Please enter the required fields"
                });
                $scope.isSaving = false;
                return;
                
            }
            
        }
        
        if (typeOfButtonClicked == 'approve') {
            $scope.validation();
            if ($scope.errorFlag == false) {
                $scope.formstatus = "APR";
                $scope.activeStatus = "APR";
            } else {
                $scope.isSaving = false;
                return;
            } 
        }
        
        if (typeOfButtonClicked == 'reassign') {
                $scope.formstatus = "RSN";
        }
        
        if ($scope.errorFlag == false) {
            form_data = {
                'formnumber': $scope.formno.actFormno,
                'drlid': $scope.drlid.drlid,
                'timeoffset': new Date().getTimezoneOffset(),
                'vesselCode': $scope.vesselCode,
                'drilldatetime': ($scope.TimeofDrills != null ? new Date($scope.TimeofDrills) : null),
                'shipposition': $scope.placetype,
                'portcode': $scope.portcode,
                'latitude': $scope.latitude,
                'longitude': $scope.longitude,
                'otherparticipant': $scope.drillotherParticipant,
                'drilltype': $scope.typeofdrill,
                'drillscenario': $scope.DrillScenario,
                'debriefing': $scope.Debriefing,
                'masterevaluation': $scope.MastersEvaluation,
                'mastername': $scope.mastercode,
                'active_status': $scope.formstatus,
                'drillreportdate': new Date().toISOString(),
                'revisionno': $scope.formno.actRevno,
                'revisiondate': $scope.formno.reviseddate,
                'cruser': $scope.crUser,
                'crDate': $scope.crDate,
                "chiefEng": $scope.chiefEngCode,
                "chiefOfficer": $scope.chiefOfficerCode,
                'drlrfid' : $scope.drlrfid,
            };

    		// Storing Drill Workflows History
            var drillWorkFlowHistoryData  = {
            	"formstatus": $scope.formstatus,
            	"remarks": $scope.remarks
            }

            $scope.existingdrillData;
            sendexistingdrillData = [];
            for (var i = 0; i < $scope.existingdrillData.length; i++) {
            	if($scope.existingdrillData[i].eventdetails != "" &&
            	   $scope.existingdrillData[i].eventdetails != undefined &&
            	   $scope.existingdrillData[i].eventtime != "" &&
            	   $scope.existingdrillData[i].eventtime != undefined) {
	                sendexistingdrillData.push({
	                    'drlid': $scope.drlid.drlid,
	                    'eventtime': new Date($scope.existingdrillData[i].eventtime),
	                    'eventdetails': $scope.existingdrillData[i].eventdetails,
	                    'drldetailid' : $scope.existingdrillData[i].drldetailid,
	                    'detailid' : $scope.existingdrillData[i].detailid,
	                    'deleteFlag' : $scope.existingdrillData[i].deleteFlag
	                });
            	}
            }

            $scope.follow;
            sendunparticipantsData = [];
            for (var i = 0; i < $scope.absentees.length; i++) {
            	var url = $scope.absentees[i].split('-');
            	console.log(url[0] , 'url[0] $@%&^*%#$@%&^*(&#$%@%&*( url[1] ', url[1])
            	sendunparticipantsData.push({
                    'drlid': $scope.drlid.drlid,
                    'unppid':  url[0],
                    'unpprnkid' :  url[1],
                });
            }
            console.log($scope.absentees,"HERE IS IT");
            Connectivity.IsOk().then(function(response) {
            	$rootScope.showScreenOverlay = true;
                $http({
                        url: "/Save-Drillreport/",
                        method: 'POST',
                        data: {
                            drillReportMaster: form_data,
                            drillReportdetail: sendexistingdrillData,
                            drillUnParticipants: sendunparticipantsData,
                            vesselcode: "ELSA",
                            stageid: $scope.stageId ,
                            drillWfHistory: drillWorkFlowHistoryData
                            
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function(response) {
                    	$rootScope.showScreenOverlay = false;
    	            	$scope.geterrormessages = response.data.message;	
    	                $scope.geterrorstatus = response.data.errorstatus;
    	                $scope.geterrorstatuscode = response.data.status;                
    	                $scope.dataerror = response.data.message; 
    	                console.log(response.data ,'response.data ???????????????? ')
                        if (response.data.status == 0 && response.data.length != 0) {
                        	
                        	if(response.data.data[0].refNo.length > 0){
                        		$scope.drlrfid = response.data.data[0].refNo;
                        	}                        	
                        	
                        	$scope.drillreportDetails = response.data.data[0].drillReportdetailData;
                        	console.log($scope.drillreportDetails ,'$scope.drillreportDetails ?????????????? ////////////// ')
                            if ($scope.drillreportDetails.length > 0) {
                                $scope.existingdrillData = [];
                                for (var i = 0; i < $scope.drillreportDetails.length; i++) {
                                	
            	        			if($scope.drillreportDetails[i].eventtime != null){
            	        				var cnvrtDate = new Date($scope.drillreportDetails[i].eventtime);
            	        				var ampm = (cnvrtDate.getUTCHours() >= 12) ? "PM" : "AM";
            	        				var hours = (cnvrtDate.getUTCHours() > 12) ? (cnvrtDate.getUTCHours() - 12) : (cnvrtDate.getUTCHours());
            	        				$scope.drilldate =  ((cnvrtDate.getUTCMonth()+1)+"/"+cnvrtDate.getUTCDate()+"/"+cnvrtDate.getUTCFullYear()+" "+ hours +":"+cnvrtDate.getUTCMinutes()+" "+ampm );
            	        			} 
            	        			
                                    $scope.existingdrillData.push({
                                        'eventtime': $scope.drilldate,
                                        'eventdetails': $scope.drillreportDetails[i].eventdetails,
                                        'drldetailid' : $scope.drillreportDetails[i].drldetailid,
                                        'drlid' : $scope.drillreportDetails[i].drlid,
                                        'detailid' : $scope.drillreportDetails[i].detailid,
                                        'deleteFlag' : $scope.drillreportDetails[i].deleteFlag
                                    });
                                }
                            }
                        	
                        	
//                        	$scope.drlrfid=response.data.data[0];
//                            $scope.wrkflowstatus = response.data.data;
                            
        					toaster.success({title: "Information", body:response.data.successMessage});
        					
        	                if (typeOfButtonClicked != 'save' ) {
        						$scope.actionFormHide=true;
        	                }
        	                if ($scope.activeStatus == "APR") {
        	                   	 $scope.exportDis = true;
        	                     $scope.closeOutDis = true;
        	                   }
                        } else {
                        	$scope.errordetails = response.data.exceptionDetail;
                           	$scope.showexception = response.data.showerrormessage
//                          $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;	
//            				$scope.dataerror = [response.data.message[0]]; 
                        }
                        
                        // Call actions 
                   	 	$http({
                              method: 'POST',
                              url: "/get-drill-workflow-history/",
                              data: {"drlid": drlid}
                          }).then(
                              function(response) {	           
                              $scope.wrkflowstatus = response.data;  
                       });
                   	 
                        $scope.isSaving = false;
                        $rootScope.showScreenOverlay = false;
                    }),
                    function errorCallback(response) {
                        $scope.dataSaveStatus = "Data couldn't be sent. Please enter the required fields";
                    };
            }, function(error) {
                $scope.dialog.open();
                $scope.dataerror1 = "Server not reached";
            });
        }
    }

    $scope.getAtPortName=function(){
    	if($scope.portcode.length==5){
    	 accidentReportService.getAccidentPortNames($scope.portcode).then(function(response) {
             $scope.ports = response.data.data;
             $scope.portname=$scope.ports[0].portname;
         });	
    	}else{
    		 $scope.portname="";
    	}
    }
  
    $scope.btnAtPortCodeActionPerformed = function() {
        $scope.portnameAtList = [];
        $scope.showModal = true;
        $scope.ports = [];
        $http({
            method: 'POST',
            url: "/get-vessel-master-portnames/",
            data: $scope.portcode,
        }).then(function(response) {
            $scope.ports = response.data;
            angular.forEach($scope.ports, function(value, key) {
                var portcode = value.portcode;
                var portname = value.portname;
                $scope.portnameAtList.push({
                    "key": portcode,
                    "value": portname
                });
            });
        });
    }

    $scope.showModal = false;
    $scope.hide = function() {
        $scope.showModal = false;
    }
    $scope.setValue = function(arg1, arg2) {
        $scope.portcode = arg1;
        $scope.portname = arg2;
        $scope.hide();
    }

    $scope.auditorName = [];

    $scope.radioenable = function(status, name) {
        if (name == 'port') {
            $scope.port = true;
            $scope.sea = false;
        } else {
            $scope.sea = true;
            $scope.port = false;
        }
    }

    $scope.resetvalidation = function() {
        $scope.errorFlag = false;
        $scope.TimeofDrill_error = '';
        $scope.TypeofDrill_error = '';
        $scope.DrillScenario_error = '';
        $scope.DrillUnParticipants_error = '';
        $scope.Time_error = '';
        $scope.EventsDetails_error = '';
        $scope.Debriefing_error = '';
        $scope.portcode_error = '';
        $scope.MastersEvaluation_error = '';
        $scope.DrillotherParticipants_error = '';
    }
    //validation form 
    $scope.validation = function() {
    	 var raiseErrorFlag = false;
         var firstErrorProneField;
        $scope.errorFlag = false;
        $scope.errormessage = "This field is required"
        if (!$scope.TimeofDrills) {
            $scope.TimeofDrill_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "dateTime";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.TimeofDrill_error = '';
        }

        if (!$scope.typeofdrill) {
            $scope.TypeofDrill_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "typeofDrill";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.TypeofDrill_error = '';
        }
        if (!$scope.DrillScenario) {
            $scope.DrillScenario_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "drillScenario";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.DrillScenario_error = '';
        }
        if ($scope.absentees.length == 0) {
            $scope.DrillAbsen_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "drillAbsenties";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.DrillAbsen_error = '';
        }
//        if ($scope.follow.length == 0) {
//            $scope.DrillUnParticipants_error = $scope.errormessage;
//            $scope.errorFlag = true;
//        } else {
//            $scope.DrillUnParticipants_error = '';
//        }

        if ($scope.existingdrillData[0].eventtime === undefined || $scope.existingdrillData[0].eventtime === "" || $scope.existingdrillData[0].eventtime === null) {
            $scope.Time_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "timeSheet";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.Time_error = '';
        }
        if ($scope.existingdrillData[0].eventdetails === undefined || $scope.existingdrillData[0].eventdetails === "" || $scope.existingdrillData[0].eventdetails === null) {
            $scope.EventsDetails_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "timeSheet";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.EventsDetails_error = '';
        }
        if (!$scope.Debriefing) {
            $scope.Debriefing_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "deBriefing";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.Debriefing_error = '';
        }
        if (!$scope.placetype) {
            $scope.place_error =  $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "shipPosition";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.placetype == 'At Port' && !$scope.portcode) {
            $scope.portcode_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "shipPosition";
        	}
            raiseErrorFlag = true;
        }
//        if($scope.placetype == 'At Port' && $scope.portcode){
//         	 accidentReportService.portcodeValidation($scope.toport).then(function(response) {
//         		if(response.data.message!=null){
//         			$scope.dataerror1 = response.data.message;
//            		 $scope.dialog.open();
//         		}
//              });
//        }
        if ($scope.placetype == 'At Port' && !$scope.portname) {
            $scope.portname_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "shipPosition";
        	}
            raiseErrorFlag = true;
        }

        if ($scope.placetype == 'At Sea') {
            if (($scope.latitudeValidation === false)) {
                $scope.latitude_error = $scope.errormessage;
                $scope.errorFlag = true;
                if(raiseErrorFlag === false) {
            		firstErrorProneField = "shipPosition";
            	}
                raiseErrorFlag = true;
            } else {
                $scope.latitude_error = "";
                $scope.errorFlag = false;
            }
        }
        if ($scope.myFile.length>0) {
            $scope.filemsg_error = "Please upload the selected file";
            $scope.errorFlag = true;
        }
        if ($scope.placetype == 'At Sea') {
            if (($scope.longitudeValidation === false)) {
                $scope.longitude_error = $scope.errormessage;
                $scope.errorFlag = true;
                if(raiseErrorFlag === false) {
            		firstErrorProneField = "shipPosition";
            	}
                raiseErrorFlag = true;
            } else {
                $scope.longitude_error = "";
                $scope.errorFlag = false;
            }
        }
//        if (!$scope.MastersEvaluation) {
//            $scope.MastersEvaluation_error = $scope.errormessage;
//            $scope.errorFlag = true;
//        } else {
//            $scope.MastersEvaluation_error = '';
//        }
        if (!$scope.drillotherParticipant) {
            $scope.DrillotherParticipants_error = $scope.errormessage;
            $scope.errorFlag = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "otherParticipants";
        	}
            raiseErrorFlag = true;
        } else {
            $scope.DrillotherParticipants_error = '';
        }
        
        if ($scope.myFile.length>0) {
            $scope.filemsg_error = "Please upload the selected file";
            $scope.errorFlag = true;
         }else{
        	 $scope.filemsg_error = "";    
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

            return false;
        }
    }


    /***************** ATTACHMENTS **************************/

    function countActiveFiles() {
        $scope.activeFileCount = 0;
        for (i = 0; i < $scope.filesData.length; i++) {
            if ($scope.filesData[i].docstatus === 'A') {
                $scope.activeFileCount++;
            }
        }
    }

    //File Upload
    $scope.myFile = [];
    $scope.isuploading = false;

    $scope.uploadFile = function() {
        $rootScope.showScreenOverlay = true;
        $scope.filemsg_error = "";
        var file = $scope.myFile;

        if ($scope.myFile.length + $scope.activeFileCount > $scope.maxFileCount) {
            $scope.exceededFileCountDialog.open();
            $rootScope.showScreenOverlay = false;
            return;
        }

        var filesformdata = new FormData();
        filesformdata.append("formNumber", $scope.drlid.drlid);
        filesformdata.append("mdlCode", "DRI");
        filesformdata.append("attachmentTypeFolder", "Form Attachments");

        for (i = 0; i < $scope.myFile.length; i++) {
            if (($scope.myFile[i]._file.name).split('.')[1] == 'sql') {
                thowsUnsupportedFileError($scope.myFile[i]._file.name);
                $rootScope.showScreenOverlay = false;
                return;
            }

            if ($scope.myFile[i]._file.size <= $scope.maxFileSize * 1048576) {
                filesformdata.append('file' + i, $scope.myFile[i]._file);
                $scope.hideFilesFlag = false;

            } else {
                thowsFileSizeExceededError($scope.myFile[i]._file.name);
                $rootScope.showScreenOverlay = false;
                return;
            }
        };
        var request = {
            method: 'POST',
            url: '/drill/uploadDocuments/',
            data: filesformdata,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        };

        // SEND THE FILES.
        $http(request)
            .then(function(response) {
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                    $http({
                        method: 'POST',
                        url: "/drill/fetchDocuments/",
                        data: {
                            "formNumber": $scope.drlid.drlid
                        }
                    }).then(
                        function(response) {
                            $scope.geterrormessages = response.data.message;
                            $scope.geterrorstatus = response.data.errorstatus;
                            $scope.geterrorstatuscode = response.data.status;
                            $scope.dataerror = response.data.message;
                            if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                                $scope.filesData = response.data.data;
                                countActiveFiles();
                                $rootScope.showScreenOverlay = false;
                            } else {
                                $rootScope.showScreenOverlay = false;
                                $scope.errordetails = response.data.exceptionDetail;
                                $scope.showexception = response.data.showerrormessage
                                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                                $scope.dataerror = [response.data.message[0]];
                            }
                        });
                } else {
                    $rootScope.showScreenOverlay = false;
                    $scope.errordetails = response.data.exceptionDetail;
                    $scope.showexception = response.data.showerrormessage
                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                    $scope.dataerror = [response.data.message[0]];
                }

            });
        $scope.myFile = [];
    };
    
/*    $scope.uploadFile = function() {
        var file = $scope.myFile;
        $scope.filemsg_error="";
        if ($scope.myFile.length + $scope.activeFileCount > $scope.maxFileCount) {
            $scope.exceededFileCountDialog.open();
            if ($scope.filesData.length>$scope.maxFileCount) {
                $scope.myFile=[];
              }
            //$scope.myFile=[];
            return;
        }
        for (i = 0; i < $scope.myFile.length; i++) {
        	if (($scope.myFile[i]._file.name).split('.')[1]=='sql'){
        		thowsUnsupportedFileError($scope.myFile[i]._file.name);
        	}
            if ($scope.myFile[i]._file.size <= $scope.maxFileSize * 1048576) {
                var filesformdata = new FormData();
                filesformdata.append('file', $scope.myFile[i]._file);
                filesformdata.append("formNumber", $scope.drlid.drlid);
                filesformdata.append("mdlCode", "DRI");
                filesformdata.append("attachmentTypeFolder", "Form Attachments");
                $scope.hideFilesFlag = false;
                $scope.isuploading = true;

                var request = {
                    method: 'POST',
                    url: '/drill/uploadDocuments/',
                    data: filesformdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };

                // SEND THE FILES.
                $rootScope.showScreenOverlay = true;
                $http(request)
                    .then(function(response) {  
                    	$rootScope.showScreenOverlay = false;
    	            	$scope.geterrormessages = response.data.message;	
    	                $scope.geterrorstatus = response.data.errorstatus;
    	                $scope.geterrorstatuscode = response.data.status;                
    	                $scope.dataerror = response.data.message; 

                        if (response.data.status == 0 && response.data.length != 0) {
                            $http({
                                method: 'POST',
                                url: "/drill/fetchDocuments/",
                                data: $scope.drlid.drlid
                            }).then(
                                function(response) {
                                    $scope.filesData = response.data;
                                    countActiveFiles();
                                    $scope.isuploading = false;
                                });

                        } else {
                        	$scope.errordetails = response.data.exceptionDetail;
                           	$scope.showexception = response.data.showerrormessage
//                          $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;	
//            				$scope.dataerror = [response.data.message[0]];                     	
                        }
                        $rootScope.showScreenOverlay = false;
                    });

            } else {
                thowsFileSizeExceededError($scope.myFile[i]._file.name);
            }
        };
        $scope.myFile = [];
    };*/


    $scope.removeFile = function(index) {
        $scope.myFile.splice(index, 1);
    }

    //Remove Document
    
    function removeDocument() {
    	$rootScope.showScreenOverlay = true;
        $http({
        	url: "/drill/removeDocument/?docId=" + $scope.deleteDocId+"&formId="+$scope.drlid.drlid,
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
                    url: "/drill/fetchDocuments/",
                    data: {"formNumber": $scope.drlid.drlid}
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
                $rootScope.showScreenOverlay = false;
    			   }else{
    				$rootScope.showScreenOverlay = false;
               		$scope.errordetails=response.data.exceptionDetail;
                   	$scope.showexception=response.data.showerrormessage
                   	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
       				$scope.dataerror = [response.data.message[0]]; 	
       			}
        });
    };
    
    
    
    // Export To Excel
    $scope.exportexcel = function() {
        form_data = {
          'formnumber': $scope.formno.actFormno,
                'drlid': $scope.drlid.drlid,
                'vesselCode': $scope.vesselCode,
                'drilldatetime': ($scope.TimeofDrills != null ? new Date($scope.TimeofDrills) : null),
                'shipposition': $scope.placetype,
                'portcode': $scope.portcode,
                'latitude': $scope.latitude,
                'longitude': $scope.longitude,
                'otherparticipant': $scope.drillotherParticipant,
                'drilltype': $scope.typeofdrill,
                'drillscenario': $scope.DrillScenario,
                'debriefing': $scope.Debriefing,
                'masterevaluation': $scope.MastersEvaluation,
                'mastername': $scope.mastercode,
                'active_status': $scope.formstatus,
                'drillreportdate': new Date().toISOString(),
                'revisionno': $scope.formno.actRevno,
                'revisiondate': $scope.formno.reviseddate,
                'cruser': $scope.crUser,
                'crDate': $scope.crDate,
                "chiefEng": $scope.chiefEngCode,
                "chiefOfficer": $scope.chiefOfficerCode
        
        };
        $rootScope.showScreenOverlay = true;
        $http({
            method: 'POST',
            url: "/Drill-Export-excel/",
            responseType: 'arraybuffer',
            data: {
                "drlid": drlid,
            }
        }).then(
            function(response) {
            	$rootScope.showScreenOverlay = false;
                var myBlob = new Blob([response.data], {
                    type: "application/vnd.ms-excel"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.VesselName+"-"+"DrillReport"+"-"+$scope.drlid.drlid+".xls";
                anchor.href = blobURL;
                anchor.click();
                $rootScope.showScreenOverlay = false;

            });
    };
    
  
    
 // Export To PDF
    $scope.saveAsPDFDocument = function() {
    	console.log('entered into the pdf===================');
    	form_data = {
                'formnumber': $scope.formno.actFormno,
                'drlid': $scope.drlid.drlid,
                'vesselCode': $scope.vesselCode,
                'drilldatetime': ($scope.TimeofDrills != null ? new Date($scope.TimeofDrills) : null),
                'shipposition': $scope.placetype,
                'portcode': $scope.portcode,
                'latitude': $scope.latitude,
                'longitude': $scope.longitude,
                'otherparticipant': $scope.drillotherParticipant,
                'drilltype': $scope.typeofdrill,
                'drillscenario': $scope.DrillScenario,
                'debriefing': $scope.Debriefing,
                'masterevaluation': $scope.MastersEvaluation,
                'mastername': $scope.mastercode,
                'active_status': $scope.formstatus,
                'drillreportdate': new Date().toISOString(),
                'revisionno': $scope.formno.actRevno,
                'revisiondate': $scope.formno.reviseddate,
                'cruser': $scope.crUser,
                'crDate': $scope.crDate,
                "chiefEng": $scope.chiefEngCode,
                "chiefOfficer": $scope.chiefOfficerCode
            };
    	$rootScope.showScreenOverlay = true;
        $http({
            url: "/Drill-Export-PDF/",
            dataType: 'json',
            /*data: {"drlid": $scope.drlid.drlid},*/
            method: 'POST',
            responseType: 'arraybuffer',
            data: {
                "drlid": drlid,
               
            }
            /*data: form_data = {
                drillReportMaster: form_data,
            
            },*/
            

        }).then(
                function(response) {
                	$rootScope.showScreenOverlay = false;
                    var myBlob = new Blob([response.data], {
                        type: "application/pdf"
                    });
                    var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                    var anchor = document.createElement("a");
                    anchor.download = $scope.VesselName+"-"+"DrillReport"+"-"+$scope.drlrfid;
                    anchor.href = blobURL;
                    anchor.click();
                    $rootScope.showScreenOverlay = false;

                });
    };
    
    
    $scope.validateDate = function(modelName, ngModelName,errorModelName, ifConditionModel, typeOfPicker) {
		console.log('inside datte vaidatec>>>>>>>>')
		console.log($scope[modelName]);
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
   
    
    $scope.deleteActionPerformed = function(){
   	 form_data = {
   			 	'drlid': $scope.drlid.drlid,
            };
		   	 Connectivity.IsOk().then(function(response) {
		   		$http({
				    method: 'POST',
				    url: "/delete-drill-report-master/",
				    data: form_data,
				}).then(function(response) {
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
    
});