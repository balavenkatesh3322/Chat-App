app.controller('Taskschedulectrl', function($scope, $http, $window,$rootScope, $location,toaster,systemNotificationService,Connectivity, $filter,$timeout,$routeParams){

	$scope.geterrorstatuscode ="0";

    $scope.activeTab = "OD";
    $scope.search = {};
	$scope.hidebody = true;
	var date = new Date();
	 $scope.haspermission = false;
	 $scope.unauthorize = function(arg1){
	  if (arg1){
	   $scope.haspermission = true;
	  }
	  $scope.hidebody = false;
	 }

	 $scope.pageSize = 25;

	 $scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	}

	     $scope.layoutactions = [
	                             { text: 'Set Default', action: function(){$scope.saveGrids()}}
	                         ];

	                     $scope.openLayoutDialog = function(){
	                         		$scope.layoutdialog.open();
	                         	}
	                     
	                     $scope.openpletedcomLayoutDialog = function(){
                      		$scope.completedlayoutdialog.open();
                      	}
	                     
	                     $scope.openpletedfollowLayoutDialog = function(){
	                      		$scope.followlayoutdialog.open();
	                      	}
	     
	 $scope.$on('$viewContentLoaded', function() {
			$scope.dialog.close();
			$scope.layoutdialog.close();
			$scope.completedlayoutdialog.close();
			$scope.followlayoutdialog.close();
		});
	 $scope.actions = [
	                   { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
	               ];
	 var Navigationstatus=$routeParams.name;

	  $scope.countFrom = 0;

	  $scope.validatepercentage=function(userdata,index){
		  if($scope[userdata][index].processpercent!=null && $scope[userdata][index].processpercent>100){
			  $scope[userdata][index].processpercent=Math.floor($scope[userdata][index].processpercent/10);
		  }
	  }

	 $scope.changestate=function(state){
		 	$scope.activeTab = state;

		 	if($scope.activeTab === undefined) {
		 		$scope.activeTab = "TD";
		 	}

	    	if(state=='OD' || Navigationstatus=='Overdue'){
	    		$scope.overdue=true;
	    		$scope.today=false;
	    		$scope.complete=false;
	    		$scope.upcoming=false;
	    		$scope.follow=false;
	    	}else if(state=='TD' || Navigationstatus=='Today'){
	    		$scope.overdue=false;
	    		$scope.today=true;
	    		$scope.complete=false;
	    		$scope.upcoming=false;
	    		$scope.follow=false;
	    	}else if(state=='CO' || Navigationstatus=='Completed'){
	    		$scope.overdue=false;
	    		$scope.today=false;
	    		$scope.complete=true;
	    		$scope.upcoming=false;
	    		$scope.follow=false;
	    	}else if(state=='UP' || Navigationstatus=='Upcoming'){
	    		$scope.overdue=false;
	    		$scope.today=false;
	    		$scope.complete=false;
	    		$scope.upcoming=true;
	    		$scope.follow=false;
	    	}else if(state=='FW' || Navigationstatus=='Follow'){
	    		$scope.overdue=false;
	    		$scope.today=false;
	    		$scope.complete=false;
	    		$scope.upcoming=false;
	    		$scope.follow=true;
	    	}
	    	Navigationstatus="";
	    }
	    $scope.changestate();




	 var setSessionValues = function(){
        $scope.date = new Date();
        $scope.year=new Date().getFullYear()
        }
	 setSessionValues();
	  $scope.todaytaskstatus=[];
	  $scope.setoverduestatus=[];
	  $scope.setupcomingtaskstatus=[];


	// get task status Names
	  $scope.taskdetails=function(){
		  $rootScope.showScreenOverlay = true;
	    $http({
	        method: 'GET',
	        url: "/get-task-data-by-no/",
	    }).then(
	        function(response) {
	        	$scope.geterrormessages=response.data.message;
                $scope.geterrorstatus=response.data.errorstatus;
                $scope.geterrorstatuscode=response.data.status;
                $scope.dataerror =response.data.message;
            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){
	        	$scope.userdetails=response.data.data[0].userDetail;
	        	$scope.taskstatus = response.data.data[0].taskstatusdetails;
	        	$scope.taskstatusdetails = response.data.data[0].todaytaskmanager;
	        	 $scope.taskstatusdetails = $filter('orderBy')($scope.taskstatusdetails, 'assigneddate', true);	        	
	        	$scope.Taskstatusnamestatuscode=$scope.taskstatusdetails.taskstatus;
	        	for (var i=0; i<$scope.taskstatusdetails.length; i++){
	        		$scope.todaytaskstatus[$scope.taskstatusdetails[i].taskid] = $scope.taskstatusdetails[i].taskstatus;
	        	}
	        	$scope.upcomingtaskstatus =response.data.data[0].upcomingtaskmanager;
	        	 $scope.upcomingtaskstatus = $filter('orderBy')($scope.upcomingtaskstatus, 'assigneddate', true);
	        	for (var i=0; i<$scope.upcomingtaskstatus.length; i++){
	        		$scope.setupcomingtaskstatus[$scope.upcomingtaskstatus[i].taskid] = $scope.upcomingtaskstatus[i].taskstatus;
	        	}
	        	$scope.overduetaskstatus = response.data.data[0].overduetaskmanager;
	        	 $scope.overduetaskstatus = $filter('orderBy')($scope.overduetaskstatus, 'assigneddate', true);
	        	for (var i=0; i<$scope.overduetaskstatus.length; i++){
	        		$scope.setoverduestatus[$scope.overduetaskstatus[i].taskid] = $scope.overduetaskstatus[i].taskstatus;
	        	}
	        	$scope.followtaskstatus =response.data.data[0].followertaskmanager;
	        	$scope.followtaskstatus = $filter('orderBy')($scope.followtaskstatus, 'assigneddate', true);

	        	$scope.completedtaskstatus = response.data.data[0].completedtaskmanager;
	        	$scope.completedtaskstatus = $filter('orderBy')($scope.completedtaskstatus, 'assigneddate', true);
	        	$scope.todayLength = $scope.taskstatusdetails.length;
	        	$scope.followLength = $scope.followtaskstatus.length;
	        	$scope.completedLength = $scope.completedtaskstatus.length;
	        	$scope.overdueLength = $scope.overduetaskstatus.length;
	        	$scope.upcomingLength = $scope.upcomingtaskstatus.length;

	        	$scope.totaltask = $scope.todayLength + $scope.followLength + $scope.completedLength + $scope.overdueLength + $scope.upcomingLength;


            	}else{
             		$scope.errordetails=response.data.exceptionDetail;
                 	$scope.showexception=response.data.showerrormessage
                 	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;
 					$scope.dataerror = [response.data.message[0]];
 				}
            	$rootScope.showScreenOverlay = false;
	        });
	  }
	  $scope.taskdetails();


	  $scope.changestatus=function(gettaskid){
		  formdata = {'taskid': gettaskid ,
		    			'viewdate':new Date().toISOString(),
					    
				},
		   $http({	   
				 method: 'POST',
			     data:formdata,			   
	              url: "/update-taskmangerstatus/",
	    }).then(
	        function(response) {
	        
	        
	  });
	  }
	  
	  $scope.changefollowstatus=function(gettaskid){
		  formdata = {'taskid': gettaskid ,
		    			'viewdate':new Date().toISOString(),
					    
				},
		   $http({	   
				 method: 'POST',
			     data:formdata,			   
	              url: "/update-taskmanger-followstatus/",
	    }).then(
	        function(response) {
	        
	        
	  });
	  }
	  

	    $scope.todaytaskcheck= function(statuscode, index) {
	    	if(statuscode=="TS001"){
	    		$scope.taskstatusdetails[index].processpercent =0;
	    	}else if(statuscode=="TS002"){
	    		$scope.taskstatusdetails[index].processpercent=1;
	    	}
	    	else if(statuscode=="TS003"){
	    		$scope.taskstatusdetails[index].processpercent=100;
	    	}
	    	};

	    	 $scope.overduetaskcheck= function(statuscode, index) {
	 	    	if(statuscode=="TS001"){
	 	    		$scope.overduetaskstatus[index].processpercent =0;
	 	    	}else if(statuscode=="TS002"){
	 	    		$scope.overduetaskstatus[index].processpercent=1;
	 	    	}
	 	    	else if(statuscode=="TS003"){
	 	    		$scope.overduetaskstatus[index].processpercent=100;
	 	    	}
	 	    	};

	 	    	 $scope.upcomingtaskcheck= function(statuscode, index) {
	 	 	    	if(statuscode=="TS001"){
	 	 	    		$scope.upcomingtaskstatus[index].processpercent =0;
	 	 	    	}else if(statuscode=="TS002"){
	 	 	    		$scope.upcomingtaskstatus[index].processpercent=1;
	 	 	    	}
	 	 	    	else if(statuscode=="TS003"){
	 	 	    		$scope.upcomingtaskstatus[index].processpercent=100;
	 	 	    	}
	 	 	    	};


	 	 	    	$scope.errormessage = [];
	    //save  task
	    $scope.savetask= function(taskid,taskdesc,depcode,prioritycode,assignedby,assigneddate,targetdate,statuscode,processpercent){
	    	if(statuscode== undefined){
	    		$scope.dialog.open();
	    		var message="please select status"
	    		$scope.errormessage.push(message);
				$scope.dataerror =$scope.errormessage ;

	    	}
	    	else if(processpercent!=0 && statuscode=='TS001'){
	    		$scope.dialog.open();
	    		var message="please change status"
	    			$scope.errormessage.push(message);
				$scope.dataerror = $scope.errormessage;

	    	}
	    	else if (processpercent== 0){
	    		$scope.dialog.open();
	    		var message="please update processpercent"
	    			$scope.errormessage.push(message);
				$scope.dataerror = $scope.errormessage;
	    	}else if (processpercent== undefined){
	    		$scope.dialog.open();
	    		var message="please update validate percentage"
	    			$scope.errormessage.push(message);
				$scope.dataerror = $scope.errormessage;
	    	}else if (processpercent==100 && statuscode!='TS003'){
	    		$scope.dialog.open();
	    		var message="please change closed status"
	    			$scope.errormessage.push(message);
				$scope.dataerror = $scope.errormessage;
	    	}else{
	    	if(processpercent<=100 && statuscode=='TS003'){
	    		processpercent=100;
	    		$scope.completedate=$scope.date;

	    	}
	    	formdata = {'taskid': taskid ,
	    			'processpercent':processpercent,
				    'taskstatus':statuscode,
				    'completeddate':$scope.completedate,
			}

				$http({
				    url: "/update-todaytask-form-submissions/",
				    method: 'POST',
				    data:formdata,
				}).then(function(response){
					if(response.data.status==0 && response.data.length!=0 ){
						toaster.success({title: "Information", body:"Task scheduler data "+response.data.successMessage});
						$scope.taskdetails();
						}else{
							$scope.dialog.open();
							$scope.dataerror = response.data.message;

						}
					});


	    	}
			};


			$scope.path = '';
			$scope.referenceClicked = function(modulecode,formid,taskid){
				if(modulecode.length >0){
					 $scope.changestatus(taskid)
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
			
			$scope.path = '';
			$scope.referenceClickedforfollow = function(modulecode,formid,taskid){
				if(modulecode.length >0){
					 $scope.changefollowstatus(taskid)
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
        		url: "/user-grid-details/?mdlcode=VTK&gridid=G1",
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
        	
        	$scope.completedfieldNames = [];
        	$http({
        		method : 'GET',
        		url: "/user-grid-details/?mdlcode=VTK&gridid=G2",
        	}).then(function(response){
        		response =response.data;
        		for(var i=0; i<response.length; i++){
        			var checkedVal = false;
        			if (response[i].isSelected=='Y'){
        				checkedVal = true;
        			}
        			$scope.completedfieldNames.push({"title":response[i].columnName,"key": response[i].mappedName, "checked": checkedVal})
        		}
        	});

        	
        	$scope.followfieldNames = [];
        	$http({
        		method : 'GET',
        		url: "/user-grid-details/?mdlcode=VTK&gridid=G3",
        	}).then(function(response){
        		response =response.data;
        		for(var i=0; i<response.length; i++){
        			var checkedVal = false;
        			if (response[i].isSelected=='Y'){
        				checkedVal = true;
        			}
        			$scope.followfieldNames.push({"title":response[i].columnName,"key": response[i].mappedName, "checked": checkedVal})
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
        	update_columns_fieldNames();
            }, true);
            var update_columns_fieldNames = function() {
        	$scope.ordered_columns = [];
        	for (var i = 0; i < $scope.fieldNames.length; i++) {
        	  var column = $scope.fieldNames[i];
        	  if (column.checked) {
        		  $scope.ordered_columns.push(column);
        	  }
        	}
        }

            $scope.$watch('completedfieldNames', function() {
            	update_columns();
                }, true);
                var update_columns = function() {
            	$scope.completedordered_columns = [];
            	for (var i = 0; i < $scope.completedfieldNames.length; i++) {
            	  var column = $scope.completedfieldNames[i];
            	  if (column.checked) {
            		  $scope.completedordered_columns.push(column);
            	  }
            	}
            }	
			
                $scope.$watch('followfieldNames', function() {
                	update_followcolumns();
                    }, true);
                    var update_followcolumns = function() {
                	$scope.followordered_columns = [];
                	for (var i = 0; i < $scope.followfieldNames.length; i++) {
                	  var column = $scope.followfieldNames[i];
                	  if (column.checked) {
                		  $scope.followordered_columns.push(column);
                	  }
                	}
                }	
			
});
