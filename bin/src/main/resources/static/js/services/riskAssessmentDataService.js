//riskCategoryDropDownService.js
// dataservice provider to load and categoryDropDown
angular.module('serviceModule',[]) 
.service( "riskAssessmentDataService", function(){

	// get riskCategoryDropDownItems 
	this.getCategoryList = function($http,callback){

		$http.get("/getActiveCategoryList").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
		};
	  
	// get riskCategoryDropDownItems 
	this.getLocationList = function($http,callback){
		$http.get("/getActiveLocations").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
		
	};
	
	// get riskPersonDropDownItems 
	this.getPersonList = function ($http,callback){
		$http.get("/getActiveRanks").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	};
	
	this.getPermitToWorkList = function ($http,callback){
		$http.get("/getActivePermitMasterList").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	};
	
	
	this.getActiveFormNumber = function ($http,callback){
		$http.get("/getActiveFormList").
		 then(
			function (data, status, headers, config) {
			 callback(data.data.data);
			 
			},
			function(data, status, headers, config){
				alert("An error occurred during the AJAX request");
			 }
      );

	};
	
	
	this.getRiskAssessmentAction = function($http,rskId,callback){
		$http.get("/getRiskAssementAction?rskId="+rskId).
		then(
				function (data, status, headers, config) {
				 callback(data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	
	}
	
	this.getActiveHazardList = function ($http,callback){
		$http.get("/getActiveHazardList").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	};
	
	this.getActiveHazardEffectList= function ($http,callback){
		$http.get("/getActiveHazardEffectList").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	};
	
	
	
	/*****************************************************/
	
	this.getUpdatedModuleIndex = function ($http,callback){
		$http.get("/getUpdatedModuleIndex").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	};
	
	
	this.getCurrentModuleIndex = function ($http,callback){
		$http.get("/getCurrentModuleIndex").
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	};
	
	this.isFormSaved = function($http,formNumber,callback) {
		$http.get("/isFormSaved?formNumber="+formNumber).
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
	
	};

	this.getSavedWfHistory = function($http,rskId,userName,callback){

		$http.get("/getSavedWfHistory?rskId="+rskId+"&userName="+userName).
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
		
	};
	
	this.getSavedRskMaster = function($http,rskId,userId,callback){

		$http.get("/getSavedRskMaster?rskId="+rskId+"&userId="+userId).
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
		
	};
	
	this.getSavedInitalRskList = function($http,rskId,callback){

		$http.get("/getSavedInitalRskList?rskId="+rskId).
		then(
				function (data, status, headers, config) {
				 callback(data.data.data);
				 
				},
				function(data, status, headers, config){
					alert("An error occurred during the AJAX request");
				 }
	      );
		
	};
	

	
});