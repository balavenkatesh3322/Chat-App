angular.module("FleetMasterApp")
.service("FleetMasterService",function($http){

	this.add = function(fleet_data){
		$http({
		    url: "/add_fleet_master/",
		    dataType: 'json',
		    method: 'POST',
		    data: fleet_data,
		    headers: {
		        "Content-Type": "application/json"
		    }

		}).then(function successCallback(response){
			console.log("Sent");
			});
	};
	
	this.retrieve = function(){
	$http({
		    url: "/retrieve_fleet_master/",
		    method: 'GET',
		    
		}).then(function successCallback(response){
			$scope.fleets = response.data;
			
			});
	};
});
