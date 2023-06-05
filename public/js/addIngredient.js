console.log("js be working");
var splitURL = window.location.href.split("/");
const urlToSendTo = "http://" + splitURL[2] + "/recieve";

// Define a function to send an HTTP request asynchronously
function httpGetAsync(theUrl, callback) {
    // Create a new XMLHttpRequest object
    var xmlHttp = new XMLHttpRequest();
    
    // Set an event listener for when the request state changes
    xmlHttp.onreadystatechange = function() {
        // Check if the request is complete and successful
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            // Call the callback function with the response text
            callback(xmlHttp.responseText);
    }
    
    // Open a POST request to the specified URL
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
	xmlHttp.setRequestHeader("Content-Type", "application/json");
    
    // Send the JSON data as the request body
	const dataToSend = JSON.stringify({
			"sugar":{
				"displayName": "Sugar",
				"cost": -1,
				"health":{
					"sugars": -1,
					"saturated fats": -1,
					"calories": -1 
				},
				"type": "carbohydrate",
				"parent": "ingredients",
				"substitutes":{
				},
				"specialized": -1,
				"restrictions":[
					"none"
				],
				"notes":[
					"very sweet, but unhealthy",
					"has many substitutes"
				]
			}
		}	
	);
    xmlHttp.send(dataToSend);
}

function submitInfo(){
	httpGetAsync(urlToSendTo, function(response) {
		// Log the received response
		console.log("received ... ", response);
	});
}
// Call the function with the URL and a callback function