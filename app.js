const express = require('express');

const app = express();
const port = 4000;
const host = "0.0.0.0";

app.use(express.static("public"));
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/js", express.static(__dirname + 'public/js'));
app.use("/img", express.static(__dirname + 'public/img'));
app.use("/jsonInfo", express.static(__dirname + 'public/jsonInfo'));

app.set('views', './views');

app.get("", (req, res) => {
	res.sendFile(__dirname + "/views/search.html");
});
app.get("/recipe/:recipe", (req, res) => {
	res.sendFile(__dirname + "/views/recipe.html")
});
app.get("/meal/:meal", (req, res) => {
	res.sendFile(__dirname + "/views/meal.html")
});
app.get("/ingredient/:ingredient", (req, res) => {
	res.sendFile(__dirname + "/views/ingredient.html")
});

//jsonInfo
app.get("/jsonInfo/ingredients", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/ingredients.json");
});
app.get("/jsonInfo/recipes", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/recipes.json");
});




app.listen(port, host, () => {
	console.log("Server started on port " + port);
});
