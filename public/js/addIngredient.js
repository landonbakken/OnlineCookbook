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
	var IDName = document.getElementById("name-input").value.toLowerCase().replaceAll(" ", "");
	var displayName = document.getElementById("name-input").value;
	var cost = document.getElementById("cost-input").value;
	var tableToGram = document.getElementById("weight-ratio-input").value;
	var type = document.getElementById("type-input").value;
	var specialized = document.getElementById("specialized-input").checked;
	var needsMoreInfo = document.getElementById("needs-more-info-input").checked;
	var restrictionList = document.getElementById("restrictions-input").value.replace(/(\r\n|\n|\r)/gm, "~").split("~")
	var restrictionList = document.getElementById("restrictions-input").value.replace(/(\r\n|\n|\r)/gm, "~").split("~")
	var notesList = document.getElementById("notes-input").value.replace(/(\r\n|\n|\r)/gm, "~").split("~")

	//add to json file
	var jsonFile = {};
	jsonFile[IDName] = {};
	jsonFile[IDName]["displayName"] = displayName;
	jsonFile[IDName]["cost"] = cost;
	jsonFile[IDName]["tableToGram"] = tableToGram;
	jsonFile[IDName]["health"] = {"saturated fats": -1, "calories": -1 };
	jsonFile[IDName]["type"] = type;
	jsonFile[IDName]["parent"] = "ingredients";
	jsonFile[IDName]["substitutes"] = {};
	jsonFile[IDName]["specialized"] = specialized;
	jsonFile[IDName]["restrictions"] = restrictionList;
	jsonFile[IDName]["notes"] = notesList;
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

function submitInfo(goToHome = true){
	if(document.getElementById("name-input").value != ""){
		httpGetAsync(urlToSendTo, function(response) {
			// Log the received response
			console.log("Received: ", response);
		});
		if(goToHome){
			window.location.href = "/";
		}
	}
}

function goToHome(){
	window.location.href = "/";
}

function editIngredient(ingredientID){
	//console.log("Editing ingredient with ID " + ingredientID);
	getJsonData(ingredientID, function(data){
		setValues(data);
	});
}

async function getJsonData(id, callback) {
	let file = await fetch("/jsonInfo/ingredients.json")
	let ingredients = await file.json()
	callback(ingredients[id]);
}

function setValues(data){
	document.getElementById("name-input").value = data["displayName"];
	document.getElementById("cost-input").value = data["cost"];
	document.getElementById("weight-ratio-input").value = data["tableToGram"];
	document.getElementById("type-input").value = data["type"];
	document.getElementById("specialized-input").checked = data["specialized"];
	document.getElementById("needs-more-info-input").checked = data["needsMoreInfo"];
	
	fillTextboxWithList(data["restrictions"], "restrictions-input");
	fillTextboxWithList(data["notes"], "notes-input");
}

function fillTextboxWithList(objectList, elementID){
	for(var object = 0; object < objectList.length; object++){
		document.getElementById(elementID).value += objectList[object];
		if(object != objectList.length - 1){
			document.getElementById(elementID).value += "\n"
		}
	}
}