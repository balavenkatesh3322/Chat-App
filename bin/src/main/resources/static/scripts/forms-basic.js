/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = $.localStorage.get('config');
        $('body').attr('data-layout', config.layout);
        $('body').attr('data-palette', config.theme);
        $('body').attr('data-direction', config.direction);

        var assigntask = $('.forms-basic #assigntask');
        assigntask.floatingLabels();

      
		 var assignto = $('.forms-basic #assignto');
        assignto.floatingLabels({
            errorBlock: 'Please enter Assign to'
        });
		
		 var task = $('.forms-basic #task');
        task.floatingLabels({
            errorBlock: 'Please enter Task'
        });
		
		var taskdescription = $('.forms-basic #taskdescription');
        taskdescription.floatingLabels({
            errorBlock: 'Please enter Task Description'
        });
	

        var email = $('.forms-basic #email');
        email.floatingLabels({
            errorBlock: 'Please enter your email',
            isEmailValid: 'Please enter a valid email'
        });

     
    });

})();
