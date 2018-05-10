//riskCategoryDropDownService.js
// dataservice provider to load and categoryDropDown
angular.module('serviceModule',[]) 
.service( "riskCategoryDropDownService", function(){

	// get riskCategoryDropDownItems 
	this.getRiskCategoryDropDownItems = function(callback){
		if(callback){
			var data = {}
			data.data = [
			                    {code:"",name:""},
			                    {code:"A",name:"Engine Room and Machinery Activities"},
			                    {code:"B",name:"Deck Maintenance"},
			                    {code:"C",name:"Bridge and Navigation"},
			                    {code:"D",name:"Containers- Cargo and Ballast Operations"},
			                    {code:"E",name:"Oil Tankers – Cargo and Ballast Operations"},
			                    {code:"F",name:"Chemical Tankers - Cargo and Ballast Operations"},
			                    {code:"G",name:"Mooring Operations"},
			                    {code:"H",name:"Galley and Cooking Operations"},
			                    {code:"I",name:"Non-routine tasks"},
			                    {code:"J",name:"Takeover of Vessel into Management"},
			                    {code:"K",name:"Office Tasks"},
			                    {code:"L",name:"Management of Occupational Safety and Health"},
			                    {code:"M",name:"Critical Equipment"},
			                    {code:"N",name:"Management of change"}
			                     ];
			callback(data.data);
			
		}
		
	};
	  
	/*// get riskHodDropDownItems 
	this.getRiskHodList = function ($http,callback){
		return [
            {code:"",name:""},
            {code:"A",name:"MASTER"},
            {code:"B",name:"COFF"},
            {code:"C",name:"ADD. CH OFF"},
            {code:"D",name:"2 OFF"},
            {code:"E",name:"3OFF"},
            {code:"F",name:"4 OFF"},
            {code:"G",name:"C/E"}
             ];

		$http.get("/getActiveRanks").
		 success(function (data, status, headers, config) {
            //return data.data;
			 callback(data.data);
        }).
        error(function (data, status, headers, config) {
            //alert("An error occurred during the AJAX request");
        });

	};*/
});