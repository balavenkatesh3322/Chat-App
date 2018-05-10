//assesmentDirective.js
// custom directive for loading packages
app
	.controller('fileUploadDirectiveController', ['$scope','$http', function($scope,$http) {
	
		$scope.selectFile = function (files){
			$scope.files = files;
		};
		
		$scope.uploadFile = function() {
		  
			var fd = new FormData();
		    fd.append('type',"MI");
	        fd.append('file', $scope.files[0]);
	         $http.post("/v1/uploadFile", fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(){
	        })
	        .error(function(){
	        });
		};
		
	}])
	.directive('fileUploadDirective', function() {
  return {
    templateUrl: 'fileUploadDirectiveTemplate.html'
  };
});


