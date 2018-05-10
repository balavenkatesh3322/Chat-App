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

		

        var states = ['PSC Inspection', 'BP Shipping SIRE Inspection', 'PETRONAS Sire Inspection', 'Annual Flag State'
        ];
        $('.typeahead-1').typeahead({
            source: states
        });
        $.get('/assets/json/100.json', function(data) {
            $('.typeahead-2').typeahead({
                source: data
            });
        }, 'json');
    });

})();
