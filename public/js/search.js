const recipeCardTemplate = document.querySelector("[data-recipe-template]")
const recipeCardContainer = document.querySelector("[data-recipe-cards-container]")
const searchInput = document.querySelector("[data-search]")

let recipes = []
let ingredients = []
//let meals = []
let allInfo = []
let cards = []
let value = ""

let showIngredients = true
document.getElementById("ingredients").checked = showIngredients
//let showMeals = true
//document.getElementById("meals").checked = showMeals
let showRecipes = true
document.getElementById("recipes").checked = showRecipes

function updateSettings(setting){
  let checked = document.getElementById(setting).checked

  if(setting == "ingredients"){
    showIngredients = checked
  }
  //if(setting == "meals"){
  //  showMeals = checked
  //}
  if(setting == "recipes"){
    showRecipes = checked
  }
  updateList()
}
async function getJsonData() {
  let file = await fetch("/jsonInfo/ingredients.json")
	ingredients = await file.json()
  file = await fetch("/jsonInfo/recipes.json")
  recipes = await file.json()
}

searchInput.addEventListener("input", e => {
  value = e.target.value.toLowerCase().split(" ")
  updateList()
})

function updateList(){
  showOrHide(ingredients, value)
  showOrHide(recipes, value)
  hide(ingredients, showIngredients)
  hide(recipes, showRecipes)
}

function hide(dataList, show){
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
  for(let recipe in recipes){
    let data = recipes[recipe]
    const card = recipeCardTemplate.content.cloneNode(true).children[0]
    const header = card.querySelector("[data-header]")
    const body = card.querySelector("[data-body]")
    card.id = recipe
    header.textContent = data["displayName"]
    if(data["needsMoreInfo"] != false){
      header.textContent += "*";
    }
    header.href = "/recipe/" + recipe
    body.textContent = data["type"]
    recipeCardContainer.append(card)
  }
  for(let ingredient in ingredients){
    console.log(ingredient)
    let data = ingredients[ingredient]
    const card = recipeCardTemplate.content.cloneNode(true).children[0]
    const header = card.querySelector("[data-header]")
    const body = card.querySelector("[data-body]")
    card.id = ingredient
    header.textContent = data["displayName"]
    if(data["needsMoreInfo"] != false){
      header.textContent += "*";
    }
    header.href = "/ingredient/" + ingredient
    body.textContent = data["type"]
    recipeCardContainer.append(card)
  }
});