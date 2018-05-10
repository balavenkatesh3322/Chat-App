app.service('crewMappingService', function($http){
	
	this.getVesselNameList = function(){
		 return $http({
	            method: 'GET',
	            url: "/get-crew-vessel-name-list/",
	        })
	}
	
	this.getRankNameList = function(){
		 return $http({
	            method: 'GET',
	            url: "/get-crew-rank-name-list/",
	        })
	}
	
	this.btnShowActionPerformed = function(vesselcode){
		return $http({
            method: 'POST',
            url: "/get-crew-master-count-list/",
            data : vesselcode
        })
	}
	
	this.btnShowActionPerformedNewVessel = function(vesselcode){
		return $http({
            method: 'POST',
            url: "/get-crew-master-count-list-new-vessel/",
            data : vesselcode
        })
	}
	
	this.btnUserCodeActionPerformed = function(vesselcode){
		console.log(vesselcode , 'vesselcode in service >>>>>>>>>>>>>> ')
		return $http({
			method : 'GET',
			url : '/get-user-code-for-crew-master/?vesselcode='+vesselcode,
		});
	}
	
	this.btnFetchFromUserDetail = function(usercode){
		return $http({
			method : 'POST',
			url : '/get-all-values-for-user-code/',
			data : usercode,
		});
	}
	
	this.saveCrewMaster = function(crewMaster){
		return $http({
			method : 'POST',
			url : '/crew-master-save-for-the-vessel/',
			data : crewMaster,
		});
	}
	
	this.updateCrewMaster = function(crewMaster){
		return $http({
			method : 'POST',
			url : '/crew-master-update-for-the-vessel/',
			data : crewMaster,
		});
	}
	
	this.removeCrewMaster = function(crewMaster){
		return $http({
			method : 'POST',
			url : '/crew-master-remove-for-the-vessel/',
			data : crewMaster,
		});
	}
	
	this.getCrewMasterPortNames = function(portcode){
		console.log(portcode , 'portcode service >>>>>>>>>>>>>>>>>. ')
		return $http({
			method : 'POST',
			url : '/get-port-code-for-crew-master/',
			data : portcode,
		});
	}
	
	this.btnViewActionPerformed = function(usercode){
		return $http({
            method: 'POST',
            url: "/get-crew-master-view-list/",
            data : usercode,
        })
	}
	
	

	 this.generateCrewListReportExcel = function(formData){
			return	$http({
				method: 'POST',
	  	        url: "/Export-excel-CrewList/",
	   	        responseType: 'arraybuffer',
	   	        data: formData,
			});
	}
});