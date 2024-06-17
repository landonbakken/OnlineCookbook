import json

# Example usage
inputFile = "foodData\\FoodData_Central_sr_legacy_food_json_2021-10-28.json" #"foodData\\testFormatted.json"
outputFile = "foodData\\descriptions.txt"
dataFile = None

def loadFoodData():
    global dataFile
    
    #don't load it if it's already loaded
    if dataFile != None:
        return
    
    #load data
    try:
        with open(inputFile, "r") as infile:
            # load data
            dataFile = json.load(infile)
    except FileNotFoundError:
        return "Data file not found"
    except json.JSONDecodeError:
        return "Error decoding JSON"

def getFoodCalPerGram(foodIndex):
    # load data
    loadFoodData()

    # get food data
    foodData = dataFile["SRLegacyFoods"][foodIndex]

    # find index of cals and get cals per serving
    kcals_per_serving = None
    for nutrient in foodData["foodNutrients"]:
        #if it is the kcal info
        if (nutrient["nutrient"]["name"] == "Energy" and nutrient["nutrient"]["unitName"] == "kcal"):
            # get kcals and return kcals/gram (everything is based on 100 grams)
            return round(nutrient["amount"] / 100, 2)

    #couldnt find kcal info
    print("Could not find cals/gram for food with index of", foodIndex)
    return "N/A"

def printDescriptionList():
    # load data
    loadFoodData()
    foods = dataFile["SRLegacyFoods"]
    
    try:
        with open(outputFile, 'w') as outfile:
            for food in foods:
                description = food["description"]
                if"Sweetener" in description:
                    outfile.write(description + '\n')
    except Exception as e:
        print(f"An error occurred: {e}")

def foodIndexFromID(fdcId):
    # load data
    loadFoodData()
    foods = dataFile["SRLegacyFoods"]
    
    index = 0
    for food in foods:
        if fdcId == food["fdcId"]:
            return index
        index += 1

fdcId = 170673
index = foodIndexFromID(fdcId)

print("FDC-ID:", fdcId)
print("Index", index)
print("Description:", dataFile["SRLegacyFoods"][index]["description"])
print("kcals/gram:", getFoodCalPerGram(index))
