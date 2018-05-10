var app = angular.module('spritlechatApp', []);
app.controller('chatCtrl',
				function($scope,$http) {
	
	
	
	 $scope.savetodayintersting = function(){
	console.log("savetodayintersting  calling" ,$scope.todaydata);
	if($scope.todaydata!=""){
		  $http({
	            method: 'GET',
	            url: "/save-todayinterestings/?intrestingdata="+$scope.todaydata		          
	        }).then(function(response){
	        	$scope.todaydata="";
	        	console.log("response ",response);
	        	$scope.gettodaydata=response.data;
	        	
	        });
		  
	}
 }
	 
	 $scope.saveusercomments = function(){
			console.log("saveusercomments  calling" ,$scope.commentsid);
			if($scope.usercomments!=""){
				  $http({
			            method: 'GET',
			            url: "/save-usercommentsbyid/?comments="+$scope.usercomments+ '&intrestingid='+$scope.commentsid	          
			        }).then(function(response){
			        	console.log("response ",response.data);
			        	$scope.usercomments="";
			        	$scope.getcomments=response.data.usercomments;
			        	$scope.gettodaydata=response.data.todayintrestingdata;
			        });
				  
			}
		 }
	 
	 
	 $scope.saveuserlikes = function(id){
			console.log("saveuserlikes  calling" ,id);

				  $http({
			            method: 'GET',
			            url: "/save-userlikesbyid/?likesid="+id          
			        }).then(function(response){
			        	console.log("response ",response.data);
			        	$scope.gettodaydata=response.data;
			        	
			        });
				  
			
		 }
	 
	 $scope.getusercommentsbyid = function(id){
		 $scope.commentsid=id;
			console.log("getusercommentsbyid  calling" ,id);
			if($scope.todaydata!=""){
				  $http({
			            method: 'GET',
			            url: "/get-todaycommentsbyid/?intrestingid="+id		          
			        }).then(function(response){
			        	console.log("response ",response.data);
			        	$scope.getcomments=response.data;
			        	
			        });
				  
			}
		 }
					

	 
				  $http({
			            method: 'GET',
			            url: "/getall-todayinterestings/"		          
			        }).then(function(res){
			        	console.log("response ",res.data);
			        	$scope.gettodaydata=res.data;
			        	
			        });
				  
			  
		 
	 
});