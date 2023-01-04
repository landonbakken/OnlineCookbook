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
	for(let ingredientID in data.ingredients){
		console.log(ingredients[ingredientID].displayName)
	}
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
})