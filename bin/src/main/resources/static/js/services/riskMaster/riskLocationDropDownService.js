//riskLocationDropDownService.js
// dataservice provider to load and locationDropDown
angular.module('serviceModule') 
.service( "riskLocationDropDownService", function(){

	// get riskCategoryDropDownItems 
	this.getRiskLocationDropDownItems = function($http,callback){

		/*return [
                              {code:"",name:""},
		                      {code:"A",name:"Bridge"},
		                      {code:"B",name:"CCR/ ECR/ Ship's Office"},
		                      {code:"C",name:"Engine room"},
		                      {code:"D",name:"Galley / Pantry / Chamber"},
		                      {code:"E",name:"in House accommodation"},
		                      {code:"F",name:"Steering Compartment"},
		                      {code:"G",name:"On deck/Weather decks/ poop deck"},
		                      {code:"H",name:"Pump Room"},
		                      {code:"I",name:"Cargo Compressor Room"},
		                      {code:"J",name:"Cargo machine room"},
		                      {code:"K",name:"Cargo Hold"},
		                      {code:"L",name:"Coffer dams/ Void spaces"},
		                      {code:"M",name:"Scavenge space"},
		                      {code:"N",name:"Ballast Tank"},
		                      {code:"O",name:"Bunker Tanks"},
		                      {code:"P",name:"Cargo Tanks"},
		                      {code:"Q",name:"Fresh Water Tank"},
		                      {code:"R",name:"Other hull/ enclosed space"},
		                      {code:"S",name:"High place/ mast/ crane etc."},
		                      {code:"T",name:"Aloft/ ship side"},
		                      {code:"U",name:"Other"}
                               ];*/
		$http.get("/getActiveLocations").
		 success(function (data, status, headers, config) {
             //return data.data;
			 callback(data.data);
         }).
         error(function (data, status, headers, config) {
             //alert("An error occurred during the AJAX request");
         });
		
	};
	  
});