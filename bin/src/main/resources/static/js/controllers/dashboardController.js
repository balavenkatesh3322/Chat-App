app.controller('dashboardController', function($scope, $http, $rootScope, $window, $location, $filter,$timeout){

	 var i =0;
	 $scope.finishLoading = function() {
		   	var head = document.getElementsByTagName('head').item(0);
		   	var script = document.createElement('script');
		 	script.src = 'scripts/colors.js';
		    head.appendChild(script);
		    $timeout(function(){
			 if (i==1){
				 $timeout(function(){
					 load();
					 
				 },0).then(function(){
						document.getElementById("header").style.visibility = "visible";
						document.getElementById("navbar").style.visibility = "visible";
						
				 }).then(function(){
					 	document.getElementById("container").style.visibility = "visible";
					 	var loader = document.getElementById("loader");
					 	loader.style.opacity= 0;
					 	loader.style.transition = "opacity 1s ease-in-out";
					 	loader.addEventListener( 
					 		     'webkitTransitionEnd', 
					 		     function( event ) { 
					 		        loader.style.display = "none";
					 		     }, false );
				 });
			 }
			 i++;
	    }, 0);
	 }
	
	 $http({
			method : 'GET',
			url: "/get-vessel-task-manager-data/",
		}).then(function(response){
	 $scope.vesselDetailList = response.data;
	 console.log($scope.vesselDetailList.length , '$scope.vesselDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
	 $scope.taskCount = $scope.vesselDetailList.length;
});
	 
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
	
	
		    
});
