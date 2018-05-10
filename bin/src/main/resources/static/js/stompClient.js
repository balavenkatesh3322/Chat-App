app.service("websocket",function($q, $timeout, $http, $rootScope){
	// HTTP call to get userid;
	var service = {}, listener = $q.defer(), socket = {
	     client: null,
	     stomp: null
	}, messageIds = [];
	$http.get("/get-session-data/").then(function(response){
		var user = response.data.usercode;
	    service.RECONNECT_TIMEOUT = 30000;
	    service.SOCKET_URL = "/gs-guide-websocket";
	    service.CHAT_TOPIC = "/topic/notification/"+user;
	    service.CHAT_BROKER = "/app/gs-guide-websocket";
	    
	    service.receive = function() {
	      return listener.promise;
	    };
	    
	    initialize();
	    return service;
	});
	
    
    service.send = function(message) {
      var id = Math.floor(Math.random() * 1000000);
      socket.stomp.send(service.CHAT_BROKER, {
        priority: 9
      });
    };
    
    var reconnect = function() {
      $timeout(function() {
        initialize();
      }, this.RECONNECT_TIMEOUT);
    };
    
    var getMessage = function(data) {    	
    	data = JSON.parse(data);
    	console.log(data,"after json parse")
    	$rootScope.alertmessagecount = data.count;
    	$rootScope.alertmessage = data.overDueTask;								
		$rootScope.alertmessagelength=data.overDueTask.length;	
		$rootScope.vesselDetailList = data.taskManagerdata;
		$rootScope.taskCount = data.taskManagerdata.length;
		$rootScope.notificationCount=data.notificationcount.data[0];
		$rootScope.notificationList=data.notificatondata.data;
		console.log($rootScope.notificationList,"before json parse")
		console.log($rootScope.taskCount,"task counttttt")
	    var out = {};
	    return out;
    };
    
    var startListener = function() {
      socket.stomp.subscribe(service.CHAT_TOPIC, function(data) {
        listener.notify(getMessage(data.body));
      });
    };
    
    var initialize = function() {
      socket.client = new SockJS(service.SOCKET_URL);
      socket.stomp = Stomp.over(socket.client);
      socket.stomp.connect({}, startListener);
      socket.stomp.onclose = reconnect;
    };
  });