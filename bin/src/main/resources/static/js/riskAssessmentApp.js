var app = angular.module('riskManagementForm', ['controllersModule','customDirectives','serviceModule']);
app.controller('MainController',function($rootScope,$scope,$http,$location){
	

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
   	 $scope.vesselname = $scope.userDetailList[0].vesselname;
   	 console.log($scope.userDetailList,'$scope.userDetailList >>>>>>>>>>>');
	});

	 $http({
	       method: 'GET',
	       url: "/getActiveHazardList/",
	   }).then(
	       function(response) {
	    	   //$scope.formStatus = response.data;
	    	   var data = response.data.data;
	    	   $rootScope.globalHazrdList = {};
	    	   for(var i =0;i<data.length;i++){
	    		   $rootScope.globalHazrdList[data[i].hazardcode] =  data[i].hazardname;
	    	   }
	    	  
	       });
	 $http({
	       method: 'GET',
	       url: "/get-session-data/"
	   }).then(
	       function(response) {
	    	   //$scope.formStatus = response.data;
	    	   $scope.captainName = response.data.captainName;
	    	   $rootScope.shipName = response.data.vesselName;
			   $rootScope.shipCode = response.data.vesselcode;
			   $rootScope.username = response.data.usercode;	
			   $rootScope.rankCode = response.data.rankcode;
			  
	       });
	// $rootScope.userRole = "SHIP_TIER_2";
	// $rootScope.username =  "IN00003";
	// SR NO
   var urlParams = $location.absUrl().split("?");
    if (urlParams.length>1){
    	var val1 = urlParams[1].split('&')
    	var val = val1[0].split('=')[1];
    	$rootScope.isNew = val =='true'?true:false; 
    	if(val1[1]){
    		$rootScope.rskId = val1[1].split('=')[1];
    	}
    	
    }
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
  
});






