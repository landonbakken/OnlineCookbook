console.log("js be working");
var splitURL = window.location.href.split("/");
const urlToSendTo = "http://" + splitURL[2] + "/recieve";
var ingredients; //const, but it has to be set with json file later
var unitList; //const, but it has to be set with json file later
const ingredientTemplate = document.getElementById("ingredient-template");
const ingredientContainer = document.getElementById("ingredient-container");
const ingredientDataList = document.getElementById("ingredient-datalist");
loadLists();


//if specific recipe in the url set those values
if(document.URL.split("/")[document.URL.split("/").length - 1] != "recipe"){
	editRecipe(document.URL.split("/")[document.URL.split("/").length - 1]);
}
else{
	addIngredient();
}

// Define a function to send an HTTP request asynchronously
async function httpGetAsync(theUrl, callback) {
    // Create a new XMLHttpRequest object
    var xmlHttp = new XMLHttpRequest();
    

	//get all data from page
	var IDName = document.getElementById("name-input").value.toLowerCase().replaceAll(" ", "");
	var displayName = document.getElementById("name-input").value;
	var totalTime = document.getElementById("total-time-input").value;
	var effortTime = document.getElementById("effort-time-input").value;
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
	jsonFile[IDName]["type"] = type;
	jsonFile[IDName]["parent"] = "recipes";
	jsonFile[IDName]["ethnicity"] = ethnicity;
	jsonFile[IDName]["difficulty"] = difficulty;
	jsonFile[IDName]["defaultServings"] = servings;
	jsonFile[IDName]["directions"] = directionsList;
	jsonFile[IDName]["cookersNotes"] = notesList;
	jsonFile[IDName]["needsMoreInfo"] = needsMoreInfo;

	jsonFile[IDName]["ingredients"] = {};
	for(var ingredient of ingredientContainer.children){
		var ingredientSubList = {};
		ingredientSubList["unit"] = ingredient.querySelector("[unit-input]").value.toLowerCase().replaceAll(" ", "")
		ingredientSubList["amount"] = ingredient.querySelector("[amount-input]").value.toLowerCase().replaceAll(" ", "")
		jsonFile[IDName]["ingredients"][ingredient.querySelector("[ingredient-input]").value.toLowerCase().replaceAll(" ", "")] = ingredientSubList;
	}

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
		window.location.href = "/";
	}
}

function editRecipe(recipeID){
	getJsonData(recipeID, function(data){
		setValues(data);
	});
}

async function loadLists(){
	//set ingredient list
	let file = await fetch("/jsonInfo/ingredients.json")
	ingredients = await file.json()

	for(var ingredient of Object.keys(ingredients)){
		var option = document.createElement('option');
		option.value = ingredients[ingredient]["displayName"];
		ingredientDataList.appendChild(option);
	}
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

	for(var ingredient = 0; ingredient < Object.keys(data["ingredients"]).length; ingredient++){
		addIngredient();
		const ingredientInfo = data["ingredients"][Object.keys(data["ingredients"])[ingredient]];
		const container = ingredientContainer.children[ingredientContainer.children.length -1];
		container.querySelector("[ingredient-input]").value = ingredients[Object.keys(data["ingredients"])[ingredient]]["displayName"];
		container.querySelector("[amount-input]").value = ingredientInfo["amount"];
		container.querySelector("[unit-input]").value = ingredientInfo["unit"];
	}
}

function fillTextboxWithList(objectList, elementID){
	for(var objectID = 0; objectID < objectList.length; objectID++){
		document.getElementById(elementID).value += objectList[objectID];
		if(objectID != objectList.length - 1){
			document.getElementById(elementID).value += "\n"
		}
	}
}

function addIngredient(){
    const card = ingredientTemplate.content.cloneNode(true).children[0];
    ingredientContainer.append(card);
}
function removeIngredient(){
	if(ingredientContainer.children.length > 0){
		ingredientContainer.children[ingredientContainer.children.length - 1].remove();
	}
}