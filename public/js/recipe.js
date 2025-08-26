const ingredientTemplate = document.querySelector("[ingredient-list-template]")
const subListHeaderTemplate = document.querySelector("[sub-list-header-template]")
const servingsInput = document.querySelector("[input-servings]")
const nums = "1234567890"

let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
let dynamicIngredients = []
let ingredients = ""
let servings = ""
let units = ""

function refreshNumbers(){
	servings = servingsInput.value
	if(!nums.includes(servings[servings.length - 1])){
		servingsInput.value = servings.substring(0, servings.length - 1)
	}

	for(let ingredient of dynamicIngredients){
		ingredient.body.textContent = bestUnit(ingredient.amount * servings / data.defaultServings, ingredient.unit)
	}
	setNotes()
}

function editRecipe(){
	window.location.href = "/add/recipe/" + id;
}
function deleteRecipe(){
	window.location.href = "/remove/recipe/" + id;
}

async function getJsonData() {
	let file = await fetch("/jsonInfo/ingredients")
	ingredients = await file.json()
	file = await fetch("/jsonInfo/recipes.json")
	recipes = await file.json()
	file = await fetch("/jsonInfo/units.json")
	units = await file.json()
	data = recipes[id]
}

function goToHome(){
	window.location.href = "/";
}

function bestUnit(amount, currentUnit){
	//round to the thousanths
	if (!Number.isInteger(amount)) {
		amount = amount.toFixed(3);	
	}

	if(amount != 1){
		return amount + " " + currentUnit + "s" //placeholder that does nothing currently
	}
	return amount + " " + currentUnit //placeholder that does nothing currently
}

function correctServings(sentence){
	let stringBuilder = ""
	let letterID = 0
	while(letterID < sentence.length){
		if(sentence[letterID] == "{"){
			let measurementBuilder = ""
			letterID++
			while(sentence[letterID] != "}"){
				measurementBuilder += sentence[letterID]
				letterID++
			}
			measurementBuilder = parseFloat(measurementBuilder) * servings / data.defaultServings
			stringBuilder += measurementBuilder
		}
		else if(sentence[letterID] != "}"){
			stringBuilder += sentence[letterID]
		}
		letterID++
	}
	return stringBuilder
}

servingsInput.addEventListener("input", e => {
	refreshNumbers();
})

function newDynamicIngredient(ingredient, ingredientID, parent){
	//create ingredient card
	card = ingredientTemplate.content.cloneNode(true).children[0]
	header = card.querySelector("[ingredient-link]")
	body = card.querySelector("[ingredient-measurement]")
	infoPiece = card.querySelector("[ingredient-info-provider]")

	//set static info
	try{
		header.textContent = ingredients[ingredientID].displayName
		header.href = "/ingredient/" + ingredientID
	}
	catch{
		console.error("couldnt find info for ingredient with ID " + ingredientID);
	}

	//set measurements
	body.textContent = ingredient.amount + " " + ingredient.unit
	if(ingredient.amount != 1){
		body.textContent += "s"
	}

	if(ingredients[ingredientID].usedGPT){
		infoPiece = "*"
	}

	//put in HTML
	parent.append(card);

	//put in list for future changes to servings
	//let ingredientInfo = data.ingredients[ingredientID];
	ingredient["body"] = body;
	//console.log(ingredient);
	dynamicIngredients.push(ingredient);

	return card
}


getJsonData().then(() => {
	//set servings to default value for recipe
	servingsInput.value = data.defaultServings
	servings = data.defaultServings

	//enter static info
	document.getElementById("name").textContent = data.displayName + ":"
	document.getElementById("type").textContent = data.type
	document.getElementById("eatTime").textContent = data.eatTime
	document.getElementById("totalTime").textContent = "Total Cook Time: " + data.totalTime + " minutes"
	document.getElementById("effortTime").textContent = "Effort Time: " + data.effortTime + " minutes"
	document.getElementById("defaultServings").textContent = "(for " + data.defaultServings + " servings)"
	document.getElementById("ethnicity").textContent = "Ethnicity: " + data.ethnicity
	document.getElementById("difficulty").textContent = "Difficulty: " + data.difficulty + "/10"
	
	//get references to dynamic info (things that chagne with servings)
	//get all ingredients or sub-ingredient lists and cycle through
	let ingredientList = document.getElementById("ingredients");
	for(let ingredientID in data.ingredients){
		//for sub list stuff
		if(data.ingredients[ingredientID].amount == undefined){
			//create sub list  header
			subListHeader = subListHeaderTemplate.content.cloneNode(true).children[0]
			//set sub list header text
			subListHeader.textContent = ingredientID + ":"

			//put sublist header into HTML
			ingredientList.append(subListHeader)
			
			//get sub ingredients and loop through
			let subIngredients = data.ingredients[ingredientID];
			for(let subIngredientID in subIngredients){
				card = newDynamicIngredient(subIngredients[subIngredientID], subIngredientID, ingredientList)
				card.classList.add('sub-list-piece')
				card.classList.remove('list-piece')
			}
			subListHeader.id = subListHeader.innerHTML; //make the sublist id the title of the sublist
		}
		else{
			newDynamicIngredient(data.ingredients[ingredientID], ingredientID, ingredientList)
		}
	}
	refreshNumbers()
})


function setNotes(){
	let cookersNotesList = document.getElementById("cookersNotes")
	cookersNotesList.innerHTML = ""
	for(let noteID in data.cookersNotes){
		let note = correctServings(data.cookersNotes[noteID])
		let li = document.createElement("li")
		li.innerText = note
		cookersNotesList.appendChild(li)
	}

	let directionsList = document.getElementById("directions")
	directionsList.innerHTML = ""
	for(let noteID in data.directions){
		let note = correctServings(data.directions[noteID])
		let li = document.createElement("li")
		li.innerText = note
		directionsList.appendChild(li)
	}
}