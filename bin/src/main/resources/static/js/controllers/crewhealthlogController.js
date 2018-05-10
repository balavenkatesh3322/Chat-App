app.controller('CHLController', function(Connectivity, $anchorScroll, toaster, $scope, $http, $window, $location, $filter, $timeout, $routeParams, $rootScope) {

    var chid = $routeParams.id;

    $scope.geterrorstatuscode = "0";
    $scope.txtheightunit = 'Mtr';
    $scope.txtweightunit = 'Kgs';
    $scope.remarks = "";
    $scope.enablePDF = "";

    $scope.showReassignModal = function(targetName) {
        $scope.remarks = "";
        angular.element(targetName).modal('show');
    }

    function openAccordian() {
        var alphabets = ['c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

        for (i = 0; i < alphabets.length; i++) {
            var str = '#safety_' + alphabets[i];
            angular.element(str).collapse('show');

            if ($('.header_collapse i').is('.fa-chevron-right')) {
                $('.header_collapse i').addClass('fa-chevron-down');
                $('.header_collapse i').removeClass('fa-chevron-right');
            }
        }
    }
    $scope.okAction = function(targetName) {
        $rootScope.showScreenOverlay = true;
        if ($scope.remarks !== '' && $scope.remarks !== undefined) {
            $scope.saveCrewHealthLog('reassign');
            $scope.reassignRemarks_error = "";
            angular.element(targetName).modal('hide');
        } else {
            $scope.reassignRemarks_error = "This field is required.";
        }
        $rootScope.showScreenOverlay = false;
    }

    $scope.previewFileName = "";

    $scope.previewObj = {
        "title": $scope.previewFileName
    }

    $scope.max200Length = 200;
    $scope.max500Length = 500;

    /************** TO PREVIEW FILE *********************/
    $scope.previewFile = function(docid, docName) {
        $rootScope.showScreenOverlay = true;
        $http.get('/crewhealth/downloadDocument/?docId=' + docid, {
                responseType: 'blob'
            })
            .then(function(response) {
                $rootScope.showScreenOverlay = false;
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
                    $scope.previewObj = {
                        "title": $scope.previewFileName
                    }
                    $scope.previewDialog.open();
                });
            });
        $rootScope.showScreenOverlay = false;
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
        $scope.confirmDeleteCrewHealthDialog.close();
    });

    $scope.actions = [{
        text: 'Ok'
    }];

    $scope.errorActions = [{
        text: 'Ok',
        action: function() {
            $scope.geterrorstatuscode = "0";
        }
    }];

    $scope.exceededFileCountDialogMsg = "You cannot attach more than 3 files. Remove a file, then try.";
    $scope.deleteDialogMsg = "You sure, that you want to delete this?";
    $scope.deleteActions = [{
        text: 'Yes',
        action: removeDocument
    }, {
        text: 'No'
    }];

    // remove the row specified in index
    $scope.RemoveCrewHealth = function(index) {
        $scope.delIndex = index;
        $scope.confirmDeleteCrewHealthDialog.open();
    };


    $scope.deleteCrewHealthActions = [
    	{
            text: 'Yes',
            action: removeCrewHealth
        }, {
            text: 'No'
        }
    ];

    function removeCrewHealth() {
    	if($scope.mode === undefined || $scope.mode === ""){
    		$scope.Save = "Save";
            $scope.existingReportData[$scope.delIndex].deleteFlag = "D";
            if ($scope.existingReportData.length === 0) {
                $scope.existingReportData = [];
            }
    	}else{
    		toaster.info({
                title: "Information",
                body: "Records in edit mode can not be deleted ! "
            });
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

    $scope.actions = [{
        text: 'Ok'
    }];

    /*******************************************************************/
    Connectivity.IsOk().then(function(response) {
        $rootScope.showScreenOverlay = true;
        $http({
            method: 'POST',
            url: "/get-crew-health-initial-load-data/",
            data: {
                "chlid": chid
            }
        }).then(
            function(response) {
                $rootScope.showScreenOverlay = false;
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {

                    $scope.filesData = response.data.data[0].formsDoc;
                    countActiveFiles();

                    // Form Number
                    var formMasterData = response.data.data[0].formMasterData[0];
                    $scope.actFormno = formMasterData.actFormno;
                    $scope.actRevno = formMasterData.actRevno;
                    $scope.formatedDate = formMasterData.dateFormat;
                    $scope.reviseddate = formMasterData.reviseddate;

                    var btnActions = response.data.data[0].buttonActionsData;
                    $scope.allRanks = response.data.data[0].allRanksData;
                    if (btnActions[0] != undefined) {
                        $scope.actionRight = btnActions[0][0];
                        $scope.permitRight = btnActions[0][1];
                        $scope.stageId = btnActions[0][2];
                        if (btnActions[0][3] != undefined) {
                            $scope.isReassign = btnActions[0][3];
                        }
                        $scope.deleteAction = btnActions[1];
                    }

                    $scope.wrkflowstatus = response.data.data[0].crewHealthLogWorkFlowHistData;

                    if ($scope.wrkflowstatus.length > 0) {
                        $scope.displayShipWorkflow = true;
                    }


                    // Get Urinalysis Details
                    $scope.diseasedetails = response.data.data[0].urinalysisMasterData;
                    $scope.systalicMaster = response.data.data[0].systalic;
                    $scope.diastalicMaster = response.data.data[0].diastolic;
                    $scope.bpCategoryMaster = response.data.data[0].bpcategory;

                    // Get Rank
                    $scope.rankdetails = response.data.data[0].rankMasterData;
                    $scope.allRankdetails = response.data.data[0].allRanksData;


                    var crewHealthMasterData = response.data.data[0].crewHealthMasterData;
                    $scope.maxFileCount = crewHealthMasterData.maxFileCount;
                    $scope.enablePDF = crewHealthMasterData.active_status;
                    $scope.mastercode = crewHealthMasterData.mastercode;
                    $scope.vslname = crewHealthMasterData.vesselname;
                    $scope.vesselCode = crewHealthMasterData.vesselcode;
                    $scope.nameOfMaster = crewHealthMasterData.mastername;
                    $scope.medicals = crewHealthMasterData.medoffcode;
                    $scope.activeStatus = crewHealthMasterData.active_status;
                    $scope.chlid = crewHealthMasterData.chid;
                    $scope.chiefEng = crewHealthMasterData.chiefEngName;
                    $scope.chlrfid = crewHealthMasterData.chrfid;
                    $scope.chiefEngCode = crewHealthMasterData.chiefEng;
                    $scope.maxFileSize = crewHealthMasterData.maxFileSize;
                    $scope.dateFormat = crewHealthMasterData.dateFormat;
                    $scope.activeStatus = crewHealthMasterData.active_status;
                    if (crewHealthMasterData.chldate != null) {
                        $scope.tddate = crewHealthMasterData.chldate;
                    } else {
                        $scope.tddate = new Date();
                    }
                    $scope.cruser = crewHealthMasterData.cruser,
                        $scope.formstatus = crewHealthMasterData.formstatus
                    if (crewHealthMasterData.formstatus == 'SUB') {
                        $scope.subDisabled = true;
                    }
                    $http({
                        method: 'GET',
                        url: "/Get-rankNamedetails/?rankcode=" + $scope.medicals
                    }).then(function successCallback(response) {
                        $scope.txtmedname = response.data[0];
                    });
                    $scope.existingReportData = response.data.data[0].crewHealthDetailData;
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

    /***************** ATTACHMENTS **************************/

    function countActiveFiles() {
        $scope.activeFileCount = 0;
        for (i = 0; i < $scope.filesData.length; i++) {
            if ($scope.filesData[i].docstatus === 'A') {
                $scope.activeFileCount++;
            }
        }
    }


    function thowsUnsupportedFileError(filename) {
        $scope.fileSizeExceededDialogMsg = filename + " is not supported format. Unable to upload.";
        $scope.exceededFileSizedialog.open();
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
        filesformdata.append("formNumber", $scope.chlid);
        filesformdata.append("mdlCode", "CHL");
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
            url: '/crewhealth/uploadDocuments/',
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
                        url: "/crewhealth/fetchDocuments/",
                        data: {
                            "formNumber": $scope.chlid
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

    /*  $scope.uploadFile = function() {
      	$rootScope.showScreenOverlay = true;
          var file = $scope.myFile;

          if ($scope.myFile.length + $scope.activeFileCount > $scope.maxFileCount) {
              $scope.exceededFileCountDialog.open();
              if ($scope.filesData.length>$scope.maxFileCount) {
                  $scope.myFile=[];
                }
              return;
          }

          for (i = 0; i < $scope.myFile.length; i++) {
          	if (($scope.myFile[i]._file.name).split('.')[1]=='sql'){
          		thowsUnsupportedFileError($scope.myFile[i]._file.name);
          	}
              if ($scope.myFile[i]._file.size <= 1048576 * $scope.maxFileSize) {
                  var filesformdata = new FormData();
                  filesformdata.append('file', $scope.myFile[i]._file);
                  filesformdata.append("formNumber", $scope.chlid);
                  filesformdata.append("mdlCode", "CHL");
                  filesformdata.append("attachmentTypeFolder", "Form Attachments");
                  $scope.hideFilesFlag = false;
                  $scope.isuploading = true;
                  var request = {
                      method: 'POST',
                      url: '/crewhealth/uploadDocuments/',
                      data: filesformdata,
                      headers: {
                          'Content-Type': undefined
                      }
                  };

                  // SEND THE FILES.
                  $http(request)
                      .then(function(d) {
                          $http({
                              method: 'POST',
                              url: "/crewhealth/fetchDocuments/",
                              data: $scope.chlid
                          }).then(
                              function(response) {
                              	$rootScope.showScreenOverlay = false;
                                  $scope.filesData = response.data;
                                  countActiveFiles();
                                  $scope.isuploading = false;
                              });
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
            url: "/crewhealth/removeDocument/?docId=" + $scope.deleteDocId + "&formId=" + $scope.chlid,
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            $scope.geterrormessages = response.data.message;
            $scope.geterrorstatus = response.data.errorstatus;
            $scope.geterrorstatuscode = response.data.status;
            $scope.dataerror = response.data.message;
            if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                $http({
                    method: 'POST',
                    url: "/crewhealth/fetchDocuments/",
                    data: {
                        "formNumber": $scope.chlid
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
                $rootScope.showScreenOverlay = false;
            } else {
                $rootScope.showScreenOverlay = false;
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                $scope.dataerror = [response.data.message[0]];
            }
        });
    };


    /***********************************************************/


    $scope.hidebody = true;
    $scope.haspermission = false;
    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }

    $scope.Addbutton = true;
    $scope.Updatebutton = false;


    $scope.errorFlag = false;
    $scope.msgclear = true;
    var setSessionValues = function() {
        $scope.date = new Date();
        $scope.tddate = new Date();
        $scope.shouldShow = false;
        $scope.shouldShow2 = true;
        $scope.subDisabled = false;
        $scope.color = "";
        $scope.Save = "Save";
        $scope.year = new Date().getFullYear()
    }
    setSessionValues();

    $scope.existingReportData = [];
    $scope.noOfDeficiencies = 0;
    $scope.deleteList = [];

    // Get RankName details
    $scope.fetchName = function() {
        $rootScope.showScreenOverlay = true;
        $http({
            method: 'GET',
            url: "/Get-rankNamedetails/?rankcode=" + $scope.ranks
        }).then(function successCallback(response) {
            $rootScope.showScreenOverlay = false;
            $scope.txtrankname = response.data[0];
            $http({
                method: 'GET',
                url: "/Get-rankNationalitydetails/?rankcode=" + $scope.ranks
            }).then(function successCallback(response) {
            	console.log(response, 'et-rankNationalitydeta ?????????? ')
                $scope.txtage = response.data[0][0];
                $scope.radsex = response.data[0][2];
                $scope.txtnamecode = response.data[0][3];
                $scope.txtnation = response.data[0][5];
                $scope.txtnationCode = response.data[0][1];
            });
        });
        $rootScope.showScreenOverlay = false;
    };


    // Get Medical details
    $scope.fetchMedical = function() {
        $rootScope.showScreenOverlay = true;
        $http({
            method: 'GET',
            url: "/Get-rankNamedetails/?rankcode=" + $scope.medicals
        }).then(function successCallback(response) {
            $rootScope.showScreenOverlay = false;
            $scope.txtmedname = response.data;
            $http({
                method: 'GET',
                url: "/Get-medicaldetails/?rankcode=" + $scope.medicals
            }).then(function successCallback(response) {
                $scope.txtmedcode = response.data[0][3];
                $scope.txtmedname = response.data[0][4];
            });
            $rootScope.showScreenOverlay = false;
        });
    };


    $scope.addTables = function(buttontype) {
    	console.log('inside add table buttons ????????????? ')
        $scope.validation();
    	console.log($scope.errorFlag, '$scope.errorFlag ????????????? ')
        if ($scope.errorFlag) {
        	$scope.alreadyRankExist = false;
        	if (buttontype == 'Add') {                
            	for(var i = 0 ; i < $scope.existingReportData.length ; i++){
            		$scope.checkRankCode = $scope.existingReportData[i].rankcode;
            		console.log($scope.checkRankCode === $scope.ranks && $scope.existingReportData[i].deleteFlag != 'D' , 'Check valid ???????????????????')
            		if($scope.checkRankCode === $scope.ranks && $scope.existingReportData[i].deleteFlag != 'D'){
            			$scope.alreadyRankExist = true;
            		}
            	}
            } else {
                $scope.Addbutton = true;
                $scope.Updatebutton = false;
            }
        	
        	
        	console.log($scope.alreadyRankExist , '$scope.alreadyRankExist ??????????????????? ')
        	if($scope.alreadyRankExist === false){
        		$scope.Addbutton = false;
                $scope.Updatebutton = true;
        		console.log('inside if add tabeele s @@@@@@@@@@@@@@@@')
        		$rootScope.showScreenOverlay = true;
                var txtranknamenew;
                var urianalysisname;
                
                // To Add RankName in to the Grid
                angular.forEach($scope.allRankdetails, function(value, key) {
                    if (value.rankcode == $scope.ranks) {
                        txtranknamenew = value.rankname;
                        //						  break;
                    }
                });

                // To Add Disease Description into the Grid
                angular.forEach($scope.diseasedetails, function(value, key) {
                    if (value.urinalysiscode == $scope.urinals) {
                        urianalysisname = value.urinalysisdesc;
                        //						  break;
                    }
                });

                if($scope.chid === undefined || $scope.chid === ''){
                	$scope.chid= $scope.chlid;
                }

                console.log($scope.txtnamecode ,'$scope.txtnamecode ?????@@@@@@@@@@@@@@@ ')
                
                formData = {
                    "rankcode": $scope.ranks,
                    "rankname": txtranknamenew,
                    "namedtl": $scope.txtrankname,
                    "namecode": $scope.txtnamecode,
                    "age": $scope.txtage,
                    "nationality": $scope.txtnationCode,
                    "countryName": $scope.txtnation,
                    "gender": $scope.radsex,
                    "height": $scope.txtheight,
                    "weight": $scope.txtweight,
                    "bmindex": $scope.txtBmIndex,
                    "bmicondition": $scope.txtBmicndn,
                    "bmicndncolor": $scope.txtBmicndncolor,
                    "pulserate": $scope.txtpulserate,
                    "urinalysisdesc": urianalysisname,
                    "urianalysis": $scope.urinals,
                    "bpsystolic": $scope.txtsytlc,
                    "bpdiastolic": $scope.txtdistlc,
                    "bplevelsecurity": $scope.txtbplvl,
                    "bplevelcolor": $scope.txtbplvlcolor,
                    "neck": $scope.txtneck,
                    "waist": $scope.txtwaist,
                    "bodyfat": $scope.txtbodyfat,
                    "bodyfateval": $scope.txtbodyfatevln,
                    "bdyfatevalcolor": $scope.txtbodyfatevlncolor,
                    "targetbmi": $scope.txtBmi,
                    "targetperiod": $scope.txtperiod,
                    "hunit": $scope.txtheightunit,
                    "wunit": $scope.txtweightunit,
                    'chldetid': '',
                    'chid': $scope.chid,
                }
                
                if ($scope.txtindex > -1) {
                    $scope.existingReportData[$scope.txtindex] = formData;
                } else {
                    $scope.existingReportData.push(formData);
                }
                $scope.resetInputField();
                $rootScope.showScreenOverlay = false;
                $scope.alreadyRankExist = false;
        	}else{
        		console.log('inside else add tabeele s @@@@@@@@@@@@@@@@')
        		 $rootScope.showScreenOverlay = false;
        		 toaster.info({
                     title: "Information",
                     body: 'Rank already exist in the table !'
                 });
        	}
            
        }
    }


    $scope.resetInputField = function() {
        $scope.Addbutton = true;
        $scope.Updatebutton = false;
        $scope.mode="";
        $scope.ranks = "",
        $scope.txtrankname = "";
        $scope.txtage = "";
        $scope.txtnation = "";
        $scope.txtnationCode = "";
        $scope.radsex = "";
        $scope.txtheight = "";
        $scope.txtweight = "";
        $scope.txtBmIndex = "";
        $scope.txtBmicndn = "";
        $scope.txtpulserate = "";
        $scope.urinals = "";
        $scope.txtsytlc = "";
        $scope.txtdistlc = "";
        $scope.txtbplvl = "";
        $scope.txtneck = "";
        $scope.txtwaist = "";
        $scope.txtbodyfat = "";
        $scope.txtbodyfatevln = "";
        $scope.txtBmi = "";
        $scope.txtperiod = "";
        $scope.txtBmicndncolor = "white";
        $scope.txtbplvlcolor = "white";
        $scope.txtbodyfatevlncolor = "white";
        $scope.txtindex = "-1";
        $scope.txtheightunit = "";
        $scope.txtweightunit = "";
        $scope.chldetid = "";
        $scope.chid = "";
        resetErrors();
    }
    $scope.addCrewHealthError = false;
    $scope.rowExistDis = true;
    function validateCrewHealthLogEntries() {
        $rootScope.showScreenOverlay = true;
        $rootScope.showScreenOverlay = false;
        var raiseErrorFlag = false;
        if($scope.existingReportData.length > 0){
            for (i = 0; i < $scope.existingReportData.length; i++) {
                var userData = $scope.existingReportData[i];
                if (userData.deleteFlag != 'D') {
                	$scope.rowExist = "exist";
                    if (!userData.urinalysisdesc) {
                        raiseErrorFlag = true;
                    }

                    if (!userData.urianalysis) {
                        raiseErrorFlag = true;
                    }

                    if (!userData.bplevelsecurity) {
                        raiseErrorFlag = true;
                    }

                    if (!userData.bodyfat) {
                        raiseErrorFlag = true;
                    }

                    if (!userData.bodyfateval) {
                        raiseErrorFlag = true;
                    }
                }               
                $rootScope.showScreenOverlay = false;
            }
            
            if($scope.rowExist === undefined || $scope.rowExist === ''){
            	raiseErrorFlag = true;
            	$scope.rowExistDis = false;
            	$scope.Updatebutton = true;
            }else{
            	$scope.rowExistDis = true;
            	$scope.Updatebutton = false;
            }
            
        }else{
        	$rootScope.showScreenOverlay = false;
        	toaster.error({
                title: "Information",
                body: "Data couldn't be sent. Add atleast one record in the table"
            });
        	raiseErrorFlag = true;
        }

        return raiseErrorFlag;
    }


    // save crew Health Log
    $scope.saveCrewHealthLog = function(type) {
        var formstatus = "INP";
        $scope.displayShipWorkflow = true;
        $scope.actionFormHide = false;
        $scope.addCrewHealthError = false;


        if (type == 'submit' || type == 'approve') {
            if (validateCrewHealthLogEntries() === false) {
                $scope.addCrewHealthError = false;
                formstatus = (type === 'submit' ? "SUB" : "APR");
                $scope.subDisabled = true;
            } else {
            	if($scope.rowExist === undefined || $scope.rowExist === ''){
                	toaster.error({
                        title: "Information",
                        body: "Data couldn't be sent. Add atleast one record in the table"
                    });
                	raiseErrorFlag = true;
                }else{
                	toaster.error({
                        title: "Information",
                        body: "Data couldn't be sent. Populate all the fields for all the ranks."
                    });
                    $scope.addCrewHealthError = true;
                }                
                return;
            }

            if (type == 'approve') {
                $scope.activeStatus = 'APR';
            }
        }


        if (type == 'reassign') {
            formstatus = "RSN";
        }

        form_data = {
            'chid': $scope.chlid,
            'vesselcode': $scope.vesselCode,
            'chldate': new Date($scope.tddate).toISOString(),
            'medoffcode': $scope.medicals,
            'medempcode': $scope.txtmedcode,
            'mastercode': $scope.mastercode,
            'formnumber': $scope.actFormno,
            'revnumber': $scope.actRevno,
            'revdate': $scope.reviseddate,
            'active_status': formstatus,
            'cruser': $scope.cruser,
            'chiefEng': $scope.chiefEngCode,
            "offset": new Date().getTimezoneOffset(),
            'chrfid': $scope.chlrfid,
        };
        crewhealthdetails = $scope.existingReportData;

        // Storing Crew Health Workflows History
        var crewHealthWorkFlowHistoryData = {
            "formstatus": formstatus,
            "remarks": $scope.remarks
        }

        Connectivity.IsOk().then(function(response) {
            $rootScope.showScreenOverlay = true;
            $http({
                    url: "/Save-CrewHealth/",
                    dataType: 'json',
                    method: 'POST',
                    data: {
                        crewhealthMaster: form_data,
                        crewhealthdetail: crewhealthdetails,
                        stageid: $scope.stageId,
                        chlWfHistory: crewHealthWorkFlowHistoryData
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

                    if (response.data.data[0].refId.length > 0) {
                        $scope.chlrfid = response.data.data[0].refId;
                    }
                    $scope.existingReportData = [];
                    $scope.existingReportData = response.data.data[0].crewHealthDetailData;

                    if (response.data.status == 0 && response.data.length != 0) {

                        toaster.success({
                            title: "Information",
                            body: response.data.successMessage
                        });

                        if (type != 'save') {
                            $scope.actionFormHide = true;
                        }

                    } else {
                        $scope.errordetails = response.data.exceptionDetail;
                        $scope.showexception = response.data.showerrormessage
                        $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                        $scope.dataerror = [response.data.message[0]];
                    }

                    $http({
                        method: 'POST',
                        url: "/get-crewhealth-workflow-history/",
                        data: {
                            "chlid": $scope.chlid
                        }
                    }).then(
                        function(response) {
                            $scope.wrkflowstatus = response.data;
                        });

                    $scope.addCrewHealthError = false;
                    resetErrors();
                    $rootScope.showScreenOverlay = false;
                }),
                function errorCallback(response) {
                    $scope.dataSaveStatus = "Data couldn't be sent. Please enter the required fields";
                };
        }, function(error) {
            $scope.dialog.open();
            $scope.dataerror = "Server not reached";
        });
    };


    $scope.mode="";
    // Edit Module Creation
    $scope.CrewHealthEdit = function(index) {
        resetErrors();
        $scope.mode="edit";
        $rootScope.showScreenOverlay = true;
        $scope.Save = "Update";
        $scope.Addbutton = false;
        $scope.Updatebutton = true;
        $scope.txtindex = index;
        $scope.ranks = $scope.existingReportData[index].rankcode,
            $scope.chldetid = $scope.existingReportData[index].chldetid,
            $scope.chid = $scope.existingReportData[index].chid,
            $scope.txtnamecode = $scope.existingReportData[index].namecode,
            $scope.txtrankname = $scope.existingReportData[index].namedtl,
            $scope.txtage = $scope.existingReportData[index].age,
            $scope.txtnationCode = $scope.existingReportData[index].nationality,
            $scope.txtnation = $scope.existingReportData[index].countryName,
            $scope.radsex = $scope.existingReportData[index].gender,
            $scope.txtheight = parseInt($scope.existingReportData[index].height),
            $scope.txtweight = parseInt($scope.existingReportData[index].weight),
            $scope.txtBmIndex = $scope.existingReportData[index].bmindex,
            $scope.txtBmicndn = $scope.existingReportData[index].bmicondition,
            $scope.txtBmicndncolor = $scope.existingReportData[index].bmicndncolor,
            $scope.txtpulserate = $scope.existingReportData[index].pulserate,
            $scope.urinals = $scope.existingReportData[index].urianalysis,
            $scope.txtsytlc = $scope.existingReportData[index].bpsystolic,
            $scope.txtdistlc = $scope.existingReportData[index].bpdiastolic,
            $scope.txtbplvl = $scope.existingReportData[index].bplevelsecurity,
            $scope.txtbplvlcolor = $scope.existingReportData[index].bplevelcolor,
            $scope.txtneck = $scope.existingReportData[index].neck,
            $scope.txtwaist = $scope.existingReportData[index].waist,
            $scope.txtbodyfat = $scope.existingReportData[index].bodyfat,
            $scope.txtbodyfatevln = $scope.existingReportData[index].bodyfateval,
            $scope.txtbodyfatevlncolor = $scope.existingReportData[index].bdyfatevalcolor,
            $scope.txtBmi = $scope.existingReportData[index].targetbmi,
            $scope.txtperiod = $scope.existingReportData[index].targetperiod,
            $scope.txtheightunit = $scope.existingReportData[index].hunit,
            $scope.txtweightunit = $scope.existingReportData[index].wunit,
            $scope.shouldShow1 = true;
        $scope.shouldShow2 = false;
        $http({
            method: 'POST',
            url: "/get-crew-bmi-condition-exist/",
            data: {
                "nationality": $scope.txtnationCode
            }
        }).then(function(response) {
            $rootScope.showScreenOverlay = false;
            $scope.geterrormessages = response.data.message;
            $scope.geterrorstatus = response.data.errorstatus;
            $scope.geterrorstatuscode = response.data.status;
            $scope.dataerror = response.data.message;
            if (response.data.status === -1 && response.data.errorstatus === "SV") {
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.dataerror = [response.data.message[0]];
            } else if (response.data.status === -1 && response.data.errorstatus === "EX") {
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                $scope.dataerror = [response.data.message[0]];
            }
        });
    }


    // Delete Form Moduele Creation
    $scope.updateCrewHealth = function() {
        var result = confirm("Are you sure to delete ? ");
        if (result) {
            form_data = {
                'chid': $scope.chlid,
                'vesselcode': $scope.vesselCode,
                'chiefEng': $scope.chiefEngCode,
                'ranks': $scope.rankcode,
                'namecode': $scope.txtrankname,
                'age': $scope.txtage,
                'nationality': $scope.txtnationCode,
                'gender': $scope.radsex,
                'height': $scope.txtheight,
                'weight': $scope.txtweight,
                'bmindex': $scope.txtBmIndex,
                'bmicondition': $scope.txtBmicndn,
                'bmicndncolor': $scope.txtBmicndncolor,
                'pulserate': $scope.txtpulserate,
                'urianalysis': $scope.urinals,
                'bpsystolic': $scope.txtsytlc,
                'bpdiastolic': $scope.txtdistlc,
                'bplevelsecurity': $scope.txtbplvl,
                'bplevelcolor': $scope.txtbplvlcolor,
                'neck': $scope.txtneck,
                'waist': $scope.txtwaist,
                'bodyfat': $scope.txtbodyfat,
                'bodyfateval': $scope.txtbodyfatevln,
                'bdyfatevalcolor': $scope.txtbodyfatevlncolor,
                'targetbmi': $scope.txtBmi,
                'targetperiod': $scope.txtperiod,
                "hunit": $scope.txtheightunit,
                "wunit": $scope.txtweightunit
            }
            $rootScope.showScreenOverlay = true;
            $http({
                url: "/delete_CrewHealthLog/",
                dataType: 'json',
                method: 'POST',
                data: form_data,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(response) {
                $rootScope.showScreenOverlay = false;
            });
        }
    }


    // get_bplvlseverity details
    $scope.calculateBPM = function(model) {
        $rootScope.showScreenOverlay = true;
        $rootScope.showScreenOverlay = false;
        if ($scope.txtdistlc == undefined || $scope.txtsytlc == undefined) {
            if ($scope.txtdistlc == undefined && model == 'diastolic') {
                $scope.IndexDias_error = 'Invalid Diastolic Value';
                $scope.txtdistlc = "";
            }
            if ($scope.txtsytlc == undefined && model == 'systolic') {
                $scope.IndexSys_error = 'Invalid Systolic Value';
                $scope.txtsytlc = "";
            }

        } else {
            if ($scope.txtsytlc != '' && $scope.txtdistlc != '') {
                $scope.IndexSys_error = '';
                $scope.IndexDias_error = '';
                if (!$scope.txtbplvl) {
                    $scope.IndexBplvl_error = 'Invalid Systolic and Diastolic';
                    $scope.errorFlag = false;
                }
                var systalicValue;
                var diastalicValue;
                for (var i = 0; i < $scope.systalicMaster.length; i++) {
                    if ($scope.systalicMaster[i].startsystolic <= $scope.txtsytlc && $scope.systalicMaster[i].endsystolic >= $scope.txtsytlc) {
                        systalicValue = $scope.systalicMaster[i].systalicvalue;
                    }
                }

                for (var i = 0; i < $scope.diastalicMaster.length; i++) {
                    if ($scope.diastalicMaster[i].startdiastolic <= $scope.txtdistlc && $scope.diastalicMaster[i].enddiastolic >= $scope.txtdistlc) {
                        diastalicValue = $scope.diastalicMaster[i].diastolicvalue;
                    }
                }

                if (systalicValue > diastalicValue) {
                    for (var i = 0; i < $scope.bpCategoryMaster.length; i++) {
                        if ($scope.bpCategoryMaster[i].categoryvalue === systalicValue) {
                            $scope.txtbplvl = $scope.bpCategoryMaster[i].bpcategory;
                            $scope.txtbplvlcolor = $scope.bpCategoryMaster[i].colour;

                        }
                    }
                } else if (systalicValue < diastalicValue) {
                    for (var i = 0; i < $scope.bpCategoryMaster.length; i++) {
                        if ($scope.bpCategoryMaster[i].categoryvalue === diastalicValue) {
                            $scope.txtbplvl = $scope.bpCategoryMaster[i].bpcategory;
                            $scope.txtbplvlcolor = $scope.bpCategoryMaster[i].colour;

                        }
                    }
                } else {
                    for (var i = 0; i < $scope.bpCategoryMaster.length; i++) {
                        if ($scope.bpCategoryMaster[i].categoryvalue === diastalicValue) {
                            $scope.txtbplvl = $scope.bpCategoryMaster[i].bpcategory;
                            $scope.txtbplvlcolor = $scope.bpCategoryMaster[i].colour;

                        }
                    }
                }
                if ($scope.txtbplvl) {
                    $scope.IndexBplvl_error = '';
                    $scope.errorFlag = true;
                }

                //            $http({
                //                method: 'GET',
                //                url: "/get_bplvlseverity/?bpsystolic=" + $scope.txtsytlc + "&bpdiastolic=" + $scope.txtdistlc,
                //            }).then(function successCallback(response) {
                //                $scope.txtbplvl = response.data[0].bpcategory;
                //                $scope.txtbplvlcolor = response.data[0].colour;
                //                if ($scope.txtbplvl) {
                //                    $scope.IndexBplvl_error = '';
                //                    $scope.errorFlag = true;
                //                }
                //            });
            } else {
                if (document.getElementById('txtsytlc').value == '') {
                    //   $scope.IndexSys_error = 'Enter Systolic';
                    $scope.errorFlag = false;
                } else {
                    $scope.IndexSys_error = '';
                    $scope.txtbplvl = '';
                    $scope.txtbplvlcolor = "WHITE";
                }
                if (document.getElementById('txtdistlc').value == '') {
                    // $scope.IndexDias_error = 'Enter Diastolic';
                    $scope.errorFlag = false;
                } else {
                    $scope.IndexDias_error = '';
                    $scope.txtbplvl = '';
                    $scope.txtbplvlcolor = "WHITE";
                }
            }
        }
        $rootScope.showScreenOverlay = false;
    };


    // Get Body Mass Index BMI
    $scope.BMIcalculation = function() {

        if (($scope.txtweightunit == 'Kgs' && $scope.txtweight > 140 && $scope.txtweight <= 500) || ($scope.txtweightunit == 'Lbs' && $scope.txtweight > 309 && $scope.txtweight < 1103)) {
            $scope.IndexWt_error = "On all ships where adult lifejackets are not designed to fit persons weighing up to 140 kg with a chest girth of up to 1,750 mm, suitable accessories are to be provided that allow the lifejacket to be secured to such persons."
        } else {
            if (($scope.txtweightunit == 'Kgs' && $scope.txtweight > 250) || ($scope.txtweightunit == 'Lbs' && $scope.txtweight > 1103)) {
                $scope.IndexWt_error = "Invalid Weight";
                $scope.txtweight = "";
            } else {
                $scope.IndexWt_error = "";
            }
        }
        if (($scope.txtheightunit == 'CM' && $scope.txtheight > 202 && $scope.txtheight <= 250) || ($scope.txtheightunit == 'Mtr' && $scope.txtheight > 2.02 && $scope.txtheight < 2.5)) {
            $scope.IndexHt_error = "Minimum permitted headroom in all seafarer accommodation for full and free movement shall be not less than 203 centimetres.";
        } else {
            if (($scope.txtheightunit == 'CM' && $scope.txtheight > 250) || ($scope.txtheightunit == 'Mtr' && $scope.txtheight > 2.5)) {
                $scope.IndexHt_error = "Invalid Height (Max 2.5 Mtr)";
                $scope.txtheight = "";
            } else {
                $scope.IndexHt_error = "";
            }
        }

        if ($scope.txtheightunit == 'CM' && $scope.txtweightunit == 'Kgs') {
            var result = ($scope.txtweight / (($scope.txtheight / 100) * ($scope.txtheight / 100)));
            $scope.txtBmIndex = result.toFixed(2);
        } else if ($scope.txtheightunit == 'Mtr' && $scope.txtweightunit == 'Kgs') {
            var res = ($scope.txtweight / ($scope.txtheight * $scope.txtheight));
            $scope.txtBmIndex = res.toFixed(2);
        } else if ($scope.txtheightunit == 'CM' && $scope.txtweightunit == 'Lbs') {
            var res = (($scope.txtweight / 2.2046) / (($scope.txtheight / 100) * ($scope.txtheight / 100)));
            $scope.txtBmIndex = res.toFixed(2);
        } else if ($scope.txtheightunit == 'Mtr' && $scope.txtweightunit == 'Lbs') {
            var res = (($scope.txtweight / 2.2046) / ($scope.txtheight * $scope.txtheight));
            $scope.txtBmIndex = res.toFixed(2);
        }

        // GET BMI Condition
        if ($scope.txtnationCode != undefined && $scope.txtBmIndex != undefined) {
            $http({
                method: 'GET',
                url: "/get_bmicondition/?nationality=" + $scope.txtnationCode + "&bmiindex=" + $scope.txtBmIndex,
            }).then(function successCallback(response) {
                $scope.txtBmicndn = response.data[0].wtcategory;
                $scope.txtBmicndncolor = response.data[0].colour;
            });
        }
    };

    // Get Calculate Body Fat
    $scope.calculateBodyFat = function() {
        if ($scope.txtheightunit == 'Mtr') {
            var res = 495 / (1.0324 - 0.19077 * Math.log10($scope.txtwaist - $scope.txtneck) + 0.15456 * Math.log10(100 * $scope.txtheight)) - 450
        } else {
            var res = 495 / (1.0324 - 0.19077 * Math.log10($scope.txtwaist - $scope.txtneck) + 0.15456 * Math.log10($scope.txtheight)) - 450
        }
        $scope.txtbodyfat = res.toFixed(2);

        // GET Body Fat Evaluation
        $rootScope.showScreenOverlay = true;
        $rootScope.showScreenOverlay = false;
        $http({
            method: 'GET',
            url: "/get_bodyfatevaluation/?gender=" + $scope.radsex + "&bodyfat=" + $scope.txtbodyfat,
        }).then(function successCallback(response) {
            $rootScope.showScreenOverlay = false;
            $scope.txtbodyfatevln = response.data[0].descrip;
            $scope.txtbodyfatevlncolor = response.data[0].colour;
        });
    };

    function resetErrors() {
        $scope.IndexRK_error = '';
        $scope.IndexMD_error = '';
        $scope.IndexHt_error = '';
        $scope.IndexHU_error = '';
        $scope.IndexWt_error = '';
        $scope.IndexWU_error = '';
        $scope.IndexIdx_error = '';
        $scope.IndexPulse_error = '';
        $scope.IndexUR_error = '';
        $scope.IndexSys_error = '';
        $scope.IndexDias_error = '';
        $scope.IndexBplvl_error = '';
        $scope.IndexNeck_error = '';
        $scope.IndexWaist_error = '';
        $scope.IndexBdyFat_error = '';
        $scope.IndexBdyEvln_error = '';
        $scope.Indextrgt_error = '';
        $scope.Indexprd_error = '';

        $scope.Indexprd_error = '';
    }

    $scope.hideError = function(field) {
        var fieldName = field + "_error";
        $scope[fieldName] = " ";
    }

    var errorMSg = 'This field is required';
    $scope.validation = function() {

        var raiseErrorFlag = false;
        var firstErrorProneField;
        $scope.errorFlag = true;
        
        if (!$scope.ranks) {
            $scope.IndexRK_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "txtrnk";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexRK_error = '';
        }
        
        if ($scope.medicals == '' || $scope.medicals == undefined) {
            $scope.IndexMD_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "dateTime";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexMD_error = '';
        }

        if (document.getElementById('txtheight').value == '') {
            $scope.IndexHt_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "height";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexHt_error = '';
        }

        if (!$scope.txtheightunit) {
            $scope.IndexHU_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "height";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexHU_error = '';
        }

        if (document.getElementById('txtweight').value == '') {
            $scope.IndexWt_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "weight";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexWt_error = '';
        }

        if (!$scope.txtweightunit) {
            $scope.IndexWU_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "weight";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexWU_error = '';
        }

        //        if (document.getElementById('txtBmIndex').value == '') {
        //            $scope.IndexIdx_error = errorMSg;
        //            $scope.errorFlag = false;
        //        } else {
        //            $scope.IndexIdx_error = '';
        //        }
        if (document.getElementById('txtpulserate').value == '') {
            $scope.IndexPulse_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "pulseRate";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexPulse_error = '';
        }


        if ($scope.urinals == '' || $scope.urinals == undefined) {
            $scope.IndexUR_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "urinalysis";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexUR_error = '';
        }

        if (document.getElementById('txtsytlc').value == '') {
            $scope.IndexSys_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "blood";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexSys_error = '';
        }
        if (document.getElementById('txtdistlc').value == '') {
            $scope.IndexDias_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "blood";
            }
            raiseErrorFlag = true;
        } else {
            $scope.IndexDias_error = '';
        }
        //        if (document.getElementById('txtbplvl').value == '') {
        //            $scope.IndexBplvl_error = errorMSg;
        //            $scope.errorFlag = false;
        //        } else {
        //            $scope.IndexBplvl_error = '';
        //        }
        if (document.getElementById('txtneck').value == '') {
            $scope.IndexNeck_error = errorMSg;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "neck";
            }
            raiseErrorFlag = true;
            $scope.errorFlag = false;
        } else {
            $scope.IndexNeck_error = '';
        }
        if (document.getElementById('txtwaist').value == '') {
            $scope.IndexWaist_error = errorMSg;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "waist";
            }
            raiseErrorFlag = true;
            $scope.errorFlag = false;
        } else {
            $scope.IndexWaist_error = '';
        }
        //        if (document.getElementById('txtbodyfat').value == '') {
        //            $scope.IndexBdyFat_error = errorMSg;
        //            $scope.errorFlag = false;
        //        } else {
        //            $scope.IndexBdyFat_error = '';
        //        }
        //        if (document.getElementById('txtbodyfatevln').value == '') {
        //            $scope.IndexBdyEvln_error = errorMSg;
        //            $scope.errorFlag = false;
        //        } else {
        //            $scope.IndexBdyEvln_error = '';
        //        }
        if (document.getElementById('txtBmi').value == '') {
            $scope.Indextrgt_error = errorMSg;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "bmiTarget";
            }
            raiseErrorFlag = true;
            $scope.errorFlag = false;
        } else {
            $scope.Indextrgt_error = '';
        }
        if (document.getElementById('txtperiod').value == '') {
            $scope.Indexprd_error = errorMSg;
            $scope.errorFlag = false;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "bmiTarget";
            }
            raiseErrorFlag = true;
        } else {
            var period = document.getElementById('txtperiod').value;
            if (period >= 0 && period <= 12) {
                $scope.Indexprd_error = '';
                if (raiseErrorFlag === false) {
                    firstErrorProneField = "bmiTarget";
                }
                raiseErrorFlag = true;
            } else {
                $scope.Indexprd_error = 'Period must be in range 0-12';
                $scope.errorFlag = false;
            }
        }

        if ($scope.myFile.length > 0) {
            $scope.filemsg_error = "Please upload the selected file";
            $scope.errorFlag = false;
        } else {
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
            $scope.resetErrors();

            return false;
        }
    }

    $scope.exportexcel = function() {
        form_data = {
            'chid': $scope.chlid,
            'chldate': new Date($scope.tddate).toISOString(),
            'offset': new Date().getTimezoneOffset()
        };
        $rootScope.showScreenOverlay = true;
        $http({
            method: 'POST',
            url: "/Export-excel-CHL/",
            responseType: 'arraybuffer',
            data: form_data = {
                crewhealthMaster: form_data,

            },

        }).then(
            function(response) {
                $rootScope.showScreenOverlay = false;
                var myBlob = new Blob([response.data], {
                    type: "application/vnd.ms-excel"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.vslname + "CrewHealthLog" + $scope.chlid + ".xls";
                anchor.href = blobURL;
                anchor.click();
                $rootScope.showScreenOverlay = false;

            });
    };


    //enter into pdf

    $scope.saveAsPDFDocument = function() {

        form_data = {
            'chid': $scope.chlid,
            'chldate': new Date($scope.tddate).toISOString(),
            'offset': new Date().getTimezoneOffset()
        };

        $http({
            url: "/CrewHealthLog-save-as-pdf/",
            dataType: 'json',
            method: 'POST',
            responseType: 'arraybuffer',
            data: {

                crewhealthMaster: form_data,
            },

        }).then(
            function(response) {
                var myBlob = new Blob([response.data], {
                    type: "application/pdf"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                var anchor = document.createElement("a");
                anchor.download = $scope.vslname+"-"+"CrewHealthLog"+"-"+ $scope.chlrfid;
                anchor.href = blobURL;
                anchor.click();


            });
    }

    $scope.deleteActionPerformed = function() {
        form_data = {
            'chid': $scope.chlid,
        };
        Connectivity.IsOk().then(function(response) {
            $http({
                method: 'POST',
                url: "/delete-crew-health-report-master/",
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