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
	//document.getElementById("specialized").textContent = data.specialized
	document.getElementById("cost").textContent = "$" + data.cost + " per grams"
	document.getElementById("specialized").textContent = "How specialized: " + data.specialized
	//document.getElementById("restrictions").textContent = "Effort Time: " + data.effortTime + " minutes"
	//document.getElementById("health").textContent = "(for " + data.defaultServings + " servings)"
	//document.getElementById("substoitutes").textContent = "Ethnicity: " + data.ethnicity
	//document.getElementById("notes").textContent = "Difficulty: " + data.difficulty + "/10"
	//for(let ingredientID in data.ingredients){
	//	console.log(ingredients[ingredientID].displayName)
	//}
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
	//document.getElementById("").textContent = data[]
})