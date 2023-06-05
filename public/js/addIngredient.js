console.log("js be working");
var splitURL = window.location.href.split("/");
const urlToSendTo = "http://" + splitURL[2] + "/recieve";

//if specific ingredient in the url set those values
if(document.URL.split("/")[document.URL.split("/").length - 1] != "ingredient"){
	editIngredient(document.URL.split("/")[document.URL.split("/").length - 1]);
}

// Define a function to send an HTTP request asynchronously
async function httpGetAsync(theUrl, callback) {
    // Create a new XMLHttpRequest object
    var xmlHttp = new XMLHttpRequest();
    

	//get all data from page
	var IDName = document.getElementById("name-input").value.toLowerCase().replace(" ", "");
	var displayName = document.getElementById("name-input").value;
	var cost = document.getElementById("cost-input").value;
	var type = document.getElementById("type-input").value;
	var specialized = document.getElementById("specialized-input").checked;
	var needsMoreInfo = document.getElementById("needs-more-info-input").checked;

	//add to json file
	var jsonFile = JSON.parse("{}");
	jsonFile[IDName] = JSON.parse("{}");
	jsonFile[IDName]["displayName"] = displayName;
	jsonFile[IDName]["cost"] = cost;
	jsonFile[IDName]["health"] = {"saturated fats": -1, "calories": -1 };
	jsonFile[IDName]["type"] = type;
	jsonFile[IDName]["parent"] = "ingredients";
	jsonFile[IDName]["substitutes"] = {};
	jsonFile[IDName]["specialized"] = specialized;
	jsonFile[IDName]["restrictions"] = ["none"];
	jsonFile[IDName]["notes"] = ["none"];
	jsonFile[IDName]["needsMoreInfo"] = needsMoreInfo;

	//send the json file
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
	xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(jsonFile));
    
	// Set an event listener for when the request state changes
    xmlHttp.onreadystatechange = function() {
        // Check if the request is complete and successful
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            // Call the callback function with the response text
            callback(xmlHttp.responseText);
		}
    }
}

function submitInfo(){
	httpGetAsync(urlToSendTo, function(response) {
		// Log the received response
		console.log("Received: ", response);
	});
	window.location.href = "/";
}

function editIngredient(ingredientID){
	console.log("Editing ingredient with ID " + ingredientID);
	getJsonData(ingredientID, function(data){
		setValues(data["displayName"].toLowerCase().replace(" ", ""), data["cost"], data["type"], data["specialized"], data["needsMoreInfo"]);
	});
}

async function getJsonData(id, callback) {
	let file = await fetch("/jsonInfo/ingredients.json")
	let ingredients = await file.json()
	callback(ingredients[id]);
}

function setValues(nameInput, cost, typeInput, isSpecialized, needsMoreInfo){
	document.getElementById("name-input").value = nameInput;
	document.getElementById("cost-input").value = cost;
	document.getElementById("type-input").value = typeInput;
	document.getElementById("specialized-input").checked = isSpecialized;
	document.getElementById("specialized-input").checked = needsMoreInfo;
}