angular.module("DepartmentMasterApp")
.service("DepartmentMasterService",function($http){

	this.add = function(dept_data){
		$http({
		    url: "/add_department_master/",
		    dataType: 'json',
		    method: 'POST',
		    data: dept_data,
		    headers: {
		        "Content-Type": "application/json"
		    }

		}).then(function successCallback(response){
			console.log("Sent");
			});
	};
	
	this.retrieve = function(){
	$http({
		    url: "/retrieve_department_master/",
		    method: 'GET',
		    
		}).then(function successCallback(response){
			$scope.deps = response.data;
			
			});
	};
});
