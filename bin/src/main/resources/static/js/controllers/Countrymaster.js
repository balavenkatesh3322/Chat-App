app.controller('CountrymasterCtrl', function($scope, $http,toaster,Connectivity, $rootScope, $window, $location, $filter,$timeout){	
	$scope.currentPage = 1;
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.geterrorstatuscode ="0";
	 $scope.unauthorize = function(arg1){
	  if (arg1){
	   $scope.haspermission = true;
	  }
	  $scope.hidebody = false;
	 }
	 
	 $scope.$on('$viewContentLoaded', function() {
		 $scope.dialog.close();
			
		});
	 

	 $scope.startsWith = function (actual, expected) {
	 		        var lowerStr = (actual + "").toLowerCase();
	 		        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	 }
	 
	 $scope.actions = [
         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
	 var i =0;
	 $scope.finishLoading = function() {
		   	var head = document.getElementsByTagName('head').item(0);
		   	var script = document.createElement('script');
		 	script.src = 'scripts/colors.js';
		    head.appendChild(script);
		    $timeout(function(){
			 if (i==1){
				 $timeout(function(){
					 load();
					 
				 },0).then(function(){
						document.getElementById("header").style.visibility = "visible";
						document.getElementById("navbar").style.visibility = "visible";
						
				 }).then(function(){
					 	document.getElementById("container").style.visibility = "visible";
					 	var loader = document.getElementById("loader");
					 	loader.style.opacity= 0;
					 	loader.style.transition = "opacity 1s ease-in-out";
					 	loader.addEventListener( 
					 		     'webkitTransitionEnd', 
					 		     function( event ) { 
					 		        loader.style.display = "none";
					 		     }, false );
				 });
			 }
			 i++;
	    }, 0);
	 }
	 
	 $http({
			method : 'GET',
			url: "/get-vessel-task-manager-data/",
		}).then(function(response){
	 $scope.vesselDetailList = response.data;
	 console.log($scope.vesselDetailList.length , '$scope.vesselDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
	 $scope.taskCount = $scope.vesselDetailList.length;
});
	
	
	
	$http({
		method : 'GET',
		url: "/get-notification-history-for-last-three-days-ship-date/",
	}).then(function successCallBack(response){
		 $scope.notificationList = response.data;
    	 $scope.notificationCount = $scope.notificationList.length;
	});
	
	
	$http({
		method : 'GET',
		url: "/get-user-detail-datas-ship-date/",
	}).then(function successCallBack(response){
		$scope.userDetailList = response.data;
   	 $scope.userrank = $scope.userDetailList[0].rankName;
   	 $scope.userrole = $scope.userDetailList[0].rolename;
   	 $scope.username = $scope.userDetailList[0].empName;
   	 $scope.usercode = $scope.userDetailList[0].userCode;
   	 $scope.vesselname = $scope.userDetailList[0].shipname;
   	 console.log($scope.userDetailList,'$scope.userDetailList >>>>>>>>>>>');
	});
	

	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	     
	
	 $rootScope.$on('$includeContentLoaded', function() {
		    $timeout(function(){
		         load();
		    });
		  });
	$scope.errorFlag = false;
	$scope.datastatus = true;
	$scope.pageSize = 25;
	var orderBy = $filter('orderBy');
	 var setSessionValues = function(){
         $scope.cruser = "USER"
         $scope.crdate = new Date();         
		 $scope.Add=true;		 
     }
	 setSessionValues();
	 
	 
	 $scope.retrivecountrymaster = function(){
		 Connectivity.IsOk().then(function(response){
	 $http({
	        method: 'GET',
	        url: "/get-countrymaster-values/",
	    }).then(	    	
	        function(response) {
	        	$scope.locationmasterlist=[];
	        	$scope.geterrormessages=response.data.message;	
	            $scope.geterrorstatus=response.data.errorstatus;
	            $scope.geterrorstatuscode=response.data.status;                
	            $scope.dataerror =response.data.message;
	            if(response.data.status==0 && response.data.length!=0 ){
	        	$scope.locationmasterlist = response.data.data;   
	        	}else{
	    			
	    			$scope.errordetails=response.data.exceptionDetail;
	               	$scope.showexception=response.data.showerrormessage
	               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
	    				$scope.dataerror = [response.data.message[0]]; 
	    		} 
	            
	    		});
	
	    },function(error){		 
		  $scope.dataerror = "Server not reached";
	   });
	 }

	 $scope.getcountrycode = function(){		 
		 if($scope.countrycode !=null && $scope.countrycode !=""){			 
			 form_data = {"countrycode": $scope.countrycode};		
		 $http({
		        method: 'POST',
		        url: "/get-countrycode/",
		        data: form_data
		    }).then(	    	
		        function(response) {     
		        	$scope.existscountry=response.data;
		        	
		        	if($scope.existscountry.length>0){		        		
		        		$scope.countrycodeCheck="Country Code is already exists";
		        		$scope.countrycodechecking=true;
		        		console.log($scope.existscountry);
		        	}
		        	else{
		        		$scope.countrycodechecking=false;
		        	}
		        });
		 }
	 
}
	 $scope.Myfun = function(){

		 $scope.Countrycode_error="";
		 $scope.countrynames_error="";
	 }
		 
	 
	 $scope.retrivecountrymaster();
	 // save country Master
	    $scope.saveForm = function(){	    	
	    	$scope.validation();	    	 
			if($scope.errorFlag == false){
				form_data = {'countrycode': $scope.countrycode,
						 'countryname':$scope.countryname,						 		 
				};
				$http({
				    url: "/country-master-form-submission/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }
				}).then(function(response){				
					$scope.reset();
					 $scope.retrivecountrymaster();
					 $scope.datastatus=false;					 
					 $scope.Data_status="Data has been successfully saved";
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					}).error(function () {
						$scope.datastatus=false;						
						$scope.Data_status="Data couldn't be saved. Please enter the required fields";
						$timeout(function () { $scope.datastatus = true; }, 3000);
					})
			};
	    };
	    
	    
	 // delete country Master
	    $scope.deleteForm = function(masterlist){ 
	    	
	  // 	$scope.validation();
	  // 	 if($scope.errorFlag == false){
	    	var result = confirm("Are you sure you want to Delete?");
			if(result){
				form_data = {
						'countrycode': masterlist.countrycode,
						 'countryname':masterlist.countryname,						 		 
				};
				$http({
				    url: "/delete-country-master-bycountrycode/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }
				}).then(function(response){	
					$scope.datastatus=false;
					 $scope.Data_status="Data has been successfully Deleted";
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.reset();
					 $scope.retrivecountrymaster();
					 $scope.resetbutton();
					}).error(function () {
						$scope.datastatus=false;						
						$scope.Data_status="Data couldn't be Deleted.";
						$timeout(function () { $scope.datastatus = true; }, 3000);
					});
		//	};
					
			}
	    }
	    
	    
	 // update country Master
	    $scope.updateForm = function(){		    	
	    	  	 {
				form_data = {'countrycode': $scope.countrycode,
						 'countryname':$scope.countryname,						 		 
				};
				$http({
				    url: "/update-country-master-bycountrycode/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }
				}).then(function(response){	
					$scope.datastatus=false;					
					$scope.Data_status="Data has been successfully Updated";
					$timeout(function () { $scope.datastatus = true; }, 3000);					
					$scope.reset();
					 $scope.retrivecountrymaster();
					 $scope.resetbutton();
					}).error(function () {
						$scope.datastatus=false;						
						$scope.Data_status="Data couldn't be Updated.";
						$timeout(function () { $scope.datastatus = true; }, 3000);
					})
			};
	    };
	    
	    //validation messages
	    $scope.validation = function(){
		    $scope.errorFlag = false;
		    if( document.getElementById('Countrycode').value==''){
		     $scope.Countrycode_error = 'Please enter the Country Code';
		    
		     $scope.errorFlag = true;
		     $scope.countrycodeerror=true;
		  
		    }
		    else{
		     $scope.TimeofDrill_error = '';
		    }
		    if(document.getElementById('countrynames').value==''){
			     $scope.countrynames_error = 'Please enter the Country Name';
			     $scope.errorFlag = true;
			     $scope.countrynameerror=true;
			    }
			    else{
			     $scope.ShipsPosition_error = '';
			    }
		    if($scope.countrycode !=null && $scope.countrycode !=""){
		 
		    }
	    }
	    
	   
	    
	    $scope.reset = function(){		    			    	 
		     $scope.countrycode=null;		    
		    $scope.countryname=null;
		    $scope.resetbutton();
			    
	    }
	    
	    
	    $scope.sort = function(sortname){
	    	console.log=("sort");
	    	$scope.sortkey=sortname;
	    	$scope.reverse=!$scope.reverse;    
	    }
	    
	    //reset button
	    $scope.resetbutton = function(){
	    $scope.save=false;
	    $scope.Add=true;
	    $scope.Delete=false;
	    $scope.Reset=false;
	    $scope.countrycodestatus=false;
	    }
	    
	    
	    //edit button
	    $scope.fetchvalue = function(countrycode,countryname){	    	
		     $scope.countrycode=countrycode;		    
		    $scope.countryname=countryname;	
		    $scope.save=true;
		    $scope.Add=false;
		    $scope.Reset=true;
		    $scope.Delete=true;
		    document.getElementById('countrynames').focus();
		    $scope.countrycodestatus=true;
		    $scope.countrycodeerror=false;
		    $scope.countrynameerror=false;
	    } 
	    
	    $scope.set_color = function (masterlist) {
	    	if (masterlist.activeStatus=='V') {
			    return { color: "red" }
			  }
		}
	    
	    		    
});
