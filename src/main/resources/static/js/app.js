var app = angular.module('spritlechatApp', []);

app.config(function($routeProvider){
    $routeProvider
        .when('/welcome',{
            templateUrl: '/chatwindow.html',
            controller: 'chatCtrl'
        })    	
    	.otherwise(
            { redirectTo: '/welcome'}
        );
       
});
