// angular.module('QSHEFeedBackApp', [])

app.filter('cmdate', [ '$filter', function($filter) {
	return function(input, format) {
		return $filter('date')(new Date(input), format);
	};
} ]);
app.filter('bykeyorvalue', function() {
	return function(data, filterValue) {
		if (!filterValue)
			return data;
		var filteredData = []
		angular.forEach(data,
				function(value, key) {
					if (value.value.toLowerCase().indexOf(
							filterValue.toLowerCase()) !== -1
							|| value.key.toLowerCase().indexOf(
									filterValue.toLowerCase()) !== -1) {
						filteredData.push(value);
					}
				});
		return filteredData;
	};
});
app.directive('restrictDecimal', function() {
    return {
        scope: {},
        link: function(scope, element, attrs, controller) {
            element.bind('keypress', function(e) {
                if (e.keyCode === 46 && this.value.indexOf('.') >= 0) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
});
app.directive('validPositiveNumberExp', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9]/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.directive('validPositiveNumberExpDots', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9.]/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.controller('QSHEFeedBackCtrl',function($scope, $http, $window, toaster,$rootScope,systemNotificationService, $routeParams,$location,$timeout, $filter, Connectivity) {
	$scope.actionFormHide=true;
	$scope.newDisabled = false;
	$scope.geterrorstatuscode ="0";	
	$scope.noexposurehours = [];
	$scope.totalsemiannualhour=[];
	$scope.addbutton=true;
	$scope.updatebutton=false;
	$scope.hideshipdiv=true;
	 
					$scope.hidebody = true;
					$scope.haspermission = false;
					$scope.unauthorize = function(arg1){
						if (arg1){
							$scope.haspermission = true;
						}
						$scope.hidebody = false;
					}
					
					 $scope.validateDate = function(modelName, ngModelName,errorModelName, ifConditionModel, typeOfPicker) {
							console.log('inside datte vaidatec>>>>>>>>')
							console.log($scope[modelName]);
	    				   if ($scope[modelName] != "" && $scope[modelName] != undefined) {
								var currentDate = Date.parse($scope[modelName]);
								// Check if Date parse is successful
								if (typeOfPicker == 'date') {
									var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
								} else {
									var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}) (AM|PM)$/;
								}
								
								
								if (!currentDate || !re.test($scope[modelName])) {
									$scope[modelName] = "";
									$scope[ngModelName] = "";
									$scope[errorModelName] = "That doesn't seem like a valid date";
									$scope[ifConditionModel] = true;
								} else {
									$scope[ifConditionModel] = false;
								}
							} else {
								$scope[ifConditionModel] = false;
							}
						}
					
					$scope.deleteqsheCrewMonthDetailobj= function(index) {
				        if (index > 0) {				        	
				            $scope.qsheCrewMonthDetailobj.splice(index, 1);
				            $scope.noexposurehours.splice(index, 1);
				        }
				    };
				    
				    $scope.actions = [
					                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
					               ];
				    
					 $scope.addqsheCrewMonthDetailobj = function(index) {						
					        $scope.qsheCrewMonthDetailobj.push({
					        	'detailno' : "",
								'qsheid' : "",
								'month' : "",
								'crewonboard' : "",
								'noexposuredays' : "",
								'noexposurehours' : "",
								'isinternationdateline' : ""
					        });
					        console.log( $scope.qsheCrewMonthDetailobj," $scope.qsheCrewMonthDetailobj----------->")
					    };
					    
					$scope.qsheCrewMonthDetailobj=[{	
						'detailno' : undefined,
						'qsheid' : undefined,
						'month' : undefined,
						'crewonboard' : undefined,
						'noexposuredays' : undefined,
						'noexposurehours' : undefined,
						'isinternationdateline' : undefined
						}]
					
//					 $scope.today = function() {
//						    $scope.reportyear = new Date(2016,1,1);
//						  };
//						  $scope.today();

						  $scope.clear = function () {
						    $scope.reportyear = null;
						  };

						  $scope.open = function($event) {
						    $scope.status.opened = true;
						  };

//						  $scope.setDate = function(year, month, day) {
//						    $scope.reportyear = new Date(year, month, day);
//						  };

						  $scope.dateOptions = {
						    formatYear: 'yyyy',
						    startingDay: 1,
						    minMode: 'year'
						  };

						  $scope.formats = ['yyyy'];
						  $scope.format = $scope.formats[0];

						  $scope.status = {
						    opened: false
						  };
					
					
					
					$scope.$on('$viewContentLoaded', function() {
						
						$scope.dialog.close();
						$scope.reAssignDialog.close();
						firstback();
					});
					
					 $scope.actionss = [
					                    { text: 'Ok', action: function(){$scope.newDisabled= false;}}
					                ];
					
					 $scope.reAssignDialogClick = function(targetName) {
					    	$scope.targetName = targetName;
					        $scope.reAssignDialog.open();
					    }
					 $scope.closepopupvalidation=function(){
						 $scope.hideshipdiv=true;
							$scope.actionFormHide=true;
						 angular.element("#formvalidation").modal('hide');
					 }
					    $scope.reassignActions = [{
					    	text: 'Yes',
					        action: function openOkAction(){
					        	angular.element($scope.targetName).modal('show');
					        }
					    }, {
					    	text: 'No'
					    }];
					    
					    $scope.okAction = function(targetName) {
					        if ($scope.remarks !== '' && $scope.remarks !== undefined) {
					        	$scope.saveFormData('reasign');
					            angular.element(targetName).modal('hide');
					        }else{
					        	$scope.remarksMessage_error="This field is required";
					        }
					    }
					    
					    $scope.inspectiondates = {
						    	min: new Date(),
						    	max: new Date()
						    }
					
					    $scope.inspectiondate =  function() {
					    	if($scope.reportmonth != undefined && $scope.reportyear != undefined ) {
					    		var d = new Date($scope.reportyear);
								$scope.reportyears =d;
								$scope.reportyears =$scope.reportyear.getFullYear();
						    	$scope.minIns = new Date($scope.reportyears, ($scope.reportmonth - 1));
						    	$scope.maxIns = new Date($scope.reportyears, ($scope.reportmonth - 1) + 1, 0);
					    	
						    	
							    $scope.inspectiondates = {
								    	min: $scope.minIns,
								    	max: $scope.maxIns
								    }
					    	
					    	}

					    	
					    }
					    
					    
						$scope.validatedateofmonth=function(userdata,index){
							$scope.monthlastdate=$scope.maxIns.getDate();
							if($scope.isinternationdateline=='Y'){
								$scope.monthlastdate=$scope.maxIns.getDate()+1;
							}
						if($scope.monthlastdate<$scope[userdata][index].noexposuredays){
							$scope[userdata][index].noexposuredays=""
							$scope.dialog.open();
	                		$scope.validatemessage="Total Number of exposure days cannot exceed "+$scope.monthlastdate+" days";
						}
							$scope.totaldate=0;
							for(var i=0;i<$scope.qsheCrewMonthDetailobj.length;i++){
								$scope.totaldate+=parseInt($scope.qsheCrewMonthDetailobj[i].noexposuredays);
								if($scope.monthlastdate<$scope.totaldate){
									$scope[userdata][i].noexposuredays=""
									$scope.dialog.open();
			                		$scope.validatemessage="Total Number of exposure days cannot exceed "+$scope.monthlastdate+" days";
									break;
								}
							
						}
					}
					    
					    
					    
					var setSessionValues = function() {
						
						var currentDate = new Date();
						var janDate = new Date(currentDate.getFullYear(), 0, 1);
						var juneDate = new Date(currentDate.getFullYear(), 5,
								30);
						var julyDate = new Date(currentDate.getFullYear(), 6, 1);
						var decDate = new Date(currentDate.getFullYear(), 31,
								11);
						var inRangeOne = currentDate >= janDate
								&& currentDate <= juneDate;
						var inRangeTwo = currentDate >= julyDate
								&& currentDate <= decDate;
						if (inRangeOne) {
							$scope.semiyearvalue = "firsthalf_currsafexc";
							$scope.semiYearVesselInspection = "firsthalf_vesselInspection";
							$scope.semiyearenv = "firsthalf_currentenv";
						} else {
							$scope.semiyearvalue = "secondhalf_currsafexc";
							$scope.semiYearVesselInspection = "secondhalf_vesselInspection";
							$scope.semiyearenv = "secondhalf_currentenv";
						}
						// $scope.populateSemiAnnualExternalInspection();
					}
					setSessionValues();

					// SR NO
						qsheid = $routeParams.id;
						
						$rootScope.showScreenOverlay = true;
						Connectivity.IsOk().then(function(response){
							$http({
								method : 'POST',
								url : "/get-qshe-form-data-by-no/",
								data : {
									"qsheid" : qsheid,
									"reportingMonth" : $scope.reportmonth,
									"semiyearvalue" : $scope.semiyearvalue,
								}
							}).then(function(response) {
												
												$scope.geterrormessages=response.data.message;	
                                              $scope.geterrorstatus=response.data.errorstatus;
                                                $scope.geterrorstatuscode=response.data.status;                
                                                  $scope.dataerror =response.data.message;  
                                               if((response.data.status==0 )||(response.data.errorstatus=="SV")){        		
												$scope.currentInspections = [];												
												$scope.formNo = response.data.data[0].formMaster[0];
												$scope.Actiondata = response.data.data[0].isAction;
												$scope.qsheShipBoardReview = response.data.data[0].qsheShipBoardReview;
												$scope.qsheSemiAnnualMaintenance = response.data.data[0].qsheSemiAnnualMaintenance;
												$scope.qsheSemiAnnualSafety = response.data.data[0].qsheSemiAnnualSafety;
												var qsheCrewMonthDetail = response.data.data[0].qsheCrewMonthDetail;
												var qsheCategoryInjury  = response.data.data[0].qsheCategoryInjury;
												var qsheCategoryInjury = response.data.data[0].qsheCategoryInjury;	
												var qsheEnvironmentalDetail = response.data.data[0].qsheEnvironmentalDetail;
												$scope.nearmisscurcount = response.data.data[0].nearMissCurCount;
												$scope.nearmisssemicount = response.data.data[0].nearmisssemicount;
												$scope.wrkflowstatus = response.data.data[0].qsheWfHistory;
												$scope.semiannualinspection=response.data.data[0].qsheSemiAnnualDetail
												$scope.currentInspections = response.data.data[0].qsheMonthlyDetail;
												$scope.reAssignConf = response.data.data[0].systemConfMsgList[0];
												
												
												$scope.internalInspectionsList = [];
												$scope.internalInspections = response.data.data[0].internalInspectionMasterList;
												$scope.internalInspectionsalllist=response.data.data[0].internalInspectionMasterallList;
												angular.forEach($scope.internalInspectionsalllist,
																function(value, key) {
																	var inspectioncode = value.inspectioncode;
																	var inspectionname = value.inspectionname;
																	$scope.internalInspectionsList
																			.push({
																				"key" : inspectioncode,
																				"value" : inspectionname
																			});
																});
												
												$scope.externalInspectionsList = [];
												$scope.externalInspections = response.data.data[0].externalInspectionMasterList;
												angular.forEach($scope.externalInspections,
																function(value, key) {
																	var inspectioncode = value.inspectioncode;
																	var inspectionname = value.inspectionname;
																	$scope.externalInspectionsList
																			.push({
																				"key" : inspectioncode,
																				"value" : inspectionname
																			});
																});
												
												response = response.data.data[0].qsheFeedbackMaster;
												
												$scope.qsheid = response[0].qsheid;
												$scope.reportmonth = String(response[0].reportmonth);
												$scope.validatereportmonth=$scope.reportmonth
												$scope.revnumber = response[0].revnumber;
												$scope.revdate = response[0].revdate;
												$scope.userid = response[0].cruser;
												$scope.crdate = response[0].crdate;
												$scope.wrkflowid = response[0].wrkflowid;
												$scope.formstatus=response[0].activestatus;
												$scope.formreportyear=response[0].reportyear;
												$scope.chiefengcode=response[0].chiefEng;
												$scope.mdlname = response[0].mdlname;
												$scope.qsherefid=response[0].qsherfid;
												$scope.setdate = response[0].uidateformat;
												if($scope.qsheSemiAnnualSafety.lastaccdate!=null){
													var lastaccdate = new Date($scope.qsheSemiAnnualSafety.lastaccdate);
													lastaccdate = (lastaccdate.getMonth()+ 1+ '/'+ lastaccdate.getDate()+ "/" + lastaccdate
															.getFullYear());
													document.getElementById('lastaccdate').value = lastaccdate;
												
													$scope.lastaccdate = lastaccdate;
									    			}
												
												if($scope.formstatus=='APR'){
												$scope.pdfandexport=true;
												}
												if($scope.formstatus!='APR'){
													if($scope.reportmonth!='null' && $scope.formreportyear!=null){
														$scope.populateExternalInspectionIntoQSHEMonthlyDetailforview();
													}
												}else{
													$scope.semiAnnualInspections = [];
													$scope.semiAnnualInspections = $scope.semiannualinspection;
													// 2. Semi Annual Details
													
																		console.log($scope.semiAnnualInspections , ' << $scope.semiAnnualInspections >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
																		for (var i = 0; i < $scope.semiAnnualInspections.length; i++) {
																			for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
																				if ($scope.semiAnnualInspections[i].inspectiontype == "internal"
																						&& $scope.semiAnnualInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
																					$scope.semiAnnualInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
																			}
																			for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
																				if ($scope.semiAnnualInspections[i].inspectiontype == "external"
																						&& $scope.semiAnnualInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
																					$scope.semiAnnualInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
																			}
																			
																		}
																	
												}
												

												$scope.showbuttonvalidation=false;
												console.log($scope.validatereportmonth,"out $scope.validatereportmonth");
												if($scope.validatereportmonth!='null'){
													console.log($scope.validatereportmonth,"$scope.validatereportmonth")
													$scope.showbuttonvalidation=true;
												}
												
												if($scope.reportmonth!='null' ||$scope.reportmonth==undefined ){
												if($scope.reportmonth <= 6){
													$scope.semiYear = 'firsthalf_vesselInspection';
												}else{
													$scope.semiYear = 'secondhalf_vesselInspection';
												}
											}
												
												var buildDate = new Date(
														response[0].reportdate);
												buildDate = (buildDate.getMonth()
														+ 1 + '/'
														+ buildDate.getDate() + "/" + buildDate
														.getFullYear());
												
												$scope.today = function() {
						    $scope.reportyear = new Date(response[0].reportyear,1,1);
						  };
						  $scope.today();
												
												$scope.shipName = response[0].vesselcode;
												$scope.vesselname = response[0].vesselName;
												$scope.masterName = response[0].masterName;
												$scope.masterCode = response[0].master;
												$scope.reportDate = buildDate;
											
																	if($scope.Actiondata.length != 0){
																		$scope.actionrights = $scope.Actiondata[0][0];
																		$scope.defaultaction = $scope.Actiondata[0][1];
																		$scope.stageid = $scope.Actiondata[0][2];
																		$scope.reassignrights = $scope.Actiondata[0][3];
																		 $scope.deleteAction = $scope.Actiondata[1];
																	}
																	
																	
		
																	for (var i = 0; i < $scope.currentInspections.length; i++) {
																		for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
																			if ($scope.currentInspections[i].inspectiontype == "internal"
																					&& $scope.currentInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
																				$scope.currentInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
																		}
																		for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
																			if ($scope.currentInspections[i].inspectiontype == "external"
																					&& $scope.currentInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
																				$scope.currentInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
																		}
																		
																	}
//																});
                            //    });
												// 3. Ship Board Review Data
//												
																	 $scope.inspectiondate();
																	
																	$scope.masterack = $scope.qsheShipBoardReview.masterack;
																	$scope.masterRemarks = $scope.qsheShipBoardReview.masterRemarks;
																	$scope.safetyack = $scope.qsheShipBoardReview.safetyack;
																	$scope.safetyremarks = $scope.qsheShipBoardReview.safetyremarks;
																	$scope.welfareack = $scope.qsheShipBoardReview.welfareack;
																	$scope.welfareremarks = $scope.qsheShipBoardReview.welfareremarks;
																	
																	/*$scope.reviewlastdate = new Date(response.reviewlastdate);
																	$scope.reviewnextdue = new Date(response.reviewnextdue);
																	
																	$scope.safetylastdate = new Date(response.safetylastdate);
																	$scope.safetynextdue = new Date(response.safetynextdue);
																	
																	$scope.welfarelastdate = new Date(response.welfarelastdate);
																	$scope.welfarenextdue = new Date(response.welfarenextdue);*/
																	
																	if($scope.qsheShipBoardReview.reviewlastdate!=null){
														    			var reviewlastdate=new Date($scope.qsheShipBoardReview.reviewlastdate);
														    			$scope.reviewlastdate=(reviewlastdate.getMonth()+1+'/'+reviewlastdate.getDate()+"/"+reviewlastdate.getFullYear());	
														    		}
																  else{
//														    			var reviewlastdate=new Date();			    			
//														    			$scope.reviewlastdate=(reviewlastdate.getMonth()+1+'/'+reviewlastdate.getDate()+"/"+reviewlastdate.getFullYear());
																	  $scope.reviewlastdate="";
														    		}
																	if($scope.qsheShipBoardReview.reviewnextdue!=null){
														    			var reviewnextdue=new Date($scope.qsheShipBoardReview.reviewnextdue);
														    			$scope.reviewnextdue=(reviewnextdue.getMonth()+1+'/'+reviewnextdue.getDate()+"/"+reviewnextdue.getFullYear());	
														    		}else{
														    			var reviewnextdue=new Date();			    			
														    			$scope.reviewnextdue=(reviewnextdue.getMonth()+1+'/'+reviewnextdue.getDate()+"/"+reviewnextdue.getFullYear());
														    		}
																	
																	if($scope.qsheShipBoardReview.safetylastdate!=null){
														    			var safetylastdate=new Date($scope.qsheShipBoardReview.safetylastdate);
														    			$scope.safetylastdate=(safetylastdate.getMonth()+1+'/'+safetylastdate.getDate()+"/"+safetylastdate.getFullYear());	
														    		}
																	else{
																		$scope.safetylastdate="";
//														    			var safetylastdate=new Date();			    			
//														    			$scope.safetylastdate=(safetylastdate.getMonth()+1+'/'+safetylastdate.getDate()+"/"+safetylastdate.getFullYear());
														    		}
																	if($scope.qsheShipBoardReview.safetynextdue!=null){
														    			var safetynextdue=new Date($scope.qsheShipBoardReview.safetynextdue);
														    			$scope.safetynextdue=(safetynextdue.getMonth()+1+'/'+safetynextdue.getDate()+"/"+safetynextdue.getFullYear());	
														    		}
																	else{
																		var safetynextdue="";
														    			//var safetynextdue=new Date();			    			
														    			//$scope.safetynextdue=(safetynextdue.getMonth()+1+'/'+safetynextdue.getDate()+"/"+safetynextdue.getFullYear());
														    		}
																	if($scope.qsheShipBoardReview.welfarelastdate!=null){
														    			var welfarelastdate=new Date($scope.qsheShipBoardReview.welfarelastdate);
														    			$scope.welfarelastdate=(welfarelastdate.getMonth()+1+'/'+welfarelastdate.getDate()+"/"+welfarelastdate.getFullYear());	
														    		}
																	else{
																		$scope.welfarelastdate="";
//														    			var welfarelastdate=new Date();			    			
//														    			$scope.welfarelastdate=(welfarelastdate.getMonth()+1+'/'+welfarelastdate.getDate()+"/"+welfarelastdate.getFullYear());
														    		}
																	if($scope.qsheShipBoardReview.welfarenextdue!=null){
														    			var welfarenextdue=new Date($scope.qsheShipBoardReview.welfarenextdue);
														    			$scope.welfarenextdue=(welfarenextdue.getMonth()+1+'/'+welfarenextdue.getDate()+"/"+welfarenextdue.getFullYear());	
														    		}else{
														    			var welfarenextdue=new Date();			    			
														    			$scope.welfarenextdue=(welfarenextdue.getMonth()+1+'/'+welfarenextdue.getDate()+"/"+welfarenextdue.getFullYear());
														    		}
																	
					
																	$scope.pmscurmoncount = $scope.qsheSemiAnnualMaintenance.pmscurmoncount;
																	$scope.pmstotmoncount = $scope.qsheSemiAnnualMaintenance.pmstotmoncount;
																	$scope.totcount = $scope.qsheSemiAnnualMaintenance.totcount;

		
																	$scope.injurycurcount = $scope.qsheSemiAnnualSafety.injurycurcount;
																	$scope.injurysemicount = $scope.qsheSemiAnnualSafety.injurysemicount;
																	$scope.oilcurcount = $scope.qsheSemiAnnualSafety.oilcurcount;
																	$scope.oilsemicount = $scope.qsheSemiAnnualSafety.oilsemicount;
																	$scope.stoppagecurcount = $scope.qsheSemiAnnualSafety.stoppagecurcount;
																	$scope.stoppagesemicount = $scope.qsheSemiAnnualSafety.stoppagesemicount;
																	$scope.otherscurcount = $scope.qsheSemiAnnualSafety.otherscurcount;
																	$scope.otherssemicount = $scope.qsheSemiAnnualSafety.otherssemicount;
																	$scope.nearmisscurcount = $scope.qsheSemiAnnualSafety.nearmisscurcount;
																	$scope.nearmisssemicount = $scope.qsheSemiAnnualSafety.nearmisssemicount;
																	$scope.mainengcurhrs = $scope.qsheSemiAnnualSafety.mainengcurhrs;
																	$scope.mainengsemihrs = $scope.qsheSemiAnnualSafety.mainengsemihrs;
																	$scope.cargowrkcurhrs = $scope.qsheSemiAnnualSafety.cargowrkcurhrs;
																	$scope.cargowrksemihrs = $scope.qsheSemiAnnualSafety.cargowrksemihrs;
																	$scope.operatingDaysSemiYear=$scope.qsheSemiAnnualSafety.lastacccurdays;
																	
																	
																																
													    			
													    			
																	$scope.qsheCrewMonthDetailobj=[];
																	if(qsheCrewMonthDetail.length>0){
																	for (var i = 0; i < qsheCrewMonthDetail.length; i++) {
																		$scope.noexposurehours[i]=qsheCrewMonthDetail[i].noexposurehours,
																		$scope.qsheCrewMonthDetailobj.push({
														                	'detailno' : $scope.qshecrewmonthdetail_detailno,
																			'qsheid' : $scope.qsheid,
																			'month' : $scope.reportmonth,
																			'crewonboard' :qsheCrewMonthDetail[i].crewonboard,
																			'noexposuredays' : qsheCrewMonthDetail[i].noexposuredays,
																			'noexposurehours' :qsheCrewMonthDetail[i].noexposurehours,																			
																			'isinternationdateline' : $scope.isinternationdateline,
																			'totalexposurehours':$scope.totalexposehoure,
																			'semitotalexposurehours':qsheCrewMonthDetail[i].semitotalexposurehours
														                });																		
														            }
																	$scope.totalsemiannualhour=qsheCrewMonthDetail[0].semitotalexposurehours;
																	$scope.previoussemiannualhour=$scope.totalsemiannualhour-$scope.totalexposehoure;
																	console.log($scope.totalsemiannualhour,"$scope.totalsemiannualhour")
																	}else{	
																		console.log($scope.totalsemiannualhour,"elseee    $scope.totalsemiannualhour")
																		$scope.totalsemiannualhour=0;
																		$scope.previoussemiannualhour=0;
																	$scope.qsheCrewMonthDetailobj=[{	
																		'detailno' : undefined,
																		'qsheid' : undefined,
																		'month' : undefined,
																		'crewonboard' : undefined,
																		'noexposuredays' : undefined,
																		'noexposurehours' : undefined,
																		'isinternationdateline' : undefined,
																		'totalexposurehours':0,
																		'semitotalexposurehours':0
																		}]
																	}
																	console.log($scope.qsheCrewMonthDetailobj,"$scope.qsheCrewMonthDetailobjooooooooo")
//																	for (var i = 0; i < qsheCrewMonthDetail.length; i++) {
//																		if (qsheCrewMonthDetail[i].month == 1) {
//																			document
//																					.getElementById("janMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.janCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.janExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.janExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 2) {
//																			document
//																					.getElementById("febMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.febCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.febExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.febExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 3) {
//																			document
//																					.getElementById("marMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.marCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.marExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.marExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//																		}
//																		if (qsheCrewMonthDetail[i].month == 4) {
//																			document
//																					.getElementById("aprMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.aprCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.aprExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.aprExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 5) {
//																			document
//																					.getElementById("mayMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.mayCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.mayExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.mayExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 6) {
//																			document
//																					.getElementById("junMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.junCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.junExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.junExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 7) {
//																			document
//																					.getElementById("julyMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.julyCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.julyExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.julyExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 8) {
//																			document
//																					.getElementById("augMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.augCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.augExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.augExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 9) {
//																			document
//																					.getElementById("sepMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.sepCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.sepExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.sepExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 10) {
//																			document
//																					.getElementById("octMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.octCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.octExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.octExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 11) {
//																			document
//																					.getElementById("novMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.novCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.novExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.novExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//
//																		}
//																		if (qsheCrewMonthDetail[i].month == 12) {
//																			document
//																					.getElementById("decMonth").value = qsheCrewMonthDetail[i].month;
//																			$scope.decCrewOnboard = qsheCrewMonthDetail[i].crewonboard;
//																			$scope.decExposureDays = qsheCrewMonthDetail[i].noexposuredays;
//																			$scope.decExposureHours = qsheCrewMonthDetail[i].noexposurehours;
//																		}
//																		$scope.isinternationdateline = qsheCrewMonthDetail[i].isinternationdateline;
//																	}
//																});
																	
																	$scope.accidentcurcount = $scope.injurycurcount + $scope.oilcurcount + $scope.stoppagecurcount + $scope.otherscurcount;
																	$scope.accidentsemicount = $scope.injurysemicount + $scope.oilsemicount +$scope.stoppagesemicount + $scope.otherssemicount;
												// 7. Category Injury detail
//					
																	$scope.fatalcount = qsheCategoryInjury.fatalcount;
																	$scope.ptdcount = qsheCategoryInjury.ptdcount;
																	$scope.ppdcount = qsheCategoryInjury.ppdcount;
																	$scope.lwccount = qsheCategoryInjury.lwccount;
																	$scope.rwccount = qsheCategoryInjury.rwccount;
																	$scope.mtccount = qsheCategoryInjury.mtccount;
																	$scope.faccount = qsheCategoryInjury.faccount;
//																});
												// 8. Environment detail

																	$scope.plasticcurgarbage = qsheEnvironmentalDetail.plasticcurgarbage;
																	$scope.plasticsemigarbage = qsheEnvironmentalDetail.plasticsemigarbage;
																	$scope.othercurgarbage = qsheEnvironmentalDetail.othercurgarbage;
																	$scope.othersemigarbage = qsheEnvironmentalDetail.othersemigarbage;
																	$scope.foodcurgarbage = qsheEnvironmentalDetail.foodcurgarbage;
																	$scope.foodsemigarbage = qsheEnvironmentalDetail.foodsemigarbage;
																	$scope.amtcurgarbage = qsheEnvironmentalDetail.amtcurgarbage;
																	$scope.amtsemigarbage = qsheEnvironmentalDetail.amtsemigarbage;
//																});
																	  $rootScope.showScreenOverlay = false;
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
						
						
						
				
					
					
					// Current Vessel Inspection:
					$scope.inspectioncode;
					$scope.portCode;
					$scope.dateinspection;
					$scope.currentInspectionObservations;
					$scope.currentInspectionNonConfirmities;

					$scope.validateCurrentVesselInspection = function() {
						console.log($scope.placeinspection,
								'placeinspection >>>>>>>>>>>>> ')
						console.log($scope.portName, 'portName >>>>>>>>>>>>> ')
						var currentVessel = true;
						if ($scope.qsheMonthlyDetail_inspectioncode === undefined
								|| $scope.qsheMonthlyDetail_inspectioncode === '') {
							currentVessel = false;
						} else {
							currentVessel = true;
						}
						if ($scope.placeinspection === undefined
								|| $scope.placeinspection === '') {
							currentVessel = false;
						} else {
							currentVessel = true;
						}
						if( $scope.portName === undefined || $scope.portName==='undefined'){
							
							currentVessel = false;
						}else{
							
							currentVessel = true;
						}
						if ($scope.obsdefcount === undefined
								|| $scope.obsdefcount === null
								|| $scope.obsdefcount === '') {
							currentVessel = false;
						} else {
							currentVessel = true;
						}
						if ($scope.inspectiondate === undefined
								|| $scope.inspectiondate === '') {
							currentVessel = false;
						} else {
							currentVessel = true;
						}
						if ($scope.nccount === undefined
								|| $scope.nccount === '') {
							currentVessel = false;
						} else {
							currentVessel = true;
						}

						if (currentVessel === true) {
							return true;
						} else {
							return false;
						}
					}

					$scope.addCurVes = '';
					$scope.addcurrentInspection = function() {
						console	.log($scope.qsheMonthlyDetail_inspectioncode,'ioncode >>>>>>>>>>>>> ')

						// var type =
						// document.getElementsByClassName("current-inspection-type")[0].value;
						// var date =
						// document.getElementsByClassName("current-inspection-date")[0].value;
						// if (type !== ''
						// && type !== undefined
						// && $scope.portCode !== undefined
						// && $scope.portCode !== ''
						// && date !== undefined
						// && date !== ''
						// && $scope.currentInspectionObservations !== undefined
						// && $scope.currentInspectionObservations !== ''
						// && $scope.currentInspectionNonConfirmities !==
						// undefined
						// && $scope.currentInspectionNonConfirmities !== '') {

						if ($scope.validateCurrentVesselInspection() === true) {
							console.log('in if add current vessel >>>>>>>>> ')
							$scope.addCurVes = '';
							$scope.inspectName = "";
							for (var i = 0; i < $scope.internalInspections.length; i++) {
								if ($scope.internalInspections[i].inspectioncode === $scope.qsheMonthlyDetail_inspectioncode) {
									$scope.inspectName = $scope.internalInspections[i].inspectionname;
								}
							}
                               if($scope.nccount==0 && $scope.obsdefcount==0){
                            	   $scope.withoutncobsdef=1;
                               }else{
                            	   $scope.withoutncobsdef=0;
                               }
							var obj = {
								'qsheid' : $scope.qsheid,
								'inspectioncode' : $scope.qsheMonthlyDetail_inspectioncode,
								'inspectionname' : $scope.inspectName,
								'inspectiontype' : 'internal',
								'placeinspection' : $scope.placeinspection,
								'portName' : $scope.portName,
								'inspectiondate' : new Date($scope.inspectiondate),
								'nccount' : parseInt($scope.nccount) || 0,
								'obsdefcount' : parseInt($scope.obsdefcount) || 0,
								'withoutncobsdef' : parseInt($scope.withoutncobsdef) || 0,
//								'totalinspection' : parseInt($scope.nccount)
//										|| 0 + parseInt($scope.obsdefcount)
//										|| 0 + parseInt($scope.withoutncobsdef)
//										|| 0
										'totalinspection':1	
							};

							$scope.currentInspections.push(obj);

							
							var semiannualobj = {
									'qsheid' : $scope.qsheid,
									'inspectioncode' : $scope.qsheMonthlyDetail_inspectioncode,
									'inspectionname' : $scope.inspectName,
									'inspectiontype' : 'internal',
									'totalnccount' : parseInt($scope.nccount) || 0,
									'totalobsdefcount' : parseInt($scope.obsdefcount) || 0,
									'withoutncobsdefcount' : parseInt($scope.withoutncobsdef) || 0,
//									'totalinspeccount' : parseInt($scope.nccount)
//											|| 0 + parseInt($scope.obsdefcount)
//											|| 0 + parseInt($scope.withoutncobsdef)
//											|| 0
											'totalinspeccount' : 1,
											'openobsdefcount':0,
											'opennccount':0
											
								};
							

							
							$scope.addcondition=true;	
							for(var i=0;i<$scope.semiAnnualInspections.length;i++){								
							if($scope.qsheMonthlyDetail_inspectioncode==$scope.semiAnnualInspections[i].inspectioncode){								
								$scope.semiAnnualInspections[i].qsheid=$scope.qsheid;
								$scope.semiAnnualInspections[i].inspectioncode=$scope.qsheMonthlyDetail_inspectioncode;
								$scope.semiAnnualInspections[i].inspectionname=$scope.inspectName;
								$scope.semiAnnualInspections[i].inspectiontype='internal'
								$scope.semiAnnualInspections[i].totalnccount=parseInt($scope.nccount)+$scope.semiAnnualInspections[i].totalnccount,
								$scope.semiAnnualInspections[i].totalobsdefcount=parseInt($scope.obsdefcount)+$scope.semiAnnualInspections[i].totalobsdefcount,
								$scope.semiAnnualInspections[i].withoutncobsdefcount= parseInt($scope.withoutncobsdef)+$scope.semiAnnualInspections[i].withoutncobsdefcount,
								$scope.semiAnnualInspections[i].totalinspeccount=1+$scope.semiAnnualInspections[i].totalinspeccount
								console.log($scope.semiAnnualInspections[i].openobsdefcount,"$scope.semiAnnualInspections[i].openobsdefcount$scope.semiAnnualInspections[i].openobsdefcount")
								
									$scope.semiAnnualInspections[i].openobsdefcount=$scope.semiAnnualInspections[i].openobsdefcount
								
									$scope.semiAnnualInspections[i].opennccount=$scope.semiAnnualInspections[i].opennccount
								
									$scope.addcondition=false;								
							}
							}
							
							
							if($scope.addcondition==true){
								$scope.semiAnnualInspections.push(semiannualobj);
								}
							

							$scope.qsheMonthlyDetail_inspectioncode = '';
							$scope.placeinspection = '';
							$scope.obsdefcount = '';
							$scope.inspectiondate = '';
							$scope.nccount = '';
							$scope.portName = '';

							// $scope.inspectioncode = "";
							// $scope.portCode = "";
							// $scope.dateinspection = "";
							// $scope.currentInspectionObservations = "";
							// $scope.currentInspectionNonConfirmities = "";

							$scope.currentInspectionsEntryError = false;
							semiannualobj = [];
						} else {
							console
									.log('in else add current vessel >>>>>>>>> ')
							$scope.currentInspectionsEntryError = true;
							$scope.addCurVes = 'select all the fields';
						}
					}

					
					$scope.deleteSemiAnnualInspectionList = [];
					$scope.deleteCurrentInspectionList = [];
					$scope.deleteCurrentInspection = function(index) {
						
						$scope.deleteCurrentInspectionList.push($scope.currentInspections[index]);
						$scope.deleteSemiAnnualInspectionList
								.push($scope.currentInspections[index]);
						
						$scope.iterate=0;
						for(var i=0;i<$scope.currentInspections.length;i++){
								if($scope.currentInspections[i].inspectionname==$scope.currentInspections[index].inspectionname){
								$scope.iterate++;
								}
							
						}
						console.log($scope.iterate,"$scope.iterate$scope.iterate")
						if($scope.iterate<2){
							
							for(var i=0;i<$scope.semiAnnualInspections.length;i++){	
								console.log($scope.semiAnnualInspections[i].inspectioncode,"$scope.iterate$scope.iterate",$scope.currentInspections[index].inspectioncode)
							if((($scope.semiAnnualInspections[i].inspectioncode)==($scope.currentInspections[index].inspectioncode)) &&($scope.semiAnnualInspections[i].totalnccount==$scope.currentInspections[index].nccount)
									&&($scope.semiAnnualInspections[i].totalobsdefcount==$scope.currentInspections[index].obsdefcount)){
								
							$scope.semiAnnualInspections.splice(i, 1);
							}else{
								for(var i=0;i<$scope.semiAnnualInspections.length;i++){	
									if($scope.currentInspections[index].inspectioncode==$scope.semiAnnualInspections[i].inspectioncode){								
										//$scope.semiAnnualInspections[i].qsheid=$scope.deleteCurrentInspectionList[i].qsheid;
										//$scope.semiAnnualInspections[i].inspectioncode=$scope.deleteCurrentInspectionList[i].inspectioncode;
										//$scope.semiAnnualInspections[i].inspectionname=$scope.deleteCurrentInspectionList[i].inspectName;
										//$scope.semiAnnualInspections[i].inspectiontype='internal'
										$scope.semiAnnualInspections[i].totalnccount=$scope.semiAnnualInspections[i].totalnccount-$scope.currentInspections[index].nccount,
										$scope.semiAnnualInspections[i].totalobsdefcount=$scope.semiAnnualInspections[i].totalobsdefcount-$scope.currentInspections[index].obsdefcount,
										$scope.semiAnnualInspections[i].withoutncobsdefcount= $scope.semiAnnualInspections[i].withoutncobsdefcount-$scope.currentInspections[index].withoutncobsdef,
										$scope.semiAnnualInspections[i].totalinspeccount=$scope.semiAnnualInspections[i].totalinspeccount-1
										
											//$scope.semiAnnualInspections[i].openobsdefcount=$scope.semiAnnualInspections[i].openobsdefcount
										
											//$scope.semiAnnualInspections[i].opennccount=$scope.semiAnnualInspections[i].opennccount
										
										if(($scope.semiAnnualInspections[i].totalnccount==0) && ($scope.semiAnnualInspections[i].totalobsdefcount==0)
												&&($scope.semiAnnualInspections[i].withoutncobsdefcount==0)&&($scope.semiAnnualInspections[i].totalinspeccount==0)){
										$scope.semiAnnualInspections.splice(i, 1);
										}
									
									}
								}
							}
							}
							
						}else{
							for(var i=0;i<$scope.semiAnnualInspections.length;i++){	
								if($scope.currentInspections[index].inspectioncode==$scope.semiAnnualInspections[i].inspectioncode){								
									//$scope.semiAnnualInspections[i].qsheid=$scope.deleteCurrentInspectionList[i].qsheid;
									//$scope.semiAnnualInspections[i].inspectioncode=$scope.deleteCurrentInspectionList[i].inspectioncode;
									//$scope.semiAnnualInspections[i].inspectionname=$scope.deleteCurrentInspectionList[i].inspectName;
									//$scope.semiAnnualInspections[i].inspectiontype='internal'
									$scope.semiAnnualInspections[i].totalnccount=$scope.semiAnnualInspections[i].totalnccount-$scope.currentInspections[index].nccount,
									$scope.semiAnnualInspections[i].totalobsdefcount=$scope.semiAnnualInspections[i].totalobsdefcount-$scope.currentInspections[index].obsdefcount,
									$scope.semiAnnualInspections[i].withoutncobsdefcount= $scope.semiAnnualInspections[i].withoutncobsdefcount-$scope.currentInspections[index].withoutncobsdef,
									$scope.semiAnnualInspections[i].totalinspeccount=$scope.semiAnnualInspections[i].totalinspeccount-1
									
										//$scope.semiAnnualInspections[i].openobsdefcount=$scope.semiAnnualInspections[i].openobsdefcount
									
										//$scope.semiAnnualInspections[i].opennccount=$scope.semiAnnualInspections[i].opennccount
									
								
								}
							}
						}
						$scope.currentInspections.splice(index, 1);
					}

					$scope.updateInspectionReport = function() {
						$scope.updatebutton=false;
						$scope.addbutton=true;						
						console	.log($scope.indexvale,'$scope.indexvale$scope.indexvale$scope.indexvale$scope.indexvale$scope.indexvale ')
						if ($scope.validateCurrentVesselInspection() === true) {
							
							for (var i = 0; i < $scope.internalInspections.length; i++) {
								if ($scope.internalInspections[i].inspectioncode === $scope.qsheMonthlyDetail_inspectioncode) {
									$scope.inspectName = $scope.internalInspections[i].inspectionname;
								}
							}
                               if($scope.nccount==0 && $scope.obsdefcount==0){
                            	   $scope.withoutncobsdef=1;
                               }else{
                            	   $scope.withoutncobsdef=0;
                               }
                               
                               $scope.currentInspections[$scope.indexvale].inspectioncode=$scope.qsheMonthlyDetail_inspectioncode;
                                $scope.currentInspections[$scope.indexvale].inspectionname=$scope.inspectName;
                                $scope.currentInspections[$scope.indexvale].inspectiontype='internal';
       						$scope.currentInspections[$scope.indexvale].placeinspection=$scope.placeinspection;
       						$scope.currentInspections[$scope.indexvale].portName=$scope.portName;
       						$scope.currentInspections[$scope.indexvale].inspectiondate= new Date($scope.inspectiondate);
       						
       						/*if($scope.currentInspections[index].inspectiondate!=null){
    			    			var inspectionDate=new Date($scope.currentInspections[index].inspectiondate);
    			    			$scope.inspectiondate=(inspectionDate.getMonth()+1+'/'+inspectionDate.getDate()+"/"+inspectionDate.getFullYear());
    			    		}else{
    			    			var inspectionDate=new Date();		
    			    			$scope.inspectiondate=(inspectionDate.getMonth()+1+'/'+inspectionDate.getDate()+"/"+inspectionDate.getFullYear());
    			    		}*/
    			
    						$scope.currentInspections[$scope.indexvale].nccount=parseInt($scope.nccount);
    						$scope.currentInspections[$scope.indexvale].obsdefcount= parseInt($scope.obsdefcount);
    						$scope.currentInspections[$scope.indexvale].withoutncobsdef =parseInt($scope.withoutncobsdef);
    						$scope.currentInspections[$scope.indexvale].totalinspection =1;
							


							$scope.qsheMonthlyDetail_inspectioncode = '';
							$scope.placeinspection = '';
							$scope.obsdefcount = '';
							$scope.inspectiondate = '';
							$scope.nccount = '';
							$scope.portName = '';

						}
						
					}
					
					
					$scope.editCurrentInspection = function(index) {
						
						
						
						$scope.updatebutton=true;
						$scope.addbutton=false;
						$scope.indexvale=index;
						$scope.qsheMonthlyDetail_inspectioncode = $scope.currentInspections[index].inspectioncode;
						
						$scope.populateinternaltypeofinspection($scope.qsheMonthlyDetail_inspectioncode);
						
						$scope.qsheMonthlyDetail_inspectionname = $scope.currentInspections[index].inspectionname;
						$scope.placeinspection = $scope.currentInspections[index].placeinspection;
						$scope.portName = $scope.currentInspections[index].portName;
						if($scope.currentInspections[index].inspectiondate!=null){
			    			var inspectionDate=new Date($scope.currentInspections[index].inspectiondate);
			    			$scope.inspectiondate=(inspectionDate.getMonth()+1+'/'+inspectionDate.getDate()+"/"+inspectionDate.getFullYear());
			    		}else{
			    			var inspectionDate=new Date();		
			    			$scope.inspectiondate=(inspectionDate.getMonth()+1+'/'+inspectionDate.getDate()+"/"+inspectionDate.getFullYear());
			    		}
			
						$scope.nccount = $scope.currentInspections[index].nccount;
						$scope.obsdefcount = $scope.currentInspections[index].obsdefcount;
						$scope.withoutncobsdef = $scope.currentInspections[index].withoutncobsdef;
						//$scope.deleteCurrentInspection(index);
					}

					
//					$scope.$watch('semiYear', function() {	
//						if($scope.semiYear!='null' && $scope.semiYear!=undefined){
//						$scope.populateSemiAnnualExternalInspection();
//						}
//					});
					
					// Semi Annual Vessel Inspection:
					// External inspection Semi-Annual Count
//					$scope.populateSemiAnnualExternalInspection = function() {
//						
//						console.log( $scope.semiYearVesselInspection, ' $scope.semiYearVesselInspection >>>>>>>>> ')
//
//						
//						formdata_SemiAnnual = {
//							"qsheid" : $scope.qsheid,
//							"semiyearvalue" : $scope.semiYear
//						}
//						
//			
//						$http({
//									method : 'POST',
//									url : "/get-semi-annual-inspection-data-for-table/",
//									data : formdata_SemiAnnual
//								})
//								.then(function(response) {
//									
//									console.log(response.data , 'get-semi-annual-inspection-data-for-table >>>>>>>>>>>>> ')
//									
//											$http({
//														method : 'POST',
//														url : "/get-qsheSemiAnnualDetail-form-data-by-no/",
//														data : {
//															"qsheid" : qsheid
//														}
//													}).then(
//															function(response) {
//																response = response.data;
//																$scope.semiAnnualInspections = response;
//																console.log($scope.semiAnnualInspections , ' << $scope.semiAnnualInspections get-qsheSemiAnnualDetail-form-data-by-no>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
//																// console.log("semiAnnualInspections"
//																// +
//																// $scope.semiAnnualInspections)
//																for (var i = 0; i < $scope.semiAnnualInspections.length; i++) {
//																	for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
//																		if ($scope.semiAnnualInspections[i].inspectiontype == "internal"
//																				&& $scope.semiAnnualInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
//																			$scope.semiAnnualInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
//																	}
//																	for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
//																		if ($scope.semiAnnualInspections[i].inspectiontype == "external"
//																				&& $scope.semiAnnualInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
//																			$scope.semiAnnualInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
//																	}
//																
//																}
//															});
//
//										});
//					}
//					
					
					$scope.semiAnnualInspectionType;
					$scope.semiAnnualInspectionObservations;
					$scope.semiAnnualInspectionNonConfirmaties;

					$scope.semiAnualInsValidation = function() {
						var semiAnual = true;
						console.log($scope.qsheSemiAnnualDetail_inspectioncode , '$scope.qsheSemiAnnualDetail_inspectioncode')
						console.log($scope.opennccount , '$scope.opennccount')
						console.log($scope.openobsdefcount , '$scope.openobsdefcount')
						if ($scope.qsheSemiAnnualDetail_inspectioncode === undefined
								|| $scope.qsheSemiAnnualDetail_inspectioncode == '') {
							semiAnual = false;
							$scope.semiAnualValidation = 'Select all the values ';
						} else {
							$scope.semiAnualValidation = '';
							semiAnual = true;
						}
						if ($scope.opennccount === undefined
								|| $scope.opennccount == '') {
							semiAnual = false;
							$scope.semiAnualValidation = 'Select all the values ';
						} else {
							$scope.semiAnualValidation = '';
							semiAnual = true;
						}
						if ($scope.openobsdefcount === undefined
								|| $scope.openobsdefcount == '') {
							semiAnual = false;
							$scope.semiAnualValidation = 'Select all the values ';
						} else {
							$scope.semiAnualValidation = '';
							semiAnual = true;
						}

						if (semiAnual === true) {
							return true;
						} else {
							return false;
						}

					}

					$scope.addSemiAnnualInspection = function() {
						
						if ($scope.semiAnualInsValidation() === true) {
							$scope.semiInspectName = "";
							for (var i = 0; i < $scope.internalInspections.length; i++) {
								if ($scope.internalInspections[i].inspectioncode === $scope.qsheSemiAnnualDetail_inspectioncode) {
									$scope.semiInspectName = $scope.internalInspections[i].inspectionname;
								}
							}

							var semiAnnualObject = {
								'qsheid' : $scope.qsheid,
								'inspectioncode' : $scope.qsheSemiAnnualDetail_inspectioncode,
								'inspectionname' : $scope.semiInspectName,
								'inspectiontype' : 'internal',
								'openobsdefcount' : parseInt($scope.openobsdefcount) || 0,
								'opennccount' : parseInt($scope.opennccount) || 0,
								'totalinspeccount' : parseInt($scope.opennccount)
										|| 0
										+ parseInt($scope.openobsdefcount)
										|| 0
							};
							$scope.qsheSemiAnnualDetail_inspectioncode = '';
							$scope.opennccount ='';
							$scope.openobsdefcount = '';
							$scope.semiAnnualInspections.push(semiAnnualObject);
							semiAnnualObject = [];
						}
						
					}

					$scope.deleteSemiAnnualInspectionList = [];
					$scope.deleteSemiAnnualInspection = function(index) {
						$scope.deleteSemiAnnualInspectionList
								.push($scope.semiAnnualInspections[index]);
						$scope.semiAnnualInspections.splice(index, 1);
					}

					$scope.editSemiAnnualInspection = function(index) {
						$scope.qsheSemiAnnualDetail_inspectioncode = $scope.semiAnnualInspections[index].inspectioncode;
						$scope.inspectionname = $scope.semiAnnualInspections[index].inspectionname;
						$scope.withoutncobsdef = $scope.semiAnnualInspections[index].withoutncobsdefcount;
						$scope.openobsdefcount = $scope.semiAnnualInspections[index].openobsdefcount;
						$scope.opennccount = $scope.semiAnnualInspections[index].opennccount;
						$scope.deleteSemiAnnualInspection(index);
					}

					// Shipboard Meetings and Review Status:
					$scope.masterReviewLastDone;
					$scope.masterReviewNextDue;
					$scope.masterReviewRemarks;
					$scope.masterReviewIsReceived;

					$scope.safetyMeetingLastDone;
					$scope.safetyMeetingNextDue;
					$scope.safetyMeetingRemarks;
					$scope.safetyMeetingIsReceived;

					$scope.welfareMeetingLastDone;
					$scope.welfareMeetingNextDue;
					$scope.welfareMeetingRemarks;
					$scope.welfareMeetingIsReceived;

					// Semi Annual & Current Vessel Maintenance:
					$scope.maintenancetype="PMS Items Outstanding";
					$scope.maintenanceMonth;
					$scope.maintenanceCarriedOver;
					$scope.maintenanceTotal;

					// Semi Annual & Safety Excellence
					$scope.accidentReportingMonth;
					$scope.accidentSemiYear;

					$scope.injuryReportingMonth;
					$scope.injurySemiYear;

					$scope.oilSpillReportingMonth;
					$scope.oilSpillSemiYear;

					$scope.othersReportingMonth;
					$scope.othersSemiYear;

					$scope.operatingDaysReportingMonth;
					$scope.operatingDaysSemiYear;

					$scope.janCrewOnboard;
					$scope.janExposureDays;

					$scope.febCrewOnboard;
					$scope.febExposureDays;

					$scope.marCrewOnboard;
					$scope.marExposureDays;

					$scope.aprCrewOnboard;
					$scope.aprExposureDays;

					$scope.mayCrewOnboard;
					$scope.mayExposureDays;

					$scope.junCrewOnboard;
					$scope.junExposureDays;

					$scope.julyCrewOnboard;
					$scope.julyExposureDays;

					$scope.augCrewOnboard;
					$scope.augExposureDays;

					$scope.sepCrewOnboard;
					$scope.sepExposureDays;

					$scope.octCrewOnboard;
					$scope.octExposureDays;

					$scope.novCrewOnboard;
					$scope.novExposureDays;

					$scope.decCrewOnboard;
					$scope.decExposureDays;

					$scope.countDays;

					$scope.disableMonthlyExposureHours = function(value1) {
						var currMonth = new Date().getMonth() + 1;
						// console.log("Current Month = " + currMonth);
						if (value1 <= currMonth)
							return false;
						else
							return true;
					}
					$scope.datastatus = true;
					// Semi Annual & Current Environmental
					//$scope.totalexposehoure=0;
					$scope.totalCrewMonthDetailobj=[];
					$scope.$watch('noexposurehours', function() {		
						$scope.noexposurehours[i]=0;
						$scope.totalexposehoure=0;
						for(var i=0;i<$scope.qsheCrewMonthDetailobj.length;i++){	
							if (Number.isNaN($scope.noexposurehours[i]) || $scope.noexposurehours[i] == undefined){
								$scope.noexposurehours[i] = 0;
								$scope.totalexposehoure=0;
							}else{
							$scope.totalexposehoure+=$scope.noexposurehours[i];	
							}
						}
						console.log($scope.previoussemiannualhour,"$$scope.previoussemiannualhour in watchh")
						console.log($scope.totalexposehoure,"$scope.totalexposehoure $scope.totalexposehoure")
						console.log($scope.totalsemiannualhour,"$$scope.previoussemiannualhour in watchh")
						if($scope.previoussemiannualhour==0){
							console.log($scope.totalsemiannualhour,"vanthuruchuuu")
							$scope.previoussemiannualhour=$scope.totalsemiannualhour;
						}
						if($scope.formstatus!="APR"){
						if(parseInt( $scope.previoussemiannualhour)!=parseInt($scope.totalexposehoure)){
						$scope.totalsemiannualhour=$scope.previoussemiannualhour+$scope.totalexposehoure
						console.log($scope.totalsemiannualhour,"$scope.totalsemiannualhour$scope.totalsemiannualhour in watchh")
						}
						}
						console.log($scope.totalsemiannualhour,"$scope.totalsemiannualhour$scope.totalsemiannualhour out if watchh")
		            }, true);
					

					
					$scope.$watch('semiAnnualInspections', function() {		
						$scope.totalinspeccounts=0;
						$scope.totalnccounts=0;
						$scope.totalobsdefcounts=0;
						$scope.opennccounts=0;
						$scope.openobsdefcounts=0;
						$scope.withoutncobsdefcounts=0;
						for(var i=0;i<$scope.semiAnnualInspections.length;i++){		
						$scope.totalinspeccounts+=$scope.semiAnnualInspections[i].totalinspeccount;
						$scope.totalnccounts+=$scope.semiAnnualInspections[i].totalnccount;
					    $scope.totalobsdefcounts+=$scope.semiAnnualInspections[i].totalobsdefcount;
					    if($scope.semiAnnualInspections[i].opennccount!=undefined && $scope.semiAnnualInspections[i].opennccount!="" ){
					    $scope.opennccounts+=parseInt( $scope.semiAnnualInspections[i].opennccount);
					    }else{
					    	$scope.opennccounts=0;
					    }
					    if($scope.semiAnnualInspections[i].openobsdefcount!=undefined && $scope.semiAnnualInspections[i].openobsdefcount!=""){
						$scope.openobsdefcounts+=parseInt($scope.semiAnnualInspections[i].openobsdefcount);
					    }else{
					    	$scope.openobsdefcounts=0	
					    }
						$scope.withoutncobsdefcounts+=$scope.semiAnnualInspections[i].withoutncobsdefcount;
						}
		            }, true);
					
					$scope.saftymanagementcalculatemonth = function() {
						if($scope.reviewlastdate!=null &&$scope.reviewlastdate!="" ){
						var d = new Date($scope.reviewlastdate);
						d.setMonth(d.getMonth() + 5);
						$scope.reviewnextdue = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();											
						var ds = new Date($scope.reviewnextdue);
						var lastDay = new Date(ds.getFullYear(), ds.getMonth()+1, 0);
						$scope.reviewnextdue = (lastDay.getMonth()+1)+"/"+lastDay.getDate()+"/"+lastDay.getFullYear();
						}else{
							$scope.reviewnextdue="";
						}
					}
					
					
					$scope.swelfarelastdatecalculatemonth = function() {
						if($scope.welfarelastdate!=null && $scope.welfarelastdate!=""){
						var d = new Date($scope.welfarelastdate);
						d.setMonth(d.getMonth() + 3);
						$scope.welfarenextdue = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();											
						var ds = new Date($scope.welfarenextdue);
						var lastDay = new Date(ds.getFullYear(), ds.getMonth()+1, 0);
						$scope.welfarenextdue = (lastDay.getMonth()+1)+"/"+lastDay.getDate()+"/"+lastDay.getFullYear();
						}else{
							$scope.welfarenextdue="";
						}
					}
					
					$scope.$watch('reviewlastdate', function() {
						if($scope.reviewlastdate!=null && $scope.reviewlastdate!=""){
						var d = new Date($scope.reviewlastdate);
						d.setMonth(d.getMonth() + 5);
						$scope.reviewnextdue = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();											
						var ds = new Date($scope.reviewnextdue);
						var lastDay = new Date(ds.getFullYear(), ds.getMonth()+1, 0);
						$scope.reviewnextdue = (lastDay.getMonth()+1)+"/"+lastDay.getDate()+"/"+lastDay.getFullYear();
						}else{
							$scope.reviewnextdue="";
						}
						
					});
					
					$scope.$watch('welfarelastdate', function() {
						if($scope.welfarelastdate!=null && $scope.welfarelastdate!=""){
						var d = new Date($scope.welfarelastdate);
						d.setMonth(d.getMonth() + 3);
						$scope.welfarenextdue = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();											
						var ds = new Date($scope.welfarenextdue);
						var lastDay = new Date(ds.getFullYear(), ds.getMonth()+1, 0);
						$scope.welfarenextdue = (lastDay.getMonth()+1)+"/"+lastDay.getDate()+"/"+lastDay.getFullYear();
					}else{
						$scope.welfarenextdue=""
					}
					});
					
					
					$scope.$watch('safetylastdate', function() {	
						console.log($scope.safetylastdate,"safetylastdate watchhhhhh")
						if($scope.safetylastdate!=null &&$scope.safetylastdate!=""){
						var d = new Date($scope.safetylastdate);
						d.setMonth(d.getMonth() + 1);
						$scope.safetynextdue = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();											
						var ds = new Date($scope.safetynextdue);
						var lastDay = new Date(ds.getFullYear(), ds.getMonth()+1, 0);
						$scope.safetynextdue = (lastDay.getMonth()+1)+"/"+lastDay.getDate()+"/"+lastDay.getFullYear();
						}
						//else{
							//$scope.safetynextdue=$scope.safetynextdue;
						//}
		            });
					
					
//					
					$scope.validateopennc = function(openncdata,usernc, data, index, key) {
					if(openncdata<usernc){
						$scope.dialog.open();
						$scope.validatemessage="Open NC should be smaller than NC";
						$scope[data][index][key] = 0;
					}
					}
					
					$scope.validateopenobs = function(openobsdata,userobs,data, index, key) {
						if(openobsdata<userobs){
							$scope.dialog.open();
							$scope.validatemessage="Open Obs or Def should be smaller than Open NC";
							$scope[data][index][key] = 0;
						}
					}
					
					
					$scope.validateothercurgarbage = function() {
						$scope.othercurgarbage= $scope.roundToenvironment($scope.othercurgarbage,2);
						if($scope.othercurgarbage!=null && $scope.othersemigarbage!=null){
						if(Math.round($scope.othercurgarbage * 100)>Math.round($scope.othersemigarbage * 100)){
							$scope.dialog.open();
							$scope.validatemessage="Reporting Month value should be smaller than semiyear";
							 $scope.othercurgarbage=0;
						}
						}
						
					}
					
					
					$scope.validateothersemigarbage = function() {
						$scope.othersemigarbage= $scope.roundToenvironment($scope.othersemigarbage,2);
						if($scope.othercurgarbage!=null && $scope.othersemigarbage!=null){
						if(Math.round($scope.othercurgarbage * 100)>Math.round($scope.othersemigarbage *100)){
							$scope.dialog.open();
							$scope.validatemessage="Reporting Month value should be smaller than semiyear";
							 $scope.othersemigarbag=0;
						}
						}
						
					}
					
                    $scope.validatefoodsemigarbage = function() {
                    	console.log(Math.round($scope.foodcurgarbage * 100),"jjjjjj",Math.round($scope.foodsemigarbage * 100))
                    	$scope.foodsemigarbage= $scope.roundToenvironment($scope.foodsemigarbage,2);
                    	if($scope.foodcurgarbage!=null&& $scope.foodsemigarbage!=null){
                   if(Math.round($scope.foodcurgarbage * 100)>Math.round($scope.foodsemigarbage * 100)){
                	   $scope.dialog.open();
                	   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
                	   $scope.foodsemigarbage=0;
                	   }
                    	}
                    	
					}
                    
                    $scope.validatefoodcurgarbage = function() {
                    	$scope.foodcurgarbage= $scope.roundToenvironment($scope.foodcurgarbage,2);
                    	if($scope.foodcurgarbage!=null&& $scope.foodsemigarbage!=null){
                   if(Math.round($scope.foodcurgarbage * 100)>Math.round($scope.foodsemigarbage * 100)){
                	   $scope.dialog.open();
                	   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
                	   $scope.foodcurgarbage=0;
                	   }
                    	}
                    	
					}
                    
                $scope.validateamtsemigarbage = function() {
                	$scope.amtsemigarbage= $scope.roundToenvironment($scope.amtsemigarbage,2);
                	if($scope.amtcurgarbage!=null&& $scope.amtsemigarbage!=null){
                	if(Math.round($scope.amtcurgarbage * 100)>Math.round($scope.amtsemigarbage *100)){
                		$scope.dialog.open();
                		$scope.validatemessage="Reporting Month value should be smaller than semiyear";
                		$scope.amtsemigarbage=0;
					}
                	
                }
                 }
                
                $scope.validateamtcurgarbage = function() {
                	$scope.amtcurgarbage= $scope.roundToenvironment($scope.amtcurgarbage,2);
                	if($scope.amtcurgarbage!=null&& $scope.amtsemigarbage!=null){
                	if(Math.round($scope.amtcurgarbage * 100)>Math.round($scope.amtsemigarbage *100)){
                		$scope.dialog.open();
                		$scope.validatemessage="Reporting Month value should be smaller than semiyear";
                		$scope.amtcurgarbage=0;
					}
                	
                }
                 }
                
               $scope.validateplasticcurgarbage = function() {
            	   $scope.plasticcurgarbage= $scope.roundToenvironment($scope.plasticcurgarbage,2);
            	   if($scope.plasticcurgarbage!=null&& $scope.plasticsemigarbage!=null){
            	   if(Math.round($scope.plasticcurgarbage *100)>Math.round($scope.plasticsemigarbage*100)){
            		   $scope.dialog.open();
            		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
            		   $scope.plasticcurgarbage=0;
					}
            	   
            	   }
                 }
					
               $scope.validateplasticsemigarbage = function() {
            	   $scope.plasticsemigarbage= $scope.roundToenvironment($scope.plasticsemigarbage,2);
            	   if($scope.plasticcurgarbage!=null&& $scope.plasticsemigarbage!=null){
            	   if(Math.round($scope.plasticcurgarbage *100)> Math.round($scope.plasticsemigarbage *100)){
            		   $scope.dialog.open();
            		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
            		   $scope.plasticsemigarbage=0;
					}
            	   
            	   }
                 }
               $scope.calculateaccidentcurcount=function(){    
            	   
            	   
            	   if($scope.injurycurcount!=null && $scope.injurysemicount!=null){
            	   if(parseInt($scope.injurycurcount)> parseInt($scope.injurysemicount)){
            		   $scope.dialog.open();
            		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
            		   $scope.injurycurcount=0;
            	   }
            	   }
            	   
            	   if($scope.oilcurcount!=null && $scope.oilsemicount!=null){
        		   if(parseInt($scope.oilcurcount)> parseInt($scope.oilsemicount)){
        			   $scope.dialog.open();
            		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
            		   $scope.oilcurcount=0;
            	   }
            	   }
            	   if($scope.stoppagecurcount!=null && $scope.stoppagesemicount!=null){
            	  if(parseInt($scope.stoppagecurcount) > parseInt($scope.stoppagesemicount)){
            		  $scope.dialog.open();
           		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
           		   $scope.stoppagecurcount=0;
            	   }
            	   }
            	   
            	   if($scope.otherscurcount!=null && $scope.otherssemicount!=null){
            	   if(parseInt($scope.otherscurcount)> parseInt($scope.otherssemicount)){
            		   $scope.dialog.open();
            		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
            		   $scope.otherscurcount=0; 
            	   }
            	   }
            	   
            	   
            	   
            	   if($scope.injurycurcount!=null && $scope.injurycurcount!=""){
            		   $scope.injury= parseInt($scope.injurycurcount);
            	   }
            	   else{
            		   $scope.injury=0;
            	   } 
            	   console.log($scope.oilcurcount);
        		   if($scope.oilcurcount!=null && $scope.oilcurcount!="" && $scope.oilcurcount!=undefined){
            			   $scope.oil= parseInt($scope.oilcurcount);
            	   }
            	   else{
            		   $scope.oil=0; 
            	   } if($scope.stoppagecurcount!=null && $scope.stoppagecurcount!=""){
            		   $scope.stoppage=parseInt($scope.stoppagecurcount);
            	   }
            	   else {
            		   $scope.stoppage=0;
            	   }if($scope.otherscurcount!=null && $scope.otherscurcount!=""){
            		   $scope.others=parseInt($scope.otherscurcount);
            	   }else{
            		   $scope.others=0;
            	   }
            	   $scope.accidentcurcount = $scope.injury + $scope.oil + $scope.stoppage + $scope.others;
               }	
               
               
               
               $scope.calculatevesselmaintain=function(){
            	   if($scope.pmscurmoncount!=null && $scope.pmscurmoncount!=""){
               		   $scope.pmscurmon= parseInt($scope.pmscurmoncount) ;
               	   }
               	   else{
               		   $scope.pmscurmon=0;
               	   } 
           		   if($scope.pmstotmoncount!=null && $scope.pmstotmoncount!="" && $scope.pmstotmoncount!=undefined){
               			   $scope.pmstotmon= parseInt($scope.pmstotmoncount);
               	   }
               	   else{
               		   $scope.pmstotmon=0; 
               	   }
            	  $scope.totcount = $scope.pmscurmon+$scope.pmstotmon ;
               }
               
               
               $scope.validatecurrentsafety=function(){
            	   console.log($scope.mainengcurhrs,$scope.mainengsemihrs,"ffffff") 
            	    $scope.mainengcurhrs=$scope.roundTo($scope.mainengcurhrs,2);
             	  console.log($scope.mainengcurhrs,"fffffff")
            	    console.log(Math.round($scope.mainengcurhrs* 100),Math.round($scope.mainengsemihrs * 100),"ddddd") 
            	   if($scope.mainengcurhrs!=null && $scope.mainengsemihrs!=null){
                 	  if(Math.round($scope.mainengcurhrs* 100)> Math.round($scope.mainengsemihrs* 100)){
                		   $scope.dialog.open();
                		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
                		   $scope.mainengcurhrs=0;
                	   }
                 	  }
                	   
             	 $scope.cargowrkcurhrs=$scope.roundTo($scope.cargowrkcurhrs,2);
                 	  if($scope.cargowrkcurhrs!=null && $scope.cargowrksemihrs!=null){
            		   if(Math.round($scope.cargowrkcurhrs* 100)>Math.round($scope.cargowrksemihrs* 100)){
            			   $scope.dialog.open();
                		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
                		   $scope.cargowrkcurhrs=0;
                	   }
                 	  }
            	   
            	   
               }
               
               
               $scope.validatecurrentsafetysecond=function(){
             	  console.log($scope.mainengcurhrs,$scope.mainengsemihrs,"kkkkkkkkkk")
             	$scope.mainengsemihrs=$scope.roundTo($scope.mainengsemihrs,2);
             	  console.log($scope.mainengsemihrs,"fffffff")
            	   if($scope.mainengcurhrs!=null && $scope.mainengsemihrs!=null){
                 	  if(Math.round($scope.mainengcurhrs* 100)> Math.round($scope.mainengsemihrs* 100)){
                		   $scope.dialog.open();
                		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
                		   $scope.mainengsemihrs=0;
                	   }
                 	  }
                	   
             	 $scope.cargowrksemihrs=$scope.roundTo($scope.cargowrksemihrs,2);
                 	  if($scope.cargowrkcurhrs!=null && $scope.cargowrksemihrs!=null){
            		   if(Math.round($scope.cargowrkcurhrs* 100)> Math.round($scope.cargowrksemihrs* 100)){
            			   $scope.dialog.open();
                		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
                		   $scope.cargowrksemihrs=0;
                	   }
                 	  }
            	   
            	   
               }
               
               
               
              $scope.calculateaccidentsemicount=function(){
           	   console.log($scope.injurycurcount,$scope.injurysemicount,"hhhhh");

            	  if($scope.injurycurcount!=null && $scope.injurysemicount!=null){
            	  if(parseInt($scope.injurycurcount)> parseInt($scope.injurysemicount)){
           		   $scope.dialog.open();
           		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
           		   $scope.injurysemicount=0;
           	   }
            	  }
           	   
            	  if($scope.oilcurcount!=null && $scope.oilsemicount!=null){
       		   if(parseInt($scope.oilcurcount)>parseInt( $scope.oilsemicount)){
       			   $scope.dialog.open();
           		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
           		   $scope.oilsemicount=0;
           	   }
            	  }
            	  
            	  if($scope.stoppagecurcount!=null && $scope.stoppagesemicount!=null){
           	  if(parseInt($scope.stoppagecurcount) > parseInt($scope.stoppagesemicount)){
           		  $scope.dialog.open();
          		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
          		   $scope.stoppagesemicount=0;
           	   }
            	  }
            	  if($scope.otherscurcount!=null && $scope.otherssemicount!=null){
           	   if(parseInt($scope.otherscurcount)> parseInt($scope.otherssemicount)){
           		   $scope.dialog.open();
           		   $scope.validatemessage="Reporting Month value should be smaller than semiyear";
           		   $scope.otherssemicount=0; 
           	   }
            	  }
            	  
            	  
            	  
            	  if($scope.injurysemicount!=null && $scope.injurysemicount!=""){
           		   $scope.injurysemi= parseInt($scope.injurysemicount);
           	   }
           	   else{
           		   $scope.injurysemi=0;
           	   } 
       		   if($scope.oilsemicount!=null && $scope.oilsemicount!="" && $scope.oilsemicount!=undefined){
           			   $scope.oilsemi= parseInt($scope.oilsemicount);
           	   }
           	   else{
           		   $scope.oilsemi=0; 
           	   } if($scope.stoppagesemicount!=null && $scope.stoppagesemicount!=""){
           		   $scope.stoppagesemi=parseInt($scope.stoppagesemicount);
           	   }
           	   else {
           		   $scope.stoppagesemi=0;
           	   }if($scope.otherssemicount!=null && $scope.otherssemicount!=""){
           		   $scope.otherssemi=parseInt($scope.otherssemicount);
           	   }else{
           		   $scope.otherssemi=0;
           	   }
            	  $scope.accidentsemicount = $scope.injurysemi +$scope.oilsemi+ $scope.stoppagesemi+ $scope.otherssemi;
               }
              
              $scope.roundTo =  function (n, digits) {
            	    if (digits === undefined) {
            	        digits = 0;
            	    }

            	    var multiplicator = Math.pow(10, digits);
            	    n = parseFloat((n * multiplicator).toFixed(11));
            	    return (Math.round(n) / multiplicator).toFixed(1);
            	}
              
              
              $scope.roundToenvironment =  function (n, digits) {
          	    if (digits === undefined) {
          	        digits = 0;
          	    }

          	    var multiplicator = Math.pow(10, digits);
          	    n = parseFloat((n * multiplicator).toFixed(11));
          	    return (Math.round(n) / multiplicator).toFixed(2);
          	}
              
					$scope.saveFormData = function(buttonValue) {
						// if(buttonValue == "Send"){
						// $scope.validation();
						// }						
						$scope.saveValidation();						
						var activeStatus = "INP"
						$scope.formStatus = "INP"
						if (buttonValue == 'Send') {
							$scope.formStatus = "SUB"; // chg
							$scope.validation();
							activeStatus="SUB";	
							$scope.newDisabled = true;
						} else if (buttonValue == 'approve') {
							$scope.validation();
							$scope.formStatus = "APR"; // chg
							activeStatus="APR";		
							$scope.newDisabled = true;
							$scope.pdfandexport=true;
						} else if (buttonValue == 'closeout') {
							$scope.formStatus = "CLO";
							activeStatus = "CLO"	
								$scope.validation();
								$scope.newDisabled = true;
						}else if (buttonValue == 'reasign'){
							$scope.validation();
							$scope.formStatus  = "RSN";	
							activeStatus = "RSN"
							$scope.newDisabled = true;
						}else{
							$scope.actionFormHide = false;
							$scope.newDisabled = true;
						}
						
						var d = new Date($scope.reportyear);
						$scope.reportyear =d;
						
						console.log($scope.reportMonthError,"$scope.reportMonthError$scope.reportMonthError")
						
						if($scope.reportMonthError === false){
							 $rootScope.showScreenOverlay = true;
						form_qsheFeedbackMaster = {
							'qsheid' : $scope.qsheid,
							'vesselcode' : $scope.shipName,
							'master' : $scope.masterCode,
							'reportdate' : new Date($scope.reportDate).toISOString(),
							'reportmonth' : $scope.reportmonth,
							'formnumber' : $scope.formNo.actFormno,
							'revnumber' : $scope.revnumber,
							'revdate' : $scope.revdate,
							'cruser' : $scope.userid,
							'crdate' : $scope.crdate,
							'activestatus' : activeStatus,
							"wrkflowid" : $scope.wrkflowid,
							"reportyear": parseInt($scope.reportyear.getFullYear()),
							"semitotalnoofinspections":$scope.totalinspeccounts, 
							 "semitotalnoofnccounts" :$scope.totalnccounts,
							 "semitotalnoofobscounts":$scope.totalobsdefcounts,
							"semitotalnoofopennccount" :$scope.opennccounts,
							"semitotalnoofopenobsdefcount" :$scope.openobsdefcounts,
							 "semitotalnoofwithoutncobsdefcount" :$scope.withoutncobsdefcounts,
							 "chiefEng":$scope.chiefengcode
						};
						if($scope.currentInspections.length!=0 ){
							for(var i=0;i<$scope.currentInspections.length;i++){
						$scope.currentInspections[i].qsheid = $scope.qsheid;
							}
						}
						// console.log("$scope.currentInspections = " +
						// $scope.currentInspections);
						form_qsheMonthlyDetail = $scope.currentInspections;
						if($scope.semiAnnualInspections.length!=0 ){
							for(var i=0;i<$scope.semiAnnualInspections.length;i++){
						$scope.semiAnnualInspections[i].qsheid = $scope.qsheid;
							}
						}
						form_qsheSemiAnnualDetail = $scope.semiAnnualInspections;						
						form_qsheShipBoardReview = {
							'qsheid' : $scope.qsheid,
							'masterack' : $scope.masterack,
							'masterRemarks' : $scope.masterRemarks,
							'safetyack' : $scope.safetyack,
							'safetyremarks' : $scope.safetyremarks,
							'welfareack' : $scope.welfareack,
							'welfareremarks' : $scope.welfareremarks,						
							'reviewlastdate' : new Date($scope.reviewlastdate),
							'reviewnextdue' : new Date($scope.reviewnextdue),
							'safetylastdate' : new Date($scope.safetylastdate),					
							'safetynextdue' : new Date($scope.safetynextdue),
							'welfarelastdate' : new Date($scope.welfarelastdate),
							'welfarenextdue' : new Date($scope.welfarenextdue),
						};
						/*if (document.getElementById('reviewlastdate').value) {
							form_qsheShipBoardReview['reviewlastdate'] = new Date($scope.reviewlastdate).toISOString();
						}
						if (document.getElementById('reviewnextdue').value) {
							form_qsheShipBoardReview['reviewnextdue'] = new Date(
									$scope.reviewnextdue)
									.toISOString();
						}
						if (document.getElementById('safetylastdate').value) {
							form_qsheShipBoardReview['safetylastdate'] = new Date(
									$scope.safetylastdate)
									.toISOString();
						}
						if (document.getElementById('safetynextdue').value) {
							form_qsheShipBoardReview['safetynextdue'] = new Date(
									$scope.safetynextdue)
									.toISOString();
						}
						if (document.getElementById('welfarelastdate').value) {
							form_qsheShipBoardReview['welfarelastdate'] = new Date(
									$scope.welfarelastdate)
									.toISOString();
						}
						if (document.getElementById('welfarenextdue').value) {
							form_qsheShipBoardReview['welfarenextdue'] = new Date(
									$scope.welfarenextdue)
									.toISOString();
						}*/
						
						form_qsheSemiAnnualMaintenance = {
							'qsheid' : $scope.qsheid,
							'pmscurmoncount' : $scope.pmscurmoncount,
							'pmstotmoncount' : $scope.pmstotmoncount,
							'totcount' : $scope.totcount
						};
						form_qsheSemiAnnualSafety = {
							'qsheid' : $scope.qsheid,
							'injurycurcount' : $scope.injurycurcount,
							'injurysemicount' : $scope.injurysemicount,
							'oilcurcount' : $scope.oilcurcount,
							'oilsemicount' : $scope.oilsemicount,
							'stoppagecurcount' : $scope.stoppagecurcount,
							'stoppagesemicount' : $scope.stoppagesemicount,
							'otherscurcount' : $scope.otherscurcount,
							'otherssemicount' : $scope.otherssemicount,
							'nearmisscurcount' : $scope.nearmisscurcount,
							'nearmisssemicount' : $scope.nearmisssemicount,
							'mainengcurhrs' : $scope.mainengcurhrs,
							'mainengsemihrs' : $scope.mainengsemihrs,
							'cargowrkcurhrs' : $scope.cargowrkcurhrs,
							'cargowrksemihrs' : $scope.cargowrksemihrs,
							 'lastaccdate' : new Date($scope.lastaccdate), // new							 
							'lastacccurdays' : $scope.operatingDaysSemiYear
									
						};
						console.log($scope.totalexposehoure,"$scope.totalexposehoure$scope.totalexposehoure")
						$scope.sendqsheCrewMonthDetailobj=[];
						for (var i = 0; i < $scope.qsheCrewMonthDetailobj.length; i++) {
							$scope.sendqsheCrewMonthDetailobj.push({
			                	'detailno' : $scope.qshecrewmonthdetail_detailno,
								'qsheid' : $scope.qsheid,
								'month' : $scope.reportmonth,
								'crewonboard' :$scope.qsheCrewMonthDetailobj[i].crewonboard,
								'noexposuredays' : $scope.qsheCrewMonthDetailobj[i].noexposuredays,
								'noexposurehours' :$scope.noexposurehours[i] ,
								'isinternationdateline' : $scope.isinternationdateline,
								'totalexposurehours':$scope.totalexposehoure,
								'semitotalexposurehours':$scope.totalsemiannualhour
			                });
			            }
						console.log($scope.sendqsheCrewMonthDetailobj,"$scope.qsheCrewMonthDetailobj$scope.qsheCrewMonthDetailobj")
						form_qsheCrewMonthDetail=$scope.sendqsheCrewMonthDetailobj;
//						form_qsheCrewMonthDetail = [
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("janMonth").value,
//									'crewonboard' : $scope.janCrewOnboard,
//									'noexposuredays' : $scope.janExposureDays,
//									'noexposurehours' : $scope.janExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("febMonth").value,
//									'crewonboard' : $scope.febCrewOnboard,
//									'noexposuredays' : $scope.febExposureDays,
//									'noexposurehours' : $scope.febExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("marMonth").value,
//									'crewonboard' : $scope.marCrewOnboard,
//									'noexposuredays' : $scope.marExposureDays,
//									'noexposurehours' : $scope.marExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("aprMonth").value,
//									'crewonboard' : $scope.aprCrewOnboard,
//									'noexposuredays' : $scope.aprExposureDays,
//									'noexposurehours' : $scope.aprExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("mayMonth").value,
//									'crewonboard' : $scope.mayCrewOnboard,
//									'noexposuredays' : $scope.mayExposureDays,
//									'noexposurehours' : $scope.mayExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("junMonth").value,
//									'crewonboard' : $scope.junCrewOnboard,
//									'noexposuredays' : $scope.junExposureDays,
//									'noexposurehours' : $scope.junExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("julyMonth").value,
//									'crewonboard' : $scope.julyCrewOnboard,
//									'noexposuredays' : $scope.julyExposureDays,
//									'noexposurehours' : $scope.julyExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("augMonth").value,
//									'crewonboard' : $scope.augCrewOnboard,
//									'noexposuredays' : $scope.augExposureDays,
//									'noexposurehours' : $scope.augExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("sepMonth").value,
//									'crewonboard' : $scope.sepCrewOnboard,
//									'noexposuredays' : $scope.sepExposureDays,
//									'noexposurehours' : $scope.sepExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("octMonth").value,
//									'crewonboard' : $scope.octCrewOnboard,
//									'noexposuredays' : $scope.octExposureDays,
//									'noexposurehours' : $scope.octExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("novMonth").value,
//									'crewonboard' : $scope.novCrewOnboard,
//									'noexposuredays' : $scope.novExposureDays,
//									'noexposurehours' : $scope.novExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								},
//								{
//									'detailno' : $scope.qshecrewmonthdetail_detailno,
//									'qsheid' : $scope.qsheid,
//									'month' : document
//											.getElementById("decMonth").value,
//									'crewonboard' : $scope.decCrewOnboard,
//									'noexposuredays' : $scope.decExposureDays,
//									'noexposurehours' : $scope.decExposureHours,
//									'isinternationdateline' : $scope.isinternationdateline
//								} ];
						form_qsheCategoryInjury = {
							'detailno' : $scope.qshecategoryinjury_detailno,
							'qsheid' : $scope.qsheid,
							'fatalcount' : $scope.fatalcount,
							'ptdcount' : $scope.ptdcount,
							'ppdcount' : $scope.ppdcount,
							'lwccount' : $scope.lwccount,
							'rwccount' : $scope.rwccount,
							'mtccount' : $scope.mtccount,
							'faccount' : $scope.faccount
						};
						form_qsheEnvironmentalDetail = {
							'detailno' : $scope.qsheenvironmentaldetail_detailno,
							'qsheid' : $scope.qsheid,
							'plasticcurgarbage' : $scope.plasticcurgarbage,
							'plasticsemigarbage' : $scope.plasticsemigarbage,
							'othercurgarbage' : $scope.othercurgarbage,
							'othersemigarbage' : $scope.othersemigarbage,
							'foodcurgarbage' : $scope.foodcurgarbage,
							'foodsemigarbage' : $scope.foodsemigarbage,
							'amtcurgarbage' : $scope.amtcurgarbage,
							'amtsemigarbage' : $scope.amtsemigarbage
						};
						
						
						console.log(form_qsheMonthlyDetail,"form_qsheMonthlyDetailform_qsheMonthlyDetail");
						console.log(form_qsheSemiAnnualDetail,"form_qsheSemiAnnualDetailform_qsheSemiAnnualDetail");
						Connectivity.IsOk().then(function(response){
							$http({
								url : "/qshe-report-composite-submission/",
								dataType : 'json',
								method : 'POST',
								data : {
									qsheFeedbackMaster : form_qsheFeedbackMaster,
									qsheMonthlyDetailList : form_qsheMonthlyDetail,
									qsheSemiAnnualDetailList : form_qsheSemiAnnualDetail,
									qsheShipBoardReview : form_qsheShipBoardReview,
									qsheSemiAnnualMaintenance : form_qsheSemiAnnualMaintenance,
									qsheSemiAnnualSafety : form_qsheSemiAnnualSafety,
									qsheCrewMonthDetailList : form_qsheCrewMonthDetail,
									qsheCategoryInjury : form_qsheCategoryInjury,
									qsheEnvironmentalDetail : form_qsheEnvironmentalDetail,
									stageid : $scope.stageid,
									formstatus : $scope.formStatus,
									remarks:$scope.remarks, 
								},
								headers : {
									"Content-Type" : "application/json"
								}

							}).then(function(response) {								
								$scope.geterrormessages=response.data.message;						
				                $scope.geterrorstatus=response.data.errorstatus;
				                $scope.geterrorstatuscode=response.data.status; 
											if(response.data.status==0){
												$scope.newDisabled = false;
												$scope.wrkflowstatus=response.data.data[0].qsheWfHistory;
												$scope.qsherefid=response.data.data[0].refernceid;
												$rootScope.showScreenOverlay = false;
												toaster.success({title: "Information", body:response.data.successMessage});	
												if (buttonValue != 'Save'){
													$scope.actionFormHide=true;						
													}																										   			
													var sendDate = "";
													if($scope.formStatus != "INT"){
														sendDate = new Date();
													}													
												
													var masterReviewDone = document
													.getElementsByClassName("master-review-done")[0].value;
											var masterReviewDue = document
													.getElementsByClassName("master-review-due")[0].value;

											var safetyMeetingDone = document
													.getElementsByClassName("safety-meeting-done")[0].value;
											var safetyMeetingDue = document
													.getElementsByClassName("safety-meeting-due")[0].value;

											var welfareMeetingDone = document
													.getElementsByClassName("welfare-meeting-done")[0].value;
											var welfareMeetingDue = document
													.getElementsByClassName("welfare-meeting-due")[0].value;
													
											}else{
												$rootScope.showScreenOverlay = false;
												if(response.data.exceptionDetail!=null){
													$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;
												}							
												$scope.errordetails=response.data.exceptionDetail;
							                	$scope.showexception=response.data.showerrormessage		                								
												$scope.newDisabled = false;												
												$scope.dataerror = response.data.message;
												
											}
										
									});
			    		}, function(error){
							  $scope.dialog.open();
							  $scope.dataerror = "Server not reached";
			    		});
						
						//												,
//								function errorCallback(response) {
//									$scope.dataSaveStatus = "Data couldn't be saved. Please enter the required fields";
//								};

							

					}else{
						$scope.actionFormHide = false;
						$scope.newDisabled = false;
							$scope.reportMonthError = true;
							 toaster.error({
				                 title: "Information",
				                 body: "Data couldn't be sent. Please enter the required fields"
				             });
					}
					}
					
					$scope.reportMonthError = false;
					
					$scope.saveValidation = function(){
						if(($scope.reportmonth=='null') || ($scope.reportmonth==undefined)){
							$scope.reportmontherror="This field is required"
							$scope.reportMonthError = true;							
						}else{
							$scope.reportmontherror=""
							$scope.reportMonthError = false;
							
						}
						
						
						
					}
					
					$scope.populatePortName = function() {
						// Port name
						Connectivity.IsOk().then(function(response){
							$http({
								method : 'POST',
								url : "/get-active-ports-on-portCode/",
								data : {
									"portCode" : $scope.placeinspection
								}
							}).then(function(response) {
								response = response.data;
								// console.log("port data = ", response.portName);
								$scope.portName = response.portName;
							});
			    		}, function(error){
							  $scope.dialog.open();
							  $scope.dataerror = "Server not reached";
			    		});
					}

					
					$scope.populateinternaltypeofinspection = function(inspectioncode) {
						// Port name
						Connectivity.IsOk().then(function(response){
							$http({
								method : 'POST',
								url : "/get-qshe-internal-inspection-list/",
								data : {
									"inspectioncode" : inspectioncode
								}
							}).then(function(response) {
								$scope.internalInspections = response.data;
								 console.log("inspection data = ", $scope.internalInspections);
							});
			    		}, function(error){
							  $scope.dialog.open();
							  $scope.dataerror = "Server not reached";
			    		});
					}
					
					
					$scope.$watch('reportmonth', function() {	
						console.log($scope.reportmonth,"reportmonth watchhhhhh")
						if($scope.reportmonth!='null'){
							console.log($scope.reportmonth,"$scope.reportmonth")
						if($scope.reportmonth==1){
							$scope.totaldaysofmonth="January";
						}else if($scope.reportmonth==2){
							$scope.totaldaysofmonth="February";
						}else if($scope.reportmonth==3){
							$scope.totaldaysofmonth="March";
						}else if ($scope.reportmonth==4){
							$scope.totaldaysofmonth="April";
						}else if($scope.reportmonth==5){
							$scope.totaldaysofmonth="May";
						}else if($scope.reportmonth==6){
							$scope.totaldaysofmonth="June";
						}else if($scope.reportmonth==7){
							$scope.totaldaysofmonth="July";
						}else if($scope.reportmonth==8){
							$scope.totaldaysofmonth="August";
						}else if($scope.reportmonth==9){
							$scope.totaldaysofmonth="September";
						}else if($scope.reportmonth==10){
							$scope.totaldaysofmonth="October";
						}else if($scope.reportmonth==11){
							$scope.totaldaysofmonth="November";
						}else if($scope.reportmonth==12){
							$scope.totaldaysofmonth="December";
						}	
						}
		            });
//					
					
					

				
					
					 $scope.atPort = function() {
					       $scope.portName = "";
					    }
					
					$scope.changeCheckBox = function(){	
						if($scope.reportmonth!='null'){							
						if($scope.reportmonth <= 6){
							$scope.semiYear = 'firsthalf_vesselInspection';
						}else{
							$scope.semiYear = 'secondhalf_vesselInspection';
						}
					}
//						console.log($scope.reportmonth,$scope.reportyear,"dauyyyyyyyyyyyyyyyyy")
//						if($scope.reportmonth!='null' && ($scope.reportyear!=null && $scope.reportyear!=undefined && $scope.reportyear!="" ) )
//						$scope.populateExternalInspectionIntoQSHEMonthlyDetail();
//						
						$scope.inspectiondate();
				}
					$scope.showReportMonthError = "";
					
					
					
					
					
					
                     $scope.populateExternalInspectionIntoQSHEMonthlyDetailforview = function() {
						
						$scope.saveValidation()
						if( $scope.reportMonthError=== false){
							
							$scope.showbuttonvalidation=true;
						if($scope.reportmonth <= 6){
							$scope.semiYearVesselInspection = 'firsthalf_vesselInspection';
						}else{
							$scope.semiYearVesselInspection = 'secondhalf_vesselInspection';
						}
						
						var d = new Date($scope.reportyear);
						
						$scope.reportyear =d;
						formdata_qshe = {
								'qsheid' : $scope.qsheid,
								'reportmonth' : $scope.reportmonth,
								"reportyear": parseInt($scope.reportyear.getFullYear()),
							};
						
						
						
						Connectivity.IsOk().then(function(response){
							$http({
								method : 'POST',
								url : "/get-monthly-inspection-data-for-table-validation-view/",
								data : formdata_qshe,
							}).then(function successCallBack(response){
								$rootScope.showScreenOverlay = true;
								$scope.closepopupvalidation();
								console.log(response , 'response get-monthly-inspection-data-for-table-validation ')								
								$scope.geterrormessages=response.data.message;	
                               if($scope.geterrormessages==null){
								$scope.hideshipdiv=false;
							$scope.actionFormHide=false;
							$rootScope.showScreenOverlay = false;
                               }
                                $scope.geterrorstatus=response.data.errorstatus;
                                $scope.geterrorstatuscode=response.data.status;                
                                $scope.dataerror =response.data.message;  
								if(response.data.status === 0){
									console.log(response.data.data,"ddsdsdsdsd")
									console.log(response.data.data[0].qsheCrewMonthDetail.semitotalexposurehours,"fffffffffffff")
									$scope.currentYear = response.data.data[0].qsheFeedbackMasterList;
									$scope.currentInspections = response.data.data[0].qsheMonthlyDetail;
									$scope.saftymeetingdate = response.data.data[0].safetyMeetingMaster;
									$scope.nearmisscurcount = response.data.data[0].nearMissMaster.length;
									$scope.nearmisssemicount = response.data.data[0].nearMissMasterSemi.length;
									$scope.accidentreportdate = response.data.data[0].accidentReportMaster;
									$scope.totalsemiannualhour = response.data.data[0].qsheCrewMonthDetail.semitotalexposurehours;
									//$scope.accidentsemicount = response.data.data[0].accidentReportMasterSemi.length;
									console.log($scope.totalsemiannualhour, ' totalsemiannualhour>>>>>>>>>>>>>>>>>>>>>>>>>>   viewwwwwwwww')
									console.log($scope.currentInspections.length , ' $scope.currentInspections.length>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
									console.log( $scope.internalInspectionsList.length , ' $scope.internalInspectionsList.length>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
									for (var i = 0; i < $scope.currentInspections.length; i++) {
										for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
											if ($scope.currentInspections[i].inspectiontype == "internal"
													&& $scope.currentInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
												$scope.currentInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
										}
										for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
											if ($scope.currentInspections[i].inspectiontype == "external"
													&& $scope.currentInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
												$scope.currentInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
										}
									}
									
									console.log($scope.accidentreportdate,"accidentreportdate.reportdate")
									if($scope.accidentreportdate.reportdate!=null){
										console.log($scope.accidentreportdate.reportdate,"accidentreportdate.reportdate")
						    			var accdate=new Date($scope.accidentreportdate.reportdate);
						    			$scope.lastaccdate=(accdate.getMonth()+1+'/'+accdate.getDate()+"/"+accdate.getFullYear());	
						    		}
									
//									var someDate = new Date();
//									someDate.setDate($scope.safetylastdate.getDate() + 30); 
//									$scope.safetynextdue = new Date(someDate);
									
									if($scope.saftymeetingdate.meetingdate!=null){
										console.log($scope.saftymeetingdate.meetingdate,"$scope.qsheShipBoardReview.safetylastdate")
						    			var safetylastdate=new Date($scope.saftymeetingdate.meetingdate);
						    			$scope.safetylastdate=(safetylastdate.getMonth()+1+'/'+safetylastdate.getDate()+"/"+safetylastdate.getFullYear());	
						    		}else{
						    			//console.log($scope.qsheShipBoardReview.safetylastdate,"$scope.qsheShipBoardReview.safetylastdate elseeeeeee")
						    			var safetylastdate="";			    			
						    			//$scope.safetylastdate=(safetylastdate.getMonth()+1+'/'+safetylastdate.getDate()+"/"+safetylastdate.getFullYear());
						    		}
									
//									console.log($scope.safetylastdate,"$scope.safetylastdate$scope.safetylastdate")
//									var safetynextduedate = new Date($scope.safetylastdate);
//									 safetynextduedate = (safetynextduedate.getMonth() + 1 + '/' + safetynextduedate.getDate() + "/" + safetynextduedate.getFullYear());
//									$scope.safetynextdue=safetynextduedate;
									
//									if($scope.accidentsemicount.reportdate!=null && $scope.accidentsemicount.reportdate!=undefined){
//									var buildDate = new Date($scope.accidentsemicount[0].reportdate);
//									var datedif =   new Date()-buildDate;
//									
//				                    buildDate = (buildDate.getMonth() + 1 + '/' + buildDate.getDate() + "/" + buildDate.getFullYear());
//									$scope.lastaccdate = buildDate;
//									
//									var diff_date = Math.round((new Date() - $scope.lastaccdate)/(1000*60*60*24));
//									console.log(diff_date ,'diff_date >>>>>>>>>>>>>>>>>>>>>> ')
//									$scope.operatingDaysSemiYear =   $scope.accidentsemicount[0].datedif;
//									}
						
//									$scope.populateSemiAnnualExternalInspection();
									$scope.semiAnnualInspections = response.data.data[0].qsheSemiAnnualDetail;
									console.log($scope.semiAnnualInspections , ' << $scope.semiAnnualInspections get-qsheSemiAnnualDetail-form-data-by-no>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
									// console.log("semiAnnualInspections"
									// +
									// $scope.semiAnnualInspections)
									for (var i = 0; i < $scope.semiAnnualInspections.length; i++) {
										for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
											if ($scope.semiAnnualInspections[i].inspectiontype == "internal"
													&& $scope.semiAnnualInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
												$scope.semiAnnualInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
										}
										for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
											if ($scope.semiAnnualInspections[i].inspectiontype == "external"
													&& $scope.semiAnnualInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
												$scope.semiAnnualInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
										}
										
									}
									
//									for(var i=0;i<$scope.semiAnnualInspections.length;i++){								
//										if($scope.qsheMonthlyDetail_inspectioncode==$scope.semiAnnualInspections[i].inspectioncode){								
//											$scope.semiAnnualInspections[i].qsheid=$scope.qsheid;
//											$scope.semiAnnualInspections[i].inspectioncode=$scope.qsheMonthlyDetail_inspectioncode;
//											$scope.semiAnnualInspections[i].inspectionname=$scope.inspectName;
//											$scope.semiAnnualInspections[i].inspectiontype='internal'
//											$scope.semiAnnualInspections[i].totalnccount=parseInt($scope.nccount)+$scope.semiAnnualInspections[i].totalnccount,
//											$scope.semiAnnualInspections[i].totalobsdefcount=parseInt($scope.obsdefcount)+$scope.semiAnnualInspections[i].totalobsdefcount,
//											$scope.semiAnnualInspections[i].withoutncobsdefcount= parseInt($scope.withoutncobsdef)+$scope.semiAnnualInspections[i].withoutncobsdefcount,
//											$scope.semiAnnualInspections[i].totalinspeccount=1+$scope.semiAnnualInspections[i].totalinspeccount
//											console.log($scope.semiAnnualInspections[i].openobsdefcount,"$scope.semiAnnualInspections[i].openobsdefcount$scope.semiAnnualInspections[i].openobsdefcount")
//											
//												$scope.semiAnnualInspections[i].openobsdefcount=$scope.semiAnnualInspections[i].openobsdefcount
//											
//												$scope.semiAnnualInspections[i].opennccount=$scope.semiAnnualInspections[i].opennccount
//											
//																
//										}
//										}
									$rootScope.showScreenOverlay = false;
								}else{
									$scope.errordetails=response.data.exceptionDetail;
				                	$scope.showexception=response.data.showerrormessage
				                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
									$scope.dataerror = [response.data.message[0]]; 	
								}
															
//								$scope.currentYear = response.data;
//								console.log($scope.currentYear.length , '$scope.currentYear.length >>>>>>>>>>>>>>>>>>>>>>> @@@@@############ ')
//
//								if($scope.currentYear.length <= 0){
//									
//									$scope.showReportMonthError = "";
//								
////								formdata_qshe = {
////									'qsheid' : $scope.qsheid,
////									'reportmonth' : $scope.reportmonth
////								};
//								$http({
//									method : 'POST',
//									url : "/get-monthly-inspection-data-for-table/",
//									data : formdata_qshe,
//									headers : {
//										"Content-Type" : "application/json"
//									}
//								}).then(function(response) {
//													$http({
//																method : 'POST',
//																url : "/get-qsheMonthlydetail-form-data-by-no/",
//																data : {
//																	"qsheid" : qsheid
//																}
//															}).then(function(response) {
//																		response = response.data;
//																		$scope.currentInspections = response;
//																		for (var i = 0; i < $scope.currentInspections.length; i++) {
//																			for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
//																				if ($scope.currentInspections[i].inspectiontype == "internal"
//																						&& $scope.currentInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
//																					$scope.currentInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
//																			}
//																			for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
//																				if ($scope.currentInspections[i].inspectiontype == "external"
//																						&& $scope.currentInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
//																					$scope.currentInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
//																			}
//																			// console.log("inspectionname
//																			// = " +
//																			// $scope.currentInspections[i].inspectionname);
//																			// console.log("inspectionCode
//																			// = " +
//																			// $scope.currentInspections[i].inspectioncode);
//																		}
//																	});
//												});
//								
//								$http({
//									url : '/get-safety-health-meeting-date/',
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.safetylastdate = new Date(meeting[0].meetingdate);
//									var someDate = new Date();
//									someDate.setDate($scope.safetylastdate.getDate() + 30); 
//									$scope.safetynextdue = new Date(someDate);
//								});
//								
//								$http({
//									url : '/get-near-miss-report-count/?month=' + $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.nearmisscurcount = meeting.length;
//								});
//								
//								$http({
//									url : '/get-near-miss-report-count-semi/?month='+ $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.nearmisssemicount = meeting.length;
//								});
//								
//								$http({
//									url : '/get-accident-report-count/?month=' + $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.accidentcurcount = meeting.length;
//								});
//								
//								$http({
//									url : '/get-accident-report-count-semi/?month=' + $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.accidentsemicount = meeting.length;
//									var buildDate = new Date(meeting[0].reportdate);
//									var datedif =   new Date()-buildDate;
//									
//				                    buildDate = (buildDate.getMonth() + 1 + '/' + buildDate.getDate() + "/" + buildDate.getFullYear());
//									$scope.lastaccdate = buildDate;
//									
//									var diff_date = Math.round((new Date() - $scope.lastaccdate)/(1000*60*60*24));
//									console.log(diff_date ,'diff_date >>>>>>>>>>>>>>>>>>>>>> ')
//									$scope.operatingDaysSemiYear =   meeting[0].datedif;
//								});
//								$scope.populateSemiAnnualExternalInspection();
//								}else{
//									$scope.showReportMonthError = "QSHEfeedback already exist for the selected report month";
//								}
							});
						}, function(error){
							  $scope.dialog.open();
							  $scope.dataerror = "Server not reached";
						});
												
					}else{
						$scope.reportMonthError = true;
					}
					}
					
					
					
					
					
                     $scope.deleteActionPerformed = function() {
                         Connectivity.IsOk().then(function(response) {
                             form_data = {
                                 'qsheid': $scope.qsheid,
                             };
                             $http({
                                 url: "/delete_qshefeedback_master/",
                                 dataType: 'json',
                                 method: 'POST',
                                 data: form_data,
                                 headers: {
                                     "Content-Type": "application/json"
                                 }
                             }).then(function(response) {
                                 $scope.geterrormessages = response.data.message;
                                 $scope.geterrorstatus = response.data.errorstatus;
                                 $scope.geterrorstatuscode = response.data.status;
                                 if (response.data.status == 0 && response.data.length != 0) {
                                     $scope.wrkflowstatus = response.data.data;
                                     toaster.success({
                                         title: "Information",
                                         body: response.data.successMessage
                                     });
                                     $scope.deleteAction = false;
                                     $scope.actionFormHide = true;
                                     $rootScope.showScreenOverlay = false;
                                 } else {
                                     if (response.data.exceptionDetail != null) {
                                         $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                                     }
                                     $rootScope.showScreenOverlay = false;
                                     $scope.errordetails = response.data.exceptionDetail;
                                     $scope.showexception = response.data.showerrormessage
                                     $scope.dataerror = response.data.message;
                                 }

                             })
                         }, function(error) {
                             $scope.dataerror1 = "Server not reached";
                             $scope.dialog.open();
                         })
                     }
					
					
					
					
					
					
					
					
					
					$scope.populateExternalInspectionIntoQSHEMonthlyDetail = function() {
						
						$scope.saveValidation()
						if( $scope.reportMonthError=== false){
							$rootScope.showScreenOverlay = true;
							$scope.showbuttonvalidation=true;
						if($scope.reportmonth <= 6){
							$scope.semiYearVesselInspection = 'firsthalf_vesselInspection';
						}else{
							$scope.semiYearVesselInspection = 'secondhalf_vesselInspection';
						}
						
						var d = new Date($scope.reportyear);
						
						$scope.reportyear =d;
						formdata_qshe = {
								'qsheid' : $scope.qsheid,
								'reportmonth' : $scope.reportmonth,
								"reportyear": parseInt($scope.reportyear.getFullYear()),
							};
						
						
						
						Connectivity.IsOk().then(function(response){
							$http({
								method : 'POST',
								url : "/get-monthly-inspection-data-for-table-validation/",
								data : formdata_qshe,
							}).then(function successCallBack(response){
								
								console.log(response , 'response get-monthly-inspection-data-for-table-validation ')								
								$scope.geterrormessages=response.data.message;	
								console.log($scope.geterrormessages,"mmmmmmmmmmmmmmmmmm")							
								
								if(response.data.successMessage=="show form validation"){
									$scope.safetyvalidation=$scope.geterrormessages[0].safetyMeetingMaster;
									$scope.nearmissvalidation=$scope.geterrormessages[0].nearMissMaster;
									$scope.nearmisssemivalidation=$scope.geterrormessages[0].nearMissMasterSemi;
									$scope.accidentvalidation=$scope.geterrormessages[0].accidentReportMaster;
									$scope.accidentsemivalidation=$scope.geterrormessages[0].accidentReportMasterSemi;
									$scope.Extinspectmastervalidation=$scope.geterrormessages[0].Extinspectmaster;
									console.log(response.data.successMessage,"response.data.successMessage")
									angular.element("#formvalidation").modal('show');
									$rootScope.showScreenOverlay = false;
								}								
                               if($scope.geterrormessages==null){
								$scope.hideshipdiv=false;
							$scope.actionFormHide=false;
							$rootScope.showScreenOverlay = false;
                               }
                                $scope.geterrorstatus=response.data.errorstatus;
                                $scope.geterrorstatuscode=response.data.status;                
                                $scope.dataerror =response.data.message;  
								if(response.data.status === 0 ){
									$scope.currentYear = response.data.data[0].qsheFeedbackMasterList;
									$scope.currentInspections = response.data.data[0].qsheMonthlyDetail;
									$scope.saftymeetingdate = response.data.data[0].safetyMeetingMaster;
									console.log($scope.saftymeetingdate.meetingdate,"safetyMeetingMaster meeting")
									$scope.nearmisscurcount = response.data.data[0].nearMissMaster.length;
									$scope.nearmisssemicount = response.data.data[0].nearMissMasterSemi.length;
									$scope.accidentreportdate = response.data.data[0].accidentReportMaster;
									$scope.totalsemiannualhour = response.data.data[0].qsheCrewMonthDetail.semitotalexposurehours;
									//$scope.accidentsemicount = response.data.data[0].accidentReportMasterSemi.length;
									console.log($scope.totalsemiannualhour, ' totalsemiannualhour>>>>>>>>>>>>>>>>>>>>>>>>>> ')
									console.log( $scope.internalInspectionsList.length , ' $scope.internalInspectionsList.length>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
									for (var i = 0; i < $scope.currentInspections.length; i++) {
										for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
											if ($scope.currentInspections[i].inspectiontype == "internal"
													&& $scope.currentInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
												$scope.currentInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
										}
										for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
											if ($scope.currentInspections[i].inspectiontype == "external"
													&& $scope.currentInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
												$scope.currentInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
										}
									}
									
									if($scope.accidentreportdate.reportdate!=null){
										console.log($scope.accidentreportdate.reportdate,"accidentreportdate.reportdate")
						    			var accdate=new Date($scope.accidentreportdate.reportdate);
						    			$scope.lastaccdate=(accdate.getMonth()+1+'/'+accdate.getDate()+"/"+accdate.getFullYear());	
						    		}
									
									if($scope.saftymeetingdate.meetingdate!=null){
										console.log($scope.saftymeetingdate.meetingdate,"$scope.qsheShipBoardReview.safetylastdate")
						    			var safetylastdate=new Date($scope.saftymeetingdate.meetingdate);
						    			$scope.safetylastdate=(safetylastdate.getMonth()+1+'/'+safetylastdate.getDate()+"/"+safetylastdate.getFullYear());	
						    		}
//									else{
//						    			console.log($scope.qsheShipBoardReview.safetylastdate,"$scope.qsheShipBoardReview.safetylastdate elseeeeeee")
//						    			var safetylastdate=new Date();			    			
//						    			$scope.safetylastdate=(safetylastdate.getMonth()+1+'/'+safetylastdate.getDate()+"/"+safetylastdate.getFullYear());
//						    		}
									
									
//									var someDate = new Date();
//									someDate.setDate($scope.safetylastdate.getDate() + 30); 
//									$scope.safetynextdue = new Date(someDate);
									
//									console.log($scope.safetylastdate,"$scope.safetylastdate$scope.safetylastdate")
//									var safetynextduedate = new Date($scope.safetylastdate);
//									 safetynextduedate = (safetynextduedate.getMonth() + 1 + '/' + safetynextduedate.getDate() + "/" + safetynextduedate.getFullYear());
//									$scope.safetynextdue=safetynextduedate;
									
//									if($scope.accidentsemicount.reportdate!=null && $scope.accidentsemicount.reportdate!=undefined){
//									var buildDate = new Date($scope.accidentsemicount[0].reportdate);
//									var datedif =   new Date()-buildDate;
//									
//				                    buildDate = (buildDate.getMonth() + 1 + '/' + buildDate.getDate() + "/" + buildDate.getFullYear());
//									$scope.lastaccdate = buildDate;
//									
//									var diff_date = Math.round((new Date() - $scope.lastaccdate)/(1000*60*60*24));
//									console.log(diff_date ,'diff_date >>>>>>>>>>>>>>>>>>>>>> ')
//									$scope.operatingDaysSemiYear =   $scope.accidentsemicount[0].datedif;
//									}
						
//									$scope.populateSemiAnnualExternalInspection();
									$scope.semiAnnualInspections = response.data.data[0].qsheSemiAnnualDetail;
									console.log($scope.semiAnnualInspections , ' << $scope.semiAnnualInspections get-qsheSemiAnnualDetail-form-data-by-no>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
									// console.log("semiAnnualInspections"
									// +
									// $scope.semiAnnualInspections)
									for (var i = 0; i < $scope.semiAnnualInspections.length; i++) {
										for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
											if ($scope.semiAnnualInspections[i].inspectiontype == "internal"
													&& $scope.semiAnnualInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
												$scope.semiAnnualInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
										}
										for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
											if ($scope.semiAnnualInspections[i].inspectiontype == "external"
													&& $scope.semiAnnualInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
												$scope.semiAnnualInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
										}
										
									}
									
//									for(var i=0;i<$scope.semiAnnualInspections.length;i++){								
//										if($scope.qsheMonthlyDetail_inspectioncode==$scope.semiAnnualInspections[i].inspectioncode){								
//											$scope.semiAnnualInspections[i].qsheid=$scope.qsheid;
//											$scope.semiAnnualInspections[i].inspectioncode=$scope.qsheMonthlyDetail_inspectioncode;
//											$scope.semiAnnualInspections[i].inspectionname=$scope.inspectName;
//											$scope.semiAnnualInspections[i].inspectiontype='internal'
//											$scope.semiAnnualInspections[i].totalnccount=parseInt($scope.nccount)+$scope.semiAnnualInspections[i].totalnccount,
//											$scope.semiAnnualInspections[i].totalobsdefcount=parseInt($scope.obsdefcount)+$scope.semiAnnualInspections[i].totalobsdefcount,
//											$scope.semiAnnualInspections[i].withoutncobsdefcount= parseInt($scope.withoutncobsdef)+$scope.semiAnnualInspections[i].withoutncobsdefcount,
//											$scope.semiAnnualInspections[i].totalinspeccount=1+$scope.semiAnnualInspections[i].totalinspeccount
//											console.log($scope.semiAnnualInspections[i].openobsdefcount,"$scope.semiAnnualInspections[i].openobsdefcount$scope.semiAnnualInspections[i].openobsdefcount")
//											
//												$scope.semiAnnualInspections[i].openobsdefcount=$scope.semiAnnualInspections[i].openobsdefcount
//											
//												$scope.semiAnnualInspections[i].opennccount=$scope.semiAnnualInspections[i].opennccount
//											
//																
//										}
//										}
									$rootScope.showScreenOverlay = false;
								}else{
									$scope.errordetails=response.data.exceptionDetail;
				                	$scope.showexception=response.data.showerrormessage
				                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
									$scope.dataerror = [response.data.message[0]]; 	
								}
								$rootScope.showScreenOverlay = false;
                                							
//								$scope.currentYear = response.data;
//								console.log($scope.currentYear.length , '$scope.currentYear.length >>>>>>>>>>>>>>>>>>>>>>> @@@@@############ ')
//
//								if($scope.currentYear.length <= 0){
//									
//									$scope.showReportMonthError = "";
//								
////								formdata_qshe = {
////									'qsheid' : $scope.qsheid,
////									'reportmonth' : $scope.reportmonth
////								};
//								$http({
//									method : 'POST',
//									url : "/get-monthly-inspection-data-for-table/",
//									data : formdata_qshe,
//									headers : {
//										"Content-Type" : "application/json"
//									}
//								}).then(function(response) {
//													$http({
//																method : 'POST',
//																url : "/get-qsheMonthlydetail-form-data-by-no/",
//																data : {
//																	"qsheid" : qsheid
//																}
//															}).then(function(response) {
//																		response = response.data;
//																		$scope.currentInspections = response;
//																		for (var i = 0; i < $scope.currentInspections.length; i++) {
//																			for (var k = 0; k < $scope.internalInspectionsList.length; k++) {
//																				if ($scope.currentInspections[i].inspectiontype == "internal"
//																						&& $scope.currentInspections[i].inspectioncode == $scope.internalInspectionsList[k].key)
//																					$scope.currentInspections[i].inspectionname = $scope.internalInspectionsList[k].value;
//																			}
//																			for (var k = 0; k < $scope.externalInspectionsList.length; k++) {
//																				if ($scope.currentInspections[i].inspectiontype == "external"
//																						&& $scope.currentInspections[i].inspectioncode == $scope.externalInspectionsList[k].key)
//																					$scope.currentInspections[i].inspectionname = $scope.externalInspectionsList[k].value;
//																			}
//																			// console.log("inspectionname
//																			// = " +
//																			// $scope.currentInspections[i].inspectionname);
//																			// console.log("inspectionCode
//																			// = " +
//																			// $scope.currentInspections[i].inspectioncode);
//																		}
//																	});
//												});
//								
//								$http({
//									url : '/get-safety-health-meeting-date/',
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.safetylastdate = new Date(meeting[0].meetingdate);
//									var someDate = new Date();
//									someDate.setDate($scope.safetylastdate.getDate() + 30); 
//									$scope.safetynextdue = new Date(someDate);
//								});
//								
//								$http({
//									url : '/get-near-miss-report-count/?month=' + $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.nearmisscurcount = meeting.length;
//								});
//								
//								$http({
//									url : '/get-near-miss-report-count-semi/?month='+ $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.nearmisssemicount = meeting.length;
//								});
//								
//								$http({
//									url : '/get-accident-report-count/?month=' + $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.accidentcurcount = meeting.length;
//								});
//								
//								$http({
//									url : '/get-accident-report-count-semi/?month=' + $scope.reportmonth,
//									method : 'GET'
//								}).then(function(response) {
//									var meeting = response.data;
//									$scope.accidentsemicount = meeting.length;
//									var buildDate = new Date(meeting[0].reportdate);
//									var datedif =   new Date()-buildDate;
//									
//				                    buildDate = (buildDate.getMonth() + 1 + '/' + buildDate.getDate() + "/" + buildDate.getFullYear());
//									$scope.lastaccdate = buildDate;
//									
//									var diff_date = Math.round((new Date() - $scope.lastaccdate)/(1000*60*60*24));
//									console.log(diff_date ,'diff_date >>>>>>>>>>>>>>>>>>>>>> ')
//									$scope.operatingDaysSemiYear =   meeting[0].datedif;
//								});
//								$scope.populateSemiAnnualExternalInspection();
//								}else{
//									$scope.showReportMonthError = "QSHEfeedback already exist for the selected report month";
//								}
							});
							$rootScope.showScreenOverlay = false;
						}, function(error){
							  $scope.dialog.open();
							  $scope.dataerror = "Server not reached";
						});
												
					}else{
						
						$scope.reportMonthError = true;
					}
					}

					$scope.validation = function() {
						var errorMessageText = "Please enter the value";
						var errorMessageOther = "Please select at least one option";
						
						if($scope.currentInspections.length==0){
							$scope.addCurVes = errorMessageText;
							$scope.reportMonthError = true;
							firstback();
						}else{
							$scope.reportMonthError = false;
							$scope.addCurVes = '';
						}
						if($scope.semiAnnualInspections.length==0){
							$scope.semiAnnualInspectionserrorMessageText = errorMessageText;
							$scope.reportMonthError = true;
							firstnext();
						}else{
							$scope.reportMonthError = false;
							$scope.semiAnnualInspectionserrorMessageText = "";
						}
						
						if($scope.pmscurmoncount!="" && !$scope.pmscurmoncount){
							$scope.pmscurmoncounterrorMessageText = errorMessageText;
							$scope.reportMonthError = true;
							thirdnext();
						}else{
							$scope.reportMonthError = false;
							$scope.pmscurmoncounterrorMessageText = "";
						}
						if($scope.pmstotmoncount!="" && !$scope.pmstotmoncount){
							$scope.pmstotmoncounterrorMessageText = errorMessageText;
							$scope.reportMonthError = true;
							thirdnext();
							
						}else{
							$scope.reportMonthError = false;
							$scope.pmstotmoncounterrorMessageText = "";
						}
						if ($scope.qsheCrewMonthDetailobj[0].crewonboard === undefined || $scope.qsheCrewMonthDetailobj[0].crewonboard === "" || $scope.qsheCrewMonthDetailobj[0].crewonboard === null) {
				            $scope.qsheCrewMonthDetailobjerrortext = errorMessageText;
				            $scope.reportMonthError = true;
				            fourthnext()
				        } else {
				            $scope.qsheCrewMonthDetailobjerrortext = '';
				            $scope.reportMonthError = false;
				        }
						if ($scope.qsheCrewMonthDetailobj[0].noexposuredays === undefined || $scope.qsheCrewMonthDetailobj[0].noexposuredays === "" || $scope.qsheCrewMonthDetailobj[0].noexposuredays === null) {
				            $scope.qsheCrewMonthDetailobjerrortext = errorMessageText;
				            $scope.reportMonthError = true;
				            fourthnext()
				        } else {
				            $scope.qsheCrewMonthDetailobjerrortext = '';
				            $scope.reportMonthError = false;
				        }
						console.log(!$scope.othercurgarbage,"$scope.othercurgarbage$scope.othercurgarbage$scope.othercurgarbage")
						
						if( !$scope.othercurgarbage  || !$scope.othersemigarbage ||  !$scope.foodcurgarbage ||  !$scope.foodsemigarbage
								||  !$scope.amtcurgarbage ||  !$scope.amtsemigarbage ||  !$scope.plasticcurgarbage
								||  !$scope.plasticsemigarbage ){
							$scope.SemiAnnualerrorMessageText = errorMessageText;
							$scope.reportMonthError = true;
						}else{
							$scope.reportMonthError = false;
							$scope.SemiAnnualerrorMessageText = "";
						}
						
						
//						if($scope.qsheCrewMonthDetailobj.length==0){
//							$scope.qsheCrewMonthDetailobjerrortext = errorMessageText;
//							$scope.reportMonthError = true;
//						}else{
//							$scope.reportMonthError = false;
//							$scope.qsheCrewMonthDetailobjerrortext = '';
//						}
//						if (!$scope.placeinspection || !$scope.obsdefcount
//								|| !$scope.dateinspection || !$scope.nccount
//								|| !$scope.opennccount
//								|| !$scope.openobsdefcount
//								|| !$scope.reviewlastdate
//								|| !$scope.reviewnextdue
//								|| !$scope.masterRemarks
//								|| !$scope.safetylastdate
//								|| !$scope.safetynextdue
//								|| !$scope.safetyremarks
//								|| !$scope.welfarelastdate
//								|| !$scope.welfarenextdue
//								|| !$scope.welfareremarks
//								|| !$scope.pmscurmoncount
//								|| !$scope.pmstotmoncount
//								|| !$scope.injurycurcount
//								|| !$scope.injurysemicount
//								|| !$scope.oilcurcount || !$scope.oilsemicount
//								|| !$scope.stoppagecurcount
//								|| !$scope.stoppagesemicount
//								|| !$scope.otherscurcount
//								|| !$scope.otherssemicount
//								|| !$scope.mainengcurhrs
//								|| !$scope.mainengsemihrs
//								|| !$scope.cargowrkcurhrs
//								|| !$scope.cargowrksemihrs
//								|| !$scope.janCrewOnboard
//								|| !$scope.janExposureDays
//								|| !$scope.febCrewOnboard
//								|| !$scope.febExposureDays
//								|| !$scope.marCrewOnboard
//								|| !$scope.marExposureDays
//								|| !$scope.aprCrewOnboard
//								|| !$scope.aprExposureDays
//								|| !$scope.mayCrewOnboard
//								|| !$scope.mayExposureDays
//								|| !$scope.junCrewOnboard
//								|| !$scope.junExposureDays
//								|| !$scope.julyCrewOnboard
//								|| !$scope.julyExposureDays
//								|| !$scope.augCrewOnboard
//								|| !$scope.augExposureDays
//								|| !$scope.sepCrewOnboard
//								|| !$scope.sepExposureDays
//								|| !$scope.octCrewOnboard
//								|| !$scope.octExposureDays
//								|| !$scope.novCrewOnboard
//								|| !$scope.novExposureDays
//								|| !$scope.decCrewOnboard
//								|| !$scope.decExposureDays
//								|| !$scope.isinternationdateline
//								|| !$scope.fatalcount || !$scope.ptdcount
//								|| !$scope.ppdcount || !$scope.lwccount
//								|| !$scope.rwccount || !$scope.mtccount
//								|| !$scope.faccount || !$scope.othercurgarbage
//								|| !$scope.othersemigarbage
//								|| !$scope.foodcurgarbage
//								|| !$scope.foodsemigarbage
//								|| !$scope.amtcurgarbage
//								|| !$scope.amtsemigarbage
//								|| !$scope.plasticcurgarbage
//								|| !$scope.plasticsemigarbage){
//
//							$scope.errorMessageText = errorMessageText;
//						}
					}

					function validateForm() {
						var fields = [ "$scope.plasticcurgarbage",
								"$scope.plasticsemigarbage" ]

						var i, l = fields.length;
						var fieldname;
						for (i = 0; i < l; i++) {
							fieldname = fields[i];
							if (document.forms["register"][fieldname].value === "") {
								alert(fieldname + " can not be empty");
								return false;
							}
						}
						return true;
					}

					$scope.portnameList = [];
					$scope.ports = [];

					$scope.btnPortCodeActionPerformed = function() {
						//console.log("Inside btnPortCodeActionPerformed");
						$scope.showPortModal = true;
						$scope.portnameList = [];
						$scope.ports = [];
						$http({
							method : 'POST',
							url : "/get-vessel-master-portnames/",
							data : $scope.placeinspection
						}).then(function(response) {
							$scope.ports = response.data;
							console.log("$scope.ports = " + $scope.ports);
							angular.forEach($scope.ports, function(value, key) {
								var portcode = value.portcode;
								var portname = value.portname;
								$scope.portnameList.push({
									"key" : portcode,
									"value" : portname
								});
							});
							//console.log("$scope.portnameList = " + $scope.portnameList);
						});

					}
					$scope.btnPortCodeFunction = function() {
						if ($scope.placeinspection.length !== 0) {
							$scope.btnPortCode = true;
						}
					}
					$scope.showPortModal = false;

					$scope.hide = function() {
						$scope.showPortModal = false;
					}

					$scope.setValue = function(arg1, arg2) {
						$scope.placeinspection = arg1;
						$scope.portName = arg2;
						$scope.hide();
					}
					
					
					// Export To Excel
				    $scope.exportexcel = function() {
				        $http({
				            method: 'POST',
				            url: "/QSHE-Export-excel/",
				            responseType: 'arraybuffer',
				            data : {
								"qsheid" : qsheid,
								"reportingMonth" : $scope.reportmonth,
								"semiyearvalue" : $scope.semiyearvalue,
								'reportdate' : new Date($scope.reportDate).toISOString(),
								'offset': new Date().getTimezoneOffset(),
							}

				        }).then(
				            function(response) {
				                var myBlob = new Blob([response.data], {
				                    type: "application/vnd.ms-excel"
				                });
				                var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
				                var anchor = document.createElement("a");
				                anchor.download = $scope.vesselname+"-"+"QsheReport"+"-"+$scope.qsheid+".xls";
				                anchor.href = blobURL;
				                anchor.click();

				            });
				    };
				    
				    
				    
				    // Export To PDF
				    $scope.saveAsPDFDocument = function() {
				    	
				    	 $http({
					            method: 'POST',
					            url: "/QSHE-Export-PDF/",
					            responseType: 'arraybuffer',
					            data : {
									"qsheid" : qsheid,
									"reportingMonth" : $scope.reportmonth,
									"semiyearvalue" : $scope.semiyearvalue,
									'reportdate' : new Date($scope.reportDate).toISOString(),
									'offset': new Date().getTimezoneOffset(),
								}

				        }).then(
				                function(response) {
				                    var myBlob = new Blob([response.data], {
				                        type: "application/pdf"
				                    });
				                    var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
				                    var anchor = document.createElement("a");
				                    anchor.download = $scope.vesselname+"-"+"QsheReport"+"-"+$scope.qsherefid;
				                    anchor.href = blobURL;
				                    anchor.click();


				                });
				    };
					
					
					
				});