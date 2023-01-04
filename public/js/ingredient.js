const substituteTemplate = document.querySelector("[substitute-template]")

let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
let ingredients = ""

async function getJsonData() {
	let file = await fetch("/database/recipes")
	recipes = await file.json()
	file = await fetch("/database/ingredients")
	data = await file.json()
	data = data[id]
	console.log(data)
}

getJsonData().then(() => {
	document.getElementById("name").textContent = data.displayName + ":"
	document.getElementById("type").textContent = data.type
	document.getElementById("cost").textContent = "$" + data.cost + " per grams"
	document.getElementById("specialized").textContent = "How specialized: " + data.specialized
	//document.getElementById("restrictions").textContent = "Effort Time: " + data.effortTime + " minutes"
	//document.getElementById("health").textContent = "(for " + data.defaultServings + " servings)"
	//document.getElementById("substoitutes").textContent = "Ethnicity: " + data.ethnicity
	//document.getElementById("notes").textContent = "Difficulty: " + data.difficulty + "/10"
	
	let substituteList = document.getElementById("substitues");
	for(let substitueID in data.substitutes){
		let substitute = data.substitutes[substitueID]
		const card = substituteTemplate.content.cloneNode(true).children[0]
    	const header = card.querySelector("[data-header]")
    	const body = card.querySelector("[data-body]")
		header.textContent = substitute
		header.href = "/ingredient/" + substitute
		body.textContent = substitute + " to 1"
		substituteList.append(card)
	}

	let restrictionList = document.getElementById("restrictions")
	for(let restrictionID in data.restrictions){
		let restriction = data.restrictions[restrictionID]
		let li = document.createElement("li")
		li.innerText = restriction
		restrictionList.appendChild(li)
	}
	let noteList = document.getElementById("notes")
	for(let noteID in data.notes){
		let note = data.notes[noteID]
		let li = document.createElement("li")
		li.innerText = note
		noteList.appendChild(li)
	}
	//for(let ingredientID in data.ingredients){
	//	console.log(ingredients[ingredientID].displayName)
	//}
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
})