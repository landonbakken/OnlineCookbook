const express = require('express');

const app = express();
const port = 4000;
const host = "0.0.0.0";

app.use(express.static("public"));
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/js", express.static(__dirname + 'public/js'));
app.use("/img", express.static(__dirname + 'public/img'));
app.use("/database", express.static(__dirname + 'public/database'));

app.set('views', './views');

app.get("", (req, res) => {
	res.sendFile(__dirname + "/views/search.html");
});
app.get("/recipe/:recipe", (req, res) => {
	res.sendFile(__dirname + "/views/recipe.html")
});
app.get("/meal", (req, res) => {
	res.sendFile(__dirname + "/views/meal.html")
});
app.get("/ingredient", (req, res) => {
	res.sendFile(__dirname + "/views/ingredient.html")
});

//database
app.get("/database/ingredients", (req, res) => {
	res.sendFile(__dirname + "/public/database/ingredients.json");
});
app.get("/database/recipes", (req, res) => {
	res.sendFile(__dirname + "/public/database/recipes.json");
});




app.listen(port, host, () => {
	console.log("Server started on port " + port);
});
