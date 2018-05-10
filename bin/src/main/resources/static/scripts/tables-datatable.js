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

        $('#example-1').DataTable({
            "ajax": '/assets/json/datatables.json'
        });

          $('#example-2,#example-3,#example-4,#example-5,#example-6,#example-7').DataTable();
			
	/*Alltask.hmtl*/

		$('#alltask-table1,#alltask-table2,#alltask-table3,#alltask-table4,#alltask-table5').DataTable();
			
    });

})();


