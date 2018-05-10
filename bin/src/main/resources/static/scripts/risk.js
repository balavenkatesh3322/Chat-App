
                    function myFunction() {
                        alert("Review Complete !");
                    }

                    function myFunction1() {
                        alert("Risk Assessment Approved !");
                    }
                    function myFunction2() {
                        alert("Not Authorised to Proceed !");
                        $('#idreject').hide();
                        $('#idreject1').hide();
                        $('#idreject2').hide();
                        $('#idreject3').hide();
						$('#idreject4').hide();
                    }
                    function myFunction3() {
                        alert("Risk Assessment Approved !");
                    }
                    function myFunction4() {
                        alert("Risk Assessment Submitted !");
                    }
                    function myFunction4() {
                        alert("Risk Assessment Submitted !");
                    }
                    function myFunction9() {
                        alert("Risk Assessment Saved !");
                    }

                    function showHideFields1(boxid, divid) {
                        if ($('#psyfulldiv').css('display') == 'none') {
                            $('#psyfulldiv').show();
                        } else {
                            $('#psyfulldiv').hide();
                            $('#sr_psy_text_id').val("");
                            $('.psyclass').each(function () {
                                console.log("hai");
                                $(this).prop("checked", false);
                            });
                        }
                    }
                    
                    

                    function calculateRisk(id, id1, tdid) {
                    	angular.element(document.getElementById('initalRiskLevel1')).scope().calculateInitialRisk(id, id1, tdid);
                        var value = $('#' + id).val();
                        var value1 = $('#' + id1).val();
                        if (value == 'N/A' || value1 == 'N/A') {
                            $('#' + tdid).val("N/A");
                            $('#' + tdid).removeClass("bg-success");
                            $('#' + tdid).removeClass("bg-info");
                            $('#' + tdid).removeClass("bg-warning");
                            $('#' + tdid).removeClass("bg-danger");
                            $('#' + tdid).css({"background-color": "white", "color": "black"});
                        } else {
                            if ((value == '1' && value1 == '1') || (value == '1' && value1 == '2') || (value == '2' && value1 == '1')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Very Low");
                                $('#' + tdid).addClass("bg-success");
                            } else if ((value == '1' && value1 == '3') || (value == '1' && value1 == '4')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Low");
                                $('#' + tdid).addClass("bg-info");
                            } else if ((value == '2' && value1 == '2')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Medium");
                                $('#' + tdid).css({"background-color": "#efde73", "color": "white"});
                            } else if ((value == '2' && value1 == '3') || (value == '3' && value1 == '1')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("High");
                                $('#' + tdid).addClass("bg-warning");
                            } else if ((value == '2' && value1 == '4') || (value == '3' && value1 == '2') || (value == '3' && value1 == '3') || (value == '3' && value1 == '4')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Very High");
                                $('#' + tdid).addClass("bg-danger");
                            }
                        }
                    }

                    function calculateRisk1(id, id1, tdid) {
                     	angular.element(document.getElementById('riskControlLevel1')).scope().calculateRiskControlLevel(id, id1, tdid);
                        
                        var value = $('#' + id).val();
                        var value1 = $('#' + id1).val();
                        if (value == 'N/A' || value1 == 'N/A') {
                            $('#' + tdid).val("N/A");
                            $('#' + tdid).removeClass("bg-success");
                            $('#' + tdid).removeClass("bg-info");
                            $('#' + tdid).removeClass("bg-warning");
                            $('#' + tdid).removeClass("bg-danger");
                            $('#' + tdid).css({"background-color": "white", "color": "black"});
                        } else {
                            if ((value == '1' && value1 == '1') || (value == '1' && value1 == '2') || (value == '2' && value1 == '1')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Very Low");
                                $('#' + tdid).addClass("bg-success");
                            } else if ((value == '1' && value1 == '3') || (value == '1' && value1 == '4')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Low");
                                $('#' + tdid).addClass("bg-info");
                            } else if ((value == '2' && value1 == '2')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Medium");
                                $('#' + tdid).css({"background-color": "#efde73", "color": "white"});
                            } else if ((value == '2' && value1 == '3') || (value == '3' && value1 == '1')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("High");
                                $('#' + tdid).addClass("bg-warning");
                            } else if ((value == '2' && value1 == '4') || (value == '3' && value1 == '2') || (value == '3' && value1 == '3') || (value == '3' && value1 == '4')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).val("Very High");
                                $('#' + tdid).addClass("bg-danger");
                            }
                        }
                        var value2 = $('#fa_health').val();
                        if (value2 == 'Very High' || value2 == 'High') {
                            $('#showfields').show();
                            $('#showfields1').show();
                            $('#showfields2').show();
                            $('#showfields3').show();
							$('#approvebutton').show();
                            $('#approvebuttononhigh').hide();
$('#sendbuttonon').show();

                        } else if (value2 == 'Very Low' || value2 == 'Medium' || value2 == 'Low') {
                            $('#showfields').hide();
                            $('#showfields1').hide();
                            $('#showfields2').hide();
                            $('#showfields3').hide();
							$('#approvebutton').hide();
                            $('#approvebuttononhigh').show();
			$('#sendbuttonon').hide();
                        }
                    }

                    function calculateRisk2(id, id1, tdid) {
                    	angular.element(document.getElementById('riskAssemnet2')).scope().calculateInitialRisk2(id, id1, tdid);
                        var value = $('#' + id).val();
                        var value1 = $('#' + id1).val();
                        if (value == 'N/A' || value1 == 'N/A') {
                            $('#' + tdid).html("N/A");
                            $('#' + tdid).removeClass("bg-success");
                            $('#' + tdid).removeClass("bg-info");
                            $('#' + tdid).removeClass("bg-warning");
                            $('#' + tdid).removeClass("bg-danger");
                            $('#' + tdid).css({"background-color": "white", "color": "black"});
                        } else {
                            if ((value == '1' && value1 == '1') || (value == '1' && value1 == '2') || (value == '2' && value1 == '1')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).html("Very Low");
                                $('#' + tdid).addClass("bg-success");
                            } else if ((value == '1' && value1 == '3') || (value == '1' && value1 == '4')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).html("Low");
                                $('#' + tdid).addClass("bg-info");
                            } else if ((value == '2' && value1 == '2')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).html("Medium");
                                $('#' + tdid).css({"background-color": "#efde73", "color": "white"});
                            } else if ((value == '2' && value1 == '3') || (value == '3' && value1 == '1')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).html("High");
                                $('#' + tdid).addClass("bg-warning");
                            } else if ((value == '2' && value1 == '4') || (value == '3' && value1 == '2') || (value == '3' && value1 == '3') || (value == '3' && value1 == '4')) {
                                $('#' + tdid).removeClass("bg-success");
                                $('#' + tdid).removeClass("bg-info");
                                $('#' + tdid).removeClass("bg-warning");
                                $('#' + tdid).removeClass("bg-danger");
                                $('#' + tdid).html("Very High");
                                $('#' + tdid).addClass("bg-danger");
                            }
                        }
                        if ($('#fa_environment').html() == 'High' || $('#fa_environment').html() == 'Very High') {
                            $('#risk1').show();
                            $('#risk2').show();
                            $('#risk3').hide();
                            $('#approvebutton').hide();
                            $('#risk5').hide();
                            $('#manager').show();
                            $('#manager1').show();
                            $('#manager2').show();
                           $('#manager3').show();
                            $('#manager4').show();
                           $('#manager5').show();
                            $('#manager6').show();
                            $('#manager7').show();
                            $('#manager8').show();
                            $('#manager9').show();
                            $('#manager10').show();
						$('#manager11').show();
                            $('#idreject').hide();
                            $('#idreject1').hide();
                            $('#idreject2').hide();
                            $('#idreject3').hide();
							$('#idreject4').hide();
                            $('#reviewprocess').show();
                            $('#approveprocess').hide();
							$('#manager').hide();
							$('#manager3').hide();
							$('#manager4').hide();
							$('#manager5').hide();
							$('#manager6').hide();
							$('#manager7').hide();
							$('#manager8').hide();
							$('#manager9').hide();
							$('#manager10').hide();
							$('#manager11').hide();
							$('#lastdiv').hide();
                            $('#section5').show();
                        } else if ($('#fa_environment').html() == 'Low' || $('#fa_environment').html() == 'Very Low' || $('#fa_environment').html() == 'Medium') {
                            $('#risk1').hide();
                            $('#risk2').hide();
                            $('#risk3').show();
                            $('#approvebutton').show();
                            $('#risk5').show();
                            $('#manager').hide();
                            $('#manager1').hide();
                            $('#manager2').hide();
                            $('#manager3').hide();
                            $('#manager4').hide();
                            $('#manager5').show();
                            $('#manager6').show();
                            $('#manager7').show();
                            $('#manager8').show();
                            $('#manager9').hide();
							$('#manager11').show();
                            $('#manager10').hide();
                            $('#idreject').show();
                            $('#idreject1').show();
                            $('#idreject2').show();
                            $('#idreject3').show();
							$('#idreject4').show();
                            $('#reviewprocess').hide();
                            $('#approveprocess').show();
                            $('#section5').show();
                        }
                    }
					
					function showManager(){
						$('#manager').show();
							$('#manager3').show();
							$('#manager4').show();
							$('#manager5').show();
							$('#manager6').show();
							$('#manager7').show();
							$('#manager8').show();
							$('#manager9').show();
							$('#manager10').show();
							$('#manager11').show();
							$('#lastdiv').show();
							$('#section5').hide();
							$('#reviewprocess').hide();
							$('#risk1').hide();
							$('#risk2').hide();
					}