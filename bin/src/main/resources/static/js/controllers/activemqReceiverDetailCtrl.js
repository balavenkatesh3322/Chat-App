app.controller('activemqDetailReceiverCtrl', function($scope, $rootScope,$http, $routeParams){
	$scope.pageSize = 25;
	$scope.fieldNames = [];
	$scope.search = [];
	$scope.pageSize = $rootScope.defaultPageSize;
	$scope.haspermission = false;
	$scope.hidebody = true;
	$scope.$on('$viewContentLoaded', function() {
		$scope.layoutdialog.close();
		
	});
	$scope.unauthorize = function(arg1){
		if (arg1){
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	}
	$scope.layoutactions = [
	 	                   { text: 'Set Default', action: function(){$scope.saveGrids()}}
	 	               ];
	 	$scope.openLayoutDialog = function(){
	 		$scope.layoutdialog.open();
	 	}
	var getGridColumns = function(){
		$http({
			method : 'GET',
			url: "/user-grid-details/?mdlcode=MQR&gridid=G2",
		}).then(function(response){
			response =response.data;
			for(var i=0; i<response.length; i++){
				var checkedVal = false;
				if (response[i].isSelected=='Y'){
					checkedVal = true;
				}
				$scope.fieldNames.push({"title":response[i].columnName,"key": response[i].mappedName, "checked": checkedVal})
			}
			console.log($scope.fieldNames);
		});
	}
	$scope.saveGrids = function(){
		var userGridDetails = [];
		for (var i=0; i<$scope.fieldNames.length; i++){
			var checkedVal = 'N';
			if ($scope.fieldNames[i].checked){
				checkedVal = 'Y';
			}
			userGridDetails.push({"columnName": $scope.fieldNames[i].title, "mappedName":$scope.fieldNames[i].key, "isSelected": checkedVal, "moduleCode": "MQR", "detailGridId":"G2"});
		}
		$http({
		    url: "/save-user-grid-details/",
		    dataType: 'json',
		    method: 'POST',
		    data: userGridDetails,
		    headers: {
		        "Content-Type": "application/json"
		    }
		});
	}
	$scope.$watch('fieldNames', function() {
	    update_columns();
	  }, true);
	var update_columns = function() {
	    $scope.ordered_columns = [];
	    for (var i = 0; i < $scope.fieldNames.length; i++) {
	      var column = $scope.fieldNames[i];
	      if (column.checked) {
	    	  $scope.ordered_columns.push(column);
	      }
	    }
	  };
	 var getGridData = function getGridData(){
		 $http({
		       method: 'GET',
		       url: "/get-active-mq-receiver-detail-data/?transactionId="+$routeParams.id,
		   }).then(
		       function(response) {
//		    	   $scope.activeMQMasterData = response.data.data[0].detailData;
		    	   $scope.activeMQMasterData = response.data.data;
		       });
	 };
	 getGridData();
	 getGridColumns();
});