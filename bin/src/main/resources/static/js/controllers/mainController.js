var injectParams = ['$rootScope','$scope','$http','$location'];  // define main controlller dependencies
var MainController = function ($rootScope,$scope,$http,$location) {
	
	
	$http({
		method : 'GET',
		url: "/get-notification-history-for-last-three-days-ship-date/",
	}).then(function successCallBack(response){
		 $scope.notificationList = response.data;
    	 $scope.notificationCount = $scope.notificationList.length;
	});
	
	
	$http({
		method : 'GET',
		url: "/get-user-detail-datas-ship-date/",
	}).then(function successCallBack(response){
		$scope.userDetailList = response.data;
   	 $scope.userrank = $scope.userDetailList[0].rankName;
   	 $scope.userrole = $scope.userDetailList[0].rolename;
   	 $scope.username = $scope.userDetailList[0].empName;
   	 $scope.usercode = $scope.userDetailList[0].userCode;
   	$scope.vesselname = $scope.userDetailList[0].shipname;
   	 console.log($scope.userDetailList,'$scope.userDetailList >>>>>>>>>>>');
	});
	
	
	
 	
    // $rootScope.userRole = "SHIP_TIER_2";
	// $rootScope.username =  "KLSG001";
	// SR NO
   var urlParams = $location.absUrl().split("?");
    if (urlParams.length>1){
    	var val = urlParams[1].split('=')[1];
    	$rootScope.isNew = val =='true#!/'?true:false; 
    }
	//$rootScope.isNew = $routeParams.isNew =='true'?true:false; //$routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
	$rootScope.rskId = $('input[id="rskId"]').val()
	console.log($rootScope.userRole);
	console.log($rootScope.isNew);
	console.log($rootScope.rskId);
	
	$scope.selectFile = function (files){
		$scope.files = files;
		var fd = new FormData();
	    fd.append('type',"MI");
	    fd.append('formId',$rootScope.riskMaster.rskid);
	    for (var i = 0;i<$scope.files.length;i++){
	    	fd.append('file', $scope.files[i]);
	    }
        
         $http.post("/v1/uploadFile", fd, {
            transformRequest: angular.identity,
            headers: {
            	 'X-XSRF-TOKEN': $('input[name="_csrf"]').val(),
            	'Content-Type': undefined
            	}
        })
        .success(function(){
        })
        .error(function(){
        });
	
	};
	
	$scope.uploadFile = function() {
	  
		var fd = new FormData();
	    fd.append('type',"MI");
        fd.append('file', $scope.files[0]);
         $http.post("/v1/uploadFile", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
	};
  };

  // inject configs to the MainController
  MainController.$inject = injectParams;
  angular.module('controllersModule',[]).controller("MainController", MainController);
  
  