app.controller('systemNotificationCtrl',function(toaster, $q, $rootScope, $routeParams, $timeout, $scope, $location,$http,
						$routeParams, systemNotificationService) {

	/*******************************/
	
	var url = $location.absUrl().split('/');
	var isdashboard = url[url.length-1];
	
	console.log("isdashboard", isdashboard);
	
	$scope.haspermission = false;
	
	$scope.unauthorize = function(arg1){
	  if (arg1){
		  $scope.haspermission = true;
	  }
	     $scope.hidebody = false;
	}
	
	if(isdashboard === 'sire') {
		$scope.currReport = 'Sire';
	} else if (isdashboard === 'nearmiss') {
		$scope.currReport = 'Nearmiss';
	} else if (isdashboard === 'pscei') {
		$scope.currReport = 'EL-PSC';
	} else if (isdashboard === 'fscei') {
		$scope.currReport = 'EL Flag State';
	} else if (isdashboard === 'crewhealth') {
		$scope.currReport = 'Crew Health Log';
	} else if (isdashboard === 'NearMissShare') {
		$scope.currReport = 'Shared Nearmiss Report';
	}
	
	$scope.flag = "INS001";
//	$rootScope.showScreenOverlay = true;
	
    $scope.inspectionDateFilter = {};
    $scope.fromDateString;
    $scope.fromDateObject = null;
    $scope.toDateString;
    $scope.toDateObject = null;
    $scope.maxDate = new Date();
    $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);
    
    $scope.fromDateChanged = function(){
      $scope.minDate = new Date($scope.fromDateString);
    };
    
    $scope.toDateChanged = function(){
      $scope.maxDate = new Date($scope.toDateString);
    };
    
    $scope.clear = function(){
      $scope.fromDateString = '';
      $scope.toDateString = '';
      $scope.fromDateObject = null;
      $scope.toDateObject = null;
      $scope.maxDate = new Date();
      $scope.minDate = new Date(2000, 0, 1, 0, 0, 0);
    }  
    
    $scope.monthSelectorOptions = {
            start: "year",
            depth: "year"
          };
    $scope.filterByDate =  function() {
    	if($scope.toDateString != undefined && $scope.fromDateString != undefined ) {
	    	var splitToDate = $scope.toDateString.split(" ");
	    	var splitFromDate = $scope.fromDateString.split(" ");
	        var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	    	
	        $scope.fromIns = new Date(splitFromDate[1], mL.indexOf(splitFromDate[0]) + 1);
	    	$scope.toIns = new Date(splitToDate[1], mL.indexOf(splitToDate[0]) + 1, 1);
	    	$scope.inspectionDateFilter = {
	    			"fromDate": $scope.fromIns.toISOString(),
	    			"toDate": $scope.toIns.toISOString()
	    	}
	    	
//	    	$scope.inspectionDateFilter =$scope.inspectionDateFilter);
    	}
    	
    }
	
	if( isdashboard === "Dashboard") {
		$timeout(function(){
			$rootScope.showScreenOverlay = true;
			systemNotificationService.generateNewDashboard('landingPage', 'mainPage1', 'mainPage2', 'mainPage3', $scope.filterValue,
					renderChart, 'INS001', $scope.inspectionDateFilter);
			$rootScope.showScreenOverlay = false;
		});
	}
	
	 $scope.path = '';
		$scope.referenceClicked = function(modulecode,formid){
			if(modulecode.length >0){
				$http({
					method : 'GET',
					url : '/get-task-manager-url/',
					params : {
						modulecode : modulecode,
						pagetype:"M"
					}
				}).then(function successCallBack(response){
					$scope.taskurl = response.data;
					$scope.path = $scope.taskurl[0].url;
					window.location = $scope.path+"/"+formid
				});
			}
		}
		
		/*********************FILTER*********************************/
		$scope.showFiltersList = true;
		$scope.buttonLabel = "Hide";
		$scope.showFilters = function() {
			$scope.showFiltersList = !$scope.showFiltersList;
			if($scope.showFiltersList === false) {
				$scope.buttonLabel = "Show";
			} else{
				$scope.buttonLabel = "Hide";
			}
		}
		
		$scope.clearAllFilters = function() {
			for (var key in $scope.dupfilterValue) {
				$scope.dupfilterValue[key] = [];
			}
			
			for (var key in $scope.filterValue) {
				$scope.filterValue[key] = [];
			}
			
			systemNotificationService.generateDashboard(
					$scope.dashboardID, $scope.currenttabid, $scope.filterValue,
					renderChart, 'null', $scope.inspectionDateFilter);
		}
		
		$scope.filterValue = {};
		$scope.dupfilterValue = {};

		$scope.removeFilter = function(parentKey, index) {
			$scope.filterValue[parentKey].splice(index, 1);
			$scope.dupfilterValue[parentKey].splice(index, 1);
			
			$scope.applyFilter($scope.dashboardID,$scope.currenttabid,'null');
		}

		$scope.fiterItems = function(labelCode, parentKey,
				labelName, headername) {

			if ($scope.filterValue[parentKey] != undefined) {

				var index = $scope.filterValue[parentKey]
						.indexOf(labelCode);
				if (index === -1) {
					$scope.filterValue[parentKey].push(labelCode);
					$scope.dupfilterValue[parentKey].push({
						'labelName' : labelName,
						'headername' : headername
					});
				} else {
					$scope.filterValue[parentKey].splice(index, 1);
					$scope.dupfilterValue[parentKey].splice(index,
							1);
				}
			} else {
				$scope.filterValue[parentKey] = [ "" ];
				$scope.filterValue[parentKey][0] = labelCode;

				$scope.dupfilterValue[parentKey] = [ "" ];
				$scope.dupfilterValue[parentKey][0] = {
					'labelName' : labelName,
					'headername' : headername
				};
			}
			
			$scope.showFiltersList = true;
			$scope.buttonLabel = "Hide";

		}
		
		/*********************************************************/
	
	// get task status Names
	  $scope.taskdetails=function(){
	    $http({	    	     
	        method: 'GET',
	        url: "/get-task-data-by-no/",
	    }).then(
	        function(response) {
	        	$scope.geterrormessages=response.data.message;	
              $scope.geterrorstatus=response.data.errorstatus;
              $scope.geterrorstatuscode=response.data.status;                
              $scope.dataerror =response.data.message;                 
	        	$scope.taskstatusdetails = response.data.data[0].todaytaskmanager;
	        	$scope.todaytaskcount = $scope.taskstatusdetails.length; 	        	
	        	$scope.upcomingtaskstatus =response.data.data[0].upcomingtaskmanager;  
	        	$scope.upcomingcount=$scope.upcomingtaskstatus.length;
	        	$scope.overduetaskstatus = response.data.data[0].overduetaskmanager;  	
	        	$scope.overduecount=$scope.overduetaskstatus.length;
	        	$scope.followtaskstatus =response.data.data[0].followertaskmanager;
	        	$scope.followcount=$scope.followtaskstatus.length;
	        	$scope.completedtaskstatus = response.data.data[0].completedtaskmanager;
	        	$scope.completedcount=$scope.completedtaskstatus.length;      
	        
	        });
	  }
	  
	  $scope.taskdetails();
					systemNotificationService
							.ShowNotificationHistory()
							.then(
									function(response) {
										$scope.notificationList = response.data;
										$scope.notificationCount = $scope.notificationList.length;
									})

					systemNotificationService
							.ShowUserDetailData()
							.then(
									function(response) {
										$scope.userDetailList = response.data.data;
										$scope.userrank = $scope.userDetailList[0].rankName;
										$scope.userrole = $scope.userDetailList[0].rolename;
										$scope.username = $scope.userDetailList[0].empName;
										$scope.usercode = $scope.userDetailList[0].userCode;
										$scope.vesselname = $scope.userDetailList[0].shipname;
									})

					systemNotificationService
							.ShowVesselTaskManagerData()
							.then(
									function(response) {
										$scope.vesselDetailList = response.data;
										$scope.taskCount = $scope.vesselDetailList.length;
									})

					systemNotificationService
							.getLeftPanelBasedPermissions()
							.then(
									function(response) {
										$scope.headTags = response.data;
										var promises = [];
										for (i = 0; i < $scope.headTags.length; i++) {
											$scope["noPermission"
													+ $scope.headTags[i]] = true;
											var promise = systemNotificationService
													.getParentbasedPermissions($scope.headTags[i]);
											promises.push(promise);
										}

										$q
												.all(promises)
												.then(
														function(response) {
															for (k = 0; k < response.length; k++) {

																/**
																 * ********PER
																 * MODULE
																 * TASK*****************
																 */
																var permissions = response[k].data;
																for (i = 0; i < permissions.length; i++) {
																	var str = "read"
																			+ permissions[i][0];
																	$scope["read"
																			+ permissions[i][0]] = permissions[i][1];
																}
																/** *********************************** */
															}
														});
									});

					$scope.userProfileClicked = function() {
					}

					// shipuserlistNew.html?userCode={{users.userCode}}

					$scope.thirdTabCallback = function() {
						$scope.test = 'I\'m the third tab callback';

						$scope.clickme = function() {
						};
					};

					// tab login ended

					$scope.showSelectValue = function(mySelect) {
						console.log(mySelect);
					}

					//Dashboard

					var urlParams = $location.absUrl();
					if (urlParams.includes("GraphReport")) {
						//var urlParams = $location.absUrl().split("?");
						var dname = $routeParams.id;

						systemNotificationService
								.generateDashboardReport(dname)
								.then(function(response) {
									var resultFn = response.data.data[0];
									$scope.tabs = resultFn.tab;
									$scope.dashboardID = resultFn.dashboardID;
								});
					}

					$scope.initTab = function(dashboardID, tabId,
							inspectionCode) {
						$rootScope.showScreenOverlay = true;
						var datesfilter = {
							"fromInspec" : $scope.fromIns,
							"toInspec" : $scope.toIns
						}
											
						
						if (inspectionCode == undefined) {
							inspectionCode = 'null';
						}
						$scope.results = "";
						$scope.currenttabid = tabId;
						
						systemNotificationService.generateDashboard(
								dashboardID, tabId, $scope.filterValue,
								renderChart, inspectionCode, $scope.inspectionDateFilter);
						$rootScope.showScreenOverlay = false;
					};

					$scope.applyFilter = function(dashboardID, tabId, dummy) {
						systemNotificationService.generateDashboard(
								dashboardID, tabId, $scope.filterValue,
								renderChart, 'null', $scope.inspectionDateFilter);
					         toaster.success({title: "Information", body:"Filters applied."});
					};

					var renderChart = function(tabId, response) {
						
						var output = response.data.data[0];
						var json = [];
						json = output;

						for (i = 0; i < json.length; i++) {
							var data = json[i];
							var finaldata = data[0];
							 
						 if (finaldata.chartTitle === "LTI Count") {
							 $scope.ltiCountData = finaldata.data;
						 } else {	
							 if(finaldata.data.length > 0) {	
	
								if (finaldata.chartType == "bar") {
									barChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "stackbar") {
									stackBarChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "line1"
										|| finaldata.chartType == "line2"
										| finaldata.chartType == "line3") {
									lineChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "bardot"
										|| finaldata.chartType == "barline") {
									barLineChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "bubble") {
									bubbleChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "pie") {
									pieChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "donut") {
									donutChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "donuts") {
									donutCharts(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "speedometer") {
									speedometerChart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "spiderchart") {
									spiderchart(tabId, i + 1, finaldata);
								} else if (finaldata.chartType == "label") {
									var datas = finaldata.data;
	
									var inspectActuals = datas[0].inspectActual;
									var inspectTotals = datas[0].inspectTotal;
									var accidentFrees = datas[0].accidentFree;
									labelChart(inspectActuals, inspectTotals,
											accidentFrees);
								}
								
							 } else {
									AmCharts.addInitHandler(function(chart) {
										  
										  if (chart.dataProvider === undefined || chart.dataProvider.length === 0) {
										    var dp = {};
										    dp[chart.titleField] = "";
										    dp[chart.valueField] = 1;
										    chart.dataProvider.push(dp)
										    
										    var dp = {};
										    dp[chart.titleField] = "";
										    dp[chart.valueField] = 1;
										    chart.dataProvider.push(dp)
										    
										    var dp = {};
										    dp[chart.titleField] = "";
										    dp[chart.valueField] = 1;
										    chart.dataProvider.push(dp)
										    
										    // disable slice labels
										    chart.labelsEnabled = false;
										    chart.startDuration = 0;
										    
										    // add label to let users know the chart is empty
										    chart.addLabel("50%", "50%", "The chart contains no data", "middle", 15);
										    
										    // dim the whole chart
										    chart.alpha = 0.1;
										  }
										  
										}, ["pie"]);
	
										var chart = AmCharts.makeChart("chartdiv", {
										  "type": "pie",
										   "allLabels" : (finaldata.chartType === "donuts" ? [ {
												"x" : "50%",
												"y" : "14%",
												"text" : finaldata.chartTitle,
												"size" : 16,
												"bold": true,
												"align" : "middle",
												"color" : "#000"
											}] : []),
										  "theme": "light",
										  "dataProvider": [],
										  "valueField": "value",
										  "titleField": "title",
										  "showBalloon": false
										});
										
									createChart(tabId, i + 1, chart, finaldata, true);
							 }
						 }
						 
						 
						}
						 
					 	 
					};

					var spiderchart = function(tabId, chartID, chartData) {
						try {
							var graphData	= [];
							for( j = 0 ; j < chartData.data.length ; j++) {
								
								for (var key in chartData.data[j]) {
								    if (chartData.data[j].hasOwnProperty(key) && key != 'x') {
								    	
										var obj = {
											    "balloonText": key + ": [[value]]",
											    "bullet": "round",
											    "lineThickness": 2,
											    "valueField": key	
											}
										graphData.push(obj);
								    }
								}
							}

							var chart = AmCharts.makeChart( "chartdiv", {
								  "type": "radar",
								  "precision": 2,
								  "theme": "light",
								  "dataProvider": chartData.data,
								  "startDuration": 0,
								  "graphs": graphData,
								  "categoryField": "x",
								  "export": {
								    "enabled": true,
								    "menuReviver": function(config, li) {
								        // MODIFY ONLY IMAGE ITEMS
								        if (config.capture) {
								          var link = li.getElementsByTagName("a")[0];

								          // ADD ANOTHER CLICK HANDLER ON TOP TO CHANGE THE FILENAME
								          link.addEventListener("click", function(e) {
								            config.fileName = chartData.chartTitle;
								          });
								        }

								        // RETURN UNTOUCHED LIST ELEMENT
								        return li;
								      }
								  }
								} );
							
							
							createChart(tabId, chartID, chart, chartData, false);

							// });					 

						} catch (err) {
						}
					};
					
					var roundOff = function(number){
						 temp= (number + 100);
						  number = temp%100;
						  return temp-number;
					}

					var speedometerChart = function(tabId, chartID, chartData) {
						try {
							
						var speedValue = 0;
						
						if (chartData.data != null) {
							var output = chartData.data;
							var json = [];
							json = output;
							if (json.length > 0) {
								speedValue = output[0].Anglevalue;
								speedValue = Math.round((speedValue)* 100)/ 100;
							}
						}						
						var setColor = (speedValue < 1.8 ? "#ff3232": "#3cd3a3");
							var chart = AmCharts.makeChart("chartdiv", {
								  "theme": "light",
								  "precision": 2,
								  "type": "gauge",
								  "autoResize": true,
								  "marginTop": 60,
								  "axes": [{
								    "topTextFontSize": 15,
								    "topTextYOffset": 50,
								    "topText": speedValue,
								    "axisColor": "#67b7dc",
								    "axisThickness": 1,
								    "endValue": ( tabId === "mainPage3" ? roundOff(speedValue) : 10),
								    "gridInside": true,
								    "inside": true,
								    "radius": "80%",
								    "valueInterval": ( tabId === "mainPage3" ? roundOff(speedValue)/5 : 1),
								    "tickColor": "#67b7dc",
								    "startAngle": -90,
								    "endAngle": 90,
								    "bandOutlineAlpha": 0,
								    "bands": [{
								      "color": "#0080ff",
								      "endValue": ( tabId === "mainPage3" ? roundOff(speedValue) : 10),
								      "innerRadius": "105%",
								      "radius": "120%",
								      "gradientRatio": [0.5, 0, -0.5],
								      "startValue": 0
								    }, {
								      "color": setColor,
								      "endValue": speedValue,
								      "innerRadius": "105%",
								      "radius": "125%",
								      "gradientRatio": [0.5, 0, -0.5],
								      "startValue": 0
								    }]
								  }],
								    "export": {
								    	"enabled": true,
									    "menuReviver": function(config, li) {
									        // MODIFY ONLY IMAGE ITEMS
									        if (config.capture) {
									          var link = li.getElementsByTagName("a")[0];

									          // ADD ANOTHER CLICK HANDLER ON TOP TO CHANGE THE FILENAME
									          link.addEventListener("click", function(e) {
									            config.fileName = chartData.chartTitle;
									          });
									        }

									        // RETURN UNTOUCHED LIST ELEMENT
									        return li;
									      }
								     },
								  "arrows": [{
								    "alpha": 1,
								    "innerRadius": "35%",
								    "nailRadius": 0,
								    "radius": "120%",
								    "value": speedValue
								  }],
								});

							createChart(tabId, chartID, chart, chartData, false);

							// });					 

						} catch (err) {
						}
					};

					var donutChart = function(tabId, chartID, chartData) {
						var bb = chartData.data;
						var a = 0;
					     var b = 0;
						if (bb != '') {
							a = bb[0].y;
							b = bb[1].y;
						}

						if(chartData.chartTitle === "Overdue") {
							$scope.totalOverdue = a;
							$scope.actualOverdue = b; 	
							
						} else if (chartData.chartTitle === "Today") {
							$scope.totalToday = a;
							$scope.actualToday = b; 	
							
						} else if (chartData.chartTitle === "UpComing") {
							$scope.totalUpComing = a;
							$scope.actualUpComing = b; 	
							
						} else if ( chartData.chartTitle === "Completed") {
							$scope.totalCompleted = a;
							$scope.actualCompleted = b; 	
							
						} else if ( chartData.chartTitle === "FollowUp") {
							$scope.totalFollowUp = a;
							$scope.actualFollowUp = b; 	
							
						}  

					};

					var donutCharts = function(tabId, chartID, chartData) {
						try {
							chart = new AmCharts.AmPieChart();
							
							chart.dataProvider = chartData.data;
						
							// dont change order
							var colors = [ "#DC143C", "#FFD700", "#FFA500",
									"#228B22", "#0000CD" ];
							var color;
							if (chartData.chartTitle == 'Overdue') {
								color = colors[0];
							} else if (chartData.chartTitle == 'Today') {
								color = colors[1];
							} else if (chartData.chartTitle == 'UpComing') {
								color = colors[2];
							} else if (chartData.chartTitle == 'Completed') {
								color = colors[3];
							} else if (chartData.chartTitle == 'FollowUp') {
								color = colors[4];
							} else if (chartData.chartTitle == 'Overdue') {
								color = colors[0];
							} else if (chartData.chartTitle == 'Monthly Reports') {
								color = "#ffd40f";
							} else if (chartData.chartTitle == 'EI Finding') {
								color = "#ffa500";
							} else if (chartData.chartTitle == 'HP Tension Crew Nos.') {
								color = "#33A1C9";
							} else if (chartData.chartTitle == 'Overdue Task') {
								color = "#20BF9F";
							} else if (chartData.chartTitle == 'ScoreBoard') {
								color = "#EEC900";
							}
							
							var a = 0;
							var b = 0;
							var bb = chartData.data;

							if (chartData.chartTitle == 'HP Tension Crew Nos.')	{
									a = bb[1].y;
									b = bb[1].y;
							 } else if (bb != '')  {
								 if(bb[0].y === null) {
									a = 0;
								 } else {
									a = bb[0].y;
								 }
								 
								 if(bb[1].y === null) {
									 b = 0;
								 } else {
									 b = bb[1].y; 
								 }	 
									
							 }
							
								chartData.data[1].y = parseInt(chartData.data[1].y) - parseInt(chartData.data[0].y);

							chart.titleField = "x";
							chart.precision = 2;
							chart.valueField = "y";
							chart.innerRadius = "85%";
							chart.startDuration = 0;
							chart.pullOutRadius = 0,
							chart.gradientRatio = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4,  -0.1];
							chart.labelRadius = 0;
							
							if(tabId === 'mainPage3') {
								chart.marginLeft = 60;
								chart.marginRight = 60;
								chart.marginBottom = 20;
								chart.marginBottom = 25;
								chart.allLabels = [  {
									"x" : "50%",
									"y" : "40%",
									"text" : (chartData.chartTitle == 'HP Tension Crew Nos.'  ? b  : a + "/" + b),
									"size" : 22,
									"align" : "middle",
									"color" : "#000"
								} ]
								
							} else {
								chart.marginLeft = 20;
								chart.marginRight = 20;
								chart.marginBottom = 20;

								chart.allLabels = [ {
									"x" : "50%",
									"y" : "14%",
									"text" : chartData.chartTitle,
									"size" : 16,
									"bold": true,
									"align" : "middle",
									"color" : "#000"
								}, {
									"x" : "50%",
									"y" : "55%",
									"text" : (chartData.chartTitle == 'HP Tension Crew Nos.'  ? b  : a + "/" + b),
									"size" : 22,
									"align" : "middle",
									"color" : "#000"
								} ]
							}

							chart.balloonText = "";
							chart.colors = [ color, "#CCCCCC"];
							chart.labelsEnabled = false;

									// WRITE
							

									createChart(tabId, chartID, chart,
											chartData, false);

						} catch (err) {
						}

					};

					var labelChart = function(inspectActuals, inspectTotals,
							accidentFrees) {

						try {
							$scope.insAct = inspectActuals;
							$scope.insTot = inspectTotals;
							$scope.insAcc = accidentFrees;

						} catch (err) {
						}

					};


					var stackBarChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmSerialChart();
						try {
							
							var d = new Date();
							var n = d.getFullYear();	

						if(chartData.chartTitle === "NearMiss , Injury , Sickness Count ") {		
							var chart = AmCharts.makeChart("chartdiv", {
								"type": "serial",
								"columnSpacing" : 0,
								"precision": 2,
								"gradientRatio" : [0.4, 0.4, 0.4, 0.4, 0.4, 0.4,  -0.1],
							     "theme": "light",
								"categoryField": "x",
								"startDuration": 1,
								"categoryAxis": {
//									"gridPosition": "start",
									"position": "left",
									"gridCount" : chartData.data.length,
									"title": "Month (" + n + ")", 
									"titleBold":false,
									"titleFontSize": 12,
									"fontSize":10,
									"autoGridCount" : false,
									"labelRotation" : 90
								},
								"trendLines": [],
								"graphs": [
									{
										"balloonText": "Nearmiss:[[value]]",
										"fillAlphas": 0.8,
										"id": "AmGraph-1",
										"lineAlpha": 0.2,
										"title": "Nearmiss",
										"type": "column",
										"valueField": "y0"
									},
									{
										"balloonText": "Injury:[[value]]",
										"fillAlphas": 0.8,
										"id": "AmGraph-2",
										"lineAlpha": 0.2,
										"title": "Injury",
										"type": "column",
										"valueField": "y1"
									},
									{
										"balloonText": "Sickness:[[value]]",
										"fillAlphas": 0.8,
										"id": "AmGraph-3",
										"lineAlpha": 0.2,
										"title": "Sickness",
										"type": "column",
										"valueField": "y2"
									}
								],
								"guides": [],
								"valueAxes" : [{
									"title": "Counts", 
									"titleBold":false,
									"titleFontSize": 12,
									"fontSize":10
									}],
								"balloon": {},
								"titles": [],
								"dataProvider": chartData.data
								,
							    "export": {
							    	"enabled": true,
								    "menuReviver": function(config, li) {
								        // MODIFY ONLY IMAGE ITEMS
								        if (config.capture) {
								          var link = li.getElementsByTagName("a")[0];

								          // ADD ANOTHER CLICK HANDLER ON TOP TO CHANGE THE FILENAME
								          link.addEventListener("click", function(e) {
								            config.fileName = chartData.chartTitle;
								          });
								        }

								        // RETURN UNTOUCHED LIST ELEMENT
								        return li;
								      }
							     }

							});
						} else {	
							chart.categoryField = "x";
							chart.startDuration = 0;
							chart.precision = 2;
							chart.type = "serial";
							chart.dataProvider = chartData.data;
							chart.columnSpacing = 0;
							
							// AXES
							// category
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 90;
							categoryAxis.labelFunction = showEllipsis;
//							categoryAxis.gridPosition = "start";
							categoryAxis.gridCount = chartData.data.length;
							categoryAxis.autoGridCount = false;
							categoryAxis.title = chartData.xlabel;
							categoryAxis.titleBold = false;
							categoryAxis.gridAlpha = 0;
							categoryAxis.gridCount = 100;
							categoryAxis.titleFontSize = 12;
							categoryAxis.fontSize = 10;

							var valueAxis = new AmCharts.ValueAxis();
							valueAxis.gridAlpha = 0.05;
							valueAxis.titleFontSize = 12;
							valueAxis.fontSize = 10;
							valueAxis.titleBold = false;
							
							if(tabId != "chapter" && tabId != "summary") {
								valueAxis.stackType = "regular";
							}	
							valueAxis.title = chartData.ylabel;

							chart.addValueAxis(valueAxis);
							// GRAPH
							

							var unique = chartData.ul;
							if (unique != undefined) {
								for (var i = 0; i < unique.length; i++) {
									graph = new AmCharts.AmGraph();
									graph.title = unique[i];
									// graph.labelText = "[[value]]";
									graph.valueField = "y" + i;
									graph.type = "column";
									graph.lineAlpha = 0;
									graph.fillAlphas = 1;
									graph.balloonText = (chartData.stackType.toUpperCase()  === "TRUE" ? "<span >[[title]] : [[category]]</span><br><span style='font-size:14px'><b>[[value]]</b></span>" : 
										"<span >[[category]]</span><br><span style='font-size:14px'><b>[[value]]</b></span>");
									chart.addGraph(graph);
								}
								
								if (chartData.stackType.toUpperCase()  === "TRUE"  || chartData.stackType  === "true" || chartData.stackType  === "True") {
									var legend = new AmCharts.AmLegend();
									legend.position = "bottom";
									legend.fontSize = 9;
									chart.addLegend(legend);
								}	
							}
						}
							
							
							var chartScrollbar = new AmCharts.ChartScrollbar();
							chartScrollbar.scrollbarHeight = 5;
							chartScrollbar.offset = 15
							chart.addChartScrollbar(chartScrollbar);
							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
						}

					};
					
					
					var bubbleChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmXYChart();
						try {
							chart.dataProvider = chartData.data;
							chart.gradientRatio = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4,  -0.1];
							//chart.addLabel(10, 0, chartData.chartTitle,"center", "10", "#333399", 0, "4", false);
							var xAxis = new AmCharts.ValueAxis();
							xAxis.title = chartData.xlabel;
							xAxis.titleBold = false;
							xAxis.position = "bottom";
							xAxis.dashLength = 1;
							xAxis.axisAlpha = 0;
							xAxis.titleFontSize = 12;
							xAxis.fontSize = 10;
							chart.addValueAxis(xAxis);

							var yAxis = new AmCharts.ValueAxis();
							yAxis.position = "left";
							yAxis.title = chartData.ylabel;
							yAxis.titleBold = false;
							yAxis.dashLength = 1;
							yAxis.axisAlpha = 0;
							yAxis.titleFontSize = 12;
							yAxis.fontSize = 10;
							chart.addValueAxis(yAxis);
							var unique = [];
//							unique = chartData.ul;
							for (var i = 0; i < chartData.data.length; i++) {
								var graph = new AmCharts.AmGraph();
								graph.title = chartData.data[i]["z" + i];
								graph.balloonText = chartData.xlabel
										+ ":<b>[[x]]</b></br> "
										+ chartData.ylabel + ":<b>[[y]]</b>";
								graph.xField = "x" + i;
								graph.yField = "y" + i;
								graph.lineAlpha = 0;
//								graph.valueField = "s" + i;
								graph.bullet = "round";
								chart.addGraph(graph);
							}
										
							// LEGEND
							var legend = new AmCharts.AmLegend();
							legend.position = "bottom";
							legend.fontSize = 9;
							chart.addLegend(legend);

							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chart.addChartCursor(chartCursor);

							// SCROLLBAR

							var chartScrollbar = new AmCharts.ChartScrollbar();
							chartScrollbar.scrollbarHeight = 5;
							chartScrollbar.offset = 15;
							chart.precision = 2;
							chart.addChartScrollbar(chartScrollbar);

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
						}
					};
					function labelFunction(item, label) {
						  if (item.index === 2)
						    return label;
						  else
						    return "";
						}
					var lineChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmSerialChart();

						try {

							chart.dataProvider = chartData.data;
							chart.categoryField = "x";
							chart.startDuration = 0;
							chart.precision = 2;
							chart.gradientRatio = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4,  -0.1];
							chart.colors = ["#32CD99","#0D8ECF","#FCD202","#2A0CD0","#CC0000","#00CC00","#0000CC","#DDDDDD","#999999","#333333","#990000"];
							
							// AXES
							// category axis
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 90;
							categoryAxis.labelFunction = showEllipsis;
							categoryAxis.gridPosition = "start";
							categoryAxis.title = chartData.xlabel;
							categoryAxis.titleBold = false;
							categoryAxis.titleFontSize = 12;
							categoryAxis.fontSize = 10;
							categoryAxis.labelFunction = formatXaxisLabel;
							categoryAxis.gridAlpha = 0;

							var valueAxis = new AmCharts.ValueAxis();
							valueAxis.title = chartData.ylabel;
							valueAxis.gridThickness = "0";
							valueAxis.titleFontSize = 12;
							valueAxis.fontSize = 10;
							valueAxis.titleBold = false;
							valueAxis.labelFunction = formatYaxisLabel;

							var unique = [];
							if (chartData.ul != undefined) {
								
								
								unique = chartData.ul;
								for (var i = 0; i < unique.length; i++) {
									var graph = new AmCharts.AmGraph();
									graph.valueAxis = valueAxis;
									graph.title = unique[i];
									graph.valueField = "y" + i;
									graph.bullet = "square";
									graph.hideBulletsCount = 30;
									graph.bulletBorderThickness = 1;
//									durationGraph.bulletBorderColor = "#00CDCD";
									graph.balloonText = unique[i] + " <span style='font-size:12px;'>[[category]]</span>:<span style='font-size:12px'><b>[[value]]</b></span>";
									chart.addGraph(graph);
								}
							} else if (tabId == "bmi") {
								
								var graph = new AmCharts.AmGraph();
								graph.balloonText = "Underweight : [[value]]";
								graph.valueAxis = valueAxis;
								graph.valueField = "y1";
								graph.bullet = "circle";
								graph.hideBulletsCount = 30;
								graph.bulletBorderThickness = 1;
								chart.addGraph(graph);
								
								var graph2 = new AmCharts.AmGraph();
								graph2.balloonText = "Normal : [[value]]";
								graph2.valueAxis = valueAxis;
								graph2.valueField = "y2";
								graph2.bullet = "circle";
								graph2.hideBulletsCount = 30;
								graph2.bulletBorderThickness = 1;
								chart.addGraph(graph2);
								
								var graph3 = new AmCharts.AmGraph();
								graph3.balloonText = "Overweight : [[value]]";
								graph3.valueAxis = valueAxis;
								graph3.valueField = "y3";
								graph3.bullet = "circle";
								graph3.hideBulletsCount = 30;
								graph3.bulletBorderThickness = 1;
								chart.addGraph(graph3);
								
								var graph4 = new AmCharts.AmGraph();
								graph4.balloonText = "Very Over Weight : [[value]]";
								graph4.valueAxis = valueAxis;
								graph4.valueField = "y4";
								graph4.bullet = "circle";
								graph4.hideBulletsCount = 30;
								graph4.bulletBorderThickness = 1;
								chart.addGraph(graph4);
								
								var graph5 = new AmCharts.AmGraph();
								graph5.balloonText = "Extreme : [[value]]";
								graph5.valueAxis = valueAxis;
								graph5.valueField = "y5";
								graph5.bullet = "circle";
								graph5.hideBulletsCount = 30;
								graph5.bulletBorderThickness = 1;
								chart.addGraph(graph4);
								
							} else if (tabId == "bloodpressure") {

								
								var graph = new AmCharts.AmGraph();
								graph.valueAxis = valueAxis;
								graph.balloonText = "Normal : [[value]]";
								graph.valueField = "y1";
								graph.bullet = "circle";
								graph.hideBulletsCount = 30;
								graph.bulletBorderThickness = 1;
								chart.addGraph(graph);
								var graph2 = new AmCharts.AmGraph();
								graph2.valueAxis = valueAxis;
								graph2.valueField = "y2";
								graph2.bullet = "circle";
								graph2.hideBulletsCount = 30;
								graph2.bulletBorderThickness = 1;
								graph2.balloonText = "Pre Hypertension : [[value]]";
								chart.addGraph(graph2);
								var graph3 = new AmCharts.AmGraph();
								graph3.valueAxis = valueAxis;
								graph3.balloonText = "Hypertension Stage 1 : [[value]]";
								graph3.valueField = "y3";
								graph3.bullet = "circle";
								graph3.hideBulletsCount = 30;
								graph3.bulletBorderThickness = 1;
								chart.addGraph(graph3);
								var graph4 = new AmCharts.AmGraph();
								graph4.valueAxis = valueAxis;
								graph4.balloonText = "Hypertension Stage 2 : [[value]]";
								graph4.valueField = "y4";
								graph4.bullet = "circle";
								graph4.hideBulletsCount = 30;
								graph4.bulletBorderThickness = 1;
								chart.addGraph(graph4);
								
							} else if (tabId == "bodyfateval") {
								
								var graph = new AmCharts.AmGraph();
								graph.valueAxis = valueAxis;
								graph.balloonText = "Obese : [[value]]";
								graph.valueField = "y1";
								graph.bullet = "circle";
								graph.hideBulletsCount = 30;
								graph.bulletBorderThickness = 1;
								chart.addGraph(graph);
								
								var graph2 = new AmCharts.AmGraph();
								graph2.balloonText = "Acceptable : [[value]]";
								graph2.valueAxis = valueAxis;
								graph2.valueField = "y2";
								graph2.bullet = "circle";
								graph2.hideBulletsCount = 30;
								graph2.bulletBorderThickness = 1;
								chart.addGraph(graph2);
								
								var graph3 = new AmCharts.AmGraph();
								graph3.valueAxis = valueAxis;
								graph3.balloonText = "Fitness : [[value]]";
								graph3.valueField = "y3";
								graph3.bullet = "circle";
								graph3.hideBulletsCount = 30;
								graph3.bulletBorderThickness = 1;
								chart.addGraph(graph3);
								
								var graph4 = new AmCharts.AmGraph();
								graph4.balloonText = "Athlete : [[value]]";
								graph4.valueAxis = valueAxis;
								graph4.valueField = "y4";
								graph4.bullet = "circle";
								graph4.hideBulletsCount = 30;
								graph4.bulletBorderThickness = 1;
								chart.addGraph(graph4);
								
								var graph5 = new AmCharts.AmGraph();
								graph5.balloonText = "Essential Fat : [[value]]";
								graph5.valueAxis = valueAxis;
								graph5.valueField = "y5";
								graph5.bullet = "circle";
								graph5.hideBulletsCount = 30;
								graph5.bulletBorderThickness = 1;
								chart.addGraph(graph5);
								
							} 
							else if (chartData.chartTitle == "Avg.Deficiency  per Fleet") { 
							   dictLen = Object.keys(chartData.data[0]).length
							   for(i = 0 ; i < dictLen - 1 ; i++) {
									var graph = new AmCharts.AmGraph();
									graph.valueAxis = valueAxis;
									graph.balloonText = "Fleet-" + i + ": [[value]]";
									graph.valueField = "y" + i;
									graph.bullet = "circle";
									graph.hideBulletsCount = 30;
									graph.bulletBorderThickness = 1;
									chart.addGraph(graph);
							   }
							}
							else {
								var graph = new AmCharts.AmGraph();
								graph.valueAxis = valueAxis;
								// graph.title = unique[i];
								graph.balloonText = valueAxis.title + " <span style='font-size:13px;'>[[category]]</span>:<span style='font-size:12px'><b>[[value]]</b></span>";
								graph.valueField = "y1";
								graph.bullet = "circle";
								graph.lineColorField  = "red";
								graph.colorField = "green";
								graph.hideBulletsCount = 30;
								graph.bulletBorderThickness = 1;
								chart.addGraph(graph);
							}

							// CURSOR
							chart.addValueAxis(valueAxis);
							
							var chartCursor = new AmCharts.ChartCursor();
							chartCursor.cursorAlpha = 0.1;
							chartCursor.fullWidth = true;
							chartCursor.valueLineBalloonEnabled = true;
							chart.addChartCursor(chartCursor);

							// SCROLLBAR
							var chartScrollbar = new AmCharts.ChartScrollbar();
							chart.addChartScrollbar(chartScrollbar);

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
						}

					};

					var barLineChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmSerialChart();
						try {
							
							// 
							chart.dataProvider = chartData.data;
							chart.categoryField = "x";
							chart.startDuration = 0;
							chart.precision = 0;
							chart.thousandsSeparator = "";
							chart.colors =  [
								         		"#ffffff"
								        	];
							chart.gradientRatio = [0, 0, 0, 0, 0, 0,  0];
							
							// AXES
							// category axis
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 90;
							categoryAxis.labelFunction = showEllipsis;
							categoryAxis.gridAlpha = 0;
							categoryAxis.fontSize = 10;
							categoryAxis.title = chartData.xlabel;
							categoryAxis.titleFontSize = 12;
							categoryAxis.titleBold = false;
//							categoryAxis.gridPosition = "start";
							categoryAxis.gridCount = chartData.data.length;
							categoryAxis.autoGridCount = false;

							// as we have data of different units, we create two
							// different value axes
							// Duration value axis
							var durationAxis = new AmCharts.ValueAxis();
							durationAxis.gridAlpha = 0.05;
							durationAxis.axisAlpha = 0;
							durationAxis.title = chartData.zlabel;
							durationAxis.titleBold = false;
							durationAxis.titleFontSize = 12;
							durationAxis.fontSize = 10;
							durationAxis.tickLength = 0;
							durationAxis.position = "right";
							durationAxis.minimum = 0;
							chart.addValueAxis(durationAxis);

							// Distance value axis
							var distanceAxis = new AmCharts.ValueAxis();
							distanceAxis.gridAlpha = 0;
							distanceAxis.axisAlpha = 0;
							distanceAxis.title = chartData.ylabel;
							distanceAxis.integersOnly = true;
							distanceAxis.titleBold = false;
							distanceAxis.titleFontSize = 12;
							distanceAxis.fontSize = 10;
							distanceAxis.tickLength = 0;
							chart.addValueAxis(distanceAxis);
							
							// GRAPHS

							// distance graph
							var distanceGraph = new AmCharts.AmGraph();

							distanceGraph.valueField = "y";
							distanceGraph.type = "column";
							
							if (chartData.chartTitle != "NM by Year-Month") {
								distanceGraph.fillAlphas = 1;
								distanceGraph.fillColorsField = "bc";
								distanceGraph.lineColor = "#32CD99";
								distanceGraph.lineAlpha = 0;
							} else {
								distanceGraph.fillAlphas = 0;
								distanceGraph.lineColor = "#ffffff";
								distanceGraph.lineAlpha = 0;
							}
							distanceGraph.title = chartData.ylabel;
							distanceGraph.valueAxis = distanceAxis;
							distanceGraph.balloonText = chartData.ylabel
									+ " : [[value]]";
							distanceGraph.legendValueText = "[[value]]";

							chart.addGraph(distanceGraph);
							
							// duration graph
							var durationGraph = new AmCharts.AmGraph();
							durationGraph.valueField = "z";
							durationGraph.type = "line";
							durationGraph.valueAxis = durationAxis;
							durationGraph.title = chartData.zlabel;
							 durationGraph.lineColor = "#388E8E";
							durationGraph.labelText = "[[value]]";
							durationGraph.balloonText = chartData.zlabel
									+ " : [[value]]";
//							if (chartData.chartType == "barline")
								durationGraph.lineThickness = 2;
//							else
//								durationGraph.lineThickness = 0;

							durationGraph.legendValueText = "[[value]]";
							durationGraph.bullet = "round";
							durationGraph.bulletBorderColor = "#00CDCD";
							durationGraph.bulletBorderAlpha = 1;
							durationGraph.bulletBorderThickness = 2;
							chart.addGraph(durationGraph);

							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chartCursor.cursorPosition = "mouse";
							chart.addChartCursor(chartCursor);
							
							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
						}

					};

					var barChart = function(tabId, chartID, chartData) {

						var chart = new AmCharts.AmSerialChart();
						try {
							chart.dataProvider = chartData.data;
							//chart.addLabel(10, 0, chartData.chartTitle,"center", "10", "#333399", 0, "4", false);
							chart.categoryField = "x";
							chart.startDuration = 0;
							chart.precision = 2;
							chart.gradientRatio = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4,  -0.1];

							// AXES
							// category
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 90;
							categoryAxis.labelFunction = showEllipsis;
//							categoryAxis.gridPosition = "start";
							categoryAxis.title = chartData.xlabel;
							categoryAxis.autoGridCount = false;
							categoryAxis.gridCount = chartData.data.length;
							categoryAxis.titleBold = false;
							categoryAxis.titleFontSize = 12;
							categoryAxis.gridAlpha = 0;
							categoryAxis.fontSize = 10;

							var valueAxis = new AmCharts.ValueAxis();
							valueAxis.gridAlpha = 0.05;
							valueAxis.fontSize = 10;
							valueAxis.title = chartData.ylabel;
							valueAxis.titleBold = false;
							valueAxis.titleFontSize = 12;

							chart.addValueAxis(valueAxis);
							// GRAPH
							var graph = new AmCharts.AmGraph();
							graph.valueField = "y";
							graph.balloonText = "<span style='font-size:12px;'>[[category]]</span>:<span style='font-size:12px'><b>[[value]]</b></span>";
							graph.type = "column";
							graph.fillColors = [ "#3D4791", "#6DB6F2" ];
							graph.lineAlpha = 0;
							graph.autoColor = true;
							graph.fillAlphas = 0.6;
							graph.labelText = "[[value]]";
							chart.addGraph(graph);

							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chartCursor.cursorPosition = "mouse";
							chart.addChartCursor(chartCursor);
							
							  for(var i = 0; i < chart.graphs.length; i++) {
								    var graph = chart.graphs[i];
								    if (graph.autoColor !== true)
								      continue;
								    var colorKey = "autoColor-"+i;
								    graph.lineColorField = colorKey;
								    graph.fillColorsField = colorKey;
								    for(var x = 0; x < chart.dataProvider.length; x++) {
								      var color = chart.colors[x]
								      chart.dataProvider[x][colorKey] = color;
								    }
								  }

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
						}

					};

					var pieChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmPieChart();
							
						try {

							chart = new AmCharts.AmPieChart();
							
							chart.dataProvider = chartData.data;
							//chart.addLabel(10, 0, chartData.chartTitle,"center", "10", "#333399", 0, "4", false);
							chart.titleField = "x";
							chart.valueField = "y";
							chart.labelsEnabled = false;
							chart.precision = 2;
							if(tabId === "zerodef" || tabId === "mainPage2" || tabId === "bodyfateval" || tabId === "bmi" || tabId === "bloodpressure") {
								chart.colors = ["#32CD99","#ff3232", "#ffae19","#0D8ECF","#cc1075", "#2A0CD0","#999999","#333333","#990000","#CC0000","#FCD202",
								                "#9400D3", "#0000FF","#00FF00","#FF7F00","#FF0000","#4B0082","#DDDDDD", "#4D1919", "#C2850A", "#A3C20A"
								                ];
							}

							chart.theme = "light";
							chart.colorField = "color";
							chart.startDuration = 0;
							chart.marginBottom = 0;
							chart.marginLeft = 0;
							// LEGEND
							legend = new AmCharts.AmLegend();
							legend.align = "bottom";

							legend.fontSize = 9;
							legend.maxColumns = 1;
							legend.autoMargins = true;
//							legend.combineLegend = false;
							legend.markerType = "circle";
//							legend.truncateLabels = "16"; 
							legend.markerSize = 10;
							legend.valueWidth = 80;
							legend.marginLeft = 0;
							legend.marginBottom = 0;
							legend.valueText = "[[value]] | [[percents]]%";
							chart.addLegend(legend);
							chart.gradientRatio = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4,  -0.05];
							chart.balloonText = "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>";
							chart.depth3D = 0;
							chart.angle = 0;

							
							// WRITE

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
						}

					};

					function createChart(tabId, chartID, chart, chartData,
							exportOption) {
						try {
							var uniqueID = tabId + chartID;
							if (angular.element('#' + uniqueID + 'panel').length > 0) {
							} else {
								var element = document.createElement("div");
								// element.className = "row";
								element.style.padding = "0px";
								element.id = uniqueID + "panel";
								
								if(uniqueID === "mainPage33") {
									document.getElementById("mainPage4chart")
									.appendChild(element);
								} else if (uniqueID === "mainPage35") {
									document.getElementById("mainPage41chart")
									.appendChild(element);
								} else {
									document.getElementById(tabId + "chart")
										.appendChild(element);
								}
								

								
								var element = document.createElement("div");
								if (chartData.chartSize != undefined) {
									element.className = chartData.chartSize;
								} else {
									element.className = "col-md-12";
								}

								element.id = uniqueID + "panelinner";
								document.getElementById(uniqueID + "panel")
										.appendChild(element);

								if (chartData.chartType != "donut") {
									var element = document.createElement("div");
									element.className = "x_title";
									element.id = uniqueID + "x_title";
									document.getElementById(
											uniqueID + "panelinner")
											.appendChild(element);
									document.getElementById(uniqueID
											+ "x_title").innerHTML = chartData.chartTitle;
								}

								var element = document.createElement("div");
								element.className = "x_panel";
								element.id = uniqueID + "x_panel";
								document
										.getElementById(uniqueID + "panelinner")
										.appendChild(element);

								var element = document.createElement("div");
								element.className = "x_content";

								element.id = uniqueID + "content";
								document.getElementById(uniqueID + "x_panel")
										.appendChild(element);

								var element = document.createElement("div");
								element.id = uniqueID;
								element.style.height = "350px"
								element.style.width = "100%"
									
								document.getElementById(uniqueID + "content")
										.appendChild(element);
								
								// Set backimage to Dashboard Donuts
								if(uniqueID === "mainPage11") {
									var a = document.getElementById(uniqueID);
									a.style.background = "transparent url(img/monthly_report.svg) no-repeat center 8em";
									a.style.backgroundSize = "4em 4em";
								} else if (uniqueID === "mainPage12") {
									var a = document.getElementById(uniqueID);
									a.style.background = "transparent url(img/el_finding.svg) no-repeat center 8em";
									a.style.backgroundSize = "4em 4em";									
								} else if (uniqueID === "mainPage13") {
									var a = document.getElementById(uniqueID);
									a.style.background = "transparent url(img/lti.svg) no-repeat center 8em";
									a.style.backgroundSize = "4em 4em";									
								} else if (uniqueID === "mainPage14") {
									var a = document.getElementById(uniqueID);
									a.style.background = "transparent url(img/overdue.svg) no-repeat center 8em";
									a.style.backgroundSize = "4em 4em";									
								} 
							}

							//chartData.chartTitle

							if (exportOption) {
								chart["export"] = {
									"enabled" : true,
								    "menuReviver": function(config, li) {
								        // MODIFY ONLY IMAGE ITEMS
								        if (config.capture) {
								          var link = li.getElementsByTagName("a")[0];

								          // ADD ANOTHER CLICK HANDLER ON TOP TO CHANGE THE FILENAME
								          link.addEventListener("click", function(e) {
								            config.fileName = chartData.chartTitle;
								          });
								        }

								        // RETURN UNTOUCHED LIST ELEMENT
								        return li;
								      } , 
								   
									"menu" : [ {
										"class" : "export-main",
										"menu" : [
												{
													"label" : "Download",
													"menu" : [ "PNG", "JPG",
															"CSV" ]
												},
												{
													"label" : "Annotate",
													"action" : "draw",
													"menu" : [ {
														"class" : "export-drawing",

														"menu" : [
																{
																	"label" : "Add ..."

																	,
																	"menu" : [
																			{
																				"label" : "Shape ...",
																				"action" : "draw.shapes"
																			},
																			{
																				"label" : "Text",
																				"action" : "text"
																			} ]
																},
																{
																	"label" : "Change ...",

																	"menu" : [
																			{
																				"label" : "Mode ...",
																				"action" : "draw.modes"
																			},
																			{
																				"label" : "Color ...",
																				"action" : "draw.colors"
																			},
																			{
																				"label" : "Size ...",
																				"action" : "draw.widths"
																			},
																			{
																				"label" : "Opactiy ...",
																				"action" : "draw.opacities"
																			},
																			"UNDO",
																			"REDO" ]
																},
																{
																	"label" : "Download as...",
																	"menu" : [
																			"PNG",
																			"JPG" ]
																}, "PRINT",
																"CANCEL" ]
													} ]
												} ]
									} ]
								};
							}
							chart.write(tabId + chartID);
						} catch (error) {
						}
					}

					function formatYaxisLabel(value, valueString, axis) {
						if (value > 999) {
							valueString = value / 1000;
							valueString = valueString + "k";
						}

						return valueString;
					}

					function formatXaxisLabel(value, valueString, axis) {

						if (value.length > 16) {
							return value.substring(1, 15) + "...";
						}
						return value;
					}

					var tabValues = function(response) {
						$scope.tabs = response;
						// $scope.resultss = output.data;
					};
					$http({
						method : 'GET',
						url : "/get-inspectioncode/",
					}).then(function(response) {

						$scope.inspectionCode = response.data.data[0];

					});

					$scope.getFilter_Tab_Details = function() {
						var dashboardName = $routeParams.id;
						systemNotificationService.getFilter_Tab_Details(
								"filterparams", $routeParams.id, filterValue);
						if (dashboardName == "nearmiss") {
							$scope.dashboardNames = "Nearmiss dashboard";
						} else if (dashboardName == "psc") {
							$scope.dashboardNames = "PSC dashboard"
						} else if (dashboardName == "injury") {
							$scope.dashboardNames = "Injury Analysis"
						} else if (dashboardName == "sick") {
							$scope.dashboardNames = "Sickness Analysis"
						} else {
							$scope.dashboardNames = "List of dashboards"
						}
					};
					var filterValue = function(response) {
						var output = response.data.data[0];
						$scope.filters = output.filter;
						$scope.kendoFilters = [];
						for (i = 0; i < $scope.filters.length; i++) {

							var kendoInnerItems = [];
							
							for (k = 0; k < $scope.filters[i].value.length; k++) {
								var itemObj = {
									parentkey : $scope.filters[i].key,
									text : $scope.filters[i].value[k],
									headername : $scope.filters[i].name,
									indexlabel : $scope.filters[i].label[k]
								};

								kendoInnerItems.push(itemObj);
							}
							
							var obj = {
								text : $scope.filters[i].name,
								items : kendoInnerItems
							}

							$scope.filterValue[$scope.filters[i].key] = [];
							$scope.dupfilterValue[$scope.filters[i].key] = [];
							$scope.kendoFilters.push(obj);
							
						}
						$scope.results = output;
					};
					
					var showEllipsis = function(valueText, serialDataItem, categoryAxis) {
				        if (valueText.length > 8)
				          return valueText.substring(0, 8) + '...';
				        else
				          return valueText;
				      }

					$scope.alertMe = function(tabValue) {
						try {
							var taVal = document.getElementById(tabValue
									+ "Status").value;
							if (taVal == "loaded") {
								// $window.alert('Already loaded');
							} else {
								// $window.alert('yet to loaded');
								$scope.initTab($scope.dashboardID, tabValue);
								
							}
						} catch (err) {
							// alert(err);
						}
					};	
					

				});