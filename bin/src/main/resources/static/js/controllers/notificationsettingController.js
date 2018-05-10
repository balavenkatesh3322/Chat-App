app.controller('notificationsettingController', function($scope, $http, $anchorScroll, $window, $location, $filter, $timeout, $compile, Connectivity, $rootScope) {

    $scope.geterrorstatuscode = "0";

    $scope.actions = [{
        text: 'Ok',
        action: function() {
            $scope.geterrorstatuscode = "0";
        }
    }];

    $scope.follow = [];
    $scope.followstring = [];
    $scope.rankdetails = [];


    $scope.sort = function(predicate) {
        $scope.predicate = predicate;
    }
    $scope.isSorted = function(predicate) {
        return ($scope.predicate == predicate)
    }

    $scope.errorFlag = true;
    $scope.notes = [];
    $scope.pageSize = $rootScope.defaultPageSize;
    $scope.notedisable = true;
    $scope.shouldShow1 = true;
    $scope.msgclear = true;


    Connectivity.IsOk().then(function(response) {
    	  $scope.assignedgrid = true;
        $http({
            url: "/retrieve_Notificationsetting/",
            method: 'GET',

        }).then(function successCallback(response) {
            $scope.geterrormessages = response.data.message;
            $scope.geterrorstatus = response.data.errorstatus;
            $scope.geterrorstatuscode = response.data.status;
            $scope.dataerror = response.data.message;
            if ((response.data.status == 0) || (response.data.errorstatus == "SV")) {
                $scope.notes = response.data.data[0].notificationDetailList;
                console.log($scope.notes, '$scope.notes')
                $scope.prioritys = response.data.data[0].prioritydetails;
                $scope.statusdetails = response.data.data[0].formStatusList;
            } else {
                $scope.errordetails = response.data.exceptionDetail;
                $scope.showexception = response.data.showerrormessage
                $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                $scope.dataerror = [response.data.message[0]];
            }
        });

    }, function(error) {
        $scope.dataerror = "Server not reached";
    })
    
$scope.actionChange = function() {
        if ($scope.Stats == "CHT") {
            $scope.chatDis = true;
            $scope.Notifytocode="";
            $scope.taskassignedtostring = [];
            $scope.taskassignedto = [];
            $scope.assignedgrid = true;
        } else {
        	 $scope.assignedgrid = false;
        }
    };

    $scope.cancelForm = function() {
        var raiseErrorFlag = false;
        var firstErrorProneField;
        $scope.shouldShow1 = true;
        $scope.shouldShow = false;
        $scope.rankdetails = [];
        $scope.ModuleId = "";
        $scope.ModuleName = "";
        $scope.Notifyfromcode = "";
        $scope.Notifytocode = "";
        $scope.Stats = "";
        $scope.Roles = "";
        $scope.Ranks = "";
        $scope.PriorCode = "";
        $scope.NotifyDesc = "";
        if (raiseErrorFlag === false) {
            firstErrorProneField = "moduleLbl";
        }
        raiseErrorFlag = true;
        if (raiseErrorFlag === true) {
            var old = $location.hash();
            $anchorScroll.yOffset = 150;
            $location.hash(firstErrorProneField);
            $anchorScroll();
            $location.hash(old);
            return true
        } else {
            return false;
        }
    };


    $scope.notifytoclick = function() {
        $scope.rankdetails = [];
    }
    $scope.removeNotificationSetting = function(index) {
        $scope.rankdetails.splice(index, 1);
    };
    $scope.startsWith = function(actual, expected) {
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
    }
    $scope.showModal2 = function(targetName) {
        if ($scope.Notifytocode === undefined) {
            $scope.NotifyCode_error = 'Select notify to';
        } else {
            $scope.NotifyCode_error = '';
            $http({
                method: 'GET',
                url: "/get-rankdetail-for-notification-setting/?notifyto=" + $scope.Notifytocode
            }).then(function successCallback(response) {
                $scope.notifytoRankList = response.data;
            });
            angular.element(targetName).modal('show');

        }
    }

    $scope.followerButtonLabel = function(rankcode, rankname) {
        $scope.add = ({
            'rankcode': rankcode,
            'rankname': rankname
        });
        var json = angular.toJson($scope.add);
        var rankcodes = $scope.followstring.indexOf(json);
        if (rankcodes === -1) {
            return "Select";
        } else {
            return "Selected";
        }
    }


    $scope.followerSelect = function(rankcode, rankname) {
        $scope.add = ({
            'rankcode': rankcode,
            'rankname': rankname
        });
        var json = angular.toJson($scope.add);
        var rankcodes = $scope.followstring.indexOf(json);
        if (rankcodes === -1) {
            $scope.followstring.push(json);
            $scope.followgrid = true;
            var jsonObj = JSON.parse(json);
            $scope.rankdetails.push(jsonObj);
        } else {
            $scope.followstring.splice($scope.followstring.indexOf(json), 1);
            $scope.deleteExistingfollow(rankcode);
        }
    }


    $scope.deleteExistingfollow = function(rankcode, rankname) {
        var index = -1;
        var followdelete = eval($scope.follow);
        for (var i = 0; i < followdelete.length; i++) {
            if (followdelete[i].rankcode === rankcode) {
                index = i;
                break;
            }
        }
        $scope.rankdetails.splice(index, 1);
    }


    $scope.notifyEdit = function(notes) {
        var raiseErrorFlag = false;
        var firstErrorProneField;
            $scope.Notifyfromcode = notes.notifyfromcode;
            $scope.Notifytocode = notes.notifytocode;
            if (notes.notifytocode == 'CNT001') {
                $http({
                    method: 'GET',
                    url: "/get-shorerankdetails/?notifytocode=" + notes.notifycode
                }).then(function successCallback(response) {
                    $scope.rankdetails = response.data;
                });

            } else {
                $http({
                    method: 'GET',
                    url: "/get-rankdetails/?notifytocode=" + notes.notifycode
                }).then(function successCallback(response) {
                    $scope.rankdetails = response.data;
                });
            }
            $scope.shouldShow = true;
            $scope.shouldShow1 = false;
            $scope.NotifyCode = notes.notifycode,
                $scope.NotifyId = notes.notifyid,
                $scope.ModuleId = notes.mdlcode,
                $scope.ModuleName = notes.mdlname,
                $scope.Stats = notes.actioncode,
                $scope.Ranks = notes.rankcode,
                $scope.PriorCode = notes.prioritycode,
                $scope.NotifyDesc = notes.notifydesc,
                $scope.cruser = notes.cruser;
            $scope.crdate = notes.crdate;
            $scope.upddate = notes.upduser;
            $scope.upduser = notes.upddate;
            $scope.upddate = notes.upduser;
            $scope.actionChange();
            if (raiseErrorFlag === false) {
                firstErrorProneField = "moduleLbl";
            }
            raiseErrorFlag = true;
            if (raiseErrorFlag === true) {
                var old = $location.hash();
                $anchorScroll.yOffset = 150;
                $location.hash(firstErrorProneField);
                $anchorScroll();
                $location.hash(old);
                return true
            } else {
                return false;
            }
    }

});