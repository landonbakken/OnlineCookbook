let id = document.URL.split("/")[document.URL.split("/").length - 1]
let data = ""
getJsonData()
async function getJsonData() {
  	file = await fetch("/database/recipes") //CHANGE THIS TO RECIPES WHEN JSON IS BIGGER
	data = await file.json()
	data = data[id]
	console.log(data)
}

document.getElementById("name").textContent = id