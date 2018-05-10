app.service('externalInspectionService', function($http){
	this.getSessionData = function(){
		return $http({
			method: 'GET',
			url: "/get-session-data/"
		});
	}
	this.getExternalInspectionFormNumber = function(){
		return $http({
		    method: 'GET',
		    url: "/external-inspection-form-no/",
		});
	}
	this.getExternalInspectionNumber = function(){
		return $http({
		    method: 'GET',
		    url: "/external-inspection-no/",
		});
	}
	this.getExternalInspectionAction = function(extinsid){
		return $http({
		    method: 'POST',
		    url: "/action-external-inspection/",
		    data:  extinsid,
		});
	}
	this.getInspectionType = function(){
		return $http({
		    method: 'GET',
		    url: "/external-inspection-active-externalinspection/",
		});
	}
	this.getInspectionAuthority = function(inspectionType){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-authority/?inspectionType="+inspectionType,
		});
	}
	this.getCountry = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-countries/",
		});
	}
	this.getPlaceOfInspection = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-countries/",
		});
	}
	this.getCountryPorts = function(countryCode){
		return $http({
			method: 'POST',
		    url: "/external-inspection-active-ports/",
		    data: {"countryCode": countryCode}
		});
	}
	this.getCountryTerminals = function(countryCode){
		return $http({
			method: 'POST',
		    url: "/external-inspection-active-terminals/",
		    data: {"countryCode": countryCode}
		});
	}
	this.getExternalInspectionFormDataByNo = function(extinsid){
		return $http({
			method: 'POST',
			url: "/get-external-inspection-form-data-by-no/",
		    data: {"extinsid": extinsid}
		});
	}
	this.getNatureOfFindings = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-naturedeficient/",
		});
	}
	this.getInspectionActionCode = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-actionMasters/",
		});
	}
	this.getRootCause = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-casualFactors/",
		});
	}
	this.getMainCategory = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-active-categories/",
		});
	}
	this.getSubCategory = function(parentCategory){
		return $http({
			method: 'POST',
		    url: "/external-inspection-active-subCategories/",
		    data: {"parentCategoryId": parentCategory}
		});
	}
	this.saveExternalInspectionForm = function(reportList, deleteList){
		console.log(reportList, deleteList);
		return $http({
			method: 'POST',
		    url: "/save-external-inspection-details/",
		    data: {"formData": reportList, "toBeDeleted": deleteList}
		});
	}
	this.saveExternalInspectionReport = function(formData){
		return $http({
			method: 'POST',
		    url: "/save-external-inspection/",
		    data: formData
		});
	}
	this.updateDetention = function(formData){
		return $http({
			method: 'POST',
		    url: "/update-detention-rejection/",
		    data: formData
		});
	}
	this.getExternalInspectionReport = function(extInsId){
		return $http({
			method: 'POST',
		    url: "/get-external-inspection-by-no/",
		    data: {"extInsId": extInsId}
		});
	}
	this.getExternalInspectionReportDetails = function(extInsId){
		return $http({
			method: 'POST',
		    url: "/get-external-inspection-input-field-by-no/",
		    data: {"extInsId": extInsId}
		});
	}
	this.getAuditorName = function(){
		return $http({
			method: 'GET',
		    url: "/external-inspection-auditor-names/",
		});
	}
	this.saveAuditorName = function(extinsid, auditorNames){
		form_data = {"extinsid": [extinsid], "names": auditorNames}
		return $http({
			method: 'POST',
		    url: "/save-external-inspection-auditor-names/",
		    data: form_data
		});
	}
	this.getAuditorNameById = function(extinsid){
		console.log(extinsid, 1111);
		return $http({
			method: 'POST',
		    url: "/get-auditor-name/",
		    data: {"extinsid": extinsid}
		});
	}
	this.uploadDocuments = function(filesformdata){
		console.log(filesformdata,"filesformdata")
	   	return $http.post("/external-inspection/uploadDocuments/", 
	   			filesformdata, 
	   			{
	        transformRequest: angular.identity,
	        headers: {'Content-Type': undefined}
	    })
	}
	this.uploadDetailDocuments = function(filesformdata){
		console.log(filesformdata,"filesformdata")
	   	return $http.post("/external-inspection/uploadDetailDocuments/", 
	   			filesformdata, 
	   			{
	        transformRequest: angular.identity,
	        headers: {'Content-Type': undefined}
	    })
	}
	this.fetchDocuments = function(extInsId){
		 return $http({
	            method: 'POST',
	            url: "/external-inspection/fetchDocuments/",
	            data: {"formNumber": extInsId}
	        });		
	}
	
	this.removeDocument = function(docId){
		console.log("inside service removedocument - " + docId)
		return $http({
		    url: "/external-inspection/removeDocument/?docId="+docId,
		    dataType: 'json',
		    method: 'GET',
		    headers: {
		        "Content-Type": "application/json"
		    }
		});	
	}
	
	this.uploadImages = function(filesformdata){
	   	return $http.post("/external-inspection-details/uploadImages/", 
	   			filesformdata, 
	   			{
	        transformRequest: angular.identity,
	        headers: {'Content-Type': undefined}
	    })
	}
	
	this.fetchImages = function(extInsId){
		 return $http({
	            method: 'POST',
	            url: "/external-inspection-details/fetchImages/",
	            data: {"formNumber": extInsId}
	        });		
	}
	
	this.removeImages = function(docId){
		console.log("inside service removedocument - " + docId)
		return $http({
		    url: "/external-inspection-details/removeImages/?docId="+docId,
		    dataType: 'json',
		    method: 'GET',
		    headers: {
		        "Content-Type": "application/json"
		    }
		});	
	}
	this.saveExternalInspectionCompositeForm = function(compositeData){
		console.log(compositeData,'composite data >>>>>>>>>>>>>');
		return $http({
			method: 'POST',
		    url: "/external-inspection-form-composite-submission/",
		    data: compositeData
		});
	}
	this.getVIQNumbers = function(searchData){
		return $http({
		    url: "/external-inspection-viq-number/?search="+searchData,
		    dataType: 'json',
		    method: 'GET',
		    headers: {
		        "Content-Type": "application/json"
		    }
		});	
	}
	this.fetchVIQNumberByCode = function(viqCode){
		return $http({
		    url: "/external-inspection-viq-number-by-code/?viqcode="+viqCode,
		    dataType: 'json',
		    method: 'GET',
		    headers: {
		        "Content-Type": "application/json"
		    }
		});	
	}
	this.fetchAllVIQNumber = function(){
		return $http({
		    url: "/external-inspection-all-viq-number/",
		    dataType: 'json',
		    method: 'GET',
		    headers: {
		        "Content-Type": "application/json"
		    }
		});	
	}
	this.updateDetailData = function(formdata){
		return $http({
            method: 'POST',
		    url: "/external-inspection-update-detail-data/",
            data: formdata
        });		
	}
	this.deleteExtReportMainForm = function(formData){
		return $http({
		    method: 'POST',
		    url: "/delete_extinspection_report_master/",
		    data: formData
		});
	}
});