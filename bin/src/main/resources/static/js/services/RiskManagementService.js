app.service('riskManagementService', function($http) {

	this.getActiveFormNumber = function (){
        return $http({
            method: 'GET',
            url: "/getActiveFormList/",
        })

	};
	
	 this.deleteRiskAssessmentMainForm = function(formData){
			return $http({
			    method: 'POST',
			    url: "/delete-risk-assessment-master/",
			    data: formData
			});
		}
		
	// SAVING DATA HERE
	
    this.saveRiskContentItem = function(formData) {
        return $http({
            method: 'POST',
            url: "/saveRiskassessmentCompositeFormData/",
            data: formData
        })
    }

    // FETCHING DATA HERE
    
	this.getApprovalDetails = function(rskId) {
        return $http({
            method: 'POST',
            url: "/get-reviewer-details/",
            data: rskId
        })
	};
    
	this.getRskApprovalDetails = function(rskId) {
        return $http({
            method: 'POST',
            url: "/get-rsk-approval-details/",
            data: rskId
        })
	};
	
	// For template required
	this.getSavedRskMaster = function(rskId) {
        return $http({
            method: 'GET',
            url: "/getSavedRskMaster?rskId="+rskId,
        })
	};

});