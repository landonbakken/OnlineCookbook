const substituteTemplate = document.querySelector("[substitute-template]")

let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
let ingredients = ""

async function getJsonData() {
	let file = await fetch("/database/recipes")
	recipes = await file.json()
	file = await fetch("/database/ingredients")
	ingredients = await file.json()
	data = ingredients[id]
}

getJsonData().then(() => {
	document.getElementById("name").textContent = data.displayName + ":"
	document.getElementById("type").textContent = data.type
	document.getElementById("cost").textContent = "$" + data.cost + " per grams"
	//document.getElementById("specialized").textContent = "How specialized: " + data.specialized
	
	let substituteList = document.getElementById("substitues");
	for(let substituteID in data.substitutes){
		let ratio = data.substitutes[substituteID]
		const card = substituteTemplate.content.cloneNode(true).children[0]
    	const header = card.querySelector("[data-header]")
    	const body = card.querySelector("[data-body]")
		header.textContent = ingredients[substituteID].displayName
		header.href = "/ingredient/" + substituteID
		body.textContent = "Multiply by " + ratio
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