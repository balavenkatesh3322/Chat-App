app.service("workFlowHistoryService", function($http){
	
	this.btnModuleCodeActionPerformed = function(){
		return $http({
			method : 'GET',
			url : '/get-module-code-for-work-flow-history/',
		});
	}
	
	this.getWorkFlowHistoryDetails = function(mdlcode){
		return $http({
			method : 'GET',
			url : '/get-work-flow-history-details/?mdlcode='+mdlcode,
		});
	}
	
	this.getWorkFlowActionDetails = function(mdlcode){
		return $http({
			method : 'GET',
			url : '/get-work-flow-action-details/?mdlcode='+mdlcode,
		});
	}
	
	
});