/**
 * riskContentItemService.js
 */
angular.module('serviceModule') 
.service( "riskContentItemService", function(){

    // save riskContentItem to db
	this.saveRiskContentItem = function ($http,$rootScope,url,callback){
		var formData = JSON.stringify($rootScope.riskContentItem);
		
		var data = formData;
		$http.post(url, data, config)
		    .then(
		    		function(){
		    			callback(data);
		    		},
		    		function(){
		    			alert( "Exception details: " + JSON.stringify({data: data}));
		    		}
		    );
	};
	
	this.saveRskinitialrisk= function ($http,$rootScope,callback){
		var formData = JSON.stringify(JSON.decycle($rootScope.rskinitialriskItemList));
		var data = formData;
			    /*var req = {
			        method: 'POST',
			        url: '/v1/rskinitialrisk',
			        data: formData,
			        dataType: "json"
			    }
			    $http(req)
			        .success(function(data, status, headers, config){
			        	alert('blaaaaaaaa');
			        	callback(data);
			        })
			        .error(function(data, status, headers, config){
			            alert( "Exception details: " + JSON.stringify({data: data}));
			        });*/
		$http.post(url, data, config)
	    .then(
	    		function(){
	    			callback(data);
	    		},
	    		function(){
	    
	    			alert( "Exception details: " + JSON.stringify({data: data}));
	    		}
	    );
		};
		
		this.saveRskWorkFlowHistory= function ($http,$rootScope,url,callback){
			var formData = JSON.stringify($rootScope.riskContentItem.rskwfHistory);
			var data = formData;
			$http.post(url, data, config)
		    .then(
		    		function(){
		    			callback(data);
		    		},
		    		function(){
		    			alert( "Exception details: " + JSON.stringify({data: data}));
		    		}
		    );
		   /* var req = {
		        method: 'POST',
		        url: url,
		        data: formData
		    }
		    $http(req)
		        .success(function(data, status, headers, config){
		        
		        	callback(data);
		        })
		        .error(function(data, status, headers, config){
		            alert( "Exception details: " + JSON.stringify({data: data}));
		        });*/
		    
		    this.saveControlMeasures = function ($http,$rootScope,url,callback){
		    		var formData = JSON.stringify($rootScope.controlMeasures);
		    		var data = formData;
					$http.post(url, data, config)
				    .then(
				    		function(){
				    			callback(data);
				    		},
				    		function(){
				    			alert( "Exception details: " + JSON.stringify({data: data}));
				    		}
				    );
		    		/*    var req = {
		    		        method: 'POST',
		    		        url: url,
		    		        data: formData
		    		    }
		    		    $http(req)
		    		        .success(function(data, status, headers, config){
		    		        	callback(data);
		    		        })
		    		        .error(function(data, status, headers, config){
		    		            alert( "Exception details: " + JSON.stringify({data: data}));
		    		        });*/
		    		
		    	};
	};
});