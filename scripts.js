function generator(input){
	var request = new XMLHttpRequest()
	var website = "http://jService.io/api/clues?id="
	var websiteid = website.concat(input.toString())

	request.open('GET', websiteid, true)

	request.onload = function() {
		var data = JSON.parse(this.response)
		console.log(data)
	}

	 // Send request
	request.send()
}

function handleEnter(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        value = generator(document.getElementById("input").value)
    }
}