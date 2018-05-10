app.directive('chosen', function($timeout) {
	var linker = function(scope, element, attr) {
		// update the select when data is loaded
		scope.$watchCollection(attr.chosen, function(newVal, oldVal) {
			$timeout(function() {
				element.trigger('chosen:updated');
			});
		});

		// update the select when the model changes
		scope.$watchCollection(attr.ngModel, function() {
			$timeout(function() {
				element.trigger('chosen:updated');
			});
		});
		element.chosen({max_selected_options: 1});
	};

	return {
		restrict : 'A',
		link : linker
	}
});