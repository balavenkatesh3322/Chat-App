app.controller('nearMissCtrl', function($scope, Connectivity, $http, toaster, systemNotificationService, $timeout, $window, $location, $filter, $routeParams, $rootScope) {
    $scope.geterrorstatuscode = "0";
    $scope.errorTest = ["Error Message", "Error2"]
    $scope.hidebody = true;
    $scope.datastatus = true;
    $scope.haspermission = false;
    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }
    $rootScope.showScreenOverlay = false;
    var nrmid = $routeParams.id;


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


    /************* TO PREVIEW FILE ********************/
    $scope.previewFile = function(docid) {
        $http.get('/nearmiss/downloadDocument/?docId=' + docid, {
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
        $scope.matrixDialog.close();
        $scope.reAssignDialog.close();
        $scope.confirmDeleteDialog.close();
    });

    function thowsUnsupportedFileError(filename) {
        $scope.fileSizeExceededDialogMsg = filename + " is not supported format. Unable to upload.";
        $scope.exceededFileSizedialog.open();
    }
    $scope.validationDialogMsg = "Some mandatory field/fields are missing.";
    $scope.exceededRowsDialogMsg = "You cannot make more than 15 entries.";

    function thowsFileSizeExceededError(filename) {
        $scope.fileSizeExceededDialogMsg = filename + " is more than 1 MB, cannot be uploaded";
        $scope.exceededFileSizedialog.open();
    }

    $scope.actions = [{
        text: 'Ok',
        action: function() {
            $scope.geterrorstatuscode = "0";
        }
    }];
    var changeErrorStatus = function() {
        $scope.geterrorstatuscode = "0";
    }
    $scope.deleteDialogMsg = "You sure, that you want to delete this?";
    $scope.deleteActions = [

        {
            text: 'Yes',
            action: removeDocument
        }, {
            text: 'No'
        }
    ];
    $scope.confirmDelete = function(docid) {
            $scope.deleteDocId = docid;
            $scope.confirmDeleteDialog.open();
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
        filesformdata.append("formNumber", nrmid);
        filesformdata.append("mdlCode", "NMR");
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
            url: '/nearmiss/uploadDocuments/',
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
                        url: "/nearmiss/fetchDocuments/",
                        data: {
                            "formNumber": nrmid
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
        $http({
            url: "/nearmiss/removeDocument/?docId=" + $scope.deleteDocId + "&formId=" + $scope.srno,
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            //Fetching the file data
            $scope.geterrormessages = response.data.message;
            $scope.geterrorstatus = response.data.errorstatus;
            $scope.geterrorstatuscode = response.data.status;
            $scope.dataerror = response.data.message;
            if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                $http({
                    method: 'POST',
                    url: "/nearmiss/fetchDocuments/",
                    data: {
                        "formNumber": $scope.srno
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
                        } else {
                            $scope.errordetails = response.data.exceptionDetail;
                            $scope.showexception = response.data.showerrormessage
                            $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                            $scope.dataerror = [response.data.message[0]];
                        }

                    });
            } else {
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                $scope.dataerror = [response.data.message[0]];
            }

        });
    };

    /***********************************************************/



    $scope.errorFlag = false;
    $scope.factorsCheckBox = [];
    $scope.personConcernedName = "";
    $scope.curFormStatus = "";
    $scope.exisitingData = false;
    $scope.psyDiv = false;
    $scope.concernedPersonTempName = "";
    $scope.processDiagram = "";
    $scope.userTier = "";
    $scope.disableDIV = false;
    $scope.disableShoreDIV = true;
    $scope.currentUser = "";

    $scope.allfleetFunction = function() {
        if ($scope.allShips == true) {
            $scope.sharecode = "";
        } else {}
    }
    $scope.fleetFunction = function() {
        if ($scope.sharecode == "") {
            $scope.allShips = true;
        } else {
            $scope.allShips = false;
        }
    }
    $scope.wrkflowstatus = [];

    $scope.max100Length = 100;
    $scope.max200Length = 200;
    $scope.max500Length = 500;
    var date = new Date();

    $scope.restrictFutureDate = {
        max: new Date($scope.reportDate)
    }
    $scope.reAssignDialogClick = function(targetName) {
        $scope.targetName = targetName;
        $scope.reAssignDialog.open();
    }

    $scope.reassignActions = [{
        text: 'Yes',
        action: function openOkAction() {
            angular.element($scope.targetName).modal('show');
        }
    }, {
        text: 'No'
    }];

    $scope.okAction = function(targetName) {
        if ($scope.remarks !== '' && $scope.remarks !== undefined) {
            $scope.sendForm('reasign');
            angular.element(targetName).modal('hide');
        } else {
            $scope.remarksMessage_error = "This field is required";
        }
    }
    $scope.hideError = function(msg) {
        var fieldName = msg + "_error";
        $scope[fieldName] = "";
    }


    Connectivity.IsOk().then(function(response) {
    	$scope.reporterCodeArr=[];
    	$scope.personConcernedArr=[];
        $rootScope.showScreenOverlay = true;
        $http({
            method: 'POST',
            url: "/get-near-miss-form-data-by-no/",
            data: {
                "nrmid": nrmid
            }
        }).then(
            function(response) {
            	
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                	console.log("MAJOR RESPONSE >>>",response.data.data)
                    $scope.chatdata = response.data.data[0].communicationWindowList;
                    $scope.filesData = response.data.data[0].formsdoc;
                    countActiveFiles();
                    $scope.shipmatrix = response.data.data[0].nearMissMatrixship;
                    $scope.shorematrix = response.data.data[0].nearMissMatrixshore;
                    $scope.fleetmaster = response.data.data[0].vesselDetails;
                    $scope.personConcernedRanks = response.data.data[0].personConcernedRank;
                    $scope.shipPositions = response.data.data[0].shippositionMaster;
                    $scope.departments = response.data.data[0].departmentMaster;
                    $scope.nearMissLocations = response.data.data[0].nearmisslocationMaster;
                    $scope.nearMissCategories = response.data.data[0].nearmissCategoryMaster;
                    $scope.nearMissJobContents = response.data.data[0].nearmissjobMaster;
                    $scope.nearMissSubstandardActions = response.data.data[0].CauseMaster;
                    $scope.nearMissSubstandardConditions = response.data.data[0].causeMaster;
                    $scope.nearMissCasualFactors = response.data.data[0].casualfactorMaster;
                    $scope.nearMissPsychologicalFactors = response.data.data[0].nrmIsPsychologyMaster;
                    $scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
                    $scope.wrkflowstatus = response.data.data[0].nrmWfHistory;
                    $scope.investigate = response.data.data[0].nearMissInvestigate;
                    $scope.Actiondata = response.data.data[0].buttonaction;
                    $scope.Actiondatalength = $scope.Actiondata.length;
                    if ($scope.Actiondata != null && $scope.Actiondata.length != 0) {
                        $scope.actionrights = $scope.Actiondata[0][0];
                        $scope.defaultaction = $scope.Actiondata[0][1];
                        $scope.stageid = $scope.Actiondata[0][2];
                        $scope.reassignrights = $scope.Actiondata[0][3];
                        $scope.deleteAction = $scope.Actiondata[1];
                    }
                    $scope.fleetmaster.push({
                        'fleetcode': 99,
                        'fleetname': "Allships"
                    })
                    response = response.data.data[0].NearMissMaster;
                    for (var i = 0; i < $scope.wrkflowstatus.length; i++) {
                        if ($scope.wrkflowstatus[i].cntrltype === 'CNT001') {
                            $scope.shoreWorkFlowExist = true;
                            $scope.shoreWorkFlowNotExist = false;
                        } else if ($scope.shoreWorkFlowExist != true) {
                            $scope.shoreWorkFlowExist = false;
                            $scope.shoreWorkFlowNotExist = true;
                        }

                        if ($scope.wrkflowstatus[i].cntrltype === 'CNT002') {
                            $scope.shipWorkFlowExist = true;
                            $scope.shipWorkFlowNotExist = false;
                        } else if ($scope.shipWorkFlowExist != true) {
                            $scope.shipWorkFlowExist = false;
                            $scope.shipWorkFlowNotExist = true;
                        }
                    }
                    $scope.exisitingData = true;
                    $scope.srno = response.nrmid;
                    $scope.formStatus = response.active_status;
                    $scope.shipPosition = response.shippositionCode;
                    $scope.department = response.deptCode;
                    $scope.personConcernedExperience = response.yearofexp;
                    $scope.howLongDoesHeInRank = response.rankyr;
                    $scope.nearMissCategory = response.categorycode;
                    $scope.nearMissJobContent = response.jobcode;
                    $scope.nearMissLocation = response.locationcode;
                    $scope.detailReport = response.nearMissDetail;
                    $scope.whatHappened = response.incidentOutline;
                    $scope.goingOn = response.incidentIntent;
                    $scope.goneWrong = response.watsWrong;
                    $scope.nearMissSubstandardAction = response.cause1;
                    $scope.nearMissSubstandardCondition = response.cause2;
                    $scope.nearMissCasualFactor = response.casualfactor;
                    $scope.rootCause = response.rootcause;
                    $scope.lessonLearnt = response.lessonlearnt;
                    $scope.adviseByDHead = response.advisebydhead;
                    $scope.adviseByCaptain = response.advisebycaptain;
                    $scope.correctiveAction = response.correctiveaction;
                    $scope.wrkflowid = response.wrkflowid;
                    $scope.reportDate = response.reportdate;
                    $scope.restrictFutureDate = {
                        max: new Date($scope.reportDate)
                    }
                    $scope.shipName = response.vesselname;
                    $scope.shipCode = response.vesselCode;
                    $scope.companycode = response.companyCode;
                    $scope.shipTypecode = response.shipType;
                    $scope.imono = response.imono;
                  
                    $scope.reporterName = response.empname;
                    $scope.reporterCode = response.reporterCode;
                    if(response.reporterCode){
                    $scope.reporterCodeArr.push({'code':'','name':''},{'code':response.reporterCode,'name':response.empname});
                    }else{
                    $scope.reporterCodeArr.push({'code':'','name':''},{'code':response.crUser,'name':response.crUserName});
                    }
                    $scope.reporterRankcode = response.rankCode;
                    $scope.reporterRankCode = response.rankCode;
                    $scope.loginUser = response.usercode;
                    $scope.cruser = response.crUser;
                    $scope.createddate = response.crDate;
                    $scope.imono = response.imono;
                    $scope.actFormno = response.formnumber;
                    $scope.actRevno = response.revnumber;
                    $scope.reviseddate = response.revdate;
                    $scope.company = response.shorename;
                    $scope.shipType = response.vessaltypedesc;
                    $scope.reporterRank = response.rankname;
                    $scope.maxFileCount = response.filemaxcount;
                    $scope.maxFileSize = response.maxFilembCount;
                    $scope.exceededFileCountDialogMsg = "You cannot attach more than " + $scope.maxFileCount + " files. Remove a file, then try."
                    $scope.formNo = response.formnumber;
                    $scope.isMaster = response.ismaster;
                    $scope.Advicefromcaption = response.advicefromDephead;
                    $scope.advisebyqshemanger = response.advisebyqshemanger;
                    $scope.isshare = response.isshare
                    $scope.mdlname = response.mdlname;
                    $scope.personConcernedName = response.nameofperson;
                    $scope.nmrfid = response.nmrfid;
                    
                    //$scope.setdate="dd-MM-yyyy";
                    $scope.setdate = response.uidateformat;
                    if (response.escalate == "Y") {
                        $scope.escalate = true;
                    } else {
                        $scope.escalate = false;
                    }
                    if (response.isshare == "Y") {
                        $scope.isshare = true;
                    } else {
                        $scope.isshare = false;
                    }
                    $scope.allfleetFunction();
                    $scope.fleetFunction();
                    if (response.isMarkedSignificant == "Y") {
                        $scope.isMarkedSignificant = true;
                    } else {
                        $scope.isMarkedSignificant = false;
                    }
                    $scope.sicomment = response.sicomment;
                    $scope.sharecode = response.share;
                    $scope.personConcernedRank = response.concernedrankcode;
                    if(response.personconcernedcode){
                    	$scope.fetchName($scope.personConcernedRank);
                    }else{
                    	$scope.fetchWithoutName($scope.personConcernedRank);
                    }
                    
                    if (response.active_status == "CLO") {
                        $scope.exportDis = true;
                        $scope.closeOutDis = true;
                    }if (response.active_status == "VOI") {
                        $scope.closeOutDis = true;
                    }

                    if (response.incidentDate != null) {
                        var incidentDate = new Date(response.incidentDate);
                        var ampm = (incidentDate.getUTCHours() >= 12) ? "PM" : "AM";
                        var hours = (incidentDate.getUTCHours() > 12) ? (incidentDate.getUTCHours() - 12) : (incidentDate.getUTCHours());
                        $scope.incidentDate = ((incidentDate.getUTCMonth() + 1) + "/" + incidentDate.getUTCDate() + "/" + incidentDate.getUTCFullYear() + " " + hours + ":" + incidentDate.getUTCMinutes() + " " + ampm);
                    }

                    $scope.Psychological = {
                        placeholder: "Select Psychological Name",
                        dataTextField: "psychologyname",
                        dataValueField: "psychologycode",
                        autoBind: true,
                        autoClose: false,
                        dataSource: {
                            data: $scope.nearMissPsychologicalFactors
                        }
                    };

                    //ship side matrix date
                    for (var i = 0; i < $scope.shipmatrix.length; i++) {
                        if ($scope.shipmatrix[i].riskfactor == 'Environment') {
                            $scope.enviromentConsequenceShip = $scope.shipmatrix[i].consequence;
                            $scope.enviromentProbabilityShip = $scope.shipmatrix[i].probablilty;
                            document.getElementById('fa_en_td1').value = $scope.shipmatrix[i].consequence;
                            document.getElementById('fa_en_td2').value = $scope.shipmatrix[i].probablilty;
                        } else if ($scope.shipmatrix[i].riskfactor == 'Health') {
                            $scope.healthConsequenceShip = $scope.shipmatrix[i].consequence;
                            $scope.healthProbabilityShip = $scope.shipmatrix[i].probablilty;
                            document.getElementById('fa_he_td1').value = $scope.shipmatrix[i].consequence;
                            document.getElementById('fa_he_td2').value = $scope.shipmatrix[i].probablilty;
                        } else if ($scope.shipmatrix[i].riskfactor == 'Safety') {
                            $scope.safetyConsequenceShip = $scope.shipmatrix[i].consequence;
                            $scope.safetyProbabilityShip = $scope.shipmatrix[i].probablilty;
                            document.getElementById('fa_sa_td1').value = $scope.shipmatrix[i].consequence;
                            document.getElementById('fa_sa_td2').value = $scope.shipmatrix[i].probablilty;
                        } else if ($scope.shipmatrix[i].riskfactor == 'Property') {
                            $scope.propertyConsequenceShip = $scope.shipmatrix[i].consequence;
                            $scope.propertyProbabilityShip = $scope.shipmatrix[i].probablilty;
                            document.getElementById('fa_pr_td1').value = $scope.shipmatrix[i].consequence;
                            document.getElementById('fa_pr_td2').value = $scope.shipmatrix[i].probablilty;
                        } else if ($scope.shipmatrix[i].riskfactor == 'Reputation') {
                            $scope.reputationConsequenceShip = $scope.shipmatrix[i].consequence;
                            $scope.reputationProbabilityShip = $scope.shipmatrix[i].probablilty;
                            document.getElementById('fa_re_td1').value = $scope.shipmatrix[i].consequence;
                            document.getElementById('fa_re_td2').value = $scope.shipmatrix[i].probablilty;
                        }
                    }
                    document.getElementById('fa_he_td1').onchange();
                    document.getElementById('fa_he_td2').onchange();
                    document.getElementById('fa_sa_td1').onchange();
                    document.getElementById('fa_sa_td2').onchange();
                    document.getElementById('fa_en_td1').onchange();
                    document.getElementById('fa_en_td2').onchange();
                    document.getElementById('fa_pr_td1').onchange();
                    document.getElementById('fa_pr_td2').onchange();
                    document.getElementById('fa_re_td1').onchange();
                    document.getElementById('fa_re_td2').onchange();

                    //shore side matrix date
                    for (var i = 0; i < $scope.shorematrix.length; i++) {
                        if ($scope.shorematrix[i].riskfactor == 'Environment') {
                            $scope.enviromentConsequenceShore = $scope.shorematrix[i].consequence;
                            $scope.enviromentProbabilityShore = $scope.shorematrix[i].probablilty;
                            document.getElementById('ri_en_td1').value = $scope.shorematrix[i].consequence;
                            document.getElementById('ri_en_td2').value = $scope.shorematrix[i].probablilty;
                        } else if ($scope.shorematrix[i].riskfactor == 'Health') {
                            $scope.healthConsequenceShore = $scope.shorematrix[i].consequence;
                            $scope.healthProbabilityShore = $scope.shorematrix[i].probablilty;
                            document.getElementById('ri_he_td1').value = $scope.shorematrix[i].consequence;
                            document.getElementById('ri_he_td2').value = $scope.shorematrix[i].probablilty;
                        } else if ($scope.shorematrix[i].riskfactor == 'Safety') {
                            $scope.safetyConsequenceShore = $scope.shorematrix[i].consequence;
                            $scope.safetyProbabilityShore = $scope.shorematrix[i].probablilty;
                            document.getElementById('ri_sa_td1').value = $scope.shorematrix[i].consequence;
                            document.getElementById('ri_sa_td2').value = $scope.shorematrix[i].probablilty;
                        } else if ($scope.shorematrix[i].riskfactor == 'Property') {
                            $scope.propertyConsequenceShore = $scope.shorematrix[i].consequence;
                            $scope.propertyProbabilityShore = $scope.shorematrix[i].probablilty;
                            document.getElementById('ri_pr_td1').value = $scope.shorematrix[i].consequence;
                            document.getElementById('ri_pr_td2').value = $scope.shorematrix[i].probablilty;
                        } else if ($scope.shorematrix[i].riskfactor == 'Reputation') {
                            $scope.reputationConsequenceShore = $scope.shorematrix[i].consequence;
                            $scope.reputationProbabilityShore = $scope.shorematrix[i].probablilty;
                            document.getElementById('ri_re_td1').value = $scope.shorematrix[i].consequence;
                            document.getElementById('ri_re_td2').value = $scope.shorematrix[i].probablilty;
                        }
                    }

                    document.getElementById('ri_he_td1').onchange();
                    document.getElementById('ri_he_td2').onchange();
                    document.getElementById('ri_sa_td1').onchange();
                    document.getElementById('ri_sa_td2').onchange();
                    document.getElementById('ri_en_td1').onchange();
                    document.getElementById('ri_en_td2').onchange();
                    document.getElementById('ri_pr_td1').onchange();
                    document.getElementById('ri_pr_td2').onchange();
                    document.getElementById('ri_re_td1').onchange();
                    document.getElementById('ri_re_td2').onchange();

                    //investigate date 
                    $scope.setinvestigate = function() {
                        $scope.psychologicalProblemDesc = [];
                        for (var i = 0; i < $scope.investigate.length; i++) {
                            if ($scope.investigate[i].problem == "Environmental") {
                                document.getElementById('envproblemid').checked = true;
                                document.getElementById('envproblemid').onclick();
                                $scope.envProblemDesc = $scope.investigate[i].details;
                            }
                            if ($scope.investigate[i].problem == "Procedures") {
                                document.getElementById('proproblemboxid').checked = true;
                                document.getElementById('proproblemboxid').onclick();
                                $scope.procedureProblemDesc = $scope.investigate[i].details;
                            }
                            if ($scope.investigate[i].problem == "SR-Psychological") {
                                document.getElementById('psyproblemboxid').checked = true;
                                document.getElementById('psyproblemboxid').onclick();
                                $scope.psychologicalProblemDesc.push($scope.investigate[i].details);

                            }
                            if ($scope.investigate[i].problem == "Equipment") {
                                document.getElementById('eqpproblemboxid').checked = true;
                                document.getElementById('eqpproblemboxid').onclick();
                                $scope.equipmentProblemDesc = $scope.investigate[i].details;
                            }
                            if (document.getElementById($scope.investigate[i].problem)) {
                                document.getElementById($scope.investigate[i].problem).checked = true;
                            }

                        }
                    }

                    $timeout(function() {
                        $scope.setinvestigate();
                    }, 10);
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

   
    $scope.fetchName = function(personConcernedRank) {
    	$scope.personConcernedArr=[];
        $http({
            method: 'GET',
            url: "/near-miss-name-person-concerned/?rankCode=" + personConcernedRank + "&nrmid=" + nrmid,
        }).then(
            function(response) {
                $scope.personConcernedName = response.data[0].empName;
                $scope.personConcernedNameCode = response.data[0].empCode;
                $scope.concernedPersonTempName = response.data[0].empName;
                $scope.personConcernedArr.push({'code':'','name':''},{'code':$scope.personConcernedNameCode,'name':$scope.personConcernedName});
            });
        $scope.hideError('rankofperson');
    };
    
    $scope.fetchWithoutName = function(personConcernedRank) {
    	$scope.personConcernedArr=[];
        $http({
            method: 'GET',
            url: "/near-miss-name-person-concerned/?rankCode=" + personConcernedRank + "&nrmid=" + nrmid,
        }).then(
            function(response) {
                $scope.personConcernedArr.push({'code':'','name':''},{'code':response.data[0].empCode,'name':response.data[0].empName});
            });
    };
    $scope.selectedfactors = function() {
        $scope.psychologicalProblemDesc = "";
        $scope.factorsCheckBox = $filter('filter')($scope.nearMissPsychologicalFactors, {
            checked: true
        });
        if ($scope.factorsCheckBox.length > 0) {
            document.getElementById('psyproblemboxid').checked = true;
            document.getElementById('psyproblemdivid').style.display = "block";
            for (i = 0; i < $scope.factorsCheckBox.length; i++) {
                var str = $scope.factorsCheckBox[i].psychologyname;
                if ($scope.psychologicalProblemDesc != undefined) {
                    $scope.psychologicalProblemDesc.trim();
                    $scope.psychologicalProblemDesc += "\n" + str;
                } else {
                    $scope.psychologicalProblemDesc = str;
                }
            }
        } else {
            document.getElementById('psyproblemboxid').checked = false;
            document.getElementById('psyproblemdivid').style.display = "none";
        }

    }


    $scope.updateChat = function() {
        if (!$scope.msg) {
            return null;
        }
        chat_data = {
            'message': $scope.msg,
            'formSerialId': $scope.srno
        };
        $http({
            url: "/near-miss-chat-submission/",
            dataType: 'json',
            method: 'POST',
            data: chat_data,
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function(response) {
            $http({
                method: 'POST',
                url: "/get-near-miss-chat-data-by-no/",
                data: {
                    "nrmid": $scope.srno
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

    $scope.sendForm = function(typeOfButtonClicked) {
        $scope.errorFlag == false;
        $scope.save_validation();
        var activeStatus = "INP"
        $scope.formStatus = "INP"
        if (typeOfButtonClicked == 'send') {
            $scope.actionFormHide = true;
            $scope.formStatus = "SUB"; // chg
            activeStatus = "SUB"
            $scope.validation();
        } else if (typeOfButtonClicked == 'approve') {
            $scope.actionFormHide = true;
            $scope.formStatus = "APR"; // chg
            activeStatus = "APR"
            $scope.validation();
        } else if (typeOfButtonClicked == 'closeout') {
            $scope.actionFormHide = true;
            $scope.formStatus = "CLO";
            activeStatus = "CLO"
            activeStatus = "CLO";
            $scope.validation();
        } else if (typeOfButtonClicked == 'reasign') {
            $scope.actionFormHide = true;
            $scope.validation();
            $scope.formStatus = "RSN";
            activeStatus = "RSN"

        }
        if ($scope.errorFlag == false) {
            $rootScope.showScreenOverlay = true;
            form_data = {
                'nrmid': $scope.srno,
                'reportdate': new Date($scope.reportDate).toISOString(),
                'imono': $scope.imono,
                'timeoffset': new Date().getTimezoneOffset(),
                'companyCode': $scope.companyCode,
                'shipType': $scope.shipTypecode,
                'shippositionCode': $scope.shipPosition,
                'reporterCode': $scope.reporterCode,
                'rankCode': $scope.reporterRankcode,
                'deptCode': $scope.department,
                'personconcernedcode': $scope.personConcernedNameCode,
                'concernedrankcode': $scope.personConcernedRank,
                'yearofexp': $scope.personConcernedExperience,
                'rankyr': $scope.howLongDoesHeInRank,
                'nearMissDetail': $scope.detailReport,
                'incidentDate': new Date($scope.incidentDate),
                'locationcode': $scope.nearMissLocation,
                'categorycode': $scope.nearMissCategory,
                'jobcode': $scope.nearMissJobContent,
                'incidentOutline': $scope.whatHappened,
                'incidentIntent': $scope.goingOn,
                'watsWrong': $scope.goneWrong,
                'active_status': activeStatus,
                'cause1': $scope.nearMissSubstandardAction,
                'cause2': $scope.nearMissSubstandardCondition,
                'casualfactor': $scope.nearMissCasualFactor,
                'rootcause': $scope.rootCause,
                'lessonlearnt': $scope.lessonLearnt,
                'advisebydhead': $scope.adviseByDHead,
                'advisebycaptain': $scope.adviseByCaptain,
                'correctiveaction': $scope.correctiveAction,
                'escalate': $scope.escalate,
                'isMarkedSignificant': $scope.isMarkedSignificant,
                'sicomment': $scope.sicomment,
                'share': $scope.sharecode,
                "crDate": $scope.createddate,
                "formnumber": $scope.actFormno,
                "revnumber": $scope.actRevno,
                "revdate": $scope.reviseddate,
                'vesselCode': $scope.shipCode,
                "wrkflowid": $scope.wrkflowid,
                "companyCode": $scope.companycode,
                "crUser": $scope.cruser,
                "imono": $scope.imono,
                "advisebyqshemanger": $scope.advisebyqshemanger,
                "isshare": $scope.isshare,
                "nmrfid" : $scope.nmrfid,
            };
            form_data_wfHistory = {
                'nrmid': $scope.srno,
                'userid': $scope.userid,
                'rankid': $scope.reporterRankCode,
                'formstatus': $scope.formStatus,
                'remarks': $scope.remarks,
            };
            form_data_investigate = [];
            if (document.getElementById('envproblemid').checked == true) {
                $scope.envProblem = true;
            }
            if (document.getElementById('proproblemboxid').checked == true) {
                $scope.procedureProblem = true;
            }
            if (document.getElementById('psyproblemboxid').checked == true) {
                $scope.psychologicalProblem = true;
            }
            if (document.getElementById('eqpproblemboxid').checked == true) {
                $scope.equipmentProblem = true;
            }
            if ($scope.envProblem) {
                form_data_investigate.push({
                    'nrmid': $scope.srno,
                    'problem': 'Environmental',
                    'details': $scope.envProblemDesc,
                    'investigaterefid': $scope.shipCode + 'Environmental' + $scope.srno
                });
            }
            if ($scope.procedureProblem) {
                form_data_investigate.push({
                    'nrmid': $scope.srno,
                    'problem': 'Procedures',
                    'details': $scope.procedureProblemDesc,
                    'investigaterefid': $scope.shipCode + 'Procedures' + $scope.srno
                });
            }
            if ($scope.equipmentProblem) {
                form_data_investigate.push({
                    'nrmid': $scope.srno,
                    'problem': 'Equipment',
                    'details': $scope.equipmentProblemDesc,
                    'investigaterefid': $scope.shipCode + 'Equipment' + $scope.srno
                });
            }

            if ($scope.factorsCheckBox.length >= 1) {
                form_data_investigate.push({
                    'nrmid': $scope.srno,
                    'problem': 'SR-Psychological',
                    'details': $scope.psychologicalProblemDesc,
                    'investigaterefid': $scope.shipCode + 'SR-Psychological' + $scope.srno
                });
            }
            for (var i = 0; i < $scope.psychologicalProblemDesc.length; i++) {
                form_data_investigate.push({
                    'nrmid': $scope.srno,
                    'problem': "SR-Psychological",
                    'details': $scope.psychologicalProblemDesc[i],
                    'investigaterefid': $scope.shipCode + $scope.psychologicalProblemDesc[i] + $scope.srno
                });
            }
            $scope.healthConsequenceShip = document.getElementById('fa_he_td1').value;
            $scope.healthProbabilityShip = document.getElementById('fa_he_td2').value;
            $scope.safetyConsequenceShip = document.getElementById('fa_sa_td1').value;
            $scope.safetyProbabilityShip = document.getElementById('fa_sa_td2').value;
            $scope.enviromentConsequenceShip = document.getElementById('fa_en_td1').value;
            $scope.enviromentProbabilityShip = document.getElementById('fa_en_td2').value;
            $scope.propertyConsequenceShip = document.getElementById('fa_pr_td1').value;
            $scope.propertyProbabilityShip = document.getElementById('fa_pr_td2').value;
            $scope.reputationConsequenceShip = document.getElementById('fa_re_td1').value;
            $scope.reputationProbabilityShip = document.getElementById('fa_re_td2').value;
            form_data_matrix_ship = [{
                'nrmid': $scope.srno,
                'riskfrom': 'CNT002',
                'riskfactor': 'Health',
                'consequence': $scope.healthConsequenceShip,
                'probablilty': $scope.healthProbabilityShip,
                'matrixrefid': $scope.srno + '/1',
                'potentialrisk': document.getElementsByClassName('fa_health_ship')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT002',
                'riskfactor': 'Safety',
                'consequence': $scope.safetyConsequenceShip,
                'probablilty': $scope.safetyProbabilityShip,
                'matrixrefid': $scope.srno + '/2',
                'potentialrisk': document.getElementsByClassName('fa_safety_ship')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT002',
                'riskfactor': 'Environment',
                'consequence': $scope.enviromentConsequenceShip,
                'probablilty': $scope.enviromentProbabilityShip,
                'matrixrefid': $scope.srno + '/3',
                'potentialrisk': document.getElementsByClassName('fa_environment_ship')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT002',
                'riskfactor': 'Property',
                'consequence': $scope.propertyConsequenceShip,
                'probablilty': $scope.propertyProbabilityShip,
                'matrixrefid': $scope.srno + '/4',
                'potentialrisk': document.getElementsByClassName('fa_property_ship')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT002',
                'riskfactor': 'Reputation',
                'consequence': $scope.reputationConsequenceShip,
                'probablilty': $scope.reputationProbabilityShip,
                'matrixrefid': $scope.srno + '/5',
                'potentialrisk': document.getElementsByClassName('fa_reputation_ship')[0].innerHTML
            }];
            $scope.healthConsequenceShore = document.getElementById('ri_he_td1').value;
            $scope.healthProbabilityShore = document.getElementById('ri_he_td2').value;
            $scope.safetyConsequenceShore = document.getElementById('ri_sa_td1').value;
            $scope.safetyProbabilityShore = document.getElementById('ri_sa_td2').value;
            $scope.enviromentConsequenceShore = document.getElementById('ri_en_td1').value;
            $scope.enviromentProbabilityShore = document.getElementById('ri_en_td2').value;
            $scope.propertyConsequenceShore = document.getElementById('ri_pr_td1').value;
            $scope.propertyProbabilityShore = document.getElementById('ri_pr_td2').value;
            $scope.reputationConsequenceShore = document.getElementById('ri_re_td1').value;
            $scope.reputationProbabilityShore = document.getElementById('ri_re_td2').value;
            form_data_matrix_shore = [{
                'nrmid': $scope.srno,
                'riskfrom': 'CNT001',
                'riskfactor': 'Health',
                'consequence': $scope.healthConsequenceShore,
                'probablilty': $scope.healthProbabilityShore,
                'matrixrefid': $scope.srno + '/6',
                'potentialrisk': document.getElementsByClassName('ri_health_shore')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT001',
                'riskfactor': 'Safety',
                'consequence': $scope.safetyConsequenceShore,
                'probablilty': $scope.safetyProbabilityShore,
                'matrixrefid': $scope.srno + '/7',
                'potentialrisk': document.getElementsByClassName('ri_safety_shore')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT001',
                'riskfactor': 'Environment',
                'consequence': $scope.enviromentConsequenceShore,
                'probablilty': $scope.enviromentProbabilityShore,
                'matrixrefid': $scope.srno + '/8',
                'potentialrisk': document.getElementsByClassName('ri_environment_shore')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT001',
                'riskfactor': 'Property',
                'consequence': $scope.propertyConsequenceShore,
                'probablilty': $scope.propertyProbabilityShore,
                'matrixrefid': $scope.srno + '/9',
                'potentialrisk': document.getElementsByClassName('ri_property_shore')[0].innerHTML
            }, {
                'nrmid': $scope.srno,
                'riskfrom': 'CNT001',
                'riskfactor': 'Reputation',
                'consequence': $scope.reputationConsequenceShore,
                'probablilty': $scope.reputationProbabilityShore,
                'matrixrefid': $scope.srno + '/10',
                'potentialrisk': document.getElementsByClassName('ri_reputation_shore')[0].innerHTML
            }];
            Connectivity.IsOk().then(function(response) {
                $http({
                        url: "/near-miss-form-composite-submission/",
                        dataType: 'json',
                        method: 'POST',
                        data: {
                            nearmissMaster: form_data,
                            nrmWfHistory: form_data_wfHistory,
                            nearMissInvestigateList: form_data_investigate,
                            nearMissMatrixShipList: form_data_matrix_ship,
                            nearMissMatrixShoreList: form_data_matrix_shore,
                            stageid: $scope.stageid
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function(response) {
                        $scope.geterrormessages = response.data.message;
                        $scope.geterrorstatus = response.data.errorstatus;
                        $scope.geterrorstatuscode = response.data.status;
                        if (response.data.status == 0 && response.data.length != 0) {
                            $scope.wrkflowstatus = response.data.data[0].nrmWfHistory;
                        	$scope.nmrfid=response.data.data[0].refId;
                            if (typeOfButtonClicked != 'save') {
                                $scope.actionFormHide = true;
                            }
                            toaster.success({
                                title: "Information",
                                body: response.data.successMessage
                            });
                            $rootScope.showScreenOverlay = false;
                        } else {
                            if (response.data.exceptionDetail != null) {
                                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                            }
                            $scope.errordetails = response.data.exceptionDetail;
                            $scope.showexception = response.data.showerrormessage
                            $rootScope.showScreenOverlay = false;
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

                $scope.dialog.open();
                $scope.dataerror = "Server not reached";
            })
        } else {
            toaster.error({
                title: "Information",
                body: "Data couldn't be sent. Please enter the required fields"
            });
        }
    }

    $scope.deleteActionPerformed = function() {
        Connectivity.IsOk().then(function(response) {
            form_data = {
                'nrmid': $scope.srno,
            };
            $http({
                url: "/delete_nearmiss_master/",
                dataType: 'json',
                method: 'POST',
                data: form_data,
                headers: {
                    "Content-Type": "application/json"
                }
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
                    $scope.closeOutDis = true;
                    $scope.actionFormHide = true;
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



    $scope.validation = function() {
        $scope.actionFormHide = false;
        $scope.errorFlag = false;
        $scope.errormessage = "This field is required"
        if (!$scope.shipPosition) {
            $scope.shipPosition_error = $scope.errormessage;
            $scope.errorFlag = true;
            var shipPositionfocuse = $window.document.getElementById('shipPosition');;
            shipPositionfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.shipPosition_error = '';
        }
        if (!$scope.department) {
            $scope.department_error = $scope.errormessage;
            $scope.errorFlag = true;
            var departmentfocuse = $window.document.getElementById('department');;
            departmentfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.department_error = '';
        }

        if (!$scope.personConcernedExperience) {
            $scope.personConcernedExperience_error = $scope.errormessage;
            $scope.errorFlag = true;
            varpersonConcernedExperiencefocuse = $window.document.getElementById('personConcernedExperience');;
            personConcernedExperience.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.personConcernedExperience_error = '';
        }

        if (!$scope.howLongDoesHeInRank) {
            $scope.howLongDoesHeInRank_error = $scope.errormessage;
            $scope.errorFlag = true;
            howLongDoesHeInRankfocuse = $window.document.getElementById('howLongDoesHeInRank');;
            howLongDoesHeInRankfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.howLongDoesHeInRank_error = '';
        }

        if (!$scope.incidentDate && document.getElementById('incidentDate').value == '') {
            $scope.incidentDate_error = $scope.errormessage;
            $scope.errorFlag = true;
            $scope.incCondtn = true;
            incidentDatefocuse = $window.document.getElementById('incidentDate');;
            incidentDatefocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.incidentDate_error = '';
        }

        if (!$scope.nearMissCategory) {
            $scope.nearMissCategory_error = $scope.errormessage;
            $scope.errorFlag = true;
            nearMissCategoryfocuse = $window.document.getElementById('nearMissCategory');;
            nearMissCategoryfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.nearMissCategory_error = '';
        }

        if (!$scope.nearMissLocation) {
            $scope.nearMissLocation_error = $scope.errormessage;
            $scope.errorFlag = true;
            nearMissLocationfocuse = $window.document.getElementById('nearMissLocation');;
            nearMissLocationfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.nearMissLocation_error = '';
        }

        if (!$scope.nearMissJobContent) {
            $scope.nearMissJobContent_error = $scope.errormessage;
            $scope.errorFlag = true;
            nearMissJobContentfocuse = $window.document.getElementById('nearMissJobContent');;
            nearMissJobContentfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.nearMissJobContent_error = '';
        }

        if (!$scope.detailReport) {
            $scope.detailReport_error = $scope.errormessage;
            $scope.errorFlag = true;
            detailReportfocuse = $window.document.getElementById('detailReport');;
            detailReportfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.detailReport_error = '';
        }

        if (!$scope.whatHappened) {
            $scope.whatHappened_error = $scope.errormessage;
            $scope.errorFlag = true;
            whatHappenedfocuse = $window.document.getElementById('whatHappened');;
            whatHappenedfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.whatHappened_error = '';
        }

        if (!$scope.goingOn) {
            $scope.goingOn_error = $scope.errormessage;
            $scope.errorFlag = true;
            goingOnfocuse = $window.document.getElementById('goingOn');;
            goingOnfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.goingOn_error = '';
        }
        if (!$scope.goneWrong) {
            $scope.goneWrong_error = $scope.errormessage;
            $scope.errorFlag = true;
            goneWrongfocuse = $window.document.getElementById('goneWrong');;
            goneWrongfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.goneWrong_error = '';
        }

        if ($scope.envProblemDesc == undefined && $scope.procedureProblemDesc == undefined && $scope.psychologicalProblemDesc.length == 0 && $scope.equipmentProblemDesc == undefined) {
            $scope.Investigate_error = $scope.errormessage;
            $scope.errorFlag = true;
            Psychologicalfocuse = $window.document.getElementById('envproblemid');;
            Psychologicalfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {
            $scope.Investigate_error = '';

        }



        if (($scope.envProblem == true) && (!$scope.envProblemDesc)) {
            $scope.Investigate_error1 = $scope.errormessage;
            $scope.errorFlag = true;
            proproblemboxidfocuse = $window.document.getElementById('envproblemid');;
            proproblemboxidfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.Investigate_error1 = '';
        }
        if (($scope.procedureProblem == true) && (!$scope.procedureProblemDesc)) {
            $scope.Investigate_error2 = $scope.errormessage;
            $scope.errorFlag = true;
            eqpproblemboxidfocuse = $window.document.getElementById('proproblemboxid');;
            eqpproblemboxidfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.Investigate_error2 = '';
        }
        if (($scope.equipmentProblem == true) && (!$scope.equipmentProblemDesc)) {
            $scope.Investigate_error3 = $scope.errormessage;
            $scope.errorFlag = true;
            Psychologicalfocuse = $window.document.getElementById('eqpproblemboxid');;
            Psychologicalfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.Investigate_error3 = '';
        }

        if (($scope.psychologicalProblem == true) && ($scope.psychologicalProblemDesc.length == 0)) {
            $scope.Investigate_error4 = $scope.errormessage;
            $scope.errorFlag = true;
            psyproblemboxidfocuse = $window.document.getElementById('psyproblemboxid');;
            psyproblemboxidfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.Investigate_error4 = '';
        }

        if (!$scope.nearMissSubstandardAction) {
            $scope.nearMissSubstandardAction_error = $scope.errormessage;
            $scope.errorFlag = true;
            nearMissSubstandardActionfocuse = $window.document.getElementById('nearMissSubstandardAction');;
            nearMissSubstandardActionfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.nearMissSubstandardAction_error = '';
        }
        if (!$scope.nearMissSubstandardCondition) {
            $scope.nearMissSubstandardCondition_error = $scope.errormessage;
            $scope.errorFlag = true;
            nearMissSubstandardConditionfocuse = $window.document.getElementById('nearMissSubstandardCondition');;
            nearMissSubstandardConditionfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.nearMissSubstandardCondition_error = '';
        }
        if (!$scope.nearMissCasualFactor) {
            $scope.nearMissCasualFactor_error = $scope.errormessage;
            $scope.errorFlag = true;
            nearMissCasualFactorfocuse = $window.document.getElementById('nearMissCasualFactor');;
            nearMissCasualFactorfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.nearMissCasualFactor_error = '';
        }
        if (!$scope.rootCause) {
            $scope.rootCause_error = $scope.errormessage;
            $scope.errorFlag = true;
            rootCausefocuse = $window.document.getElementById('rootCause');;
            rootCausefocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.rootCause_error = '';
        }

        if (!$scope.lessonLearnt) {
            $scope.lessonLearnt_error = $scope.errormessage;
            $scope.errorFlag = true;
            lessonLearntfocuse = $window.document.getElementById('lessonLearnt');;
            lessonLearntfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {

            $scope.lessonLearnt_error = '';
        }
        if (!$scope.correctiveAction) {
            $scope.correctiveAction_error = $scope.errormessage;
            $scope.errorFlag = true;
            correctiveActionfocuse = $window.document.getElementById('correctiveAction');;
            correctiveActionfocuse.focus();
            $scope.showvalidation();
            return false;
        } else {
            $scope.correctiveAction_error = '';

        }


        if ($scope.myFile.length > 0) {
            $scope.filemsg_error = "Please upload the selected file";
            $scope.errorFlag = true;
        }


    }




    $scope.showvalidation = function() {
        $scope.actionFormHide = false;
        $scope.errorFlag = false;
        $scope.errormessage = "This field is required"
        if ($scope.envProblemDesc == undefined && $scope.procedureProblemDesc == undefined && $scope.psychologicalProblemDesc.length == 0 && $scope.equipmentProblemDesc == undefined) {
            $scope.Investigate_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {
            $scope.Investigate_error = '';

        }
        if (!$scope.correctiveAction) {
            $scope.correctiveAction_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {
            $scope.correctiveAction_error = '';

        }
        if (!$scope.lessonLearnt) {
            $scope.lessonLearnt_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.lessonLearnt_error = '';
        }
        if (!$scope.rootCause) {
            $scope.rootCause_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.rootCause_error = '';
        }
        if (!$scope.nearMissCasualFactor) {
            $scope.nearMissCasualFactor_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.nearMissCasualFactor_error = '';
        }
        if (!$scope.nearMissSubstandardCondition) {
            $scope.nearMissSubstandardCondition_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.nearMissSubstandardCondition_error = '';
        }
        if (!$scope.nearMissSubstandardAction) {
            $scope.nearMissSubstandardAction_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.nearMissSubstandardAction_error = '';
        }
        if ($scope.myFile.length > 0) {
            $scope.filemsg_error = "Please upload the selected file";
            $scope.errorFlag = true;
        } else {
            $scope.filemsg_error = '';

        }

        if (($scope.envProblem == true) && (!$scope.envProblemDesc)) {
            $scope.Investigate_error1 = $scope.errormessage;
            $scope.errorFlag = true;

        } else {
            $scope.Investigate_error1 = '';

        }
        if (($scope.procedureProblem == true) && (!$scope.procedureProblemDesc)) {
            $scope.Investigate_error2 = $scope.errormessage;
            $scope.errorFlag = true;

        } else {
            $scope.Investigate_error2 = '';

        }
        if (($scope.equipmentProblem == true) && (!$scope.equipmentProblemDesc)) {
            $scope.Investigate_error3 = $scope.errormessage;
            $scope.errorFlag = true;

        } else {
            $scope.Investigate_error3 = '';

        }
        if (($scope.psychologicalProblem == true) && ($scope.psychologicalProblemDesc.length == 0)) {
            $scope.Investigate_error4 = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.Investigate_error4 = '';
        }
        if (!$scope.goneWrong) {
            $scope.goneWrong_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.goneWrong_error = '';
        }
        if (!$scope.goingOn) {
            $scope.goingOn_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.goingOn_error = '';
        }
        if (!$scope.whatHappened) {
            $scope.whatHappened_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.whatHappened_error = '';
        }
        if (!$scope.detailReport) {
            $scope.detailReport_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.detailReport_error = '';
        }
        if (!$scope.nearMissJobContent) {
            $scope.nearMissJobContent_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.nearMissJobContent_error = '';
        }
        if (!$scope.nearMissLocation) {
            $scope.nearMissLocation_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.nearMissLocation_error = '';
        }
        if (!$scope.nearMissCategory) {
            $scope.nearMissCategory_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.nearMissCategory_error = '';
        }
        if (!$scope.incidentDate && document.getElementById('incidentDate').value == '') {
            $scope.incidentDate_error = $scope.errormessage;
            $scope.errorFlag = true;
            $scope.incCondtn = true;
        } else {

            $scope.incidentDate_error = '';
        }
        if (!$scope.howLongDoesHeInRank) {
            $scope.howLongDoesHeInRank_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.howLongDoesHeInRank_error = '';
        }
        if (!$scope.personConcernedExperience) {
            $scope.personConcernedExperience_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.personConcernedExperience_error = '';
        }
        if (!$scope.department) {
            $scope.department_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.department_error = '';
        }
        if (!$scope.shipPosition) {
            $scope.shipPosition_error = $scope.errormessage;
            $scope.errorFlag = true;
        } else {

            $scope.shipPosition_error = '';
        }
    }




    $scope.save_validation = function() {
        $scope.errorFlag = false;
        $scope.incidentDate_error = '';
        $scope.shipPosition_error = '';
        $scope.department_error = '';
        $scope.personConcernedExperience_error = '';
        $scope.howLongDoesHeInRank_error = '';
        $scope.nearMissCategory_error = '';
        $scope.nearMissLocation_error = '';
        $scope.nearMissJobContent_error = '';
        $scope.detailReport_error = '';
        $scope.whatHappened_error = '';
        $scope.goingOn_error = '';
        $scope.goneWrong_error = '';
        $scope.healthConsequence_error = '';
        $scope.healthProbability_error = '';
        $scope.safetyConsequence_error = '';
        $scope.safetyProbability_error = '';
        $scope.enviromentConsequence_error = '';
        $scope.enviromentProbability_error = '';
        $scope.propertyConsequence_error = '';
        $scope.propertyProbability_error = '';
        $scope.reputationConsequence_error = '';
        $scope.reputationProbability_error = '';
        $scope.nearMissSubstandardAction_error = '';
        $scope.nearMissSubstandardCondition_error = '';
        $scope.nearMissCasualFactor_error = '';
        $scope.rootCause_error = '';
        $scope.lessonLearnt_error = '';
        $scope.adviseByDHead_error = '';
        $scope.adviseByCaptain_error = '';
        $scope.correctiveAction_error = '';
        $scope.actionFormHide = false;
    };
    $scope.psychologicalShowHide = function() {
        $scope.psyDiv = !$scope.psyDiv;
    }
    $scope.checkPersonConcernedName = function() {
        if ((document.getElementById('personConcernedName').value != $scope.concernedPersonTempName) && document.getElementById('personConcernedName').value != '') {
            $scope.personConcernedName_error = 'Invalid Person Concerned Name';
        } else {
            $scope.personConcernedName_error = '';
        }
        $scope.hideError('personConcernedName');
    }



    $scope.removeFile = function(index) {
        $scope.myFile.splice(index, 1);
    }

    //Remove Document
    $scope.removeDocument = function(docId) {

        $http({
            url: "/nearmiss/removeDocument/?docId=" + docId,
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            //Fetching the file data
            $http({
                method: 'POST',
                url: "/nearmiss/fetchDocuments/",
                data: {
                    "formNumber": $scope.srno
                }
            }).then(
                function(response) {
                    $scope.filesData = response.data;
                    countActiveFiles();

                });
        });
    };

    $scope.riskfactiornearmiss1 = function riskfactiornearmiss1() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("3");
                $('#fa_he_td2').val("1");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_high");
                $('#fa_health').html("High");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("3");
                $('#fa_sa_td2').val("1");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_high");
                $('#fa_safety').html("High");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("3");
                $('#fa_en_td2').val("1");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_high");
                $('#fa_environment').html("High");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("3");
                $('#fa_pr_td2').val("1");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_high");
                $('#fa_property').html("High");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("3");
                $('#fa_re_td2').val("1");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_high");
                $('#fa_reputation').html("High");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }


    $scope.riskfactiornearmiss2 = function riskfactiornearmiss2() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("3");
                $('#fa_he_td2').val("2");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_high");
                $('#fa_health').html("Very High");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("3");
                $('#fa_sa_td2').val("2");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_high");
                $('#fa_safety').html("Very High");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("3");
                $('#fa_en_td2').val("2");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_high");
                $('#fa_environment').html("Very High");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("3");
                $('#fa_pr_td2').val("2");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_high");
                $('#fa_property').html("Very High");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("3");
                $('#fa_re_td2').val("2");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_high");
                $('#fa_reputation').html("Very High");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss3 = function riskfactiornearmiss3() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("3");
                $('#fa_he_td2').val("3");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_high");
                $('#fa_health').html("Very High");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("3");
                $('#fa_sa_td2').val("3");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_high");
                $('#fa_safety').html("Very High");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("3");
                $('#fa_en_td2').val("3");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_high");
                $('#fa_environment').html("Very High");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("3");
                $('#fa_pr_td2').val("3");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_high");
                $('#fa_property').html("Very High");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("3");
                $('#fa_re_td2').val("3");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_high");
                $('#fa_reputation').html("Very High");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss4 = function riskfactiornearmiss4() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("3");
                $('#fa_he_td2').val("4");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_high");
                $('#fa_health').html("Very High");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("3");
                $('#fa_sa_td2').val("4");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_high");
                $('#fa_safety').html("Very High");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("3");
                $('#fa_en_td2').val("4");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_high");
                $('#fa_environment').html("Very High");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("3");
                $('#fa_pr_td2').val("4");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_high");
                $('#fa_property').html("Very High");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("3");
                $('#fa_re_td2').val("4");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_high");
                $('#fa_reputation').html("Very High");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss5 = function riskfactiornearmiss5() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("2");
                $('#fa_he_td2').val("1");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_low");
                $('#fa_health').html("Very Low");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("2");
                $('#fa_sa_td2').val("1");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_low");
                $('#fa_safety').html("Very Low");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("2");
                $('#fa_en_td2').val("1");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_low");
                $('#fa_environment').html("Very Low");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("2");
                $('#fa_pr_td2').val("1");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_low");
                $('#fa_property').html("Very Low");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("2");
                $('#fa_re_td2').val("1");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_low");
                $('#fa_reputation').html("Very Low");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss6 = function riskfactiornearmiss6() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("2");
                $('#fa_he_td2').val("2");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_med");
                $('#fa_health').html("Medium");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("2");
                $('#fa_sa_td2').val("2");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_med");
                $('#fa_safety').html("Medium");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("2");
                $('#fa_en_td2').val("2");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_med");
                $('#fa_environment').html("Medium");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("2");
                $('#fa_pr_td2').val("2");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_med");
                $('#fa_property').html("Medium");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("2");
                $('#fa_re_td2').val("2");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_med");
                $('#fa_reputation').html("Medium");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss7 = function riskfactiornearmiss7() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("2");
                $('#fa_he_td2').val("3");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_high");
                $('#fa_health').html("High");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("2");
                $('#fa_sa_td2').val("3");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_high");
                $('#fa_safety').html("High");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("2");
                $('#fa_en_td2').val("3");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_high");
                $('#fa_environment').html("High");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("2");
                $('#fa_pr_td2').val("3");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_high");
                $('#fa_property').html("High");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("2");
                $('#fa_re_td2').val("3");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_high");
                $('#fa_reputation').html("High");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }


    $scope.riskfactiornearmiss8 = function riskfactiornearmiss8() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("2");
                $('#fa_he_td2').val("4");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_high");
                $('#fa_health').html("Very High");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("2");
                $('#fa_sa_td2').val("4");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_high");
                $('#fa_safety').html("Very High");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("2");
                $('#fa_en_td2').val("4");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_high");
                $('#fa_environment').html("Very High");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("2");
                $('#fa_pr_td2').val("4");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_high");
                $('#fa_property').html("Very High");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("2");
                $('#fa_re_td2').val("4");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_high");
                $('#fa_reputation').html("Very High");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss9 = function riskfactiornearmiss9() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("1");
                $('#fa_he_td2').val("1");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_low");
                $('#fa_health').html("Very Low");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("1");
                $('#fa_sa_td2').val("1");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_low");
                $('#fa_safety').html("Very Low");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("1");
                $('#fa_en_td2').val("1");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_low");
                $('#fa_environment').html("Very Low");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("1");
                $('#fa_pr_td2').val("1");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_low");
                $('#fa_property').html("Very Low");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("1");
                $('#fa_re_td2').val("1");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_low");
                $('#fa_reputation').html("Very Low");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss10 = function riskfactiornearmiss10() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("1");
                $('#fa_he_td2').val("2");
                $('#fa_health').removeClass("matrix_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_v_low");
                $('#fa_health').html("Very Low");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("1");
                $('#fa_sa_td2').val("2");
                $('#fa_safety').removeClass("matrix_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_v_low");
                $('#fa_safety').html("Very Low");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("1");
                $('#fa_en_td2').val("2");
                $('#fa_environment').removeClass("matrix_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_v_low");
                $('#fa_environment').html("Very Low");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("1");
                $('#fa_pr_td2').val("2");
                $('#fa_property').removeClass("matrix_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_v_low");
                $('#fa_property').html("Very Low");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("1");
                $('#fa_re_td2').val("2");
                $('#fa_reputation').removeClass("matrix_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_v_low");
                $('#fa_reputation').html("Very Low");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss11 = function riskfactiornearmiss11() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("1");
                $('#fa_he_td2').val("3");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_low");
                $('#fa_health').html("Low");
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("1");
                $('#fa_sa_td2').val("3");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_low");
                $('#fa_safety').html("Low");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("1");
                $('#fa_en_td2').val("3");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_low");
                $('#fa_environment').html("Low");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("1");
                $('#fa_pr_td2').val("3");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_low");
                $('#fa_property').html("Low");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("1");
                $('#fa_re_td2').val("3");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_low");
                $('#fa_reputation').html("Low");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }

    $scope.riskfactiornearmiss12 = function riskfactiornearmiss12() {
        if ($('#healthcheck').prop("checked") == true || $('#safetycheck').prop("checked") == true ||
            $('#environmentcheck').prop("checked") == true || $('#propertycheck').prop("checked") == true ||
            $('#reputationcheck').prop("checked") == true) {
            if ($('#healthcheck').prop("checked") == true) {
                $('#fa_he_td1').val("1");
                $('#fa_he_td2').val("4");
                $('#fa_health').removeClass("matrix_v_low");
                $('#fa_health').removeClass("matrix_med");
                $('#fa_health').removeClass("matrix_high");
                $('#fa_health').removeClass("matrix_v_high");
                $('#fa_health').removeClass("matrix_na");
                $('#fa_health').addClass("matrix_low");
                $('#fa_health').html("Low");
                $('#healthcheck') == false;
                $('#healthcheck').prop("checked", false);
            }
            if ($('#safetycheck').prop("checked") == true) {
                $('#fa_sa_td1').val("1");
                $('#fa_sa_td2').val("4");
                $('#fa_safety').removeClass("matrix_v_low");
                $('#fa_safety').removeClass("matrix_med");
                $('#fa_safety').removeClass("matrix_high");
                $('#fa_safety').removeClass("matrix_v_high");
                $('#fa_safety').removeClass("matrix_na");
                $('#fa_safety').addClass("matrix_low");
                $('#fa_safety').html("Low");
                $('#safetycheck').prop("checked", false);
            }
            if ($('#environmentcheck').prop("checked") == true) {
                $('#fa_en_td1').val("1");
                $('#fa_en_td2').val("4");
                $('#fa_environment').removeClass("matrix_v_low");
                $('#fa_environment').removeClass("matrix_med");
                $('#fa_environment').removeClass("matrix_high");
                $('#fa_environment').removeClass("matrix_v_high");
                $('#fa_environment').removeClass("matrix_na");
                $('#fa_environment').addClass("matrix_low");
                $('#fa_environment').html("Low");
                $('#environmentcheck').prop("checked", false);
            }
            if ($('#propertycheck').prop("checked") == true) {
                $('#fa_pr_td1').val("1");
                $('#fa_pr_td2').val("4");
                $('#fa_property').removeClass("matrix_v_low");
                $('#fa_property').removeClass("matrix_med");
                $('#fa_property').removeClass("matrix_high");
                $('#fa_property').removeClass("matrix_v_high");
                $('#fa_property').removeClass("matrix_na");
                $('#fa_property').addClass("matrix_low");
                $('#fa_property').html("Low");
                $('#propertycheck').prop("checked", false);
            }
            if ($('#reputationcheck').prop("checked") == true) {
                $('#fa_re_td1').val("1");
                $('#fa_re_td2').val("4");
                $('#fa_reputation').removeClass("matrix_v_low");
                $('#fa_reputation').removeClass("matrix_med");
                $('#fa_reputation').removeClass("matrix_high");
                $('#fa_reputation').removeClass("matrix_v_high");
                $('#fa_reputation').removeClass("matrix_na");
                $('#fa_reputation').addClass("matrix_low");
                $('#fa_reputation').html("Low");
                $('#reputationcheck').prop("checked", false);
            }
        } else {
            $scope.matrixDialog.open();
        }
    }
    $scope.guidanceSheet = function() {
        window.open('#/NearmissGuidance', '_blank');
    }

   
    $scope.saveAsPDFDocument = function() {
        $rootScope.showScreenOverlay = true;
        compositeData = {
            "nrmid": $scope.srno,
            'reportdate': new Date($scope.reportDate).toISOString(),
            'timeoffset': new Date().getTimezoneOffset()
        }
        $http({
            method: 'POST',
            url: "/near-miss-form-save-as-pdf/",
            responseType: 'arraybuffer',
            data: compositeData
        }).then(
            function(response) {
                if (response.incidentDate != null) {
                    var incidentDate = new Date(response.incidentDate);
                    var ampm = (incidentDate.getUTCHours() >= 12) ? "PM" : "AM";
                    var hours = (incidentDate.getUTCHours() > 12) ? (incidentDate.getUTCHours() - 12) : (incidentDate.getUTCHours());
                    $scope.incidentDate = ((incidentDate.getUTCMonth() + 1) + "/" + incidentDate.getUTCDate() + "/" + incidentDate.getUTCFullYear() + " " + hours + ":" + incidentDate.getUTCMinutes() + " " + ampm);
                }
                var myBlob = new Blob([response.data], {
                    type: "application/pdf"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.shipName + "-" + "NearMiss" + "-" +$scope.nmrfid;
                anchor.href = blobURL;
                anchor.click();
                $rootScope.showScreenOverlay = false;
            });
    };

    $scope.exportexcel = function() {
        $rootScope.showScreenOverlay = true;
        compositeData = {
            "nrmid": $scope.srno,
            'reportdate': new Date($scope.reportDate).toISOString(),
            "timeoffset": new Date().getTimezoneOffset(),
        }
        $http({
            method: 'POST',
            url: "/Nearmiss_export_excel/",
            responseType: 'arraybuffer',
            data: compositeData
        }).then(
            function(response) {
                if (response.incidentDate != null) {
                    var incidentDate = new Date(response.incidentDate);
                    var ampm = (incidentDate.getUTCHours() >= 12) ? "PM" : "AM";
                    var hours = (incidentDate.getUTCHours() > 12) ? (incidentDate.getUTCHours() - 12) : (incidentDate.getUTCHours());
                    $scope.incidentDate = ((incidentDate.getUTCMonth() + 1) + "/" + incidentDate.getUTCDate() + "/" + incidentDate.getUTCFullYear() + " " + hours + ":" + incidentDate.getUTCMinutes() + " " + ampm);
                }
                var myBlob = new Blob([response.data], {
                    type: "application/vnd.ms-excel"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.shipName + "-" + "NearmissReport" + "-" + $scope.srno + ".xls";
                anchor.href = blobURL;
                anchor.click();
                $rootScope.showScreenOverlay = false;
            });
    };

});