app.service('safetyReportService', function($http) {
	
	/********NEAR MISS DATA*******/
	
	 this.deleteSafetyReportMainForm = function(formData){
			return $http({
			    method: 'POST',
			    url: "/delete-safety-report-master/",
			    data: formData
			});
		}
   
    
    this.getNearMissReports = function(curDate, safid,vesselcode, offset) {
        return $http({
            method: 'POST',
            url: "/get-near-miss-reports/?safid="+safid+"&vesselcode="+vesselcode+"&offset="+offset,
            data: curDate
        })
    }
    
    this.getNearMissShareReports = function(curDate, safid,vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-near-miss-share-reports/?safid="+safid+"&vesselcode="+vesselcode,
            data: curDate
        })
    }
    
    this.getDuplicateNearMissReports = function(safid, dupList) {
        return $http({
            method: 'POST',
            url: "/get-duplicate-nearmiss-accident-reports/?safid="+safid,
            data: dupList
        })
    }
    
    this.getDrillReportSectionData = function(curDate, safid, offset) {
        return $http({
            method: 'POST',
            url: "/get-drill-reports-section-data/?safid="+safid+"&offset="+offset,
            data: curDate
        })
    }
    
    this.getCrewHealthReportSectionData = function(curDate, safid) {
        return $http({
            method: 'POST',
            url: "/get-crew-health-section-data/?safid="+safid,
            data: curDate
        })
    }
	
    this.getNRMmdlName = function() {
        return $http({
            method: 'GET',
            url: "/get-nrm-mdl/",
        })
    }
    
    this.getShoreUsers = function() {
        return $http({
            method: 'GET',
            url: "/get-shore-users/",
        })
    }
    
    this.getARTmdlName = function() {
        return $http({
            method: 'GET',
            url: "/get-art-mdl/",
        })
    }
	
	/***********************************/
	
    this.getCrewEmployees = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-crew-employees/",
            data: vesselcode
        })
    }
    this.getEmailForToandCC = function(vesselcode){
		return $http({
		    method: 'POST',
		    url: "/accident_report_email_id/",
		    data: vesselcode
		});
	} 
//    this.getDrillReports = function() {
//        return $http({
//            method: 'GET',
//            url: "/get-drill-report/",
//        })
//    }
//    
    this.getCrewHealths = function() {
        return $http({
            method: 'GET',
            url: "/get-crew-healths/",
        })
    }
    
    this.getCrewRanks = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-crew-ranks/",
            data: vesselcode
        })
    }
    
    this.getFormStatusCode = function(status) {
        return $http({
            method: 'POST',
            url: "/get-form-status-code/",
            data: status
        })
    }
    
    this.getPortname = function(portcode) {
        return $http({
            method: 'POST',
            url: "/get-port-name-based-on-code/",
            data: portcode
        })
    }
        
    this.getOutstandingData = function() {
        return $http({
            method: 'GET',
            url: "/get-outstanding-data/",
        })
    }
    
    this.getSafetyTopics = function() {
        return $http({
            method: 'GET',
            url: "/get-safety-topics/",
        })
    }
    
    this.getSafetyNo = function(safetyFormInitialComposite, vesselCode) {
        return $http({
            method: 'POST',
            url: "/get-safety-no/?vesselCode="+vesselCode,
            data: safetyFormInitialComposite
        })
    }
    
    this.getSessionData = function() {
        return $http({
            method: 'GET',
            url: "/get-session-data/"
        })
    }
   
    this.getFormNo = function() {
        return $http({
            method: 'GET',
            url: "/get-form-no/",
        })
    }
    
    this.getVesselName = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-name/",
        })
    }
    
    this.getEmployee= function(rankcode, vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-employee/?rankcode="+rankcode,
            data: vesselcode
        })
    }
    
    this.getVesselMasterPortNames = function(portcode) {
        return $http({
            method: 'POST',
            url: "/get-vessel-master-portnames/",
            data : portcode,
        })
    }
    
    this.saveSafetyReportCompositeForm= function(formData) {
        return $http({
            method: 'POST',
            url: "/safety-report-composite-submission/",
            data: formData
        });
    }
    this.getSafetyAttendees = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-attendees-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyCrewHealthAttch = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-crew-health-attch-by-safid/",
            data: safid
        })
    }
    
//    this.getDrillReportsAttch = function(safid) {
//        return $http({
//            method: 'POST',
//            url: "/get-drill-attch-by-safid/",
//            data: safid
//        })
//    }
    
    this.getSafetyNonAttendees = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-nonattendees-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyTopicsData = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-topics-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyInformations = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-infos-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyCommitteeSigns = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-committee-signs-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyCompFindings = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-comp-findings-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyAuditFindings = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-audit-findings-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyRegulations = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-regulations-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyConcerns = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-concerns-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyHealthMeasures = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-health-measures-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyComplaintReviews = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-complaint-reviews-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyRiskReviews = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-risk-reviews-by-safid/",
            data: safid
        })
    }
    
    this.getSafetyInjuryDetails = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-injury-details-by-safid/",
            data: safid
        })
    }
    
//    this.getSafetyDrillRecords = function(safid) {
//        return $http({
//            method: 'POST',
//            url: "/get-safety-drill-records-by-safid/",
//            data: safid
//        })
//    }
    
    this.getSafetyTrainings = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-trainings-by-safid/",
            data: safid
        })
    }    

    this.getSafetyReportData = function(safid) {
        return $http({
            method: 'POST',
            url: "/get-safety-report-saved-data/",
            data: safid
        })
    }
    
    this.getSafetyReportAllForms = function() {
        return $http({
        	method: 'GET',
            url: "/get-safety-report-all-forms/"
        })
    }
    
	this.getSafetyReportAction = function(safid){
		return $http({
		    method: 'POST',
		    url: "/action-safety-report/",
		    data:  safid,
		});
	}
    
	
	 this.generateSafetyReportPdf = function(formData){
			return	$http({
				method: 'POST',
	  	        url: "/Saftey-Export-PDF/",
	   	        responseType: 'arraybuffer',
	   	        data: formData,
			});
	}
    
	 this.generateSafetyReportExcel = function(formData){
			return	$http({
				method: 'POST',
	  	        url: "/Safety_Report_Export_excel/",
	   	        responseType: 'arraybuffer',
	   	        data: formData,
			});
	}
    
});
