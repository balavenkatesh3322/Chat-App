app.controller('nearMissShareController', function($scope, $http, $rootScope, $window, $location, $filter,$timeout,Connectivity){
	
	$scope.pageSize = 25;
	$scope.sort = function(predicate) {
        $scope.predicate = predicate;
      }
	$scope.nearMissShare = [];
	
	Connectivity.IsOk().then(function(response){
		
		$http({
			method:'GET',
			url:"/retrieve_near-miss-share-data/"
		}).then(function(response){
			$scope.nearMissShare =  response.data.data[0].nearMissShare;
			$scope.formatedDate =  response.data.data[0].dateFormat;
		});
		
	}, function(error){
		  $scope.dialog.open();
		  $scope.dataerror = "Server not reached";
	});

	
});