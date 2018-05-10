app.controller('USDController', function($scope, $http, $window,$rootScope, toaster, $location, $filter, $timeout,$routeParams,Connectivity){
	
	/******* PROFILE PIC *********/
	
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.diplaySave = false;
    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
      $scope.diplaySave = true;
    };
    
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.setDP = function(dp) {
    	$rootScope.showScreenOverlay = true;
		$http({
		        method: 'POST',
		        url: "/set-profile-pic/",
		        data : $scope.myCroppedImage,
		    }).then(function successCallback(response){
		    	$rootScope.profileURI = $scope.myCroppedImage;
		    	$scope.selectedUserProfile = $scope.myCroppedImage;
		    	$rootScope.showScreenOverlay = false;
		});
    }

	/****************************/
		
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.isLoadImg = false;
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
	 
	 $scope.allFields = false;
	 
		
	 $scope.actions = [
         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
		 
		 
	var dupusercode = $routeParams.id;
	 
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
	 
		$scope.errorFlag = false;
		$scope.msgclear = true;
		var setSessionValues = function(){
         $scope.vslname = "MAJURO"
         $scope.VesselCode = "ELSA"
         $scope.NameOfMaster  = "Dominic"
         $scope.date = new Date();
         $scope.tddate = new Date();
         $scope.shouldShow = false;
         $scope.shouldShow2 = true;
         $scope.radDisabled = false;
         $scope.color="";
         $scope.Save = "Save";
         $scope.logid="";
//         $scope.ranks = "RNK001"         
         $scope.year=new Date().getUTCFullYear()         
     }
	 setSessionValues();
	 $scope.existingReportData = [];
	 $scope.noOfDeficiencies = 0;
	 $scope.deleteList = [];	 
	 
		 if (dupusercode != undefined) {			 
			 $scope.shouldShow = true;
	         $scope.shouldShow2 = false;
	         $scope.radDisabled = true;
			 $scope.fetchedUserCode = dupusercode;
			 $rootScope.showScreenOverlay = true;
			 
			 Connectivity.IsOk().then(function(response){
					$rootScope.showScreenOverlay = true;
			 $http({
			        method: 'POST',
			        url: "/get-saved-users-from-user-detail/",
			        data : $scope.fetchedUserCode,
			    }).then(function successCallback(response){
			    		console.log(response,'respone >>>>>>>>>>>>>>>>>>>>>>>>>>>');
			    		$scope.geterrormessages=response.data.message;	
			            $scope.geterrorstatus=response.data.errorstatus;
			            $scope.geterrorstatuscode=response.data.status;                
			            $scope.dataerror =response.data.message;
			    		if(response.data.status==0 && response.data.length!=0 ){
			    			$scope.userDetails = response.data.data[0].users;	
				        	$scope.empcode = $scope.userDetails[0].empCode;
							$scope.gvnname = $scope.userDetails[0].empName;
							  $scope.fmname  = $scope.userDetails[0].surname;
							  $scope.status  = $scope.userDetails[0].activeStatus;
							  $scope.adminAccess = $scope.userDetails[0].isAdmin;
							  $scope.previousempcode = $scope.userDetails[0].previousempcode;
							  $scope.selectedUserProfile = (response.data.data[0].dp != null ? response.data.data[0].dp : "img/default-profile.png");
							  if($scope.userDetails[0].activeStatus == 'V'){
								  console.log($scope.status)
								  $scope.subDisabled = true;
								  $scope.saveasdisabled = true;
								  $scope.allFields = true;
								  $scope.shouldShow = true;
								  $scope.shouldShow2 = true;
							  }else{
								  $scope.allFields = false;
								  $scope.saveasdisabled = false;
								  $scope.shouldShow = true;
								  $scope.shouldShow2 = false;
							  }
							  $scope.comps = $scope.userDetails[0].companyCode;
							  $scope.cnttype=$scope.userDetails[0].cnttypename;		
							  $scope.roledetails = response.data.data[0].role;	
							  $scope.roles = $scope.userDetails[0].roleCode;
							  $scope.rankdetails = response.data.data[0].rank;		
							  $scope.ranks = $scope.userDetails[0].rankCode;
							  $scope.depdetails = response.data.data[0].dep;	
							  $scope.compdetails = response.data.data[0].comp;	
							  $scope.cntshoretype = response.data.data[0].shorecontrol;	
							  $scope.cntshoretype = response.data.data[0].shipcontrol;	
							  
							  var registereddate = new Date($scope.userDetails[0].registereddate);
							  
							  if(registereddate != null) {
			                        var cnvrtDate = new Date(registereddate);
			                        $scope.registereddate = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
			                    }
							  
							  var empcodechgdate = new Date($scope.userDetails[0].empcodechgdate);
							  
							  if(empcodechgdate != null) {
			                        var cnvrtDate = new Date(empcodechgdate);
			                        $scope.empcodechgdate = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
			                    }
							  
							  console.log('=====Control Type=======>>>',$scope.cnttype);												 
							  
							  $scope.rolename = $scope.userDetails[0].rolename;						  
							  
							  $scope.rankname = $scope.userDetails[0].rankName;
							  
							  $scope.deps = $scope.userDetails[0].deptCode
							  $scope.depname = $scope.userDetails[0].depName;
							  
							  $scope.gender  = $scope.userDetails[0].gender;
							  var dob = new Date($scope.userDetails[0].dateOfBirth);
							  
							  if(dob != null) {
			                        var cnvrtDate = new Date(dob);
			                        $scope.dob = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
			                    }
							 
							  $scope.pob = $scope.userDetails[0].placeOfBirth;
							   var doj = new Date($scope.userDetails[0].dateOfJoining);
							  if(doj != null) {
			                        var cnvrtDate = new Date(doj);
			                        $scope.doj = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
			                    }
							  
							  $scope.email = $scope.userDetails[0].email;
							  $scope.natcode  = $scope.userDetails[0].nationality;
							  $scope.natName = $scope.userDetails[0].countryName;
							  $scope.language = $scope.userDetails[0].empLanguage;
							 
							  $scope.isperm = $scope.userDetails[0].isPermanent;
							  $scope.passnum = $scope.userDetails[0].passportNumber;
							  var passexp = new Date($scope.userDetails[0].passportExpiry);
							  if(passexp != null) {
			                        var cnvrtDate = new Date(passexp);
			                        $scope.passexp = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
			                    }
							  $scope.status = $scope.userDetails[0].activeStatus;
							  $scope.logid = $scope.userDetails[0].userCode;
							  $scope.pwd = $scope.userDetails[0].empPassword; 
							  $scope.cpwd = $scope.userDetails[0].empPassword; 
							  $rootScope.showScreenOverlay = false;
						}else{
//							$scope.dialog.open();
							/*$scope.dataerror = response.data.message;*/
							$scope.geterrorstatuscode =response.data.status;
							$scope.errordetails=response.data.exceptionDetail;
			               	$scope.showexception=response.data.showerrormessage
			               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
			    			$scope.dataerror = [response.data.message[0]];
						}
						
			        	
			    		
			    });
			 $rootScope.showScreenOverlay = false;
			 }, function(error){
//				  $scope.dialog.open();
				  $scope.dataerror = "Server not reached";
			});
			 
		 }else{                                       // While New Button Clicked
			 $scope.saveasdisabled = false;
			 $rootScope.showScreenOverlay = true;
			 $http({
			        method: 'GET',
			        url: "/Get-compcode/",
				}).then(function successCallback(response){ 
						 $scope.compdetails = response.data.data[0].comp;	
						  $scope.cntshoretype = response.data.data[0].shorecontrol;	
						  $scope.cntshoretype = response.data.data[0].shipcontrol;	
						  $rootScope.showScreenOverlay = false;
			    });
			 		
		 }
	 
	
		    $scope.bindPagination = function(elm){
				var parent = $(elm).find('div.pull-right'); // DOM element where the compiled template can be appended
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

