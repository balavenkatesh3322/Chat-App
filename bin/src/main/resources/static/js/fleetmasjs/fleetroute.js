angular.module("FleetMasterApp")
.config(function($routeProvider){
	$routeProvider.when("/addnewmovie",{
		templateUrl : "views/add.html",
		controller: 'sample1'
	});
	$routeProvider.when("/list",{
		templateUrl : "views/list.html",
		controller: 'sample1'
	});
	$routeProvider.when("/edit",{
		templateUrl : "views/edit.html",
		controller: 'sample1'
	});
	$routeProvider.otherwise({
		templateUrl : "views/list.html",
		controller: 'sample1'
	});
});