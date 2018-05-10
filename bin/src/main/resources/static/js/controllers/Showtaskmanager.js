app.controller('TaskManagershowctrl', function($scope, $timeout, $http, $window, $location, $filter,$routeParams,$rootScope){
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.search = {};
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

	 $scope.pageSize = 25;
	 $scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }

$scope.$on('$viewContentLoaded', function() {

		$scope.layoutdialog.close();
	});

	     $rootScope.showScreenOverlay = true;
	 $http({
	       method: 'GET',
	       url:"/TaskManager-details/",
	   }).then(
	       function(response) {
	    	   $scope.Taskmanagerdata = response.data;
	    	   $scope.Taskmanagerdata = $filter('orderBy')($scope.Taskmanagerdata, 'assigneddate', true);
	    	   $rootScope.showScreenOverlay = false;
	       });

	 // get department master details
//	    $http({
//	        method: 'GET',
//	        url: "/get-departmentmaster-details/",
//	    }).then(
//	        function(response) {
//	        	$scope.departmentmaster = response.data;
//	        	console.log($scope.departmentmaster,"departmentmaster");
//	        });

	// get task assignee details Names
//	    $http({
//	        method: 'GET',
//	        url: "/Taskassignee-details/",
//	    }).then(
//	        function(response) {
//	        	$scope.taskassigneedetails = response.data;
//	        	console.log(response,"showww");
//	        });

	    $scope.path = '';
		$scope.referenceClicked = function(modulecode,formid){
			if(modulecode.length >0){
				$http({
					method : 'GET',
					url : '/get-task-manager-url/',
					params : {
						modulecode : modulecode,
						pagetype:"M"
					}
				}).then(function successCallBack(response){
					$scope.taskurl = response.data;
					$scope.path = $scope.taskurl[0].url;
					window.location = $scope.path+"/"+formid
				});
			}
		}


			$scope.fieldNames = [];
        	$http({
        		method : 'GET',
        		url: "/user-grid-details/?mdlcode=VTM&gridid=G1",
        	}).then(function(response){
        		response =response.data;
        		for(var i=0; i<response.length; i++){
        			var checkedVal = false;
        			if (response[i].isSelected=='Y'){
        				checkedVal = true;
        			}
        			$scope.fieldNames.push({"title":response[i].columnName,"key": response[i].mappedName, "checked": checkedVal})
        		}
        	});

        $scope.saveGrids = function(){
        		var userGridDetails = [];
        		for (var i=0; i<$scope.fieldNames.length; i++){
        			var checkedVal = 'N';
        			if ($scope.fieldNames[i].checked){
        				checkedVal = 'Y';
        			}
        			userGridDetails.push({"columnName": $scope.fieldNames[i].title, "mappedName":$scope.fieldNames[i].key, "isSelected": checkedVal, "moduleCode": "NMR","detailGridId":"G1"});
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
        		angular.element($('#gridmodal').modal('hide'));
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
        }




});
