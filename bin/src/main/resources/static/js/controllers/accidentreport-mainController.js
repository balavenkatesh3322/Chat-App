app.controller('accidentReportMainController', function($rootScope, $scope, $http, $filter, accidentReportService, $timeout, $window, $location) {
    $scope.unauthorize = function(arg1){
		if (arg1){
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	}
    $scope.search = [];


    $scope.pageSize = $rootScope.defaultPageSize;
    $scope.sort = function(predicate) {
        $scope.predicate = predicate;
    }
    $scope.isSorted = function(predicate) {
        return ($scope.predicate == predicate)
    }

    $scope.openLayoutDialog = function() {
        $scope.layoutdialog.open();
    }
    $rootScope.showScreenOverlay = true;
    $scope.$on('$viewContentLoaded', function() {
        $scope.dialog.close();
        $scope.layoutdialog.close();
    });
    $scope.layoutactions = [{
        text: 'Set Default',
        action: function() {
            $scope.saveGrids()
        }
    }];
    $scope.geterrorstatuscode = "0";
    $scope.actions = [{
        text: 'Ok',
        action: function() {
            $scope.geterrorstatuscode = "0";
            $scope.isuploading = false;
        }
    }];


    $scope.newAction = function() {
        $rootScope.showScreenOverlay = true;

        $http({
            method: 'GET',
            url: "/validate_accident_report/",
        }).then(
            function(response) {
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if (response.data.status == 0 && response.data.length != 0) {
                    window.location.href = "#/AccidentForm/" + response.data.data[0];
                } else {
                    $scope.errordetails = response.data.exceptionDetail;
                    $scope.showexception = response.data.showerrormessage
                    if (response.data.exceptionDetail != null) {
                        $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                    }
                    $scope.dataerror = [response.data.message[0]];

                }
                $rootScope.showScreenOverlay = false;
            });
    }

    $http({
            method: 'GET',
            url: "/fetch_all_accident_report_form/",
        })
        .then(
            function(response) {
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if (response.data.status == 0 && response.data.length != 0) {
                    $scope.accidentReport = response.data.data[0];
                    $scope.newButton = response.data.data[1];
                    $scope.accidentReport = $filter('orderBy')($scope.accidentReport,'-accid');
                } else {
                    $rootScope.showScreenOverlay = false;
                    $scope.errordetails = response.data.exceptionDetail;
                    $scope.showexception = response.data.showerrormessage
                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                    $scope.dataerror = [response.data.message[0]];
                }
                $rootScope.showScreenOverlay = false;
            });

    $scope.viewAction = function(accid) {
        $rootScope.showScreenOverlay = true;
        window.location.href = "#/AccidentForm/" + accid;
        $rootScope.showScreenOverlay = false;
    }

    $scope.fieldNames = [];
    $http({
        method: 'GET',
        url: "/user-grid-details/?mdlcode=ART&gridid=G1",
    }).then(function(response) {
        response = response.data;
        for (var i = 0; i < response.length; i++) {
            var checkedVal = false;
            if (response[i].isSelected == 'Y') {
                checkedVal = true;
            }
            $scope.fieldNames.push({
                "title": response[i].columnName,
                "key": response[i].mappedName,
                "checked": checkedVal
            })
        }
    });

    $scope.saveGrids = function() {
        var userGridDetails = [];
        for (var i = 0; i < $scope.fieldNames.length; i++) {
            var checkedVal = 'N';
            if ($scope.fieldNames[i].checked) {
                checkedVal = 'Y';
            }
            userGridDetails.push({
                "columnName": $scope.fieldNames[i].title,
                "mappedName": $scope.fieldNames[i].key,
                "isSelected": checkedVal,
                "moduleCode": "ART",
                "detailGridId": "G1"
            });
        }
        $http({
            url: "/save-user-grid-details/",
            dataType: 'json',
            method: 'POST',
            data: userGridDetails,
            headers: {
                "Content-Type": "application/json"
            }
        });
        angular.element($('#gridmodal').modal('hide'));
    }
    $scope.$watch('fieldNames', function() {
        update_columns();
    }, true);
    var update_columns = function() {
        $scope.ordered_columns = [];
        for (var i = 0; i < $scope.fieldNames.length; i++) {
            var column = $scope.fieldNames[i];
            if (column.checked) {
                $scope.ordered_columns.push(column);
            }
        }
    };

});