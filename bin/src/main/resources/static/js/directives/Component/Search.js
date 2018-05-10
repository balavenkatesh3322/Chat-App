app.directive('modal', function(){
    return {
    	template : '<div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+ '<div class="modal-dialog modal-md">'
				+ '<div class="modal-content" ng-transclude>'
				+ '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
				+ '<span aria-hidden="true">&times;</span>'
				+ '</button>'
				+ '<h4 class="modal-title" id="myModalLabel">Modal title</h4>'
				+ '</div>' + '</div>' + '</div>' + '</div>', 
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
app.directive('modalBody', function(){
	return {
		template : '<div class="">'
				+ '<div class="row" style="padding-bottom: 10px">'
				+ '<div class="col-xs-12">'
				+ '<table class="table table-hover table-bordered table-fixedheader">'
				+ '<thead>'
				+ '<tr>'
				+ '<th width="50%">{{title1}}</th>'
				+ '<th width="50%">{{title2}}</th>'
				+ '</tr>'
				+ '<tr>'
				+ '<th width="50%">'
				+ '<input type="text" class="form-control" placeholder="{{searchdesc1}}" ng-model="search1"/>'
				+ '</th>'
				+ '<th width="50%">'
				+ '<input type="text" class="form-control" placeholder="{{searchdesc2}}" ng-model="search2"/>'
				+ '</th>'
				+ '</tr>'
				+ '</thead>'
				+ '<tbody>'
				+ '<tr ng-class="{isSelectedActive: selectedRow==$index}" ng-repeat="d1 in (filteredItems=(data | filter:{\'key\': search1, \'value\': search2} | bykeyorvalue: search3))" ng-dblclick="saveData($index)" ng-click="setSelected($index)">'
				+ '<td width="51.5%">{{count}}{{d1.key}}</td><td width="48.5%">{{d1.value}}</td>'
				+ '</tr>'
				+ '</tbody>'
				+ '<tfoot>'
				+ '<tr ng-if="!filteredItems.length">'
				+ '<td width="10%" colspan=2>'
				+ "<p class='no_data'>Can\'t find what you are looking for</p>"
				+ '</td>'
				+ '</tr>'
				+ '<tr>'
				+ '<td width="10%" colspan=2>'
				+ '<input type="text" class="form-control" placeholder="{{searchdesc3}}" ng-model="search3">'
				+ '</td>'
				+ '</tr>'
				
				+ '</tfoot>'
				+ '</table>'
				+ '<div class="pull-right" style="margin-top: -15px; margin-bottom: -5px;">'
				/*+ '<button class="btn btn-danger" ng-click="hide()">Cancel</button>'*/
				/*+ '<button class="btn btn-info" style="margin-left: 10px" ng-click="selectButton()">Select</button>'*/
				+ '<a class="btn-custom pull-right" style="margin-right: 10px" ng-hide="!selectedRow && selectedRow!=0" ng-click="selectButton()"><img src="Sidebar/css/button/select.svg" /> <img src="Sidebar/css/button/select_h.svg" /></a>'
				+ '</div>' + '</div>' + '</div>' + '</div>',
		replace:true,
	    restrict: 'E',
	    scope: {title1:'@', title2:'@', searchdesc1: '@', searchdesc2: '@', searchdesc3: '@', data:'=', callbackFn: '&',  hideFn: '&', status:'='},
		link: function(scope, element, attrs) {
	      scope.saveData = function(index){
	    	 scope.callbackFn({arg1: scope.filteredItems[index].key, arg2:scope.filteredItems[index].value });
	      }
	      scope.$watch(function(){return scope.status;}, function(value){
              if(value == false){
                  scope.search1 = "";
                  scope.search2 = "";
                  scope.search3 = "";
              }
          });
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
	app.directive('modalBodyMultiple', function(){
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
app.directive('modalHeader', function(){
return {
	template : '<div class="modal-header modal-directive-header modal-directive-header">'
			+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
			+ '<span aria-hidden="true">&times;</span>'
			+ '</button>'
			+ '<h4 class="modal-title modal-directive-title">{{title}}</h4>'
			+ '</div>',
    replace:true,
    restrict: 'E',
    scope: {title:'@'}
};
});
app.filter('bykeyorvalue', function () {
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