app.factory('Auth', function($http, $timeout) {
 return {
    allowed : function(permission, permissions) {
        return _.includes(permissions, permission);
    }
};});