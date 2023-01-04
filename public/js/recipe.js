const ingredientTemplate = document.querySelector("[ingredient-list-template]")

let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
let ingredients = ""

async function getJsonData() {
	let file = await fetch("/database/ingredients")
	ingredients = await file.json()
	file = await fetch("/database/recipes")
	data = await file.json()
	data = data[id]
	console.log(data)
}

getJsonData().then(() => {
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
		body.textContent = data.ingredients[ingredientID] + " grams"
		ingredientList.append(card)
	}

	let cookersNotesList = document.getElementById("cookersNotes")
	for(let noteID in data.cookersNotes){
		let note = data.cookersNotes[noteID]
		let li = document.createElement("li")
		li.innerText = note
		cookersNotesList.appendChild(li)
	}

	let directionsList = document.getElementById("directions")
	for(let noteID in data.directions){
		let note = data.directions[noteID]
		let li = document.createElement("li")
		li.innerText = note
		directionsList.appendChild(li)
	}
})