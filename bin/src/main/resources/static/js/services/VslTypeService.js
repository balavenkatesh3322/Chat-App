app.service('VslTypeService', function($http){
	
	var validform = false;
	
	var vesseltypes ={};
	
	this.loadmodule = function(){
		return vesseltypes;
	}
	
	
	this.loadFromVesselType = function(){
		
		return $http({
			 	method: 'GET',
		        url: "/load-From-Vessel-Type/"
		});
	}
	
	this.saveVesselTypeToDB = function(code,name,resultfn){
		this.validateVesselType(code,name,resultfn);
		if(this.validform = true){
		
		form_data = {
			"vsltypecode" : code,
			"vsltypename" : name,
			"activestatus" : "A",
		};
		$http({
			url: "/save-From-Vessel-Type/",
		    dataType: 'json',
		    method: 'POST',
		    data: form_data,
		    headers: {
		        "Content-Type": "application/json"
		    }
		}).then(function successCallback(response){
			console.log("Saved in DB "+response)
		});
		
		}
		
	}
	
	this.validateVesselType = function(code,name,resultfn){
		if(code == ''){
			this.validform = false;
			resultfn("invalidcode");
		}else{
			this.validform = true;
			resultfn("");
		}
		if(code == ''){
			this.validform = false;
			resultfn("invalidname");
		}else{
			this.validform = true;
			resultfn("");
		}
	}
	
	
	
	
});