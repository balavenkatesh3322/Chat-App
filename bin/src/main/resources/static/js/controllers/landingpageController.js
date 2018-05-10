var app = angular.module('USDAppMain', ['angularUtils.directives.dirPagination']);
app.controller('USDControllerMain', function($scope, $http, $window, $location, $filter, $timeout){
	

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
	
	
	$http({
		method : 'GET',
		url : '/get-user-detail-list-main/'
	}).then(function successCallBack(response){
		console.log(response.data, 'user details >>>>>>>>>>>>>>>>>> ');
		$scope.userDetailList = response.data;
	});
	
});