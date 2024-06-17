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
        if (nutrient["nutrient"]["name"] == "Energy" and nutrient["nutrient"]["unitName"] == "kcal"):
            # convert kcals to cals
            kcals_per_serving = nutrient["amount"]
            break

    # get grams per portion
    grams_per_serving = None
    for portion in foodData["foodPortions"]:
        grams_per_serving = portion["gramWeight"]
        break

    # Calculate calories per gram
    if kcals_per_serving is not None and grams_per_serving is not None:
        # Convert to cal/g
        calories_per_g = kcals_per_serving / grams_per_serving
        return calories_per_g
    else:
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

def foodIndexFromDescription(description):
    # load data
    loadFoodData()
    foods = dataFile["SRLegacyFoods"]
    
    index = 0
    for food in foods:
        if description == food["description"]:
            return index
        index += 1


#foodIndex = 0
#cals_per_gram = getFoodCalPerGram(foodIndex, input_file)
#print("Food with index", foodIndex, "has calories per gram of", cals_per_gram)
index = foodIndexFromDescription("Sweeteners, for baking, contains sugar and sucralose")
print(index)
print(getFoodCalPerGram(index))
