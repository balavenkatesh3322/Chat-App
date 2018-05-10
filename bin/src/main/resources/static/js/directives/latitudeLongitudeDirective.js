/******************** LATITUDE COMPONENT HERE ***********************/

app.directive('latitude', function () {
      return {
          restrict: 'E',
          template: "<div style='display: inline-flex'>"+
          "<input style='width:25%' ng-disabled='componentDisabled' style='margin-right: .2em' class='form-control' type='number' ng-model='degree' min='0' max='89' ng-keyup='isDegree($event.key)' ng-change='isDegree()'><b>&deg</b>"+
          "<input style='width:25%' ng-disabled='componentDisabled' style='margin: 0em .2em' class='form-control' type='number' min='0' max='60' ng-model='minutes' ng-keyup='isMinutes($event.key)' ng-change='isMinutes()'><b>'</b>"+
          "<input style='width:25%' ng-disabled='componentDisabled' style='margin: 0em .2em' class='form-control' type='number' min='0' max='60' step='0.1' ng-model='seconds' ng-keyup='isSeconds($event.key)' ng-change='isSeconds()'><b>''</b>"+
          "<select style='width:25%' ng-disabled='componentDisabled' style='margin: 0em .2em' class='form-control' ng-model='direction'><option selected value></option><option value='N'>N</option><option value='S'>S</option></select>"+
          "</div>",
        	scope: { data:'=', validation:'=', componentDisabled: '='},
          link: function(scope, element, attrs, modelCtrl) {
        	  
          	var setValue = function(){

	          	if (scope.data!="" && scope.data!=undefined && scope.data!=null) {
	          		  var tempData = scope.data.split('/');
		              scope.degree = (tempData[0] != "" ? parseInt(tempData[0]) : "");
		              scope.minutes = (tempData[1] != ""? parseInt(tempData[1]) : "");
		              scope.seconds = (tempData[2] != "" ? parseFloat(tempData[2]): "");
		              scope.direction = (tempData[3] != "" ? tempData[3]: "");
		              checkValidation();
	          	} else {
	              scope.degree = "";
	              scope.minutes = "";
	              scope.seconds = "";
	              scope.direction = "";
	          	  checkValidation();
	          	}
            }
          	
            function checkValidation() {	
                if (scope.degree=="" || scope.degree==undefined || scope.degree==null ||
                  		 scope.minutes=="" || scope.minutes==undefined || scope.minutes==null ||
                  		 scope.seconds=="" || scope.seconds==undefined || scope.seconds==null ||
                  		 scope.direction=="" || scope.direction==undefined || scope.direction==null) {
                  	 scope.validation = false;
                   } else {
                  	 scope.validation = true;
                   }
                
            }
            
            var updateData = function() {
              checkValidation()
              scope.data = scope.degree+"/"+scope.minutes+"/"+scope.seconds+"/"+scope.direction;
            }
            scope.$watch('data', function(){
            	setValue();
            });
            scope.$watch('direction', function(){
            	updateData();
            });
          	scope.minuteInitValue = 0;
            scope.degreeInitValue = 0;
            scope.secondInitValue = 0;
            scope.isMinutes = function(charCode){
              if((charCode != 'Backspace') && (charCode !='Delete')){
                  if (scope.minutes==null){
                      scope.minutes = scope.minuteInitValue;
                    }
                    if (!(scope.minutes>=0 && scope.minutes<=60)) {
                      scope.minutes = Math.floor(scope.minutes/10);
                   }
                   scope.minuteInitValue = scope.minutes;
                   updateData();
                   return true;
              }else{
            	if (scope.minutes>=0 && scope.minutes<=9){
            		scope.minutes = ""
            	}
              	scope.minuteInitValue = scope.minutes;
                updateData();
              }
            }
            scope.isDegree = function(charCode){
              if((charCode != 'Backspace') && (charCode !='Delete')){
                  if (scope.degree==null){
                      scope.degree = scope.degreeInitValue;
                    }
                    if (!(scope.degree>=0 && scope.degree<=89)) {
                      scope.degree = Math.floor(scope.degree/10);
                   }
                   scope.degreeInitValue = scope.degree;
                   updateData();
                   return true;
              }else{
            	  if (scope.degree>=0 && scope.degree<=9){
              		scope.degree = ""
              	}
              	scope.degreeInitValue = scope.degree;
              	updateData();
              }
            }
            scope.isSeconds = function(charCode){
              if((charCode != 'Backspace') && (charCode !='Delete')){
                  if (scope.seconds==null){
                      scope.seconds = scope.secondInitValue;
                    }
                    if (!(scope.seconds>=0 && scope.seconds<=89)) {
                      scope.seconds = Math.floor(scope.seconds/10);
                   }
                   scope.secondInitValue = scope.seconds;
                   scope.seconds = Math.round(scope.seconds * 10) / 10;
                   updateData();
                   return true;
              }else{
            	  if (scope.seconds>=0 && scope.seconds<=9){
                		scope.seconds = ""
                	}
              	scope.secondInitValue = scope.seconds;
              	updateData();
              }
            }
          }
      };
  });

/******************** LONGITUDE COMPONENT HERE ***********************/

app.directive('longitude', function () {
    return {
        restrict: 'E',
        template: "<div style='display: inline-flex'>"+
      "<input style='width:25%' ng-disabled='componentDisabled' style='margin-right: .2em' class='form-control' type='number' ng-model='degree' min='0' max='179' ng-keyup='isDegree($event.key)' ng-change='isDegree()'><b>&deg;</b>"+
        "<input style='width:25%' ng-disabled='componentDisabled' style='margin: 0em .2em' class='form-control' type='number' min='0' max='60' ng-model='minutes' ng-keyup='isMinutes($event.key)' ng-change='isMinutes()'><b>'</b>"+
        "<input style='width:25%' ng-disabled='componentDisabled' style='margin: 0em .2em' class='form-control' type='number' min='0' max='60' step='0.1' ng-model='seconds' ng-keyup='isSeconds($event.key)' ng-change='isSeconds()'><b>''</b>"+
      "<select style='width:25%' ng-disabled='componentDisabled' style='margin: 0em .2em' class='form-control' ng-model='direction'><option  selected value></option><option value='E'>E</option><option value='W'>W</option></select>"+
        "</div>",
      	scope: { data:'=', validation:'=', componentDisabled: '='},
        link: function(scope, element, attrs, modelCtrl) {
        	var setValue = function(){
	          	if (scope.data!="" && scope.data!=undefined) {
	          		  var tempData = scope.data.split('/');
		              scope.degree = (tempData[0] != "" ? parseInt(tempData[0]) : "");
		              scope.minutes = (tempData[1] != ""? parseInt(tempData[1]) : "");
		              scope.seconds = (tempData[2] != "" ? parseFloat(tempData[2]): "");
		              scope.direction = (tempData[3] != "" ? tempData[3]: "");
		              checkValidation();
	          	} else {
	              scope.degree = "";
	              scope.minutes = "";
	              scope.seconds = "";
	              scope.direction = "";
	          	  checkValidation();
	          	}
          }
        	
        function checkValidation() {	
            if (scope.degree=="" || scope.degree==undefined || scope.degree==null ||
              		 scope.minutes=="" || scope.minutes==undefined || scope.minutes==null ||
              		 scope.seconds=="" || scope.seconds==undefined || scope.seconds==null ||
              		 scope.direction=="" || scope.direction==undefined || scope.direction==null) {
              	 scope.validation = false;
               } else {
              	 scope.validation = true;
               }
        }
            
          var updateData = function(){
        	checkValidation();
            scope.data = scope.degree+"/"+scope.minutes+"/"+scope.seconds+"/"+scope.direction;
          }
          scope.$watch('data', function(){
          	setValue();
          });
          scope.$watch('direction', function(){
          	updateData();
          });
        	scope.minuteInitValue = 0;
          scope.degreeInitValue = 0;
          scope.secondInitValue = 0;
          scope.isMinutes = function(charCode){
            if((charCode != 'Backspace') && (charCode !='Delete')){
                if (scope.minutes==null){
                    scope.minutes = scope.minuteInitValue;
                  }
                  if (!(scope.minutes>=0 && scope.minutes<=60)) {
                    scope.minutes = Math.floor(scope.minutes/10);
                 }
                 scope.minuteInitValue = scope.minutes;
                 updateData();
                 return true;
            }else{
            	if (scope.minutes>=0 && scope.minutes<=9){
            		scope.minutes = ""
            	}
            	scope.minuteInitValue = scope.minutes;
              updateData();
            }
          }
          scope.isDegree = function(charCode){
            if((charCode != 'Backspace') && (charCode !='Delete')){
                if (scope.degree==null){
                    scope.degree = scope.degreeInitValue;
                  }
                if (!(scope.degree>=0 && scope.degree<=179)) {
                    scope.degree = Math.floor(scope.degree/10);
                 }
                 scope.degreeInitValue = scope.degree;
                 updateData();
                 return true;
            }else{
            	 if (scope.degree>=0 && scope.degree<=9){
               		scope.degree = ""
               	}
            	scope.degreeInitValue = scope.degree;
            	updateData();
            }
          }
          scope.isSeconds = function(charCode){
            if((charCode != 'Backspace') && (charCode !='Delete')){
                if (scope.seconds==null){
                    scope.seconds = scope.secondInitValue;
                  }
                  if (!(scope.seconds>=0 && scope.seconds<=89)) {
                    scope.seconds = Math.floor(scope.seconds/10);
                 }
                 scope.secondInitValue = scope.seconds;
                 scope.seconds = Math.round(scope.seconds * 10) / 10;
                 updateData();
                 return true;
            }else{
            	  if (scope.seconds>=0 && scope.seconds<=9){
              		scope.seconds = ""
              	}
            	scope.secondInitValue = scope.seconds;
            	updateData();
            }
          }
        }
    };
});