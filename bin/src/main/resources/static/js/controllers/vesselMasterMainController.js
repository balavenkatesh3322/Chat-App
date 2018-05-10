app.controller('vesselMasterMainCtrl', function($scope,  $http,$rootScope, $window,  $filter,$timeout,vesselMasterService) {
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.unauthorize = function(arg1){
	  if (arg1){
	   $scope.haspermission = true;
	  }
	  $scope.hidebody = false;
	 }
	 $scope.pageSize = $rootScope.defaultPageSize;
    	$scope.sort = function(predicate) {
  	       $scope.predicate = predicate;
  	     }	     
  	     $scope.isSorted = function(predicate) {
  	       return ($scope.predicate == predicate)
  	     }

//        $scope.flagsList = [];
//        vesselMasterService.getVesselMasterFlags().then(function(response) {
//            $scope.flagsList = response.data;
//
//        });
//        
//        $scope.fleetList = [];
//        vesselMasterService.getVesselMasterFleets().then(function(response) {
//            $scope.fleetList = response.data;
//        });
    	
        $scope.vesselMasterFormsList = [];
        $rootScope.showScreenOverlay = true;
        vesselMasterService.getVesselMasterForms().then(function(response) {
        	console.log(response,'response >>>>>>>>>>>>>>>>>>>>>>>>>>> ')
        	var temp = response.data.data;
            temp = $filter('orderBy')(temp, 'vesselcode', false)
            $scope.vesselMasterFormsList = temp;
            console.log($scope.vesselMasterFormsList,'$scope.vesselMasterFormsList $$$$$$$$$$$$$$$$$$$$$ ')
            $rootScope.showScreenOverlay = false;
        });
        
//        $scope.vesselTypeList = [];
//        vesselMasterService.getVesselTypes().then(function(response) {
//            $scope.vesselTypeList = response.data;
//        });

        $scope.importExcel = function () {
        	console.log($('#importFile')[0].files[0],'inside import excwel >>>>>>>>>>>>>>> ');
        	console.log($('#importFile'),'inside import excwel >>>>>>>>>>>>>>> ');
            if ($('#importFile')[0].files[0]) {
                wijmo.grid.xlsx.FlexGridXlsxConverter.load($scope.ctx.flexGrid, $('#importFile')[0].files[0], { includeColumnHeaders: $scope.ctx.includeColumnHeader });
            }
        }
    });