//This is the function that searches for categories that contain keywords in the input.
//This function can easily be optimized, as the runtime of it is O(n*m), where n
//is the number of words and m is the length of each word. This results in a long
//run time, and possibly crashes. Due to lack of experience with javascript and time, I wasn't
//able to implement a efficient data structure.
function categoryGeneration(){
	var dataid = [];
	var categorytitle = [];
	var offset = 0;
	var input = document.getElementById("categoryinput").value;
	input = input.toLowerCase();
	var website = "http://jservice.io/api/categories?count=100&offset="+offset;
	while(offset != 18500){
		var data = $.parseJSON($.ajax({
	        url:  website,
	        dataType: "json", 
	        async: false
    	}).responseText);
    	for(i=0;i<data.length;i++){
    		if(data[i].title != null){
    			if(data[i].title.includes(input) & !dataid.includes(data[i].id)){
    				dataid.push(data[i].id)
    				categorytitle.push(data[i].title)
    			}
    		}
    	}
		offset += 100;
		website = "http://jservice.io/api/categories?count=100&offset="+offset;
	}
	var output = '<div id="categoryval">';
	for (i=0;i<categorytitle.length;i++){
		output += '<button onclick="showCategoryInfo('+dataid[i]+')">'+categorytitle[i]+' ID = '+dataid[i]+')</button>';
	}
	output += '</div>'
	if(categorytitle.length==0){
		alert("Sorry, no categories were found for your search")
	}else{
		alert("Search has been completed!")
	}
	//alert(output);
  	$('div.categoryvalues').html(output);
}

//This is a helper function that works in conjunction with the category search function
//When the output from the category search is shown, they have the option of calling this function
//to further give details on the questions within the category.
function showCategoryInfo(id){
	var website = 'http://jService.io/api/category?id=';
	website += id;
	$.ajax({
		type: "GET",
		url: website,
		dataType: "json",
		success: function(responseData,status)
		{
			var output = '<div class= "level">';
			for(i=0;i<responseData.clues.length;i++){
				var answer = "'"+(responseData.clues[i].answer)+"'";
				var airdate = "'"+(responseData.clues[i].airdate)+"'";
				output += '<h4>' + ' Value: ' + responseData.clues[i].value + " | Question: "+ responseData.clues[i].question + '</h4>';
  				output += '<button onclick="showAnswer('+answer+')">Show Answer</button>';
  				output += '<button onclick="showAirdate('+airdate+')">Show Airdate</button>';
			}
			output += '</div>'
  			$('div.categoryvalues').html(output);
		}
	})	
}

//This is the function that searches by questions based on their value.
function levelGenerator(){
	var start = 0;
	var count = document.getElementById("numberinput").value;
	var level = document.getElementById("levelinput").value;
	var website = "http://jservice.io/api/clues?value=" + level;
	$.ajax({
		type: "GET",
		url: website,
		dataType: "json",
		success: function(responseData,status)
		{
			var output = '<div class= "level">';
			output += '<h1>Value: '+level+'<h1>';
			if(count >100){
				output+='<h2>Only 100 clues can be shown at a time</h2>';
			}
			$.each(responseData, function( index, value ) {
				var answer = "'"+(value.answer)+"'";
				var airdate = "'"+(value.airdate)+"'";
				output += '<h4>'+value.question+'</h4>';
  				output += '<button onclick="showAnswer('+answer+')">Show Answer</button>';
  				output += '<button onclick="showAirdate('+airdate+')">Show Airdate</button>';
  				start++;
  				if(start == count || start == 100){
  					output += '</div>'
  					$('div.levelvalues').html(output);
  				}
			});
		}
	})
}

//This is the function that works the general search method. If values are given in each
//input, they are added to the website url and processed using the api functionalities.
function questionSearch(){
	var website = 'http://jService.io/api/clues?';
	if(document.getElementById("evestart").value!=""){
		website += 'min_date='+document.getElementById("evestart").value+'&';
	}
	if(document.getElementById("eveend").value!=""){
		website += 'max_date='+document.getElementById("eveend").value+'&';
	}
	if(document.getElementById("eveinput").value !=""){
		website += 'value='+ document.getElementById("eveinput").value+'&';
	}
	if(document.getElementById("evecategoryinput").value != ""){
		website += 'category='+ document.getElementById("evecategoryinput").value+'&';
	}
	var input = "" + document.getElementById("evequestioninput").value;
	$.ajax({
		type: "GET",
		url: website,
		dataType: "json",
		success: function(responseData,status){
			var output = '<div class= "everyvalues">';
			if(responseData.length == 0){
				alert("Please refine your search")
			}else{
				$.each(responseData, function( index, value ){
					if(value.question.includes(input)){
						var answer = "'"+(value.answer)+"'";
						var airdate = "'"+(value.airdate)+"'";
						output += '<h4>'+value.question+'</h4>';
		  				output += '<button onclick="showAnswer('+answer+')">Show Answer</button>';
		  				output += '<button onclick="showAirdate('+airdate+')">Show Airdate</button>';
					}
				});
				output += '</div>'
				$('div.everythingvalues').html(output);
			}
		}
	})
}

//This is the function that processes the date search method by taking in 2 dates
//and utilizes the api function to retrieve data.
function dateGeneration(){
	var start = document.getElementById("startinput");
	var end = document.getElementById("endinput");
	var website = "http://jservice.io/api/clues?min_date="+start.value+"&max_date="+end.value;
	$.ajax({
		type: "GET",
		url: website,
		dataType: "json",
		success: function(responseData,status)
		{
			var output = '<div class= "values">';
			if(responseData.length==100){
				output += '<h2 class="resultDesc">The search range entered reached max search count (100)</h2>';
				output += '<h3 class="resultDesc">Try constraining the date range</h3><br>'
			}
			else if(responseData.length==0){
				output += '<h4 class="resultDesc">Sorry, the range entered is incorrect/has no questions</h4><br>';
			}
			else{
				output += '<h4 class="resultDesc">The range entered resulted in '+responseData.length+' questions</h4><br>';
			}
			console.log(responseData);
			
			$.each(responseData, function( index, value ) {
				var answer = "'"+(value.answer)+"'";
				var airdate = "'"+(value.airdate)+"'";
				output += '<h4>' + ' Value: ' + value.value + " | Question: "+ value.question + '</h4>';
  				output += '<button onclick="showAnswer('+answer+')">Show Answer</button>';
  				output += '<button onclick="showAirdate('+airdate+')">Show Airdate</button>';
			});
			output += '</div>';
			$('div.values').html(output);
		},
		error: function(breaker)
		{
			breaker=true;
		}
	})
}

//This is the function that processes the random command.
//It takes in a count and utilizes the api function to retrieve data.
function randomGenerator(){
	var count = document.getElementById("randominput").value;
	var website = "http://jservice.io/api/random?count=" + count;
	$.ajax({
		type: "GET",
		url: website,
		dataType: "json",
		success: function(responseData,status)
		{
			var output = '<div class= "randomvalues">';
			if(count >100){
				output+='<h2>Only 100 clues can be shown at a time</h2>';
			}
			$.each(responseData, function( index, value ) {
				var answer = "'"+(value.answer)+"'";
				var airdate = "'"+(value.airdate)+"'";
				output += '<h4>'+value.question+'</h4>';
  				output += '<button onclick="showAnswer('+answer+')">Show Answer</button>';
  				output += '<button onclick="showAirdate('+airdate+')">Show Airdate</button>';
			});
			output += '</div>'
			$('div.randomvalues').html(output);
		}
	})
	document.getElementById("startinput").scrollIntoView();
}


//Helper function for showing answers and airdate
function showAnswer(answer){
	answer = "Answer: " + answer;
	alert(answer);
}

function showAirdate(airdate){
	airdate = "Answer: " + airdate;
	alert(airdate);
}
