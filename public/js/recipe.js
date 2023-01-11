const ingredientTemplate = document.querySelector("[ingredient-list-template]")
const servingsInput = document.querySelector("[input-servings]")
const nums = "1234567890"

let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
let ingredients = ""
let servings = ""

async function getJsonData() {
	let file = await fetch("/jsonInfo/ingredients")
	ingredients = await file.json()
	file = await fetch("/jsonInfo/recipes")
	data = await file.json()
	data = data[id]
	//console.log(data)
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
				//console.log("letter:" + sentence[letterID])
				//console.log("id:" + letterID)
				letterID++
			}
			measurementBuilder = parseInt(measurementBuilder) * servings / data.defaultServings
			//console.log("Built string:" + measurementBuilder)
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
	servings = e.target.value
	if(!nums.includes(servings[servings.length - 1])){
		servingsInput.value = servings.substring(0, servings.length - 1)
	}
	servings = servingsInput.value	
	let measurementList = document.getElementsByClassName("body")
	for(let measurementID in measurementList){
		let measurement = measurementList[measurementID]
		//console.log(measurement)
		measurement.textContent = data.ingredients[measurement.id].amount * servings / data.defaultServings + " " + data.ingredients[measurement.id].unit
	}
	setNotes()
	//for(let ingredientID in ingredientList.children){
	//	console.log(ingredientList.children[ingredientID].children[1])
	//}
})

getJsonData().then(() => {
	servingsInput.value = data.defaultServings
	servings = data.defaultServings
	document.getElementById("name").textContent = data.displayName + ":"
	document.getElementById("type").textContent = data.type
	document.getElementById("eatTime").textContent = data.eatTime
	document.getElementById("totalTime").textContent = "Total Cook Time: " + data.totalTime + " minutes"
	document.getElementById("effortTime").textContent = "Effort Time: " + data.effortTime + " minutes"
	document.getElementById("defaultServings").textContent = "(for " + data.defaultServings + " servings)"
	document.getElementById("ethnicity").textContent = "Ethnicity: " + data.ethnicity
	document.getElementById("difficulty").textContent = "Difficulty: " + data.difficulty + "/10"
	
	let ingredientList = document.getElementById("ingredients");
	for(let ingredientID in data.ingredients){
		let info = ingredients[ingredientID]
		const card = ingredientTemplate.content.cloneNode(true).children[0]
    	const header = card.querySelector("[ingredient-link]")
    	const body = card.querySelector("[ingredient-measurement]")
		header.textContent = info.displayName
		header.href = "/ingredient/" + ingredientID
		body.textContent = data.ingredients[ingredientID].amount * servings / data.defaultServings + " " + data.ingredients[ingredientID].unit
		body.id = ingredientID
		ingredientList.append(card)
	}
	setNotes()
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