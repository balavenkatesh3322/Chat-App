app.controller('mailconfigController', function($scope,$http,$timeout,toaster,$rootScope,Connectivity){
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.dialogtemp.close();
	});
	 $scope.geterrorstatuscode ="0";
	 $scope.actions = [
         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
	$scope.protocol="smtp";
	//$scope.itreceiverccOption = [{"itreceivercc":"1"},{"itreceivercc":"2"}];

	$scope.itreceiverccOption = [];
	 var setITreceivercc = function(){
	$scope.itreceiverccOptionAction = {
            placeholder: "Select mail id",
            dataTextField: "itreceivercc",
            dataValueField: "itreceivercc",
            autoBind: true,
            valuePrimitive: true,
            autoClose: false,
            noDataTemplate: "<div>Do you want to add a new IT Receiver mail - '#: instance.input.val() #' ?</div><br />"+
            				"<button class=\"k-button\" ng-click=\"addNewItReceiverMail('#: instance.input.val() #')\">Add new item</button>",
           dataSource: { data: $scope.itreceiverccOption }
	};
	 }
	//$scope.itreceivercc  = ["1"];
	 
	
	$scope.addNewItReceiverMail = function(value){
    	$scope.itreceiverccOption.push({"itreceivercc":value});
    	if ($scope.itreceivercc==null || $scope.itreceivercc==undefined){
    		$scope.itreceivercc=[];
    	}
    	$scope.itreceivercc.push(value);
    }
	
	$scope.offreceiverccOption = [];
	var setOffreceivercc = function(){
	$scope.offreceiverccOptionAction = {
            placeholder: "Select mail id",
            dataTextField: "offreceivercc",
            dataValueField: "offreceivercc",
            autoBind: true,
            valuePrimitive: true,
            autoClose: false,
            noDataTemplate: "<div>Do you want to add a new Officer Receiver mail - '#: instance.input.val() #' ?</div><br />"+
            				"<button class=\"k-button\" ng-click=\"addNewOffReceiverMail('#: instance.input.val() #')\">Add new item</button>",
           dataSource: { data: $scope.offreceiverccOption }
	};
	}
	$scope.addNewOffReceiverMail = function(value){
    	$scope.offreceiverccOption.push({"offreceivercc":value});
    	if ($scope.offreceivercc==null || $scope.offreceivercc==undefined){
    		$scope.offreceivercc=[];
    	}
    	$scope.offreceivercc.push(value);
    }
	setOffreceivercc();
	setITreceivercc();
	Connectivity.IsOk().then(function(response){
		$http({
			url : "/retrive_mail_config/",
			method : 'GET',

		}).then(function successCallback(response) {
		 	   $scope.geterrormessages=response.data.message;	
               $scope.geterrorstatus=response.data.errorstatus;
               $scope.geterrorstatuscode=response.data.status;                
               $scope.dataerror =response.data.message;                 
           	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
           		$scope.mailConfigs = response.data.data[0].mailconfigList;
           		if($scope.mailConfigs!==undefined){
           			$scope.saveDis=true;
           			$scope.updateDis=false;
           			$scope.configId = $scope.mailConfigs[0].configid;
           			
           			
           			var offtemp="";
        			var ittemp="";
        			if($scope.mailConfigs[0].offreceivercc!=null){
        				offtemp=$scope.mailConfigs[0].offreceivercc.split(",");
        			}if($scope.mailConfigs[0].itreceivercc!=null){
        				ittemp=$scope.mailConfigs[0].itreceivercc.split(",");
        			}
        		
        				$scope.offreceivercc= offtemp;
        				$scope.itreceivercc= ittemp;
        		
                
        				 var temp = [];
        	                for (var i = 0; i < $scope.offreceivercc.length; i++) {
        	                	temp.push({"offreceivercc": $scope.offreceivercc[i]});
        	                }
        	                
        	                var itrectemp = [];
        	                for (var i = 0; i < $scope.itreceivercc.length; i++) {
        	                	itrectemp.push({"itreceivercc": $scope.itreceivercc[i]});
        	                }
        	                
        			$scope.offreceiverccOption = temp;
        			$scope.itreceiverccOption = itrectemp;
        			setOffreceivercc();
        			setITreceivercc();
        			
           			$scope.mailhost = $scope.mailConfigs[0].mailhost;
					$scope.mailport = $scope.mailConfigs[0].mailport;
					$scope.protocol = $scope.mailConfigs[0].mailprotocol;
					$scope.senderid = $scope.mailConfigs[0].senderid;
					$scope.mailpassword = $scope.mailConfigs[0].mailpassword;
					$scope.offreceiverid = $scope.mailConfigs[0].offreceiverid;
					$scope.offreceivemailsub = $scope.mailConfigs[0].offreceivemailsub;
					$scope.itreceiverid = $scope.mailConfigs[0].itreceiverid;
					$scope.itreceivemailsub = $scope.mailConfigs[0].itreceivemailsub;
					$scope.forgotUsernameSub = $scope.mailConfigs[0].forgotUsernameSub;
					$scope.forgotUsernameContent = $scope.mailConfigs[0].forgotUsernameContent;
					$scope.forgotPasswordSub = $scope.mailConfigs[0].forgotPasswordSub;
					$scope.forgotPasswordContent = $scope.mailConfigs[0].forgotPasswordContent;
           		}else{
           			$scope.saveDis=false;
           			$scope.updateDis=true;
           		}
           	}else{
           		$scope.errordetails=response.data.exceptionDetail;
               	$scope.showexception=response.data.showerrormessage
               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
				$scope.dataerror = [response.data.message[0]]; 	
			}
		});
		}, function(error){		 
	   		  $scope.dataerror = "Server not reached";
	   	  })
	   	  
	Connectivity.IsOk().then(function(response){
	 $scope.saveMailConfig = function(){
		 $scope.validation();
			if ($scope.errorFlag == true) {
				   $rootScope.showScreenOverlay = true;
				formData = {
						'mailhost' : $scope.mailhost,
						'mailport' : $scope.mailport,
						'mailprotocol':$scope.protocol,
						'senderid' : $scope.senderid,
						'mailpassword' : $scope.mailpassword,
						'offreceiverid': $scope.offreceiverid,
						'offreceivemailsub' : $scope.offreceivemailsub,
						'itreceiverid' : $scope.itreceiverid,	
						'itreceivemailsub' : $scope.itreceivemailsub,
						'forgotUsernameSub' : $scope.forgotUsernameSub,	
						'forgotUsernameContent' : $scope.forgotUsernameContent,
						'forgotPasswordSub' : $scope.forgotPasswordSub,	
						'forgotPasswordContent' : $scope.forgotPasswordContent,
				};
				var offemail="";
				var itemail="";
				for (var i = 0; i < $scope.offreceivercc.length; i++) {
					offemail += $scope.offreceivercc[i] + ",";
				}
				offemail = offemail.substring(0, offemail.lastIndexOf(","));
				for (var i = 0; i < $scope.itreceivercc.length; i++) {
					itemail += $scope.itreceivercc[i] + ",";
				}
				itemail = itemail.substring(0, itemail.lastIndexOf(","));
				
				if(offemail!==null && offemail!==""){
					formData['offreceivercc']=offemail;
				}else{
					formData['offreceivercc']=null;
				}
				if(itemail!==null && itemail!==""){
					formData['itreceivercc']=itemail;
				}else{
					formData['itreceivercc']=null;
				}
				$http({
					url : "/save_mail_config/",
					dataType : 'json',
					method : 'POST',
					data : formData,
					headers : {
						"Content-Type" : "application/json"
					}
				}).then(function successCallback(response) {
					 $scope.geterrormessages = response.data.message;
		                $scope.geterrorstatus = response.data.errorstatus;
		                $scope.geterrorstatuscode = response.data.status;
		                $scope.dataerror = response.data.message;
		                if (response.data.status == 0 && response.data.length != 0) {
						$scope.mailConfigs = response.data.data[0].mailConfigList;
						toaster.success({title: "Information", body:"Data has been successfully Saved"});
						$scope.mailhost = $scope.mailConfigs[0].mailhost;
						$scope.mailport = $scope.mailConfigs[0].mailport;
						$scope.protocol = $scope.mailConfigs[0].mailprotocol;
						$scope.senderid = $scope.mailConfigs[0].senderid;
						$scope.mailpassword = $scope.mailConfigs[0].mailpassword;
						$scope.offreceiverid = $scope.mailConfigs[0].offreceiverid;
						$scope.offreceivemailsub = $scope.mailConfigs[0].offreceivemailsub;
						$scope.itreceiverid = $scope.mailConfigs[0].itreceiverid;
						$scope.itreceivemailsub = $scope.mailConfigs[0].itreceivemailsub;
						$scope.forgotUsernameSub = $scope.mailConfigs[0].forgotUsernameSub;
						$scope.forgotUsernameContent = $scope.mailConfigs[0].forgotUsernameContent;
						$scope.forgotPasswordSub = $scope.mailConfigs[0].forgotPasswordSub;
						$scope.forgotPasswordContent = $scope.mailConfigs[0].forgotPasswordContent;
						$scope.saveDis=true;
	           			$scope.updateDis=false;
					}
					else{
						 $rootScope.showScreenOverlay = false;
		                    $scope.errordetails = response.data.exceptionDetail;
		                    $scope.showexception = response.data.showerrormessage
		                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
		                    $scope.dataerror = [response.data.message[0]];
					}
			});
			}
	 }
	}, function(error){		 
 		  $scope.dataerror = "Server not reached";
 	 })
	
 	 
 	 	Connectivity.IsOk().then(function(response){
	   $scope.updateMailConfig = function(){
		 $scope.validation();
			if ($scope.errorFlag == true) {
				  $rootScope.showScreenOverlay = true;
				formData = {
						'configid' : $scope.configId,
						'mailhost' : $scope.mailhost,
						'mailport' : $scope.mailport,
						'mailprotocol':$scope.protocol,
						'senderid' : $scope.senderid,
						'mailpassword' : $scope.mailpassword,
						'offreceiverid': $scope.offreceiverid,
						'offreceivemailsub' : $scope.offreceivemailsub,
						'itreceiverid' : $scope.itreceiverid,	
						'itreceivemailsub' : $scope.itreceivemailsub,
						'forgotUsernameSub' : $scope.forgotUsernameSub,	
						'forgotUsernameContent' : $scope.forgotUsernameContent,
						'forgotPasswordSub' : $scope.forgotPasswordSub,	
						'forgotPasswordContent' : $scope.forgotPasswordContent,
				};
				var offemail="";
				var itemail="";
				for (var i = 0; i < $scope.offreceivercc.length; i++) {
					offemail += $scope.offreceivercc[i] + ",";
				}
				offemail = offemail.substring(0, offemail.lastIndexOf(","));
				for (var i = 0; i < $scope.itreceivercc.length; i++) {
					itemail += $scope.itreceivercc[i] + ",";
				}
				itemail = itemail.substring(0, itemail.lastIndexOf(","));
				if(offemail!==null && offemail!==""){
					formData['offreceivercc']=offemail;
				}else{
					formData['offreceivercc']=null;
				}
				if(itemail!==null && itemail!==""){
					formData['itreceivercc']=itemail;
				}else{
					formData['itreceivercc']=null;
				}
				$http({
					url : "/update_mail_config/",
					dataType : 'json',
					method : 'POST',
					data : formData,
					headers : {
						"Content-Type" : "application/json"
					}
				}).then(function successCallback(response) {
					 $scope.geterrormessages = response.data.message;
		                $scope.geterrorstatus = response.data.errorstatus;
		                $scope.geterrorstatuscode = response.data.status;
		                $scope.dataerror = response.data.message;
		                if (response.data.status == 0 && response.data.length != 0) {
						$scope.mailConfigs = response.data.data[0].mailConfigList;
						toaster.success({title: "Information", body:"Data has been successfully Updated"});
						$scope.mailhost = $scope.mailConfigs[0].mailhost;
						$scope.mailport = $scope.mailConfigs[0].mailport;
						$scope.protocol = $scope.mailConfigs[0].mailprotocol;
						$scope.senderid = $scope.mailConfigs[0].senderid;
						$scope.mailpassword = $scope.mailConfigs[0].mailpassword;
						$scope.offreceiverid = $scope.mailConfigs[0].offreceiverid;
						$scope.offreceivemailsub = $scope.mailConfigs[0].offreceivemailsub;
						$scope.itreceiverid = $scope.mailConfigs[0].itreceiverid;
						$scope.itreceivemailsub = $scope.mailConfigs[0].itreceivemailsub;
						$scope.forgotUsernameSub = $scope.mailConfigs[0].forgotUsernameSub;
						$scope.forgotUsernameContent = $scope.mailConfigs[0].forgotUsernameContent;
						$scope.forgotPasswordSub = $scope.mailConfigs[0].forgotPasswordSub;
						$scope.forgotPasswordContent = $scope.mailConfigs[0].forgotPasswordContent;
					}
					else{
						 $rootScope.showScreenOverlay = false;
		                    $scope.errordetails = response.data.exceptionDetail;
		                    $scope.showexception = response.data.showerrormessage
		                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
		                    $scope.dataerror = [response.data.message[0]];
					}
			});
			}
	 }
	}, function(error){		 
 		  $scope.dataerror = "Server not reached";
 	 })
 	 
 	 $scope.validation = function() {
		$scope.errorFlag = true;
	}
});





