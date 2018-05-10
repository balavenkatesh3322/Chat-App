app.service('notificationHistoryServcie',function($http){
	
	this.btnShowActionPerformed = function(fromDate,toDate){
		form_data = {
				'fromdate':fromDate,
				'todate': toDate,
				};
		console.log(form_data,"form_data")
		return $http({
				method : 'POST',
				url : '/get-notification-history-for-date/',
				 dataType: 'json',
	 			    data: form_data,
	 			    
			});
	}
	
	this.ShowNotificationHistory = function(){
		return $http({
				method : 'GET',
				url: "/get-notification-history-for-ship-date/",
			});
	}
	
});