angular.module("ShoreDepartmentMasterApp").controller('ShoreDeptMasterCtrl', function($scope, $rootScope, $location,$http){
	 $scope.cruser = "";
	 $scope.crdate = "";
	 $scope.showField = false;
	 $scope.addfield = true;
	 $scope.validate = true;
	 $scope.informationMessage = "";
	
	$http({
        method: 'GET',
        url: "/load-From-shore-department-master/",
    }).then(function successCallback(response) {	
        	$scope.ShoreDepts = response.data;
    });
	
	
	$scope.saveButtonClicked = function(){
		$scope.validation();
		if($scope.validate == true){
		$http({
			method : 'GET',
			url : '/shore-dept-mstr-code-no/'
		}).then(function successCallback(response) {
			$scope.depcode = response.data.shoredeptcode;
			
			form_data = {
					'depcode': $scope.depcode,
					'depname': $scope.depname,
					};
			
			 $http({
 			    url: "/save-shore-department-master/",
 			    dataType: 'json',
 			    method: 'POST',
 			    data: form_data,
 			    headers: {
 			        "Content-Type": "application/json"
 			    }
 			}).then(function successCallback(response){
 				$scope.informationMessage = "Saved successfully";
 				$scope.depcode = "";
 				$scope.depname = "";
 				$http({
 			        method: 'GET',
 			        url: "/load-From-shore-department-master/",
 			    }).then(function successCallback(response) {	
 			        	$scope.ShoreDepts = response.data;
 			    });
 			});
		});
		
	}
	}
	
	$scope.shoreDeptMasterEdit = function(dept){
		if(dept.active_status == 'A'){
			$scope.depcode = dept.depcode;
			$scope.depname = dept.depname;
			$scope.cruser = dept.cruser;
			$scope.crdate = dept.crdate;
			 $scope.showField = true;
			 $scope.addfield = false;
			 $scope.ShoreDeptMstrName_error = "";
			 $scope.informationMessage = "";
		}else{
			$scope.depcode = "";
			$scope.depname = "";
			$scope.cruser = "";
			$scope.crdate = "";
			$scope.informationMessage = "Record is removed";
		}
		
	}
		
	$scope.updateButtonClicked = function(){
		
			form_data = {
					'depcode': $scope.depcode,
					'depname': $scope.depname,
					'cruser' : $scope.cruser,
					'crdate' : $scope.crdate,
					};
			
			 $http({
 			    url: "/update-shore-department-master/",
 			    dataType: 'json',
 			    method: 'POST',
 			    data: form_data,
 			    headers: {
 			        "Content-Type": "application/json"
 			    }
 			}).then(function successCallback(response){
 				$scope.depcode = "";
 				$scope.depname = "";
 				$scope.showField = false;
 				 $scope.addfield = true;
 				$scope.informationMessage = "Updated successfully";
 				$http({
 			        method: 'GET',
 			        url: "/load-From-shore-department-master/",
 			    }).then(function successCallback(response) {	
 			        	$scope.ShoreDepts = response.data;
 			    });
 			});
	}
	
	
	$scope.removeButtonClicked = function(){
		
		form_data = {
				'depcode': $scope.depcode,
				'depname': $scope.depname,
				'cruser' : $scope.cruser,
				'crdate' : $scope.crdate,
				};
		
		 $http({
			    url: "/remove-shore-department-master/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				$scope.informationMessage = "Removed successfully";
				$scope.depcode = "";
 				$scope.depname = "";
 				$scope.showField = false;
 				$scope.addfield = true;
				$http({
			        method: 'GET',
			        url: "/load-From-shore-department-master/",
			    }).then(function successCallback(response) {	
			        	$scope.ShoreDepts = response.data;
			    });
			});
		}
	
	
	$scope.resetButtonClicked = function(){
		$scope.depcode = "";
		$scope.depname = "";
		$scope.cruser = "";
		$scope.crdate = "";
		$scope.showField = false;
		$scope.addfield = true;
	}
	

	 $scope.set_color = function (dept) {
		  if (dept.active_status == 'V') {
		    return { color: "red" }
		  }
		}
	 
	 $scope.validation = function(){
		 console.log("validation >>>>>>>>> "+$scope.depname);
		 if($scope.depname == "" || $scope.depname == undefined){
			 $scope.ShoreDeptMstrName_error = "Enter the Department Name ";
			 $scope.validate = false;
			 $scope.informationMessage = "";
		 }else{
			 $scope.ShoreDeptMstrName_error = "";
			 $scope.validate = true;
			 $scope.informationMessage = "";
		 }
	 }
	 
	
});