app.directive('kendoCustomDialog', function($http, toaster){
	return {
	    scope: {title:'@',  name:'@', customOptions:'=', errorType:'@', errorMessage:'=', detailErrorMessage:'@', errorDetails:'=', showexception:'=', errorCode:'@', errorStatus:'@'},
	    template:'<div kendo-dialog="{{name}}" k-title="\'{{title}}\'" k-actions="customOptions" k-on-open="dialogVisible = true" k-on-close="dialogVisible = false" k-width="300" k-height="149" k-modal="true">'+
           		 '<img src="{{errorImage}}">'+            		 
           		 '<p style="background-color: rgba(33, 150, 243, 0.25" ng-model="myCol" ng-repeat="error in errorMessage">{{myCol+error}}</p>'+           		 
                 '<div class="error_accordion" ng-if="detailErrorMessagesShow && errorCode==\'EX\'">{{detailErrorMessage}}</div>'+
				 '<button class="btn btn-info btn-sm btn-error" ng-click="showexceptionmessage()" ng-if="showexception==true && showbutton==true && errorCode==\'EX\'">Show Error</button> <span style="width: 10px"></span>'+
				 '<button class="btn btn-info btn-sm  btn-error" ng-click="hideexceptionmessage()" ng-if="showexception==true && hidebutton==true && errorCode==\'EX\'">Hide</button> <span style="width: 10px"></span>'+
				 '<button ng-if="errorCode==\'EX\'" class="btn btn-success btn-sm  btn-error" ng-click="sendmail()">Report</button>'+
				 '</div>',
	    replace:true,
	    restrict: 'E',
		link: function(scope, element, attrs) {
	      scope.images = {"warning": "img/warning.svg", "error": "img/error_information.svg", "missed": "img/missed_something.svg"}
	      scope.errorImage = scope.images[scope.errorType];
	      scope.detailErrorMessagesShow = false;
	      scope.showbutton = true;
	      scope.hidebutton = false;
	      scope.showexceptionmessage = function(){
	    	  scope.showbutton=false;
	          scope.hidebutton=true;
	          scope.detailErrorMessagesShow=true;
	      }
	      scope.$watch('errorStatus', function(){
	    	  if (scope.errorStatus!='0'){
	    		  scope[scope.name].open()
	    	  }else{
	    		  scope[scope.name].close()
	    	  }
	      })
	      scope.hideexceptionmessage=function(){
	      	  scope.showbutton=true;
	          scope.hidebutton=false;
	          scope.detailErrorMessagesShow=false;
	      }
	      scope.sendmail=function() { 
	     		$http({
	     			url: "/email-exception-details/",
	 			    dataType: 'json',
	 			    method: 'POST',
	 			    data:scope.errorDetails,
	 			    headers: {
	 			    	"Content-Type": "application/json"
	 			    }
	     		}).then(
	    		         function(response) {	    
	    		        	 if (response.data.status==0){
								 toaster.success({title: "Information", body:response.data.successMessage});
								 scope[scope.name].close()
	    		        	 }else{
								 scope.errorMessage = response.data.message;
								 scope.detailErrorMessage = response.data.exceptionDetail;
								 scope.errorCode = "SV";
	    		        	 }
	    		       });

	      }
	  }
	};
	});