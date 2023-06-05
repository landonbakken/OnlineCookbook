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
/*app.get("/add/recipe", (req, res) => {
	res.sendFile(__dirname + "/views/addRecipe.html")
});*/

//recieve info
app.post("/recieve", (req, res) => {
    res.send('Data received');
    //console.log("Recieved data: ", req.body);
	addToJsonFile(req.body, __dirname + "/public/jsonInfo/ingredients.json")
});

function addToJsonFile(addition, filename){
	let jsonFile = fs.readFileSync(filename);
	let info = JSON.parse(jsonFile);
	//console.log(info);
	info[Object.keys(addition)[0]] = addition[Object.keys(addition)[0]];
	jsonFile = JSON.stringify(info, null, "\t");
	fs.writeFileSync(filename,jsonFile);
}

//jsonInfo
app.get("/jsonInfo/ingredients", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/ingredients.json");
});
app.get("/jsonInfo/recipes", (req, res) => {
	res.sendFile(__dirname + "/public/jsonInfo/recipes.json");
});


//start
app.listen(port, host, () => {
	console.log("Server started on port " + port);
});
