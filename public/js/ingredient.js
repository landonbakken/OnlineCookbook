const substituteTemplate = document.querySelector("[substitute-template]")
const healthTemplate = document.querySelector("[health-template]")
const emptyJson = JSON.parse("{}")

let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
let ingredients = ""

function editIngredient(){
	window.location.href = "/add/ingredient/" + id;
}

async function getJsonData() {
	let file = await fetch("/jsonInfo/recipes.json")
	recipes = await file.json()
	file = await fetch("/jsonInfo/ingredients.json")
	ingredients = await file.json()
	data = ingredients[id]
}

getJsonData().then(() => {
	document.getElementById("name").textContent = data.displayName + ":"
	document.getElementById("type").textContent = data.type
	document.getElementById("cost").textContent = "$" + data.cost + " per gram"
	//document.getElementById("specialized").textContent = "How specialized: " + data.specialized
	
	/*let healthList = document.getElementById("health");
	for(let healthID in data.health){
		let info = data.health[healthID]
		const card = healthTemplate.content.cloneNode(true).children[0]
    	const header = card.querySelector("[data-header]")
    	//const body = card.querySelector("[data-body]")
		header.textContent = healthID + ": " + info
		//header.href = "/ingredient/"
		//body.textContent = healthdata
		healthList.append(card)
	}*/

	let substituteList = document.getElementById("substitues");

	/*
	for(let substituteID in data.substitutes){
		console.log(substituteID)
		let ratio = data.substitutes[substituteID]
		const card = substituteTemplate.content.cloneNode(true).children[0]
    	const header = card.querySelector("[data-header]")
    	const body = card.querySelector("[data-body]")
		header.textContent = ingredients[substituteID].displayName
		header.href = "/ingredient/" + substituteID
		body.textContent = "Multiply by " + ratio
		substituteList.append(card)
	}*/

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