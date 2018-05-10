app.service('systemNotificationService', function($filter,$http,$rootScope){
	
	this.ShowNotificationHistory = function(){
		return $http({
				method : 'GET',
				url: "/get-notification-history-for-last-three-days-ship-date/",
			});
	}
	this.getsearchdata = function(){
		return $http({
				method : 'GET',
				url: "/get-Search-data/",				
			});
	}
	
	this.getdataurl = function(getmodulecode){		
		return $http({
				method : 'GET',
				url : '/get-task-manager-url/',
				params : {
					modulecode : getmodulecode,
					pagetype:"L"
				}
			})	
	}
	
	
	this.ShowUserDetailData = function(){
		return $http({
				method : 'GET',
				url: "/get-user-detail-datas-ship-date/",
			});
	}
	
	this.getMasterModulesPermissions = function(){
		return $http({
				method : 'GET',
				url: "/get-master-modules-permissions/",
			});
	}
	
	this.ShowVesselTaskManagerData = function(){
		return $http({
			method : 'GET',
			url: "/get-vessel-task-manager-data/",
		});
	}
	
	this.updatecount = function(getformid) {
		return $http({
			method : 'GET',
			url : "/update-notification-count/",
			params : {
				formid : getformid
			}
		});
	}
	
	this.getnotifycount = function() {
		return $http({
			method : 'GET',
			url : "/get-notification-count/",
			
		});
	}
	
	this.getalertcount = function() {
		$http({
			method : 'GET',
			url : "/get-alert-count/",							
		}).then(
				function(response) {
					$rootScope.alertmessagecount = response.data.count ;									
				});
	}
	
	this.getUserProfilePicture = function(){
		return $http({
				method : 'GET',
				url: "/get-user-profile-picture/",
			});
	}
	
	this.getalertmessage = function() {
		$http({
			method : 'GET',
			url : "/getform-overdue-alert-message/",							
		}).then(
				function(response) {
					$rootScope.alertmessage = response.data;								
					$rootScope.alertmessagelength=$rootScope.alertmessage.length;								
				});
	}
	
	this.getLeftPanelBasedPermissions = function(){
		return $http({
				method : 'GET',
				url: "/get-left-panel-modules-permissions/"
			});
	}
	this.getParentbasedPermissions = function(code){
		return $http({
				method : 'GET',
				url: "/get-master-modules-permissions/?mdlcode="+code,
			});
	}
	this.getHeadTags = function(){
		return $http({
				method : 'GET',
				url: "/get-head-tags/",
			});
	}
	
	
	/*this.getParentbasedPermissions = function(code){
		return $http({
				method : 'GET',
				url: "/get-modules-permissions/?mdlcode="+code,
			});
	}*/
	
	this.getLeftPanelBasedPermissions = function(){
		return $http({
				method : 'GET',
				url: "/get-left-panel-modules-permissions/"
			});
	}
	

	// DashBoard
	this.generateNewDashboard = function(dashboardID, tabID1, tabID2, tabID3, filterValue, resultFn,inspectionCode,inspectionDateFilter){
		var ctrlVar = "tabDetails";
		$http({
			url : ctrlVar,
			method : "POST",
			params : {
				action : "getchartDetails",
				dashboardID : dashboardID,
				tabID : tabID1,
				filter : filterValue,
				insCode : 'null',
				inspectionDateFilter: inspectionDateFilter
			}
		}).then(function successCallback(output) {
			//bala
			resultFn(tabID1, output);			
		}).then(function fn1(){
			$http({
				url : ctrlVar,
				method : "POST",
				params : {
					action : "getchartDetails",
					dashboardID : dashboardID,
					tabID : tabID2,
					filter : filterValue,
					insCode : inspectionCode,
					inspectionDateFilter: inspectionDateFilter
				}
			}).then(function(data){
				resultFn(tabID2, data);		
			}).then(function(){
				$http({
					url : ctrlVar,
					method : "POST",
					params : {
						action : "getchartDetails",
						dashboardID : dashboardID,
						tabID : tabID3,
						filter : filterValue,
						insCode : 'null',
						inspectionDateFilter : inspectionDateFilter
					}
				}).then(function(data2){
					if(data2.data.data.length > 0 && data2.data.data != null) {
						$rootScope.taskmanagerdata=data2.data.data[1];
						$rootScope.taskmanagerdata= $filter('orderBy')($rootScope.taskmanagerdata, '-targetdate');
					}
					resultFn(tabID3, data2);		
				});
			});
		});
	}
	this.generateDashboard = function(dashboardID, tabID,filterValue, resultFn,inspectionCode, inspectionDateFilter) {
		var ctrlVar = "tabDetails"; 
		$http({
			url : ctrlVar,
			method : "POST",
			params : {
				action : "getchartDetails",
				dashboardID : dashboardID,
				tabID : tabID,
				filter : filterValue,
				insCode : inspectionCode,
				inspectionDateFilter : inspectionDateFilter
			}
		}).then(function successCallback(output) {
			resultFn(tabID, output);	
		}, function errorCallback(response) {
			alert(response)
		});
	};


	this.generateDashboardReport = function(dashboardName) {
		return $http({
			url : "tabReports",
			method : "POST",
			params : {
				dashName : dashboardName
			}
		});
	}; 				
	
	
	 this.getinspectionCode	 = function() {
        return $http({
            method: 'GET',
            url: "/get-inspectioncode/",
        })
    }
	 
		this.getFilter_Tab_Details = function(URL, dashboardNames, resultFn) {
			$http({
				url : URL ,
				method : "POST",
				params : {
					dashName : dashboardNames
				}
			}).then(function successCallback(output) {
				resultFn(output);
			}, function errorCallback(response) {
				// alert(response)
			});
		};
		
});