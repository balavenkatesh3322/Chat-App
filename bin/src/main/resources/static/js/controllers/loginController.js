var app = angular.module('loginApp', []);
app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
app.controller('loginController', function($scope, $http, $location){
	$scope.usercode = null;
	$scope.usercodesend = null;
	$scope.resetcode = null;
	$scope.passwordValidationMsg= "";
	$scope.errorMessage = "";
	$scope.sendforgotusernamelink = function(){
		$scope.usercodesend_error = false;
		if ($scope.email!=undefined && $scope.email!=""){
			$scope.disableButton = true;
			  var req = {
						method: 'GET',
						url: "/forgot-username-mail/?email="+$scope.email
					};
			  $http(req).then(function(res){
				  if(res.data.to[0]==""){
					  $scope.emailNotConfigured = true;
				  }else{
					  $scope.usercodesend = true;
				  }
				  $scope.disableButton = false;
			  },function(){
				  $scope.usercodesend_error = true;
				  $scope.disableButton = false;
			  });
		}else{
			$scope.password_error = true;
		}
		  
	}
	
	
	var AesUtil = function(keySize, iterationCount) {
		  this.keySize = keySize / 32;
		  this.iterationCount = iterationCount;
		};

		AesUtil.prototype.generateKey = function(salt, passPhrase) {
		  var key = CryptoJS.PBKDF2(
		      passPhrase, 
		      CryptoJS.enc.Hex.parse(salt),
		      { keySize: this.keySize, iterations: this.iterationCount });
		  return key;
		}
		AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
			  var key = this.generateKey(salt, passPhrase);
			  var encrypted = CryptoJS.AES.encrypt(
			      plainText,
			      key,
			      { iv: CryptoJS.enc.Hex.parse(iv) });
			  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
			}
	    
		var iterationCount = 1000;
		  var keySize = 128;
		  var passphrase = "loginpassword";
		  //var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
		  var iv ="ddf670ea1fd3061aa4c096bae7073ebe";  
		  var salt = "f4c5d45368fd3ab73a1fae4c02c7bc9f";
		 // var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
		    
		    
		    
	    $scope.hideerror = function(modelName){
	    	$scope.errorMessage = false;
	    	$scope.usercodesend_error = false;
	    	$scope.linksend_error=false;
	    	$scope[modelName]= false;
	    }
	    
		  $scope.validateFreeText = function(modelName, errorModelName){
		    	var regex = /^[0-9A-Za-z]+$/i;
		    	if(!regex.test($scope[modelName]) && $scope[modelName]!=''){
		    		console.log("invalid");
		    		$scope[errorModelName] = "That doesn't look like a valid entry"
		    		return false;
		    	}else{
		    		$scope[errorModelName] ="";
		    		return true;
		    	}
		    }   
	    
	$scope.forgetpassword = function(){
	  urlParams = $location.absUrl().split("?")[1].split("&");
	  $scope.usercode = urlParams[0].split("=")[1];
	  $scope.resetcode = urlParams[1].split("=")[1];
	  console.log($scope.usercode, $scope.resetcode);
	  var req = {
			method: 'GET',
			url: "/validate-user-reset-code/?usercode="+$scope.usercode+"&resetcode="+$scope.resetcode
		};
	  $http(req).then(function(res){
		  if (res.data["allowed"]!= true){
			  window.location.href = "/index.html"
		  }
	  }).catch(function(response){
			 console.log("REdirecting11111");
			 window.location.href = "/index.html"
	  });
  }
  $scope.submitpassword = function(){
	  if (validatePassword($scope.password,$scope.cpassword)) {
		  formData = {"password":$scope.password,
				  	  "usercode": $scope.usercode,
				  	  "resetcode": $scope.resetcode};
		  $http({
	            method: 'POST',
	            url: "/reset-user-password/",
	            data: formData
	        }).then(function(res){
	        	window.location.href = "/index.html"
	        });
		  
	  }
  }
  $scope.sendforgotpasswordlink = function(){
	  $scope.disableButton = true;
	  $scope.linksend_error = false;
	  if ($scope.usercode!=undefined && $scope.usercode!=''){
		  $scope.username_error = false;
		  var req = {
					method: 'GET',
					url: "/forgot-password-mail/?usercode="+$scope.usercode
				};
		  $http(req).then(function(res){
			  if(res.data.to[0]==""){
				  $scope.emailNotConfigured = true;
			  }else{
				  $scope.linksend = true;
			  }
			  $scope.disableButton = false;
		  }, function(error){
			  $scope.disableButton = false;
			  $scope.linksend_error = true;
		  });
	  }
	  else{
		  $scope.username_error = true;
		  $scope.disableButton = false;
	  }
  }
  $scope.login = function() {
	  console.log($scope.username, $scope.password);
	  var aesUtil = new AesUtil(keySize, iterationCount);
	  var username = aesUtil.encrypt(salt, iv, passphrase, $scope.username);
	  var password = aesUtil.encrypt(salt, iv, passphrase, $scope.password);
	  var encodedString = 'username='+ encodeURIComponent(username)+ '&password='+ encodeURIComponent(password);
	 console.log(encodedString);
	  var req = {
			  method: 'POST',
			  url: '/login',
			  headers: {
			    'Content-Type': 'application/x-www-form-urlencoded',
			    'Content-Encoding': 'gzip'
			  },
			  data: encodedString
			 }
	  console.log(req);
	 $http(req).then(function(res){
		 if (res.status==200){
			 window.location.href = "/"
		 }
		 else{
			 console.log("in else");
			 $scope.errorMessage = "Invalid Username or Password";
		 }
	 }).catch(function(response){
	 	 if (response.status==404){
		 		$http(req).then(function(res){
		 			 if (res.status==200){
		 				 window.location.href = "/"
		 			 }
		 			 else{
		 				 console.log(res);
		 				 console.log("in else");
		 				 $scope.errorMessage = "Invalid Username or Password";
		 			 }
		 		}).catch(function(response){
		 			console.log("in else");
					 $scope.errorMessage = "Invalid Username or Password"
		 		});
		 	 }else{
		 		$scope.errorMessage = "Invalid Username or Password";
		 	 }
	 });
  }
  $scope.loginForm = function(){
	  if (!$scope.username){
		  $scope.username_error = true;
	  }else{
		  $scope.username_error = false;
	  }
	  if (!$scope.password){
		  $scope.password_error = true;
	  }else{
		  $scope.password_error = false;
	  }
	  $scope.userCaptcha = "123";
	  $scope.captcha = "123";
	  if(!$scope.userCaptcha || ($scope.userCaptcha!=$scope.captcha)){
		  $scope.usercaptcha_error = true;
		  if($scope.userCaptcha!=$scope.captcha && $scope.userCaptcha!=undefined && $scope.userCaptcha.length>0){
			  $scope.captchaError = "Invalid Captcha Entered";
		  }else{
			  $scope.captchaError = "Captcha is required";
		  }
	  }else{
		  $scope.usercaptcha_error = false;
	  }
	  if (!(!$scope.username || !$scope.password || !$scope.userCaptcha || ($scope.userCaptcha!=$scope.captcha))){
		  console.log($scope.userCaptcha);
		  $scope.login();
	  }
  }
  $scope.validateCaptcha = function(){
	  if($scope.userCaptcha!=$scope.captcha && $scope.userCaptcha!=undefined && $scope.userCaptcha.length>0){
		  $scope.usercaptcha_error = true;
		  $scope.captchaError = "Invalid Captcha Entered";
	  }else{
		  $scope.usercaptcha_error = false;
	  }
  }
  $scope.validateEmail=function(email){
	  var re = /^[a-zA-Z0-9.!#$%&�*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	  if(re.test(email)|| email==""|| email==undefined)
		  return true;
	  else
		  return false;
  }
  var validatePassword = function(password, cpassword){
	  $scope.passwordValidationMsg = "";
	  var re =/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	  if (password===cpassword){
		  if(password.length >= 8 
				  && re.test(password) 
				  && !(password == password.toLowerCase())
				  && !(password == password.toUpperCase())){
			  return true;
		  }
		  else{
			  $scope.passwordValidationMsg = "<span class='text-error'>Your password must:</span><ul class='text-error' style='padding-left:20px;'><li>be atleast 8 character</li><li>contains a lower case letter</li><li>contains a upper case letter</li><li>contains a number</li><li>contains a special character</li></ul>";
		  }
	  }else{
		  $scope.passwordValidationMsg = "Passwords don't match";
	  }
	  return false;
  }
  $scope.validatePass = function(password){
	  var re =/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	  if(password.length >= 8 
			  && re.test(password) 
			  && !(password == password.toLowerCase())
			  && !(password == password.toUpperCase())){
		  return true;
	  }
	  return false;
  }
  $scope.generateCaptcha = function(){
	  var a = Math.floor((Math.random() * 10));
	    var b = Math.floor((Math.random() * 10));
	    var c = Math.floor((Math.random() * 10));
	    var d = Math.floor((Math.random() * 10));
	 	var e = Math.floor((Math.random() * 10));
	    var f = Math.floor((Math.random() * 10));
	    captcha=a.toString()+b.toString()+c.toString()+d.toString()+e.toString()+f.toString();
	    $scope.captcha = captcha;
	    $scope.validateCaptcha();
  }
  $scope.generateCaptcha();
});