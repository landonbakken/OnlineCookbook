const recipeCardTemplate = document.querySelector("[data-recipe-template]")
const recipeCardContainer = document.querySelector("[data-recipe-cards-container]")
const searchInput = document.querySelector("[data-search]")

let recipes = []
let ingredients = []
let meals = []
let allInfo = []
let cards = []

let showIngredients = true
let showMeals = true
let showRecipes = true

function updateSettings(setting){
  let checked = document.getElementById(setting).checked

  if(setting == "ingredients"){
    showIngredients = checked
  }
  if(setting == "meals"){
    showMeals = checked
  }
  if(setting == "recipes"){
    showRecipes = checked
  }
  updateList()
}
async function getJsonData() {
  let file = await fetch("/database/ingredients")
	ingredients = await file.json()
  file = await fetch("/database/recipes") //CHANGE THIS TO RECIPES WHEN JSON IS BIGGER
  recipes = await file.json()
}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase().split(" ")
  showOrHide(ingredients, value)
  showOrHide(recipes, value)
  updateList()
})

function updateList(){
  showHide(ingredients, showIngredients)
  showHide(recipes, showRecipes)
}

function showHide(dataList, show){
  if(!show){
    for(let dataID in dataList){
      let div = document.getElementById(dataID)
      div.classList.add("hide")
    }
  }
}

function showOrHide(dataList, value){
  for(let dataID in dataList){
    let data = dataList[dataID]
    let div = document.getElementById(dataID)
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
}

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
  for(let ingredient in ingredients){ //CHANGE INGREDIENTS TO RECIPES!!!!!!!!
    let data = ingredients[ingredient]
    const card = recipeCardTemplate.content.cloneNode(true).children[0]
    const header = card.querySelector("[data-header]")
    const body = card.querySelector("[data-body]")
    card.id = ingredient
    header.textContent = data["displayName"]
    header.href = "/ingredient/" + ingredient
    body.textContent = data["type"]
    recipeCardContainer.append(card)
  }
});