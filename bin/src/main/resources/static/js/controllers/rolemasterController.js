app.controller('RankMasterCtrl', function($scope, $rootScope, Connectivity,$http, $window,$location, $filter, $timeout,$compile) {
	$scope.currentPage = 1;
	$scope.hidebody = true;
	$scope.haspermission = false;
	$scope.geterrorstatuscode ="0";
	$scope.unauthorize = function(arg1) {
		if (arg1) {
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.dialog.close();
	
	});
	
	$scope.actions = [
        { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
    ];
	
	
	
	 $http({
	     method : 'GET',
	     url: "/get-vessel-task-manager-data/",
	    }).then(function(response){
	    $scope.shoreDetailList = response.data;
	    console.log($scope.shoreDetailList.length , '$scope.shoreDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
	    $scope.taskCount = $scope.shoreDetailList.length;
	  });
	 
	 $http({
		  method : 'GET',
		  url: "/get-notification-history-for-last-three-days-shore-date/",
		 }).then(function successCallBack(response){
		   $scope.notificationList = response.data;
		      $scope.notificationCount = $scope.notificationList.length;
		      console.log($scope.notificationList , '$scope.notificationList >>>>>>>>>>>>********** ')
		 });
	
	
	$http({
		method : 'GET',
		url: "/get-user-detail-datas-shore-date/",
	}).then(function successCallBack(response){
		$scope.userDetailList = response.data;
   	 $scope.userrank = $scope.userDetailList[0].rankName;
   	 $scope.userrole = $scope.userDetailList[0].rolename;
   	 $scope.username = $scope.userDetailList[0].empName;
   	 $scope.usercode = $scope.userDetailList[0].userCode;
   	 $scope.shorename = $scope.userDetailList[0].shorename;
   	 console.log($scope.userDetailList,'$scope.userDetailList >>>>>>>>>>>');
	});
	
	
	$scope.hideError = function(rankName) {
    	var rks = rankName + "_error";
    	$scope[rks] = "";
    }
	
	$scope.errorFlag = true;
	$scope.ranks = [];
//	$scope.pageSize = 25;
	$scope.pageSize = $rootScope.defaultPageSize;
	$scope.shouldShow1 = true;
	$scope.rankdisable = true;
	$scope.datastatus = true;
	var setSessionValues = function() {
	}
	setSessionValues();
	
	
	 Connectivity.IsOk().then(function(response){
	$http({
		url : "/retrieve_rank_master/",
		method : 'GET',

	}).then(function successCallback(response) {
		$scope.geterrormessages=response.data.message; 
        $scope.geterrorstatus=response.data.errorstatus;
        $scope.geterrorstatuscode=response.data.status;                
        $scope.dataerror =response.data.message;
        if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
	
		$scope.ranks = response.data.data;
        }else
		{
			 /*$scope.newdialog.open();
			 $Scope.dataerror = response.data.message;*/	
			
			 $scope.errordetails=response.data.exceptionDetail;
            $scope.showexception=response.data.showerrormessage
            $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace; 
            $scope.dataerror = [response.data.message[0]];
			
			}
	});
	 } , function(error){		 
		  $scope.dataerror = "Server not reached";
	  })
	
	
	
	
	
	
	
	
	
	
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	}	     
	$scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	}
	$scope.$watch('selected', function(fac) {
		$scope.$broadcast("rowSelected", fac);
	});

	$scope.saveRankMaster = function() {
		$scope.validation();
		if ($scope.errorFlag == true) {
			form_data = {
				'rankcode' : $scope.rankcode,
				'rankname' : $scope.rankname,
			};
			$http({
				url : "/save_rank_master/",
				dataType : 'json',
				method : 'POST',
				data : form_data,
				headers : {
					"Content-Type" : "application/json"
				}
			}).then(function successCallback(response) {
				$http({
					url : "/retrieve_rank_master/",
					method : 'GET',

				}).then(function successCallback(response) {
					$scope.ranks = response.data;
					$scope.datastatus = false;
					$scope.informationMessage = 'Successfully Saved!';
					$timeout(function() {
						$scope.datastatus = true;
					}, 3000);
					$scope.rankname = "";
					
				});
			});
		}
		;
	}
	
	$scope.validation = function() {
		$scope.errorFlag = true;

		if (document.getElementById('rankname').value == '') {
			$scope.rankName_error = 'Enter the Rank Name';
			$timeout(function () { $scope.datastatus = true; }, 3000);
			$scope.errorFlag = false;
		} else {
			$scope.rankName_error = '';
		}
	}

	$scope.rankMasterEdit = function(ranks) {
		if (ranks.active_status == 'V') {
			$scope.informationMessage = 'Deleted record cannot be Edited';
		} else {
			$scope.shouldShow = true;
			$scope.shouldShow1 = false;
			$scope.id = ranks.id, 
			$scope.rankcode = ranks.rankcode,
			$scope.rankname = ranks.rankname,
			$scope.cruser = ranks.cruser;
			$scope.crdate = ranks.crdate;
			$scope.upduser = ranks.upduser;
			$scope.upddate = ranks.upddate;
		}
	}

	$scope.updateRankMaster = function() {
		$scope.validation();
		if ($scope.errorFlag == true) {
			form_data = {
				'id' : $scope.id,
				'rankcode' : $scope.rankcode,
				'rankname' : $scope.rankname,
				'cruser' : $scope.cruser,
				'crdate' : $scope.crdate,
				'active_status' : $scope.active_status,
			}
			$http({
				url : "/update_rank_master/",
				dataType : 'json',
				method : 'POST',
				data : form_data,
				headers : {
					"Content-Type" : "application/json"
				}
			}).then(function successCallback(response) {
				$http({
					url : "/retrieve_rank_master/",
					method : 'GET',
				}).then(function successCallback(response) {
					$scope.ranks = response.data;
					$scope.datastatus = false;
					$scope.informationMessage = 'Successfully Updated!';
					$timeout(function() { $scope.datastatus = true; }, 3000);
					$scope.rankname = "";
					$scope.shouldShow = false;
					$scope.shouldShow1 = true;
				});
			});
		}
	}

	$scope.removeRankMaster = function(rank) {

		var result = confirm("Are you sure you want to Delete?");
		if (result) {
			form_data = {
				'id' : rank.id,
				'rankcode' : rank.rankcode,
				'rankname' : rank.rankname,
				'cruser' : rank.cruser,
				'crdate' : rank.crdate,
			}
			$http({
				url : "/delete_rank_master/",
				dataType : 'json',
				method : 'POST',
				data : form_data,
				headers : {
					"Content-Type" : "application/json"
				}
			}).then(function successCallback(response) {
				$http({
					url : "/retrieve_rank_master/",
					method : 'GET',

				}).then(function successCallback(response) {
					$scope.ranks = response.data;
					$scope.datastatus = false;
					$scope.informationMessage = 'Rank Master Removed!';
					$timeout(function() {
						$scope.datastatus = true;
					}, 3000);
					$scope.rankname = "";
					$scope.shouldShow = false;
					$scope.shouldShow1 = true;
				});
			});
		}

	}

	$scope.set_colorrank = function(rank) {
		if (rank.activeStatus == 'V') {
			return {
				color : "red"
			}
		}
	}
	
	$scope.startsWith = function (actual, expected) {
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	}

	$scope.cancelRank = function() {
		$scope.shouldShow1 = true;
		$scope.shouldShow = false;
		$scope.rankname = "";
	};

	$scope.bindPagination = function(){
		var parent = $('#nav-tabs-0-3').find('.text-center'); // DOM element where the compiled template can be appended
		var html = '<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" default-page-number="1"> </dir-pagination-controls>';
// Step 1: parse HTML into DOM element
		var template = angular.element(html);

		// Step 2: compile the template
		var linkFn = $compile(template);

		// Step 3: link the compiled template with the scope.
		var element = linkFn($scope);

		// Step 4: Append to DOM (optional)
		parent.empty();
		parent.append(element);
	}
});

app.controller('RankMappingCtrl', function($scope, $rootScope,Connectivity ,$http, $window,$location, $filter, $timeout,$compile) {
	$scope.currentPage = 1;
	$scope.hidebody = true;
	$scope.haspermission = false;
	$scope.geterrorstatuscode ="0";
	$scope.unauthorize = function(arg1) {
		if (arg1) {
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	}
	
	 $scope.$on('$viewContentLoaded', function() {
			$scope.dialog.close();
		
		});
		
		$scope.actions = [
	        { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
	    ];
	
	 $http({
	     method : 'GET',
	     url: "/get-vessel-task-manager-data/",
	    }).then(function(response){
	    $scope.shoreDetailList = response.data;
	    console.log($scope.shoreDetailList.length , '$scope.shoreDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
	    $scope.taskCount = $scope.shoreDetailList.length;
	  });
	 
	 $http({
		  method : 'GET',
		  url: "/get-notification-history-for-last-three-days-shore-date/",
		 }).then(function successCallBack(response){
		   $scope.notificationList = response.data;
		      $scope.notificationCount = $scope.notificationList.length;
		      console.log($scope.notificationList , '$scope.notificationList >>>>>>>>>>>>********** ')
		 });
	
	
	$http({
		method : 'GET',
		url: "/get-user-detail-datas-shore-date/",
	}).then(function successCallBack(response){
		$scope.userDetailList = response.data;
   	 $scope.userrank = $scope.userDetailList[0].rankName;
   	 $scope.userrole = $scope.userDetailList[0].rolename;
   	 $scope.username = $scope.userDetailList[0].empName;
   	 $scope.usercode = $scope.userDetailList[0].userCode;
   	 $scope.shorename = $scope.userDetailList[0].shorename;
   	 console.log($scope.userDetailList,'$scope.userDetailList >>>>>>>>>>>');
	});
	

	$scope.startsWith = function (actual, expected) {
			        var lowerStr = (actual + "").toLowerCase();
			        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	}
	
	$scope.hideError = function(rankName) {
    	var rnk = rankName + "_error";
    	$scope[rnk] = "";
    }
	
	$scope.errorFlag = true;
	$scope.ranks = [];
	$scope.rolecrtn = [];
	$scope.depcrtn = [];
	$scope.rankcrtn = [];
//	$scope.pageSize = 25;
	$scope.pageSize = $rootScope.defaultPageSize;
	$scope.shouldShow1 = true;
	$scope.rankdisable = true;
	$scope.datastatus = true;
	var setSessionValues = function() {
	}
	setSessionValues();
	$scope.hideDepartmentModal = function() {
		$scope.showDepartmentModal = false;
	}
	$scope.setValue = function(arg1, arg2) {
		$scope.depcode = arg1;
		$scope.depname = arg2;
		$scope.hideDepartmentModal();
	}
	
	
	
	 Connectivity.IsOk().then(function(response){
	$http({
		url : "/retrieve_rankmapping_details/",
		method : 'GET',

	}).then(function successCallback(response) {
		
		$scope.geterrormessages=response.data.message; 
        $scope.geterrorstatus=response.data.errorstatus;
        $scope.geterrorstatuscode=response.data.status;                
        $scope.dataerror =response.data.message;
		if((response.data.status==0 )||(response.data.errorstatus=="SV")){
		$scope.ranks = response.data.data;
		}else
		{
			$scope.errordetails=response.data.exceptionDetail;
            $scope.showexception=response.data.showerrormessage
            $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace; 
            $scope.dataerror = [response.data.message[0]];
		}
	});
	 } , function(error){		 
		  $scope.dataerror = "Server not reached";
	  })
	
	
	
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	}	     
	$scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	}
	$scope.$watch('selected', function(fac) {
		$scope.$broadcast("rowSelected", fac);
	});

	$scope.saveRankDetail = function() {
		$scope.validation();
		if ($scope.errorFlag == true) {
			form_data = {
				'rankcode' : $scope.rankcode,
				'rankname' : $scope.rankname,
				'depname' : $scope.depname,
				'rolename' : $scope.rolename,
			};
			$http({
				url : "/save_rankmapping_details/",
				dataType : 'json',
				method : 'POST',
				data : form_data,
				headers : {
					"Content-Type" : "application/json"
				}
			}).then(function successCallback(response) {
				$http({
					url : "/retrieve_rankmapping_details/",
					method : 'GET',

				}).then(function successCallback(response) {
					$scope.ranks = response.data;
					$scope.datastatus = false;
					$scope.informationMessage = 'Successfully Saved!';
					$timeout(function() {
						$scope.datastatus = true;
					}, 3000);
					$scope.rankcode = "";
					$scope.rankname = "";
					$scope.depcode = "";
					$scope.depname = "";
					$scope.rolecode = "";
					$scope.rolename = "";
					
				});
			});
		}
		;
	}

	$scope.rankMasterEdit = function(rank) {
		if (rank.active_status == 'V') {
			$scope.informationMessage = 'Deleted record cannot be Edited';
		} else {
			$scope.shouldShow = true;
			$scope.shouldShow1 = false;
			$scope.id = rank.id, $scope.rankcode = rank.rankcode,
					$scope.rankname = rank.rankname,
					$scope.depcode = rank.depcode,
					$scope.depname = rank.depname,
					$scope.rolecode = rank.rolecode,
					$scope.rolename = rank.rolename,
					$scope.cruser = rank.cruser;
			$scope.crdate = rank.crdate;
			$scope.upduser = rank.upddate;
		}
	}

	$scope.updateRank = function() {
		$scope.validation();
		if ($scope.errorFlag == true) {
			form_data = {
				'id' : $scope.id,
				'rankcode' : $scope.rankcode,
				'rankname' : $scope.rankname,
				'depcode' : $scope.depcode,
				'depname' : $scope.depname,
				'rolecode' : $scope.rolecode,
				'rolename' : $scope.rolename,
				'cruser' : $scope.cruser,
				'crdate' : $scope.crdate,
				'active_status' : $scope.active_status,
			}
			$http({
				url : "/update_rankmapping_details/",
				dataType : 'json',
				method : 'POST',
				data : form_data,
				headers : {
					"Content-Type" : "application/json"
				}
			}).then(function successCallback(response) {
				$http({
					url : "/retrieve_rankmapping_details/",
					method : 'GET',
				}).then(function successCallback(response) {
					$scope.ranks = response.data;
					$scope.datastatus = false;
					$scope.informationMessage = 'Successfully Updated!';
					$timeout(function() { $scope.datastatus = true; }, 3000);
					$scope.rankname = "";
					$scope.depcode = "";
					$scope.depname = "";
					$scope.rolecode = "";
					$scope.rolename = "";
					$scope.shouldShow = false;
					$scope.shouldShow1 = true;
				});
			});
		}
	}

	$scope.removeRankDetail = function(rank) {

		var result = confirm("Are you sure you want to Delete?");
		if (result) {
			form_data = {
				'id' : rank.id,
				'rankcode' : rank.rankcode,
				'rankname' : rank.rankname,
				'depname' : rank.depname,
				'rolename' : rank.rolename,
				'cruser' : rank.cruser,
				'crdate' : rank.crdate,
			}
			$scope.rankcode = "";
			$scope.rankname = "";
			$http({
				url : "/delete_rankmapping_details/",
				dataType : 'json',
				method : 'POST',
				data : form_data,
				headers : {
					"Content-Type" : "application/json"
				}
			}).then(function successCallback(response) {
				$http({
					url : "/retrieve_rankmapping_details/",
					method : 'GET',

				}).then(function successCallback(response) {
					$scope.ranks = response.data;
					$scope.datastatus = false;
					$scope.informationMessage = 'Rank Master Removed!';
					$timeout(function() {
						$scope.datastatus = true;
					}, 3000);
					$scope.rankname = "";
					$scope.shouldShow = false;
					$scope.shouldShow1 = true;
				});
			});
		}

	}

	$scope.set_colorrank = function(rank) {
		if (rank.activeStatus == 'V') {
			return {
				color : "red"
			}
		}
	}

	$scope.cancelRank = function() {
		$scope.shouldShow1 = true;
		$scope.shouldShow = false;
		$scope.rankname = "";
		$scope.depname = "";
		$scope.depcode = "";
		$scope.rolename = "";
		$scope.rolecode = "";
	};

	$scope.validation = function() {
		$scope.errorFlag = true;

		if (document.getElementById('rankname').value == '') {
			$scope.rankName_error = 'Enter the Rank Code';
			$scope.errorFlag = false;
		} else {
			$scope.rankName_error = '';
		}
		if (document.getElementById('depcode').value == '') {
			$scope.depCode_error = 'Enter the Department Code';
			$scope.errorFlag = false;
		} else {
			$scope.depCode_error = '';
		}
		if (document.getElementById('rolecode').value == '') {
			$scope.roleCode_error = 'Enter the Role Code';
			$scope.errorFlag = false;
		} else {
			$scope.roleCode_error = '';
		}
	}

	$scope.showModal = false;
	$scope.depListData = [];
	$http({
		method : 'GET',
		url : "/retrieve_departmentcode/",
	}).then(function successCallback(responses) {
		$scope.depcrtn = responses.data;
		angular.forEach($scope.depcrtn, function(value, key) {
			var depcode = value.depcode;
			var depname = value.depname;
			$scope.depListData.push({
				"key" : depcode,
				"value" : depname
			});
		});
	});

	$scope.hide = function() {
		$scope.showModal = false;
	}

	$scope.showRoleModal = false;
	$scope.roleListData = [];
	$http({
		method : 'GET',
		url : "/retrieve_rolecode/",
	}).then(function successCallback(responses) {
		$scope.rolecrtn = responses.data;
		angular.forEach($scope.rolecrtn, function(value, key) {
			var rolecode = value.rolecode;
			var rolename = value.rolename;
			$scope.roleListData.push({
				"key" : rolecode,
				"value" : rolename
			});
		});
	});

	$scope.hide = function() {
		$scope.showRoleModal = false;
	}
	$scope.setRoleValue = function(arg1, arg2) {
		$scope.rolecode = arg1;
		$scope.rolename = arg2;
		$scope.hide();
	}
	
	$scope.showRankModal = false;
	$scope.rankListData = [];
	console.log("kkkkkkkkkkkk");
	$http({
		method : 'GET',
		url : "/retrieve_rankcode/",
	}).then(function successCallback(responses) {
		$scope.rankcrtn = responses.data;
		angular.forEach($scope.rankcrtn, function(value, key) {
			var rankcode = value.rankcode;
			var rankname = value.rankname;
			$scope.rankListData.push({
				"key" : rankcode,
				"value" : rankname
			});
		});
	});

	$scope.hiden = function() {
		$scope.showRankModal = false;
	}
	
	$scope.setRankValue = function(arg1, arg2) {
		$scope.rankcode = arg1;
		$scope.rankname = arg2;
		$scope.hiden();
	}
	$scope.bindPagination = function(){
		var parent = $('#nav-tabs-0-3').find('.text-center'); // DOM element where the compiled template can be appended
		var html = '<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" default-page-number="1"> </dir-pagination-controls>';
// Step 1: parse HTML into DOM element
		var template = angular.element(html);

		// Step 2: compile the template
		var linkFn = $compile(template);

		// Step 3: link the compiled template with the scope.
		var element = linkFn($scope);

		// Step 4: Append to DOM (optional)
		parent.empty();
		parent.append(element);
	}
});