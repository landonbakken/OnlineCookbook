const recipeCardTemplate = document.querySelector("[data-recipe-template]")
const recipeCardContainer = document.querySelector("[data-recipe-cards-container]")
const searchInput = document.querySelector("[data-search]")

let recipes = []
const ingredients = getJsonData("ingredients.json");
const recipes2 = getJsonData("recipes.json");

async function getJsonData(fileName) {
	let file = await fetch("/database/" + fileName)
	let data = await file.json()
	
	return data
}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  recipes.forEach(recipe => {
    const isVisible = recipe.name.toLowerCase().includes(value) || recipe.email.toLowerCase().includes(value)
    recipe.element.classList.toggle("hide", !isVisible)
  })
})

fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(data => {
    recipes = data.map(recipe => {
      const card = recipeCardTemplate.content.cloneNode(true).children[0]
      const header = card.querySelector("[data-header]")
      const body = card.querySelector("[data-body]")
      header.textContent = recipe.name
      header.href = "/recipe/" + recipe.id
      body.textContent = recipe.email
      recipeCardContainer.append(card)
      return { name: recipe.name, email: recipe.email, element: card }
    })
  })