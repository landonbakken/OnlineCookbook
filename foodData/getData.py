import json

# Example usage
#input_file = 'C:\\Users\\landonbakken\\Documents\\GitHub\\OnlineCookbook\\foodData\\test.json'
input_file = 'C:\\Users\\landonbakken\\Documents\\GitHub\\OnlineCookbook\\foodData\\testFormatted.json'

with open(input_file, 'r') as infile:
    #load data
    dataFile = json.load(infile)
    
    #get food data
    foodData = dataFile["SRLegacyFoods"][0]
    
    #find index of cals
    kcal_per_serving = None
    for nutrient in foodData["foodNutrients"]:
        if nutrient["nutrient"]["name"] == "Energy" and nutrient["nutrient"]["unitName"] == "kcal":
            kcal_per_serving = nutrient["amount"]
            break

    gram_weight = next((portion["gramWeight"] for portion in foodData["foodPortions"]), None)

    # Calculate calories per gram
    if kcal_per_serving is not None and gram_weight is not None:
        # Convert to kcal/kg
        calories_per_g = kcal_per_serving * 1000 / gram_weight
        print(f"Calories per gram: {calories_per_g:.2f} cal/g")
    else:
        print("Calories per gram could not be calculated")