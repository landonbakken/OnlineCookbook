const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");

const app = express();
const port = 4080;
const host = "0.0.0.0";

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/js", express.static(__dirname + 'public/js'));
app.use("/img", express.static(__dirname + 'public/img'));
app.use("/jsonInfo", express.static(__dirname + 'public/jsonInfo'));

app.set('views', './views');

//info pages
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

//edit pages
app.get("/add/ingredient", (req, res) => {
	res.sendFile(__dirname + "/views/addIngredient.html")
});
app.get("/add/ingredient/:ingredient", (req, res) => {
	res.sendFile(__dirname + "/views/addIngredient.html")
});
app.get("/add/recipe", (req, res) => {
	res.sendFile(__dirname + "/views/addRecipe.html")
});
app.get("/add/recipe/:recipe", (req, res) => {
	res.sendFile(__dirname + "/views/addRecipe.html")
});

//delete items
app.get("/remove/recipe/:recipe", (req, res) => {
	console.log("remove " + req.params.recipe + " from recipes");
	if(removeFromJsonFile(req.params.recipe, __dirname + "/public/jsonInfo/recipes.json")){
		res.send("Succesfully removed " + req.params.recipe + " from recipes");
	}
	else{
		res.send("Could not remove " + req.params.recipe + " from recipes");
	}
});
app.get("/remove/ingredient/:ingredient", (req, res) => {
	console.log("remove " + req.params.ingredient + " from ingredients");
	if(removeFromJsonFile(req.params.ingredient, __dirname + "/public/jsonInfo/ingredients.json")){
		res.send("Succesfully removed " + req.params.ingredient + " from ingredients");
	}
	else{
		res.send("Could not remove " + req.params.recipe + " from ingredients");
	}
});

//recieve info
app.post("/recieve", (req, res) => {
    res.send('Data received');
	const parent = req.body[Object.keys(req.body)[0]]["parent"];
    console.log("Recieved data: ", parent);
	if(parent == "recipes"){
		addToJsonFile(req.body, __dirname + "/public/jsonInfo/recipes.json")
	}
	else if(parent == "ingredients"){
		addToJsonFile(req.body, __dirname + "/public/jsonInfo/ingredients.json")
	}
	else{
		console.log("Uknown parent: " + parent);
	}
});

function addToJsonFile(addition, filename){
	let jsonFile = fs.readFileSync(filename);
	let info = JSON.parse(jsonFile);
	//console.log(info);
	info[Object.keys(addition)[0]] = addition[Object.keys(addition)[0]];
	jsonFile = JSON.stringify(info, null, "\t");
	fs.writeFileSync(filename, jsonFile);
}

function removeFromJsonFile(propertyToRemove, filename){
	let jsonFile = fs.readFileSync(filename);
	let info = JSON.parse(jsonFile);
	//console.log(info);
	var existed = false;
	if(info[propertyToRemove] != null){
		existed = true;
		delete info[propertyToRemove];
	}
	jsonFile = JSON.stringify(info, null, "\t");
	fs.writeFileSync(filename, jsonFile);
	return existed;
}

//jsonInfo
app.get("/jsonInfo/ingredients", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/ingredients.json");
});
app.get("/jsonInfo/recipes", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/recipes.json");
});
app.get("/jsonInfo/units", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/units.json");
});


//start
app.listen(port, host, () => {
	console.log("Server started on port " + port);
});
