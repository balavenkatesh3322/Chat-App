app.directive('allowed', function(Auth, $http) {

	return {
		scope: {
			callbackFn: '&'
        },
		link : function(scope, elem, attr) {
			$http.get("get-permission-by-user/?mdlcode="+attr.mdlcode).then(
					function(response) {
						var permissions = [];
						var readAccess = "N";
						if (response.data.length>0){						
							if (response.data[0].createAccess == 'Y') {
								permissions.push("write");
							}
							if (response.data[0].deleteAccess == 'Y') {
								permissions.push('delete');
							}
							if (response.data[0].editAccess == "Y") {
								permissions.push("write");
							}
							if (response.data[0].readAccess == 'Y') {
								permissions.push('read');
								readAccess = 'Y';
							}
							
						}
						if (attr.allowed=="unauthorized"){
							if (readAccess != 'Y'){
								scope.callbackFn({arg1:true});
							}
							else{
								scope.callbackFn({arg1:false});
							}
						}else{
							if (!Auth.allowed(attr.allowed, permissions)) {
								elem.hide();
								scope.callbackFn();
							}
						}
						
					});
		}
	};
});