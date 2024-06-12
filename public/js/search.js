const recipeCardTemplate = document.querySelector("[data-recipe-template]")
const recipeCardContainer = document.querySelector("[data-recipe-cards-container]")
const searchInput = document.querySelector("[data-search]")

let recipes = []
let ingredients = []
let units = []
let cards = []
let value = ""

let showIngredients = false
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

  file = await fetch("/jsonInfo/units.json")
  units = await file.json()
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

function getIngredientGrams(ingredient, ingredientID){
  initialUnit = ingredient["unit"]
  if(initialUnit == "gram"){
    return ingredient["amount"];
  }
  else if(initialUnit in units["volume"]["imperial"] && ingredients[ingredientID]["tableToGram"] != "-1"){
    console.log("Imperial Volume")
    //convert to tablespoons
    tablespoons = ingredient["amount"] * units["volume"]["imperial"]["tablespoon"] / units["volume"]["imperial"][initialUnit]
    //convert and return as grams
    return tablespoons * ingredients[ingredientID]["tableToGram"]
  }
  console.log("Couldnt figure out conversion from " + ingredient["unit"] + " to grams for " + ingredients[ingredientID].displayName);
  return 0
}

function getIngredientCost(ingredient, ingredientID){
  grams = getIngredientGrams(ingredient, ingredientID);
  return grams * ingredients[ingredientID]["cost"]
}
function getIngredientCals(ingredient, ingredientID){
  grams = getIngredientGrams(ingredient, ingredientID);
  return grams * ingredients[ingredientID]["health"]["calories"]
}


getJsonData().then(() => {
  //recipes
  for(let recipe in recipes){
    let data = recipes[recipe]
    const card = recipeCardTemplate.content.cloneNode(true).children[0]
    const header = card.querySelector("[data-header]")
    const type = card.querySelector("[data-type]")
    const cardTotalTime = card.querySelector("[data-total-time]");
    const cardCalories = card.querySelector("[data-calories]");
    const cardCost = card.querySelector("[data-cost]");
    const cardDefaultServings = card.querySelector("[data-default-servings]");

    card.id = recipe
    header.textContent = data["displayName"]
    if(data["needsMoreInfo"] != false){
      header.textContent += "*";
    }

    //set info
    card.href = "/recipe/" + recipe;
    type.textContent = data["type"];
    cardTotalTime.textContent = data["totalTime"] + " mins";
    cardDefaultServings.textContent = data["defaultServings"] + " defualt servings";

    //find cost and cals
    cost = 0;
    cals = 0;
    for(var ingredientID in data["ingredients"]){
      //sublist
      ingredient = data["ingredients"][ingredientID]
      if(ingredient.amount == undefined){
        for(var subIngredientID in ingredient){
          subIngredient = ingredient[subIngredientID]
          cost += getIngredientCost(subIngredient, subIngredientID);
          cals += getIngredientCals(subIngredient, subIngredientID);
        }
      }
      else{
        cost += getIngredientCost(ingredient, ingredientID);
        cals += getIngredientCals(ingredient, ingredientID);
      }
    }
    
    cals /= data["defaultServings"]
    cost /= data["defaultServings"]

    cardCost.textContent = "$" + cost.toFixed(2) + " /serving"
    cardCalories.textContent = cals.toFixed(0) + " cals/serving"

    //add to html
    recipeCardContainer.append(card)
  }

  //ingredients
  for(let ingredient in ingredients){
    //console.log(ingredient)
    let data = ingredients[ingredient]
    const card = recipeCardTemplate.content.cloneNode(true).children[0]
    const header = card.querySelector("[data-header]")
    const type = card.querySelector("[data-type]")
    const cardCalories = card.querySelector("[data-calories]");
    const cardCost = card.querySelector("[data-cost]");

    //get rid of time infos because ingredients don't need time
    card.querySelector("[data-total-time]").remove()
    card.querySelector("[data-default-servings]").remove()

    card.id = ingredient
    header.textContent = data["displayName"]
    if(data["needsMoreInfo"]){
      header.textContent += "*";
    }
    if(data["usedGPT"]){
      header.textContent += "^";
    }

    //add info and link
    card.href = "/ingredient/" + ingredient
    type.textContent = data["type"]
    cardCalories.textContent = data["health"]["calories"] + " cals/gram"
    cardCost.textContent = "$" + data["cost"] + "/gram"
    recipeCardContainer.append(card)

  }
  updateSettings("ingredients");
  updateSettings("recipes");
});