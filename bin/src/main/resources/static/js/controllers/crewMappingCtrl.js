app.controller('crewMappingCtrl',function($http, $location,$filter,$rootScope, toaster,$timeout, $window, $scope,crewMappingService,Connectivity){
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.isLoadImg = false;
	 $scope.showLoadImg = false;
	 $scope.unauthorize = function(arg1){
	  if (arg1){
	   $scope.haspermission = true;
	  }
	  $scope.hidebody = false;
	 }
	 $scope.allFields = false;
	 
//	   $scope.$on('$viewContentLoaded', function() {
//			$scope.dialog.close();
//			$scope.confirmDeleteDialog.close();
//		});
		
		
		 $scope.actions = [
		                   { text: 'Ok'}
		               ];
	 $scope.tableDivider = false;
	 $scope.addCrewDivider = false;

	 $scope.pageSize = $rootScope.defaultPageSize;
	$scope.saveFlag = "Save";
	$scope.crewcode = "";
	$scope.ReportTab = false;
	$scope.AddCrewTab = false;
	
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	     
	     
	     Connectivity.IsOk().then(function(response){
	    	 $rootScope.showScreenOverlay = true;
	    	 crewMappingService.getVesselNameList().then(function(response) {
	    		 console.log(response,'response vessel anme >>>>>>>>>>>>>>>>>>>>> ')
	    		 if(response.data.status === 0){
	    			 $scope.vesselNameList = response.data.data;
	    		 }else{
	    			$scope.dialog.open();
	    			$scope.dataerror = response.data.message;
	    		 }$rootScope.showScreenOverlay = false;
	         }); 
	     }, function(error){
			  $scope.dialog.open();
			  $scope.dataerror = ["Server not reached"];
		  });
	
	$scope.showTab = false;
	
	$scope.btnShowActionPerformed = function(){
		$scope.saveFlag = "Save";
		$scope.showLoadImg = true;
		$scope.crewNameList  = [];
		console.log($scope.vesselCode,'$scope.vesselCode>>>>>>>>>$$$$$$$$$$$ ')
		if($scope.vesselCode == undefined || $scope.vesselCode === ''){
			$scope.showTab = false;
			$scope.ReportTab = false;
	    	$scope.AddCrewTab = false;
	    	$scope.showLoadImg = false;
			$scope.VesselCodeError = 'Select Vessel Name';
		}else{
			$scope.showTab = true;
			$scope.showLoadImg = true;
			$scope.VesselCodeError = '';
			
			 Connectivity.IsOk().then(function(response){
				 
				 $rootScope.showScreenOverlay = true;
				 crewMappingService.btnShowActionPerformed($scope.vesselCode).then(function(response) {
					 $scope.geterrormessages=response.data.message;	
			            $scope.geterrorstatus=response.data.errorstatus;
			            $scope.geterrorstatuscode=response.data.status;                
			            $scope.dataerror =response.data.message;
					 if(response.data.status === 0){
						 var temp = response.data.data;
					        temp = $filter('orderBy')(temp, 'empname', false)
					        $scope.crewNameList = temp;
					        
					        if(response.data.data.length === 1){
					        	$scope.vesselCodeCrew = $scope.crewNameList[0].vesselcode;
								$scope.vesselName = $scope.crewNameList[0].vesselname;
								$scope.crewCount = 0;
								$scope.crewStatusList = 'Active';
								$scope.ReportTab = true;
								$scope.AddCrewTab = false;
								$scope.showLoadImg = false;
								$scope.crewNameList = [];
					        }else{
						        console.log($scope.crewNameList ,'$scope.crewNameList .................................. ') 
						        $scope.vesselCodeCrew = $scope.crewNameList[0].vesselcode;
								$scope.vesselName = $scope.crewNameList[0].vesselname;
								$scope.crewCount = $scope.crewNameList.length;
								$scope.crewStatusList = 'Active';
								$scope.ReportTab = true;
								$scope.AddCrewTab = false;
								$scope.showLoadImg = false;
					        }
					 }else{
							$scope.newDisabled = false;
//							$scope.dialog.open();							
//							$scope.dataerror = response.data.message; 
							
							$scope.geterrorstatuscode =response.data.status;
							$scope.errordetails=response.data.exceptionDetail;
			               	$scope.showexception=response.data.showerrormessage
			               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
			    			$scope.dataerror = [response.data.message[0]];
			    			
							console.log(response.data,"response.dataresponse.dataresponse.data")
						}  
					 $rootScope.showScreenOverlay = false;
				     });
			 }, function(error){
				  $scope.dialog.open();
				  $scope.dataerror = "Server not reached";
			  });			
		}
	}
    
    
    $scope.datastatus = true;
    $scope.validate = true;
    
    
    
    
    // Export To Excel
    //modified by abhishek
    $scope.exportexcel = function() {
       
        $http({
            method: 'POST',
            url:  "/Export-excel-CrewList/",
            responseType: 'arraybuffer',
            data:$scope.vesselCode      
                	
        }).then(
            function(response) {
                var myBlob = new Blob([response.data], {
                    type: "application/vnd.ms-excel"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
	  	         var anchor = document.createElement("a");
	  	         anchor.download =$scope.vesselName+"-"+"CrewList"+"-"+$scope.crewcode+".xls";
                anchor.href = blobURL;
                anchor.click();
                
                


            });
       // console.log("lh7uguio"+vesselCode);
       
    };
    
    
    
    
    
   /* //Export Excel
    $scope.exportexcel = function(){
    	formData = {
    			'crewcode' : $scope.crewcode,
    	}
    	console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
    	crewMappingService.generateCrewListReportExcel(formData).then(function(response)  	        
    	 {
    	  	          var myBlob = new Blob([response.data], {type: "application/vnd.ms-excel"});
    	  	         var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
    	  	         var anchor = document.createElement("a");
    	  	         anchor.download =$scope.vesselName+"-"+"CrewList"+"-"+$scope.crewcode+".xls";
    	  	         anchor.href = blobURL;
    	  	         anchor.click();
    	  });
    }*/
    
    $scope.btnCrewMasterViewActionPerformed = function(usercode){
    	$rootScope.showScreenOverlay = true;
    	$scope.saveFlag = "Update";
    	console.log( usercode , ' $scope.usercode>>>>>>>>>>>>>>>>>>>>> ')
    	crewMappingService.btnViewActionPerformed(usercode).then(function(response) {
    		$scope.ReportTab = false;
    		$scope.AddCrewTab = true;
    		$scope.geterrormessages=response.data.message;	
            $scope.geterrorstatus=response.data.errorstatus;
            $scope.geterrorstatuscode=response.data.status;                
            $scope.dataerror =response.data.message;
    		
            $scope.viewCrewList = response.data.data;
            console.log( $scope.viewCrewList , ' $scope.viewCrewList>>>>>>>>>>>>>>>>>>>>> ')
            $scope.userCode = $scope.viewCrewList[0].usercode;
            $scope.userName = $scope.viewCrewList[0].empname;
            $scope.portCode = $scope.viewCrewList[0].portofjoin;
            $scope.portName = $scope.viewCrewList[0].portname;
            $scope.crewcode = $scope.viewCrewList[0].crewcode;
            $scope.rankCode = $scope.viewCrewList[0].rankcode;
	        $scope.rankName = $scope.viewCrewList[0].rankname;
	        $scope.empName = $scope.viewCrewList[0].empname;
	        $scope.empCode = $scope.viewCrewList[0].empid;
	        $scope.countryCode = $scope.viewCrewList[0].nationality;
	        $scope.nationality = $scope.viewCrewList[0].countryname;
	        $scope.depCode =  $scope.viewCrewList[0].deptcode;
	        $scope.department = $scope.viewCrewList[0].deptname;
	        $scope.gender = $scope.viewCrewList[0].gender;
	        $scope.passportNumber = $scope.viewCrewList[0].passportNumber;
	        console.log($scope.viewCrewList[0].active_status,'$scope.viewCrewList[0].active_status????????????????? ')
	        if($scope.viewCrewList[0].active_status === 'A'){
	        	$scope.statusofcrew = 'Active';
	        	$scope.allFields = false;
	        }else{
	        	$scope.statusofcrew = 'In Active';
	        	$scope.allFields = true;
	        }
//	        $scope.statusofcrew =  $scope.viewCrewList[0].activeStatus;
	        $scope.cruser =  $scope.viewCrewList[0].cruser;
	        $scope.crdate =  $scope.viewCrewList[0].crdate;
	        if($scope.viewCrewList[0].passportExpiry !== null){
	        var passportexp = new Date($scope.viewCrewList[0].passportExpiry);	        
//	        $scope.passportExpiry = new Date($scope.viewCrewList[0].passportExpiry);//(passportexp.getUTCMonth() + 1 + '/' + passportexp.getUTCDate() + "/" + passportexp.getUTCFullYear());
	        
	        if(passportexp != null) {
                var cnvrtDate = new Date(passportexp);
                $scope.passportExpiry = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
            }
	        
	        }
	        $scope.roleCode = $scope.viewCrewList[0].rolecode;
	        
	        console.log($scope.viewCrewList[0].signoffdate, '$scope.viewCrewList[0].signoffdate ?????????????????? ')
	        if($scope.viewCrewList[0].signoffdate !== null){
		        var signoff = new Date($scope.viewCrewList[0].signoffdate);
//		        $scope.medicalIssued = new Date($scope.viewCrewList[0].mediccert_issued);// (mediss.getUTCMonth() + 1 + '/' + mediss.getUTCDate() + "/" + mediss.getUTCFullYear());
		           if(signoff != null) {
		                var cnvrtDate = new Date(signoff);
		                $scope.signoffdate1 = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
		            }
		        }
	        console.log($scope.signoffdate1 , '$scope.signoffdate1 ????????????????? ')
	        
	        
	        
	        if($scope.viewCrewList[0].mediccert_issued !== null){
	        var mediss = new Date($scope.viewCrewList[0].mediccert_issued);
//	        $scope.medicalIssued = new Date($scope.viewCrewList[0].mediccert_issued);// (mediss.getUTCMonth() + 1 + '/' + mediss.getUTCDate() + "/" + mediss.getUTCFullYear());
	      
		        if(mediss != null) {
	                var cnvrtDate = new Date(mediss);
	                $scope.medicalIssued = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        
	        if($scope.viewCrewList[0].mediccert_expiry !== null){
	        var medexp = new Date($scope.viewCrewList[0].mediccert_expiry);
//	        $scope.medicalExpiry =new Date($scope.viewCrewList[0].mediccert_expiry);// (medexp.getUTCMonth() + 1 + '/' + medexp.getUTCDate() + "/" + medexp.getUTCFullYear());
		        if(medexp != null) {
	                var cnvrtDate = new Date(medexp);
	                $scope.medicalExpiry = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        $scope.flagLicenceNo = $scope.viewCrewList[0].flag_lic_number;
	        
	        if($scope.viewCrewList[0].flag_lic_expiry !== null){
	        var flglic = new Date($scope.viewCrewList[0].flag_lic_expiry);	        
//	        $scope.flagLicenceExpiry = new Date($scope.viewCrewList[0].flag_lic_expiry);// (flglic.getUTCMonth() + 1 + '/' + flglic.getUTCDate() + "/" + flglic.getUTCFullYear());
		        if(flglic != null) {
	                var cnvrtDate = new Date(flglic);
	                $scope.flagLicenceExpiry = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        
	        if($scope.viewCrewList[0].us_visa_expiry !== null){
	        var usvisa = new Date($scope.viewCrewList[0].us_visa_expiry);	
//	        $scope.usVisaExpiry = new Date($scope.viewCrewList[0].us_visa_expiry);// (usvisa.getUTCMonth() + 1 + '/' + usvisa.getUTCDate() + "/" + usvisa.getUTCFullYear());
		        if(usvisa != null) {
	                var cnvrtDate = new Date(usvisa);
	                $scope.usVisaExpiry = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        if($scope.viewCrewList[0].flag_dce_expiry !== null){
	        var flagdce = new Date($scope.viewCrewList[0].flag_dce_expiry);	        
//	        $scope.flagDCEExpiry = new Date($scope.viewCrewList[0].flag_dce_expiry);// (flagdce.getUTCMonth() + 1 + '/' + flagdce.getUTCDate() + "/" + flagdce.getUTCFullYear());
		        if(flagdce != null) {
	                var cnvrtDate = new Date(flagdce);
	                $scope.flagDCEExpiry = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        $scope.flagSeamanBookNo = $scope.viewCrewList[0].seamans_number;
	        
	        if($scope.viewCrewList[0].seamans_expiry !== null){
	        var seaexp = new Date($scope.viewCrewList[0].seamans_expiry);	        
//	        $scope.flagSeamanBookExpiry = new Date($scope.viewCrewList[0].seamans_expiry);// (seaexp.getUTCMonth() + 1 + '/' + seaexp.getUTCDate() + "/" + seaexp.getUTCFullYear());
		        if(seaexp != null) {
	                var cnvrtDate = new Date(seaexp);
	                $scope.flagSeamanBookExpiry = (cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        $scope.flagGMDSSGOCno = $scope.viewCrewList[0].gmdss_goc_number;
	        
	        if($scope.viewCrewList[0].gmdss_goc_expiry !== null){
	        var gmdssexp = new Date($scope.viewCrewList[0].gmdss_goc_expiry);	        
//	        $scope.flagGMDSSGOCExpiry =new Date($scope.viewCrewList[0].gmdss_goc_expiry);// (gmdssexp.getUTCMonth() + 1 + '/' + gmdssexp.getUTCDate() + "/" + gmdssexp.getUTCFullYear());
		        if(gmdssexp != null) {
	                var cnvrtDate = new Date(gmdssexp);
	                $scope.flagGMDSSGOCExpiry = (cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        if($scope.viewCrewList[0].final_appraisal !== null){
	        var finapp = new Date($scope.viewCrewList[0].final_appraisal);	        
//	        $scope.finalTermAppraisal = new Date($scope.viewCrewList[0].final_appraisal);//(finapp.getUTCMonth() + 1 + '/' + finapp.getUTCDate() + "/" + finapp.getUTCFullYear());
		        if(finapp != null) {
	                var cnvrtDate = new Date(finapp);
	                $scope.finalTermAppraisal = (cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        
	        if($scope.viewCrewList[0].half_appraisal !== null){
	        var halfapp = new Date($scope.viewCrewList[0].half_appraisal);	        
//	        $scope.halfTermAppraisal = new Date($scope.viewCrewList[0].half_appraisal);//(halfapp.getUTCMonth() + 1 + '/' + halfapp.getUTCDate() + "/" + halfapp.getUTCFullYear());
		        if(halfapp != null) {
	                var cnvrtDate = new Date(halfapp);
	                $scope.finalTermAppraisal = (cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        
	        if($scope.viewCrewList[0].contract_expiry !== null){
	        var conexp = new Date($scope.viewCrewList[0].contract_expiry);	        
//	        $scope.empContractExpiry = new Date($scope.viewCrewList[0].contract_expiry);//(conexp.getUTCMonth() + 1 + '/' + conexp.getUTCDate() + "/" + conexp.getUTCFullYear());
		        if(conexp != null) {
	                var cnvrtDate = new Date(conexp);
	                $scope.empContractExpiry = (cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate());
	            }
	        }
	        
	        $scope.crewStatus = $scope.viewCrewList[0].active_status;
	        $scope.crewRemarks = $scope.viewCrewList[0].remarks;
	        $rootScope.showScreenOverlay = false;
	        if(response.data.status === 0){}else{
	        $scope.geterrorstatuscode =response.data.status;
			$scope.errordetails=response.data.exceptionDetail;
           	$scope.showexception=response.data.showerrormessage
           	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
			$scope.dataerror = [response.data.message[0]];}
        });
    }
});
