app.controller('TaskManagerctrl', function($scope, $http,Connectivity,$timeout,toaster, $window, $location, $filter,$rootScope,$routeParams){
	$scope.geterrorstatuscode ="0";
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.unauthorize = function(arg1){
	  if (arg1){
	   $scope.haspermission = true;
	  }
	  $scope.hidebody = false;
	 }
	 var date = new Date();
	  $scope.restrictPastDate = {
	          min: date
	      }
	 $scope.$on('$viewContentLoaded', function() {
			$scope.dialog.close();			
		});
	  
	  
	  
//	  $('#myModal').on('hidden.bs.modal', function () {
//		    $('#qtip-content').find('input').focus();
//		});
	  
//	  $("#followerModal").keydown(function(e) {
//		    if (e.keyCode == 9) {
//		        e.preventDefault();
//		    }
//		});
//	  
//	  $("#myModal").keydown(function(e) {
//		    if (e.keyCode == 9) {
//		        e.preventDefault();
//		    }
//		});
	  
	  
	  
	  
	  $scope.actions = [
		                   { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
		               ];
	
	  $scope.validateFreeText = function(modelName, errorModelName){
	    	var regex = /.*[0-9A-Za-z].*$/i;
	    	if(!regex.test($scope[modelName]) && $scope[modelName]!=''){
	    		$scope[errorModelName] = "That doesn't look like a valid entry"
	    		return false;
	    	}else{
	    		$scope[errorModelName] ="";
	    		return true;
	    	}
	    }
	  
	  $scope.$watch('targetdates', function() {
	        var tempDate = $scope.targetdates.split('/');
	        tempDate = new Date(parseInt(tempDate[2]),parseInt(tempDate[0])-1, parseInt(tempDate[1]));
	        if (tempDate < new Date()){
	        	$scope.restrictPastDate = {
		        		min: $scope.targetdates,
		        }
	        }else{
	        	$scope.restrictPastDate = {
		        		min: new Date()
		        }
	        }
	        
	    });
	  
	  $scope.searchdata =function(){
		  $scope.searchparticular[3]="";
  		$scope.searchparticular[1]="";
	  }
	  
	$scope.errorFlag = false;	
	 var setSessionValues = function(){
         $scope.isfollower="N"
         $scope.date = new Date();
         $scope.year=new Date().getFullYear()    
         $scope.empidshow=false; 
         $scope.followerselect=false;
         
     }
	 setSessionValues();
	 var id=$routeParams.id;
	 var key=$routeParams.key;
	 $scope.retrivetaskid=id;
	 $scope.key=key;
	 if($scope.retrivetaskid!=null){
	    	$http({
	            method: 'POST',
	            url: "/get-task-data-by-no/",
	            data: {"taskid": $scope.retrivetaskid}
	        }).then(
	            function(response) {
	            	$scope.geterrormessages=response.data.message;	
	                $scope.geterrorstatus=response.data.errorstatus;
	                $scope.geterrorstatuscode=response.data.status;                
	                $scope.dataerror =response.data.message;                 
	            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){    
	            	$scope.prioritys = response.data.data[0].taskmangerprioritydetails;	
	            	$scope.crewmaster=response.data.data[0].assigneelist;	
	            	$scope.followdetails=response.data.data[0].followerlist;            	
   	        	
	            	responsedata=response.data.data[0].vesseltaskManager;
	            	$scope.createdby=responsedata.createdby;
	            	$scope.processpercent=responsedata.processpercent;
	            	$scope.activeStatus=responsedata.activeStatus;
	            	$scope.taskid={"taskid": responsedata.taskid};	            	
	            	$scope.Taskname = responsedata.taskname;
	            	$scope.Reference =responsedata.reference;
	            	$scope.deparment = responsedata.depcode;	            	
	            	$scope.priority = responsedata.priority;
	            	$scope.assignedto = responsedata.assignedto;
	            	$scope.taskdescription = responsedata.taskdesc;
	            	$scope.crdate = responsedata.crdate;
	            	$scope.cruser = responsedata.cruser;
	            	$scope.createdby=responsedata.createdby;
	            	$scope.assignedby=responsedata.assignedby;
	            	if(responsedata.completeddate!=undefined){
		            	$scope.completeddate= new Date(responsedata.completeddate).toISOString();
		            	}
	            	$scope.completedby=responsedata.donebyuser;
	            	if(responsedata.targetdate != null){
	                    var cnvrtDate = new Date(responsedata.targetdate);
	                    $scope.targetdates = (cnvrtDate.getMonth()+1)+"/"+cnvrtDate.getDate()+"/"+cnvrtDate.getFullYear();
	                   }
	            	
	            	if(responsedata.cancelremark!=undefined){
	            		$scope.deleteremarks =responsedata.cancelremark;	 
	            	}
	            	 $scope.buttonretrive($scope.key);
	            	  if($scope.activeStatus=="V")
	                    {
	            	 $scope.cancelremark=true;
	            	 }
	            	 
	            	        	
	         	        	      
	        	    
	        	    $scope.stateChanged = function (qId) {	        	    	
	        			   if($scope.answers[qId]){ //If it is checked				  
	        				   $scope.isfollower="Y";
	        				   $scope.followwindow=true;
	        				   $scope.followerselect=true;
	        			   }else{
	        				   $scope.followerselect=false;
	        				   $scope.isfollower="N";
	        			   }
	        			}
	        	    
	        	    
	        	    
	        	  //follow and unfollow 
	     	       $scope.follow = [];
	     	       $scope.followstring = [];
	     	       $scope.taskassignedto = [];
	     	       $scope.taskassignedtostring = [];
	     	      $scope.removefollowdetails=[];
	     		    $scope.toggleSelect = function(empid,empcode,rankcode,rankname){			    	
	     		    	$scope.add=({'assigneecode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname,'taskid':$scope.taskid.taskid});
	     		    	var json=angular.toJson($scope.add);
	     		    	var rankcodes = $scope.taskassignedtostring.indexOf(json);
	     		    	if( rankcodes === -1 ){		    		
	     		    		$scope.taskassignedtostring.push(json);	
	     		    		var jsonObj = JSON.parse(json);
	     		    		$scope.taskassignedto.push(jsonObj);
	     		    		$scope.assignedgrid=true;	
	     		    		
	     		    		for(var i=0;i<$scope.followdetails.length;i++){
	    		    			if($scope.followdetails[i][0]==empid){
	    		    				$scope.removefollowdetails.push($scope.followdetails[i])
	    		    		$scope.followdetails.splice(i,1)
	    		    		break;
	    		    			}
	    		    		}
	     		    		for(var i=0;i<$scope.follow.length;i++){
	    		    			if($scope.follow[i].followercode==empid){		    				
	    		    		$scope.follow.splice(i,1)
	    		    		break;
	    		    			}
	    		    		}
	    		        } else{		
	    		        	
	    		        	 $scope.taskassignedtostring.splice($scope.taskassignedtostring.indexOf(json),1);	
	    		        	 $scope.deleteReportassign(empid);
	    		        	 for(var i=0;i<$scope.removefollowdetails.length;i++){
	    			    			if($scope.removefollowdetails[i][0]==empid){
	    			    		$scope.followdetails.push($scope.removefollowdetails[i])
	    			    		break;
	    			    			}
	    			    		}
	    		        }
	     		  
	     		    }
	     		    
	     		   //follower names
	     		    $scope.followerSelect = function(empid,empcode,rankcode,rankname){		
	     		    	$scope.add=({'followercode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname,'taskid':$scope.taskid.taskid});
	     		    	var json=angular.toJson($scope.add);
	     		    	var rankcodes = $scope.followstring.indexOf(json);				    	
	     		    	if( rankcodes === -1 ){			    		
	     		    		$scope.followstring.push(json);
	     		    		$scope.followgrid=true;
	     		    		var jsonObj = JSON.parse(json);
	     		    		$scope.follow.push(jsonObj);
	     		        } else{				        	
	     		        	$scope.followstring.splice($scope.followstring.indexOf(json),1);
	     		        	$scope.deleteExistingfollow(empid);

	     		    	
	     		    }
	     		    }
	     		       
	     		    $scope.getButtonLabel = function(empid,empcode,rankcode,rankname){
	     		    	$scope.add=({'assigneecode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname,'taskid':$scope.taskid.taskid});
	     		    	var json=angular.toJson($scope.add);
	     		    	var rankcodes = $scope.taskassignedtostring.indexOf(json);
	     		        if(rankcodes === -1 ){				        	
	     		            return "Assign";
	     		        } else{				        	
	     		            return "Assigned";
	     		        }
	     		    }
	     		
	     		   

	     		    
	     		   $scope.taskassignee = response.data.data[0].taskassigneebytaskid;	        	
                   for (var i=0; i<$scope.taskassignee.length; i++){	                    	
                  	 $scope.toggleSelect($scope.taskassignee[i][0],$scope.taskassignee[i][1],$scope.taskassignee[i][2],$scope.taskassignee[i][3]);
                  	 
      				}
                   $scope.followdatabytaskid = response.data.data[0].taskfollowerbytaskid; 
   	        	if(!$scope.followdatabytaskid.length==0){
   	        		document.getElementById("euResidentNo").checked = true;
   	        		$scope.isfollower="Y";
       				   $scope.followwindow=true;
       				   $scope.followerselect=true;
   	        	}
   	        	for (var i=0; i<$scope.followdatabytaskid.length; i++){	                    	 
                   	 $scope.followerSelect($scope.followdatabytaskid[i][0],$scope.followdatabytaskid[i][1],$scope.followdatabytaskid[i][2],$scope.followdatabytaskid[i][3]);
                   	
       				}
	     		    
	     		    $scope.followerButtonLabel = function(empid,empcode,rankcode,rankname){
	     		    	$scope.add=({'followercode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname,'taskid':$scope.taskid.taskid});
	     		    	var json=angular.toJson($scope.add);
	     		    	var rankcodes = $scope.followstring.indexOf(json);
	     		        if(rankcodes === -1 ){				        	
	     		            return "Select";
	     		        } else{				        	
	     		            return "Selected";
	     		        }
	     		    }
	     		    
	     		    $scope.gettabledate = function(rankcode,empname,empid){		     		    	
	     		    	 $scope.assignedrank=rankcode;
	     		    	 $scope.assignedto=empname;	
	     		    	 $scope.employeeid=empid;		
	     		    	 $('#myModal').modal('hide');
	     		    	 $('#followerModal').modal('hide');
	     		    	 
	     		    }
	     		    
	     		    $scope.followerSelectdelete = function(empid,empcode,rankcode,rankname){
	     		    	$scope.add=({'followercode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname,'taskid':$scope.taskid.taskid});
	     		    	var json=angular.toJson($scope.add);
	     		    	var rankcodes = $scope.followstring.indexOf(json);
	     		    	$scope.followstring.splice($scope.followstring.indexOf(json),1);
	     		    }
	       
	     		    $scope.toggleSelectdelete = function(empid,empcode,rankcode,rankname){
	     		    	$scope.add=({'assigneecode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname,'taskid':$scope.taskid.taskid});
	     		    	var json=angular.toJson($scope.add);
	     		    	var rankcodes = $scope.taskassignedtostring.indexOf(json);
	     		    	$scope.taskassignedtostring.splice($scope.taskassignedtostring.indexOf(json),1);
	     		    }
	     		    
	     		    
	                $scope.deleteExistingfollow = function(empid,empcode,rankcode,rankname){	    	
	     		    	
	     		    	var index = -1;		
	     				var followdelete = eval( $scope.follow );
	     				for( var i = 0; i < followdelete.length; i++ ) {
	     					if( followdelete[i].followercode === empid ) {
	     						index = i;
	     						break;
	     					}
	     				}
	     				$scope.follow.splice( index, 1 );
	     				 
	     				
	     		    }
	     		    
	     		    
	     		    $scope.deleteExistingReportData = function(empid,empcode,rankcode,rankname){
	     		    	
	     		    	var index = -1;		
	     				var followdelete = eval( $scope.follow );
	     				for( var i = 0; i < followdelete.length; i++ ) {
	     					if( followdelete[i].followercode === empid ) {
	     						index = i;
	     						break;
	     					}
	     				}
	     				$scope.follow.splice( index, 1 );
	     				 $scope.followerSelectdelete(empid,empcode,rankcode,rankname); 
	     				 if($scope.follow.length==0){
	 						$scope.followgrid=false;
	 						
	 					}
	     				
	     		    }
	     		    
	     		    
	     		    $scope.deleteReportassign = function(empid,empcode,rankcode,rankname){ 
	     		    	var index = -1;		
	     				var assigndelete = eval( $scope.taskassignedto );
	     				for( var i = 0; i < assigndelete.length; i++ ) {
	     					if( assigndelete[i].assigneecode === empid ) {
	     						index = i;
	     						break;
	     					}
	     				}
	     				$scope.taskassignedto.splice( index, 1 );				
	     				if($scope.taskassignedto.length==0){
	     					$scope.assignedgrid=false;
	     					
	     				}
	     		    	
	     		    }
	     		    
	     		    $scope.deleteExistingReportassign = function(empid,empcode,rankcode,rankname){	     		    	
	     		    	var index = -1;		
	     				var assigndelete = eval( $scope.taskassignedto );
	     				for( var i = 0; i < assigndelete.length; i++ ) {
	     					if( assigndelete[i].assigneecode === empid ) {
	     						index = i;
	     						break;
	     					}
	     				}
	     				$scope.taskassignedto.splice( index, 1 );
	     				$scope.toggleSelectdelete(empid,empcode,rankcode,rankname);
	     				 for(var i=0;i<$scope.removefollowdetails.length;i++){
 			    			if($scope.removefollowdetails[i][0]==empid){
 			    		$scope.followdetails.push($scope.removefollowdetails[i])
 			    		break;
 			    			}
 			    		}
	     				
	     				if($scope.taskassignedto.length==0){
	     					$scope.assignedgrid=false;
	     					
	     				}
	     		    }
	            	 }else{
	             		$scope.errordetails=response.data.exceptionDetail;
	                 	$scope.showexception=response.data.showerrormessage
	                 	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
	 					$scope.dataerror = [response.data.message[0]]; 	
	 				}  
	            })
	            
	            $scope.buttonretrive = function(key){
		    	if(key==123987){
		    		 $scope.cancelbutton=false;
			            $scope.savebutton=false;
			            $scope.deletesbutton=false;
			            $scope.updatebutton=false;
			            $scope.cancelremark=false;
			            $scope.assignedtobutton=true;
			            $scope.followbutton=true;
			            $scope.deletebuttonassign=true;
			            $scope.deletebuttonfollow=true;
			            $scope.deleteheadfollow=true;
			            $scope.deleteheadassign=true;
			            $scope.taskidshow=true;
			            $scope.percentageshow=true;
			            if($scope.completedby!=null)
			            $scope.completedstaus=true;
			            
		    	}else if(key==019834 && $scope.createdby=="UI" && $scope.processpercent==0 && $scope.activeStatus=="A"){		    		
		    			    $scope.cancelbutton=false;
				            $scope.savebutton=false;
				            $scope.deletesbutton=true;
				            $scope.updatebutton=true;
				            $scope.cancelremark=true;
				            $scope.taskidshow=true;
				            $scope.percentageshow=true;		    			 
		    	}else{
		    		    $scope.assignedtobutton=true;
			            $scope.followbutton=true;
			            $scope.deletebuttonassign=true;
			            $scope.deletebuttonfollow=true;
			            $scope.deleteheadfollow=true;
			            $scope.deleteheadassign=true;
			            if($scope.completedby!=null)
			            $scope.completedstaus=true;
		    		    $scope.cancelbutton=false;
			            $scope.savebutton=false;
			            $scope.deletesbutton=false;
			            $scope.updatebutton=false;
			            $scope.cancelremark=false;
			            $scope.taskidshow=true;
			            $scope.percentageshow=true;
		    	}
		    	
		    }
	            
	             
	    }else
    	{
	    		
	
	    // Employee Details
	    $http({	    	     
	        method: 'GET',
	        url: "/get-createtask-details/",
	    }).then(
	        function(response) {	        	
	        	$scope.geterrormessages=response.data.message;	
                $scope.geterrorstatus=response.data.errorstatus;
                $scope.geterrorstatuscode=response.data.status;                
                $scope.dataerror =response.data.message;                 
            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){    
            	$scope.prioritys = response.data.data[0].taskmangerprioritydetails;	
            	$scope.crewmaster=response.data.data[0].assigneelist;	  
            	$scope.followdetails=response.data.data[0].followerlist; 
            	 }else{
	             		$scope.errordetails=response.data.exceptionDetail;
	                 	$scope.showexception=response.data.showerrormessage
	                 	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
	 					$scope.dataerror = [response.data.message[0]]; 	
	 				}  
	        });

	    
	    $scope.stateChanged = function (qId) {	    	
			   if($scope.answers[qId]){ //If it is checked				  
				   $scope.isfollower="Y";
				   $scope.followwindow=true;
				   $scope.followerselect=true;
			   }else{
				   $scope.followerselect=false;
				   $scope.isfollower="N";
			   }
			}
	    
	    
	    
	  //follow and unfollow 
	       $scope.follow = [];
	       $scope.followstring = [];
	       $scope.taskassignedto = [];
	       $scope.taskassignedtostring = [];
	       $scope.removefollowdetails=[];
		    $scope.toggleSelect = function(empid,empcode,rankcode,rankname){			    	
		    	$scope.add=({'assigneecode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname});
		    	var json=angular.toJson($scope.add);
		    	var rankcodes = $scope.taskassignedtostring.indexOf(json);
		    	if( rankcodes === -1 ){		    		
		    		$scope.taskassignedtostring.push(json);	
		    		var jsonObj = JSON.parse(json);
		    		$scope.taskassignedto.push(jsonObj);
		    		$scope.assignedgrid=true;	
		    		
		    		for(var i=0;i<$scope.followdetails.length;i++){
		    			console.log($scope.followdetails[i][0],"baaaaaaaaaaaaa",empid)
		    			if($scope.followdetails[i][0]==empid){
		    				$scope.removefollowdetails.push($scope.followdetails[i])
		    		$scope.followdetails.splice(i,1)
		    		break;
		    			}
		    		}
		    		for(var i=0;i<$scope.follow.length;i++){
		    			console.log($scope.follow[i].followercode,"jjjjjj",empid)
		    			if($scope.follow[i].followercode==empid){		    				
		    		$scope.follow.splice(i,1)
		    		break;
		    			}
		    		}
		    		
		        } else{		
		        	
		        	 $scope.taskassignedtostring.splice($scope.taskassignedtostring.indexOf(json),1);	
		        	 $scope.deleteReportassign(empid);
		        	 for(var i=0;i<$scope.removefollowdetails.length;i++){
			    			console.log($scope.removefollowdetails[i][0],"gggggggggg",empid)
			    			if($scope.removefollowdetails[i][0]==empid){
			    		$scope.followdetails.push($scope.removefollowdetails[i])
			    		break;
			    			}
			    		}
		        }
		  
		    }
		    

		       
		    $scope.getButtonLabel = function(empid,empcode,rankcode,rankname){
		    	$scope.add=({'assigneecode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname});
		    	var json=angular.toJson($scope.add);
		    	var rankcodes = $scope.taskassignedtostring.indexOf(json);
		        if(rankcodes === -1 ){				        	
		            return "Assign";
		        } else{				        	
		            return "Assigned";
		        }
		    }
		
		    //follower names
		    $scope.followerSelect = function(empid,empcode,rankcode,rankname){		
		    	$scope.add=({'followercode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname});
		    	var json=angular.toJson($scope.add);
		    	var rankcodes = $scope.followstring.indexOf(json);				    	
		    	if( rankcodes === -1 ){			    		
		    		$scope.followstring.push(json);
		    		$scope.followgrid=true;
		    		var jsonObj = JSON.parse(json);
		    		$scope.follow.push(jsonObj);
		        } else{				        	
		        	$scope.followstring.splice($scope.followstring.indexOf(json),1);
		        	$scope.deleteExistingfollow(empid);

		    	
		    }
		    }

		       
		    $scope.followerButtonLabel = function(empid,empcode,rankcode,rankname){
		    	$scope.add=({'followercode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname});
		    	var json=angular.toJson($scope.add);
		    	var rankcodes = $scope.followstring.indexOf(json);
		        if(rankcodes === -1 ){				        	
		            return "Select";
		        } else{				        	
		            return "Selected";
		        }
		    }
		    
		    $scope.gettabledate = function(rankcode,empname,empid){	
		    	
		    	 $scope.assignedrank=rankcode;
		    	 $scope.assignedto=empname;	
		    	 $scope.employeeid=empid;		
		    	 $('#myModal').modal('hide');
		    	 $('#followerModal').modal('hide');
		    	 
		    }
		    
		    $scope.followerSelectdelete = function(empid,empcode,rankcode,rankname){
		    	$scope.add=({'followercode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname});
		    	var json=angular.toJson($scope.add);
		    	var rankcodes = $scope.followstring.indexOf(json);
		    	$scope.followstring.splice($scope.followstring.indexOf(json),1);
		    }

		    $scope.toggleSelectdelete = function(empid,empcode,rankcode,rankname){
		    	$scope.add=({'assigneecode':empid,'empname':empcode, 'rankcode':rankcode,'rankname':rankname});
		    	var json=angular.toJson($scope.add);
		    	var rankcodes = $scope.taskassignedtostring.indexOf(json);
		    	$scope.taskassignedtostring.splice($scope.taskassignedtostring.indexOf(json),1);
		    }
		    
		    
         $scope.deleteExistingfollow = function(empid,empcode,rankcode,rankname){	    			    	
		    	var index = -1;		
				var followdelete = eval( $scope.follow );
				for( var i = 0; i < followdelete.length; i++ ) {
					if( followdelete[i].followercode === empid ) {
						index = i;
						break;
					}
				}
				$scope.follow.splice( index, 1 );		
		    }
		    
		    
		    $scope.deleteExistingReportData = function(empid,empcode,rankcode,rankname){		    	
		    	var index = -1;		
				var followdelete = eval( $scope.follow );
				for( var i = 0; i < followdelete.length; i++ ) {
					if( followdelete[i].followercode === empid ) {
						index = i;
						break;
					}
				}
				$scope.follow.splice( index, 1 );
				 $scope.followerSelectdelete(empid,empcode,rankcode,rankname); 
				 if($scope.follow.length==0){
						$scope.followgrid=false;
						
					}
		    }
		    
		    
		    $scope.deleteReportassign = function(empid,empcode,rankcode,rankname){ 
		    	var index = -1;		
				var assigndelete = eval( $scope.taskassignedto );
				for( var i = 0; i < assigndelete.length; i++ ) {
					if( assigndelete[i].assigneecode === empid ) {
						index = i;
						break;
					}
				}
				$scope.taskassignedto.splice( index, 1 );				
				if($scope.taskassignedto.length==0){
					$scope.assignedgrid=false;
					
				}
		    }
		    
		    $scope.deleteExistingReportassign = function(empid,empcode,rankcode,rankname){ 
		    	var index = -1;		
				var assigndelete = eval( $scope.taskassignedto );
				for( var i = 0; i < assigndelete.length; i++ ) {
					if( assigndelete[i].assigneecode === empid ) {
						index = i;
						break;
					}
				}
				$scope.taskassignedto.splice( index, 1 );
				$scope.toggleSelectdelete(empid,empcode,rankcode,rankname);
				 for(var i=0;i<$scope.removefollowdetails.length;i++){
		    			if($scope.removefollowdetails[i][0]==empid){
		    		$scope.followdetails.push($scope.removefollowdetails[i])
		    		break;
		    			}
		    		}
				if($scope.taskassignedto.length==0){
					$scope.assignedgrid=false;
					
				}
		    }
	       
		    $scope.buttonretrive = function(key){
		    	if(key==123987){
		    		 $scope.cancelbutton=false;
			            $scope.savebutton=false;
			            $scope.deletesbutton=false;
			            $scope.updatebutton=false;
			            $scope.cancelremark=false;
			            $scope.assignedtobutton=true;
			            $scope.followbutton=true;
			            $scope.deletebuttonassign=true;
			            $scope.deletebuttonfollow=true;
			            $scope.deleteheadfollow=true;
			            $scope.deleteheadassign=true;
			            $scope.taskidshow=true;
			            $scope.percentageshow=true;
			            
		    	}else if(key==019834 && $scope.createdby=="UI" && $scope.processpercent==0 && $scope.activeStatus=="A"){		    		
		    			    $scope.cancelbutton=false;
				            $scope.savebutton=false;
				            $scope.deletesbutton=true;
				            $scope.updatebutton=true;
				            $scope.cancelremark=true;
				            $scope.taskidshow=true;
				            $scope.percentageshow=true;		    			 
		    	}else{
		    		    $scope.assignedtobutton=true;
			            $scope.followbutton=true;
			            $scope.deletebuttonassign=true;
			            $scope.deletebuttonfollow=true;
			            $scope.deleteheadfollow=true;
			            $scope.deleteheadassign=true;
			            $scope.completedstaus=true;
		    		    $scope.cancelbutton=false;
			            $scope.savebutton=false;
			            $scope.deletesbutton=false;
			            $scope.updatebutton=false;
			            $scope.cancelremark=false;
			            $scope.taskidshow=true;
			            $scope.percentageshow=true;
		    	}
		    }
		    
           var  buttonsave = function(){
        	   $scope.cancelbutton=true;
               $scope.savebutton=true;
               $scope.deletesbutton=false;
               $scope.updatebutton=false;
		    }
           buttonsave();
           
    	}    
           
	 // save Form to Task Master
	    $scope.saveForm = function(){	    	
	    	 $scope.validation();   	    	
			if($scope.errorFlag == false){			
				formdata = {						
						 'taskname':$scope.Taskname,
						 'reference': $scope.Reference,		
						 'depcode':$scope.deparment,
						 'priority': $scope.priority,						 						 
						 'taskdesc':$scope.taskdescription,
						'targetdate': new Date(document.getElementById('textinputtargetdate').value).toISOString(),
						'isfollower': $scope.isfollower,
						'crdate': $scope.date,
						'assigneddate':$scope.date,			
				
				}
				
				$scope.follow;
				followerTask = [];
				if( $scope.isfollower=="Y"){
				for (var i=0; i<$scope.follow.length; i++){					
					followerTask.push($scope.follow[i]);
				}
				}
				$scope.taskassignedto;
				assignedTask = [];
				for (var i=0; i<$scope.taskassignedto.length; i++){					
					assignedTask.push( $scope.taskassignedto[i]);
				}
				
				compositeData = {
						vesseltaskManager:formdata,
						vessalTaskFollowers:followerTask, 
						vesselTaskAssignee:assignedTask,
						
						
				}
				Connectivity.IsOk().then(function(response){
				$http({
				    url: "/Task-Master-form-submissions/",
				    method: 'POST',
				    data:compositeData		    	
				}).then(function(response){	
					console.log(response,"jjjjjjjjj")
					$scope.geterrormessages=response.data.message;	
 	                $scope.geterrorstatus=response.data.errorstatus;
 	                $scope.geterrorstatuscode=response.data.status;                
 	                $scope.dataerror =response.data.message;
					if(response.data.status==0 && response.data.length!=0 ){
						$scope.taskid = {"taskid": ""};					
						$scope.taskid.taskid=response.data.data[0];						
						 $scope.taskidshow=true;
						 $scope.cancelbutton=false;
				         $scope.savebutton=false;
					toaster.success({title: "Information", body:response.data.successMessage});			
				   
					}else{
						$scope.errordetails=response.data.exceptionDetail;
	                 	$scope.showexception=response.data.showerrormessage
	                 	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
	 					$scope.dataerror = [response.data.message[0]];
						
					}  
					});
				 }, function(error){
					 
					  $scope.dialog.open();
					  $scope.dataerror = "Server not reached";
				 });		
			}else{
				$scope.dataSaveStatus = "Data couldn't be saved. Please enter the required fields";
			}
			};

			
			
			 $scope.cancel = function(){
				 $scope.Taskname=null;
				 $scope.Reference=null;
				 $scope.deparment=null;
				 $scope.priority=null;
				 $scope.assignedto=null;
				 $scope.taskdescription=null;
				 document.getElementById('textinputtargetdate').value="";	
				 $scope.follow = [];
			       $scope.followstring = [];
			       $scope.taskassignedto = [];
			       $scope.taskassignedtostring = [];
			       $scope.assignedgrid=false;
			       $scope.followgrid=false;
				 
				
			 }
			
			 $scope.showReassignModal = function(){
				 $scope.deleteremarks='';
			 angular.element('#Remarks').modal('show');
					
			}
			
			 $scope.Delete = function(){								 
				    if ($scope.deleteremarks != null && $scope.deleteremarks!=''&& $scope.deleteremarks!=undefined) {
				    	$scope.cancelremark_error="";				        
				        formdata = {'taskid': $scope.taskid.taskid,						
								 'taskname':$scope.Taskname,
								 'reference': $scope.Reference,		
								 'depcode':$scope.deparment,
								 'priority': $scope.priority,						 						 
								 'taskdesc':$scope.taskdescription,
								'targetdate': new Date(document.getElementById('textinputtargetdate').value).toISOString(),
								'isfollower': $scope.isfollower,
								'crdate': $scope.crdate,
								'cruser': $scope.cruser,
								'upddate': $scope.date,
								'assigneddate':$scope.date,
								'cancelremark':$scope.deleteremarks,
								'assignedby':$scope.assignedby,
						
						}
						
						$scope.follow;
						followerTask = [];
						if( $scope.isfollower=="Y"){
						for (var i=0; i<$scope.follow.length; i++){
							followerTask.push($scope.follow[i]);
						}
						}
						$scope.taskassignedto;
						assignedTask = [];
						for (var i=0; i<$scope.taskassignedto.length; i++){
							assignedTask.push( $scope.taskassignedto[i]);
						}
						
						compositeData = {
								vesseltaskManager:formdata,
								vessalTaskFollowers:followerTask, 
								vesselTaskAssignee:assignedTask,
								
								
						}
				$http({
				    url: "/delete-task-master/",
				    method: 'POST',
				    data:compositeData,				    	
				}).then(function(response){	
					$scope.geterrormessages=response.data.message;	
 	                $scope.geterrorstatus=response.data.errorstatus;
 	                $scope.geterrorstatuscode=response.data.status;                
 	                $scope.dataerror =response.data.message;
					if(response.data.status==0 && response.data.length!=0 ){
						toaster.success({title: "Information", body:response.data.successMessage});
						$scope.updatebutton=false;
						$scope.deletesbutton=false;
						}else{
							$scope.errordetails=response.data.exceptionDetail;
		                 	$scope.showexception=response.data.showerrormessage
		                 	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
		 					$scope.dataerror = [response.data.message[0]];
							
						}					
					});
					
			 }
		     else{
		    	    $scope.cancelremark=true;
				     $scope.cancelremark_error = 'Please enter the Cancel Remark';
				     document.getElementById('Cancelremarkid').focus();
				    
			 }
			 }
			 
			
			
			 
			 $scope.Update = function(){	
				 $scope.validation();   	    	
					if($scope.errorFlag == false){				
						formdata = {'taskid': $scope.taskid.taskid,						
								 'taskname':$scope.Taskname,
								 'reference': $scope.Reference,		
								 'depcode':$scope.deparment,
								 'priority': $scope.priority,						 						 
								 'taskdesc':$scope.taskdescription,
								'targetdate': new Date(document.getElementById('textinputtargetdate').value).toISOString(),
								'isfollower': $scope.isfollower,
								'crdate': $scope.crdate,
								'cruser': $scope.cruser,
								'upddate': $scope.date,
								'assigneddate':$scope.date,
								'assignedby':$scope.assignedby,
								
						
						}
						
						$scope.follow;
						followerTask = [];
						if( $scope.isfollower=="Y"){
						for (var i=0; i<$scope.follow.length; i++){
							followerTask.push($scope.follow[i]);
						}
						}
						$scope.taskassignedto;
						assignedTask = [];
						for (var i=0; i<$scope.taskassignedto.length; i++){
							assignedTask.push( $scope.taskassignedto[i]);
						}
						
						compositeData = {
								vesseltaskManager:formdata,
								vessalTaskFollowers:followerTask, 
								vesselTaskAssignee:assignedTask,				
								
						}
				$http({
				    url: "/update-task-master/",
				    method: 'POST',
				    data:compositeData,				    	
				}).then(function(response){	
					$scope.geterrormessages=response.data.message;	
 	                $scope.geterrorstatus=response.data.errorstatus;
 	                $scope.geterrorstatuscode=response.data.status;                
 	                $scope.dataerror =response.data.message;
					if(response.data.status==0 && response.data.length!=0 ){
						toaster.success({title: "Information", body:response.data.successMessage});
					}else{
						$scope.errordetails=response.data.exceptionDetail;
	                 	$scope.showexception=response.data.showerrormessage
	                 	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
	 					$scope.dataerror = [response.data.message[0]];
						
					}	    	
				    
					});
			 }
			 }
			 
			 
			 
			 
			//validation form 
		    $scope.validation = function(){
			    $scope.errorFlag = false;
			    if(document.getElementById('textinputTaskname').value==''){
			     $scope.Taskname_error = 'Please enter the Task Name';
			     $scope.errorFlag = true;
			     document.getElementById('textinputTaskname').focus();
			    }
			    else{
			     $scope.Taskname_error = '';
			    }
			    if(document.getElementById('textinputReference').value==''){
				     $scope.Reference_error = 'Please enter the Reference';
				     $scope.errorFlag = true;
				     document.getElementById('textinputReference').focus();
				    }
			    else if(!$scope.validateFreeText('Reference', 'Reference_error')){
				    	$scope.Reference_error = "That doesn't look like a valid entry"
					    	$scope.errorFlag = true;
	                	}
				    else{
				     $scope.Reference_error = '';
				    }
			    
			    if($scope.taskassignedto.length==0){
				     $scope.assignedto_error = 'Please Select Assignee Names';
				     $scope.errorFlag = true;				    
				    }
				    else{
				     $scope.assignedto_error = '';
				    }
//			    if(!$scope.deparment){
//				     $scope.deparment_error = 'Please enter the Department';
//				     $scope.errorFlag = true;
//				     document.getElementById('deparment').focus();
//				    }
//				    else{
//				     $scope.deparment_error = '';
//				    }
			    if(document.getElementById('textinputtaskdescription').value==''){
				     $scope.taskDescription_error = 'Please enter the Task Description';
				     $scope.errorFlag = true;
				     document.getElementById('textinputtaskdescription').focus();
				    }
			    else if(!$scope.validateFreeText('taskdescription', 'taskDescription_error')){
			    	$scope.taskDescription_error = "That doesn't look like a valid entry"
				    	$scope.errorFlag = true;
                	}
				    else{
				     $scope.taskDescription_error = '';
				    }
			    if(!$scope.priority){
				     $scope.priority_error = 'Please enter the Priority';
				     $scope.errorFlag = true;
				    // document.getElementById('txtinspriority').focus();
				    }
				    else{
				     $scope.priority_error = '';
				    }

			    if($scope.targetdates==undefined ||$scope.targetdates==''){
				     $scope.TargetDate_error = 'Please enter the Target Date';
				     $scope.errorFlag = true;
				     document.getElementById('textinputtargetdate').focus();
				    }
				    else{
				     $scope.TargetDate_error = '';
				    }
			    if($scope.isfollower=="Y"){
				    if($scope.follow.length==0){
					     $scope.followbutton_error = 'Please Select  the Follower';
					     $scope.errorFlag = true;
					    }
					    else{
					     $scope.followbutton_error = '';
					    }
				    } 
		    }
	

});