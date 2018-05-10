app.controller('externalInspectionController', function($scope, $anchorScroll, $routeParams, Connectivity, toaster, $timeout, $http, $location, $timeout, $q, $window, externalInspectionService, $rootScope) {
    $scope.isProcessing = false;
    $scope.displayShipWorkflow = false;
    $scope.dateFormat = 'yyyy-MM-dd';
    /************** TO PREVIEW FILE *********************/
    $scope.previewFile = function(docid) {
        $http.get('/external-inspection/downloadDocument/?docId=' + docid, {
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
                    $scope.previewDialog.open();
                });
            });
    }
    /***********Date Picker validation**********/
    $scope.validateDateOnly = function(modelName, errorModelName){
    	var currentDate = Date.parse($scope[modelName]);
        //Check if Date parse is successful
        if (!currentDate) {
        	$scope[modelName] ="";
            $scope[errorModelName] = "That doesn't seem like a valid date";
        }
    }
    /**************End of Date picker validation*******/
    $scope.previewDetailFile = function(index) {
        if ($scope.tempFiles[index].docid != undefined) {
            $scope.previewFile($scope.tempFiles[index].docid);
        } else {
            url = $window.URL || $window.webkitURL;
            $scope.fileUrl = url.createObjectURL($scope.tempFiles[index]);
            toDataUrl($scope.fileUrl, function(base64Img) {
                $scope.imagetest = base64Img;
                $scope.previewDialog.open();
            });
        }
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
        $scope.confirmDialog.close();
        $scope.confirmDetailDeleteDialog.close();
        $scope.reAssignDialog.close();
    });
    $scope.confirmInputFieldsDelete =function(qId){
    	if (qId == 'Y') { //If it is checked	
            if ($scope.existingReportData.length > 0) {
            	$scope.confirmDialog.open();
            } else {
                $scope.isnon_nc_obs_def = "Y";
                $scope.inputfieldbutton = true;
            }
        } else {
            $scope.isnon_nc_obs_def = "N";
            $scope.inputfieldbutton = false;
        }
    }
    $scope.validationDialogMsg = "Some mandatory field/fields are missing.";
    $scope.duplicateSigDialogMsg = "You have added duplicate rank in Signature section, which is not permitted.";
    $scope.exceededRowsDialogMsg = "You cannot make more than 15 entries.";
    $scope.exceededFileCountDialogMsg = "You cannot attach more than 3 files. Remove a file, then try."
    $scope.deleteDialogMsg = "You sure, that you want to delete this?";
    
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
  
    
    $scope.okAction= function (targetName) {
            if ($scope.remarks !== '' && $scope.remarks !== undefined) {
                $scope.saveExternalInspectionReport('reassign');
                angular.element(targetName).modal('hide');
            }else{
            	$scope.remarksMessage_error="This field is required";
            }
    }
    function thowsFileSizeExceededError(filename) {
        $scope.fileSizeExceededDialogMsg = filename + " is more than 1 MB, cannot be uploaded";
        $scope.exceededFileSizedialog.open();
    }
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
    $scope.actions = [
	                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	               ];


    $scope.confirmDelete = function(docid) {
        $scope.deleteDocId = docid;
        $scope.confirmDeleteDialog.open();
    }
    $scope.confirmDetailDelete = function(index) {
        $scope.deleteDetailDocId = index;
        console.log($scope.deleteDetailDocId);
        $scope.confirmDetailDeleteDialog.open();
    }
    $scope.deleteDetailActions = [{
            	text: 'Yes',
                action: function() {
                    $scope.removeDetailDocument()
                }
        },
        {
        	  text: 'No'
        }
    ];
    $scope.deleteInputFieldActions = [{
        text: 'Cancel',
        action: function(){
        	$scope.isnon_nc_obs_def = "N";
            $scope.inputfieldbutton = false;
            $scope.answers = false;
        }
    },
    {
        text: 'OK',
        action: function(){
        	$scope.isnon_nc_obs_def = "Y";
            $scope.inputfieldbutton = true;
        }
    }];
    $scope.deleteActions = [{
            	  text: 'Yes',
                  action: removeDocument
        },
        {
        	   text: 'No'
        }
    ];

    $scope.pageSize = 10;
    $scope.hidebody = true;
    $scope.haspermission = false;
    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }
    $scope.hideError = function(field) {
    	console.log("DAASD");
        var fieldName = field;
        $scope[fieldName] = "";
    }

    var date = new Date();
    $scope.restrictFutureDate = {
        max: date
    }

    $scope.restrictPastDate = {
        min: date
    }
    $scope.$watch('inspectionDate', function() {
        console.log($scope.inspectionDate);
        if ($scope.inspectionDate==undefined || $scope.inspectionDate==null){
        	$scope.inspectionDate = new Date().getMonth()+"/"+new Date().getDate()+"/"+new Date().getFullYear();
        }
        var tempDate = $scope.inspectionDate.split('/');
        tempDate = new Date(parseInt(tempDate[2]), parseInt(tempDate[0]) - 1, parseInt(tempDate[1]));
        $scope.restrictPlannedCompletionDate = {
            min: tempDate
        }
        $scope.restrictActualCompletionDate = {
            min: $scope.inspectionDate,
            max: new Date()
        }
    });
    $scope.$watch('auditorName', function(){
    	$scope.hideError('auditorName_error');
    });
    $scope.restrictActualCompletionDate = {
        min: $scope.inspectionDate,
        max: new Date()
    }
    $scope.restrictPlannedCompletionDate = {
        min: $scope.inspectionDate
    }
    $scope.$on('$viewContentLoaded', function() {
        //$scope.dialog.close();

    });

    $scope.max200Length = 200;
    $scope.isCountryBased = 0;
    $scope.isSIRE = false;
    $scope.isPSC = false;
    $scope.inspectionTypeOld = "";
    $scope.SIRECode = "INS017"
    $scope.inspectionPSCCode = "INS001";
    $scope.terminalInspectionCode = "INS008";
    $scope.flagStateInspectionCode = "INS002";
    $scope.preInspection = "";
    $scope.authorityMandatory = false;
    $scope.tempFiles = [];
    $scope.vesselCode = null;
    $scope.flagName = null;
    $scope.fleetCode = null;
    $scope.captainCode = null;
    $scope.chiefOfficerCode = null;
    $scope.currentUser = "";
    $scope.formActiveStatus = "INP";
    $scope.detailStatus = [];
    $scope.geterrorstatuscode ="0";
    angular.element(document).ready(function() {
        setDate();
    });

    function setDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mms = today.getMinutes();
        var ss = today.getSeconds();
        var ms = today.getMilliseconds();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        if (mms < 10) {
            mms = '0' + mms
        }
        if (hh < 10) {
            hh = '0' + hh
        }

        if (ms < 10) {
            ms = '0' + ms
        }
        today = yyyy + '-' + mm + '-' + dd;

        var ele = document.getElementsByClassName("pastDatefield");

        for (i = 0; i < ele.length; i++) {
            ele[i].setAttribute("max", today);
        }
    }
    
    $http({
        method: 'GET',
        url: "/get-vessel-task-manager-data/",
    }).then(function(response) {
        $scope.vesselDetailList = response.data;
        console.log($scope.vesselDetailList.length, '$scope.vesselDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
        $scope.taskCount = $scope.vesselDetailList.length;
    });

    $scope.editFlag = -1;
    $scope.tempFiles = [];
    $scope.modalIndex = -1;
    $scope.lastClickIndex = -1;
    $http({
        method: 'GET',
        url: "/get-notification-history-for-last-three-days-ship-date/",
    }).then(function successCallBack(response) {
        $scope.notificationList = response.data;
        $scope.notificationCount = $scope.notificationList.length;
    });
    $http({
        method: 'GET',
        url: "/get-user-detail-datas-ship-date/",
    }).then(function successCallBack(response) {
        $scope.userDetailList = response.data;
        $scope.userrank = $scope.userDetailList[0].rankName;
        $scope.userrole = $scope.userDetailList[0].rolename;
        $scope.username = $scope.userDetailList[0].empName;
        $scope.usercode = $scope.userDetailList[0].userCode;
        $scope.vesselname = $scope.userDetailList[0].shipname;
        console.log($scope.userDetailList, '$scope.userDetailList >>>>>>>>>>>');
    });



    var main = this;
    $scope.dateFormat = "dd-MMM-yy";
    $scope.statusCodeMapping = {
        'O': 'Open',
        'C': "Closed"
    };
    $scope.auditorName = [];
    $scope.isnon_nc_obs_def = "N";
    $scope.inputFieldsFiles = [];
    $scope.inputFieldsId = [];
    externalInspectionService.getExternalInspectionFormNumber().then(function(response) {
        $scope.formNo = response.data[0];
    });

    $scope.existingReportData = [];
    $scope.noOfDeficiencies = 0;
    $scope.deleteList = [];
    //setSessionValues();
    //urlParams = $location.absUrl().split("?");
    var extInsId = $routeParams.id;
    console.log(extInsId);
    $http({
        method: 'POST',
        url: "/get-external-inspection-workflow-history/",
        data: {
            "extinsid": extInsId
        }
    }).then(
        function(response) {
            $scope.wrkflowstatus = response.data;
            $scope.displayShipWorkflow = true;
            console.log($scope.wrkflowstatus, "'$scope.wrkflowstatus$scope.wrkflowstatus$scope.wrkflowstatus")

        });
    var setAuditorOptions = function(auditorNames){
    	$scope.auditorsOption = {
                placeholder: "Select Auditor Name",
                dataTextField: "inspectorname",
                dataValueField: "inspectorname",
                autoBind: true,
                valuePrimitive: true,
                autoClose: false,
                noDataTemplate: "<div>Do you want to add a new auditor name - '#: instance.input.val() #' ?</div><br />"+
                				"<button class=\"k-button\" ng-click=\"addNewAuditor('#: instance.input.val() #')\">Add new item</button>",
                maxSelectedItems: 3,
                dataSource: { data: auditorNames }
            };
    }
    $scope.addNewAuditor = function(value){
    	console.log($scope.auditorName);
    	$scope.auditorNames.push({"inspectorname":value});
    	setAuditorOptions($scope.auditorNames);
    	if ($scope.auditorName==null || $scope.auditorName==undefined){
    		$scope.auditorName=[];
    	}
    	$scope.auditorName.push(value);
    }
    $scope.inspectionTypeDisable = function(inspectionCode){
    	if (inspectionCode==$scope.SIRECode && $scope.noOfDeficiencies>0 && !$scope.isSIRE){
    		return true;
    	}
    	if (inspectionCode!=$scope.SIRECode && $scope.noOfDeficiencies>0 && $scope.isSIRE){
    		return true;
    	}
    	if (inspectionCode!=$scope.inspectionPSCCode && $scope.noOfDeficiencies>0 && $scope.isPSC){
    		return true;
    	}
    }
    Connectivity.IsOk().then(function(response) {
    	$rootScope.showScreenOverlay = true;
        externalInspectionService.getExternalInspectionFormDataByNo(extInsId).then(function(response) {
            /* Main Data */

        	$scope.geterrormessages=response.data.message;	
            $scope.geterrorstatus=response.data.errorstatus;
            $scope.geterrorstatuscode=response.data.status;                
            $scope.dataerror =response.data.message;
            if ((response.data.status == 0 && response.data.length != 0) || (response.data.errorstatus == "SV")) {
                // Auditors Name
                var temp_auditorNames = []
                for (var i = 0; i < response.data.data[0].auditorNames.length; i++) {
                    var inspectorName = response.data.data[0].auditorNames[i].inspectorname;
                    if (temp_auditorNames.indexOf(inspectorName) == -1) {
                        temp_auditorNames.push(inspectorName);
                    }
                }
                var temp = [];
                for (var i = 0; i < temp_auditorNames.length; i++) {
                	temp.push({"inspectorname": temp_auditorNames[i]});
                }
                $scope.auditorNames = temp;
                setAuditorOptions($scope.auditorNames);
                
                
                // Selected Auditor Names
                $timeout(function(){
                    $scope.auditorName = [];
                	for (var i = 0; i < response.data.data[0].selectedAuditors.length; i++) {
                        $scope.auditorName.push(response.data.data[0].selectedAuditors[i].inspectorname);
                    }
                },0);
                //Country List
                $scope.countries = response.data.data[0].countryList
                $scope.dateFormat = response.data.data[0].dateFormat;
                $scope.countryChange = function() {
                    $scope.inspectionCountry_error = "";
                    $scope.inspectionPort = "";
                    $scope.fetchInspectionPlace();

                }
                $scope.inspectionCountry = "";

                // Inspection List
                $scope.typesOfInspection = response.data.data[0].inspectionList;
                for (var i = 0; i < response.data.data[0].inspectionList.length; i++) {
                    if (response.data.data[0].inspectionList[i].inspectionname == 'PSC') {
                        $scope.inspectionPSCCode = response.data.data[0].inspectionList[i].inspectioncode;
                    }
                }
                $scope.typeOfInspection = "";


                //Master Data
                $scope.shipName = response.data.data[0].masterData.vesselName;
                $scope.formCrDate = response.data.data[0].masterData.crdate
                $scope.vesselCode = response.data.data[0].masterData.vesselcode;
                $scope.captainName = response.data.data[0].masterData.captainName;
                $scope.captainCode = response.data.data[0].masterData.captaincode;
                $scope.chiefOfficerCode = response.data.data[0].masterData.chiefengcode;
                $scope.chiefEngineerName = response.data.data[0].masterData.chiefOfficerName;
                $scope.flagName = response.data.data[0].masterData.flagname;
                $scope.flag = response.data.data[0].masterData.flagNameDesc;
                $scope.fleetCode = response.data.data[0].masterData.fleetcode;
                $scope.fleet = response.data.data[0].masterData.fleetName;
                $scope.detention = response.data.data[0].masterData.detention;
                $scope.maxFileCount = response.data.data[0].MaxFileCount;
                $scope.maxFileSize = response.data.data[0].MaxFileSize;
                $scope.imono =response.data.data[0].masterData.imono;
                if ($scope.detention==null){
                	$scope.detention = "N";
                }
                $scope.inspectionCountry = response.data.data[0].masterData.countrycode;
                $scope.inspectionPlace = response.data.data[0].masterData.placetype;
                $scope.isnon_nc_obs_def = response.data.data[0].masterData.isnonncdefobs;
                $scope.inspectionComments = response.data.data[0].masterData.comments;
                $scope.wrkflowid = response.data.data[0].masterData.wrkflowid;
                $scope.extrfid = response.data.data[0].masterData.extrfid;
                $scope.rankCode = response.data.data[0].masterData.currankcode;
                $scope.crdate = response.data.data[0].masterData.crdate;
                $scope.crusers = response.data.data[0].masterData.cruser;
                $scope.actFormno = response.data.data[0].masterData.formnumber;
                $scope.actRevno = response.data.data[0].masterData.revnumber;
                $scope.reviseddate = response.data.data[0].masterData.revdate;
                $scope.formActiveStatus = response.data.data[0].masterData.activeStatus;
                if($scope.formActiveStatus=='VOI'){
                	$scope.voidstatus=true;
                }
                $scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
                $scope.mdlname = response.data.data[0].masterData.mdlname;
                
                if (response.data.data[0].masterData.inspectiondate != null) {
                    var inspectionDate = new Date(response.data.data[0].masterData.inspectiondate);
                    $scope.inspectionDate = (inspectionDate.getMonth() + 1 + '/' + inspectionDate.getDate() + "/" + inspectionDate.getFullYear());
                } else {
                    var inspectionDate = new Date();
                    $scope.inspectionDate = (inspectionDate.getMonth() + 1 + '/' + inspectionDate.getDate() + "/" + inspectionDate.getFullYear());
                }
                $scope.extInsid = {
                    'extinsid': response.data.data[0].masterData.extinsid
                };

                $scope.typeOfInspection = response.data.data[0].masterData.inspectiontypecode;
                $scope.inspectionTypeOld = response.data.data[0].masterData.inspectiontypecode;
                $scope.isCountryBased = 0;
                if ($scope.typeOfInspection == $scope.SIRECode) {
                    $scope.isSIRE = true;
                } else {
                    $scope.isSIRE = false;
                }
                if ($scope.typeOfInspection == $scope.inspectionPSCCode) {
                    $scope.isPSC = true;
                } else {
                    $scope.isPSC = false;
                }
                for (i = 0; i < ($scope.typesOfInspection).length; i++) {
                    if ($scope.typesOfInspection[i].inspectioncode == $scope.typeOfInspection && $scope.typesOfInspection[i].iscountry == "Y") {
                        $scope.inspectionAuthoritiesCountry = $scope.countries;
                        $scope.isCountryBased = 1;
                        $scope.inspectionAuthorityCountry = response.data.data[0].masterData.authoritycode;
                        $scope.authorityMandatory = true;
                    }
                }
                if ($scope.isCountryBased == 0) {
                    fetchInspectionAuthorityByInspection(response.data.data[0].masterData.authoritycode);
                }



                //Action Rights
                $scope.Actiondata = response.data.data[0].actionRights;
                if ($scope.Actiondata != null && $scope.Actiondata.length != 0) {
                    $scope.actionrights = $scope.Actiondata[0][0];
                    $scope.defaultaction = $scope.Actiondata[0][1];
                    $scope.stageid = $scope.Actiondata[0][2];
                    $scope.reassignrights = $scope.Actiondata[0][3];
                    $scope.deleteAction=$scope.Actiondata[1];
                }
                if (($scope.actionrights != null) && ($scope.actionrights == "SUB" && $scope.defaultaction == "Y") || ($scope.actionrights == "APR" && $scope.defaultaction == "Y")) {
                    $scope.currentUser = "currentUser";
                }

                if ($scope.isnon_nc_obs_def == "Y") {
                    $scope.inputfieldbutton = true;
                }
                if ($scope.inspectionPlace == 'port') {
                    getPorts(response.data.data[0].masterData.placecode);
                } else {
                    getTerminals(response.data.data[0].masterData.placecode);
                }

                /* Input Field Data */

                $scope.existingReportData = response.data.data[0].extInspectionDetails;
                $scope.noOfDeficiencies = response.data.data[0].extInspectionDetails.length;
                for (i = 0; i < $scope.existingReportData.length; i++) {
                    $scope.inputFieldsFiles.push("");
                    if ($scope.existingReportData[i].findingstatus == 'C' && $scope.formActiveStatus == 'APR') {
                        $scope.detailStatus[i] = true;
                    }
                }


                //VIQ Numbers
                $scope.viqnumbers = response.data.data[0].viqNumbers;
                // PSC Deficiency Master 
                $scope.deficiencycodes = response.data.data[0].pscDeficiencyMaster;
                // Action Code
                $scope.inspectionActionCodes = response.data.data[0].actionCodes;
                $scope.actionCode = "";

                // Nature of Finding
                $scope.natureOfFindings = response.data.data[0].natureDeficiency;
                $scope.natureOfFinding = "";

                // Root Causes
                $scope.inspectionRootCauses = response.data.data[0].rootCauses;
                $scope.rootCause = "";


                //Main Category
                $scope.mainCategories = response.data.data[0].categoryMaster;
                $scope.mainCategory = "";
                $scope.subCategories1 = [];
                $scope.subCategories2 = [];


                /* Chat Data */
                $scope.chatdata = response.data.data[0].chatData;

                /* documents */
                $scope.filesData = response.data.data[0].documents;
                console.log($scope.filesData, "FIELS EDAT");
                $scope.filesData1 = response.data.data[0].documents;
                countActiveFiles();
            	$rootScope.showScreenOverlay = false;
            } else {
            	$rootScope.showScreenOverlay = false;
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace
                $scope.systemvalidationdialog.open();
                $scope.dataerror = response.data.message[0];
            }

        },function(){
        	$rootScope.showScreenOverlay = false;
        });
    }, function(error) {
        $scope.dataerror = "Server not reached";
    });
    $scope.stateChanged = function(qId) {
        if (qId == 'Y') { //If it is checked	
            if ($scope.existingReportData.length > 0) {
                var userstatus = confirm("Input fields consist data ,do you want to remove ");
                if (userstatus == true) {
                    $scope.isnon_nc_obs_def = "Y";
                    $scope.inputfieldbutton = true;
                } else if (userstatus == false) {
                    $scope.isnon_nc_obs_def = "N";
                    $scope.inputfieldbutton = false;
                    $scope.answers = false;
                }
            } else {
                $scope.isnon_nc_obs_def = "Y";
                $scope.inputfieldbutton = true;
            }
        } else {
            $scope.isnon_nc_obs_def = "N";
            $scope.inputfieldbutton = false;
        }
    }
    //No Need to remove
    var getPorts = function(placecode) {
        externalInspectionService.getCountryPorts($scope.inspectionCountry).then(function(ports) {
            $scope.terminalsAndPorts = ports.data;
            $scope.inspectionPort = placecode;
        });
    }
    //No Need to remove
    var getTerminals = function(placecode) {
    	console.log($scope.inspectionCountry, "@@#$%%");
        externalInspectionService.getCountryTerminals($scope.inspectionCountry).then(function(terminals) {
            $scope.terminalsAndPorts = terminals.data;
            console.log("INSIDE TERMINALS")
            $scope.inspectionTerminal = placecode;
        });
    }
    //No Need to remove
    var fetchInspectionAuthorityByInspection = function(authoritycode) {
        externalInspectionService.getInspectionAuthority($scope.typeOfInspection).then(function(res) {
            $scope.inspectionAuthorities = res.data;
            if (res.data.length <= 0) {
                $scope.authorityMandatory = false;
            } else {
                $scope.authorityMandatory = true;
            }
            $scope.inspectionAuthority = "";
            $scope.inspectionAuthoritiesCountry = "";
            $scope.inspectionAuthority = authoritycode;
        });
    }

    // No Need to Change
    $scope.onInspectionTypeChange = function() {
        if ($scope.inspectionTypeDisable($scope.typeOfInspection)){
        	$scope.typeOfInspection = $scope.inspectionTypeOld;
            $scope.geterrorstatus="-1";
            $scope.geterrorstatuscode="SV";                
            $scope.dataerror =["Please delete finding details to change the inspection type"];
        }else{
        	$scope.inspectionTypeOld=$scope.typeOfInspection;
            $scope.typeOfInspection_error = "";
            $scope.authorityMandatory = false;
            $scope.isCountryBased = 0;
            if ($scope.preInspection == $scope.terminalInspectionCode) {
                $scope.inspectionPlace = "port";
                $scope.fetchInspectionPlace();
            } else {
                $scope.preInspection = $scope.typeOfInspection;
            }
            if ($scope.typeOfInspection == $scope.SIRECode) {
                $scope.isSIRE = true;
            } else {
                $scope.isSIRE = false;
            }
            if ($scope.typeOfInspection == $scope.inspectionPSCCode) {
                $scope.isPSC = true;
            } else {
                $scope.isPSC = false;
            }
            if ($scope.typeOfInspection == $scope.terminalInspectionCode){
            	$scope.inspectionPlace = "terminal";
            	$scope.fetchInspectionPlace();
            }
            for (i = 0; i < ($scope.typesOfInspection).length; i++) {
                if ($scope.typesOfInspection[i].inspectioncode == $scope.typeOfInspection && $scope.typesOfInspection[i].iscountry == "Y") {
                    $scope.inspectionAuthoritiesCountry = $scope.countries;
                    console.log($scope.inspectionAuthoritiesCountry);
                    $scope.inspectionAuthorities = "";
                    $scope.isCountryBased = 1;
                    $scope.authorityMandatory = true;
                }
            }
            if ($scope.isCountryBased == 0) {
                fetchInspectionAuthorityByInspection("");
            }
        }
    	

    };


    // No need to change
    $scope.fetchInspectionPlace = function() {
        $scope.inspectionPlace_error = "";
        if ($scope.inspectionPlace == "port") {
            getPorts("");
        }
        if ($scope.inspectionPlace == "terminal") {
            getTerminals("");
        }
    }
    $scope.fetchFormModelFields = function() {
        $scope.resetInputFieldError();
        $scope.modalIndex = $scope.existingReportData.length;
        $scope.reference = "";
        $scope.natureofFindingDisabled = false;
        if ($scope.typeOfInspection!='INS003' && $scope.typeOfInspection!='INS004' && $scope.typeOfInspection!='INS024' && $scope.typeOfInspection!='INS025'){
        	$scope.natureOfFinding = 'DEF001';
            $scope.natureofFindingDisabled = true;
        }else{
            $scope.natureOfFinding = "";
        }
        $scope.findings = "";
        $scope.rootCause = "";
        $scope.immediateCorrections = "";
        $scope.longTermCorrectiveAction = "";
        $scope.mainCategory = "";
        $scope.subCategories1 = [];
        $scope.subCategories2 = [];
        $scope.subCategory1 = "";
        $scope.subCategory2 = "";
        $scope.shipShore = null;
        $scope.plannedCompletionDate = "";
        $scope.actualCompletionDate = "";
        $scope.actionBy_error = "";
        $scope.status = "O";
        $scope.tempFiles = [];
        $scope.viqnum = "";
        $scope.deficiencycode = "";
        $scope.actionCode="";
        $scope.editFlag = -1;
        console.log($scope.existingReportData);
    }
    $scope.fetchSubCategory1 = function() {
        externalInspectionService.getSubCategory($scope.mainCategory).then(function(response) {
            $scope.subCategories1 = response.data;
            $scope.subCategory1 = "";
            $scope.subCategories2 = [];
            $scope.mainCategory_error = "";
        });
    }
    $scope.fetchSubCategory2 = function() {
        externalInspectionService.getSubCategory($scope.subCategory1).then(function(response) {
            $scope.subCategories2 = response.data;
            $scope.subCategory2 = "";
            $scope.subCategory1_error = "";
        });
    }
    fetchDetailFiles = function(index) {
        $http({
            method: 'POST',
            url: "/external-inspection/fetchDetailDocuments/",
            data: {
                "formNumber": $scope.existingReportData[index].extinsdetrefid
            }
        }).then(
            function(response) {
                for (i = 0; i < response.data.length; i++) {
                    var temp = [];
                    console.log(response.data);
                    temp["name"] = response.data[i].filename;
                    temp["size"] = response.data[i].filesize;
                    temp["docid"] = response.data[i].extinsdocid;
                    temp["type"] = response.data[i].filetype;
                    console.log(response.data[i]);
                    temp["docstatus"] = response.data[i].docstatus;
                    temp["uploaddate"] = response.data[i].uploaddate;
                    temp["removedate"] = response.data[i].removedate;
                    temp["uploadusername"] = response.data[i].uploadusername;
                    temp["removeusername"] = response.data[i].removeusername;
                    $scope.tempFiles.push(temp);
                }
            });
    }
    
    $scope.editExternalInspectionReport = function(index) {
        $scope.resetInputFieldError();
        $scope.tempFiles = [];
        $scope.modalIndex = index;
        $scope.detailfilemsg_error = "";
        fetchDetailFiles(index);
        if ($scope.inputFieldsFiles[$scope.modalIndex]!=undefined){
            for(var i=0; i<$scope.inputFieldsFiles[$scope.modalIndex].length;i++){
            	$scope.tempFiles.push($scope.inputFieldsFiles[$scope.modalIndex][i].get("file"));
            }
        }

        $scope.editFlag = index;
        console.log($scope.existingReportData[index], "!1111");
        var defer = $q.defer();
        if ($scope.isSIRE) {
            $scope.viqnum = $scope.existingReportData[index].refno;
        } else{
        	if ($scope.typeOfInspection == $scope.inspectionPSCCode){
            	$scope.deficiencycode = $scope.existingReportData[index].refno;
        	}
        	else {
                $scope.reference = $scope.existingReportData[index].refno;
            }
        } 
        
        if ($scope.typeOfInspection == $scope.inspectionPSCCode) {
            $scope.actionCode = $scope.existingReportData[index].actioncode;
        }
        $scope.mainCategory = $scope.existingReportData[index].categorycode;
        $scope.natureOfFinding = $scope.existingReportData[index].naturedeficode;
        $scope.findings = $scope.existingReportData[index].deficiencydetail;
        $scope.rootCause = $scope.existingReportData[index].rootcausecode;
        $scope.immediateCorrections = $scope.existingReportData[index].imcorrection;
        $scope.longTermCorrectiveAction = $scope.existingReportData[index].longtermaction;
        $scope.shipShore = $scope.existingReportData[index].actionby;
        if ($scope.existingReportData[index].categorycode) {
            externalInspectionService.getSubCategory($scope.existingReportData[index].categorycode).then(function(response) {
                $scope.subCategories1 = response.data;
                $scope.subCategories2 = [];
                $scope.subCategory1 = $scope.existingReportData[index].subcate1code;
            }).then(function() {
                if ($scope.existingReportData[index].subcate1code) {
                    externalInspectionService.getSubCategory($scope.existingReportData[index].subcate1code).then(function(response) {
                        $scope.subCategories2 = response.data;
                        $scope.subCategory2 = $scope.existingReportData[index].subcate2code;
                    });
                }
            });
        }
        var plannedCompletionDate = new Date($scope.existingReportData[index].plancompletedate);
        $scope.plannedCompletionDate = (plannedCompletionDate.getUTCMonth() + 1 + '/' + plannedCompletionDate.getUTCDate() + "/" + plannedCompletionDate.getUTCFullYear());

        var actualCompletionDate = new Date($scope.existingReportData[index].actualcompledate);
        $scope.actualCompletionDate = (actualCompletionDate.getUTCMonth() + 1 + '/' + actualCompletionDate.getUTCDate() + "/" + actualCompletionDate.getUTCFullYear());

        $scope.status = $scope.existingReportData[index].findingstatus;
    }
    $scope.saveDetention= function(){
    	if ($scope.formActiveStatus=='APR'){
    		Connectivity.IsOk().then(function(response) {
    			formData = {
    		            "extinsid": $scope.extInsid.extinsid,
    		            "detention": $scope.detention
    		        }
    	        externalInspectionService.updateDetention(formData).then(function(response){
    	        });
    		}, function(){
    			
    		});
    	}
    }
    $scope.addExternalInspectionReport = function() {
        $scope.externalInspectionReportInputFieldValidation();
       
        if (!$scope.InputField_error) {
            formData = {
                "extinsid": $scope.extInsid.extinsid,
                //"refno": $scope.reference,
                "actioncode": $scope.actionCode,
                "naturedeficode": $scope.natureOfFinding,
                "deficiencydetail": $scope.findings,
                "rootcausecode": $scope.rootCause,
                "imcorrection": $scope.immediateCorrections,
                "longtermaction": $scope.longTermCorrectiveAction,
                "actionby": $scope.shipShore,
                "categorycode": $scope.mainCategory,
                "subcate1code": $scope.subCategory1,
                "subcate2code": $scope.subCategory2,
                "plancompletedate": new Date($scope.plannedCompletionDate),
                'timeoffset': new Date().getTimezoneOffset(),
                "findingstatus": $scope.status
            }
            if ($scope.actionCode == "AC006"){
            	$scope.detention = 'Y';
            }
            console.log($scope.actualCompletionDate,"YOYOY");
            if($scope.actualCompletionDate!=""){
            	formData["actualcompledate"] = new Date($scope.actualCompletionDate)
            }else{
            	formData["actualcompledate"] = "";
            }
            if ($scope.isSIRE) {
                formData["refno"] = $scope.viqnum;
            } else {
            	if ($scope.typeOfInspection == $scope.inspectionPSCCode){
            		formData["refno"] = $scope.deficiencycode;
            	}else{
                    formData["refno"] = $scope.reference;
            	}
            }
            if ($scope.editFlag != -1) {
                console.log("edited data");
                formData["extinsdetrefid"] = $scope.existingReportData[$scope.editFlag].extinsdetrefid;
                $scope.existingReportData[$scope.editFlag] = formData;
                $scope.editFlag = -1;
            } else {
                $scope.existingReportData.push(formData);
                $scope.inputFieldsId.push(new Date().getTime());
                console.log($scope.inputFieldsFiles, $scope.inputFieldsId);
            }
            $scope.noOfDeficiencies = $scope.existingReportData.length;
            angular.element($('#nearmismodal').modal('hide'));
            $scope.resetInputField();
            console.log($scope.existingReportData.length, $scope.inputFieldsFiles.length, "@@@@");
//            while ($scope.existingReportData.length != $scope.inputFieldsFiles.length) {
//                $scope.inputFieldsFiles.push("");
//                console.log("ASDASDSAD");
//            }
            if ($scope.formActiveStatus == "APR") {
                externalInspectionService.updateDetailData(formData);
                $scope.detailStatus[$scope.modalIndex] = true;
            }
            $scope.modalIndex = -1;
        }        
    }


    $scope.saveExternalInspectionReport = function(typeOfButtonClicked) {
    	$rootScope.showScreenOverlay = true;
        $scope.isProcessing = true;
        var placeCode = "";
        var activeStatus = "INP"
        var formStatus = "INP"
        if ($scope.inspectionPlace == "port") {
            placeCode = $scope.inspectionPort;
        } else {
            placeCode = $scope.inspectionTerminal;
        }
        $scope.actionFormHide = false;
        if (typeOfButtonClicked == 'send') {
            $scope.validation();
            formStatus = "SUB" // chg
            //$scope.actionFormHide = true;
        } else if (typeOfButtonClicked == 'approve') {
           // $scope.validation();
            formStatus = "APR" // chg
        } else if (typeOfButtonClicked == 'closeout') {
            $scope.validation();
            formStatus = "CLO" // chg
            var activeStatus = "CLO"
            $scope.actionFormHide = true;
        } else if (typeOfButtonClicked == 'reassign') {
            $scope.validation();
            formStatus = "RSN" // chg
            activeStatus = "RSN";
        }

        if ($scope.isnon_nc_obs_def == "Y") {
            $scope.existingReportData;
            for (var i = 0; i < $scope.existingReportData.length; i++) {
                $scope.deleteList.push($scope.existingReportData[i]);
            }
            $scope.existingReportData = [];
        }
        formData = {
            "extinsid": $scope.extInsid.extinsid,
            "formnumber": $scope.actFormno,
            "revnumber": $scope.actRevno,
            "revdate": $scope.reviseddate,
            "captaincode": $scope.captainCode,
            "chiefengcode": $scope.chiefOfficerCode,
            "vesselcode": $scope.vesselCode,
            "flagname": $scope.flagName,
            "fleetcode": $scope.fleetCode,
            "inspectiontypecode": $scope.typeOfInspection,
            "deficiencycount": $scope.noOfDeficiencies,
            "countrycode": $scope.inspectionCountry,
            "placetype": $scope.inspectionPlace,
            "placecode": placeCode,
            'timeoffset': new Date().getTimezoneOffset(),
            "inspectiondate": new Date($scope.inspectionDate),
            "comments": $scope.inspectionComments,
            "activeStatus": activeStatus,
            "isnonncdefobs": $scope.isnon_nc_obs_def,
            //"currankcode":$scope.rankCode,
            "cruser": $scope.crusers,
            "crdate": $scope.crdate,
            "wrkflowid": $scope.wrkflowid,
            "detention": $scope.detention,
            "extrfid" : $scope.extrfid,
        }
        if ($scope.isCountryBased == 0) {
            formData["authoritycode"] = $scope.inspectionAuthority;
        } else {
            formData["authoritycode"] = $scope.inspectionAuthorityCountry;
        }
        compositeData = {
            externalInspectionReport: formData,
            extDetailsData: $scope.existingReportData,
            extDetailsDataDeleted: $scope.deleteList,
            externalInspectionAuditorName: $scope.auditorName,
            stageid: $scope.stageid,
            formstatus: formStatus,
            detailsId: $scope.inputFieldsId,
            extWfHistory: $scope.remarks,
        }
        if (typeOfButtonClicked == 'save' || !$scope.validation() ) {
            if (typeOfButtonClicked == 'save') {
                $scope.resetAllErrors();
            }
            Connectivity.IsOk().then(function(response) {
                    externalInspectionService.saveExternalInspectionCompositeForm(compositeData).then(function(response) {
                    	$scope.geterrormessages=response.data.message;						
		                $scope.geterrorstatus=response.data.errorstatus;
		                $scope.geterrorstatuscode=response.data.status;
                            if (response.data.status == 0 && response.data.length != 0) {
                            	$scope.wrkflowstatus = response.data.data[0].externalWfHistory;
                            	$scope.extrfid=response.data.data[0].refId;
                                if (typeOfButtonClicked != 'save') {
                                    $scope.actionFormHide = true;
                                    $scope.actionrights = null;
                                    $scope.formActiveStatus = formStatus;
                                } 
                                toaster.success({title: "Information", body:response.data.successMessage});			
                                externalInspectionService.getExternalInspectionReportDetails(response.data.data[0].externalWfHistory[0].extinsid).then(function(response) {
                                    console.log($scope.existingReportData,"@@@@@");
                                	$scope.existingReportData = response.data;
                                	console.log(response,"@@@$$$HERE");
                                    $scope.noOfDeficiencies = response.data.length;
                                    for (i = 0; i < $scope.existingReportData.length; i++) {
                                        $scope.inputFieldsFiles.push("");
                                        if ($scope.existingReportData[i].findingstatus == 'C' && $scope.formActiveStatus == 'APR') {
                                            $scope.detailStatus[i] = true;
                                        }
                                    }
                                    if ($scope.inputFieldsFiles.length == 0) {
                                        $scope.isProcessing = false;
                                    	$rootScope.showScreenOverlay = false;
                                    }
                                    var flagCount = 0;
                                    for (i = 0; i < $scope.inputFieldsFiles.length; i++) {
                                        filesImagesdata = $scope.inputFieldsFiles[i];
                                        console.log($scope.inputFieldsFiles,"@!#4");
                                        if (filesImagesdata != "") {
                                            for (j = 0; j < filesImagesdata.length; j++) {
                                                console.log(response.data);
                                                filesImagesdata[j].append("detailid", $scope.existingReportData[i].extinsdetrefid);
                                                console.log("NOW JUST SAVE");
                                                externalInspectionService.uploadDetailDocuments(filesImagesdata[j]).then(function(response) {
                                                    console.log("@@@@@1", response);
                                                    $scope.isProcessing = false;
                                                	$rootScope.showScreenOverlay = false;
                                                }, function(errror) {
                                                    $scope.isProcessing = false;
                                                	$rootScope.showScreenOverlay = false;
                                                });
                                            }
                                            console.log(filesImagesdata, "!!!!111");
                                            $scope.inputFieldsFiles[i]="";
                                            toaster.success({title: "Information", body:response.data.successMessage});							

                                        } else {
                                            flagCount++;
                                        }
                                    }
                                    
                                    if (flagCount == $scope.inputFieldsFiles.length) {
                                        $scope.isProcessing = false;
                                    	$rootScope.showScreenOverlay = false;
                                    }
                                });

                            } else {
                                //$scope.dialog.open();
                                $scope.isProcessing = false;
                            	$rootScope.showScreenOverlay = false;
                                $scope.errordetails=response.data.exceptionDetail;
    		                	$scope.showexception=response.data.showerrormessage		                								
    							$scope.dataerror = response.data.message;

                            }
                        }),
                        function errorCallback(response) {
                            $scope.isProcessing = false;
                        	$rootScope.showScreenOverlay = false;
                            $scope.dataSaveStatus = "Data couldn't be sent. Please enter the required fields";
                        };
                }),
                function(error) {
                    //angular.element($('#error-modal').modal('show'));
                    //$scope.dialog.open();
                    $scope.isProcessing = false;
                	$rootScope.showScreenOverlay = false;
                    $scope.dataerror = "Server not reached";
                };
            $timeout(function() {
                $scope.datastatus = true;
            }, 3000);
            console.log($scope.inputFieldsFiles, "@@@$&*");

        } else {
            $scope.isProcessing = false;
        	$rootScope.showScreenOverlay = false;
            toaster.error({
                title: "Information",
                body: "Data couldn't be sent. Please enter the required fields"
            });
        }
    }

    $scope.deleteExistingReportData = function(index) {
        console.log($scope.existingReportData[index], "delete list >>>")
        if ($scope.existingReportData[index].extinsdetrefid) {
            $scope.deleteList.push($scope.existingReportData[index]);
        }
        $scope.existingReportData.splice(index, 1);
        $scope.inputFieldsFiles.splice(index, 1);
        $scope.inputFieldsId.splice(index, 1);
        console.log($scope.inputFieldsFiles, $scope.inputFieldsId);
        $scope.noOfDeficiencies = $scope.existingReportData.length;
    }
    $scope.externalInspectionReportInputFieldValidation = function() {
        $scope.resetInputFieldError();
        $scope.InputField_error = false;
        if ($scope.isSIRE) {
            if (!$scope.viqnum) {
                $scope.viqnumbers_error = "This field is Required";
                if($scope.InputField_error === false) {
            		firstErrorProneField = "viq";
            	}
                $scope.InputField_error = true;
            }
        } else {
        	if ($scope.typeOfInspection == $scope.inspectionPSCCode){
        		if (!$scope.deficiencycode){
            		$scope.deficiencycount_error = "This field is Required";
            		if($scope.InputField_error === false) {
                		firstErrorProneField = "deficiency";
                	}
                    $scope.InputField_error = true;
        		}

        	}else{
        		if (!$scope.reference) {
                    $scope.reference_error = "This field is Required";
                    if($scope.InputField_error === false) {
                		firstErrorProneField = "reference";
                	}
                    $scope.InputField_error = true;
                }else{
                	if(!$scope.validateFreeText('reference', 'reference_error')){
                		if($scope.InputField_error === false) {
                    		firstErrorProneField = "reference";
                    	}
                	}
                }
        	}
            

        }
        if ($scope.actionCode == "" && ($scope.typeOfInspection == $scope.inspectionPSCCode)) {
            $scope.actionCode_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "action";
        	}
            $scope.InputField_error = true;
        }
        if ($scope.natureOfFinding == "") {
            $scope.natureOfFinding_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "nature";
        	}
            $scope.InputField_error = true;
        }
        if (!$scope.findings) {
            $scope.findings_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "findings";
        	}
            $scope.InputField_error = true;
        }else{
        	if(!$scope.validateFreeText('findings', 'findings_error')){
        		if($scope.InputField_error === false) {
            		firstErrorProneField = "findings";
            	}
        		$scope.InputField_error = true;
        	}
        }
        if (!$scope.rootCause) {
            $scope.rootCause_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "root";
        	}
            $scope.InputField_error = true;
        }
        if (!$scope.immediateCorrections) {
            $scope.immediateCorrections_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "immediate";
        	}
            $scope.InputField_error = true;
        }else{
        	if(!$scope.validateFreeText('immediateCorrections', 'immediateCorrections_error')){
        		if($scope.InputField_error === false) {
            		firstErrorProneField = "immediate";
            	}
        		$scope.InputField_error = true;
        	}
        }
        if (!$scope.longTermCorrectiveAction) {
            $scope.longTermCorrectiveAction_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "longterm";
        	}
            $scope.InputField_error = true;
        }else{
        	if(!$scope.validateFreeText('longTermCorrectiveAction', 'longTermCorrectiveAction_error')){
        		if($scope.InputField_error === false) {
            		firstErrorProneField = "longterm";
            	}
        		$scope.InputField_error = true;
        	}
        }
        if (!$scope.shipShore) {
            $scope.actionBy_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "vesseloffice";
        	}
            $scope.InputField_error = true;
        }
        if ($scope.mainCategory == "") {
            $scope.mainCategory_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "maincategory";
        	}
            $scope.InputField_error = true;
        }
        if ($scope.subCategories1 != undefined) {
            if (($scope.subCategories1).length > 0 && ($scope.subCategory1 == "" || !$scope.subCategory1)) {
                $scope.subCategory1_error = "This field is Required";
                if($scope.InputField_error === false) {
            		firstErrorProneField = "subcategory1";
            	}
                $scope.InputField_error = true;
            }
            if ($scope.subCategories2 != undefined) {
                if (($scope.subCategories2).length > 0 && ($scope.subCategory2 == "" || !$scope.subCategory2)) {
                    $scope.subCategory2_error = "This field is Required";
                    if($scope.InputField_error === false) {
                		firstErrorProneField = "subcategory2";
                	}
                    $scope.InputField_error = true;
                }
            }
        }
        if ($scope.plannedCompletionDate == undefined || $scope.plannedCompletionDate == "") {
            $scope.plannedCompletionDate_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "plannedCompletion";
        	}
            $scope.InputField_error = true;
        }
        if (!$scope.status) {
            $scope.inspectionStatus_error = "This field is Required";
            if($scope.InputField_error === false) {
        		firstErrorProneField = "status";
        	}
            $scope.InputField_error = true;
        }
        if ($scope.myFileDetail!=undefined && $scope.myFileDetail.length>0) {
            if ($scope.tempFiles.length<=3) {
              $scope.detailfilemsg_error = "Please upload the selected file";
                if($scope.InputField_error === false) {
                  firstErrorProneField = "showfields";
                 }
                $scope.InputField_error = true;
            }else{
            	$scope.detailfilemsg_error = "";
            }
       }
        if ($scope.InputField_error === true) {
            var old = $location.hash();
            $anchorScroll.yOffset = 150;
            $location.hash(firstErrorProneField);
            $anchorScroll();
            $location.hash(old);
            
        }
        //		if ($scope.actualCompletionDate==undefined || $scope.plannedCompletionDate==""){
        //			$scope.actualCompletionDate_error = "This field is Required";
        //			$scope.InputField_error = true;
        //		}
    }
    $scope.resetInputField = function() {
        $scope.reference = "",
            $scope.actionCode = "",
            $scope.natureOfFinding = "",
            $scope.findings = "",
            $scope.rootCause = "",
            $scope.immediateCorrections = "",
            $scope.longTermCorrectiveAction = "",
            $scope.actionBy_error = "",
            $scope.mainCategory = "",
            $scope.subCategory1 = "",
            $scope.subCategory2 = "",
            //		document.getElementById('plannedCompletionDate').value = "",
            //		document.getElementById('actualCompletionDate').value = "",
            $scope.status = ""
    }
    $scope.resetInputFieldError = function() {
        $scope.reference_error = "";
        $scope.actionCode_error = "";
        $scope.natureOfFinding_error = "";
        $scope.findings_error = "";
        $scope.rootCause_error = "";
        $scope.immediateCorrections_error = "";
        $scope.longTermCorrectiveAction_error = "";
        $scope.inspectionPlace_error = "";
        $scope.mainCategory_error = "";
        $scope.subCategory1_error = "";
        $scope.subCategory2_error = "";
        $scope.inspectionStatus_error = "";
        $scope.plannedCompletionDate_error = "";
        $scope.actualCompletionDate_error = "";
        $scope.actionBy_error = "";
        $scope.viqnumbers_error = "";
        $scope.deficiencycount_error = "";
    }
    $scope.validation = function() {
        $scope.resetAllErrors();
        $scope.MainPage_error = false;
        if ($scope.typeOfInspection == null) {
            $scope.typeOfInspection_error = "This field is required";
            if($scope.MainPage_error === false) {
        		firstErrorProneField = "typeofinspection";
        	}
            $scope.MainPage_error = true;
        }else{
        	if($scope.isPSC){
        		var flag=0;
        		for(var k=0; k<$scope.existingReportData.length; k++){
        			console.log($scope.existingReportData[k].actioncode);
        			if ($scope.existingReportData[k].actioncode == "AC006"){
        				flag++;
        				break;
        			}
        		}
        		console.log(flag, $scope.detention);
        		if(flag==0 && $scope.detention=='Y'){
        			$scope.geterrorstatus="-1";
                    $scope.geterrorstatuscode="SV";                
                    $scope.dataerror =["Please add a finding with action code 30"];
        			if($scope.MainPage_error === false) {
                		firstErrorProneField = "typeofinspection";
                	}
        			$scope.MainPage_error = true;
        		}else{
        			 if(flag!=0 && $scope.detention!="Y"){
        				$scope.geterrorstatus="-1";
                        $scope.geterrorstatuscode="SV";                
                        $scope.dataerror =["Detention field should be selected as Yes"];
             			if($scope.MainPage_error === false) {
                     		firstErrorProneField = "typeofinspection";
                     	}
             			$scope.MainPage_error = true;
        			 }
        		}
        	}
        }
        if ($scope.authorityMandatory) {
            if (!$scope.inspectionAuthority && (!$scope.inspectionAuthorityCountry || $scope.inspectionAuthorityCountry == "")) {
                $scope.authority_error = "This field is required";
                if($scope.MainPage_error === false) {
            		firstErrorProneField = "authority";
            	}
    			$scope.MainPage_error = true;
            }
        }
        if ($scope.inspectionCountry == null) {
            $scope.inspectionCountry_error = "This field is required";
            if($scope.MainPage_error === false) {
        		firstErrorProneField = "country";
        	}
            $scope.MainPage_error = true;
        }
        if (!$scope.inspectionPlace) {
            $scope.inspectionPlace_error = "This field is required";
            //			angular.element('#inspectionComments').focus();
            if($scope.MainPage_error === false) {
        		firstErrorProneField = "placeOfInspection";
        	}
            $scope.MainPage_error = true;
        } else {
            if (($scope.inspectionPort == null || $scope.inspectionPort == "") && ($scope.inspectionTerminal == null || $scope.inspectionTerminal == "")) {
                $scope.inspectionTerminalPort_error = "This field is required";
                if($scope.MainPage_error === false) {
            		firstErrorProneField = "placeOfInspection";
            	}
                $scope.MainPage_error = true;
            }
        }
        
        
        if (document.getElementById('inspectionDate').value == "") {
            $scope.inspectionDate_error = "This field is required";
            //			angular.element('#inspectionDate').focus();
            if($scope.MainPage_error === false) {
        		firstErrorProneField = "dateOfInspection";
        	}
            $scope.MainPage_error = true;
        }
        if ($scope.auditorName.length == 0) {
            $scope.auditorName_error = "This field is required";
            if($scope.MainPage_error === false) {
        		firstErrorProneField = "auditorName";
        	}
            $scope.MainPage_error = true;
        }
        if (!$scope.inspectionComments) {
            $scope.inspectionComments_error = "This field is required";
            //			angular.element('#inspectionComments').focus();
            console.log($scope.MainPage_error);
            if($scope.MainPage_error === false) {
        		firstErrorProneField = "comments";
        	}
            $scope.MainPage_error = true;
        }else{
        	if(!$scope.validateFreeText('inspectionComments', 'inspectionComments_error')){
        		$scope.MainPage_error = true;
        	}
        }
        
        if ($scope.inspectionAuthority == null) {
            $scope.inspectionAuthority_error = "This field is required";
            $scope.MainPage_error = true;
        }
        if ($scope.myFile.length>0) {
            if ($scope.filesData.length<=3) {
              $scope.filemsg_error = "Please upload the selected file";
                 if($scope.MainPage_error == false) {
                  firstErrorProneField = "showfields2";
                 }
                 $scope.MainPage_error = true;
            }else{
            	$scope.filemsg_error = "";
            }
       }
        if ($scope.MainPage_error == true) {
            var old = $location.hash();
            $anchorScroll.yOffset = 150;
            $location.hash(firstErrorProneField);
            $anchorScroll();
            $location.hash(old);
        }
        return $scope.MainPage_error;
    }
    $scope.resetAllErrors = function() {
        $scope.authority_error = "";
        $scope.typeOfInspection_error = "";
        $scope.inspectionAuthority_error = "";
        $scope.inspectionCountry_error = "";
        $scope.inspectionPlace_error = "";
        $scope.inspectionComments_error = "";
        $scope.auditorName_error = "";
        $scope.inspectionDate_error = "";
        $scope.inspectionTerminalPort_error = "";
    }

    function isAlphaNumeric(str) {
        var pattern = new RegExp('^[a-zA-Z0-9]*$');
        return pattern.test(str);
    }
    $scope.updateChat = function() {
        if (!$scope.msg) {
            return null;
        }
        chat_data = {
            'message': $scope.msg,
            'formSerialId': $scope.extInsid.extinsid
        };
        console.log(chat_data, "111");
        $http({
            url: "/external-inspection-chat-submission/",
            dataType: 'json',
            method: 'POST',
            data: chat_data,
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function(response) {
            $http({
                method: 'POST',
                url: "/get-chat-data-by-no/",
                data: {
                    "formid": $scope.extInsid.extinsid
                }
            }).then(
                function(response) {
                    $scope.chatdata = response.data;
                    console.log($scope.chatdata, "111");
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

    // FILE ATTACHMENTS	
    function countActiveFiles() {
        $scope.activeFileCount = 0;
        for (i = 0; i < $scope.filesData.length; i++) {
            if ($scope.filesData[i].docstatus === 'A') {
                $scope.activeFileCount++;
            }
        }
    }
    function thowsUnsupportedFileError(filename) {
        $scope.fileSizeExceededDialogMsg = filename+ " is not supported format. Unable to upload.";
        $scope.exceededFileSizedialog.open();
    }
    $scope.myFile = [];
    $scope.isuploading = false;



    $scope.removeFile = function(index) {
        $scope.myFile.splice(index, 1);
    }
    $scope.removeDetailFile = function(index) {
        $scope.myFileDetail.splice(index, 1);
    }

    // Remove Documents
    function removeDocument() {
        $http({
            url: "/external-inspection/removeDocument/?docId=" + $scope.deleteDocId,
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
            //Fetching the file data
            $http({
                method: 'POST',
                url: "/external-inspection/fetchDocuments/",
                data: {
                    "formNumber": extInsId
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

    // File Upload - External Details: Images

    var filesImagesdata = new FormData();
    $scope.getExtDetImages = function($files) {
        angular.forEach($files, function(value, key) {
            filesImagesdata.append(key, value);
            console.log("Key = " + key + " Value= " + value);
        });
    };
    $scope.removeDetailDocument = function() {
        var index = $scope.deleteDetailDocId;
        console.log($scope.tempFiles[index].docid, $scope.tempFiles[index]);
        if ($scope.tempFiles[index].docid != undefined) {
            $http({
                url: "/external-inspection/removeDetailDocument/?docId=" + $scope.tempFiles[index].docid,
                dataType: 'json',
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function() {
                console.log($scope.tempFiles, "asdasd", index);
                $scope.tempFiles[index].docstatus = 'V';
                //$scope.tempFiles.splice(index, 1);

            })
        } else {
            console.log($scope.inputFieldsFiles, $scope.tempFiles);
            $scope.inputFieldsFiles[$scope.modalIndex].splice(index, 1);
            $scope.tempFiles.splice(index, 1);
        }
    }
    $scope.uploadDetailFiles = function() {
        $scope.isDetailuploading = true;
        $scope.detailfilemsg_error = "";
        $scope.activeFileCount = 0;
        for (i = 0; i < $scope.tempFiles.length; i++) {
            if ($scope.tempFiles[i].docstatus === 'A' || $scope.tempFiles[i].docstatus == undefined) {
                $scope.activeFileCount++;
            }
        }

        if ($scope.myFileDetail.length + $scope.activeFileCount > 3) {
            $scope.exceededFileCountDialog.open();
            $scope.isDetailuploading = false;
            return;
        }
        var temp = []

        for (i = 0; i < $scope.myFileDetail.length; i++) {
        	if (($scope.myFileDetail[i]._file.name).split('.')[1]=='sql'){
        		thowsUnsupportedFileError($scope.myFileDetail[i]._file.name);
        	}
        	else{
            if ($scope.myFileDetail[i]._file.size <= 1048576) {
                var filesformdata = new FormData();
                filesformdata.append('file', $scope.myFileDetail[i]._file);
                filesformdata.append("formNumber", extInsId);
                filesformdata.append("mdlCode", "EXT");
                filesformdata.append("attachmentTypeFolder", "Internal Attachments");
                temp.push(filesformdata);
                $scope.tempFiles.push($scope.myFileDetail[i]._file);
            } else {
                $scope.isDetailuploading = false;
                thowsFileSizeExceededError($scope.myFileDetail[i]._file.name);
            }}
        };
        if ($scope.inputFieldsFiles.length > $scope.modalIndex) {
            for (i = 0; i < temp.length; i++) {
                if ($scope.inputFieldsFiles[$scope.modalIndex] != "") {
                    $scope.inputFieldsFiles[$scope.modalIndex].push(temp[i]);
                } else {
                    $scope.inputFieldsFiles[$scope.modalIndex] = [temp[i]];
                }

            }
        } else {
            $scope.inputFieldsFiles.push(temp);
        }
        $scope.isDetailuploading = false;
        $scope.myFileDetail = [];

    }
    // NOW UPLOAD THE Images.
    $scope.uploadImages = function() {
        filesImagesdata.append("formNumber", extInsId);
        filesImagesdata.append("mdlCode", "EXT");
        filesImagesdata.append("attachmentTypeFolder", "Internal Attachments");
        $scope.inputFieldsFiles.push(filesImagesdata);
    }



    //export excel only
    $scope.exportexcel = function() {
        form_data = {
            'extinsid': $scope.extInsid.extinsid,
        };
        $http({
            method: 'POST',
            url: "/Export-excelsheet/",
            responseType: 'arraybuffer',
            data: form_data = {
                externalInspectionReport: form_data,
            },
        }).then(
            function(response) {
                var myBlob = new Blob([response.data], {
                    type: "application/vnd.ms-excel"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.shipName+"-"+$scope.imono+"-"+$scope.extInsid.extinsid+".xls";
                anchor.href = blobURL;
                anchor.click();
            });
    };
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        $rootScope.showScreenOverlay = true;
        $scope.filemsg_error = ""
        //$scope.maxFileCount
    	var filesformdata = new FormData();
        filesformdata.append("formNumber", extInsId);
        filesformdata.append("mdlCode", "EXT");
        filesformdata.append("attachmentTypeFolder", "Form Attachments");
        if ($scope.myFile.length + $scope.activeFileCount > 3) {
        	 $rootScope.showScreenOverlay = false;
            $scope.exceededFileCountDialog.open();
            return;
        }
        for (i = 0; i < $scope.myFile.length; i++) {
            if (($scope.myFile[i]._file.name).split('.')[1] == 'sql') {
                thowsUnsupportedFileError($scope.myFile[i]._file.name);
                $rootScope.showScreenOverlay = false;
                return;
            }

            if ($scope.myFile[i]._file.size <= 1048576) {
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
	            url: '/external-inspection/uploadDocuments/',
	            data: filesformdata,
	            transformRequest: angular.identity,
	            headers: {
	                'Content-Type': undefined
	            }
        };
        $http(request)
        .then(function(response) {
        	$scope.geterrormessages=response.data.message;	
             $scope.geterrorstatus=response.data.errorstatus;
             $scope.geterrorstatuscode=response.data.status;                
             $scope.dataerror =response.data.message;                 
         	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
            $http({
                method: 'POST',
                url: "/external-inspection/fetchDocuments/",
                data: {
                    "formNumber": extInsId
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
    
	 //export excel for external inspection 
    $scope.exportexcelEI= function() {
        form_data = {
            'extinsid': $scope.extInsid.extinsid,
        };
        $http({
            method: 'POST',
            url: "/Export-excelsheet-externalinspection/",
            responseType: 'arraybuffer',
            data: form_data = {
            		externalInspectionReport: form_data,
            },
        }).then(
            function(response) {
                var myBlob = new Blob([response.data], {
                    type: "application/vnd.ms-excel"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.shipName+"-"+"ExternalInspection"+"-"+$scope.extInsid.extinsid+".xls";
                anchor.href = blobURL;
                anchor.click();
            });
    };
    
    //export pdf only
	$scope.saveAsPDFDocument = function(){    		
		form_data = {
			   'extinsid': $scope.extInsid.extinsid,				
		};		
		$http({
			url: "/ext-ins-save-as-pdf/",
			    dataType: 'json',
			    method: 'POST',
			   responseType: 'arraybuffer',
			data: form_data = { 
					externalInspectionReport:  form_data,            
			   },			
			}).then(
					function(response) {
 		                var myBlob = new Blob([response.data], {
 		                    type: "application/pdf"
 		                });
 		                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
 		                var anchor = document.createElement("a");
 		                anchor.download = $scope.shipName+"-"+"ExternalInspection"+"-"+$scope.extrfid+".pdf";
 		                anchor.href = blobURL;
 		                anchor.click();	
			});
	};
	$scope.deleteActionPerformed = function(){
   	 form_data = {
                'extinsid': $scope.extInsid.extinsid,
            };
   	 Connectivity.IsOk().then(function(response) {
            externalInspectionService.deleteExtReportMainForm(form_data).then(function(response) {
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
                     $scope.voidstatus=true;
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