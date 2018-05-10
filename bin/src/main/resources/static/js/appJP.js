var app = angular.module('mackAppJP', ['ngRoute','ngResource', 'ngAnimate', 'angularUtils.directives.dirPagination', 'kendo.directives', 'toaster','ui.bootstrap','countTo']);

app.config(function($routeProvider){
    $routeProvider
        .when('/Dashboard',{
            templateUrl: '/views/Dashboard.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Forms',{
            templateUrl: '/views/Forms/mack-s_moduleJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Taskmanager',{
            templateUrl: '/views/TaskManager/TaskmoduleJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Master',{
            templateUrl: '/views/Master/mastermoduleJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Security',{
            templateUrl: '/views/Security/securitymoduleJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Edoc',{
            templateUrl: '/views/E-doc/edocsJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Inspection',{
            templateUrl: '/views/Inspection/hseqmoduleJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Reports',{
            templateUrl: '/views/Reports/reportsJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/Settings',{
            templateUrl: '/views/Settings/settingsJP.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/NearmissMain',{
            templateUrl: '/views/Forms/nearMiss-main.html',
            controller: 'nearMissMainController'
        })
        .when('/NearmissForm/:id*',{
            templateUrl: '/views/Forms/nearmissreport.html',
            controller: 'nearMissCtrl'
        })
         .when('/CreatedTask',{
            templateUrl: '/views/TaskManager/Viewtask.html',
            controller: 'TaskManagershowctrl'
        })
        .when('/CreateTask',{
            templateUrl: '/views/TaskManager/createtask.html',
            controller: 'TaskManagerctrl'
        })
         .when('/ViewTask/:key/:id*',{
            templateUrl: '/views/TaskManager/createtask.html',
            controller: 'TaskManagerctrl'
        })
         .when('/TaskMangerDashboard',{
            templateUrl: '/views/TaskManager/taskmanagerDashboard.html',
            controller: 'systemNotificationCtrl'
        })
          .when('/Taskschedule/:name',{
            templateUrl: '/views/TaskManager/taskschedule.html',
            controller: 'Taskschedulectrl'
        })
         .when('/NotificationHistory',{
            templateUrl: '/views/TaskManager/ShipNotificationHistory.html',
            controller: 'notificationHistoryCtrl'
        })
        .when('/fleet_master',{
            templateUrl: '/views/Master/fleet_master.html',
            controller: 'FleetMasterCtrl'
        })
        .when('/vessel_type',{
            templateUrl: '/views/Master/vessel_type.html',
            controller: 'VslTypeCtrl'
        })
        .when('/CountryMaster',{
            templateUrl: '/views/Master/CountryMaster.html',
            controller: 'CountrymasterCtrl'
        })
        .when('/PortMaster',{
            templateUrl: '/views/Master/PortMaster.html',
            controller: 'PortmasterCtrl'
        })
        .when('/TerminalMaster',{
            templateUrl: '/views/Master/TerminalMaster.html',
            controller: 'terminalCtrl'
        })
        .when('/crewlistall',{
            templateUrl: '/views/Master/crewlistall.html',
            controller: 'USDControllerMain'
        })
        .when('/shipuserlistNew/:id',{
            templateUrl: '/views/Master/shipuserlistNew.html',
            controller: 'USDController'
        })
         .when('/shipuserlistNewView/:id',{
            templateUrl: '/views/Master/shipuserlistNewView.html',
            controller: 'USDController'
        })
        .when('/vesselMasterMain',{
            templateUrl: '/views/Master/vesselMasterMain.html',
            controller: 'vesselMasterMainCtrl'
        })
        .when('/vesselMaster/:id*',{
            templateUrl: '/views/Master/vesselMaster.html',
            controller: 'vesselMasterCtrl'
        })
        .when('/crewMapping',{
            templateUrl: '/views/Master/crewMapping.html',
            controller: 'crewMappingCtrl'
        })
        .when('/WorkFlowHistory-View',{
            templateUrl: '/views/Settings/WorkFlowHistory-View.html',
            controller: 'workFlowHistoryCtrl'
        })
        .when('/Tasksetting',{
            templateUrl: '/views/Settings/Tasksetting.html',
            controller: 'TaskSettingsCtrl'
        })
        .when('/notificationsetting',{
            templateUrl: '/views/Settings/notificationsetting.html',
            controller: 'notificationsettingController'
        })
        .when('/systemconfig',{
            templateUrl: '/views/Settings/systemconfig.html',
            controller: 'systemconfigController'
        })
	  .when('/AccidentMain',{
            templateUrl: '/views/Forms/accident-main.html',
            controller: 'accidentReportMainController'
        })
        .when('/AccidentForm/:id*',{
            templateUrl: '/views/Forms/accidentReport.html',
            controller: 'AccidentReportController'
        })
        .when('/RiskMgntMain',{
            templateUrl: '/views/Forms/RiskManagement.html',
            controller: 'riskManagementMainController'
        })
        .when('/RiskMgntForm/:id*',{
            templateUrl: '/views/Forms/RiskManagementNew.html',
            controller: 'riskManagementCtrl'
        })
         .when('/SafetyMain',{
            templateUrl: '/views/Forms/safety-main1.html',
            controller: 'safetyReportMainCtrl'
        })
        .when('/SafetyReport/:id*',{
            templateUrl: '/views/Forms/safety-meeting-feedbacks.html',
            controller: 'safetyReportCtrl'
        })
         .when('/CrewhealthMain',{
            templateUrl: '/views/Forms/CrewHealthLog-view.html',
            controller: 'CrewHealthMainController'
        })
        .when('/CrewHealthReport/:id*',{
            templateUrl: '/views/Forms/CrewHealthLog.html',
            controller: 'CHLController'
        })
         .when('/DrillMain',{
            templateUrl: '/views/Forms/DrillReport-view.html',
            controller: 'DrillreportMainController'
        })
        .when('/DrillReport/:id*',{
            templateUrl: '/views/Forms/DrillReport.html',
            controller: 'DrillReportCtrl'
        })
	   .when('/ModuleCreation',{
            templateUrl: '/views/Security/modulecreation.html',
            controller: 'ModuleCreationController'
        })
        .when('/ModuleIndex',{
            templateUrl: '/views/Security/moduleindex.html',
            controller: 'MdlIndexController'
        })
        .when('/DepartmentMaster',{
            templateUrl: '/views/Security/departmentMaster.html',
            controller: 'DepartmentMasterCtrl'
        })
        .when('/RoleMaster',{
            templateUrl: '/views/Security/roleMaster.html',
            controller: 'RoleMasterCtrl'
        })
        .when('/RankMaster',{
            templateUrl: '/views/Security/rankMaster.html',
            controller: 'RankMasterCtrl'
        })
		.when('/RankMapping', {
			templateUrl : '/views/Security/rankMapping.html',
			controller : 'RankMappingCtrl'
		})
        .when('/ShipAccessManagement',{
            templateUrl: '/views/Security/ShipAccessManagement.html',
            controller: 'rolesCtrl'
        })
        .when('/ShoreDepartmentMaster',{
            templateUrl: '/views/Security/shoreDepartmentMaster.html',
            controller: 'ShoreDepartmentMasterCtrl'
        })
        .when('/ShoreRoleMaster',{
            templateUrl: '/views/Security/shoreRoleMaster.html',
            controller: 'ShoreRoleMasterCtrl'
        })
        .when('/ShoreRankMaster',{
            templateUrl: '/views/Security/shoreRankMaster.html',
            controller: 'ShoreRankMasterCtrl'
     
		}).when('/ShoreRankMapping', {
			templateUrl : '/views/Security/shoreRankMapping.html',
			controller : 'ShoreRankMappingCtrl'
		}).when('/ShoreAccessManagement',{
            templateUrl: '/views/Security/ShoreAccessManagement.html',
            controller: 'shoreRolesCtrl'
        })
        .when('/ShipPro-Permission/:id*',{
            templateUrl: '/views/Security/ShipPro-Permission.html',
            controller: 'permissionsCtrl'
        })
        .when('/ShorePro-Permission/:id*',{
            templateUrl: '/views/Security/ShorePro-Permission.html',
            controller: 'shorePermissionsCtrl'
        })
	    .when('/ExternalInspectionMain',{
        	templateUrl: '/views/Inspection/externalInspectionMain.html',
            controller: 'externalInspectionMainController'
        })
        .when('/ExternalInspection/:id*',{
        	templateUrl: '/views/Inspection/externalInspection.html',
            controller: 'externalInspectionController'
        })
        .when('/QSHEFeedBack-main', {
        	templateUrl: '/views/Inspection/qsheFeedbackMain.html',
            controller: 'QSHEFeedBackMainCtrl'
        })
        .when('/QSHEFeedBackMain/:id*', {
        	templateUrl: '/views/Inspection/qsheFeedback.html',
            controller: 'QSHEFeedBackCtrl'
        })
        .when('/GraphReport/:id*',{
        	templateUrl: '/views/Reports/graphReport.html',
            controller: 'systemNotificationCtrl'
        })
        .when('/activemq',{
        	templateUrl: '/views/communications/activemqmaster.html',
            controller: 'activemqCtrl'
        })
        .when('/activemq/:id*',{
        	templateUrl: '/views/communications/activemqDetail.html',
            controller: 'activemqDetailCtrl'
        })
        .when('/activemqreceiver',{
        	templateUrl: '/views/communications/activemqmasterReceiver.html',
            controller: 'activemqReceiverCtrl'
        })
        .when('/activemqreceiver/:id*',{
        	templateUrl: '/views/communications/activemqReceiverDetail.html',
            controller: 'activemqDetailReceiverCtrl'

        }).when('/mailconfig',{
           	templateUrl : '/views/Settings/mailconfig.html',
           	controller: 'mailconfigController'  
        }).when('/mqshoreconfig',{
           	templateUrl : '/views/Settings/mqshoreconfig.html',
           	controller: 'mqconfigController'
    	}).when('/VesselMapping',{
           	templateUrl : '/views/Master/vesselMapping.html',
           	controller: 'vesselMappingController'    
    	}).when('/communication',{
           	templateUrl : '/views/communications/communicationJP.html',
           	controller: 'systemNotificationCtrl'    
    	}).when('/NearMissShare',{
           	templateUrl : '/views/Reports/nearMiss-Share.html',
           	controller: 'nearMissShareController'    
    	}).when('/crewhealthdetails',{
            templateUrl : '/views/Forms/crewhealthdetails.html',
            controller: 'CrewhealthdetailsCtrl' 
    	}).when('/riskManagementGuide',{
            templateUrl : '/views/Forms/RiskManagementGuide.html',
            controller: 'riskManagementCtrl' 
    	}).when('/NearmissGuidance',{
            templateUrl: '/views/Guidance/nearmissguidance.html',
            controller: 'nearMissCtrl'
        }).when('/NearMissShare',{
           	templateUrl : '/views/Reports/nearMiss-Share.html',
           	controller: 'nearMissShareController'    
    	})
    	
    	.otherwise(
            { redirectTo: '/Dashboard'}
        );
       
});
app.service('Connectivity', function($http){
	  this.IsOk = function () {
	    return $http({ method: 'HEAD', url: ""});
	  }
	});
app.constant('CONSTANTS', {
	fileSizeConversionFactor: 1024,
	fileSizeUnit : 'KB',
	fileSizeRoundOffFactor: 1,
	pageSizeLimit: [5, 25, 50, 75, 100],
	defaultPageSize: 25
});
