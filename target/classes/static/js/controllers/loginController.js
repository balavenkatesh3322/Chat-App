var app = angular.module('loginApp', []);
app.controller('loginController', function($scope, $http, $location){
	$scope.usercode = null;
	$scope.usercodesend = null;
	$scope.resetcode = null;
	$scope.passwordValidationMsg= "";
	$scope.errorMessage = "";
	$scope.userexit=false;
	$scope.notmatch=false;

	
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
	    
	
	
	 $scope.checkduplicateuser = function(){
		 
			  formData = {"username":$scope.username};
			  $http({
		            method: 'GET',
		            url: "/check-userduplicate/?username="+$scope.username		          
		        }).then(function(res){
		        	console.log("response ",res.data.userexistflag);
		        	if(res.data.userexistflag)
		        		$scope.userexit=true;
		        	
		        });
			  
		  
	  }
	 
	 $scope.confirmpassword = function(){
		 
		 if(!($scope.password==$scope.conpassword)){
			 $scope.notmatch=true; 
		 }
	  
 } 
	 $scope.validatesignup = function(){ 
		 if($scope.username!="" && $scope.phonenumber!=""&& $scope.emailid!=""&& $scope.password!=""&&$scope.username!=null && $scope.phonenumber!=null&& $scope.emailid!=null&& $scope.password!=null){
			 if($scope.userexit || $scope.notmatch){
				 return false;
			 }else{
				 return true;
			 }
		 }else{
			 console.log("data not filled");
			 return false;
		 }
		 
		 
	 }
	 
	 
	 
	 $scope.clearsignupdata = function(){ 
		 $scope.username="";
		 $scope.phonenumber="";
		 $scope.emailid="";
		 $scope.password="";
		 $scope.conpassword="";
	 }
	 	
	 $scope.signup = function(){ 
		 if($scope.validatesignup()){
		  formData = {"username":$scope.username,
			  	  "phonenumber": $scope.phonenumber,
			  	  "emailid": $scope.emailid,
			  	"password":$scope.password};
	  $http({
            method: 'POST',
            url: "/signup-userdetails/",
            data: formData,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res){
        	 $("#signupmodel").modal("hide");
        	 $scope.clearsignupdata();
        	console.log("successfully saved   ",res);
        });
		 
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
		 console.log(res  ,"  resresres");
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
	  
	  if (!(!$scope.username || !$scope.password)){
		  console.log($scope.userCaptcha);
		  $scope.login();
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


});