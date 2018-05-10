app.controller('vesselMasterCtrl', function($location, $window,$http, toaster, $scope,$filter,$routeParams,  $timeout,vesselMasterService,Connectivity,$rootScope) {
	 $scope.isSaving = false;
	 $scope.geterrorstatuscode ="0";
	  var date = new Date();
	  
	  $scope.savedStstus = "save";
	  
	    $scope.restrictFutureDate = {
	        max: date
	    }
	    
	    $scope.restrictPastDate = {
	            min: date
	        }
	    $scope.$on('$viewContentLoaded', function() {
			 $scope.dialog.close();
				
			});
	    $scope.allFields = false;
		
	    $scope.actions = [
	         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	     ];
	 
	
		 $scope.exportbtnActionPerformed = function(){
			console.log('in sdie export ?>?????????????????????????????? ')
	     	var celphone="";
	     	for(var i = 0;i<$scope.tags.length ; i++){
	     		if(i == $scope.tags.length-1){
	     			celphone += $scope.tags[i].text;
	     		}else{
	     			celphone += $scope.tags[i].text + ":";
	     		} 
	     	}     	
	       
	         	if($scope.startDateOfSuperintendent === undefined){
	         		$scope.startDateOfSuperintendent1 = "";
	         	}else{
	         		$scope.startDateOfSuperintendent1 =  new Date($scope.startDateOfSuperintendent);
	         	}
	         	
	             var vesselMasterData = {
	                 "vesselcode": $scope.vesselCode,
	                 "vesselname": $scope.vesselName,
	                 "vesselTypeCode": 'VT001',
	                 "fleetcode": $scope.fleet,
	                 "flagcode": $scope.flag,
	                 "portcode": $scope.portOfRegistry,
	                 "typeManagement": $scope.typeOfManagement,
	                 "businessSection": $scope.ownerBusinessSection,
	                 "shorecode": $scope.managementCompany,
	                 "companyIMONo": $scope.companyIMONumber,
	                 "formerCompany": $scope.formerManagementCompany,
	                 "companyAccountCode": $scope.companyAccountCode,
	                 "ownerAccountCode": $scope.ownerAccountCode,
	                 "currency": $scope.baseCurrency.trim(),
	                 "financialYearEnd": $scope.financialYearEnd,
	                 "shipyard": $scope.shipYard,
	                 "dateOfBuilt": new Date($scope.dateOfBuild),
	                 "age": $scope.age,
	                 "hullno": $scope.hullNo,
	                 "imono": $scope.IMONo,
	                 "officialno": $scope.officialNo,
	                 "callsign": $scope.callSign,
	                 "cbaca": $scope.CBA,
	                 "columnClass": $scope.class,
	                 "classno": $scope.classNo,
	                 "activeStatus": ($scope.status === 'Active' ? 'A' : 'V'),
	                 "insurancehullmachineries": $scope.insuranceHullAndMachineries,
	                 "insurancepi": $scope.insurancePI,
	                 "startdatemanagement": new Date($scope.startingManagementDate),
	                 "lastdrydockdate": new Date($scope.lastDryDockDate),
	                 "nextdrydockdate": new Date($scope.nextDryDockDate),
	                 "deliverydate": new Date($scope.deliveryDate),
	                 "nameofownerprincipal": $scope.nameOfOwner,
	                 "ownerIMO": $scope.ownerIMO,
	                 "ownerAddress": $scope.ownerAddress,
	                 "ownerEmergencyName": $scope.ownerEmergencyName,
	                 "ownerEmergencyContactNumber": $scope.ownerEmergencyContactNumber,
	                 "actualprincipal": $scope.nameOfActualOwner,
	                 "actualOwnerIMO": $scope.actualOwnerIMO,
	                 "actualOwnerAddress": $scope.actualOwnerAddress,
	                 "actualOwnerEmergencyName": $scope.actualOwnerEmergencyName,
	                 "actualOwnerEmergencyContactNumber": $scope.actualOwnerEmergencyContactNumber,
	                 "nameofregisteredowner": $scope.nameOfRegisteredOwner,
	                 "registeredOwnerIMO": $scope.registeredOwnerIMO,
	                 "registeredOwnerAddress": $scope.registeredOwnerAddress,
	                 "registeredOwnerEmergencyName": $scope.registeredOwnerEmergencyName,
	                 "registeredOwnerEmergencyContactNumber": $scope.registeredOwnerEmergencyContactNumber,
	                 "lengthloa": $scope.length,
	                 "depth": $scope.depth,
	                 "lbp": $scope.LBP,
	                 "draft": $scope.draft,
	                 "breadth": $scope.breadth,
	                 "deadweight": $scope.deadWeight,
	                 "height": $scope.height,
	                 "capacityunit": $scope.capacityUnit,
	                 "capacity": $scope.capacityValue,
	                 "internationalGrosston": $scope.internationalGT,
	                 "ntSuez": $scope.NTSuez,
	                 "internationalNetton": $scope.internationalNT,
	                 "gtpan": $scope.GTPan,
	                 "registeredGrosston": $scope.registeredGT,
	                 "msums": $scope.UMS,
	                 "registeredNetton": $scope.registeredNT,
	                 "lightShip": $scope.lightShip,
	                 "gtSuez": $scope.GTSuez,
	                 "constant": $scope.constant,
	                 "superintendent": $scope.superintendent,
	                 "fleetmanager": $scope.fleetManager,
	                 "fleetgm": $scope.fleetGM,
	                 "firstBackupSI": $scope.firstBackup,
	                 "secondBackupSI": $scope.secondBackup,
	                 "hseqSuperintendant": $scope.HSEQSuperintendant,
	                 "hseqManager": $scope.HSEQManager,
	                 "marineOperationSI": $scope.marineOperationSI,
	                 "marineOperationManager": $scope.marineOperationManager,
	                 "purchaseunit": $scope.purchaseUnit,
	                 "accountant": $scope.accountant,
	                 "purchaser": $scope.purchaser,
	                 "crewInCharge": $scope.crewInCharge,
	                 "invoicername": $scope.invoicerName,
	                 "startdatesuperintendent": $scope.startDateOfSuperintendent1,
	                 "mainEngineMake": $scope.mainEngineMake,
	                 "mainEngineType": $scope.mainEngineType,
	                 "license": $scope.license,
	                 "noOfCylinder": $scope.noOfCylinder,
	                 "nsrPs": $scope.NSRPs,
	                 "nsrKw": $scope.NSRKw,
	                 "mcrPs": $scope.MCRPs,
	                 "mcrKw": $scope.MCRKw,
	                 "turboChargerMake": $scope.turboChargerMake,
	                 "turboChargerType": $scope.turboChargerType,
	                 "camlessornot": $scope.camelessOrNot,
	                 "mmsino": $scope.MMSINo,    
	                 "cellphone": $scope.cellPhone,
	                 "aatdhldigits": $scope.DHLDigits,
	                 "iridiumphone": $scope.iridiumPhone,
	                 "satCID": $scope.satCID,
	                 "satEmail": $scope.satABEmail,
	                 "satTelex": $scope.satABFTelex,
	                 "satVoice": $scope.satABFVoice,
	                 "satFax": $scope.satABFFax,
	                 "satData": $scope.satABFData,
	                 "satHSD": $scope.satABFHSD,
	                 "cruser": 'system',
	                 "crdate": new Date(),
	                 "upduser": 'system',
	                 "upddate":  new Date()
	             }

	             
	             var exVesselNameData = $scope.vessels;
	             var exVesselManagementData = $scope.formerManagements;
	             var vesselAuxEngineData = $scope.vesselAuxEngineList;
	             var vesselAuxMachineData = $scope.vesselAuxMachineList;
	             var vesselNavigationData = $scope.vesselNavigationList;

	             var compositeJson = {
	                 vesselmasterData: vesselMasterData,
	                 exVesselMgnt: exVesselManagementData,
	                 exVesselName: exVesselNameData,
	                 vesselAuxEngine: vesselAuxEngineData,
	                 vesselAuxMachine: vesselAuxMachineData,
	                 vesselNavigation: vesselNavigationData,
	             }

	             console.log('HERE WE GOOOO to EXPORT -------------', compositeJson);
	             $rootScope.showScreenOverlay = true;
		            	   vesselMasterService.exportVesselMasterCompositeForm(compositeJson).then(function(response) {
		                     
		            			 var myBlob = new Blob([response.data], {type: "application/vnd.ms-excel"});
			         	         var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
			         	         var anchor = document.createElement("a");
			         	         anchor.download = $scope.vesselName+"-"+"VesselParticulars"+"-"+$scope.vesselCode+".xls";
			         	         anchor.href = blobURL;
			         	         anchor.click();
			         	        console.log("Export Success",response);
			         	       $rootScope.showScreenOverlay = false;
		                });
		    	      
	     }
	 
    	$scope.tags = [];
        $scope.fetchedVesselCode = $routeParams.id;
            if ($scope.fetchedVesselCode  != undefined) {
            	$scope.btnPortCode = false;
                vesselMasterData = [];
                
                Connectivity.IsOk().then(function(response){
                	$rootScope.showScreenOverlay = true;
                	vesselMasterService.getVesselMasterSavedData($scope.fetchedVesselCode).then(function(response) {
                    	console.log(response.data,'getVesselMasterSavedData >>>>>>>>???????????????? ');
                    	$scope.geterrormessages=response.data.message;	
        	            $scope.geterrorstatus=response.data.errorstatus;
        	            $scope.geterrorstatuscode=response.data.status;                
        	            $scope.dataerror =response.data.message;
                    	if(response.data.status === 0){
                        vesselMasterData = response.data.data[1].vesselMaster;
                        $scope.vessels = response.data.data[1].exVesselName;
                        if(response.data.data[1].nationality != null){
                       	 $scope.nationalityRating=response.data.data[1].nationality[0][2];
                        }
                        $scope.totalCrew=response.data.data[1].crews;
                        $scope.formerManagements = response.data.data[1].exVesselMgnt;
                        $scope.vesselAuxEngineList = response.data.data[1].vesselAuxEngine;
                        $scope.vesselAuxMachineList = response.data.data[1].vesselAuxMachine;
                        $scope.vesselNavigationList = response.data.data[1].vesselNavigation;
                        
                        //Components Starts
                        $scope.flagsList = response.data.data[0][0].vesselMasterFlag;
                    	$scope.fleetManagersList =  response.data.data[0][0].fleetManager;
                    	$scope.superintendentList =  response.data.data[0][0].superintendent;
                    	$scope.fleetGMList =  response.data.data[0][0].fleetGM;
                    	$scope.hseqManagerList =  response.data.data[0][0].hsqeManager;
                    	$scope.hseqSIList =  response.data.data[0][0].hseqSI;
                    	$scope.marineManagersList =  response.data.data[0][0].marineManager;
                    	$scope.marineSIList =  response.data.data[0][0].marineSI;
                    	$scope.purchaserList =  response.data.data[0][0].purchaser;
                    	$scope.accountantList =  response.data.data[0][0].accountant;
                    	$scope.crewInChargeList =  response.data.data[0][0].crewIncharge;
                    	$scope.invoicerList =  response.data.data[0][0].invoicer;
                    	$scope.vesselTypeList =  response.data.data[0][0].vesselType;
                    	$scope.fleetList =  response.data.data[0][0].fleets;
                    	$scope.empList =  response.data.data[0][0].superintendents;
                    	$scope.ranksList =  response.data.data[0][0].vesselMasterRanks;
                    	$scope.shorecodesList =  response.data.data[0][0].shoreMaster;
                    	$scope.currencycodesList =  response.data.data[0][0].currency;
                    	$scope.auxEngineEqpList =  response.data.data[0][0].auxenginemaster;
                    	$scope.auxMachineEqpList =  response.data.data[0][0].auxmachinerymaster;
                    	$scope.vesselNavEqpList =  response.data.data[0][0].navigationmaster;
                    	//Components Ends
                        
                        $scope.savedStstus = "update";
                        /* BASIC INFORMATION TAB */
                        $scope.vesselCode = vesselMasterData[0].vesselcode;
                        $scope.vesselName = vesselMasterData[0].vesselname;

                        $scope.vesselType = vesselMasterData[0].vesselTypeCode;
                        $scope.fleet = vesselMasterData[0].fleetcode;

                        $scope.flag = vesselMasterData[0].flagcode;
                        $scope.portOfRegistry = vesselMasterData[0].portcode;

                        $scope.typeOfManagement = vesselMasterData[0].typeManagement;
                        $scope.ownerBusinessSection = vesselMasterData[0].businessSection;

                        $scope.managementCompany = vesselMasterData[0].shorecode;
                        $scope.companyIMONumber = vesselMasterData[0].companyIMONo;
                        $scope.formerManagementCompany = vesselMasterData[0].formerCompany;
                        $scope.companyAccountCode = vesselMasterData[0].companyAccountCode;

                        $scope.ownerAccountCode = vesselMasterData[0].ownerAccountCode;
                        $scope.baseCurrency = vesselMasterData[0].currency;
                        
                        $scope.financialYearEnd = vesselMasterData[0].financialYearEnd;
                        $scope.vesselkpi = vesselMasterData[0].vesselkpi;
                        $scope.shipYard = vesselMasterData[0].shipyard;
                        
                        var buildDate = new Date(vesselMasterData[0].dateOfBuilt);
                        if(buildDate != null) {
                            var cnvrtDate = new Date(buildDate);
                            $scope.dateOfBuild = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
                        }
                        $scope.age = parseInt(vesselMasterData[0].age);
                        $scope.hullNo = vesselMasterData[0].hullno;

                        $scope.IMONo = vesselMasterData[0].imono;
                        $scope.officialNo = vesselMasterData[0].officialno;

                        $scope.callSign = vesselMasterData[0].callsign;
                        $scope.CBA = vesselMasterData[0].cbaca;

                        $scope.class = vesselMasterData[0].columnClass;
                        $scope.classNo = vesselMasterData[0].classno;

                        $scope.status = (vesselMasterData[0].activeStatus === 'A' ? 'Active' : 'Void');
                        if($scope.status === 'Active'){
                        	$scope.allFields = false;
                        }else{
                        	$scope.allFields = true;
                        }
                        $scope.portOfRegistryName = vesselMasterData[0].portname;
                        /* DETAILED INFORMATION */

                        $scope.insuranceHullAndMachineries = vesselMasterData[0].insurancehullmachineries;
                        $scope.insurancePI = vesselMasterData[0].insurancepi;

                        var startingManagementDate = new Date(vesselMasterData[0].startdatemanagement);
                        
                        if(startingManagementDate != null) {
                            var cnvrtDate = new Date(startingManagementDate);
                            $scope.startingManagementDate = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
                        }

                        var lastDryDockDate = new Date(vesselMasterData[0].lastdrydockdate);
                        
                        if(lastDryDockDate != null) {
                            var cnvrtDate = new Date(lastDryDockDate);
                            $scope.lastDryDockDate = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
                        }

                        var nextDryDockDate = new Date(vesselMasterData[0].nextdrydockdate);
                        
                        if(nextDryDockDate != null) {
                            var cnvrtDate = new Date(nextDryDockDate);
                            $scope.nextDryDockDate = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
                        }

                        var deliveryDate = new Date(vesselMasterData[0].deliverydate);
                        
                        if(deliveryDate != null) {
                            var cnvrtDate = new Date(deliveryDate);
                            $scope.deliveryDate = ( cnvrtDate.getUTCFullYear() +  "-" + (cnvrtDate.getUTCMonth()+1) + '-' + cnvrtDate.getUTCDate() );
                        }

                        $scope.nameOfOwner = vesselMasterData[0].nameofownerprincipal;
                        $scope.ownerIMO = vesselMasterData[0].ownerIMO;
                        $scope.ownerAddress = vesselMasterData[0].ownerAddress;
                        $scope.ownerEmergencyName = vesselMasterData[0].ownerEmergencyName;
                        $scope.ownerEmergencyContactNumber = vesselMasterData[0].ownerEmergencyContactNumber;

                        $scope.nameOfActualOwner = vesselMasterData[0].actualprincipal;
                        $scope.actualOwnerIMO = vesselMasterData[0].actualOwnerIMO;
                        $scope.actualOwnerAddress = vesselMasterData[0].actualOwnerAddress;
                        $scope.actualOwnerEmergencyName = vesselMasterData[0].actualOwnerEmergencyName;
                        $scope.actualOwnerEmergencyContactNumber = vesselMasterData[0].actualOwnerEmergencyContactNumber;

                        $scope.nameOfRegisteredOwner = vesselMasterData[0].nameofregisteredowner;
                        $scope.registeredOwnerIMO = vesselMasterData[0].registeredOwnerIMO;
                        $scope.registeredOwnerAddress = vesselMasterData[0].registeredOwnerAddress;
                        $scope.registeredOwnerEmergencyName = vesselMasterData[0].registeredOwnerEmergencyName;
                        $scope.registeredOwnerEmergencyContactNumber = vesselMasterData[0].registeredOwnerEmergencyContactNumber;

                        /* DIMENSION DETAILS */
                        $scope.length = parseFloat(vesselMasterData[0].lengthloa);
                        $scope.depth = parseFloat(vesselMasterData[0].depth);
                        $scope.LBP = parseFloat(vesselMasterData[0].lbp);
                        $scope.draft = parseFloat(vesselMasterData[0].draft);
                        $scope.breadth = parseFloat(vesselMasterData[0].breadth);;
                        $scope.deadWeight = parseFloat(vesselMasterData[0].deadweight);
                        $scope.height = parseFloat(vesselMasterData[0].height);
                        $scope.capacityUnit = vesselMasterData[0].capacityunit;
                        $scope.capacityValue = parseFloat(vesselMasterData[0].capacity);

                        $scope.internationalGT = parseFloat(vesselMasterData[0].internationalGrosston);
                        $scope.NTSuez = parseFloat(vesselMasterData[0].ntSuez);
                        $scope.internationalNT = parseFloat(vesselMasterData[0].internationalNetton);
                        $scope.GTPan = parseFloat(vesselMasterData[0].gtpan);
                        $scope.registeredGT = parseFloat(vesselMasterData[0].registeredGrosston);
                        $scope.UMS = parseFloat(vesselMasterData[0].msums);
                        $scope.registeredNT = parseFloat(vesselMasterData[0].registeredNetton);
                        $scope.lightShip = parseFloat(vesselMasterData[0].lightShip);
                        $scope.GTSuez = parseFloat(vesselMasterData[0].gtSuez);
                        $scope.constant = parseFloat(vesselMasterData[0].constant);

                        /* MANAGEMENT RESOURCE */
                        $scope.superintendent = vesselMasterData[0].superintendent;
                        $scope.fleetManager = vesselMasterData[0].fleetmanager;
                        $scope.fleetGM = vesselMasterData[0].fleetgm;
                        $scope.firstBackup = vesselMasterData[0].firstBackupSI;
                        $scope.secondBackup = vesselMasterData[0].secondBackupSI;
                        $scope.HSEQSuperintendant = vesselMasterData[0].hseqSuperintendant;
                        $scope.HSEQManager = vesselMasterData[0].hseqManager;
                        $scope.marineOperationSI = vesselMasterData[0].marineOperationSI;
                        $scope.marineOperationManager = vesselMasterData[0].marineOperationManager;
                        $scope.purchaseUnit = vesselMasterData[0].purchaseunit;
                        $scope.accountant = vesselMasterData[0].accountant;
                        $scope.purchaser = vesselMasterData[0].purchaser;
                        $scope.crewInCharge = vesselMasterData[0].crewInCharge;
                        $scope.invoicerName = vesselMasterData[0].invoicername;

                        var startDateOfSuperintendent = new Date(vesselMasterData[0].startdatesuperintendent);
                        startDateOfSuperintendent = (startDateOfSuperintendent.getUTCMonth() + 1 + '/' + startDateOfSuperintendent.getUTCDate() + "/" + startDateOfSuperintendent.getUTCFullYear());
                        $scope.startDateOfSuperintendent = new Date(vesselMasterData[0].startdatesuperintendent);

                        /* MACHINERY DETAILS */
                        $scope.mainEngineMake = vesselMasterData[0].mainEngineMake;
                        $scope.mainEngineType = vesselMasterData[0].mainEngineType;
                        $scope.license = vesselMasterData[0].license;
                        $scope.noOfCylinder = parseInt(vesselMasterData[0].noOfCylinder);
                        $scope.NSRPs = vesselMasterData[0].nsrPs;
                        $scope.NSRKw = vesselMasterData[0].nsrKw;
                        $scope.MCRPs = vesselMasterData[0].mcrPs;
                        $scope.MCRKw = vesselMasterData[0].mcrKw;
                        $scope.turboChargerMake = vesselMasterData[0].turboChargerMake;
                        $scope.turboChargerType = vesselMasterData[0].turboChargerType;
                        $scope.camelessOrNot = vesselMasterData[0].camlessornot;

                        /* COMMUNICATION */
                        $scope.MMSINo = parseFloat(vesselMasterData[0].mmsino);
                        console.log(vesselMasterData[0].cellphone);
                        $scope.tags = vesselMasterData[0].cellphone.split(":");
                        $scope.cellPhone = vesselMasterData[0].cellphone;
                        $scope.DHLDigits = vesselMasterData[0].aatdhldigits;
                        $scope.iridiumPhone = vesselMasterData[0].iridiumphone;
                        $scope.satCID = vesselMasterData[0].satCID;
                        $scope.satABEmail = vesselMasterData[0].satEmail;

                        $scope.satABFTelex = vesselMasterData[0].satTelex;
                        $scope.satABFVoice = vesselMasterData[0].satVoice;
                        $scope.satABFFax = vesselMasterData[0].satFax;
                        $scope.satABFData = vesselMasterData[0].satData;
                        $scope.satABFHSD = vesselMasterData[0].satHSD;
                        
                        
                     
                        	
                        }else{
//                        	$scope.dialog.open();
//                        	$scope.dataerror = response.data.message;
                        	$scope.geterrorstatuscode =response.data.status;
                        	$scope.errordetails=response.data.exceptionDetail;
 	 	                	$scope.showexception=response.data.showerrormessage
 	 	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
 	 						$scope.dataerror = [response.data.message[0]];
                        }
                        $rootScope.showScreenOverlay = false;
                        
                    });
	           	 }, function(error){
	      				  $scope.dialog.open();
	   				  $scope.dataerror = "Server not reached";
	           	 });	
            }else{
            	Connectivity.IsOk().then(function(response){
            		$rootScope.showScreenOverlay = true;
            		vesselMasterService.getVesselMasterFlags().then(function(response) {
                    	console.log(response,'response >>>>>>>>>>>>>>>>>>>> ?????????????????? ')
                    	console.log(response.data.data[0].vesselMasterFlag,'response.data.data.vesselMasterFlag get components >>>>>>>>>>>>>>>>>>>> ')
                        $scope.flagsList = response.data.data[0].vesselMasterFlag;
                    	$scope.fleetManagersList =  response.data.data[0].fleetManager;
                    	$scope.superintendentList =  response.data.data[0].superintendent;
                    	$scope.fleetGMList =  response.data.data[0].fleetGM;
                    	$scope.hseqManagerList =  response.data.data[0].hsqeManager;
                    	$scope.hseqSIList =  response.data.data[0].hseqSI;
                    	$scope.marineManagersList =  response.data.data[0].marineManager;
                    	$scope.marineSIList =  response.data.data[0].marineSI;
                    	$scope.purchaserList =  response.data.data[0].purchaser;
                    	$scope.accountantList =  response.data.data[0].accountant;
                    	$scope.crewInChargeList =  response.data.data[0].crewIncharge;
                    	$scope.invoicerList =  response.data.data[0].invoicer;
                    	$scope.vesselTypeList =  response.data.data[0].vesselType;
                    	$scope.fleetList =  response.data.data[0].fleets;
                    	$scope.empList =  response.data.data[0].superintendents;
                    	$scope.ranksList =  response.data.data[0].vesselMasterRanks;
                    	$scope.shorecodesList =  response.data.data[0].shoreMaster;
                    	$scope.currencycodesList =  response.data.data[0].currency;
                    	$scope.auxEngineEqpList =  response.data.data[0].auxenginemaster;
                    	$scope.auxMachineEqpList =  response.data.data[0].auxmachinerymaster;
                    	$scope.vesselNavEqpList =  response.data.data[0].navigationmaster;
                    	 if(response.data.status === 0){
                         	
                         }else{
//                         	$scope.dialog.open();
//                         	$scope.dataerror = response.data.message;
                        	 $scope.errordetails=response.data.exceptionDetail;
  	 	                	$scope.showexception=response.data.showerrormessage
  	 	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
  	 						$scope.dataerror = [response.data.message[0]];
                         }
                    	 $rootScope.showScreenOverlay = false;
                    	
                    });
	    		}, function(error){
					  $scope.dialog.open();
					  $scope.dataerror = "Server not reached";
	    		});            
            }  
            
            
            
            
        $scope.statusList = ['Active', 'Void'];

        $scope.flagsList = [];
        $scope.fleetManagersList = [];
        $scope.superintendentList = [];
        $scope.fleetGMList = [];
        $scope.hseqManagerList = [];
        $scope.hseqSIList = [];
        $scope.marineManagersList = [];
        $scope.marineSIList = [];
        $scope.purchaserList = [];
        $scope.accountantList = [];
        $scope.crewInChargeList = [];
        $scope.invoicerList = [];
        $scope.vesselTypeList = [];
        $scope.fleetList = [];
        $scope.empList = [];
        $scope.ranksList = [];
        $scope.shorecodesList = [];
        $scope.currencycodesList = [];
        $scope.auxEngineEqpList = [];
        $scope.auxMachineEqpList = [];
        $scope.vesselNavEqpList = [];
        
        $scope.portnameList = [];
        $scope.ports = [];
        
        $scope.btnPortCodeActionPerformed = function(){
        	$scope.showPortModal = true;
        	$scope.portnameList = [];
        	 $scope.ports = [];
        	 vesselMasterService.getVesselMasterPortNames($scope.portOfRegistry).then(function(response) {
             	$scope.ports = response.data;
             	angular.forEach($scope.ports, function(value, key) {
             		var portcode = value.portcode;
	        		var portname = value.portname;
	       		    $scope.portnameList.push({"key":portcode, "value":portname});
	       		});
             });
        	 
        }
        
 

        $scope.btnPortCodeFunction = function(){
        	if($scope.portOfRegistry.lenght !== 0)
        		{
        			$scope.btnPortCode = true;
        		}
        }


        $scope.vessels = [];

        $scope.vesselsDuplicateError = false;
        $scope.vesselsEntryError = false;

        function checkDuplicateVessels() {
            for (i = 0; i < $scope.vessels.length; i++) {
                if ($scope.addedVesselName === $scope.vessels[i].vesselname) {
                    return true;
                }
            }
            return false;
        }

        // Function to add a vessel
        $scope.addVesselName = function() {
            if ($scope.addedVesselName !== '' && $scope.addedVesselName !== undefined) {
                if (checkDuplicateVessels() === false) {
                    var obj = {
                        'vesselcode': $scope.vesselCode,
                        'vesselname': $scope.addedVesselName
                    }
                    $scope.vessels.push(obj);



                    $scope.addedVesselName = '';
                    $scope.vesselsDuplicateError = false;
                    $scope.vesselsEntryError = false;
                } else {
                    $scope.addedVesselName = '';
                    $scope.vesselsDuplicateError = true;
                    $scope.vesselsEntryError = false;
                }

            } else {
                $scope.vesselsDuplicateError = false;
                $scope.vesselsEntryError = true;
            }
        }

        // Function to delete a vessel
        $scope.deleteVesselNameList = []
        $scope.deleteVesselName = function(index) {
            $scope.deleteVesselNameList.push($scope.vessels[index]);
            $scope.vessels.splice(index, 1);
        }

        $scope.formerManagements = [];

        function checkDuplicate() {
            for (i = 0; i < $scope.formerManagements.length; i++) {
                if ($scope.addedFormerManagementRank === $scope.formerManagements[i].rankcode &&
                    $scope.addedFormerManagementName === $scope.formerManagements[i].vesselname) {
                    return true;
                }
            }
            return false;
        }

        $scope.vesselFormerManagementDuplicateError = false;
        $scope.vesselFormerManagementEntryError = false;

        // Function to add a former management
        $scope.addFormerManagement = function() {
            if ($scope.addedFormerManagementRank !== '' && $scope.addedFormerManagementRank !== undefined &&
                $scope.addedFormerManagementName !== '' && $scope.addedFormerManagementName !== undefined) {
                if (checkDuplicate() === false) {
                    var obj = {
                        'vesselcode': $scope.vesselCode,
                        'rankcode': $scope.addedFormerManagementRank,
                        'vesselname': $scope.addedFormerManagementName
                    }


                    console.log('HEREEEEEEEE', obj);

                    $scope.formerManagements.push(obj);
                    $scope.addedFormerManagementRank = '';
                    $scope.addedFormerManagementName = '';
                    $scope.vesselFormerManagementDuplicateError = false;
                    $scope.vesselFormerManagementEntryError = false;
                } else {
                    $scope.addedFormerManagementRank = '';
                    $scope.addedFormerManagementName = '';
                    $scope.vesselFormerManagementDuplicateError = true;
                    $scope.vesselFormerManagementEntryError = false;
                }

            } else {
                $scope.vesselFormerManagementDuplicateError = false;
                $scope.vesselFormerManagementEntryError = true;
            }
        }

        // Function to delete a former management
        $scope.deleteFormerManagementList = []
        $scope.deleteFormerManagement = function(index) {
            $scope.deleteFormerManagementList.push($scope.formerManagements[index]);
            $scope.formerManagements.splice(index, 1);
        }

        /* BASIC INFORMATION TAB */
        $scope.vesselCode;
        $scope.vesselName;

        $scope.vesselType;
        $scope.fleet;

        $scope.flag;
        $scope.portOfRegistry = '';

        $scope.typeOfManagement;
        $scope.ownerBusinessSection;

        $scope.managementCompany;
        $scope.companyIMONumber;

        $scope.formerManagementCompany;
        $scope.companyAccountCode;

        $scope.ownerAccountCode;
        $scope.baseCurrency;

        $scope.financialYearEnd;
        $scope.vesselkpi;
        $scope.shipYard;
        $scope.dateOfBuild;

        $scope.age;
        $scope.hullNo;

        $scope.IMONo;
        $scope.officialNo;

        $scope.callSign;
        $scope.CBA;

        $scope.class;
        $scope.classNo;

        $scope.nationalityRating;
        $scope.totalCrew;

        $scope.status = 'Active';

        /* DETAILED INFORMATION */

        $scope.insuranceHullAndMachineries;
        $scope.insurancePI;

        $scope.startingManagementDate;
        $scope.lastDryDockDate;
        $scope.nextDryDockDate;
        $scope.deliveryDate;

        $scope.nameOfOwner;
        $scope.ownerIMO;
        $scope.ownerAddress;
        $scope.ownerEmergencyName;
        $scope.ownerEmergencyContactNumber;

        $scope.nameOfActualOwner;
        $scope.actualOwnerIMO;
        $scope.actualOwnerAddress;
        $scope.actualOwnerEmergencyName;
        $scope.actualOwnerEmergencyContactNumber;

        $scope.nameOfRegisteredOwner;
        $scope.registeredOwnerIMO;
        $scope.registeredOwnerAddress;
        $scope.registeredOwnerEmergencyName;
        $scope.registeredOwnerEmergencyContactNumber;

        /* DIMENSION DETAILS */
        $scope.length;
        $scope.depth;
        $scope.LBP;
        $scope.draft;
        $scope.breadth;
        $scope.deadWeight;
        $scope.height;
        $scope.capacityUnit;
        $scope.capacityValue;

        $scope.internationalGT;
        $scope.NTSuez;
        $scope.internationalNT;
        $scope.GTPan;
        $scope.registeredGT;
        $scope.UMS;
        $scope.registeredNT;
        $scope.lightShip;
        $scope.GTSuez;
        $scope.constant;

        /* MANAGEMENT RESOURCE */
        $scope.superintendent;
        $scope.fleetManager;
        $scope.fleetGM;
        $scope.firstBackup;
        $scope.secondBackup;
        $scope.HSEQSuperintendant;
        $scope.HSEQManager;
        $scope.marineOperationSI;
        $scope.marineOperationManager;
        $scope.purchaseUnit;
        $scope.accountant;
        $scope.purchaser;
        $scope.crewInCharge;
        $scope.invoicerName;
        $scope.startDateOfSuperintendent;

        /* MACHINERY DETAILS */
        $scope.mainEngineMake;
        $scope.mainEngineType;
        $scope.license;
        $scope.noOfCylinder;
        $scope.NSRPs;
        $scope.NSRKw;
        $scope.MCRPs;
        $scope.MCRKw;
        $scope.turboChargerMake;
        $scope.turboChargerType;
        $scope.camelessOrNot;

        /* COMMUNICATION */
        $scope.MMSINo;
        $scope.cellPhone;
        $scope.DHLDigits;
        $scope.iridiumPhone;
        $scope.satCID;
        $scope.satABEmail;

        $scope.satABFTelex;
        $scope.satABFVoice;
        $scope.satABFFax;
        $scope.satABFData;
        $scope.satABFHSD;


        /* VESSEL AUX ENGINE TABLE */
        $scope.vesselAuxEngineList = [];
        $scope.vesselAuxEngineEquipmentName;
        $scope.vesselAuxEngineMake;
        $scope.vesselAuxEngineType;
        $scope.vesselAuxEngineHPUnit;
        $scope.vesselAuxEngineHP;



        // Test Alphanumeric Data
        function isAlphaNumeric(str) {
            var pattern = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$');
            return pattern.test(str);
        }

        var dataValidated = true;

        // Errors
        $scope.vesselCodeRequiredError = false;
        $scope.vesselNameRequiredError = false;

        $scope.vesselTypeRequiredError = false;
        $scope.fleetRequiredError = false;

        $scope.flagRequiredError = false;
        $scope.portOfRegistryRequiredError = false;

        $scope.typeOfManagementRequiredError = false;
        $scope.ownerBusinessSectionRequiredError = false;

        $scope.managementCompanyRequiredError = false;
        $scope.companyIMONumberRequiredError = false;

        $scope.companyAccountCodeRequiredError = false;

        $scope.ownerAccountCodeRequiredError = false;
        $scope.baseCurrencyRequiredError = false;

        $scope.financialYearEndRequiredError = false;
        $scope.vesselKPIRequiredError = false;
        $scope.shipYardRequiredError = false;
        $scope.dateOfBuildRequiredError = false;

        $scope.ageRequiredError = false;
        $scope.hullNoRequiredError = false;

        $scope.IMONoRequiredError = false;
        $scope.officialNoRequiredError = false;

        $scope.callSignRequiredError = false;
        $scope.CBARequiredError = false;

        $scope.classRequiredError = false;
        $scope.classNoRequiredError = false;

        $scope.statusRequiredError = false;

        /* DETAILED INFORMATION */

        $scope.insuranceHullAndMachineriesRequiredError = false;
        $scope.insurancePIRequiredError = false;

        $scope.startingManagementDateRequiredError = false;
        $scope.lastDryDockDateRequiredError = false;
        $scope.nextDryDockDateRequiredError = false;
        $scope.deliveryDateRequiredError = false;

        $scope.nameOfOwnerRequiredError = false;
        $scope.ownerIMORequiredError = false;
        $scope.ownerAddressRequiredError = false;
        $scope.ownerEmergencyNameRequiredError = false;
        $scope.ownerEmergencyContactNumberRequiredError = false;

        $scope.nameOfActualOwnerRequiredError = false;
        $scope.actualOwnerIMORequiredError = false;
        $scope.actualOwnerAddressRequiredError = false;
        $scope.actualOwnerEmergencyNameRequiredError = false;
        $scope.actualOwnerEmergencyContactNumberRequiredError = false;

        $scope.nameOfRegisteredOwnerRequiredError = false;
        $scope.registeredOwnerIMORequiredError = false;
        $scope.registeredOwnerAddressRequiredError = false;
        $scope.registeredOwnerEmergencyNameRequiredError = false;
        $scope.registeredOwnerEmergencyContactNumberRequiredError = false;

        /* DIMENSION DETAILS */
        $scope.lengthRequiredError = false;
        $scope.depthRequiredError = false;
        $scope.LBPRequiredError = false;
        $scope.draftRequiredError = false;
        $scope.breadthRequiredError = false;
        $scope.deadWeightRequiredError = false;
        $scope.heightRequiredError = false;
        $scope.capacityUnitRequiredError = false;
        $scope.capacityValueRequiredError = false;

        $scope.internationalGTRequiredError = false;
        $scope.NTSuezRequiredError = false;
        $scope.internationalNTRequiredError = false;
        $scope.GTPanRequiredError = false;
        $scope.registeredGTRequiredError = false;
        $scope.UMSRequiredError = false;
        $scope.registeredNTRequiredError = false;
        $scope.lightShipRequiredError = false;
        $scope.GTSuezRequiredError = false;
        $scope.constantRequiredError = false;

        /* MANAGEMENT RESOURCE */
        $scope.superintendentRequiredError = false;
        $scope.fleetManagerRequiredError = false;
        $scope.fleetGMRequiredError = false;
        $scope.firstBackupRequiredError = false;
        $scope.secondBackupRequiredError = false;
        $scope.HSEQSuperintendantRequiredError = false;
        $scope.HSEQManagerRequiredError = false;
        $scope.marineOperationSIRequiredError = false;
        $scope.marineOperationManagerRequiredError = false;
        $scope.purchaseUnitRequiredError = false;
        $scope.accountantRequiredError = false;
        $scope.purchaserRequiredError = false;
        $scope.crewInChargeRequiredError = false;
        $scope.invoicerNameRequiredError = false;
        $scope.startDateOfSuperintendentRequiredError = false;

        /* MACHINERY DETAILS */
        $scope.mainEngineMakeRequiredError = false;
        $scope.mainEngineTypeRequiredError = false;
        $scope.licenseRequiredError = false;
        $scope.noOfCylinderRequiredError = false;
        $scope.NSRPsRequiredError = false;
        $scope.NSRKwRequiredError = false;
        $scope.MCRPsRequiredError = false;
        $scope.MCRKwRequiredError = false;
        $scope.turboChargerMakeRequiredError = false;
        $scope.turboChargerTypeRequiredError = false;
        $scope.camelessOrNotRequiredError = false;

        /* COMMUNICATION */
        $scope.MMSInoRequiredError = false;
        $scope.cellPhoneRequiredError = false;
        $scope.DHLDigitsRequiredError = false;
        $scope.iridiumPhoneRequiredError = false;
        $scope.satCIDRequiredError = false;
        $scope.satABEmailRequiredError = false;

        $scope.satABFTelexRequiredError = false;
        $scope.satABFVoiceRequiredError = false;
        $scope.satABFFaxRequiredError = false;
        $scope.satABFDataRequiredError = false;
        $scope.satABFHSDRequiredError = false;

        /* ROOT CAUSE ERRORS */
        $scope.classNoRootCauseError1 = false;
        $scope.classNoRootCauseError2 = false;

        $scope.vesselAuxEngineRequiredError = false;
        $scope.vesselAuxMachineRequiredError = false;

        $scope.vesselCodeRootCauseError = false;

        $scope.depthNaNError = false;
        $scope.draftNaNError = false
        $scope.breadthNaNError = false;
        $scope.lengthNaNError = false;
        $scope.deadWeightNaNError = false;
        $scope.heightNaNError = false;

        function resetErrors() {
            // Errors
            $scope.vesselCodeRequiredError = false;
            $scope.vesselNameRequiredError = false;

            $scope.vesselTypeRequiredError = false;
            $scope.fleetRequiredError = false;

            $scope.flagRequiredError = false;
            $scope.portOfRegistryRequiredError = false;

            $scope.typeOfManagementRequiredError = false;
            $scope.ownerBusinessSectionRequiredError = false;

            $scope.managementCompanyRequiredError = false;
            $scope.companyIMONumberRequiredError = false;

            $scope.companyAccountCodeRequiredError = false;

            $scope.ownerAccountCodeRequiredError = false;
            $scope.baseCurrencyRequiredError = false;

            $scope.financialYearEndRequiredError = false;
            $scope.vesselKPIRequiredError = false;
            $scope.shipYardRequiredError = false;
            $scope.dateOfBuildRequiredError = false;

            $scope.ageRequiredError = false;
            $scope.hullNoRequiredError = false;

            $scope.IMONoRequiredError = false;
            $scope.officialNoRequiredError = false;

            $scope.callSignRequiredError = false;
            $scope.CBARequiredError = false;

            $scope.classRequiredError = false;
            $scope.classNoRequiredError = false;

            $scope.statusRequiredError = false;

            /* DETAILED INFORMATION */

            $scope.insuranceHullAndMachineriesRequiredError = false;
            $scope.insurancePIRequiredError = false;

            $scope.startingManagementDateRequiredError = false;
            $scope.lastDryDockDateRequiredError = false;
            $scope.nextDryDockDateRequiredError = false;
            $scope.deliveryDateRequiredError = false;

            $scope.nameOfOwnerRequiredError = false;
            $scope.ownerIMORequiredError = false;
            $scope.ownerAddressRequiredError = false;
            $scope.ownerEmergencyNameRequiredError = false;
            $scope.ownerEmergencyContactNumberRequiredError = false;

            $scope.nameOfActualOwnerRequiredError = false;
            $scope.actualOwnerIMORequiredError = false;
            $scope.actualOwnerAddressRequiredError = false;
            $scope.actualOwnerEmergencyNameRequiredError = false;
            $scope.actualOwnerEmergencyContactNumberRequiredError = false;

            $scope.nameOfRegisteredOwnerRequiredError = false;
            $scope.registeredOwnerIMORequiredError = false;
            $scope.registeredOwnerAddressRequiredError = false;
            $scope.registeredOwnerEmergencyNameRequiredError = false;
            $scope.registeredOwnerEmergencyContactNumberRequiredError = false;

            /* DIMENSION DETAILS */
            $scope.lengthRequiredError = false;
            $scope.depthRequiredError = false;
            $scope.LBPRequiredError = false;
            $scope.draftRequiredError = false;
            $scope.breadthRequiredError = false;
            $scope.deadWeightRequiredError = false;
            $scope.heightRequiredError = false;
            $scope.capacityUnitRequiredError = false;
            $scope.capacityValueRequiredError = false;

            $scope.internationalGTRequiredError = false;
            $scope.NTSuezRequiredError = false;
            $scope.internationalNTRequiredError = false;
            $scope.GTPanRequiredError = false;
            $scope.registeredGTRequiredError = false;
            $scope.UMSRequiredError = false;
            $scope.registeredNTRequiredError = false;
            $scope.lightShipRequiredError = false;
            $scope.GTSuezRequiredError = false;
            $scope.constantRequiredError = false;

            /* MANAGEMENT RESOURCE */
            $scope.superintendentRequiredError = false;
            $scope.fleetManagerRequiredError = false;
            $scope.fleetGMRequiredError = false;
            $scope.firstBackupRequiredError = false;
            $scope.secondBackupRequiredError = false;
            $scope.HSEQSuperintendantRequiredError = false;
            $scope.HSEQManagerRequiredError = false;
            $scope.marineOperationSIRequiredError = false;
            $scope.marineOperationManagerRequiredError = false;
            $scope.purchaseUnitRequiredError = false;
            $scope.accountantRequiredError = false;
            $scope.purchaserRequiredError = false;
            $scope.crewInChargeRequiredError = false;
            $scope.invoicerNameRequiredError = false;
            $scope.startDateOfSuperintendentRequiredError = false;

            /* MACHINERY DETAILS */
            $scope.mainEngineMakeRequiredError = false;
            $scope.mainEngineTypeRequiredError = false;
            $scope.licenseRequiredError = false;
            $scope.noOfCylinderRequiredError = false;
            $scope.NSRPsRequiredError = false;
            $scope.NSRKwRequiredError = false;
            $scope.MCRPsRequiredError = false;
            $scope.MCRKwRequiredError = false;
            $scope.turboChargerMakeRequiredError = false;
            $scope.turboChargerTypeRequiredError = false;
            $scope.camelessOrNotRequiredError = false;

            /* COMMUNICATION */
            $scope.MMSInoRequiredError = false;
            $scope.cellPhoneRequiredError = false;
            $scope.DHLDigitsRequiredError = false;
            $scope.iridiumPhoneRequiredError = false;
            $scope.satCIDRequiredError = false;
            $scope.satABEmailRequiredError = false;

            $scope.satABFTelexRequiredError = false;
            $scope.satABFVoiceRequiredError = false;
            $scope.satABFFaxRequiredError = false;
            $scope.satABFDataRequiredError = false;
            $scope.satABFHSDRequiredError = false;

            $scope.vesselAuxEngineRequiredError = false;
            $scope.vesselAuxMachineRequiredError = false;

            /* ROOT CAUSE ERRORS */
            $scope.classNoRootCauseError1 = false;
            $scope.classNoRootCauseError2 = false;

            $scope.vesselCodeRootCauseError = false;

            $scope.depthNaNError = false;
            $scope.draftNaNError = false
            $scope.breadthNaNError = false;
            $scope.lengthNaNError = false;
            $scope.deadWeightNaNError = false;
            $scope.heightNaNError = false;

        }

        $scope.portnameclear = function(){
        	if($scope.portOfRegistry === '' || $scope.portOfRegistry === null){
        		$scope.portOfRegistryName = '';
        	}
        }
        
        // Function to validate vessel master form
        $scope.validateVesselMasterForm = function() {
        	$scope.isSaving = true;
            var raiseErrorFlag = false;
            resetErrors();
            /* BASIC INFORMATION VALIDATIONS */
            if (!$scope.vesselCode) {
                $scope.vesselCodeRequiredError = true;
                raiseErrorFlag = true;
            } else if ($scope.vesselCode.length > 6) {
                $scope.vesselCodeRootCauseError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.vesselName) {
                $scope.vesselNameRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.vesselType) {
                $scope.vesselTypeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.fleet) {
                $scope.fleetRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.flag) {
                $scope.flagRequiredError = true;
                raiseErrorFlag = true;
            }

            //            if (!$scope.portOfRegistry) {
            //                $scope.portOfRegistryRequiredError = true;
            //                raiseErrorFlag = true;
            //            }

            if (!$scope.typeOfManagement) {
                $scope.typeOfManagementRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.ownerBusinessSection) {
                $scope.ownerBusinessSectionRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.managementCompany) {
                $scope.managementCompanyRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.companyIMONumber) {
                $scope.companyIMONumberRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.companyAccountCode) {
                $scope.companyAccountCodeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.ownerAccountCode) {
                $scope.ownerAccountCodeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.baseCurrency) {
                $scope.baseCurrencyRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.financialYearEnd) {
                $scope.financialYearEndRequiredError = true;
                raiseErrorFlag = true;
            }
            
            if (!$scope.vesselkpi) {
                $scope.vesselKPIRequiredError = true;
                raiseErrorFlag = true;
            }
            
            if (!$scope.shipYard) {
                $scope.shipYardRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.dateOfBuild) {
                $scope.dateOfBuildRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.age) {
                $scope.ageRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.hullNo) {
                $scope.hullNoRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.IMONo) {
                $scope.IMONoRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.officialNo) {
                $scope.officialNoRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.callSign) {
                $scope.callSignRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.CBA) {
                $scope.CBARequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.class) {
                $scope.classRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.classNo) {
                $scope.classNoRequiredError = true;
                raiseErrorFlag = true;
            } else if (isAlphaNumeric($scope.classNo) === false) {
                $scope.classNoRootCauseError1 = true;
                raiseErrorFlag = true;
            } else if ($scope.classNo.length > 10) {
                $scope.classNoRootCauseError2 = true;
                raiseErrorFlag = true;
            }

            if (!$scope.status) {
                $scope.statusRequiredError = true;
                raiseErrorFlag = true;
            }

            /* DETAILED INFORMATION VALIDATIONS */

            if (!$scope.insuranceHullAndMachineries) {
                $scope.insuranceHullAndMachineriesRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.insurancePI) {
                $scope.insurancePIRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.startingManagementDate) {
                $scope.startingManagementDateRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.lastDryDockDate) {
                $scope.lastDryDockDateRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.nextDryDockDate) {
                $scope.nextDryDockDateRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.deliveryDate) {
                $scope.deliveryDateRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.nameOfOwner) {
                $scope.nameOfOwnerRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.ownerIMO) {
                $scope.ownerIMORequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.ownerAddress) {
                $scope.ownerAddressRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.ownerEmergencyName) {
                $scope.ownerEmergencyNameRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.ownerEmergencyContactNumber) {
                $scope.ownerEmergencyContactNumberRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.nameOfActualOwner) {
                $scope.nameOfActualOwnerRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.actualOwnerIMO) {
                $scope.actualOwnerIMORequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.actualOwnerAddress) {
                $scope.actualOwnerAddressRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.actualOwnerEmergencyName) {
                $scope.actualOwnerEmergencyNameRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.actualOwnerEmergencyContactNumber) {
                $scope.actualOwnerEmergencyContactNumberRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.nameOfRegisteredOwner) {
                $scope.nameOfRegisteredOwnerRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.registeredOwnerIMO) {
                $scope.registeredOwnerIMORequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.registeredOwnerAddress) {
                $scope.registeredOwnerAddressRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.registeredOwnerEmergencyName) {
                $scope.registeredOwnerEmergencyNameRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.registeredOwnerEmergencyContactNumber) {
                $scope.registeredOwnerEmergencyContactNumberRequiredError = true;
                raiseErrorFlag = true;
            }

            /* DIMENSION DETAILS VALIDATIONS */

            if (!$scope.length) {
                $scope.lengthRequiredError = true;
                raiseErrorFlag = true;
            } else if (isNaN($scope.length) === true) {
                $scope.lengthNaNError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.depth) {
                $scope.depthRequiredError = true;
                raiseErrorFlag = true;
            } else if (isNaN($scope.depth) === true) {
                $scope.depthNaNError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.LBP) {
                $scope.LBPRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.draft) {
                $scope.draftRequiredError = true;
                raiseErrorFlag = true;
            } else if (isNaN($scope.draft) === true) {
                $scope.draftNaNError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.breadth) {
                $scope.breadthRequiredError = true;
                raiseErrorFlag = true;
            } else if (isNaN($scope.breadth) === true) {
                $scope.breadthNaNError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.deadWeight) {
                $scope.deadWeightRequiredError = true;
                raiseErrorFlag = true;
            } else if (isNaN($scope.deadWeight) === true) {
                $scope.deadWeightNaNError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.height) {
                $scope.heightRequiredError = true;
                raiseErrorFlag = true;
            } else if (isNaN($scope.height) === true) {
                $scope.heightNaNError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.capacityUnit) {
                $scope.capacityUnitRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.capacityValue) {
                $scope.capacityValueRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.internationalGT) {
                $scope.internationalGTRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.NTSuez) {
                $scope.NTSuezRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.internationalNT) {
                $scope.internationalNTRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.GTPan) {
                $scope.GTPanRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.registeredGT) {
                $scope.registeredGTRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.UMS) {
                $scope.UMSRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.registeredNT) {
                $scope.registeredNTRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.lightShip) {
                $scope.lightShipRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.GTSuez) {
                $scope.GTSuezRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.constant) {
                $scope.constantRequiredError = true;
                raiseErrorFlag = true;
            }

            /* MANAGEMENT RESOURCE VALIDATIONS */

//            if (!$scope.superintendent) {
//                $scope.superintendentRequiredError = true;
//                raiseErrorFlag = true;
//            }

            if (!$scope.fleetManager) {
                $scope.fleetManagerRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.fleetGM) {
                $scope.fleetGMRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.firstBackup) {
                $scope.firstBackupRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.secondBackup) {
                $scope.secondBackupRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.HSEQSuperintendant) {
                $scope.HSEQSuperintendantRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.HSEQManager) {
                $scope.HSEQManagerRequiredError = true;
                raiseErrorFlag = true;
            }

//            if (!$scope.marineOperationSI) {
//                $scope.marineOperationSIRequiredError = true;
//                raiseErrorFlag = true;
//            }

//            if (!$scope.marineOperationManager) {
//                $scope.marineOperationManagerRequiredError = true;
//                raiseErrorFlag = true;
//            }

//            if (!$scope.purchaseUnit) {
//                $scope.purchaseUnitRequiredError = true;
//                raiseErrorFlag = true;
//            }
//
//            if (!$scope.accountant) {
//                $scope.accountantRequiredError = true;
//                raiseErrorFlag = true;
//            }
//
//            if (!$scope.purchaser) {
//                $scope.purchaserRequiredError = true;
//                raiseErrorFlag = true;
//            }
//
//            if (!$scope.crewInCharge) {
//                $scope.crewInChargeRequiredError = true;
//                raiseErrorFlag = true;
//            }
//
//            if (!$scope.invoicerName) {
//                $scope.invoicerNameRequiredError = true;
//                raiseErrorFlag = true;
//            }
//
//            if (!$scope.startDateOfSuperintendent) {
//                $scope.startDateOfSuperintendentRequiredError = true;
//                raiseErrorFlag = true;
//            }

            /* MACHINERY DETAILS VALIDATIONS */

            if (!$scope.mainEngineMake) {
                $scope.mainEngineMakeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.mainEngineType) {
                $scope.mainEngineTypeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.license) {
                $scope.licenseRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.noOfCylinder) {
                $scope.noOfCylinderRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.NSRPs) {
                $scope.NSRPsRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.NSRKw) {
                $scope.NSRKwRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.MCRPs) {
                $scope.MCRPsRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.MCRKw) {
                $scope.MCRKwRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.turboChargerMake) {
                $scope.turboChargerMakeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.turboChargerType) {
                $scope.turboChargerTypeRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.camelessOrNot) {
                $scope.camelessOrNotRequiredError = true;
                raiseErrorFlag = true;
            }

            /* COMMUNICATION VALIDATIONS */

            if (!$scope.MMSINo) {
                $scope.MMSInoRequiredError = true;
                raiseErrorFlag = true;
            }

            if ($scope.cellPhone === '') {
                $scope.cellPhoneRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.DHLDigits) {
                $scope.DHLDigitsRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.iridiumPhone) {
                $scope.iridiumPhoneRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satCID) {
                $scope.satCIDRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satABEmail) {
                $scope.satABEmailRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satABFTelex) {
                $scope.satABFTelexRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satABFVoice) {
                $scope.satABFVoiceRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satABFFax) {
                $scope.satABFFaxRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satABFData) {
                $scope.satABFDataRequiredError = true;
                raiseErrorFlag = true;
            }

            if (!$scope.satABFHSD) {
                $scope.satABFHSDRequiredError = true;
                raiseErrorFlag = true;
            }

            if ($scope.vesselAuxEngineList.length === 0) {
                $scope.vesselAuxEngineRequiredError = true;
                raiseErrorFlag = true;
            }

            if ($scope.vesselAuxMachineList.length === 0) {
                $scope.vesselAuxMachineRequiredError = true;
                raiseErrorFlag = true;
            }

            if (raiseErrorFlag === true) {
                return true
            } else {
                resetErrors();
                return false;
            }
        }

        
        $scope.auxengChange = function(name){
        	console.log(name,' <<<<<<<<< value changed >?>>>>>>>>>>>>>>>> ')
        }
        
        
        $scope.vesselAuxEngineError = false;

        // Function to add Vessel Aux Engine Details
        $scope.addVesselAuxEngine = function() {
            if ($scope.vesselAuxEngineEquipmentName !== '' && $scope.vesselAuxEngineEquipmentName !== undefined &&
                $scope.vesselAuxEngineMake !== '' && $scope.vesselAuxEngineMake !== undefined &&
                $scope.vesselAuxEngineType !== '' && $scope.vesselAuxEngineType !== undefined &&
                $scope.vesselAuxEngineHPUnit !== '' && $scope.vesselAuxEngineHPUnit !== undefined &&
                $scope.vesselAuxEngineHP !== '' && $scope.vesselAuxEngineHP !== undefined) {
            	
            	for(var i = 0 ; i < $scope.auxEngineEqpList.length; i++){
            		if($scope.auxEngineEqpList[i][0] ===  $scope.vesselAuxEngineEquipmentName){
            			$scope.auxengname = $scope.auxEngineEqpList[i][1];
            		}
            	}
            	
                var obj = {
                    'vesselcode': $scope.vesselCode,
                    'eqpname': $scope.vesselAuxEngineEquipmentName,
                    'eqpmake': $scope.vesselAuxEngineMake,
                    'eqptype': $scope.vesselAuxEngineType,
                    'eqphpunit': $scope.vesselAuxEngineHPUnit,
                    'eqphp': $scope.vesselAuxEngineHP,
                    'auxengname': $scope.auxengname
                }

                $scope.vesselAuxEngineList.push(obj);

                $scope.vesselAuxEngineEquipmentName = '';
                $scope.vesselAuxEngineMake = '';
                $scope.vesselAuxEngineType = '';
                $scope.vesselAuxEngineHPUnit = '';
                $scope.vesselAuxEngineHP = '';
                $scope.vesselAuxEngineError = false;
            } else {
                $scope.vesselAuxEngineError = true;
            }
        }

        // Function to delete a Vessel Aux Engine Details
        $scope.deleteVesselAuxEngineList = [];
        $scope.deleteVesselAuxEngine = function(index) {
            $scope.deleteVesselAuxEngineList.push($scope.vesselAuxEngineList[index]);
            $scope.vesselAuxEngineList.splice(index, 1);
        }


        /* VESSEL AUX MACHINE TABLE */
        $scope.vesselAuxMachineList = [];
        $scope.vesselAuxMachineEquipmentName;
        $scope.vesselAuxMachineMake;
        $scope.vesselAuxMachineType;
        $scope.vesselAuxMachineCapacity;
        $scope.vesselAuxMachineSets;

        $scope.vesselAuxMachineError = false;

        // Function to add Vessel Aux Machine Details
        $scope.addVesselAuxMachine = function() {
            if ($scope.vesselAuxMachineEquipmentName !== '' && $scope.vesselAuxMachineEquipmentName !== undefined &&
                $scope.vesselAuxMachineMake !== '' && $scope.vesselAuxMachineMake !== undefined &&
                $scope.vesselAuxMachineType !== '' && $scope.vesselAuxMachineType !== undefined &&
                $scope.vesselAuxMachineCapacity !== '' && $scope.vesselAuxMachineCapacity !== undefined &&
                $scope.vesselAuxMachineSets !== '' && $scope.vesselAuxMachineSets !== undefined) {

            	for(var i = 0 ; i < $scope.auxMachineEqpList.length; i++){
            		if($scope.auxMachineEqpList[i][0] ===  $scope.vesselAuxMachineEquipmentName){
            			$scope.auxmachname = $scope.auxMachineEqpList[i][1];
            		}
            	}
            	
                var obj = {
                    'vesselcode': $scope.vesselCode,
                    'auxmachname': $scope.vesselAuxMachineEquipmentName,
                    'auxmachmake': $scope.vesselAuxMachineMake,
                    'auxmachtype': $scope.vesselAuxMachineType,
                    'auxmachcapacity': $scope.vesselAuxMachineCapacity,
                    'auxmachsetcnt': $scope.vesselAuxMachineSets,
                    'auxmach_name' : $scope.auxmachname
                }


                $scope.vesselAuxMachineList.push(obj);

                $scope.vesselAuxMachineEquipmentName = '';
                $scope.vesselAuxMachineMake = '';
                $scope.vesselAuxMachineType = '';
                $scope.vesselAuxMachineCapacity = '';
                $scope.vesselAuxMachineSets = '';

                $scope.vesselAuxMachineError = false;
            } else {
                $scope.vesselAuxMachineError = true;
            }
        }

        // Function to delete a Vessel Aux Machine Details
        $scope.deleteVesselAuxMachineList = [];
        $scope.deleteVesselAuxMachine = function(index) {
            $scope.deleteVesselAuxMachineList.push($scope.vesselAuxMachineList[index]);
            $scope.vesselAuxMachineList.splice(index, 1);
        }


        /* VESSEL NAVIGATION EQUIPMENTS TABLE */
        $scope.vesselNavigationList = [];

        $scope.vesselNavigationEquipmentName;
        $scope.vesselNavigationMake;
        $scope.vesselNavigationType;

        $scope.vesselNavigationError = false;

        // Function to add Vessel Navigation Details
        $scope.addVesselNavigation = function() {
            if ($scope.vesselNavigationEquipmentName !== '' && $scope.vesselNavigationEquipmentName !== undefined &&
                $scope.vesselNavigationMake !== '' && $scope.vesselNavigationMake !== undefined &&
                $scope.vesselNavigationType !== '' && $scope.vesselNavigationType !== undefined) {

            	for(var i = 0 ; i < $scope.vesselNavEqpList.length; i++){
            		if($scope.vesselNavEqpList[i][0] ===  $scope.vesselNavigationEquipmentName){
            			$scope.naviname = $scope.vesselNavEqpList[i][1];
            		}
            	}
            	
                var obj = {
                    'vesselcode': $scope.vesselCode,
                    'naviname': $scope.vesselNavigationEquipmentName,
                    'navimake': $scope.vesselNavigationMake,
                    'navitype': $scope.vesselNavigationType,
                    'navi_name' : $scope.naviname,
                }

                $scope.vesselNavigationList.push(obj);
                $scope.vesselNavigationEquipmentName = '';
                $scope.vesselNavigationMake = '';
                $scope.vesselNavigationType = '';
                $scope.vesselNavigationError = false;
            } else {
                $scope.vesselNavigationError = true;
            }
        }

        // Function to delete a Vessel Navigation Details
        $scope.deleteVesselNavigationList = [];
        $scope.deleteVesselNavigation = function(index) {
            $scope.deleteVesselNavigationList.push($scope.vesselNavigationList[index]);
            $scope.vesselNavigationList.splice(index, 1);
        }

        $scope.mandatoryFieldError = false;
        $scope.dataSaved = false;
        
        $scope.storeFormData = function() {
        	
        	var celphone="";
        	for(var i = 0;i<$scope.tags.length ; i++){
        		if(i == $scope.tags.length-1){
        			celphone += $scope.tags[i].text;
        		}else{
        			celphone += $scope.tags[i].text + ":";
        		}
        	}
        	
            if ($scope.validateVesselMasterForm() === false) {
            	if($scope.startDateOfSuperintendent === undefined){
            		$scope.startDateOfSuperintendent1 = "";
            	}else{
            		$scope.startDateOfSuperintendent1 =  new Date($scope.startDateOfSuperintendent);
            	}
            	
            	$scope.isSaving = true;
                var vesselMasterData = {
                    "vesselcode": $scope.vesselCode,
                    "vesselname": $scope.vesselName,
                    "vesselTypeCode": 'VT001',
                    "fleetcode": $scope.fleet,
                    "flagcode": $scope.flag,
                    "portcode": $scope.portOfRegistry,
                    "typeManagement": $scope.typeOfManagement,
                    "businessSection": $scope.ownerBusinessSection,
                    "shorecode": $scope.managementCompany,
                    "companyIMONo": $scope.companyIMONumber,
                    "formerCompany": $scope.formerManagementCompany,
                    "companyAccountCode": $scope.companyAccountCode,
                    "ownerAccountCode": $scope.ownerAccountCode,
                    "currency": $scope.baseCurrency.trim(),
                    "financialYearEnd": $scope.financialYearEnd,
                    "vesselkpi": $scope.vesselkpi,
                    "shipyard": $scope.shipYard,
                    "dateOfBuilt": new Date($scope.dateOfBuild),
                    "age": $scope.age,
                    "hullno": $scope.hullNo,
                    "imono": $scope.IMONo,
                    "officialno": $scope.officialNo,
                    "callsign": $scope.callSign,
                    "cbaca": $scope.CBA,
                    "columnClass": $scope.class,
                    "classno": $scope.classNo,
                    "activeStatus": ($scope.status === 'Active' ? 'A' : 'V'),
                    "insurancehullmachineries": $scope.insuranceHullAndMachineries,
                    "insurancepi": $scope.insurancePI,
                    "startdatemanagement": new Date($scope.startingManagementDate),
                    "lastdrydockdate": new Date($scope.lastDryDockDate),
                    "nextdrydockdate": new Date($scope.nextDryDockDate),
                    "deliverydate": new Date($scope.deliveryDate),
                    "nameofownerprincipal": $scope.nameOfOwner,
                    "ownerIMO": $scope.ownerIMO,
                    "ownerAddress": $scope.ownerAddress,
                    "ownerEmergencyName": $scope.ownerEmergencyName,
                    "ownerEmergencyContactNumber": $scope.ownerEmergencyContactNumber,
                    "actualprincipal": $scope.nameOfActualOwner,
                    "actualOwnerIMO": $scope.actualOwnerIMO,
                    "actualOwnerAddress": $scope.actualOwnerAddress,
                    "actualOwnerEmergencyName": $scope.actualOwnerEmergencyName,
                    "actualOwnerEmergencyContactNumber": $scope.actualOwnerEmergencyContactNumber,
                    "nameofregisteredowner": $scope.nameOfRegisteredOwner,
                    "registeredOwnerIMO": $scope.registeredOwnerIMO,
                    "registeredOwnerAddress": $scope.registeredOwnerAddress,
                    "registeredOwnerEmergencyName": $scope.registeredOwnerEmergencyName,
                    "registeredOwnerEmergencyContactNumber": $scope.registeredOwnerEmergencyContactNumber,
                    "lengthloa": $scope.length,
                    "depth": $scope.depth,
                    "lbp": $scope.LBP,
                    "draft": $scope.draft,
                    "breadth": $scope.breadth,
                    "deadweight": $scope.deadWeight,
                    "height": $scope.height,
                    "capacityunit": $scope.capacityUnit,
                    "capacity": $scope.capacityValue,
                    "internationalGrosston": $scope.internationalGT,
                    "ntSuez": $scope.NTSuez,
                    "internationalNetton": $scope.internationalNT,
                    "gtpan": $scope.GTPan,
                    "registeredGrosston": $scope.registeredGT,
                    "msums": $scope.UMS,
                    "registeredNetton": $scope.registeredNT,
                    "lightShip": $scope.lightShip,
                    "gtSuez": $scope.GTSuez,
                    "constant": $scope.constant,
                    "superintendent": $scope.superintendent,
                    "fleetmanager": $scope.fleetManager,
                    "fleetgm": $scope.fleetGM,
                    "firstBackupSI": $scope.firstBackup,
                    "secondBackupSI": $scope.secondBackup,
                    "hseqSuperintendant": $scope.HSEQSuperintendant,
                    "hseqManager": $scope.HSEQManager,
                    "marineOperationSI": $scope.marineOperationSI,
                    "marineOperationManager": $scope.marineOperationManager,
                    "purchaseunit": $scope.purchaseUnit,
                    "accountant": $scope.accountant,
                    "purchaser": $scope.purchaser,
                    "crewInCharge": $scope.crewInCharge,
                    "invoicername": $scope.invoicerName,
                    "startdatesuperintendent": $scope.startDateOfSuperintendent1,
                    "mainEngineMake": $scope.mainEngineMake,
                    "mainEngineType": $scope.mainEngineType,
                    "license": $scope.license,
                    "noOfCylinder": $scope.noOfCylinder,
                    "nsrPs": $scope.NSRPs,
                    "nsrKw": $scope.NSRKw,
                    "mcrPs": $scope.MCRPs,
                    "mcrKw": $scope.MCRKw,
                    "turboChargerMake": $scope.turboChargerMake,
                    "turboChargerType": $scope.turboChargerType,
                    "camlessornot": $scope.camelessOrNot,
                    "mmsino": $scope.MMSINo,    
                    "cellphone": $scope.cellPhone,
                    "aatdhldigits": $scope.DHLDigits,
                    "iridiumphone": $scope.iridiumPhone,
                    "satCID": $scope.satCID,
                    "satEmail": $scope.satABEmail,
                    "satTelex": $scope.satABFTelex,
                    "satVoice": $scope.satABFVoice,
                    "satFax": $scope.satABFFax,
                    "satData": $scope.satABFData,
                    "satHSD": $scope.satABFHSD,
                    "cruser": 'system',
                    "crdate": new Date(),
                    "upduser": 'system',
                    "upddate":  new Date()
                }

                
                var exVesselNameData = $scope.vessels;
                var exVesselManagementData = $scope.formerManagements;
                var vesselAuxEngineData = $scope.vesselAuxEngineList;
                var vesselAuxMachineData = $scope.vesselAuxMachineList;
                var vesselNavigationData = $scope.vesselNavigationList;

                var deleteVesselAuxMachineData = $scope.deleteVesselAuxMachineList;
                var deleteVesselNameData = $scope.deleteVesselNameList;
                var deleteFormerManagementData = $scope.deleteFormerManagementList;
                var deleteVesselAuxEngineData = $scope.deleteVesselAuxEngineList;
                var deleteVesselNavigationData = $scope.deleteVesselNavigationList;

                var compositeJson = {
                    vesselmasterData: vesselMasterData,
                    exVesselMgnt: exVesselManagementData,
                    exVesselName: exVesselNameData,
                    vesselAuxEngine: vesselAuxEngineData,
                    vesselAuxMachine: vesselAuxMachineData,
                    vesselNavigation: vesselNavigationData,
                    deleteVesselAuxMachine: deleteVesselAuxMachineData,
                    deleteVesselName: deleteVesselNameData,
                    deleteFormerManagement: deleteFormerManagementData,
                    deleteVesselAuxEngine: deleteVesselAuxEngineData,
                    deleteVesselNavigation: deleteVesselNavigationData,
                    isNewVessel :  $scope.savedStstus,
                }

                console.log('HERE WE GOOOO-------------', compositeJson);
                $scope.mandatoryFieldError = false;

                Connectivity.IsOk().then(function(response){
                	 vesselMasterService.saveVesselMasterCompositeForm(compositeJson).then(function(response) {
                         if(response.data.status == 0){	
                         	if($scope.savedStstus === 'save'){
                         	toaster.success({title: "Information", body:"Data has been successfully saved"});
     	                    }else if($scope.savedStstus === 'update'){
     	                    	toaster.success({title: "Information", body:"Data has been successfully updated"});
     	                    }
                         	 $scope.isSaving = false;
         			    }else{
//         					$scope.dialog.open();							
//         					$scope.dataerror = response.data.message;
         					$scope.isSaving = false;
         					$scope.errordetails=response.data.exceptionDetail;
 	 	                	$scope.showexception=response.data.showerrormessage
 	 	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
 	 						$scope.dataerror = [response.data.message[0]];
         				}
                     });
	    		}, function(error){
					  $scope.dialog.open();
					  $scope.dataerror = "Server not reached";
	    		});                
                $scope.isSaving = true;

            } else {
                $scope.mandatoryFieldError = true;
                $scope.dataSaved = false;
                $scope.isSaving = true;
            }
        }
        
       
        
        

        $scope.resetData = function() {
        	  $scope.isSaving = true;
            $scope.vessels = [];
            $scope.formerManagements = [];
            $scope.vesselAuxEngineList = [];
            $scope.vesselAuxMachineList = [];
            $scope.vesselNavigationList = [];

            /* BASIC INFORMATION TAB */
            $scope.vesselCode = '';
            $scope.vesselName = '';

            $scope.vesselType = '';
            $scope.fleet = '';

            $scope.flag = '';
            $scope.portOfRegistry = '';

            $scope.typeOfManagement = '';
            $scope.ownerBusinessSection = '';

            $scope.managementCompany = '';
            $scope.companyIMONumber = '';

            $scope.formerManagementCompany = '';
            $scope.companyAccountCode = '';

            $scope.ownerAccountCode = '';
            $scope.baseCurrency = '';

            $scope.financialYearEnd = '';

            $scope.shipYard = '';
            $scope.dateOfBuild = '';

            $scope.age = '';
            $scope.hullNo = '';

            $scope.IMONo = '';
            $scope.officialNo = '';

            $scope.callSign = '';
            $scope.CBA = '';

            $scope.class = '';
            $scope.classNo = '';

            $scope.nationalityRating = '';
            $scope.totalCrew = '';

            $scope.status = 'Active';

            /* DETAILED INFORMATION */

            $scope.insuranceHullAndMachineries = '';
            $scope.insurancePI = '';

            $scope.startingManagementDate = '';
            $scope.lastDryDockDate = '';
            $scope.nextDryDockDate = '';
            $scope.deliveryDate = '';

            $scope.nameOfOwner = '';
            $scope.ownerIMO = '';
            $scope.ownerAddress = '';
            $scope.ownerEmergencyName = '';
            $scope.ownerEmergencyContactNumber = '';

            $scope.nameOfActualOwner = '';
            $scope.actualOwnerIMO = '';
            $scope.actualOwnerAddress = '';
            $scope.actualOwnerEmergencyName = '';
            $scope.actualOwnerEmergencyContactNumber = '';

            $scope.nameOfRegisteredOwner = '';
            $scope.registeredOwnerIMO = '';
            $scope.registeredOwnerAddress = '';
            $scope.registeredOwnerEmergencyName = '';
            $scope.registeredOwnerEmergencyContactNumber = '';

            /* DIMENSION DETAILS */
            $scope.length = '';
            $scope.depth = '';
            $scope.LBP = '';
            $scope.draft = '';
            $scope.breadth = '';
            $scope.deadWeight = '';
            $scope.height = '';
            $scope.capacityUnit = '',
            $scope.capacityValue = '',

            $scope.internationalGT = '';
            $scope.NTSuez = '';
            $scope.internationalNT = '';
            $scope.GTPan = '';
            $scope.registeredGT = '';
            $scope.UMS = '';
            $scope.registeredNT = '';
            $scope.lightShip = '';
            $scope.GTSuez = '';
            $scope.constant = '';

            /* MANAGEMENT RESOURCE */
            $scope.superintendent = '';
            $scope.fleetManager = '';
            $scope.fleetGM = '';
            $scope.firstBackup = '';
            $scope.secondBackup = '';
            $scope.HSEQSuperintendant = '';
            $scope.HSEQManager = '';
            $scope.marineOperationSI = '';
            $scope.marineOperationManager = '';
            $scope.purchaseUnit = '';
            $scope.accountant = '';
            $scope.purchaser = '';
            $scope.crewInCharge = '';
            $scope.invoicerName = '';
            $scope.startDateOfSuperintendent = '';

            /* MACHINERY DETAILS */
            $scope.mainEngineMake = '';
            $scope.mainEngineType = '';
            $scope.license = '';
            $scope.noOfCylinder = '';
            $scope.NSRPs = '';
            $scope.NSRKw = '';
            $scope.MCRPs = '';
            $scope.MCRKw = '';
            $scope.turboChargerMake = '';
            $scope.turboChargerType = '';
            $scope.camelessOrNot = '';

            /* COMMUNICATION */
            $scope.MMSINo = '';
            $scope.cellPhone = '';
            $scope.DHLDigits = '';
            $scope.iridiumPhone = '';
            $scope.satCID = '';
            $scope.satABEmail = '';

            $scope.satABFTelex = '';
            $scope.satABFVoice = '';
            $scope.satABFFax = '';
            $scope.satABFData = '';
            $scope.satABFHSD = '';
            $scope.isSaving = false;
        }
        
        
        $scope.showPortModal = false; 

        $scope.hide = function(){
            $scope.showPortModal = false;
        }

        $scope.setValue = function(arg1,arg2) {
        	$scope.portOfRegistry=arg1;
        	$scope.portOfRegistryName=arg2;   	
        	$scope.hide();
        }
        
        $scope.focusClear = function(param){
        	
        	if(param === 'vesselcode'){
        		$scope.vesselCodeRequiredError = false;
        		$scope.vesselCodeRootCauseError = false;
        	}else if(param === 'vesseltype'){
        		$scope.vesselTypeRequiredError = false;
        	}else if(param === 'flag'){
        		$scope.flagRequiredError = false;
        	}else if(param === 'typeofmanagement'){
        		$scope.typeOfManagementRequiredError = false;
        	}else if(param === 'managementcompany'){
        		$scope.managementCompanyRequiredError = false;
        	}else if(param === 'formermanagementcompany'){
        		$scope.vesselCodeRequiredError = false;
        	}else if(param === 'owneraccountcode'){
        		$scope.ownerAccountCodeRequiredError = false;
        	}else if(param === 'financialyear'){
        		$scope.financialYearEndRequiredError = false;
        	}else if(param === 'shipyard'){
        		$scope.shipYardRequiredError = false;
        	}else if(param === 'age'){
        		$scope.ageRequiredError = false;
        	}else if(param === 'imono'){
        		$scope.IMONoRequiredError = false;
        	}else if(param === 'callsign'){
        		$scope.callSignRequiredError = false;
        	}else if(param === 'class'){
        		$scope.classRequiredError = false;
        	}else if(param === 'status'){
        		$scope.statusRequiredError = false;
        	}else if(param === 'vesselname'){
        		$scope.vesselNameRequiredError = false;
        	}else if(param === 'fleet'){
        		$scope.fleetRequiredError = false;
        	}else if(param === 'ownersbusinesssection'){
        		$scope.ownerBusinessSectionRequiredError = false;
        	}else if(param === 'companyimono'){
        		$scope.companyIMONumberRequiredError = false;
        	}else if(param === 'companyaccountcode'){
        		$scope.companyAccountCodeRequiredError = false;
        	}else if(param === 'basecurrency'){
        		$scope.baseCurrencyRequiredError = false;
        	}else if(param === 'dateofbuild'){
        		$scope.dateOfBuildRequiredError = false;
        	}else if(param === 'hullno'){
        		$scope.hullNoRequiredError = false;
        	}else if(param === 'officialno'){
        		$scope.officialNoRequiredError = false;
        	}else if(param === 'cbaca'){
        		$scope.CBARequiredError = false;
        	}else if(param === 'calssno'){
        		$scope.classNoRootCauseError1 = false;
        		$scope.classNoRootCauseError2 = false;
        		$scope.classNoRequiredError = false;
        	}else if(param === 'insurancehull'){
        		$scope.insuranceHullAndMachineriesRequiredError = false;
        	}else if(param === 'insurancepi'){
        		$scope.insurancePIRequiredError = false;
        	}else if(param === 'startingdateofmanagement'){
        		$scope.startingManagementDateRequiredError = false;
        	}else if(param === 'nextdrydocdate'){
        		$scope.vesselCodeRequiredError = false;
        	}else if(param === 'nextDryDockDateRequiredError'){
        		$scope.vesselCodeRequiredError = false;
        	}else if(param === 'lastdrydockdate'){
        		$scope.lastDryDockDateRequiredError = false;
        	}else if(param === 'deliverydate'){
        		$scope.deliveryDateRequiredError = false;
        	}else if(param === 'nameofowner'){
        		$scope.nameOfOwnerRequiredError = false;
        	}else if(param === 'ownerimo'){
        		$scope.ownerIMORequiredError = false;
        	}else if(param === 'owneraddress'){
        		$scope.ownerAddressRequiredError = false;
        	}else if(param === 'owneremergencyname'){
        		$scope.ownerEmergencyNameRequiredError = false;
        	}else if(param === 'emergencycontactno'){
        		$scope.ownerEmergencyContactNumberRequiredError = false;
        	}else if(param === 'nameofregisteredowner'){
        		$scope.nameOfRegisteredOwnerRequiredError = false;
        	}else if(param === 'registeredownerimo'){
        		$scope.registeredOwnerIMORequiredError = false;
        	}else if(param === 'registeredownerimo'){
        		$scope.registeredOwnerAddressRequiredError = false;
        	}else if(param === 'registeredowneremergencyname'){
        		$scope.registeredOwnerEmergencyNameRequiredError = false;
        	}else if(param === 'registeredowneremergencycontactnumber'){
        		$scope.registeredOwnerEmergencyContactNumberRequiredError = false;
        	}else if(param === 'actualowner'){
        		$scope.nameOfActualOwnerRequiredError = false;
        	}else if(param === 'actualownerimo'){
        		$scope.actualOwnerIMORequiredError = false;
        	}else if(param === 'actualowneraddress'){
        		$scope.actualOwnerAddressRequiredError = false;
        	}else if(param === 'actualowneremergencyname'){
        		$scope.actualOwnerEmergencyNameRequiredError = false;
        	}else if(param === 'actualowneremergencycontactno'){
        		$scope.actualOwnerEmergencyContactNumberRequiredError = false;
        	}else if(param === 'lengthloa'){
        		$scope.lengthRequiredError = false;
        		$scope.lengthNaNError = false;
        	}else if(param === 'lbp'){
        		$scope.LBPRequiredError = false;
        	}else if(param === 'breadth'){
        		$scope.breadthRequiredError = false;
        	}else if(param === 'height'){
        		$scope.heightRequiredError = false;
        	}else if(param === 'depth'){
        		$scope.depthRequiredError = false;
        	}else if(param === 'draft'){
        		$scope.draftRequiredError = false;
        	}else if(param === 'deadweight'){
        		$scope.deadWeightRequiredError = false;
        	}else if(param === 'capacity'){
        		$scope.capacityValueRequiredError = false;
        	}else if(param === 'capacityselect'){
        		$scope.capacityUnitRequiredError = false;
        	}else if(param === 'internationalgt'){
        		$scope.internationalGTRequiredError = false;
        	}else if(param === 'internationalnt'){
        		$scope.internationalNTRequiredError = false;
        	}else if(param === 'registeredgt'){
        		$scope.registeredGTRequiredError = false;
        	}else if(param === 'registerednt'){
        		$scope.registeredNTRequiredError = false;
        	}else if(param === 'gtsuez'){
        		$scope.GTSuezRequiredError = false;
        	}else if(param === 'ntsuez'){
        		$scope.NTSuezRequiredError = false;
        	}else if(param === 'gtpan'){
        		$scope.GTPanRequiredError = false;
        	}else if(param === 'msums'){
        		$scope.UMSRequiredError = false;
        	}else if(param === 'lightship'){
        		$scope.lightShipRequiredError = false;
        	}else if(param === 'constant'){
        		$scope.constantRequiredError = false;
        	}else if(param === 'superintendent'){
        		$scope.superintendentRequiredError = false;
        	}else if(param === 'fleetgm'){
        		$scope.fleetGMRequiredError = false;
        	}else if(param === '2ndbackup'){
        		$scope.secondBackupRequiredError = false;
        	}else if(param === 'hseqmanager'){
        		$scope.HSEQManagerRequiredError = false;
        	}else if(param === 'marineoperationmanager'){
        		$scope.marineOperationManagerRequiredError = false;
        	}else if(param === 'accountant'){
        		$scope.accountantRequiredError = false;
        	}else if(param === 'crewincharge'){
        		$scope.crewInChargeRequiredError = false;
        	}else if(param === 'startdateofsuperintendent'){
        		$scope.startDateOfSuperintendentRequiredError = false;
        	}else if(param === 'fleetmanager'){
        		$scope.fleetManagerRequiredError = false;
        	}else if(param === 'firstbackup'){
        		$scope.firstBackupRequiredError = false;
        	}else if(param === 'hseqsuperintendant'){
        		$scope.HSEQSuperintendantRequiredError = false;
        	}else if(param === 'marineoperationsi'){
        		$scope.marineOperationSIRequiredError = false;
        	}else if(param === 'purchaseunit'){
        		$scope.purchaseUnitRequiredError = false;
        	}else if(param === 'purchaser'){
        		$scope.purchaserRequiredError = false;
        	}else if(param === 'invoicername'){
        		$scope.invoicerNameRequiredError = false;
        	}else if(param === 'mainengine'){
        		$scope.mainEngineMakeRequiredError = false;
        	}else if(param === 'mainenginetype'){
        		$scope.mainEngineTypeRequiredError = false;
        	}else if(param === 'noofcylinder'){
        		$scope.noOfCylinderRequiredError = false;
        	}else if(param === 'mcr'){
        		$scope.MCRPsRequiredError = false;
        	}else if(param === 'mcrkw'){
        		$scope.MCRKwRequiredError = false;
        	}else if(param === 'camelessornot'){
        		$scope.camelessOrNotRequiredError = false;
        	}else if(param === 'license'){
        		$scope.licenseRequiredError = false;
        	}else if(param === 'nsr'){
        		$scope.NSRPsRequiredError = false;
        	}else if(param === 'nsrkw'){
        		$scope.NSRKwRequiredError = false;
        	}else if(param === 'meturbocharger'){
        		$scope.turboChargerMakeRequiredError = false;
        	}else if(param === 'meturbochargertype'){
        		$scope.turboChargerTypeRequiredError = false;
        	}else if(param === 'mmsino'){
        		$scope.MMSInoRequiredError = false;
        	}else if(param === 'aatdhl'){
        		$scope.DHLDigitsRequiredError = false;
        	}else if(param === 'satcid'){
        		$scope.satCIDRequiredError = false;
        	}else if(param === 'iridiumphone'){
        		$scope.iridiumPhoneRequiredError = false;
        	}else if(param === 'satabemail'){
        		$scope.satABEmailRequiredError = false;
        	}else if(param === 'satabf'){
        		$scope.satABFTelexRequiredError = false;
        	}else if(param === 'satabfvoice'){
        		$scope.satABFVoiceRequiredError = false;
        	}else if(param === 'satabffax'){
        		$scope.satABFFaxRequiredError = false;
        	}else if(param === 'satabfdata'){
        		$scope.satABFDataRequiredError = false;
        	}else if(param === 'satabfhsd'){
        		$scope.satABFHSDRequiredError = false;
        	}
        }
        
        
        
        
        $scope.exportexcel1 = function(){
    		  $scope.isSaving = true;
         	var celphone="";
         	for(var i = 0;i<$scope.tags.length ; i++){
         		if(i == $scope.tags.length-1){
         			celphone += $scope.tags[i].text;
         		}else{
         			celphone += $scope.tags[i].text + ":";
         		} 
         	}     	
             if ($scope.validateVesselMasterForm() === false) {
            	 $scope.isSaving = true;
             	if($scope.startDateOfSuperintendent === undefined){
             		$scope.startDateOfSuperintendent1 = "";
             	}else{
             		$scope.startDateOfSuperintendent1 =  new Date($scope.startDateOfSuperintendent);
             	}
             	
                 var vesselMasterData = {
                     "vesselcode": $scope.vesselCode,
                     "vesselname": $scope.vesselName,
                     "vesselTypeCode": 'VT001',
                     "fleetcode": $scope.fleet,
                     "flagcode": $scope.flag,
                     "portcode": $scope.portOfRegistry,
                     "typeManagement": $scope.typeOfManagement,
                     "businessSection": $scope.ownerBusinessSection,
                     "shorecode": $scope.managementCompany,
                     "companyIMONo": $scope.companyIMONumber,
                     "formerCompany": $scope.formerManagementCompany,
                     "companyAccountCode": $scope.companyAccountCode,
                     "ownerAccountCode": $scope.ownerAccountCode,
                     "currency": $scope.baseCurrency.trim(),
                     "financialYearEnd": $scope.financialYearEnd,
                     "shipyard": $scope.shipYard,
                     "dateOfBuilt": new Date($scope.dateOfBuild),
                     "age": $scope.age,
                     "hullno": $scope.hullNo,
                     "imono": $scope.IMONo,
                     "officialno": $scope.officialNo,
                     "callsign": $scope.callSign,
                     "cbaca": $scope.CBA,
                     "columnClass": $scope.class,
                     "classno": $scope.classNo,
                     "activeStatus": ($scope.status === 'Active' ? 'A' : 'V'),
                     "insurancehullmachineries": $scope.insuranceHullAndMachineries,
                     "insurancepi": $scope.insurancePI,
                     "startdatemanagement": new Date($scope.startingManagementDate),
                     "lastdrydockdate": new Date($scope.lastDryDockDate),
                     "nextdrydockdate": new Date($scope.nextDryDockDate),
                     "deliverydate": new Date($scope.deliveryDate),
                     "nameofownerprincipal": $scope.nameOfOwner,
                     "ownerIMO": $scope.ownerIMO,
                     "ownerAddress": $scope.ownerAddress,
                     "ownerEmergencyName": $scope.ownerEmergencyName,
                     "ownerEmergencyContactNumber": $scope.ownerEmergencyContactNumber,
                     "actualprincipal": $scope.nameOfActualOwner,
                     "actualOwnerIMO": $scope.actualOwnerIMO,
                     "actualOwnerAddress": $scope.actualOwnerAddress,
                     "actualOwnerEmergencyName": $scope.actualOwnerEmergencyName,
                     "actualOwnerEmergencyContactNumber": $scope.actualOwnerEmergencyContactNumber,
                     "nameofregisteredowner": $scope.nameOfRegisteredOwner,
                     "registeredOwnerIMO": $scope.registeredOwnerIMO,
                     "registeredOwnerAddress": $scope.registeredOwnerAddress,
                     "registeredOwnerEmergencyName": $scope.registeredOwnerEmergencyName,
                     "registeredOwnerEmergencyContactNumber": $scope.registeredOwnerEmergencyContactNumber,
                     "lengthloa": $scope.length,
                     "depth": $scope.depth,
                     "lbp": $scope.LBP,
                     "draft": $scope.draft,
                     "breadth": $scope.breadth,
                     "deadweight": $scope.deadWeight,
                     "height": $scope.height,
                     "capacityunit": $scope.capacityUnit,
                     "capacity": $scope.capacityValue,
                     "internationalGrosston": $scope.internationalGT,
                     "ntSuez": $scope.NTSuez,
                     "internationalNetton": $scope.internationalNT,
                     "gtpan": $scope.GTPan,
                     "registeredGrosston": $scope.registeredGT,
                     "msums": $scope.UMS,
                     "registeredNetton": $scope.registeredNT,
                     "lightShip": $scope.lightShip,
                     "gtSuez": $scope.GTSuez,
                     "constant": $scope.constant,
                     "superintendent": $scope.superintendent,
                     "fleetmanager": $scope.fleetManager,
                     "fleetgm": $scope.fleetGM,
                     "firstBackupSI": $scope.firstBackup,
                     "secondBackupSI": $scope.secondBackup,
                     "hseqSuperintendant": $scope.HSEQSuperintendant,
                     "hseqManager": $scope.HSEQManager,
                     "marineOperationSI": $scope.marineOperationSI,
                     "marineOperationManager": $scope.marineOperationManager,
                     "purchaseunit": $scope.purchaseUnit,
                     "accountant": $scope.accountant,
                     "purchaser": $scope.purchaser,
                     "crewInCharge": $scope.crewInCharge,
                     "invoicername": $scope.invoicerName,
                     "startdatesuperintendent": $scope.startDateOfSuperintendent1,
                     "mainEngineMake": $scope.mainEngineMake,
                     "mainEngineType": $scope.mainEngineType,
                     "license": $scope.license,
                     "noOfCylinder": $scope.noOfCylinder,
                     "nsrPs": $scope.NSRPs,
                     "nsrKw": $scope.NSRKw,
                     "mcrPs": $scope.MCRPs,
                     "mcrKw": $scope.MCRKw,
                     "turboChargerMake": $scope.turboChargerMake,
                     "turboChargerType": $scope.turboChargerType,
                     "camlessornot": $scope.camelessOrNot,
                     "mmsino": $scope.MMSINo,    
                     "cellphone": $scope.cellPhone,
                     "aatdhldigits": $scope.DHLDigits,
                     "iridiumphone": $scope.iridiumPhone,
                     "satCID": $scope.satCID,
                     "satEmail": $scope.satABEmail,
                     "satTelex": $scope.satABFTelex,
                     "satVoice": $scope.satABFVoice,
                     "satFax": $scope.satABFFax,
                     "satData": $scope.satABFData,
                     "satHSD": $scope.satABFHSD,
                     "cruser": 'system',
                     "crdate": new Date(),
                     "upduser": 'system',
                     "upddate":  new Date()
                 }

                 
                 var exVesselNameData = $scope.vessels;
                 var exVesselManagementData = $scope.formerManagements;
                 var vesselAuxEngineData = $scope.vesselAuxEngineList;
                 var vesselAuxMachineData = $scope.vesselAuxMachineList;
                 var vesselNavigationData = $scope.vesselNavigationList;

                 var compositeJson = {
                     vesselmasterData: vesselMasterData,
                     exVesselMgnt: exVesselManagementData,
                     exVesselName: exVesselNameData,
                     vesselAuxEngine: vesselAuxEngineData,
                     vesselAuxMachine: vesselAuxMachineData,
                     vesselNavigation: vesselNavigationData,
                 }

                 console.log('HERE WE GOOOO to EXPORT -------------', compositeJson);
                 $scope.mandatoryFieldError = false;

                   Connectivity.IsOk().then(function(response){
    	            	 vesselMasterService.exportVesselMasterCompositeForm1(compositeJson).then(function(response) {
    	                     console.log(response , 'export response ????????? ')
//    	            		 if(response.data.status === 0){
    	            			 var myBlob = new Blob([response.data], {type: "application/vnd.ms-excel"});
    		         	         var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
    		         	         var anchor = document.createElement("a");
    		         	         anchor.download = $scope.vesselName+"-"+"ShipParticulars"+"-"+$scope.vesselCode;
    		         	         anchor.href = blobURL;
    		         	         anchor.click();
    		         	        console.log("Export Success",response);
//    	            		 }else{
//    	            			 $scope.dialog.open();
//    	            			 $scope.dataerror = response.data.successMessage;
//    	            		 }
    	            		 
    	            		 
    	                     
    	                });
    	    		}, function(error){
    					  $scope.dialog.open();
    					  $scope.dataerror = "Server not reached";
    	    		});
                   
             } else {
                 $scope.mandatoryFieldError = true;
                 $scope.dataSaved = false;

             }
             $scope.isSaving = true;
         }

        

    });

