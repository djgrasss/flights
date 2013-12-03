$(function() {
	/*
	number of fieldsets
	*/
	var fieldsetCount = $('#formElem').children().length;
	
	/*
	current position of fieldset / navigation link
	*/
	var current 	= 1;
    
	/*
	sum and save the widths of each one of the fieldsets
	set the final sum as the total width of the steps element
	*/
	var stepsWidth	= 0;
    var widths 		= new Array();
	$('#steps .step').each(function(i){
        var $step 		= $(this);
		widths[i]  		= stepsWidth;
        stepsWidth	 	+= $step.width();
    });
	$('#steps').width(stepsWidth);
	
	/*
	to avoid problems in IE, focus the first input of the form
	*/
	$('#formElem').children(':first').find(':input:first').focus();	
	
	/*
	show the navigation bar
	*/
	$('#navigation').show();
	
	/*
	when clicking on a navigation link 
	the form slides to the corresponding fieldset
	*/
    $('#navigation a').bind('click',function(e){
		var $this	= $(this);
		var prev	= current;
		$this.closest('ul').find('li').removeClass('selected');
        $this.parent().addClass('selected');
		/*
		we store the position of the link
		in the current variable	
		*/
		current = $this.parent().index() + 1;
		/*
		animate / slide to the next or to the corresponding
		fieldset. The order of the links in the navigation
		is the order of the fieldsets.
		Also, after sliding, we trigger the focus on the first 
		input element of the new fieldset
		If we clicked on the last link (confirmation), then we validate
		all the fieldsets, otherwise we validate the previous one
		before the form slided
		*/
        $('#steps').stop().animate({
            marginLeft: '-' + widths[current-1] + 'px'
        },500,function(){
			if(current == fieldsetCount)
				validateSteps();
			else
				validateStep(prev);
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();	
		});
        e.preventDefault();
    });
	
	/*
	clicking on the tab (on the last input of each fieldset), makes the form
	slide to the next step
	*/
	$('#formElem > fieldset').each(function(){
		var $fieldset = $(this);
		$fieldset.children(':last').find(':input').keydown(function(e){
			if (e.which == 9){
				$('#navigation li:nth-child(' + (parseInt(current)+1) + ') a').click();
				/* force the blur for validation */
				$(this).blur();
				e.preventDefault();
			}
		});
	});
	
	/*
	validates errors on all the fieldsets
	records if the Form has errors in $('#formElem').data()
	*/
	function validateSteps(){
		var FormErrors = false;
		for(var i = 1; i < fieldsetCount; ++i){
			var error = validateStep(i);
			if(error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors',FormErrors);	
	}
	
	/*
	validates one fieldset
	and returns -1 if errors found, or 1 if not
	*/
	function validateStep(step){
		if(step == fieldsetCount) return;
		
		var override = false;

		if(step==1){
			if($( '#form_batch_routes' ).val()!=''){
				override = true;
			}
		}else if(step==2){
			if($( '#form_batch_dates' ).val()!=''){
				override =true;
			}
		}


		var error = 1;
		var hasError = false;
		$('#formElem').children(':nth-child('+ parseInt(step) +')').find(':input:not(button)').each(function(){
			var $this 		= $(this);
			var valueLength = jQuery.trim($this.val()).length;
			
			if(valueLength == '' && override == false){
				hasError = true;
				$this.css('background-color','#FFEDEF');
			}
			else
				$this.css('background-color','#FFFFFF');	
		});
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
		var valclass = 'checked';
		if(hasError){
			error = -1;
			valclass = 'error';
		}
		$('<span class="'+valclass+'"></span>').insertAfter($link);
		
		return error;
	}
	
	/*
	if there are errors don't allow the user to submit
	*/
	$('#registerButton').bind('click',function(){
		validateSteps();
		if($('#formElem').data('errors')){
			alert('Please correct the errors in the Form');
			return false;
		}	
	});


	$(function() {
	    $('#batch_routes').click(function(){
	    	if(validateStep(1)==1){
	    		var from = $( '#leaving_from' ).val();
	    		
	    		var to = $( '#arriving_at' ).val();
	    		
	    		var price = $( '#price_floor' ).val();

	    		var from_flexible = 0;

	    		if($( '#leaving_nearby' ).is(':checked')){
	    			from_flexible = 1;
	    		}	

	    		var to_flexible = 0;

	    		if($( '#arriving_nearby' ).is(':checked')){
	    			to_flexible = 1;
	    		}

	    		// Append to input
	    		$( '#form_batch_routes' ).val(function(i,val) { 
     										return val + (!val ? '' : ',') + from+','+to+','+price+','+from_flexible+','+to_flexible;
										});
	    		// Clear fields
	    		$( '#price_floor' ).val('');
	    		$( '#arriving_at' ).val('');
				$( '#leaving_from' ).val('');
	    	}
	    });
	    $('#batch_dates').click(function(){
	    	if(validateStep(2)==1){
	    		var leaving = $( '#departing' ).val();
	    		
	    		var returning = $( '#returning' ).val();
	    		
	    		var leaving_flexible = $( '#departing_flexible' ).val();

	    		var returning_flexible = $( '#returning_flexible' ).val();

	    		$( '#form_batch_dates' ).val(function(i,val) { 
     										return val + (!val ? '' : ',') + leaving+','+returning+','+leaving_flexible+','+returning_flexible;
										});

	    		$( '#departing' ).val('');
	    		
	    		$( '#returning' ).val('');
	    	}
	    });
	});
});