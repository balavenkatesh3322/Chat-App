var load = function() {
    var head = document.getElementsByTagName('head').item(0);
    var script = document.createElement('script');
    script.src = 'Sidebar/bower_components/jquery-storage-api/jquery.storageapi.min.js';
    head.appendChild(script);
    var script = document.createElement('script');
    script.src = 'Sidebar/scripts/colors.js';
    head.appendChild(script);
 var script = document.createElement('script');
    script.src = 'Sidebar/scripts/components/jquery-fullscreen/jquery.fullscreen-min.js'
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
var rightSideBar = function(){
 $('.right-sidebar-outer').toggleClass('show-from-right');
}
var leftSideBar = function(){
 var config = $.localStorage.get('config');
    var layout = config.layout;
 if (layout === 'default-sidebar') {
        $('body').attr('data-layout', 'collapsed-sidebar');
        config.layout = 'collapsed-sidebar';
        $.localStorage.set('config', config);
    } else if (layout === 'collapsed-sidebar') {
        $('body').attr('data-layout', 'default-sidebar');
        config.layout = 'default-sidebar';
        $.localStorage.set('config', config);
    } else {
        $('body').toggleClass('layout-collapsed');
    }
}