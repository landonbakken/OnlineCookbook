console.log("js be working");
var splitURL = window.location.href.split("/");
const urlToSendTo = "http://" + splitURL[2] + "/recieve";

//if specific recipe in the url set those values
if(document.URL.split("/")[document.URL.split("/").length - 1] != "recipe"){
	editRecipe(document.URL.split("/")[document.URL.split("/").length - 1]);
}

// Define a function to send an HTTP request asynchronously
async function httpGetAsync(theUrl, callback) {
    // Create a new XMLHttpRequest object
    var xmlHttp = new XMLHttpRequest();
    

	//get all data from page
	var IDName = document.getElementById("name-input").value.toLowerCase().replaceAll(" ", "");
	console.log(IDName);
	var displayName = document.getElementById("name-input").value;
	var totalTime = document.getElementById("total-time-input").checked;
	var effortTime = document.getElementById("effort-time-input").checked;
	var type = document.getElementById("type-input").value;
	var ethnicity = document.getElementById("ethnicity-input").value
	var difficulty = document.getElementById("difficulty-input").value
	var servings = document.getElementById("servings-input").value
	var directionsList = document.getElementById("directions-input").value.replace(/(\r\n|\n|\r)/gm, "~").split("~")
	var notesList = document.getElementById("notes-input").value.replace(/(\r\n|\n|\r)/gm, "~").split("~")
	var needsMoreInfo = document.getElementById("needs-more-info-input").checked
	

	//add to json file
	var jsonFile = JSON.parse("{}");
	jsonFile[IDName] = JSON.parse("{}");
	jsonFile[IDName]["displayName"] = displayName;
	jsonFile[IDName]["totalTime"] = totalTime;
	jsonFile[IDName]["effortTime"] = effortTime;
	jsonFile[IDName]["ingredients"] = {"crust":{"salt":{"amount": 20,"unit": "gram"}},"salt":{"amount": 20,"unit": "gram"}};
	jsonFile[IDName]["type"] = type;
	jsonFile[IDName]["parent"] = "recipes";
	jsonFile[IDName]["ethnicity"] = ethnicity;
	jsonFile[IDName]["difficulty"] = difficulty;
	jsonFile[IDName]["defaultServings"] = servings;
	jsonFile[IDName]["directions"] = directionsList;
	jsonFile[IDName]["cookersNotes"] = notesList;
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
	if(document.getElementById("name-input").value != ""){
		httpGetAsync(urlToSendTo, function(response) {
			// Log the received response
			console.log("Received: ", response);
		});
		//window.location.href = "/";
	}
}

function editRecipe(recipeID){
	getJsonData(recipeID, function(data){
		setValues(data);
	});
}

async function getJsonData(id, callback) {
	let file = await fetch("/jsonInfo/recipes.json")
	let recipes = await file.json()
	callback(recipes[id]);
}

function setValues(data){
	document.getElementById("name-input").value = data["displayName"];
	document.getElementById("total-time-input").value = data["totalTime"];
	document.getElementById("effort-time-input").value = data["effortTime"];
	document.getElementById("type-input").value = data["type"];
	document.getElementById("ethnicity-input").value = data["ethnicity"]
	document.getElementById("difficulty-input").value = data["difficulty"]
	document.getElementById("servings-input").value = data["defaultServings"]
	fillTextboxWithList(data["directions"], "directions-input");
	fillTextboxWithList(data["cookersNotes"], "notes-input");
	document.getElementById("needs-more-info-input").checked = data["needsMoreInfo"];
}

function fillTextboxWithList(objectList, elementID){
	for(var objectID = 0; objectID < objectList.length; objectID++){
		document.getElementById(elementID).value += objectList[objectID];
		if(objectID != objectList.length - 1){
			document.getElementById(elementID).value += "\n"
		}
	}
}