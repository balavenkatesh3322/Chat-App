app.controller('nearMissMainController', function($scope, $http, $rootScope, $window, $location, $filter, $timeout) {
    $scope.search = {};
    $scope.geterrorstatuscode = "0";
    $scope.newDisabled = false;
    $scope.pageSize = $rootScope.defaultPageSize;
    $scope.hidebody = true;
    $scope.haspermission = false;
    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }
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
    $scope.openLayoutDialog = function() {
        $scope.layoutdialog.open();
    }
    $scope.actions = [{
        text: 'Ok',
        action: function() {
            $scope.newDisabled = false;
        },
        action: function() {
            $scope.geterrorstatuscode = "0";
        }
    }];

    $scope.sort = function(predicate) {
        $scope.predicate = predicate;
    }

    $scope.isSorted = function(predicate) {
        return ($scope.predicate == predicate)
    }

    $http({
            method: 'GET',
            url: "/get-nearmiss-form-details/",
        })
        .then(
            function(response) {
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if (response.data.status == 0 && response.data.length != 0) {
                    $scope.reportdata = response.data.data[0];
                    $scope.newButton = response.data.data[1];
                    $scope.reportdata = $filter('orderBy')($scope.reportdata, '-nrmid');
                } else {
                    $rootScope.showScreenOverlay = false;
                    $scope.errordetails = response.data.exceptionDetail;
                    $scope.showexception = response.data.showerrormessage
                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                    $scope.dataerror = [response.data.message[0]];
                }
                $rootScope.showScreenOverlay = false;
            });


    $scope.getformvalidation = function() {
        $rootScope.showScreenOverlay = true;
        $scope.newDisabled = true;
        $http({
            method: 'GET',
            url: "/validate-nearmiss-form-no/",
        }).then(
            function(response) {
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if (response.data.status == 0 && response.data.length != 0) {
                    $scope.newDisabled = false;
                    window.location.href = "#/NearmissForm/" + response.data.data[0];
                } else {
                    $rootScope.showScreenOverlay = false;
                    $scope.newDisabled = false;
                    $scope.errordetails = response.data.exceptionDetail;
                    $scope.showexception = response.data.showerrormessage
                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                    $scope.dataerror = [response.data.message[0]];

                }
                $rootScope.showScreenOverlay = false;
            });
    }



    $scope.fieldNames = [];
    $http({
        method: 'GET',
        url: "/user-grid-details/?mdlcode=NMR&gridid=G1",
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
                "moduleCode": "NMR",
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