 function calculateRisk(id,id1,tdid){
	 var value=$('#'+id).val();
	 var value1=$('#'+id1).val();
	 if((value=='0')|| (value1=='0')){
		 	$('#'+tdid).removeClass("matrix_v_low");
			$('#'+tdid).removeClass("matrix_low");
			$('#'+tdid).removeClass("matrix_med");
			$('#'+tdid).removeClass("matrix_high");
			$('#'+tdid).removeClass("matrix_v_high");
			$('#'+tdid).addClass("matrix_na");
			$('#'+tdid).html("N/A");
	 }else {
		if((value=='1' && value1=='1')|| (value=='1' && value1=='2')|| (value=='2' && value1=='1')){
			$('#'+tdid).removeClass("matrix_low");
			$('#'+tdid).removeClass("matrix_med");
			$('#'+tdid).removeClass("matrix_high");
			$('#'+tdid).removeClass("matrix_v_high");
			$('#'+tdid).removeClass("matrix_na");
		    $('#'+tdid).addClass("matrix_v_low");
			$('#'+tdid).html("Very Low");
		}else if((value=='1' && value1=='3')|| (value=='1' && value1=='4')){
			$('#'+tdid).removeClass("matrix_v_low");
			$('#'+tdid).removeClass("matrix_med");
			$('#'+tdid).removeClass("matrix_high");
			$('#'+tdid).removeClass("matrix_v_high");
			$('#'+tdid).removeClass("matrix_na");
			$('#'+tdid).addClass("matrix_low");
			$('#'+tdid).html("Low");
		}else if((value=='2' && value1=='2')){
			$('#'+tdid).removeClass("matrix_v_low");
			$('#'+tdid).removeClass("matrix_low");
			$('#'+tdid).removeClass("matrix_high");
			$('#'+tdid).removeClass("matrix_v_high");
			$('#'+tdid).removeClass("matrix_na");
			$('#'+tdid).addClass("matrix_med");
			$('#'+tdid).html("Medium");
		}else if((value=='2' && value1=='3')||(value=='3' && value1=='1')){
			$('#'+tdid).removeClass("matrix_v_low");
			$('#'+tdid).removeClass("matrix_low");
			$('#'+tdid).removeClass("matrix_med");
			$('#'+tdid).removeClass("matrix_v_high");
			$('#'+tdid).removeClass("matrix_na");
			$('#'+tdid).addClass("matrix_high");
			$('#'+tdid).html("High");
		}else if((value=='2' && value1=='4')||(value=='3' && value1=='2')||(value=='3' && value1=='3')||(value=='3' && value1=='4')){
			$('#'+tdid).removeClass("matrix_v_low");
			$('#'+tdid).removeClass("matrix_low");
			$('#'+tdid).removeClass("matrix_med");
			$('#'+tdid).removeClass("matrix_high");
			$('#'+tdid).removeClass("matrix_na");
			$('#'+tdid).addClass("matrix_v_high");
			$('#'+tdid).html("Very High");
		}
	 }
 }
 

 function showHideFields(boxid,divid){
if($('#'+boxid). prop("checked") == true){
$('#'+divid).show();
}else{envproblemtxtid
	$('#'+divid).hide();
} 
 }
 
 function showHideFields2(boxid,divid){
	if($('#'+boxid). prop("checked") == true){
	$('#'+divid).show();
	}else{
	$('#'+divid).hide();
	$('.psyclass').each(function(){
		 $(this).prop("checked",false);
	 });
		 $('#sr_psy_text_id').val("");
	}
 
 }

 function coptyTextToPsyc(value,obj){
	 var i=0;
	 if(obj.checked==true){
		 var tex=$('#sr_psy_text_id').val();
	 if(tex!=null && (tex.length)>0){
		 value=tex+"\n"+value;
	 }
	$('#psyproblemboxid').prop("checked",true);
	$('#psyproblemdivid').show();
	 $('.psyclass').each(function(){
		 //console.log("--"+this.id);
	 });
   $('#sr_psy_text_id').val(value);
	 }else{
		 
		  var tex1=$('#sr_psy_text_id').val();
		  if(tex1!=null && tex1.length>0){
			   $('#sr_psy_text_id').val(tex1.replace(value,""));
		  }
		  $('.psyclass').each(function(){
			  //console.log("check--"+$(this).prop("checked"));
			  if( $(this).prop("checked")==false){
				  //console.log();
				i++;  
			  }
	 });
	 console.log("--"+i);
	 if(i==11){
		$('#psyproblemboxid').prop("checked",false); 
		$('#psyproblemdivid').hide();
	 }
	 }
 }


function showHideFields(boxid,divid){
if($('#'+boxid). prop("checked") == true){
$('#'+divid).show();
}else{envproblemtxtid
	$('#'+divid).hide();
} 
}

	