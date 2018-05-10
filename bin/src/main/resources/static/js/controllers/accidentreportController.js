app.controller('AccidentReportController', function($scope,$anchorScroll, $location, $window, $timeout, $http, toaster, Connectivity, accidentReportService, $routeParams,$rootScope) {
    $scope.hidebody = true;
    $scope.geterrorstatuscode = "0";
   
    $scope.max500Length = 500;
    $scope.max100Length = 100;
    $scope.hideError = function(ccmailid) {
        var fieldName = ccmailid + "_error";
        $scope[fieldName] = "";
        if(ccmailid=='Fromport'){
        	$scope.Fromportname_error="";
        }if(ccmailid=='portcode'){
        	$scope.portname_error="";
        }if(ccmailid=='toport'){
        	$scope.toportname_error="";
        }
    }
    $scope.haspermission = false;
    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }
    $scope.showModal = function(targetName) {
        angular.element(targetName).modal('show');
    }

    var date = new Date();
    $scope.restrictFutureDate = {
        max: date
    }

    $scope.getFromPortName=function(){
    	if($scope.fromport.length==5){
    	 accidentReportService.getAccidentPortNames($scope.fromport).then(function(response) {
             $scope.ports = response.data.data;
             $scope.fromportname=$scope.ports[0].portname;
         });	
    	}else{
    		 $scope.fromportname="";
    	}
    }
    $scope.getToPortName=function(){
    	if($scope.toport.length ==5){
    	 accidentReportService.getAccidentPortNames($scope.toport).then(function(response) {
             $scope.ports = response.data.data;
             $scope.toportname=$scope.ports[0].portname;
         });	
    	}else{
    		 $scope.toportname="";
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
    

    $scope.portshow = false;
    $scope.dayshow = false;
    $scope.seashow = false;;
    $scope.changesea = function() {
        $scope.hideError('place');
        if ($scope.placetype == 'sea') {
            $scope.seashow = true;
            $scope.portshow = false;
        } else if ($scope.placetype == 'port') {
            $scope.portshow = true;
            $scope.seashow = false;
        } else {
            $scope.portshow = false;
            $scope.seashow = false;
        }
    }
    $scope.changedelay = function() {
        $scope.hideError('delayschedule');
        if ($scope.delayschedule == 'Yes') {
            $scope.dayshow = true;
        } else {
            $scope.dayshow = false;
        }
    }

    $scope.validHour = function() {
        if ($scope.delay_hour > 23) {
            $scope.mindelay_error = "Hours must be in range 0-24."
            $scope.delay_hour = "";
        }
    }
    $scope.validMin = function() {
        if ($scope.delay_minute > 59) {
            $scope.mindelay_error = "Minutes must be in range 0-59."
            $scope.delay_minute = "";
        }
    }
    $scope.btnToPortCodeActionPerformed = function() {
        $scope.portnameList = [];
        $scope.showPortModal = true;
        $scope.toportname_error="";
        $scope.ports = [];
        accidentReportService.getAccidentPortNames($scope.toport).then(function(response) {
            $scope.ports = response.data.data;
            angular.forEach($scope.ports, function(value, key) {
                var portcode = value.portcode;
                var portname = value.portname;
                $scope.portnameList.push({
                    "key": portcode,
                    "value": portname
                });
            });
        });
    }

    $scope.showPortModal = false;

    $scope.hide = function() {
        $scope.showPortModal = false;
    }
    $scope.setValue = function(arg1, arg2) {
        $scope.toport = arg1;
        $scope.toportname = arg2;
        $scope.hide();
    }
    
    
    $scope.btnFromPortCodeActionPerformed = function() {
        $scope.portnameFromList = [];
        $scope.showPortModal1 = true;
        $scope.ports = [];
        $scope.Fromportname_error="";
        accidentReportService.getAccidentPortNames($scope.fromport).then(function(response) {
            $scope.ports = response.data.data;
            angular.forEach($scope.ports, function(value, key) {
                var portcode = value.portcode;
                var portname = value.portname;
                $scope.portnameFromList.push({
                    "key": portcode,
                    "value": portname
                });
            });
        });
        $scope.search1 = "";
    }
    $scope.showPortModal1 = false;
    $scope.hide1 = function() {
        $scope.showPortModal1 = false;
    }
    $scope.setValue1 = function(arg1, arg2) {
        $scope.fromport = arg1;
        $scope.fromportname = arg2;
        $scope.hide1();
    }
    $scope.btnAtPortCodeActionPerformed = function() {
        $scope.portnameAtList = [];
        $scope.showPortModal2 = true;
        $scope.ports = [];
        $scope.portname_error="";
        accidentReportService.getAccidentPortNames($scope.portcode).then(function(response) {
            $scope.ports = response.data.data;
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
    $scope.showPortModal2 = false;
    $scope.hide2 = function() {
        $scope.showPortModal2 = false;
    }
    $scope.setValue2 = function(arg1, arg2) {
        $scope.portcode = arg1;
        $scope.portname = arg2;
        $scope.hide2();
    }

    $scope.previewFileName = "";
	
	$scope.previewObj  = {
			"title": $scope.previewFileName
	}

    /************** TO PREVIEW FILE *********************/
    $scope.previewFile = function(docid,docName) {
		 $rootScope.showScreenOverlay = true;
        $http.get('/accidentreport/downloadDocument/?docId=' + docid, {
                responseType: 'blob'
            })
            .then(function(response) {
                var data = new Blob([response.data], {
                    type: 'image/jpeg;charset=UTF-8'
                });
                url = $window.URL || $window.webkitURL;
                $scope.fileUrl = url.createObjectURL(data);
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

    $scope.$on('$viewContentLoaded', function() {
        $scope.dialog.close();
        $scope.duplicateSigdialog.close();
        $scope.exceededRowsdialog.close();
        $scope.exceededFileSizedialog.close();
        $scope.exceededFileCountDialog.close();
        $scope.previewDialog.close();
        $scope.confirmDeleteDialog.close();
        $scope.reAssignDialog.close();
    });

    $scope.validationDialogMsg = "Some mandatory field/fields are missing.";
    $scope.duplicateSigDialogMsg = "You have added duplicate rank in Signature section, which is not permitted.";
    $scope.exceededRowsDialogMsg = "You cannot make more than 15 entries.";
    $scope.exceededFileCountDialogMsg = "You cannot attach more than 3 files. Remove a file, then try."
    function thowsUnsupportedFileError(filename) {
        $scope.fileSizeExceededDialogMsg = filename+ " is not supported format. Unable to upload.";
        $scope.exceededFileSizedialog.open();
    }
    function thowsFileSizeExceededError(filename) {
        $scope.fileSizeExceededDialogMsg = filename + " is more than 1 MB, cannot be uploaded";
        $scope.exceededFileSizedialog.open();
    }
    $scope.deleteDialogMsg = "You sure, that you want to delete this?";
    $scope.deleteActions = [{
    	text: 'Yes',
        action: removeDocument
    }, {
    	 text: 'No' 
    }];
    $scope.confirmDelete = function(docid) {
        $scope.deleteDocId = docid;
        $scope.confirmDeleteDialog.open();
    }
   
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
                $scope.saveAccidentReport('reasign');
                angular.element(targetName).modal('hide');
            }else{
            	$scope.remarksMessage_error="This field is required";
            }
    }
    $scope.actions = [
        { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
    ];
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
        $scope.filemsg_error = "";
        var file = $scope.myFile;

        if ($scope.myFile.length + $scope.activeFileCount > $scope.maxFileCount) {
            $scope.exceededFileCountDialog.open();
            $rootScope.showScreenOverlay = false;
            return;
        }

        var filesformdata = new FormData();
        filesformdata.append("formNumber", $scope.accId.accid);
        filesformdata.append("mdlCode", "ART");
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
            url: '/accidentreport/uploadDocuments/',
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
                        url: "/accidentreport/fetchDocuments/",
                        data: {
                            "formNumber": $scope.accId.accid
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
 
    $scope.removeFile = function(index) {
        $scope.myFile.splice(index, 1);
    }

    //Remove Document
    function removeDocument() {
    	$rootScope.showScreenOverlay = true;
        $http({
        	url: "/accidentreport/removeDocument/?docId=" + $scope.deleteDocId+"&formId="+$scope.accId.accid,
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
                url: "/accidentreport/fetchDocuments/",
                data: {"formNumber": $scope.accId.accid}
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
    /****************************************************************************/

    //save
    $scope.saveAccidentReport = function(typeOfButtonClicked) {
        var userstatus = true;
        var activeStatus = "INP"
        var formStatus = "INP"
        if (typeOfButtonClicked == 'save') {
            formStatus = "INP"
            activeStatus = "INP"
            $scope.resetErrors();
            $scope.saveValidation();
            //$scope.InputField_error = false;
            userstatus = true;
        }
        if (typeOfButtonClicked == 'send') {
            $scope.accidentReportInputFieldValidation();
            formStatus = "SUB"
            activeStatus = "SUB"
            userstatus = false;
        }
        if (typeOfButtonClicked == 'approve') {
            $scope.accidentReportInputFieldValidation();
            formStatus = "APR"
            activeStatus = "APR"
            userstatus = false;
        }
        if (typeOfButtonClicked == 'reasign') {
            formStatus = "RSN";
            activeStatus = "RSN";
            userstatus = false;
        }
        if (!$scope.InputField_error) {
        	$rootScope.showScreenOverlay = true;
            formData = {
            	"timeoffset": new Date().getTimezoneOffset(),
                "formnumber": $scope.formNo.actFormno,
                "revnumber": $scope.formNo.actRevno,
                "revdate": $scope.formNo.reviseddate,
                "accid": $scope.accId.accid,
                "reportdate": new Date($scope.reportDate).toISOString(),
                "charteredcode": $scope.charteddivison,
                "vesselcode": $scope.shipcode,
                "captaincode": $scope.captainCode,
                "chiefengcode": $scope.chiefOfficerCode,
                "vsltype": $scope.shiptypecode,
                "owner": $scope.ownercode,
                "charterer": $scope.charterer,
                "total_crew": $scope.totalcrew,
                "accdate": new Date($scope.accidate),
                "voyageno": $scope.voyageno,
                "acctype": $scope.accitype,
                "fromport": $scope.fromport,
                "toport": $scope.toport,
                "placetype": $scope.placetype,
                "portcode": $scope.portcode,
                "latitude": $scope.latitude,
                "longitude": $scope.longitude,
                "accoutline": $scope.outlineaccident,
                "vaccscode": $scope.vaccscode,
                "estcause": $scope.estimatedcause,
                "detailmech": $scope.mechanismdetail,
                "countermeasure": $scope.countermeasures,
                "ship_profiledate": $scope.ship_profiledate1,
                "machinerymodel": $scope.machinarymodel,
                "dockname": $scope.dockyardnames,
                "delayschedule": $scope.delayschedule,
                "delay_day": $scope.delay_day,
                "delay_hour": $scope.delay_hour,
                "delay_minute": $scope.delay_minute,
                "cargodamage": $scope.cargodamage,
                "cargodamage_det": $scope.cargodamage_det,
                "acc_class": $scope.classno,
                "active_status": activeStatus,
                "otheracctype": $scope.otheracctype,
                //"pro_acc_prevention": $scope.pro_acc_prevention,
                "usdtotal": $scope.usdtotal,
                "loctotal": $scope.loctotal,
                "offhire": $scope.offhire,
                "costimpact": $scope.costimpact,
                "fleetmngrcmt": $scope.fleetmngrcmt,
                "qshemngrcmt": $scope.qshemngrcmt,
                "wrkflowid": $scope.wrkflowid,
                "cruser": $scope.cruser,
                "crdate": $scope.crdate,
                "accrfid" : $scope.accrfid,
            }
            form_data_wfHistory = {
                'remarks': $scope.remarks,
            };

            if ($scope.pro_acc_prevention == "Two") {
                formData['pro_acc_prevention'] = 2;
            } else if ($scope.pro_acc_prevention == "Three") {
                formData['pro_acc_prevention'] = 3;
            } else if ($scope.pro_acc_prevention == "One") {
                formData['pro_acc_prevention'] = 1;
            } else {
                formData['pro_acc_prevention'] = 0;
            }

            member_data = [];
            
            tempcrewslist1 = [];
            for (var i = 0; i < $scope.crewslist.length; i++) {
                var tempcrewslist1 = $scope.crewslist[i];
                var email = tempcrewslist1[1];
                var email1 = tempcrewslist1[0];
                member_data.push({
                    'accid': $scope.accId.accid,
                    'country': $scope.tempcrewslist[i].email,
                    'membercount': $scope.tempcrewslist[i].email1
                });
            }
      
            Connectivity.IsOk().then(function(response) {
                compositeData = {
                    accidentReportMaster: formData,
                    accidentMemberCrew: member_data,
                    stageid: $scope.stageid,
                    formstatus: formStatus,
                    accidentWfHistory: form_data_wfHistory,
                }
                accidentReportService.saveAccidentReportMainForm(compositeData).then(function(response) {
                        console.log(response.data, "Message from server")
                        $scope.geterrormessages = response.data.message;
                        $scope.geterrorstatus = response.data.errorstatus;
                        $scope.geterrorstatuscode = response.data.status;
                        if (response.data.status == 0 && response.data.length != 0) {
                        	
                        	$scope.wrkflowstatus = response.data.data[0].accidentWfHistory;
                        	$scope.accrfid=response.data.data[0].refId;
                        	
                            if (typeOfButtonClicked != 'save') {
                                $scope.actionFormHide = true;
                            }
                            toaster.success({
                                title: "Information",
                                body: response.data.successMessage
                            });
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
                    }),
                    function errorCallback(response) {
                	 toaster.error({
                         title: "Information",
                         body: "Data couldn't be sent. Please enter the required fields"
                     });
                    };
            }, function(error) {
                $scope.dataerror1 = "Server not reached";
                $scope.dialog.open();
            })
        } else {
        	 toaster.error({
                 title: "Information",
                 body: "Data couldn't be sent. Please enter the required fields"
             });
        }
    }

    $scope.deleteActionPerformed = function(){
    	 form_data = {
                 'accid': $scope.accId.accid,
             };
    	 Connectivity.IsOk().then(function(response) {
             accidentReportService.deleteAccidentReportMainForm(form_data).then(function(response) {
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
                      $scope.closeOutDis = true;
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
    
    $scope.othersTypeselection = function() {
        var acctypecode = $scope.accitype;
        $scope.hideError('typeaccident');
        if (acctypecode == "AT019") {
            $scope.otherDiv = true;
        } else {
            $scope.otherDiv = false;
        }
    }

    var accId = $routeParams.id;
    Connectivity.IsOk().then(function(response) {
    	 $rootScope.showScreenOverlay = true;
        accidentReportService.getAccidentReportByNumber(accId).then(function(response) {
            $scope.geterrormessages = response.data.message;
            $scope.geterrorstatus = response.data.errorstatus;
            $scope.geterrorstatuscode = response.data.status;
            $scope.dataerror = response.data.message;
            if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                masterdata = response.data.data[0].AccidentReportMaster[0];
                $scope.accId = {
                    'accid': masterdata.accid
                };
                $scope.maxFileCount = masterdata.maxFileCount;
                $scope.maxFileSize = masterdata.maxFileSize;
                $scope.formNo = {
                    'actFormno': masterdata.formnumber,
                    'actRevno': masterdata.revnumber,
                    'reviseddate': masterdata.revdate
                };
                $scope.reportDate = masterdata.reportdate;
                $scope.shipname = masterdata.vesselname;
                $scope.shipcode = masterdata.vesselcode;
                $scope.shiptypecode = masterdata.vsltype;
                $scope.shiptypename = masterdata.vsltypedesc;
                $scope.ownercode = masterdata.owner;
                $scope.owner = masterdata.ownerName;
                
                if (masterdata.accdate != null) {
                    var accidentDate = new Date(masterdata.accdate);
                    var ampm = (accidentDate.getUTCHours() >= 12) ? "PM" : "AM";
                    var hours = (accidentDate.getUTCHours() > 12) ? (accidentDate.getUTCHours() - 12) : (accidentDate.getUTCHours());
                    $scope.accidate = ((accidentDate.getUTCMonth() + 1) + "/" + accidentDate.getUTCDate() + "/" + accidentDate.getUTCFullYear() + " " + hours + ":" + accidentDate.getUTCMinutes() + " " + ampm);
                }
                $scope.formatedDate = masterdata.formatedDate;
                $scope.charteddivison = masterdata.charteredcode;
                $scope.captainName = masterdata.captainName;
                $scope.captainCode = masterdata.captaincode;
                $scope.chiefOfficerCode = masterdata.chiefengcode;
                $scope.chiefEngineerName = masterdata.chiefOfficerName;
                $scope.charterer = masterdata.charterer;
                $scope.voyageno = masterdata.voyageno;
                $scope.accitype = masterdata.acctype;
                $scope.totalcrew = masterdata.total_crew;
                $scope.othersTypeselection();
                $scope.outlineaccident = masterdata.accoutline;
                $scope.estimatedcause = masterdata.estcause;
                $scope.machinarymodel = masterdata.machinerymodel;
                $scope.placetype = masterdata.placetype;
                $scope.latitude = masterdata.latitude;
                $scope.longitude = masterdata.longitude;
                $scope.portcode = masterdata.portcode;
                $scope.changesea();
                $scope.fromport = masterdata.fromport;
                $scope.toport = masterdata.toport;
                $scope.fromportname = masterdata.fromportname;
                $scope.toportname = masterdata.toportname;
                $scope.portname = masterdata.portname;
                $scope.otheracctype = masterdata.otheracctype;
                $scope.vaccscode = masterdata.vaccscode;
                $scope.mechanismdetail = masterdata.detailmech;
                if (masterdata.active_status == "CLO") {
                	 $scope.exportDis = true;
                    $scope.closeOutDis = true;
                }else if(masterdata.active_status == "VOI"){
                	 $scope.closeOutDis = true;
                }
                $scope.countermeasures = masterdata.countermeasure;
                $scope.delayschedule = masterdata.delayschedule;
                $scope.changedelay();
                $scope.cargodamage = masterdata.cargodamage;
                $scope.cargodamage_det = masterdata.cargodamage_det;
                
                if (masterdata.delay_day == 0) {
                    $scope.delay_day = '';
                } else {
                    $scope.delay_day = masterdata.delay_day;
                }
                if (masterdata.delay_hour == 0) {
                    $scope.delay_hour = '';
                } else {
                    $scope.delay_hour = masterdata.delay_hour;
                }
                if (masterdata.delay_minute == 0) {
                    $scope.delay_minute = '';
                } else {
                    $scope.delay_minute = masterdata.delay_minute;
                }
                $scope.pro_acc_prevention = "Zero";
                $scope.loctotal = masterdata.loctotal;
                $scope.usdtotal = masterdata.usdtotal;
                $scope.offhire = masterdata.offhire;
                $scope.costimpact = masterdata.costimpact;
                $scope.fleetmngrcmt = masterdata.fleetmngrcmt;
                $scope.qshemngrcmt = masterdata.qshemngrcmt;
                $scope.wrkflowid = masterdata.wrkflowid;
                $scope.cruser = masterdata.cruser;
                $scope.crdate = masterdata.crdate;
                $scope.currentUserCode = masterdata.currentUserCode;
                $scope.accrfid = masterdata.accrfid;

                $scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
                $scope.mdlname = masterdata.mdlname;
                
                //Communication Chat Details
                $scope.chatdata = response.data.data[0].communicationWindowList;
                $scope.filesData = response.data.data[0].formsdoc;
                countActiveFiles();
                
                $scope.wrkflowstatus = response.data.data[0].accidentWfHistory;
                for( i = 0 ; i < $scope.wrkflowstatus.length ; i++) {
         		   if($scope.wrkflowstatus[i].cntrltype === 'CNT001') {
         			   $scope.displayShoreWorkflow = true;
         		   }
         		   if($scope.wrkflowstatus[i].cntrltype === 'CNT002') {
         			   $scope.displayShipWorkflow = true;
         		   }
         	   }
                
                $scope.Actiondata = response.data.data[0].buttonaction;
                if ($scope.Actiondata != null && $scope.Actiondata.length != 0) {
                    $scope.actionrights = $scope.Actiondata[0][0];
                    $scope.defaultaction = $scope.Actiondata[0][1];
                    $scope.stageid = $scope.Actiondata[0][2];
                    $scope.reassignrights = $scope.Actiondata[0][3];
                    $scope.deleteAction=$scope.Actiondata[1];
                }

                //Get Accident Type Details
                $scope.AccidentTypeMaster = response.data.data[0].AccidentTypeMaster;
                $scope.main_accitype = $scope.AccidentTypeMaster;

                $scope.currencycodesList = [];
                $scope.CurrencyMaster = response.data.data[0].CurrencyMaster;
                $scope.currencycodesList = $scope.CurrencyMaster;

                $scope.ChartedDivison = response.data.data[0].ChartedDivison;
                $scope.main_charteddivison = $scope.ChartedDivison;
               


                //Get Vessel Master Detail for ShipProfileDate and dockyard name
                $scope.vesselMasterDetails = response.data.data[0].vesselDetails;
                for (var i = 0; i < $scope.vesselMasterDetails.length; i++) {
                    if ($scope.vesselMasterDetails[i].vesselcode == masterdata.vesselcode) {
                        $scope.dockyardnames = $scope.vesselMasterDetails[i].shipyard;
                        if ($scope.vesselMasterDetails[i].dateOfBuilt != null) {
                            $scope.ship_profiledate1 = new Date($scope.vesselMasterDetails[i].dateOfBuilt);
                            var ship_profiledate = new Date($scope.vesselMasterDetails[i].dateOfBuilt);
                            var month = 0;
                            var fullmonth = ship_profiledate.getMonth() + 1;
                            if ((fullmonth) <= 9) {
                                month = "0" + fullmonth;
                            } else {
                                month = fullmonth;
                            }
                            $scope.ship_profiledate = (ship_profiledate.getFullYear().toString().substr(2, 2) + "-" + month);
                        } else {
                            var ship_profiledate = new Date();
                            var month = 0;
                            var fullmonth = ship_profiledate.getMonth() + 1;
                            if ((fullmonth) <= 9) {
                                month = "0" + fullmonth;
                            } else {
                                month = fullmonth;
                            }
                            $scope.ship_profiledate = (ship_profiledate.getFullYear().toString().substr(2, 2) + "-" + month);
                        }
                    }
                }
                $scope.totcrewslist = response.data.data[0].accidentMemberCrewList;
                if ($scope.totcrewslist != null && $scope.totcrewslist.length != 0) {
                $scope.tempcrewslist = [];
                for (var i = 0; i < $scope.totcrewslist.length; i++) {
                    var email = $scope.totcrewslist[i].country;
                    var email1 = $scope.totcrewslist[i].membercount;
                    $scope.tempcrewslist.push({
                        'email': email,
                        'email1': email1
                    });
                }
                $scope.crewslist = $scope.tempcrewslist;
                }
                
                //Get To and CC MailId Detail from User Details
                $scope.MailId = response.data.data[0].MailId;

                if ($scope.MailId != null && $scope.MailId.length != 0) {
                    $scope.selectedToMails = [];
                    $scope.selectedCcMails = [];
                    $scope.selectedMails = [];
                    $scope.toMailid = [];
                    $scope.ccMailid = [];
                    for (i = 0; i < $scope.MailId.length; i++) {
                        var obj = {
                            "code": $scope.MailId[i][0],
                            "name": $scope.MailId[i][1]
                        }
                        $scope.selectedToMails.push(obj);
                        $scope.selectedCcMails.push(obj);
                    }
                    $scope.crew_toemailids = {
                        placeholder: "Select Email",
                        dataTextField: "name",
                        dataValueField: "name",
                        autoBind: true,
                        autoClose: false,
                        dataSource: {
                            data: $scope.selectedToMails
                        }
                    };

                    $scope.crew_ccemailids = {
                        placeholder: "Select Email",
                        dataTextField: "name",
                        dataValueField: "name",
                        autoBind: true,
                        autoClose: false,
                        dataSource: {
                            data: $scope.selectedCcMails
                        }
                    };
                    $scope.toMailid = "";
                    $scope.ccMailid = "";
                    $scope.toMailid = [];
                    $scope.ccMailid = [];
                    var temp = "";
                    var cctemp = "";
                    if (masterdata.tomailid != null) {
                        temp = masterdata.tomailid.split(",");
                    }
                    if (masterdata.ccmaild != null) {
                        cctemp = masterdata.ccmaild.split(",");
                    }
                    $timeout(function() {
                        $scope.toMailid = temp;
                        $scope.ccMailid = cctemp;
                    }, 0);
                }
                
                $scope.accidentCostList = response.data.data[0].accidentCostList;
                if($scope.accidentCostList != null && $scope.accidentCostList.length != 0) {
                	$scope.currencyList = $scope.accidentCostList;
                if ($scope.currencyList.length >= 1) {
                    $scope.currencyList[0].disabled = false;
                    for (i = 1; i < $scope.currencyList.length; i++) {
                        $scope.currencyList[i].disabled = true;
                    }
                } else {
                    $scope.currencyList = [{
                        vesselcode: $scope.shipcode,
                        loccurrencytype: "",
                        description: "",
                        locamt: "",
                        usdamt: "",
                        disabled: false
                    }];
                }
                } 
                $rootScope.showScreenOverlay = false;
            } else {
            	$rootScope.showScreenOverlay = false;
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                $scope.dataerror = [response.data.message[0]];
            }
        });
    }, function(error) {
    	$rootScope.showScreenOverlay = false;
        $scope.dataerror = "Server not reached";
       
    })

$scope.fetchTotalCrewsData = function() {
    $rootScope.showScreenOverlay = true;
    var dateTime = angular.copy($scope.accidate);
    dateTime = new Date(dateTime);
    accidentReportService.getTotalCrews(dateTime, new Date().getTimezoneOffset(), $scope.shipcode).then(function(response) {
        $scope.geterrormessages = response.data.message;
        $scope.geterrorstatus = response.data.errorstatus;
        $scope.geterrorstatuscode = response.data.status;
        $scope.dataerror = response.data.message;
        if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
            $scope.TotalCrewsList = response.data.data;
            $scope.tempcrewslist = [];
            var arrtotal = 0;
            for (var i = 0; i < $scope.TotalCrewsList.length; i++) {
                var email = $scope.TotalCrewsList[i][1];
                var email1 = $scope.TotalCrewsList[i][0];
                arrtotal = arrtotal + email1;
                $scope.tempcrewslist.push({
                    'email': email,
                    'email1': email1
                });
            }
            $scope.crewslist = $scope.tempcrewslist;
            $scope.totalcrew = arrtotal;
            toaster.success({
                title: "Information",
                body: "Member of crew updated."
            });
            $rootScope.showScreenOverlay = false;
        } else {
            $rootScope.showScreenOverlay = false;
            $scope.errordetails = response.data.exceptionDetail;
            $scope.showexception = response.data.showerrormessage
            $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
            $scope.dataerror = [response.data.message[0]];
        }
    });

}
    
    //communication window
    $scope.updateChat = function() {
        if (!$scope.msg) {
            return null;
        }
        chat_data = {
            'message': $scope.msg,
            'formSerialId': $scope.accId.accid
        };
        $http({
            url: "/accident_report_chat_submission/",
            dataType: 'json',
            method: 'POST',
            data: chat_data,
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function(response) {
            $http({
                method: 'POST',
                url: "/get_accident_chat_data_by_no/",
                data: {
                    "formid": $scope.accId.accid
                }
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
    $scope.resetErrors = function() {
    	$scope.tomailid_error="";
    	$scope.ccmailid_error="";
    	$scope.charteddivison_error="";
    	$scope.charterername_error="";
    	$scope.totalmember_error="";
    	$scope.voyageno_error="";
    	$scope.typeaccident_error="";
    	$scope.otheracctype_error="";
    	$scope.place_error="";
    	$scope.portcode_error="";
    	$scope.portname_error="";
    	$scope.latitude_error="";
    	$scope.longitude_error="";
    	$scope.Fromport_error="";
    	$scope.Fromportname_error="";
    	$scope.toport_error="";
    	$scope.toportname_error="";
    	$scope.outlineaccident_error="";
    	$scope.estimatedcause_error="";
    	$scope.medameged_error="";
    	$scope.mechanishm_error="";
    	$scope.countermeasures_error="";
    	$scope.dockyard_error="";
    	$scope.delayschedule_error="";
    	$scope.mindelay_error="";
    	$scope.cargodamage_error="";
    	$scope.details_error="";
    	$scope.accident_error="";
		$scope.shipbuilddate_error="";
    	$scope.filemsg_error="";
    }
    $scope.saveValidation = function(){
    	var raiseErrorFlag = false;
        var firstErrorProneField;
        $scope.validaionMsg="Future Date Cannot be allowed";
        $scope.InputField_error = false;
        $scope.actionFormHide = false;
        var currentDate = Date.parse($scope.accidate);
        if(currentDate > date){
        //	$scope.accidate = "";
			$scope.accident_error = $scope.validaionMsg;
			$scope.accidateCondtn = true;
			 $scope.InputField_error = true;
			if(raiseErrorFlag === false) {
        		firstErrorProneField = "charterer1";
        	}
            raiseErrorFlag = true;
		}
        if (raiseErrorFlag === true) {
        	// Redirect to the first erroneous field
            var old = $location.hash();
            $anchorScroll.yOffset = 150;
            $location.hash(firstErrorProneField);
            $anchorScroll();
            $location.hash(old);
            return true
        } else {
        	$scope.resetErrors();
            return false;
        }
    }
    $scope.accidentReportInputFieldValidation = function() {
    	var raiseErrorFlag = false;
        var firstErrorProneField;
        $scope.validaionMsg="This field is required";
        $scope.resetErrors();
        $scope.InputField_error = false;
        $scope.actionFormHide = false;
       /* if ($scope.toMailid == null || $scope.toMailid.length == 0) {
            $scope.tomailid_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "tomailid";
        	}
            raiseErrorFlag = true;
        } 
        
        if ($scope.ccMailid == null || $scope.ccMailid.length == 0) {
            $scope.ccmailid_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "ccmailid";
        	}
            raiseErrorFlag = true;
        } */
        if (!$scope.charteddivison) {
            $scope.charteddivison_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "charteddivison";
        	}
            raiseErrorFlag = true;
        }

        if (!$scope.charterer) {
            $scope.charterername_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "charterer1";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.totalcrew) {
            $scope.totalmember_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "totalcrew1";
        	}
            raiseErrorFlag = true;
        }

        if (!$scope.voyageno) {
            $scope.voyageno_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "voyageno1";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.accitype) {
            $scope.typeaccident_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "accitype";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.accitype == 'AT019' && !$scope.otheracctype) {
            $scope.otheracctype_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "otheracctype";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.placetype) {
            $scope.place_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "placetype";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.placetype == 'port' && !$scope.portcode) {
            $scope.portcode_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "portcode";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.placetype == 'port' && !$scope.portname) {
            $scope.portname_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "portcode";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.placetype == 'sea') {
            if (($scope.latitudeValidation === false)) {
                $scope.latitude_error = $scope.validaionMsg;
                $scope.InputField_error = true;
                if(raiseErrorFlag === false) {
            		firstErrorProneField = "atSea";
            	}
                raiseErrorFlag = true;
            } else {
                $scope.latitude_error = "";
                $scope.InputField_error = false;
            }
        }

        if ($scope.placetype == 'sea') {
            if (($scope.longitudeValidation === false)) {
                $scope.longitude_error = $scope.validaionMsg;
                $scope.InputField_error = true;
                if(raiseErrorFlag === false) {
            		firstErrorProneField = "atSea";
            	}
                raiseErrorFlag = true;
            } else {
                $scope.longitude_error = "";
                $scope.InputField_error = false;
            }
        }

        if (!$scope.fromport) {
            $scope.Fromport_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "fromPort";
        	}
            raiseErrorFlag = true;
        }
       
        if (!$scope.fromportname) {
            $scope.Fromportname_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "fromPort";
        	}
            raiseErrorFlag = true;
        }

        if (!$scope.toport) {
            $scope.toport_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "toPort";
        	}
            raiseErrorFlag = true;
        }
        
        if(!$scope.toportname){
        	$scope.toportname_error = $scope.validaionMsg;
        	$scope.InputField_error = true;
        	 if(raiseErrorFlag === false) {
         		firstErrorProneField = "toPort";
         	}
             raiseErrorFlag = true;
        }
        if (!$scope.outlineaccident) {
            $scope.outlineaccident_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "outlineaccident";
        	}
            raiseErrorFlag = true;
        }

        if (!$scope.estimatedcause) {
            $scope.estimatedcause_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "estimatedcause";
        	}
            raiseErrorFlag = true;
        }

        if (!$scope.machinarymodel) {
            $scope.medameged_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "machinarymodel";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.mechanismdetail) {
            $scope.mechanishm_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "mechanismdetail";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.countermeasures) {
            $scope.countermeasures_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "countermeasures";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.dockyardnames) {
            $scope.dockyard_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "dockyardnames";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.delayschedule) {
            $scope.delayschedule_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "delayschedule";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.delayschedule == 'Yes') {
        	if($scope.delay_day=='' && $scope.delay_hour == ''
        			&& $scope.delay_minute==''){
            	$scope.mindelay_error = $scope.validaionMsg;
                $scope.InputField_error = true;
                if(raiseErrorFlag === false) {
            		firstErrorProneField = "delayschedule";
            	}
                raiseErrorFlag = true;
        	}
        }
        if (!$scope.cargodamage) {
            $scope.cargodamage_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "cargodamage";
        	}
            raiseErrorFlag = true;
        }
        if (!$scope.cargodamage_det) {
            $scope.details_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "cargodamage_det";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.accidate===undefined) {
        	$scope.accident_error = $scope.validaionMsg;
            $scope.accidateCondtn = true;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "dateTime";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.ship_profiledate===undefined) {
            $scope.shipbuilddate_error = $scope.validaionMsg;
            $scope.InputField_error = true;
            if(raiseErrorFlag === false) {
        		firstErrorProneField = "vslProfileDate";
        	}
            raiseErrorFlag = true;
        }
        if ($scope.myFile.length>0) {
        	console.log($scope.filesData.length,"$scope.filesData.length<$scope.maxFileCount error will check")
        	if ($scope.filesData.length<$scope.maxFileCount) {
        		 $scope.filemsg_error = "Please upload the selected file";
                 $scope.InputField_error = true;
                 if(raiseErrorFlag === false) {
             		firstErrorProneField = "showfields";
             	}
                 raiseErrorFlag = true;
        	}
        }
       
        if ($scope.accidate) {
        	 var currentDate = Date.parse($scope.accidate);
             if(currentDate > date){
             //	$scope.accidate = "";
     			$scope.accident_error = "Future Date Cannot be allowed";
     			$scope.accidateCondtn = true;
     			 $scope.InputField_error = true;
     			if(raiseErrorFlag === false) {
             		firstErrorProneField = "charterer1";
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
            return true
        } else {
        	$scope.resetErrors();
            return false;
        }
    }
    /***********Date Picker validation**********/
    $scope.validateDate = function(modelName, ngModelName, errorModelName, ifConditionModel,
        typeOfPicker) {
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
    
    //Export Excel and PDF
    $scope.exportexcel = function() {
    	 $rootScope.showScreenOverlay = true;
    	  compositeData = {
      			"accid": $scope.accId.accid,
      			"reportdate": new Date($scope.reportDate).toISOString(),
      			"ship_profiledate":new Date($scope.ship_profiledate1),
      			'timeoffset': new Date().getTimezoneOffset(),
          }
        accidentReportService.generateAccidentExportExcel(compositeData).then(function(response) {
            var myBlob = new Blob([response.data], {
                type: "application/vnd.ms-excel"
            });
            var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
            var anchor = document.createElement("a");
            anchor.download =$scope.shipname+"-"+"AccidentReport"+"-"+$scope.accId.accid+".xls";
            anchor.href = blobURL;
            anchor.click();
            $rootScope.showScreenOverlay = false;
        });
    }

    $scope.saveAsPDFDocument = function() {
    	 $rootScope.showScreenOverlay = true;
        compositeData = {
    			"accid": $scope.accId.accid,
    			"reportdate": new Date($scope.reportDate).toISOString(),
	            'timeoffset': new Date().getTimezoneOffset()
        }
        accidentReportService.generateAccidentExportPdf(compositeData).then(function(response) {
            var myBlob = new Blob([response.data], {
                type: "application/pdf"
            });
            var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
            var anchor = document.createElement("a");
            anchor.download = $scope.shipname+"-"+"AccidentReport"+"-"+$scope.accrfid;
            anchor.href = blobURL;
            anchor.click();
            $rootScope.showScreenOverlay = false;
        });
    }

});