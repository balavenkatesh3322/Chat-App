var terminalapp = angular.module("terminalApp",['angularUtils.directives.dirPagination']);

terminalapp.controller('terminalCtrl', function($scope, $http, $window, $location, $filter,$timeout){
	$scope.terminals=[];
	 $scope.errorFlag = true;
	 $scope.shouldShow1 = true;
	 $scope.datastatus = true;
	 $scope.pageTermSize = 15;
	$scope.portListData = [];
	$scope.termListData = [];
	$http({
	    url: "/retrieve_terminal_master/",
	    method: 'GET',
	    
	}).then(function successCallback(response){
		$scope.terminals = response.data;
		console.log("terminals are=> "+$scope.terminals);
		});	
	 $http({
	        method: 'GET',
	        url: "/get_port_list/",
	    }).then(
	        function successCallback(responses) {
	        	$scope.ports = responses.data;	
	        	angular.forEach($scope.ports, function(value, key) {
	        		var portcode = value.portcode;
	        		var portname = value.portname;
	       		    $scope.portListData.push({"key":portcode, "value":portname});
	       		});
	        });	
	 
    $scope.showTermModal = false;   
    $scope.hide = function(){
        $scope.showTermModal = false;
    }
    $scope.setValue = function(arg1,arg2) {
    	$scope.portcode=arg1;
    	$scope.portname=arg2;   	
       $scope.hide();
    }
        
    //save terminal master
	$scope.addform = function(){
		$scope.validation();	    	 
		if($scope.errorFlag == true){							
			 form_data = {
					 	'terminalcode': $scope.terminalcode,
						'terminalname': $scope.terminalname,
						'portcode': $scope.portcode,
						'termguidance': $scope.termguidance,
				}			 
			$http({
			    url: "/save_Terminal_master/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }

			}).then(function successCallback(response){
				$http({
				    url: "/retrieve_terminal_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					$scope.terminals = response.data;
					console.log("xxxx=> "+$scope.terminals);
					$scope.datastatus=false;		
					 $scope.info_status = 'Successfully Saved!';
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.terminalcode = "";
					 $scope.terminalname = "";
					 $scope.portcode = "";
					 $scope.portname = "";
					 $scope.termguidance = "";
					});
			});
		}
	}
	
	//validation
	 $scope.validation = function(){
		 $scope.errorFlag = true;
		 if(document.getElementById('tmcode').value==''){
		     $scope.tcode_error = 'Please enter the terminal code';
	     $scope.errorFlag = false;
		    }
		 else{
			 $scope.tcode_error="";
		 }
	   if(document.getElementById('tmname').value==''){
	    	$scope.tname_error = 'Please enter the terminal name';
		     $scope.errorFlag = false;
	    }
	   else{
		   $scope.tname_error="";
		 }
	     if(document.getElementById('ptcode').value==''){
	    	$scope.ptcode_error = 'Please select port code';
		     $scope.errorFlag = false;
	    }
	    else{
	    	$scope.ptcode_error="";
		 }
	     if(document.getElementById('tmguid').value==''){
	    	$scope.tguid_error = 'Please enter the terminal guidance';
		     $scope.errorFlag = false;
	    }
	    else{
	    	$scope.tguid_error="";
		 }
	 }
	  
	 //edit
	 $scope.editform = function(x){	
		 if (x.active_status == 'V') {
			 $scope.datastatus=false;		
			 $scope.info_status = 'Deleted record cannot be Edited';
			 $timeout(function () { $scope.datastatus = true; }, 3000);
			  }
		 else{
			 console.log( x.terminalcode);
			 $scope.shouldShow = true;
			 $scope.shouldShow1 = false;
			 $scope.terminalcode = x.terminalcode
			 $scope.terminalname = x.terminalname
			 $scope.portcode = x.portcode,
			 $scope.portname = x.portname,
			 $scope.termguidance = x.termguidance,			
			 $scope.cruser = x.cruser;
			 $scope.crdate = x.crdate;
			 $scope.upduser = x.upduser;
			 $scope.upddate = x.upddate;
			 $scope.getportname();
			 
		 }
		 	 
	 }
	 
	 $scope.showTermModal = false;
	 
	 $scope.btnPortActionPerformed = function(){
		 console.log("btnPortActionPerformed >>>>>>>>>>>>>>> ");
		 $scope.showTermModal = true;
		 
		 $http({
			 method : 'POST',
			 url: '/get_port_list_like/',
			 data : $scope.portcode,
		 }).then(function successCallback(responses){
				$scope.ports = responses.data;
				console.log(responses.data);
	        	angular.forEach($scope.ports, function(value, key) {
	        		var portcode = value.portcode;
	        		var portname = value.portname;
	        		$scope.portListData.push({"key":portcode, "value":portname});
//	        		if(portcode == $scope.portcode){		        			
//	        			$scope.portname=portname;
//	        		}
	        	});
		 });
		 
	 }
	 
//	 $scope.getportname=function(){
//		 $http({
//		        method: 'GET',
//		        url: "/get_port_list/",
//		    }).then(
//		        function successCallback(responses) {
//		        	$scope.ports = responses.data;	
//		        	angular.forEach($scope.ports, function(value, key) {
//		        		var portcode = value.portcode;
//		        		var portname = value.portname;
//		       		    $scope.portListData.push({"key":portcode, "value":portname});
////		        		if(portcode==$scope.portcode){		        			
////		        			$scope.portname=portname;
////		        		}
//		        	});
//		        }); 
//	 }
	 
	 $scope.saveform = function(){
			$scope.validation();	    	 
			if($scope.errorFlag == true){							
				 form_data = {
						 'terminalcode': $scope.terminalcode,
							'terminalname': $scope.terminalname,	
							'portcode': $scope.portcode,
							'termguidance': $scope.termguidance,
							'active_status': $scope.active_status,	
							'cruser' : $scope.cruser,
							'crdate' : $scope.crdate,						 
					}			 
				$http({
				    url: "/update_terminal_code/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_terminal_master/",
					    method: 'GET',
					    
					}).then(function successCallback(response){					
						$scope.terminals = response.data;
						//console.log("xxxx=> "+$scope.terminals);
						$scope.datastatus=false;		
						 $scope.info_status = 'Successfully Updated!';
						 $timeout(function () { $scope.datastatus = true; }, 3000);
						 $scope.terminalcode = "";
						 $scope.terminalname = "";
						 $scope.portcode = "";
						 $scope.portname ="";
						 $scope.termguidance = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
						});
				});
			}
		
		} 
	 $scope.removeform = function(x){
		 var result = confirm("Are you sure you want to Delete?");
			if(result){
		 form_data = {
				 	'terminalcode': x.terminalcode,
					'terminalname': x.terminalname,	
					'portcode': x.portcode,
					'termguidance': x.termguidance,	
					'cruser' : x.cruser,
					'crdate' : x.crdate,
					}
		 $http({
			    url: "/delete_terminal_code/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){				
				$http({
				    url: "/retrieve_terminal_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					$scope.terminals = response.data;
					//console.log("xxxx=> "+$scope.terminals);	
					$scope.datastatus=false;		
					 $scope.info_status = 'Terminal Master Removed!';
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.terminalcode = "";
					 $scope.terminalname = "";
					 $scope.portcode = "";
					 $scope.portname ="";
					 $scope.termguidance = "";
					 $scope.shouldShow = false;
					 $scope.shouldShow1 = true;
					});
			});
			}
	 }
	
	 
	 $scope.set_color = function(terminals) {
			if (terminals.statusDesc == 'Inactive') {
				return {
					color : "red"
				}
			}
		}
	 
	 $scope.cancel = function(){
		 $scope.shouldShow1 = true; 
		 $scope.shouldShow = false; 
		 $scope.terminalcode = "";
		 $scope.terminalname = "";
		 $scope.portcode = "";
		 $scope.portname ="";
		 $scope.termguidance = "";
	 };
});

angular.module('terminalApp').directive('modal', function(){
    return {
        template: '<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content" ng-transclude><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Modal title</h4></div></div></div></div>', 
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:{visible:'=', onSown:'&', onHide:'&'},   
        link:function postLink(scope, element, attrs){
            
            $(element).modal({
                show: false, 
                keyboard: attrs.keyboard, 
                backdrop: attrs.backdrop
            });
            
            scope.$watch(function(){return scope.visible;}, function(value){
                
                if(value == true){
                    $(element).modal('show');
                }else{
                    $(element).modal('hide');
                }
            });
            
            $(element).on('shown.bs.modal', function(){
              scope.$apply(function(){
                scope.$parent[attrs.visible] = true;
              });
            });
            
            $(element).on('shown.bs.modal', function(){
              scope.$apply(function(){
                  scope.onSown({});
              });
            });

            $(element).on('hidden.bs.modal', function(){
              scope.$apply(function(){
                scope.$parent[attrs.visible] = false;
              });
            });
            
            $(element).on('hidden.bs.modal', function(){
              scope.$apply(function(){
                  scope.onHide({});
              });
            });
        }
    };
}
);

angular.module('terminalApp').directive('modalHeader', function(){
return {
    template:'<div class="modal-header modal-directive-header modal-directive-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title modal-directive-title">{{title}}</h4></div>',
    replace:true,
    restrict: 'E',
    scope: {title:'@'}
};
});

angular.module('terminalApp').filter('bykeyorvalue', function () {
return function (data, filterValue) {
	if (!filterValue)
		return data;
    var filteredData = []
    angular.forEach(data, function (value, key) {
        if (value.value.toLowerCase().indexOf(filterValue.toLowerCase()) !==-1 || value.key.toLowerCase().indexOf(filterValue.toLowerCase()) !==-1 ) {
            filteredData.push(value);
        }
    });
    return filteredData;
};
});
angular.module('terminalApp').directive('modalBody', function(){
return {
    template:'<div class="container"><br/><div class="row"><div class="col-md-6"><table class="table table-striped table-bordered table-hover table-condensed"><thead><tr><td><input type="text" placeholder="{{searchdesc1}}" ng-model="search1"/></td><td><input type="text" placeholder="{{searchdesc2}}" ng-model="search2"/></td></tr><tr><th>{{title1}}</th><th>{{title2}}</th></tr></thead><tbody><tr ng-repeat="d1 in (filteredItems=(data | filter:{\'key\': search1, \'value\': search2} | bykeyorvalue: search3))" ng-dblclick="saveData($index)" ng-click="setSelected($index)" ng-style="$index == selectedRow && {\'background-color\':\'hsla(194, 100%, 25%, 0.25)\'}"><td>{{count}}{{d1.key}}</td><td>{{d1.value}}</td></tr><tr><td colspan=3><input type="text" style="width:100%" placeholder="{{searchdesc3}}" ng-model="search3"></td></tr></tbody></table></div></div><button class="btn btn-primary" style="margin-left:36%" ng-click="hide()">Cancel</button><button class="btn btn-primary" style="margin-left:1%" ng-click="selectButton()">Select</button><span>&nbsp;</span></div>',
	replace:true,
    restrict: 'E',
    scope: {title1:'@', title2:'@', searchdesc1: '@', searchdesc2: '@', searchdesc3: '@', data:'=', callbackFn: '&',  hideFn: '&'},
	link: function(scope, element, attrs) {
      scope.saveData = function(index){
    	 scope.callbackFn({arg1: scope.filteredItems[index].key, arg2:scope.filteredItems[index].value });
      }
      scope.setSelected = function(index){
    	  scope.selectedRow = index;
      }
      scope.hide = function(){
    	  scope.hideFn();
      }
      scope.selectButton = function (){
  		if (scope.selectedRow || scope.selectedRow==0){
  			scope.callbackFn({arg1: scope.filteredItems[scope.selectedRow].key, arg2:scope.filteredItems[scope.selectedRow].value });
  		}
  	}
  }
};
});
angular.module('terminalApp').directive('modalBodyMultiple', function(){
return {
    template:'<div class="container"><br/><div class="row"><div class="col-md-6"><table class="table table-striped table-bordered table-hover table-condensed"><thead><tr><td></td><td><input type="text" placeholder="{{searchdesc1}}" ng-model="search1"/></td><td><input type="text" placeholder="{{searchdesc2}}" ng-model="search2"/></td></tr><tr><th><input type="checkbox" name="all" value="all" ng-model="allCheckbox" ng-click="toggleAll()"></th><th>{{title1}}</th><th>{{title2}}</th></tr></thead><tbody><tr ng-repeat="d1 in (filteredItems=(data | filter:{\'key\': search1} | filter: {\'value\': search2} | bykeyorvalue: search3))" ng-dblclick="selectCheckbox(d1.key)" ng-style="$index == selectedRow && {\'background-color\':\'hsla(194, 100%, 25%, 0.25)\'}"><td><input type="checkbox" name="selection" value="{{$index}}" ng-change="checkAllSelection()" ng-model="selectionCheckbox[d1.key]"></td><td>{{count}}{{d1.key}}</td><td>{{d1.value}}</td></tr><tr><td colspan=3><input type="text" style="width:100%" placeholder="{{searchdesc3}}" ng-model="search3"></td></tr></tbody></table></div></div><span><button class="btn btn-primary"  style="margin-left:36%" ng-click="hide()">Cancel</button><button class="btn btn-primary" style="margin-left:1%" ng-click="selectButton()">Select</button><br/><span>&nbsp;</span></div>',
    replace:true,
    restrict: 'E',
    scope: {title1:'@', title2:'@', searchdesc1: '@', searchdesc2: '@', searchdesc3: '@', data:'=', callbackFn: '&', hideFn: '&'},
	link: function(scope, element, attrs) {
      scope.isAllSelected = false;
      scope.selectionCheckbox = {};
      scope.selectCheckbox = function(key){
    	  scope.selectionCheckbox[key] = !scope.selectionCheckbox[key];
    	  scope.checkAllSelection();
      }
      for (var i=0; i<scope.data.length; i++){
    	  scope.selectionCheckbox[scope.data[i].key] = false;
      }
      scope.checkAllSelection = function(){
    	  console.log(scope.selectionCheckbox);
    	  var flag = 0;
    	  angular.forEach(scope.selectionCheckbox, function(value, key) {
    		  if (scope.selectionCheckbox[key] == false){
    			  flag =1;
    		  }
    	  });
    	  if (flag ==1){
    		  scope.isAllSelected = false;
    		  scope.allCheckbox = false;
    	  }
    	  else{
    		  scope.isAllSelected = true;
    		  scope.allCheckbox = true;
    	  }
	      console.log(scope.allCheckbox);

      }
	  scope.saveData = function(index){
    	 scope.callbackFn({arg1: scope.filteredItems[index].key, arg2:scope.filteredItems[index].value });
      }
      scope.toggleAll = function(){
    	  var toggleStatus = !scope.isAllSelected;
    	  scope.isAllSelected = toggleStatus;
    	  angular.forEach(scope.selectionCheckbox, function(value, key) {
    		  scope.selectionCheckbox[key] = toggleStatus;
    	  });
      }
      scope.hide = function(){
    	  scope.hideFn();
      }
      scope.selectButton = function (){
    	  var selectedItems = [];
    	  var tempData = {};
    	  for (var i=0; i<scope.data.length; i++){
    		  tempData[scope.data[i].key] = scope.data[i].value;
    	  }
    	  angular.forEach(scope.selectionCheckbox, function(value, key) {
    		  if (value!==false)
    			  selectedItems.push({'key': key, 'value': tempData[key]});
    	  });
    	  if (selectedItems.length > 0)
  		      scope.callbackFn({arg1: selectedItems});
  		 }
  }
};
});
