app.controller('TemplateCtrl',
				function($q, $rootScope, $timeout, $scope,$http, $location,$interval,
						$routeParams, systemNotificationService, websocket, CONSTANTS) {
	
	/*****************************/
	$scope.activeTab = 'DashBoard';
	$scope.activateTab = function(tabName) {
		$scope.activeTab = tabName;
	}
	/****************************/
		
	
	$http({
		method : 'GET',
		url : '/retrieve_versioncontrol_master/',
	}).then(function successCallBack(response){
		$scope.versionno=response.data.version;
	});
	 
					$interval( function(){ $scope.getnotificationcount(); }, 600000);
					$interval( function(){ $scope.getnotificationlist(); }, 600000);
					
					$rootScope.fileSizeConversionFactor = CONSTANTS.fileSizeConversionFactor;
					$rootScope.fileSizeUnit = CONSTANTS.fileSizeUnit;
					$rootScope.fileSizeRoundOffFactor = CONSTANTS.fileSizeRoundOffFactor;
					$rootScope.pageSizeLimit = CONSTANTS.pageSizeLimit;
					$rootScope.defaultPageSize = CONSTANTS.defaultPageSize;
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
								$scope.updatenotificationcount(formid);
							});
						}
						
					}
					
					$scope.path = '';
					$scope.alertnavigation = function(modulecode,formid,taskid){
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
								$scope.updatenotificationcount(formid);
							});
						}else{
							window.location = "#/Taskschedule/Overdue/"
						}
						
					}
					
										
						systemNotificationService
						.getsearchdata()
						.then(
								function(response) {
									$scope.searchdata = response.data ;		
									$scope.modulenames=[];
									$scope.searchdata = response.data ;	
									for(var i=0;i<$scope.searchdata.length;i++){
										$scope.modulenames.push({'key': $scope.searchdata[i][0], 'value1':$scope.searchdata[i][1]});
									}
									$scope.searchoption = {
											placeholder: "Search",
											dataTextField: "key",
							                dataValueField: "value1",
							                filter: "contains",
							                minLength: 1,
							                enforceMinLength: false,
							                suggest: true,
							                highlightFirst: true,
							                dataSource: { data: $scope.modulenames }
							            };
								})
											
					$scope.getnotificationlist = function() {
					systemNotificationService
					.ShowNotificationHistory()
					.then(
							function(response) {
								 $scope.geterrormessages=response.data.message;	
					               $scope.geterrorstatus=response.data.errorstatus;
					               $scope.geterrorstatuscode=response.data.status;                
					               $scope.dataerror =response.data.message;  
					               if(response.data.status==0 && response.data.length!=0 ){
					            	   $rootScope.notificationList = response.data.data;
					            	   $rootScope.notificationmessagelength=$scope.notificationList.length;
					               }else{		
										$scope.newDisabled = false;
										$scope.errordetails=response.data.exceptionDetail;
					               	$scope.showexception=response.data.showerrormessage
					               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
										$scope.dataerror = [response.data.message[0]];			
										
									}   	  
							})
					}
					$scope.getnotificationlist();
					
					
					
						 
					
					
					$scope.updatenotificationcount = function(formid) {												
						systemNotificationService.updatecount(formid).then(function(response){
							$scope.getnotificationcount();
							$scope.getnotificationlist();
						})
					};
					
					systemNotificationService.getalertcount();
					systemNotificationService.getalertmessage();
					
					$scope.getnotificationcount = function() {
					systemNotificationService
					.getnotifycount()
					.then(
							function(response) {
								$rootScope.notificationCount = response.data.data[0];										
							})
					}
					$scope.getnotificationcount();
					
					$scope.getsearchmessage = function() {
						for (var i=0;i<$scope.searchdata.length;i++){
							if ($scope.searchdata[i][0]==$scope.userdata){
								systemNotificationService
								.getdataurl($scope.searchdata[i][1])
								.then(function(response) {						
												$scope.taskurl = response.data;
												$scope.path = $scope.taskurl[0].url;
												window.location = $scope.path										
											});
								break;
							}
						}		
								
						}
						$scope.getnotificationcount();
					
					// Fetch USER profile Picture
					systemNotificationService
					.getUserProfilePicture()
					.then(
							function(response) {
								if(response.data.status === 0 && response.data.data.length > 0) {
									$rootScope.profileURI = response.data.data[0].profilePicURI;
								} else {
									$rootScope.profileURI = "img/default-profile.png"
								}
					})
					
					systemNotificationService
							.ShowUserDetailData()
							.then(
									function(response) {
										$scope.userDetailList = response.data.data;
										$scope.userrank = $scope.userDetailList[0].rankName;
										$scope.userrole = $scope.userDetailList[0].rolename;
										$scope.username = $scope.userDetailList[0].empName;
										$scope.empcode = $scope.userDetailList[0].empCode;
//										$rootScope.usercode = $scope.userDetailList[0].userCode;
										$scope.vesselname = $scope.userDetailList[0].shipname;
									})
					

					systemNotificationService
							.ShowVesselTaskManagerData()
							.then(
									function(response) {
										$rootScope.vesselDetailList = response.data;
										$rootScope.taskCount = $scope.vesselDetailList.length;
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
							$window.alert('third tab only function');
						};
					};

					// tab login ended

					$scope.showSelectValue = function(mySelect) {
					}

					// Dashboard

					var urlParams = $location.absUrl();
					if (urlParams.includes("graphReport.html")) {

						var urlParams = $location.absUrl().split("?");
						var dname = urlParams[1];

						systemNotificationService
								.generateDashboardReport(dname)
								.then(function(response) {
									var resultFn = response.data;
									$scope.tabs = resultFn.tab;
									$scope.dashboardID = resultFn.dashboardID;

								});

					}

					$scope.initTab = function(dashboardID, tabId) {
						//alert("dashboardID---"+dashboardID)
						$scope.results = "";
						systemNotificationService.generateDashboard(
								dashboardID, tabId, 'filter', renderChart);

					};

					var renderChart = function(tabId, response) {

						var output = response.data;
						var json = [];
						json = output;

						for (i = 0; i < json.length; i++) {
							var data = json[i];
							var finaldata = data[0];

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
							} else if (finaldata.chartType == "label") {
								var datas = finaldata.data;

								var inspectActuals = datas[0].inspectActual;
								var inspectTotals = datas[0].inspectTotal;
								var accidentFrees = datas[0].accidentFree;
								labelChart(inspectActuals, inspectTotals,
										accidentFrees);
							}

						}

					};

					var donutChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmPieChart();
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
							}
							var bb = chartData.data;
							var a = bb[0].y;
							var b = bb[1].y;							
							var diffPercent = ((b / a) * 100).toFixed(2);
							if (diffPercent == 'Infinity'
									|| diffPercent == 'NaN') {
								diffPercent = '0';
							}
							chart.titleField = "x";
							chart.valueField = "y";
							// chart.sequencedAnimation = true;
							// chart.startEffect = "elastic";
							chart.innerRadius = "80%";
							chart.startDuration = 0;
							chart.labelRadius = -130, chart.pullOutRadius = 0,
									chart.labelRadius = 0;
							chart.marginBottom = 40, chart.balloonText = "";
							chart.colors = [ color, "#CCCCCC" ];
							chart.labelsEnabled = false;
							chart.allLabels = [ {
								"x" : "50%",
								"y" : "40%",
								"text" : chartData.chartTitle,
								"size" : 14,
								"align" : "middle",
								"color" : "#f3413a"
							}, {
								"x" : "50%",
								"y" : "45%",
								"text" : diffPercent + "%",
								"size" : 16,
								"align" : "middle",
								"color" : "#555"
							} ],
									// WRITE

									createChart(tabId, chartID, chart,
											chartData, false);

						} catch (err) {
							alert(err.message);
						}

					};

					var labelChart = function(inspectActuals, inspectTotals,
							accidentFrees) {

						try {
							$scope.insAct = inspectActuals;

							$scope.insTot = inspectTotals;
							$scope.insAcc = accidentFrees;

						} catch (err) {
							alert(err.message);
						}

					};

					var stackBarChart = function(tabId, chartID, chartData) {

						var chart = new AmCharts.AmSerialChart();

						try {
							chart.dataProvider = chartData.data;
		
							chart.categoryField = "x";
							chart.startDuration = 1;

							// AXES
							// category
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 40;
							categoryAxis.gridPosition = "start";
							categoryAxis.labelFunction = formatXaxisLabel;
							categoryAxis.title = chartData.xlabel;
							categoryAxis.titleBold = false;
							categoryAxis.gridAlpha = 0;
							categoryAxis.gridCount = 100;

							var valueAxis = new AmCharts.ValueAxis();
							valueAxis.gridAlpha = 0.05;
							if (chartData.stackType)
								valueAxis.stackType = "regular";

							valueAxis.labelFunction = formatYaxisLabel;
							valueAxis.title = chartData.ylabel;

							chart.addValueAxis(valueAxis);
							// GRAPH
							var unique = chartData.ul;
							for (var i = 0; i < unique.length; i++) {

								graph = new AmCharts.AmGraph();
								graph.title = unique[i];
								// graph.labelText = "[[value]]";
								graph.valueField = "y" + i;
								graph.type = "column";
								graph.lineAlpha = 0;
								graph.fillAlphas = 1;
								graph.balloonText = "<span >[[category]]</span><br><span style='font-size:14px'>[[title]]:<b>[[value]]</b></span>";
								chart.addGraph(graph);
							}

							// CURSOR
							var chartScrollbar = new AmCharts.ChartScrollbar();
							chartScrollbar.scrollbarHeight = 5;
							chartScrollbar.offset = 15
							chart.addChartScrollbar(chartScrollbar);

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
							alert(err.message);
						}

					};

					var bubbleChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmXYChart();

						try {

							chart.dataProvider = chartData.data;
							chart.addLabel(10, 0, chartData.chartTitle,
									"center", "10", "#333399", 0, "4", false);
							var xAxis = new AmCharts.ValueAxis();
							xAxis.title = chartData.xlabel;
							xAxis.titleBold = false;
							xAxis.position = "bottom";
							xAxis.dashLength = 1;
							xAxis.axisAlpha = 0;
							chart.addValueAxis(xAxis);

							var yAxis = new AmCharts.ValueAxis();
							yAxis.position = "left";
							yAxis.title = chartData.ylabel;
							yAxis.dashLength = 1;
							yAxis.axisAlpha = 0;
							chart.addValueAxis(yAxis);
							var unique = [];
							unique = chartData.ul;
							for (var i = 0; i < unique.length; i++) {
								var graph = new AmCharts.AmGraph();
								graph.title = unique[i];
								graph.balloonText = chartData.xlabel
										+ ":<b>[[x]]</b></br> "
										+ chartData.ylabel + ":<b>[[y]]</b>";
								graph.xField = "x" + i;
								graph.yField = "y" + i;
								graph.lineAlpha = 0;
								graph.valueField = "s" + i;
								graph.bullet = "round";
								chart.addGraph(graph);
							}

							// LEGEND
							var legend = new AmCharts.AmLegend();
							legend.position = "right";
							chart.addLegend(legend);

							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chart.addChartCursor(chartCursor);

							// SCROLLBAR

							var chartScrollbar = new AmCharts.ChartScrollbar();
							chartScrollbar.scrollbarHeight = 5;
							chartScrollbar.offset = 15
							chart.addChartScrollbar(chartScrollbar);

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
							alert(err.message);
						}
					};

					var lineChart = function(tabId, chartID, chartData) {

						var chart = new AmCharts.AmSerialChart();

						try {

							chart.dataProvider = chartData.data;
				 
							chart.categoryField = "x";
							chart.startDuration = 1;

							// AXES
							// category axis
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 40;
							categoryAxis.gridPosition = "start";
							categoryAxis.title = chartData.xlabel;
							categoryAxis.titleBold = false;
							categoryAxis.labelFunction = formatXaxisLabel;
							categoryAxis.gridAlpha = 0;

							var valueAxis = new AmCharts.ValueAxis();
							valueAxis.title = chartData.ylabel;
							valueAxis.gridThickness = "0";
							valueAxis.titleBold = false;
							valueAxis.labelFunction = formatYaxisLabel;
							chart.addValueAxis(valueAxis);

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
									chart.addGraph(graph);
								}
							} else {
								var graph = new AmCharts.AmGraph();
								graph.valueAxis = valueAxis;
								// graph.title = unique[i];
								graph.valueField = "y";
								graph.bullet = "square";
								graph.hideBulletsCount = 30;
								graph.bulletBorderThickness = 1;
								chart.addGraph(graph);
							}
							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chartCursor.cursorAlpha = 0.1;
							chartCursor.fullWidth = true;
							chartCursor.valueLineBalloonEnabled = true;
							chart.addChartCursor(chartCursor);

							// SCROLLBAR
							var chartScrollbar = new AmCharts.ChartScrollbar();
							chart.addChartScrollbar(chartScrollbar);

							// LEGEND
							if (chartData.ul != undefined) {
								var legend = new AmCharts.AmLegend();
								legend.marginLeft = 110;
								legend.useGraphSettings = true;
								// legend.position = "right";
								chart.addLegend(legend);
							}
							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
							alert(err.message);
						}

					};

					var barLineChart = function(tabId, chartID, chartData) {

						var chart = new AmCharts.AmSerialChart();

						try {

							chart.dataProvider = chartData.data;
 
							chart.categoryField = "x";
							chart.startDuration = 1;

							// AXES
							// category axis
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 40;
							categoryAxis.gridPosition = "start";
							categoryAxis.labelFunction = formatXaxisLabel;
							// categoryAxis.title = chartData.xlabel;
							// categoryAxis.titleBold=false;

							categoryAxis.gridAlpha = 0;
							categoryAxis.fontSize = 8;

							// as we have data of different units, we create two
							// different value axes
							// Duration value axis
							var durationAxis = new AmCharts.ValueAxis();
							durationAxis.gridAlpha = 0.05;
							durationAxis.axisAlpha = 0;
							durationAxis.title = chartData.zlabel;
							durationAxis.titleBold = false;
							durationAxis.titleFontSize = 10;
							durationAxis.tickLength = 0;
							durationAxis.labelFunction = formatYaxisLabel;
							durationAxis.position = "right";
							durationAxis.minimum = 0;
							chart.addValueAxis(durationAxis);

							// Distance value axis
							var distanceAxis = new AmCharts.ValueAxis();
							distanceAxis.gridAlpha = 0;
							distanceAxis.axisAlpha = 0;
							distanceAxis.labelFunction = formatYaxisLabel;
							distanceAxis.title = chartData.ylabel;
							distanceAxis.titleBold = false;
							distanceAxis.titleFontSize = 10;
							distanceAxis.tickLength = 0;
							chart.addValueAxis(distanceAxis);

							// GRAPHS
							// duration graph
							var durationGraph = new AmCharts.AmGraph();

							durationGraph.valueField = "z";
							durationGraph.type = "line";
							durationGraph.valueAxis = durationAxis;
							durationGraph.title = chartData.zlabel;
							// durationGraph.lineColor = "#CC0000";
							durationGraph.labelText = "[[value]]";
							durationGraph.balloonText = chartData.zlabel
									+ " : [[value]]";
							if (chartData.type == "barline")
								durationGraph.lineThickness = 1;
							else
								durationGraph.lineThickness = 0;

							durationGraph.legendValueText = "[[value]]";
							durationGraph.bullet = "round";
							durationGraph.bulletBorderColor = "#CC0000";
							durationGraph.bulletBorderAlpha = 1;
							durationGraph.bulletBorderThickness = 2;
							chart.addGraph(durationGraph);

							// distance graph
							var distanceGraph = new AmCharts.AmGraph();

							distanceGraph.valueField = "y";
							distanceGraph.type = "column";
							distanceGraph.fillAlphas = 1;
							if (chartData.colorPattern != undefined) {
								distanceGraph.fillColorsField = "bc";
								distanceGraph.lineColor = "#000000";
								distanceGraph.lineAlpha = 0;
							}
							distanceGraph.title = chartData.ylabel;
							distanceGraph.valueAxis = distanceAxis;
							distanceGraph.balloonText = chartData.ylabel
									+ " : [[value]]";
							distanceGraph.legendValueText = "[[value]]";

							chart.addGraph(distanceGraph);

							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chartCursor.cursorPosition = "mouse";
							chart.addChartCursor(chartCursor);

							// LEGEND
							/*
							 * var legend = new AmCharts.AmLegend();
							 * legend.useGraphSettings = true; legend.position =
							 * "bottom"; chart.addLegend(legend);
							 */

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
							alert(err.message);
						}

					};

					var barChart = function(tabId, chartID, chartData) {

						var chart = new AmCharts.AmSerialChart();

						try {
							chart.dataProvider = chartData.data;
		 
							chart.categoryField = "x";
							chart.startDuration = 1;

							// AXES
							// category
							var categoryAxis = chart.categoryAxis;
							categoryAxis.labelRotation = 40;
							categoryAxis.gridPosition = "start";
							categoryAxis.labelFunction = formatXaxisLabel;
							categoryAxis.title = chartData.xlabel;
							categoryAxis.titleBold = false;
							categoryAxis.titleFontSize = 10;
							categoryAxis.gridAlpha = 0;
							categoryAxis.fontSize = 8;

							var valueAxis = new AmCharts.ValueAxis();
							valueAxis.gridAlpha = 0.05;
							valueAxis.labelFunction = formatYaxisLabel;
							valueAxis.title = chartData.ylabel;
							valueAxis.titleBold = false;
							valueAxis.titleFontSize = 10;

							chart.addValueAxis(valueAxis);
							// GRAPH
							var graph = new AmCharts.AmGraph();
							graph.valueField = "y";
							graph.balloonText = "<span style='font-size:13px;'>[[category]]</span>:<span style='font-size:12px'><b>[[value]]</b></span>";
							graph.type = "column";
							graph.fillColors = [ "#3D4791", "#6DB6F2" ];
							graph.lineAlpha = 0;

							graph.fillAlphas = 0.8;
							graph.labelText = "[[value]]";
							chart.addGraph(graph);

							// CURSOR
							var chartCursor = new AmCharts.ChartCursor();
							chartCursor.cursorPosition = "mouse";
							chart.addChartCursor(chartCursor);

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
							alert(err.message);
						}

					};
					

					//Version no
										
					
					var pieChart = function(tabId, chartID, chartData) {
						var chart = new AmCharts.AmPieChart();

						try {

							chart = new AmCharts.AmPieChart();
							chart.dataProvider = chartData.data;
	 
							chart.titleField = "x";
							chart.valueField = "y";
							chart.labelsEnabled = false;
							// this makes the chart 3D
							chart.depth3D = 30;
							chart.angle = 50;

							// LEGEND
							legend = new AmCharts.AmLegend();
							// legend.align = "center";
							legend.position = "right";
							legend.fontSize = 8;
							legend.autoMargins = false;
							legend.markerType = "circle";
							chart.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>";
							chart.labelsEnabled = false;
							chart.addLegend(legend);
							// WRITE

							createChart(tabId, chartID, chart, chartData, true);

						} catch (err) {
							alert(err.message);
						}

					};

					function createChart(tabId, chartID, chart, chartData,
							exportOption) {
				 
			 
						try {
							var uniqueID = tabId + chartID;
							 
						      //chartData.chartTitle
						      var element = document.createElement("div");
						      //alert("element1---"+element)
						      // element.className = "row";
						      element.style.padding = "0px";
						      element.id = uniqueID + "panel";
						 
						      document.getElementById(tabId + "chart").appendChild(
						        element);
						       
						      var element = document.createElement("div");
						      //alert("element2---"+element)
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
						      //alert("element3---"+element)
						      element.className = "x_title";
						      element.id = uniqueID + "x_title";
						      document.getElementById(uniqueID + "panelinner")
						        .appendChild(element);
						      document.getElementById(uniqueID + "x_title").innerHTML=chartData.chartTitle;
						      }

						      var element = document.createElement("div");
						      //alert("element3---"+element)
						      element.className = "x_panel";
						      element.id = uniqueID + "x_panel";
						      document.getElementById(uniqueID + "panelinner")
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
					 
							if (exportOption) {
								chart["export"] = {
									"enabled" : true,
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
							alert(error);
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