var load = function() {
   	var head = document.getElementsByTagName('head').item(0);
	var script = document.createElement('script');
    script.src = 'Sidebar/scripts/components/jquery-fullscreen/jquery.fullscreen-min.js'
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/bower_components/jquery-storage-api/jquery.storageapi.min.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/bower_components/bootstrap/dist/js/bootstrap.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/functions.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/bower_components/wow/dist/wow.min.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/colors.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/left-sidebar.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/navbar.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/navbar.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/main.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/tables-datatable.js';
    head.appendChild(script);
}
var fullscreen = function(){

    $("HTML").fullScreen(true);
}
