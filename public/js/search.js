const recipeCardTemplate = document.querySelector("[data-recipe-template]")
const recipeCardContainer = document.querySelector("[data-recipe-cards-container]")
const searchInput = document.querySelector("[data-search]")

let recipes = []
let ingredients = []

async function getJsonData() {
	let file = await fetch("/database/ingredients")
	ingredients = await file.json()
  file = await fetch("/database/ingredients") //CHANGE THIS TO RECIPES WHEN JSON IS BIGGER
  recipes = await file.json()
}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase().split(" ")
  
  for(let recipe in recipes){
    let data = recipes[recipe]
    let div = document.getElementById(recipe)
    let show = true

    if(!(value.length == 1 && value[0] == "")){
      for(let wordID in value){
        let word = value[wordID]
        if(word.length > 0){
          if(!(data["displayName"].toLowerCase().includes(word) || data["type"].toLowerCase().includes(word))){
            show = false
          }
        }
      }
    }
    if(show){
      //console.log("show " + recipe)
      div.classList.remove("hide")
    }
    else{
      //console.log("hide " + recipe)
      div.classList.add("hide")
    }
    //data.element.classList.toggle("hide", !isVisible)
  }
})

//fetch("https://jsonplaceholder.typicode.com/users")
getJsonData().then(() => {
  for(let recipe in recipes){ //CHANGE INGREDIENTS TO RECIPES!!!!!!!!
    let data = recipes[recipe]
    const card = recipeCardTemplate.content.cloneNode(true).children[0]
    const header = card.querySelector("[data-header]")
    const body = card.querySelector("[data-body]")
    card.id = recipe
    header.textContent = data["displayName"]
    header.href = "/recipe/" + recipe
    body.textContent = data["type"]
    recipeCardContainer.append(card)
  }
});