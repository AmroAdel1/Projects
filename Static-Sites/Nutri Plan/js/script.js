/**
 * NutriPlan — meal discovery, nutrition lookup, packaged-product scanner,
 * and a localStorage-backed daily food log.
 *
 * Modules in this file:
 *  1. MealDBAPI       — wraps TheMealDB's public recipe API
 *  2. NutritionAPI    — wraps the NutriPlan nutrition-analysis API
 *  3. OpenFoodFactsAPI— wraps the Open Food Facts packaged-product API
 *  4. StateStore      — app state + localStorage persistence
 *  5. UI              — HTML template builders
 *  6. NutriPlanApp    — the main app class (routing, page rendering, events)
 *  7. Bootstrap + demo Plotly charts
 */

/* ===========================================================
 * 1. MealDBAPI — TheMealDB recipe API
 * ========================================================= */
const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function searchMealsByName(query) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error searching meals by name:", error);
    return [];
  }
}

async function searchMealsByFirstLetter(letter) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/search.php?f=${letter}`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error searching meals by letter:", error);
    return [];
  }
}

async function filterMealsByIngredient(ingredient) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error filtering meals by ingredient:", error);
    return [];
  }
}

async function filterMealsByCategory(category) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error filtering meals by category:", error);
    return [];
  }
}

async function filterMealsByArea(area) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error filtering meals by area:", error);
    return [];
  }
}

async function getAllCategories() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/categories.php`);
    return (await response.json()).categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getCategoryList() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?c=list`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error fetching category list:", error);
    return [];
  }
}

async function getAreaList() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?a=list`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error fetching area list:", error);
    return [];
  }
}

async function getIngredientList() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?i=list`);
    return (await response.json()).meals || [];
  } catch (error) {
    console.error("Error fetching ingredient list:", error);
    return [];
  }
}

async function getMealById(id) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    return null;
  }
}

async function getRandomMeal() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error("Error fetching random meal:", error);
    return null;
  }
}

async function getMultipleRandomMeals(count = 5) {
  try {
    const requests = Array(count).fill().map(() => getRandomMeal());
    return (await Promise.all(requests)).filter((meal) => meal !== null);
  } catch (error) {
    console.error("Error fetching multiple random meals:", error);
    return [];
  }
}

// Converts a meal's strIngredient1..20 / strMeasure1..20 fields into a
// clean array of { ingredient, measure } objects
function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient: ingredient.trim(), measure: measure ? measure.trim() : "" });
    }
  }
  return ingredients;
}

function getIngredientThumbnail(ingredientName, size = "small") {
  const sizeSuffix = size === "medium" ? "-medium" : "-small";
  return `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredientName)}${sizeSuffix}.png`;
}

// Splits raw instructions text into clean, numbering-free steps, dropping
// short lines and lines that are just "Step N" / "N." labels
function parseInstructions(instructionsText) {
  if (!instructionsText) return [];

  return instructionsText
    .split(/(?:\r\n|\r|\n)+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^\d+[\.\)]\s*/, ""))
    .filter((line) => {
      const isStepLabelOnly = /^step\s*\d+\.?$/i.test(line) || /^\d+\.?$/.test(line);
      return isStepLabelOnly ? false : line.length > 5;
    });
}

const MealDBAPI = {
  searchMealsByName,
  searchMealsByFirstLetter,
  filterMealsByIngredient,
  filterMealsByCategory,
  filterMealsByArea,
  getAllCategories,
  getCategoryList,
  getAreaList,
  getIngredientList,
  getMealById,
  getRandomMeal,
  getMultipleRandomMeals,
  extractIngredients,
  getIngredientThumbnail,
  parseInstructions,
};

/* ===========================================================
 * 2. NutritionAPI — recipe/food nutrition analysis
 * ========================================================= */
const NUTRITION_API_BASE_URL = "https://nutriplan-api.vercel.app/api";
const NUTRITION_API_KEY = "xRGnhxcXrKuX8hJpeeQE5Rac9b7dyQDpaMs5fWFL";
const nutritionCache = new Map();

function clearNutritionCache() {
  nutritionCache.clear();
}

async function analyzeRecipe(recipeName, ingredients) {
  const cacheKey = `recipe_${recipeName}_${ingredients.join("|")}`;
  if (nutritionCache.has(cacheKey)) return nutritionCache.get(cacheKey);

  try {
    const response = await fetch(`${NUTRITION_API_BASE_URL}/nutrition/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": NUTRITION_API_KEY },
      body: JSON.stringify({ recipeName, ingredients }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("❌ Nutrition API error:", errorBody);
      throw new Error(errorBody.error?.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      console.error("❌ API returned failure:", result);
      throw new Error(result.error?.message || result.error || "Analysis failed");
    }

    const data = result.data;
    const nutritionInfo = {
      uri: `nutriplan://nutrition/${Date.now()}`,
      yield: data.servings,
      calories: data.totals.calories,
      totalWeight: data.totalWeight,
      dietLabels: [],
      healthLabels: [],
      cautions: [],
      totals: data.totals,
      perServing: data.perServing,
      totalNutrients: {
        ENERC_KCAL: { label: "Energy", quantity: data.totals.calories, unit: "kcal" },
        FAT: { label: "Fat", quantity: data.totals.fat, unit: "g" },
        FASAT: { label: "Saturated Fat", quantity: data.totals.saturatedFat, unit: "g" },
        CHOCDF: { label: "Carbohydrates", quantity: data.totals.carbs, unit: "g" },
        FIBTG: { label: "Fiber", quantity: data.totals.fiber, unit: "g" },
        SUGAR: { label: "Sugars", quantity: data.totals.sugar, unit: "g" },
        PROCNT: { label: "Protein", quantity: data.totals.protein, unit: "g" },
        CHOLE: { label: "Cholesterol", quantity: data.totals.cholesterol, unit: "mg" },
        NA: { label: "Sodium", quantity: data.totals.sodium, unit: "mg" },
      },
      totalDaily: calculateDailyValuePercentages(data.totals),
      ingredients: data.ingredients.map((ingredient) => ({
        text: ingredient.original,
        food: ingredient.matched?.description || ingredient.parsed?.foodName,
        grams: ingredient.grams,
        calories: ingredient.nutrition?.calories || 0,
        protein: ingredient.nutrition?.protein || 0,
        fat: ingredient.nutrition?.fat || 0,
        carbs: ingredient.nutrition?.carbs || 0,
      })),
    };

    nutritionCache.set(cacheKey, nutritionInfo);
    return nutritionInfo;
  } catch (error) {
    console.error("❌ Error analyzing recipe:", error);
    return getFallbackNutritionData(recipeName, ingredients);
  }
}

// Converts absolute nutrient totals into %-of-daily-value figures, based
// on standard 2000-calorie-diet reference values
function calculateDailyValuePercentages(totals) {
  const dailyReference = {
    calories: 2000,
    fat: 65,
    saturatedFat: 20,
    carbs: 300,
    fiber: 25,
    protein: 50,
    cholesterol: 300,
    sodium: 2400,
  };

  return {
    ENERC_KCAL: { label: "Energy", quantity: Math.round((totals.calories / dailyReference.calories) * 100), unit: "%" },
    FAT: { label: "Fat", quantity: Math.round((totals.fat / dailyReference.fat) * 100), unit: "%" },
    FASAT: { label: "Saturated Fat", quantity: Math.round((totals.saturatedFat / dailyReference.saturatedFat) * 100), unit: "%" },
    CHOCDF: { label: "Carbohydrates", quantity: Math.round((totals.carbs / dailyReference.carbs) * 100), unit: "%" },
    FIBTG: { label: "Fiber", quantity: Math.round((totals.fiber / dailyReference.fiber) * 100), unit: "%" },
    PROCNT: { label: "Protein", quantity: Math.round((totals.protein / dailyReference.protein) * 100), unit: "%" },
    CHOLE: { label: "Cholesterol", quantity: Math.round((totals.cholesterol / dailyReference.cholesterol) * 100), unit: "%" },
    NA: { label: "Sodium", quantity: Math.round((totals.sodium / dailyReference.sodium) * 100), unit: "%" },
  };
}

// Used when the nutrition API call fails entirely — a clearly-approximate
// estimate so the UI still has something to show
function getFallbackNutritionData(recipeName, ingredients) {
  console.warn("⚠️ Using fallback nutrition data");
  const estimatedCalories = ingredients.length * 100;

  return {
    uri: `fallback://nutrition/${Date.now()}`,
    yield: 4,
    calories: estimatedCalories,
    totalWeight: ingredients.length * 100,
    dietLabels: [],
    healthLabels: [],
    cautions: [],
    totalNutrients: {
      ENERC_KCAL: { label: "Energy", quantity: estimatedCalories, unit: "kcal" },
      FAT: { label: "Fat", quantity: 0, unit: "g" },
      FASAT: { label: "Saturated Fat", quantity: 0, unit: "g" },
      CHOCDF: { label: "Carbohydrates", quantity: 0, unit: "g" },
      FIBTG: { label: "Fiber", quantity: 0, unit: "g" },
      SUGAR: { label: "Sugars", quantity: 0, unit: "g" },
      PROCNT: { label: "Protein", quantity: 0, unit: "g" },
      CHOLE: { label: "Cholesterol", quantity: 0, unit: "mg" },
      NA: { label: "Sodium", quantity: 0, unit: "mg" },
    },
    totalDaily: {},
    ingredients: ingredients.map((text) => ({
      text,
      food: "Unknown",
      grams: 100,
      calories: 100,
      protein: 0,
      fat: 0,
      carbs: 0,
      notFound: true,
    })),
  };
}

// Converts the raw API/fallback nutrition shape into simple per-serving
// figures the UI can render directly
function formatNutritionForDisplay(nutritionData) {
  if (!nutritionData) return null;

  const servings = nutritionData.yield || 4;
  const perServing = nutritionData.perServing;
  const totals = nutritionData.totals;

  // Preferred path: the API already gives us per-serving + totals directly
  if (perServing && totals) {
    return {
      servings,
      caloriesPerServing: perServing.calories,
      totalCalories: totals.calories,
      macros: {
        protein: { amount: perServing.protein, dailyValue: Math.round((perServing.protein / 50) * 100) },
        carbs: { amount: perServing.carbs, dailyValue: Math.round((perServing.carbs / 300) * 100) },
        fat: { amount: perServing.fat, dailyValue: Math.round((perServing.fat / 65) * 100) },
        fiber: { amount: perServing.fiber, dailyValue: Math.round((perServing.fiber / 25) * 100) },
        sugar: { amount: perServing.sugar, dailyValue: 0 },
        saturatedFat: { amount: perServing.saturatedFat, dailyValue: Math.round((perServing.saturatedFat / 20) * 100) },
      },
      other: { cholesterol: perServing.cholesterol, sodium: perServing.sodium },
      dietLabels: nutritionData.dietLabels || [],
      healthLabels: nutritionData.healthLabels || [],
    };
  }

  // Fallback path: derive per-serving values from totalNutrients / totalDaily
  const totalNutrients = nutritionData.totalNutrients || {};
  const totalDaily = nutritionData.totalDaily || {};

  return {
    servings,
    caloriesPerServing: Math.round((nutritionData.calories || 0) / servings),
    totalCalories: Math.round(nutritionData.calories || 0),
    macros: {
      protein: {
        amount: Math.round((totalNutrients.PROCNT?.quantity || 0) / servings),
        dailyValue: Math.round((totalDaily.PROCNT?.quantity || 0) / servings),
      },
      carbs: {
        amount: Math.round((totalNutrients.CHOCDF?.quantity || 0) / servings),
        dailyValue: Math.round((totalDaily.CHOCDF?.quantity || 0) / servings),
      },
      fat: {
        amount: Math.round((totalNutrients.FAT?.quantity || 0) / servings),
        dailyValue: Math.round((totalDaily.FAT?.quantity || 0) / servings),
      },
      fiber: {
        amount: Math.round((totalNutrients.FIBTG?.quantity || 0) / servings),
        dailyValue: Math.round((totalDaily.FIBTG?.quantity || 0) / servings),
      },
      sugar: {
        amount: Math.round((totalNutrients.SUGAR?.quantity || 0) / servings),
        dailyValue: 0,
      },
      saturatedFat: {
        amount: Math.round((totalNutrients.FASAT?.quantity || 0) / servings),
        dailyValue: Math.round((totalDaily.FASAT?.quantity || 0) / servings),
      },
    },
    other: {
      cholesterol: Math.round((totalNutrients.CHOLE?.quantity || 0) / servings),
      sodium: Math.round((totalNutrients.NA?.quantity || 0) / servings),
    },
    dietLabels: nutritionData.dietLabels || [],
    healthLabels: nutritionData.healthLabels || [],
  };
}

// Sums calories/protein/carbs/fat/fiber across a list of logged items
// (each with an optional .nutrition sub-object)
function calculateDayTotal(items = []) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const item of items) {
    if (item.nutrition) {
      totals.calories += item.nutrition.calories || 0;
      totals.protein += item.nutrition.protein || 0;
      totals.carbs += item.nutrition.carbs || 0;
      totals.fat += item.nutrition.fat || 0;
      totals.fiber += item.nutrition.fiber || 0;
    }
  }
  return totals;
}

// Analyzes a single food item by name (via the recipe-analysis endpoint,
// treated as a one-ingredient "recipe")
async function getNutritionForItem(itemName) {
  const analysis = await analyzeRecipe("Single Item", [itemName]);
  if (analysis.ingredients && analysis.ingredients.length > 0) {
    const ingredient = analysis.ingredients[0];
    return {
      uri: `nutriplan://item/${Date.now()}`,
      description: ingredient.food,
      calories: ingredient.calories,
      totalWeight: ingredient.grams,
      dietLabels: [],
      healthLabels: [],
      totalNutrients: {
        ENERC_KCAL: { label: "Energy", quantity: ingredient.calories, unit: "kcal" },
        FAT: { label: "Fat", quantity: ingredient.fat, unit: "g" },
        CHOCDF: { label: "Carbohydrates", quantity: ingredient.carbs, unit: "g" },
        PROCNT: { label: "Protein", quantity: ingredient.protein, unit: "g" },
      },
      totalDaily: {},
      ingredients: [{ text: itemName, parsed: [{ quantity: 1, food: ingredient.food, weight: ingredient.grams }] }],
    };
  }
  return null;
}

// NOTE: `limit` is accepted for a future page-size option but isn't
// actually used in the request below — preserved from the original source.
async function searchFoods(query, limit = 5) {
  try {
    const response = await fetch(`${NUTRITION_API_BASE_URL}/nutrition/search?q=${encodeURIComponent(query)}&page=1`, {
      headers: { "x-api-key": NUTRITION_API_KEY },
    });
    if (!response.ok) throw new Error(`Search API error: ${response.status}`);
    return (await response.json()).results || [];
  } catch (error) {
    console.error("Error searching foods:", error);
    return [];
  }
}

const NutritionAPI = {
  analyzeRecipe,
  formatNutritionForDisplay,
  calculateDayTotal,
  getNutritionForItem,
  searchFoods,
  clearNutritionCache,
};

/* ===========================================================
 * 3. OpenFoodFactsAPI — packaged-product nutrition lookup
 * ========================================================= */
const OPENFOODFACTS_BASE_URL = "https://world.openfoodfacts.org";

async function searchProducts(options = {}) {
  try {
    const params = new URLSearchParams({
      page: options.page || 1,
      page_size: options.pageSize || 24,
      json: 1,
      ...(options.searchTerms && { search_terms: options.searchTerms }),
      ...(options.categories && { categories_tags_en: options.categories }),
      ...(options.nutritionGrade && { nutrition_grades_tags: options.nutritionGrade }),
    });

    const response = await fetch(`${OPENFOODFACTS_BASE_URL}/cgi/search.pl?${params}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    return {
      count: data.count || 0,
      page: data.page || 1,
      pageSize: data.page_size || 24,
      products: (data.products || []).map(normalizeProduct),
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return getFallbackProducts(options);
  }
}

async function getProductByBarcode(barcode) {
  try {
    const response = await fetch(`${OPENFOODFACTS_BASE_URL}/api/v0/product/${barcode}.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.status === 0 ? null : normalizeProduct(data.product);
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    return null;
  }
}

async function getProductsByCategory(category, page = 1, pageSize = 24) {
  try {
    const response = await fetch(
      `${OPENFOODFACTS_BASE_URL}/category/${encodeURIComponent(category)}.json?page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return {
      count: data.count || 0,
      page: data.page || 1,
      products: (data.products || []).map(normalizeProduct),
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return { count: 0, page: 1, products: [] };
  }
}

async function getPopularCategories() {
  return [
    { id: "breakfast_cereals", name: "Breakfast Cereals", icon: "fa-wheat-awn" },
    { id: "beverages", name: "Beverages", icon: "fa-bottle-water" },
    { id: "snacks", name: "Snacks", icon: "fa-cookie" },
    { id: "dairy", name: "Dairy Products", icon: "fa-cheese" },
    { id: "fruits", name: "Fruits", icon: "fa-apple-whole" },
    { id: "vegetables", name: "Vegetables", icon: "fa-carrot" },
    { id: "breads", name: "Breads", icon: "fa-bread-slice" },
    { id: "meats", name: "Meats", icon: "fa-drumstick-bite" },
    { id: "frozen_foods", name: "Frozen Foods", icon: "fa-snowflake" },
    { id: "sauces", name: "Sauces & Condiments", icon: "fa-jar" },
  ];
}

// Maps a raw Open Food Facts product object to the simplified shape used
// throughout the rest of the app
function normalizeProduct(rawProduct) {
  return {
    barcode: rawProduct.code || rawProduct._id,
    name: rawProduct.product_name || rawProduct.product_name_en || "Unknown Product",
    brand: rawProduct.brands || "",
    categories: rawProduct.categories || "",
    image: rawProduct.image_front_url || rawProduct.image_url || null,
    thumbnailImage: rawProduct.image_front_small_url || rawProduct.image_small_url || null,
    nutritionGrade: rawProduct.nutrition_grades || rawProduct.nutrition_grade_fr || null,
    novaGroup: rawProduct.nova_group || null,
    ecoscore: rawProduct.ecoscore_grade || null,
    ingredients: rawProduct.ingredients_text || rawProduct.ingredients_text_en || "",
    allergens: rawProduct.allergens || "",
    quantity: rawProduct.quantity || "",
    servingSize: rawProduct.serving_size || "",
    nutrition: {
      calories: rawProduct.nutriments?.["energy-kcal_100g"] || rawProduct.nutriments?.energy_100g || 0,
      fat: rawProduct.nutriments?.fat_100g || 0,
      saturatedFat: rawProduct.nutriments?.["saturated-fat_100g"] || 0,
      carbs: rawProduct.nutriments?.carbohydrates_100g || 0,
      sugar: rawProduct.nutriments?.sugars_100g || 0,
      fiber: rawProduct.nutriments?.fiber_100g || 0,
      protein: rawProduct.nutriments?.proteins_100g || 0,
      salt: rawProduct.nutriments?.salt_100g || 0,
      sodium: rawProduct.nutriments?.sodium_100g || 0,
    },
    labels: rawProduct.labels || "",
    origins: rawProduct.origins || "",
    stores: rawProduct.stores || "",
  };
}

function getNutriScoreInfo(grade) {
  const scores = {
    a: { label: "Excellent", color: "#038141", description: "Very good nutritional quality" },
    b: { label: "Good", color: "#85bb2f", description: "Good nutritional quality" },
    c: { label: "Average", color: "#fecb02", description: "Average nutritional quality" },
    d: { label: "Poor", color: "#ee8100", description: "Poor nutritional quality" },
    e: { label: "Bad", color: "#e63e11", description: "Bad nutritional quality" },
  };
  return scores[grade?.toLowerCase()] || { label: "Unknown", color: "#999", description: "No score available" };
}

function getNovaGroupInfo(novaGroup) {
  const groups = {
    1: { label: "Unprocessed", color: "#038141", description: "Unprocessed or minimally processed foods" },
    2: { label: "Processed Ingredients", color: "#85bb2f", description: "Processed culinary ingredients" },
    3: { label: "Processed", color: "#ee8100", description: "Processed foods" },
    4: { label: "Ultra-processed", color: "#e63e11", description: "Ultra-processed food and drink products" },
  };
  return groups[novaGroup] || { label: "Unknown", color: "#999", description: "No classification available" };
}

// Scales a product's per-100g nutrition figures to an arbitrary serving size (grams)
function calculateNutritionPerServing(product, grams = 100) {
  const ratio = grams / 100;
  const nutrition = product.nutrition;
  return {
    calories: Math.round(nutrition.calories * ratio),
    fat: Math.round(nutrition.fat * ratio * 10) / 10,
    saturatedFat: Math.round(nutrition.saturatedFat * ratio * 10) / 10,
    carbs: Math.round(nutrition.carbs * ratio * 10) / 10,
    sugar: Math.round(nutrition.sugar * ratio * 10) / 10,
    fiber: Math.round(nutrition.fiber * ratio * 10) / 10,
    protein: Math.round(nutrition.protein * ratio * 10) / 10,
    salt: Math.round(nutrition.salt * ratio * 100) / 100,
    sodium: Math.round(nutrition.sodium * ratio),
  };
}

// Small hard-coded sample of products used when the live Open Food Facts
// API is unreachable, so the Products page still has something to show
function getFallbackProducts(options = {}) {
  let sampleProducts = [
    {
      code: "7613034626844",
      product_name: "Cheerios Original",
      brands: "Nestlé",
      categories: "Breakfast cereals",
      image_front_url: "https://images.openfoodfacts.org/images/products/761/303/462/6844/front_en.jpg",
      nutrition_grades: "a",
      nova_group: 4,
      nutriments: {
        "energy-kcal_100g": 372, fat_100g: 4.2, "saturated-fat_100g": 0.8,
        carbohydrates_100g: 74, sugars_100g: 4.8, fiber_100g: 8.6, proteins_100g: 8.4, salt_100g: 1.1,
      },
    },
    {
      code: "5000159484695",
      product_name: "Nutella",
      brands: "Ferrero",
      categories: "Spreads, Chocolate spreads",
      image_front_url: "https://images.openfoodfacts.org/images/products/500/015/948/4695/front_en.jpg",
      nutrition_grades: "e",
      nova_group: 4,
      nutriments: {
        "energy-kcal_100g": 539, fat_100g: 30.9, "saturated-fat_100g": 10.6,
        carbohydrates_100g: 57.5, sugars_100g: 56.3, fiber_100g: 0, proteins_100g: 6.3, salt_100g: 0.107,
      },
    },
    {
      code: "3017620422003",
      product_name: "Nutella",
      brands: "Ferrero",
      categories: "Chocolate spreads",
      nutrition_grades: "e",
      nova_group: 4,
      nutriments: {
        "energy-kcal_100g": 539, fat_100g: 31, carbohydrates_100g: 57, sugars_100g: 56, proteins_100g: 6,
      },
    },
    {
      code: "8410076472458",
      product_name: "Greek Yogurt",
      brands: "Danone",
      categories: "Dairy, Yogurts",
      nutrition_grades: "a",
      nova_group: 1,
      nutriments: {
        "energy-kcal_100g": 97, fat_100g: 5, "saturated-fat_100g": 3.3,
        carbohydrates_100g: 3.6, sugars_100g: 3.6, proteins_100g: 9, salt_100g: 0.1,
      },
    },
    {
      code: "5449000000996",
      product_name: "Coca-Cola Original",
      brands: "Coca-Cola",
      categories: "Beverages, Sodas",
      nutrition_grades: "e",
      nova_group: 4,
      nutriments: {
        "energy-kcal_100g": 42, fat_100g: 0, carbohydrates_100g: 10.6, sugars_100g: 10.6, proteins_100g: 0, salt_100g: 0,
      },
    },
  ];

  if (options.searchTerms) {
    const query = options.searchTerms.toLowerCase();
    sampleProducts = sampleProducts.filter(
      (product) => product.product_name.toLowerCase().includes(query) || product.brands.toLowerCase().includes(query)
    );
  }

  if (options.nutritionGrade) {
    sampleProducts = sampleProducts.filter(
      (product) => product.nutrition_grades === options.nutritionGrade.toLowerCase()
    );
  }

  return {
    count: sampleProducts.length,
    page: options.page || 1,
    pageSize: options.pageSize || 24,
    products: sampleProducts.map(normalizeProduct),
  };
}

const OpenFoodFactsAPI = {
  searchProducts,
  getProductByBarcode,
  getProductsByCategory,
  getPopularCategories,
  getNutriScoreInfo,
  getNovaGroupInfo,
  calculateNutritionPerServing,
};

/* ===========================================================
 * 4. StateStore — app state + localStorage persistence
 * ========================================================= */
const STORAGE_KEYS = {
  SAVED_RECIPES: "nutriplan_saved_recipes",
  DAILY_LOG: "nutriplan_daily_log",
  USER_SETTINGS: "nutriplan_user_settings",
  SHOPPING_LIST: "nutriplan_shopping_list",
};

const DEFAULT_USER_SETTINGS = {
  calorieGoal: 2000,
  proteinGoal: 50,
  carbsGoal: 250,
  fatGoal: 65,
  fiberGoal: 25,
  waterGoal: 2000,
  waterGlassSize: 250,
  weight: 70,
  height: 170,
  age: 30,
  gender: "male",
  activityLevel: "moderate",
  dietaryRestrictions: [],
  allergies: [],
  notifications: true,
  darkMode: false,
  weekStart: "monday",
  measurementUnit: "metric",
};

// Module-level mutable app state
const appState = {
  currentPage: "meals",
  searchQuery: "",
  selectedCategory: null,
  selectedArea: null,
  selectedMeal: null,
  categories: [],
  areas: [],
  meals: [],
  featuredMeals: [],
  isLoading: false,
  error: null,
};

function initializeState() {
  const storedSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
  appState.userSettings = storedSettings ? JSON.parse(storedSettings) : { ...DEFAULT_USER_SETTINGS };

  const storedRecipes = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
  appState.savedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

  const storedDailyLog = localStorage.getItem(STORAGE_KEYS.DAILY_LOG);
  appState.dailyLog = storedDailyLog ? JSON.parse(storedDailyLog) : {};

  const storedShoppingList = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
  appState.shoppingList = storedShoppingList ? JSON.parse(storedShoppingList) : [];

  appState.streaks = calculateStreaks(appState.dailyLog);
  return appState;
}

// Counts how many consecutive days (ending today, going backwards) have any
// logged nutrition, and the best such streak seen within the last year
function calculateStreaks(dailyLog) {
  const today = new Date();
  let currentStreak = 0;
  let bestStreak = 0;

  for (let daysAgo = 0; daysAgo < 365; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateKey = date.toISOString().split("T")[0];
    const dayLog = dailyLog[dateKey];

    if (dayLog && dayLog.totalCalories > 0) {
      if (daysAgo === currentStreak) currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (daysAgo > 0) {
      break;
    }
  }

  return { nutrition: currentStreak, maxNutrition: bestStreak };
}

function getState() {
  return appState;
}

// Merges `partialState` into appState. When `persist` is true, also writes
// the relevant slice(s) back to localStorage and fires a "stateChange" event.
function updateState(partialState, persist = false) {
  Object.assign(appState, partialState);

  if (persist) {
    if (partialState.savedRecipes !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(appState.savedRecipes));
    }
    if (partialState.dailyLog !== undefined) {
      localStorage.setItem(STORAGE_KEYS.DAILY_LOG, JSON.stringify(appState.dailyLog));
    }
    if (partialState.userSettings !== undefined) {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(appState.userSettings));
    }
    if (partialState.shoppingList !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(appState.shoppingList));
    }
  }

  window.dispatchEvent(new CustomEvent("stateChange", { detail: partialState }));
}

function saveRecipe(meal) {
  const alreadySaved = appState.savedRecipes.some((recipe) => recipe.idMeal === meal.idMeal);
  if (!alreadySaved) {
    appState.savedRecipes.push({ ...meal, savedAt: new Date().toISOString() });
    updateState({ savedRecipes: appState.savedRecipes }, true);
  }
}

function unsaveRecipe(mealId) {
  appState.savedRecipes = appState.savedRecipes.filter((recipe) => recipe.idMeal !== mealId);
  updateState({ savedRecipes: appState.savedRecipes }, true);
}

function isRecipeSaved(mealId) {
  return appState.savedRecipes.some((recipe) => recipe.idMeal === mealId);
}

// (Not currently called by the UI directly, but kept for API completeness —
// logs a nutrition entry under an arbitrary date key)
function logDailyNutrition(dateKey, entry) {
  if (!appState.dailyLog[dateKey]) {
    appState.dailyLog[dateKey] = { meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, water: 0 };
  }
  appState.dailyLog[dateKey].meals.push(entry);
  appState.dailyLog[dateKey].totalCalories += entry.calories || 0;
  appState.dailyLog[dateKey].totalProtein += entry.protein || 0;
  appState.dailyLog[dateKey].totalCarbs += entry.carbs || 0;
  appState.dailyLog[dateKey].totalFat += entry.fat || 0;
  updateState({ dailyLog: appState.dailyLog }, true);
}

function logWaterIntake(dateKey, amountMl) {
  if (!appState.dailyLog[dateKey]) {
    appState.dailyLog[dateKey] = {
      meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, water: 0, waterLog: [],
    };
  }
  appState.dailyLog[dateKey].water += amountMl;
  appState.dailyLog[dateKey].waterLog = appState.dailyLog[dateKey].waterLog || [];
  appState.dailyLog[dateKey].waterLog.push({ amount: amountMl, time: new Date().toISOString() });
  updateState({ dailyLog: appState.dailyLog }, true);
}

function getTodayWaterIntake() {
  const todayKey = getTodayString();
  const todayLog = appState.dailyLog[todayKey] || { water: 0, waterLog: [] };
  const goal = appState.userSettings.waterGoal;
  const glassSize = appState.userSettings.waterGlassSize;

  return {
    current: todayLog.water || 0,
    goal,
    glassSize,
    glasses: Math.floor((todayLog.water || 0) / glassSize),
    targetGlasses: Math.ceil(goal / glassSize),
    percentage: Math.min(100, Math.round(((todayLog.water || 0) / goal) * 100)),
    log: todayLog.waterLog || [],
  };
}

function logWaterGlass() {
  const todayKey = getTodayString();
  const glassSize = appState.userSettings.waterGlassSize;
  logWaterIntake(todayKey, glassSize);
  return getTodayWaterIntake();
}

function getDailyProgress(dateKey) {
  const dayLog = appState.dailyLog[dateKey] || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, water: 0 };
  const settings = appState.userSettings;

  return {
    calories: Math.min(100, Math.round((dayLog.totalCalories / settings.calorieGoal) * 100)),
    protein: Math.min(100, Math.round((dayLog.totalProtein / settings.proteinGoal) * 100)),
    carbs: Math.min(100, Math.round((dayLog.totalCarbs / settings.carbsGoal) * 100)),
    fat: Math.min(100, Math.round((dayLog.totalFat / settings.fatGoal) * 100)),
    water: Math.min(100, Math.round((dayLog.water / settings.waterGoal) * 100)),
    overall: 0,
  };
}

function addToShoppingList(items) {
  items.forEach((item) => {
    const alreadyOnList = appState.shoppingList.some(
      (existing) => existing.ingredient.toLowerCase() === item.ingredient.toLowerCase()
    );
    if (!alreadyOnList) {
      appState.shoppingList.push({ ...item, id: Date.now() + Math.random(), checked: false, addedAt: new Date().toISOString() });
    }
  });
  updateState({ shoppingList: appState.shoppingList }, true);
}

function toggleShoppingItem(id) {
  const item = appState.shoppingList.find((entry) => entry.id === id);
  if (item) {
    item.checked = !item.checked;
    updateState({ shoppingList: appState.shoppingList }, true);
  }
}

function removeFromShoppingList(id) {
  appState.shoppingList = appState.shoppingList.filter((entry) => entry.id !== id);
  updateState({ shoppingList: appState.shoppingList }, true);
}

function clearCompletedShoppingItems() {
  appState.shoppingList = appState.shoppingList.filter((entry) => !entry.checked);
  updateState({ shoppingList: appState.shoppingList }, true);
}

function updateUserSettings(partialSettings) {
  appState.userSettings = { ...appState.userSettings, ...partialSettings };
  updateState({ userSettings: appState.userSettings }, true);
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

// Returns the last 7 days (including today) with each day's logged nutrition
function getWeeklySummary() {
  const today = new Date();
  const dateKeys = [];
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    dateKeys.push(date.toISOString().split("T")[0]);
  }

  return dateKeys.map((dateKey) => ({
    date: dateKey,
    dayName: new Date(dateKey).toLocaleDateString("en-US", { weekday: "short" }),
    nutrition: appState.dailyLog[dateKey] || { totalCalories: 0 },
  }));
}

function getBMI() {
  const { weight, height } = appState.userSettings;
  if (!weight || !height) return null;

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 25 && bmi < 30) category = "Overweight";
  else if (bmi >= 30) category = "Obese";

  return { value: bmi.toFixed(1), category };
}

function getTotalStats() {
  const savedRecipesCount = appState.savedRecipes?.length || 0;
  const plannedMealsCount = Object.values(appState.mealPlan || {}).reduce(
    (total, dayPlan) => total + Object.keys(dayPlan).length,
    0
  );
  const shoppingItemsCount = appState.shoppingList?.length || 0;
  const workoutsLoggedCount = Object.keys(appState.workoutLog || {}).length;

  return {
    savedRecipes: savedRecipesCount,
    plannedMeals: plannedMealsCount,
    shoppingItems: shoppingItemsCount,
    workoutsLogged: workoutsLoggedCount,
  };
}

const StateStore = {
  initializeState,
  getState,
  updateState,
  saveRecipe,
  unsaveRecipe,
  isRecipeSaved,
  logDailyNutrition,
  logWaterIntake,
  getTodayWaterIntake,
  logWaterGlass,
  getDailyProgress,
  addToShoppingList,
  toggleShoppingItem,
  removeFromShoppingList,
  clearCompletedShoppingItems,
  updateUserSettings,
  getTodayString,
  getWeeklySummary,
  getBMI,
  getTotalStats,
};

/* ===========================================================
 * 5. UI — HTML template builders
 * ========================================================= */
function createMealCard(meal) {
  return `
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meal.idMeal}">
            <div class="relative h-48 overflow-hidden">
                <img 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src="${meal.strMealThumb}" 
                    alt="${meal.strMeal}"
                    loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                    ${
                      meal.strCategory
                        ? `
                        <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                            <i class="fa-solid fa-tag text-emerald-600 mr-1"></i>${meal.strCategory}
                        </span>
                    `
                        : ""
                    }
                    ${
                      meal.strArea
                        ? `
                        <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                            <i class="fa-solid fa-globe text-blue-600 mr-1"></i>${meal.strArea}
                        </span>
                    `
                        : ""
                    }
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    ${meal.strMeal}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                    ${meal.strInstructions ? meal.strInstructions.substring(0, 100) + "..." : "Delicious recipe to try!"}
                </p>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                        <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                        ${meal.strCategory || "Various"}
                    </span>
                    <span class="font-semibold text-gray-500">
                        <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                        ${meal.strArea || "International"}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function createCategoryCard(category) {
  const categoryStyles = {
    Beef: { bg: "from-red-50 to-rose-50", border: "border-red-200 hover:border-red-400", iconFrom: "from-red-400", iconTo: "to-rose-500", text: "text-red-600" },
    Chicken: { bg: "from-amber-50 to-orange-50", border: "border-amber-200 hover:border-amber-400", iconFrom: "from-amber-400", iconTo: "to-orange-500", text: "text-amber-600" },
    Dessert: { bg: "from-pink-50 to-rose-50", border: "border-pink-200 hover:border-pink-400", iconFrom: "from-pink-400", iconTo: "to-rose-500", text: "text-pink-600" },
    Lamb: { bg: "from-orange-50 to-amber-50", border: "border-orange-200 hover:border-orange-400", iconFrom: "from-orange-400", iconTo: "to-amber-500", text: "text-orange-600" },
    Miscellaneous: { bg: "from-slate-50 to-gray-50", border: "border-slate-200 hover:border-slate-400", iconFrom: "from-slate-400", iconTo: "to-gray-500", text: "text-slate-600" },
    Pasta: { bg: "from-yellow-50 to-amber-50", border: "border-yellow-200 hover:border-yellow-400", iconFrom: "from-yellow-400", iconTo: "to-amber-500", text: "text-yellow-600" },
    Pork: { bg: "from-rose-50 to-red-50", border: "border-rose-200 hover:border-rose-400", iconFrom: "from-rose-400", iconTo: "to-red-500", text: "text-rose-600" },
    Seafood: { bg: "from-cyan-50 to-blue-50", border: "border-cyan-200 hover:border-cyan-400", iconFrom: "from-cyan-400", iconTo: "to-blue-500", text: "text-cyan-600" },
    Side: { bg: "from-green-50 to-emerald-50", border: "border-green-200 hover:border-green-400", iconFrom: "from-green-400", iconTo: "to-emerald-500", text: "text-green-600" },
    Starter: { bg: "from-teal-50 to-cyan-50", border: "border-teal-200 hover:border-teal-400", iconFrom: "from-teal-400", iconTo: "to-cyan-500", text: "text-teal-600" },
    Vegan: { bg: "from-emerald-50 to-green-50", border: "border-emerald-200 hover:border-emerald-400", iconFrom: "from-emerald-400", iconTo: "to-green-500", text: "text-emerald-600" },
    Vegetarian: { bg: "from-lime-50 to-green-50", border: "border-lime-200 hover:border-lime-400", iconFrom: "from-lime-400", iconTo: "to-green-500", text: "text-lime-600" },
    Breakfast: { bg: "from-amber-50 to-orange-50", border: "border-amber-200 hover:border-amber-400", iconFrom: "from-amber-400", iconTo: "to-orange-500", text: "text-amber-600" },
    Goat: { bg: "from-stone-50 to-amber-50", border: "border-stone-200 hover:border-stone-400", iconFrom: "from-stone-400", iconTo: "to-amber-500", text: "text-stone-600" },
  };

  const style = categoryStyles[category.strCategory] || categoryStyles.Miscellaneous;

  const categoryIcons = {
    Beef: "fa-drumstick-bite", Chicken: "fa-drumstick-bite", Dessert: "fa-cake-candles", Lamb: "fa-drumstick-bite",
    Pasta: "fa-bowl-food", Pork: "fa-bacon", Seafood: "fa-fish", Side: "fa-plate-wheat", Starter: "fa-utensils",
    Vegan: "fa-leaf", Vegetarian: "fa-seedling", Breakfast: "fa-mug-hot", Miscellaneous: "fa-bowl-rice", Goat: "fa-drumstick-bite",
  };
  const icon = categoryIcons[category.strCategory] || "fa-utensils";

  return `
        <div class="category-card bg-gradient-to-br ${style.bg} rounded-xl p-3 border ${style.border} hover:shadow-md cursor-pointer transition-all group" data-category="${category.strCategory}">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-gradient-to-br ${style.iconFrom} ${style.iconTo} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <i class="fa-solid ${icon} text-white text-sm"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-gray-900">${category.strCategory}</h3>
                </div>
            </div>
        </div>
    `;
}

// NOTE: superseded by NutriPlanApp.createMealDetailPageContent for the
// live "meal detail" page, but kept exported/exact from the original source.
function createMealDetailContent(meal, nutrition, ingredients, instructions) {
  const dietLabels = nutrition?.dietLabels || [];
  const healthLabels = nutrition?.healthLabels?.slice(0, 5) || [];

  return `
        <div class="grid grid-cols-2 gap-8 p-8">
            <!-- Left Column -->
            <div>
                <div class="mb-6">
                    <div class="flex items-center gap-2 mb-3 flex-wrap">
                        ${dietLabels.map((label) => `
                            <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">${label.toUpperCase()}</span>
                        `).join("")}
                        ${healthLabels.map((label) => `
                            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">${label.toUpperCase()}</span>
                        `).join("")}
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">${meal.strMeal}</h2>
                    <p class="text-gray-600 mb-4">
                        ${meal.strInstructions ? meal.strInstructions.substring(0, 200) + "..." : "A delicious recipe to try!"}
                    </p>
                    <div class="flex items-center gap-6 mb-6">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <i class="fa-solid fa-globe text-emerald-600"></i>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">${meal.strArea || "International"}</p>
                                <p class="text-xs text-gray-500">Cuisine</p>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-gray-500">
                            <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                            ${meal.strArea || "International"} Cuisine
                        </span>
                    </div>
                </div>
                
                <div class="h-80 rounded-xl overflow-hidden mb-6">
                    <img class="w-full h-full object-cover" src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-emerald-50 rounded-xl p-4 text-center">
                        <i class="fa-solid fa-tag text-emerald-600 text-2xl mb-2"></i>
                        <p class="text-xs text-gray-500 mb-1">Category</p>
                        <p class="text-lg font-bold text-gray-900">${meal.strCategory || "-"}</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4 text-center">
                        <i class="fa-solid fa-globe text-blue-600 text-2xl mb-2"></i>
                        <p class="text-xs text-gray-500 mb-1">Cuisine</p>
                        <p class="text-lg font-bold text-gray-900">${meal.strArea || "-"}</p>
                    </div>
                    <div class="bg-purple-50 rounded-xl p-4 text-center">
                        <i class="fa-solid fa-list text-purple-600 text-2xl mb-2"></i>
                        <p class="text-xs text-gray-500 mb-1">Ingredients</p>
                        <p class="text-lg font-bold text-gray-900">${ingredients.length}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-emerald-600"></i>
                        Ingredients
                    </h3>
                    <div class="space-y-3 max-h-64 overflow-y-auto">
                        ${ingredients.map((ingredient) => `
                            <div class="flex items-center gap-3">
                                <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded"/>
                                <span class="text-gray-700">${ingredient.measure} ${ingredient.ingredient}</span>
                            </div>
                        `).join("")}
                    </div>
                    <button class="add-to-shopping-btn mt-4 w-full py-2.5 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-all flex items-center justify-center gap-2" data-meal-id="${meal.idMeal}" style="display: none;">
                        <i class="fa-solid fa-cart-plus"></i>
                        Add All to Shopping List
                    </button>
                </div>
            </div>
            
            <!-- Right Column -->
            <div>
                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border-2 border-emerald-200">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                        Nutrition Facts
                    </h3>
                    <div class="text-center mb-4 pb-4 border-b-2 border-emerald-200">
                        <p class="text-sm text-gray-600 mb-1">Calories per serving</p>
                        <p class="text-5xl font-bold text-gray-900">${nutrition?.caloriesPerServing || "~350"}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Protein</p>
                            <p class="text-2xl font-bold text-emerald-600">${nutrition?.macros?.protein?.amount || "~25"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${nutrition?.macros?.protein?.dailyValue || "~50"}% DV</p>
                        </div>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Carbs</p>
                            <p class="text-2xl font-bold text-blue-600">${nutrition?.macros?.carbs?.amount || "~30"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${nutrition?.macros?.carbs?.dailyValue || "~10"}% DV</p>
                        </div>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Fat</p>
                            <p class="text-2xl font-bold text-purple-600">${nutrition?.macros?.fat?.amount || "~15"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${nutrition?.macros?.fat?.dailyValue || "~23"}% DV</p>
                        </div>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Fiber</p>
                            <p class="text-2xl font-bold text-orange-600">${nutrition?.macros?.fiber?.amount || "~5"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${nutrition?.macros?.fiber?.dailyValue || "~20"}% DV</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                        Instructions
                    </h3>
                    <div class="space-y-4 max-h-80 overflow-y-auto">
                        ${instructions.map((step, index) => `
                            <div class="flex gap-4">
                                <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                    ${index + 1}
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm text-gray-600">${step}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
                
                ${
                  meal.strYoutube
                    ? `
                    <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200">
                        <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <i class="fa-brands fa-youtube text-red-500"></i>
                            Video Tutorial
                        </h3>
                        <a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer" 
                           class="w-full py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                            <i class="fa-solid fa-play"></i>
                            Watch on YouTube
                        </a>
                    </div>
                `
                    : ""
                }
            </div>
        </div>
        
        <div class="px-8 pb-8">
            <div class="flex items-center gap-4">
                <button class="save-detail-btn flex-1 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2" data-meal-id="${meal.idMeal}">
                    <i class="fa-solid fa-heart"></i>
                    Save Recipe
                </button>
                <button class="close-detail-btn flex-1 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <i class="fa-solid fa-xmark"></i>
                    Close
                </button>
            </div>
        </div>
    `;
}

function createLoadingSpinner() {
  return `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
}

function createEmptyState(message, icon = "fa-search") {
  return `
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid ${icon} text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-500 text-lg">${message}</p>
        </div>
    `;
}

function createAreaFilters(areas, selectedArea = null) {
  return `
        <button class="area-filter-btn px-4 py-2 ${selectedArea ? "bg-gray-100 text-gray-700" : "bg-emerald-600 text-white"} rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 hover:text-white transition-all" data-area="">
            All Cuisines
        </button>
        ${areas.map((area) => `
            <button class="area-filter-btn px-4 py-2 ${selectedArea === area.strArea ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"} rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all" data-area="${area.strArea}">
                ${area.strArea}
            </button>
        `).join("")}
    `;
}

function createDashboardWidget(label, value, subtitle, icon, color = "emerald", trendPercent = null) {
  const trendHtml = trendPercent
    ? `
        <span class="text-xs ${trendPercent > 0 ? "text-green-500" : "text-red-500"} flex items-center gap-1">
            <i class="fa-solid ${trendPercent > 0 ? "fa-arrow-up" : "fa-arrow-down"}"></i>
            ${Math.abs(trendPercent)}%
        </span>
    `
    : "";

  return `
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center">
                    <i class="fa-solid ${icon} text-${color}-600 text-xl"></i>
                </div>
                ${trendHtml}
            </div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">${value}</h3>
            <p class="text-sm text-gray-500">${label}</p>
            ${subtitle ? `<p class="text-xs text-${color}-600 font-medium mt-2">${subtitle}</p>` : ""}
        </div>
    `;
}

function createWaterTracker(waterData) {
  const { current, goal, glasses, targetGlasses, percentage } = waterData;

  const glassesHtml = Array(targetGlasses)
    .fill(0)
    .map((_, index) => `
        <div class="water-glass w-8 h-10 rounded-lg border-2 ${index < glasses ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-gray-50"} 
            cursor-pointer hover:scale-110 transition-all flex items-end justify-center overflow-hidden"
            data-glass="${index + 1}">
            ${index < glasses ? '<i class="fa-solid fa-droplet text-white text-xs mb-1"></i>' : ""}
        </div>
    `)
    .join("");

  return `
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <i class="fa-solid fa-droplet text-white"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Water Intake</h3>
                        <p class="text-xs text-gray-500">${current}ml / ${goal}ml</p>
                    </div>
                </div>
                <span class="text-2xl font-bold text-blue-600">${percentage}%</span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div class="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap mb-4">
                ${glassesHtml}
            </div>
            
            <button id="add-water-btn" class="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-plus"></i>
                Add Glass (${waterData.glassSize}ml)
            </button>
        </div>
    `;
}

function createQuickActionCard(title, subtitle, icon, color, action) {
  return `
        <button class="quick-action-btn bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100 hover:border-${color}-300 group" data-action="${action}">
            <div class="w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i class="fa-solid ${icon} text-${color}-600"></i>
            </div>
            <h4 class="font-semibold text-gray-900 text-sm">${title}</h4>
            <p class="text-xs text-gray-500 mt-1">${subtitle}</p>
        </button>
    `;
}

function createSettingsSection(title, subtitle, contentHtml) {
  return `
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold text-gray-900 mb-1">${title}</h3>
            <p class="text-sm text-gray-500 mb-4">${subtitle}</p>
            ${contentHtml}
        </div>
    `;
}

function createStreakCard(label, currentDays, bestDays, icon, color) {
  return `
        <div class="bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl p-4 border border-${color}-200">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-${color}-500 rounded-xl flex items-center justify-center">
                    <i class="fa-solid ${icon} text-white text-xl"></i>
                </div>
                <div>
                    <p class="text-xs text-${color}-700 font-medium">${label} Streak</p>
                    <p class="text-2xl font-bold text-gray-900">${currentDays} <span class="text-sm font-normal text-gray-500">days</span></p>
                    <p class="text-xs text-gray-500">Best: ${bestDays} days</p>
                </div>
            </div>
        </div>
    `;
}

function createSkeletonCard(type = "recipe") {
  if (type === "recipe") {
    return `
            <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded mb-3 w-full"></div>
                    <div class="flex justify-between">
                        <div class="h-3 bg-gray-200 rounded w-16"></div>
                        <div class="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            </div>
        `;
  }
  if (type === "exercise") {
    return `
            <div class="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        `;
  }
  if (type === "product") {
    return `
            <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div class="h-40 bg-gray-200"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        `;
  }
  return "";
}

function createProductCard(product) {
  const gradeColors = { a: "bg-green-500", b: "bg-lime-500", c: "bg-yellow-500", d: "bg-orange-500", e: "bg-red-500" };
  const novaColors = { 1: "bg-green-500", 2: "bg-lime-500", 3: "bg-orange-500", 4: "bg-red-500" };
  const gradeColor = gradeColors[product.nutritionGrade?.toLowerCase()] || "bg-gray-400";
  const novaColor = novaColors[product.novaGroup] || "bg-gray-400";

  return `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                ${
                  product.image
                    ? `
                    <img 
                        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                        src="${product.image}" 
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center\\'><i class=\\'fa-solid fa-box text-gray-400 text-2xl\\'></i></div>'"
                    />
                `
                    : `
                    <div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                        <i class="fa-solid fa-box text-gray-400 text-2xl"></i>
                    </div>
                `
                }
                
                <!-- Nutri-Score Badge -->
                ${
                  product.nutritionGrade
                    ? `
                    <div class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase">
                        Nutri-Score ${product.nutritionGrade.toUpperCase()}
                    </div>
                `
                    : ""
                }
                
                <!-- NOVA Badge -->
                ${
                  product.novaGroup
                    ? `
                    <div class="absolute top-2 right-2 ${novaColor} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${product.novaGroup}">
                        ${product.novaGroup}
                    </div>
                `
                    : ""
                }
            </div>
            
            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${product.brand || "Unknown Brand"}</p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${product.name}
                </h3>
                
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    ${product.quantity ? `<span><i class="fa-solid fa-weight-scale mr-1"></i>${product.quantity}</span>` : ""}
                    ${product.nutrition?.calories ? `<span><i class="fa-solid fa-fire mr-1"></i>${Math.round(product.nutrition.calories)} kcal/100g</span>` : ""}
                </div>
                
                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${product.nutrition?.protein?.toFixed(1) || 0}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${product.nutrition?.carbs?.toFixed(1) || 0}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${product.nutrition?.fat?.toFixed(1) || 0}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${product.nutrition?.sugar?.toFixed(1) || 0}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createProductDetailContent(product, nutriScoreInfo, novaGroupInfo) {
  return `
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    ${
                      product.image
                        ? `
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain"/>
                    `
                        : `
                        <i class="fa-solid fa-box text-gray-400 text-4xl"></i>
                    `
                    }
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand || "Unknown Brand"}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
                    <p class="text-sm text-gray-500 mb-3">${product.quantity || ""}</p>
                    
                    <div class="flex items-center gap-3">
                        ${
                          product.nutritionGrade
                            ? `
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${nutriScoreInfo.color}20">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${nutriScoreInfo.color}">
                                    ${product.nutritionGrade.toUpperCase()}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${nutriScoreInfo.color}">Nutri-Score</p>
                                    <p class="text-[10px] text-gray-600">${nutriScoreInfo.label}</p>
                                </div>
                            </div>
                        `
                            : ""
                        }
                        
                        ${
                          product.novaGroup
                            ? `
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${novaGroupInfo.color}20">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${novaGroupInfo.color}">
                                    ${product.novaGroup}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${novaGroupInfo.color}">NOVA</p>
                                    <p class="text-[10px] text-gray-600">${novaGroupInfo.label}</p>
                                </div>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-times text-2xl"></i>
                </button>
            </div>
            
            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${Math.round(product.nutrition?.calories || 0)}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min(((product.nutrition?.protein || 0) / 50) * 100, 100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${product.nutrition?.protein?.toFixed(1) || 0}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(((product.nutrition?.carbs || 0) / 100) * 100, 100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${product.nutrition?.carbs?.toFixed(1) || 0}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(((product.nutrition?.fat || 0) / 65) * 100, 100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${product.nutrition?.fat?.toFixed(1) || 0}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min(((product.nutrition?.sugar || 0) / 50) * 100, 100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${product.nutrition?.sugar?.toFixed(1) || 0}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${product.nutrition?.saturatedFat?.toFixed(1) || 0}g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${product.nutrition?.fiber?.toFixed(1) || 0}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${product.nutrition?.salt?.toFixed(2) || 0}g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                    </div>
                </div>
            </div>
            
            <!-- Additional Info -->
            ${
              product.ingredients
                ? `
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-list text-gray-600"></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">${product.ingredients}</p>
                </div>
            `
                : ""
            }
            
            ${
              product.allergens
                ? `
                <div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
                    <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        Allergens
                    </h3>
                    <p class="text-sm text-red-600">${product.allergens}</p>
                </div>
            `
                : ""
            }
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${product.barcode}">
                    <i class="fa-solid fa-plus mr-2"></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
    `;
}

function createProductCategoryButton(category) {
  const colorsByCategory = {
    breakfast_cereals: "from-amber-500 to-orange-500",
    beverages: "from-blue-500 to-cyan-500",
    snacks: "from-purple-500 to-pink-500",
    dairy: "from-sky-400 to-blue-500",
    fruits: "from-red-500 to-rose-500",
    vegetables: "from-green-500 to-emerald-500",
    breads: "from-amber-600 to-yellow-500",
    meats: "from-red-600 to-rose-600",
    frozen_foods: "from-cyan-500 to-blue-600",
    sauces: "from-orange-500 to-red-500",
  };
  const gradient = colorsByCategory[category.id] || "from-gray-500 to-gray-600";

  return `
        <button class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r ${gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all" data-category="${category.id}">
            <i class="fa-solid ${category.icon} mr-2"></i>${category.name}
        </button>
    `;
}

const UI = {
  createMealCard,
  createCategoryCard,
  createMealDetailContent,
  createLoadingSpinner,
  createEmptyState,
  createAreaFilters,
  createDashboardWidget,
  createWaterTracker,
  createQuickActionCard,
  createSettingsSection,
  createStreakCard,
  createSkeletonCard,
  createProductCard,
  createProductDetailContent,
  createProductCategoryButton,
};

/* ===========================================================
 * 6. NutriPlanApp — routing, page rendering, event wiring
 * ========================================================= */
class NutriPlanApp {
  constructor() {
    this.state = StateStore.initializeState();
    this.currentPage = "meals";
    this.debounceTimer = null;
    this.routes = {
      "": "home",
      home: "meals",
      meals: "meals",
      settings: "settings",
      products: "products",
    };
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupRouting();

    if (window.location.pathname === "/" || window.location.pathname === "") {
      window.history.replaceState({ page: "meals" }, "", "/home");
    }

    await this.loadInitialData();

    const pageInfo = this.getPageFromURL();
    if (pageInfo.type === "meal-detail" && pageInfo.slug) {
      await this.loadMealFromSlug(pageInfo.slug);
    } else {
      this.renderPage(pageInfo.type);
      this.updateActiveNavLink(pageInfo.type);
    }

    this.hideLoadingOverlay();
  }

  setupRouting() {
    window.addEventListener("popstate", () => {
      const pageInfo = this.getPageFromURL();
      if (pageInfo.type === "meal-detail") {
        this.loadMealFromSlug(pageInfo.slug);
      } else {
        this.renderPage(pageInfo.type);
        this.updateActiveNavLink(pageInfo.type);
      }
    });
  }

  getPageFromURL() {
    const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
    return path.startsWith("meal/")
      ? { type: "meal-detail", slug: path.replace("meal/", "") }
      : { type: this.routes[path] || "meals", slug: null };
  }

  async loadMealFromSlug(slug) {
    try {
      const searchTerm = slug.replace(/-/g, " ");
      // NOTE: `MealDBAPI.searchMeals` does not exist (the API only exposes
      // `searchMealsByName`) — this call always throws and falls straight
      // through to the catch block below, which redirects to the meals
      // list. Preserved as-is from the original source rather than
      // "fixed", since this is a de-minification, not a rewrite.
      const results = await MealDBAPI.searchMeals(searchTerm);
      if (results && results.length > 0) {
        const match = results.find((meal) => this.slugify(meal.strMeal) === slug) || results[0];
        StateStore.updateState({ selectedMealId: match.idMeal });
        this.renderPage("meal-detail");
        this.updateActiveNavLink("meals");
      } else {
        this.navigateTo("meals");
      }
    } catch (error) {
      console.error("Error loading meal from URL:", error);
      this.navigateTo("meals");
    }
  }

  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  navigateTo(page) {
    let path;
    if (page === "meals") {
      path = "/home";
    } else {
      const routeKey = Object.keys(this.routes).find(
        (key) => this.routes[key] === page && key !== "" && key !== "home"
      );
      path = `/${routeKey || page}`;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({ page }, "", path);
    }

    this.renderPage(page);
    this.updateActiveNavLink(page);
  }

  navigateToMeal(meal) {
    const path = `/meal/${this.slugify(meal.strMeal)}`;
    StateStore.updateState({ selectedMealId: meal.idMeal });
    window.history.pushState({ page: "meal-detail", mealId: meal.idMeal }, "", path);
    this.renderPage("meal-detail");
    this.updateActiveNavLink("meals");
  }

  updateActiveNavLink(activePage) {
    document.querySelectorAll("#sidebar nav a").forEach((link) => {
      const linkText = link.querySelector("span")?.textContent?.toLowerCase() || "";
      let linkPage = "meals";

      if (linkText.includes("meals") || linkText.includes("recipes")) linkPage = "meals";
      else if (linkText.includes("settings")) linkPage = "settings";
      else if (linkText.includes("products") || linkText.includes("barcode") || linkText.includes("scan")) linkPage = "products";
      else if (linkText.includes("food log") || linkText.includes("log")) linkPage = "foodlog";

      if (linkPage === activePage) {
        link.classList.add("bg-emerald-50", "text-emerald-700");
        link.classList.remove("text-gray-600", "hover:bg-gray-50");
        link.querySelector("span")?.classList.add("font-semibold");
        link.querySelector("span")?.classList.remove("font-medium");
      } else {
        link.classList.remove("bg-emerald-50", "text-emerald-700");
        link.classList.add("text-gray-600", "hover:bg-gray-50");
        link.querySelector("span")?.classList.remove("font-semibold");
        link.querySelector("span")?.classList.add("font-medium");
      }
    });
  }

  hideLoadingOverlay() {
    const overlay = document.getElementById("app-loading-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.5s ease-out";
      setTimeout(() => overlay.remove(), 500);
    }
  }

  setupEventListeners() {
    document.querySelectorAll("#sidebar nav a").forEach((navLink) => {
      navLink.addEventListener("click", (event) => this.handleNavigation(event));
    });

    const searchInput = document.querySelector('#search-filters-section input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener("input", (event) => this.handleSearch(event));
      searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") this.performSearch(event.target.value);
      });
    }

    this.setupViewToggle();
    document.addEventListener("click", (event) => this.handleGlobalClick(event));
    window.addEventListener("stateChange", (event) => this.handleStateChange(event));
  }

  setupViewToggle() {
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");
    if (gridViewBtn && listViewBtn) {
      gridViewBtn.addEventListener("click", () => this.setViewMode("grid"));
      listViewBtn.addEventListener("click", () => this.setViewMode("list"));
    }
  }

  setViewMode(mode) {
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");
    const recipesGrid = document.querySelector("#all-recipes-section .grid");
    if (!recipesGrid) return;

    if (mode === "grid") {
      gridViewBtn?.classList.add("bg-white", "shadow-sm");
      gridViewBtn?.querySelector("i")?.classList.replace("text-gray-500", "text-gray-700");
      listViewBtn?.classList.remove("bg-white", "shadow-sm");
      listViewBtn?.querySelector("i")?.classList.replace("text-gray-700", "text-gray-500");

      recipesGrid.className = "grid grid-cols-4 gap-5";
      recipesGrid.querySelectorAll(".recipe-card").forEach((card) => {
        card.classList.remove("flex", "flex-row", "h-40");
        card.querySelector(".relative")?.classList.remove("w-48", "h-full");
        card.querySelector(".relative")?.classList.add("h-48");
        card.querySelector("img")?.classList.add("h-full");

        const badgesRow = card.querySelector(".relative > .absolute.bottom-3");
        badgesRow?.classList.remove("hidden");
      });
    } else {
      listViewBtn?.classList.add("bg-white", "shadow-sm");
      listViewBtn?.querySelector("i")?.classList.replace("text-gray-500", "text-gray-700");
      gridViewBtn?.classList.remove("bg-white", "shadow-sm");
      gridViewBtn?.querySelector("i")?.classList.replace("text-gray-700", "text-gray-500");

      recipesGrid.className = "grid grid-cols-2 gap-4";
      recipesGrid.querySelectorAll(".recipe-card").forEach((card) => {
        card.classList.add("flex", "flex-row", "h-40");
        card.querySelector(".relative")?.classList.add("w-48", "h-full");
        card.querySelector(".relative")?.classList.remove("h-48");

        const badgesRow = card.querySelector(".relative > .absolute.bottom-3");
        badgesRow?.classList.add("hidden");
      });
    }

    StateStore.updateState({ viewMode: mode });
  }

  handleNavigation(event) {
    event.preventDefault();
    const linkText = event.currentTarget.querySelector("span")?.textContent?.toLowerCase() || "";
    let targetPage = "meals";

    if (linkText.includes("meals") || linkText.includes("recipes")) targetPage = "meals";
    else if (linkText.includes("settings")) targetPage = "settings";
    else if (linkText.includes("products") || linkText.includes("barcode") || linkText.includes("scan")) targetPage = "products";
    else if (linkText.includes("food log") || linkText.includes("log")) targetPage = "foodlog";

    this.navigateTo(targetPage);
  }

  // NOTE: the "exercise-card" / "add-exercise-btn" / "add-to-plan-btn"
  // branches below call `this.showExerciseDetail`, `this.addExerciseToWorkout`,
  // and `this.showMealPlanModal` — none of which are implemented anywhere
  // in this class. Since no element in this app's HTML actually carries
  // those classes, these branches are effectively dead code; preserved
  // as-is from the original source.
  handleGlobalClick(event) {
    if (event.target.closest(".recipe-card")) {
      const mealId = event.target.closest(".recipe-card").dataset.mealId;
      this.showMealDetail(mealId);
    }
    if (event.target.closest(".category-card")) {
      const categoryName = event.target.closest(".category-card").dataset.category;
      this.filterByCategory(categoryName);
    }
    if (event.target.closest(".area-filter-btn")) {
      const areaName = event.target.closest(".area-filter-btn").dataset.area;
      this.filterByArea(areaName);
    }
    if (event.target.closest(".exercise-card") && !event.target.closest(".add-exercise-btn")) {
      const exerciseId = event.target.closest(".exercise-card").dataset.exerciseId;
      this.showExerciseDetail(exerciseId);
    }
    if (event.target.closest(".add-exercise-btn")) {
      event.stopPropagation();
      const exerciseId = event.target.closest(".exercise-card").dataset.exerciseId;
      this.addExerciseToWorkout(exerciseId);
    }
    if (event.target.closest(".close-detail-btn")) {
      this.closeMealDetail();
    }
    if (event.target.closest(".add-to-plan-btn")) {
      const mealId = event.target.closest(".add-to-plan-btn").dataset.mealId;
      this.showMealPlanModal(mealId);
    }
  }

  handleSearch(event) {
    const query = event.target.value.trim();
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (query.length >= 2) this.performSearch(query);
      else if (query.length === 0) this.loadAllRecipes();
    }, 300);
  }

  async performSearch(query) {
    StateStore.updateState({ isLoading: true, searchQuery: query });
    const gridEl = document.querySelector("#all-recipes-section .grid");
    if (gridEl) gridEl.innerHTML = UI.createLoadingSpinner();

    try {
      const results = await MealDBAPI.searchMealsByName(query);
      StateStore.updateState({ meals: results, isLoading: false });
      this.renderRecipeGrid(results);

      const subtitleEl = document.querySelector("#all-recipes-section p.text-gray-600");
      if (subtitleEl) subtitleEl.textContent = `Showing ${results.length} recipes for "${query}"`;
    } catch (error) {
      console.error("Search error:", error);
      StateStore.updateState({ isLoading: false, error: error.message });
    }
  }

  async loadInitialData() {
    try {
      const categories = await MealDBAPI.getAllCategories();
      StateStore.updateState({ categories });

      const areas = await MealDBAPI.getAreaList();
      StateStore.updateState({ areas });

      const meals = await MealDBAPI.searchMealsByName("chicken");
      StateStore.updateState({ meals });
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }

  async loadAllRecipes() {
    const results = await MealDBAPI.searchMealsByName("");
    if (results.length === 0) {
      const fallbackResults = await MealDBAPI.searchMealsByName("chicken");
      StateStore.updateState({ meals: fallbackResults });
      this.renderRecipeGrid(fallbackResults);
    } else {
      StateStore.updateState({ meals: results });
      this.renderRecipeGrid(results);
    }
  }

  renderPage(page) {
    this.currentPage = page;
    const mainContent = document.getElementById("main-content");

    this.updateHeader(page);

    ["shopping-section", "settings-section", "products-section", "meal-detail-section", "foodlog-section"].forEach(
      (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = "none";
      }
    );

    // NOTE: this call's result is unused — a harmless leftover from the
    // original source.
    mainContent.querySelectorAll("section");

    switch (page) {
      case "meals": this.showMealsPage(); break;
      case "settings": this.showSettingsPage(); break;
      case "products": this.showProductsPage(); break;
      case "foodlog": this.showFoodLogPage(); break;
      case "meal-detail": this.showMealDetailPage(); break;
    }
  }

  updateHeader(page) {
    const titleEl = document.querySelector("#header h1");
    const subtitleEl = document.querySelector("#header p");
    const pageMeta = {
      meals: { title: "Meals & Recipes", subtitle: "Discover delicious and nutritious recipes tailored for you" },
      settings: { title: "Settings", subtitle: "Customize your goals and preferences" },
      products: { title: "Product Scanner", subtitle: "Search packaged foods by name or barcode" },
      foodlog: { title: "Food Log", subtitle: "Track your daily nutrition and food intake" },
      "meal-detail": { title: "Recipe Details", subtitle: "View full recipe information and nutrition facts" },
    };

    if (titleEl && pageMeta[page]) titleEl.textContent = pageMeta[page].title;
    if (subtitleEl && pageMeta[page]) subtitleEl.textContent = pageMeta[page].subtitle;
  }

  showMealsPage() {
    this.toggleSections(["search-filters-section", "meal-categories-section", "all-recipes-section"], true);
    this.toggleSections(
      ["recipe-detail-modal", "nutritional-insights-section", "meal-planning-section", "community-section"],
      false
    );
    this.renderCategories();
    this.renderRecipeGrid(StateStore.getState().meals);
    this.renderAreaFilters();
  }

  toggleSections(sectionIds, show) {
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.style.display = show ? "" : "none";
    });
  }

  renderCategories() {
    const section = document.getElementById("meal-categories-section");
    if (!section) return;
    const grid = section.querySelector(".grid");
    if (!grid) return;

    grid.className = "grid grid-cols-6 gap-3";
    const categories = StateStore.getState().categories || [];
    grid.innerHTML = categories.slice(0, 12).map((category) => UI.createCategoryCard(category)).join("");
  }

  renderRecipeGrid(meals) {
    const grid = document.querySelector("#all-recipes-section .grid");
    if (!grid) return;

    if (!meals || meals.length === 0) {
      grid.innerHTML = UI.createEmptyState("No recipes found. Try a different search term.");
      return;
    }

    grid.innerHTML = meals.map((meal) => UI.createMealCard(meal)).join("");
    const subtitleEl = document.querySelector("#all-recipes-section p.text-gray-600");
    if (subtitleEl) subtitleEl.textContent = `Showing ${meals.length} recipes`;
  }

  renderAreaFilters() {
    const container = document.querySelector("#search-filters-section .flex.items-center.gap-3");
    if (!container) return;

    const areas = StateStore.getState().areas || [];
    const selectedArea = StateStore.getState().selectedArea;
    container.innerHTML = UI.createAreaFilters(areas.slice(0, 10), selectedArea);
  }

  async filterByCategory(category) {
    StateStore.updateState({ selectedCategory: category, isLoading: true });
    const gridEl = document.querySelector("#all-recipes-section .grid");
    if (gridEl) gridEl.innerHTML = UI.createLoadingSpinner();

    try {
      const summaries = await MealDBAPI.filterMealsByCategory(category);
      const fullMeals = await Promise.all(summaries.slice(0, 20).map((m) => MealDBAPI.getMealById(m.idMeal)));

      StateStore.updateState({ meals: fullMeals.filter((meal) => meal), isLoading: false });
      this.renderRecipeGrid(fullMeals.filter((meal) => meal));

      const subtitleEl = document.querySelector("#all-recipes-section p.text-gray-600");
      if (subtitleEl) subtitleEl.textContent = `Showing ${fullMeals.length} ${category} recipes`;
    } catch (error) {
      console.error("Filter error:", error);
      StateStore.updateState({ isLoading: false });
    }
  }

  async filterByArea(area) {
    StateStore.updateState({ selectedArea: area, isLoading: true });

    document.querySelectorAll(".area-filter-btn").forEach((btn) => {
      if (btn.dataset.area === area) {
        btn.classList.add("bg-emerald-600", "text-white");
        btn.classList.remove("bg-gray-100", "text-gray-700");
      } else {
        btn.classList.remove("bg-emerald-600", "text-white");
        btn.classList.add("bg-gray-100", "text-gray-700");
      }
    });

    const gridEl = document.querySelector("#all-recipes-section .grid");
    if (gridEl) gridEl.innerHTML = UI.createLoadingSpinner();

    try {
      let meals;
      if (area) {
        const summaries = await MealDBAPI.filterMealsByArea(area);
        meals = (await Promise.all(summaries.slice(0, 20).map((m) => MealDBAPI.getMealById(m.idMeal)))).filter((m) => m);
      } else {
        meals = await MealDBAPI.searchMealsByName("chicken");
      }

      StateStore.updateState({ meals, isLoading: false });
      this.renderRecipeGrid(meals);

      const subtitleEl = document.querySelector("#all-recipes-section p.text-gray-600");
      if (subtitleEl) {
        subtitleEl.textContent = area ? `Showing ${meals.length} ${area} recipes` : `Showing ${meals.length} recipes`;
      }
    } catch (error) {
      console.error("Filter error:", error);
      StateStore.updateState({ isLoading: false });
    }
  }

  async showMealDetail(mealId) {
    StateStore.updateState({ selectedMealId: mealId, isLoading: true });

    try {
      const meal = await MealDBAPI.getMealById(mealId);
      if (meal) {
        const path = `/meal/${this.slugify(meal.strMeal)}`;
        if (window.location.pathname !== path) {
          window.history.pushState({ page: "meal-detail", mealId }, "", path);
        }
      }
    } catch (error) {
      console.error("Error fetching meal for URL:", error);
    }

    this.renderPage("meal-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async showMealDetailPage() {
    this.toggleSections(
      [
        "search-filters-section",
        "featured-recipes-section",
        "meal-categories-section",
        "all-recipes-section",
        "recipe-detail-modal",
        "nutritional-insights-section",
        "meal-planning-section",
        "community-section",
      ],
      false
    );

    let detailSection = document.getElementById("meal-detail-section");
    if (!detailSection) {
      detailSection = document.createElement("section");
      detailSection.id = "meal-detail-section";
      detailSection.className = "px-8 py-6 bg-gray-50 min-h-screen";
      const mainContent = document.getElementById("main-content");
      const footer = document.getElementById("footer");
      mainContent.insertBefore(detailSection, footer);
    }
    detailSection.style.display = "";

    const mealId = StateStore.getState().selectedMealId;
    if (!mealId) {
      detailSection.innerHTML = `
                <div class="max-w-6xl mx-auto">
                    <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Back to Recipes</span>
                    </button>
                    ${UI.createEmptyState("No recipe selected. Please select a recipe to view details.", "fa-utensils")}
                </div>
            `;
      document.getElementById("back-to-meals-btn")?.addEventListener("click", () => {
        this.navigateTo("meals");
      });
      return;
    }

    try {
      const meal = await MealDBAPI.getMealById(mealId);
      if (!meal) throw new Error("Meal not found");

      const ingredients = MealDBAPI.extractIngredients(meal);
      const instructions = MealDBAPI.parseInstructions(meal.strInstructions);

      StateStore.updateState({ selectedMeal: meal, isLoading: false });
      detailSection.innerHTML = this.createMealDetailPageContent(meal, null, ingredients, instructions);
      this.setupMealDetailPageListeners(meal, ingredients);
      this.loadNutritionData(meal, ingredients);
    } catch (error) {
      console.error("Error loading meal detail:", error);
      StateStore.updateState({ isLoading: false });
      detailSection.innerHTML = `
                <div class="max-w-6xl mx-auto">
                    <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Back to Recipes</span>
                    </button>
                    ${UI.createEmptyState("Failed to load recipe details. Please try again.", "fa-exclamation-circle")}
                </div>
            `;
      document.getElementById("back-to-meals-btn")?.addEventListener("click", () => {
        this.navigateTo("meals");
      });
    }
  }

  async loadNutritionData(meal, ingredients) {
    const nutritionContainer = document.getElementById("nutrition-facts-container");
    if (!nutritionContainer) return;

    try {
      const ingredientStrings = ingredients.map((ing) => `${ing.measure} ${ing.ingredient}`);
      const rawNutrition = await NutritionAPI.analyzeRecipe(meal.strMeal, ingredientStrings);
      const formattedNutrition = NutritionAPI.formatNutritionForDisplay(rawNutrition);

      const nutritionCache = StateStore.getState().mealNutritionCache || {};
      nutritionCache[meal.idMeal] = formattedNutrition;
      StateStore.updateState({ mealNutritionCache: nutritionCache });
      nutritionContainer.innerHTML = this.createNutritionContent(formattedNutrition);

      const heroCaloriesEl = document.getElementById("hero-calories");
      const heroServingsEl = document.getElementById("hero-servings");
      if (heroCaloriesEl) heroCaloriesEl.textContent = `${formattedNutrition.caloriesPerServing} cal/serving`;
      if (heroServingsEl) heroServingsEl.textContent = `${formattedNutrition.servings} servings`;

      const logMealBtn = document.getElementById("log-meal-btn");
      if (logMealBtn) {
        logMealBtn.disabled = false;
        logMealBtn.className =
          "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all cursor-pointer";
        logMealBtn.title = "";
        logMealBtn.innerHTML = `
                    <i class="fa-solid fa-clipboard-list"></i>
                    <span>Log This Meal</span>
                `;
      }
    } catch (error) {
      console.error("Error loading nutrition data:", error);
      nutritionContainer.innerHTML = `
                <div class="text-center py-8">
                    <i class="fa-solid fa-exclamation-circle text-3xl text-red-400 mb-3"></i>
                    <p class="text-gray-600">Unable to load nutrition data</p>
                    <button id="retry-nutrition-btn" class="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                        <i class="fa-solid fa-refresh mr-1"></i> Try Again
                    </button>
                </div>
            `;

      const heroCaloriesEl = document.getElementById("hero-calories");
      if (heroCaloriesEl) heroCaloriesEl.textContent = "N/A";

      const logMealBtn = document.getElementById("log-meal-btn");
      if (logMealBtn) {
        logMealBtn.className =
          "flex items-center gap-2 px-6 py-3 bg-red-100 text-red-500 rounded-xl font-semibold cursor-not-allowed transition-all";
        logMealBtn.title = 'Nutrition data failed to load. Click "Try Again" in the nutrition section.';
        logMealBtn.innerHTML = `
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <span>Unavailable</span>
                `;
      }

      document.getElementById("retry-nutrition-btn")?.addEventListener("click", () => {
        nutritionContainer.innerHTML = this.createNutritionLoadingState();

        const heroCaloriesRetryEl = document.getElementById("hero-calories");
        if (heroCaloriesRetryEl) heroCaloriesRetryEl.textContent = "Calculating...";

        const logMealRetryBtn = document.getElementById("log-meal-btn");
        if (logMealRetryBtn) {
          logMealRetryBtn.disabled = true;
          logMealRetryBtn.className =
            "flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all";
          logMealRetryBtn.title = "Waiting for nutrition data...";
          logMealRetryBtn.innerHTML = `
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Calculating...</span>
                    `;
        }

        this.loadNutritionData(meal, ingredients);
      });
    }
  }

  createNutritionLoadingState() {
    return `
            <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <i class="fa-solid fa-calculator text-emerald-600 text-xl animate-pulse"></i>
                </div>
                <p class="text-gray-700 font-medium mb-1">Calculating Nutrition</p>
                <p class="text-sm text-gray-500">Analyzing ingredients...</p>
                <div class="mt-4 flex justify-center">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
        `;
  }

  createNutritionContent(nutrition) {
    return `
            <p class="text-sm text-gray-500 mb-4">Per serving</p>
            
            <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p class="text-sm text-gray-600">Calories per serving</p>
                <p class="text-4xl font-bold text-emerald-600">${nutrition.caloriesPerServing}</p>
                <p class="text-xs text-gray-500 mt-1">Total: ${nutrition.totalCalories} cal</p>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutrition.macros.protein.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min(nutrition.macros.protein.dailyValue, 100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutrition.macros.carbs.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(nutrition.macros.carbs.dailyValue, 100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutrition.macros.fat.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(nutrition.macros.fat.dailyValue, 100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutrition.macros.fiber.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min(nutrition.macros.fiber.dailyValue, 100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutrition.macros.sugar.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: ${Math.min(Math.round((nutrition.macros.sugar.amount / 50) * 100), 100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${nutrition.macros.saturatedFat.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min(nutrition.macros.saturatedFat.dailyValue, 100)}%"></div>
                </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${nutrition.other.cholesterol}mg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${nutrition.other.sodium}mg</span>
                    </div>
                </div>
            </div>
        `;
  }

  createMealDetailPageContent(meal, nutrition, ingredients, instructions) {
    return `
            <div class="max-w-6xl mx-auto">
                <!-- Back Button -->
                <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Back to Recipes</span>
                </button>
                
                <!-- Hero Section -->
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div class="relative h-80 md:h-96">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-full object-cover"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-8">
                            <div class="flex items-center gap-3 mb-3">
                                ${meal.strCategory ? `<span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.strCategory}</span>` : ""}
                                ${meal.strArea ? `<span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.strArea}</span>` : ""}
                                ${
                                  meal.strTags
                                    ? meal.strTags
                                        .split(",")
                                        .slice(0, 2)
                                        .map((tag) => `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${tag.trim()}</span>`)
                                        .join("")
                                    : ""
                                }
                            </div>
                            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${meal.strMeal}</h1>
                            <div class="flex items-center gap-6 text-white/90">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-clock"></i>
                                    <span>30 min</span>
                                </span>
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-utensils"></i>
                                    <span id="hero-servings">${nutrition?.servings || 4} servings</span>
                                </span>
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-fire"></i>
                                    <span id="hero-calories">${nutrition ? nutrition.caloriesPerServing + " cal/serving" : "Calculating..."}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3 mb-8">
                    <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all" data-meal-id="${meal.idMeal}" disabled title="Waiting for nutrition data...">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Calculating...</span>
                    </button>

                </div>
                
                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column - Ingredients & Instructions -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Ingredients -->
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-list-check text-emerald-600"></i>
                                Ingredients
                                <span class="text-sm font-normal text-gray-500 ml-auto">${ingredients.length} items</span>
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${ingredients
                                  .map(
                                    (ingredient) => `
                                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                                        <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"/>
                                        <span class="text-gray-700">
                                            <span class="font-medium text-gray-900">${ingredient.measure}</span> ${ingredient.ingredient}
                                        </span>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                        
                        <!-- Instructions -->
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                                Instructions
                            </h2>
                            <div class="space-y-4">
                                ${instructions
                                  .map(
                                    (step, index) => `
                                    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                                            ${index + 1}
                                        </div>
                                        <p class="text-gray-700 leading-relaxed pt-2">${step}</p>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                        
                        ${
                          meal.strYoutube
                            ? `
                        <!-- Video Section -->
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-video text-red-500"></i>
                                Video Tutorial
                            </h2>
                            <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                <iframe 
                                    src="https://www.youtube.com/embed/${meal.strYoutube.split("v=")[1]}" 
                                    class="absolute inset-0 w-full h-full"
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    
                    <!-- Right Column - Nutrition -->
                    <div class="space-y-6">
                        <!-- Nutrition Facts -->
                        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                                Nutrition Facts
                            </h2>
                            <div id="nutrition-facts-container">
                                ${nutrition ? this.createNutritionContent(nutrition) : this.createNutritionLoadingState()}
                            </div>
                        </div>
                        
                        <!-- Source/Credit -->
                        ${
                          meal.strSource
                            ? `
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h3 class="text-sm font-semibold text-gray-900 mb-2">Recipe Source</h3>
                            <a href="${meal.strSource}" target="_blank" class="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-external-link"></i>
                                View Original Recipe
                            </a>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
  }

  // NOTE: `ingredients` is accepted for symmetry with the caller but isn't
  // actually used inside this method (kept from the original source).
  setupMealDetailPageListeners(meal, ingredients) {
    document.getElementById("back-to-meals-btn")?.addEventListener("click", () => {
      this.navigateTo("meals");
    });

    // NOTE: `add-to-plan-detail-btn` is not rendered anywhere in this
    // page's HTML, and `showMealPlanModal` is not implemented anywhere in
    // this class — this listener is effectively dead code, preserved as-is.
    document.getElementById("add-to-plan-detail-btn")?.addEventListener("click", () => {
      StateStore.updateState({ selectedMeal: meal });
      this.showMealPlanModal(meal.idMeal);
    });

    document.getElementById("log-meal-btn")?.addEventListener("click", () => {
      this.showLogMealModal(meal);
    });
  }

  closeMealDetail() {
    this.navigateTo("meals");
    StateStore.updateState({ selectedMeal: null, selectedMealId: null });
  }

  showNotification(message, type = "info") {
    const colorsByType = {
      success: "bg-emerald-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-amber-500",
    };
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 ${colorsByType[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-notification`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  handleStateChange(event) {}

  showSettingsPage() {
    this.toggleSections(
      [
        "search-filters-section",
        "featured-recipes-section",
        "meal-categories-section",
        "all-recipes-section",
        "nutritional-insights-section",
      ],
      false
    );
    this.renderSettingsSection();
  }

  renderSettingsSection() {
    let section = document.getElementById("settings-section");
    if (!section) {
      section = document.createElement("section");
      section.id = "settings-section";
      section.className = "px-8 py-8 bg-gray-50 min-h-screen";
      const mainContent = document.getElementById("main-content");
      const footer = document.getElementById("footer");
      mainContent.insertBefore(section, footer);
    }
    section.style.display = "";

    const settings = StateStore.getState().userSettings;

    section.innerHTML = `
            <div class="max-w-3xl mx-auto">
                <div class="space-y-6">
                    <!-- Profile Settings -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Profile</h3>
                        <p class="text-sm text-gray-500 mb-4">Your personal information</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input type="number" id="setting-age" value="${settings.age || 30}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select id="setting-gender" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                                    <option value="male" ${settings.gender === "male" ? "selected" : ""}>Male</option>
                                    <option value="female" ${settings.gender === "female" ? "selected" : ""}>Female</option>
                                    <option value="other" ${settings.gender === "other" ? "selected" : ""}>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input type="number" id="setting-weight" value="${settings.weight}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input type="number" id="setting-height" value="${settings.height}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                        </div>
                    </div>

                    <!-- Nutrition Goals -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Nutrition Goals</h3>
                        <p class="text-sm text-gray-500 mb-4">Set your daily nutrition targets</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Daily Calories</label>
                                <input type="number" id="setting-calories" value="${settings.calorieGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                                <input type="number" id="setting-protein" value="${settings.proteinGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                                <input type="number" id="setting-carbs" value="${settings.carbsGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                                <input type="number" id="setting-fat" value="${settings.fatGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                        </div>
                    </div>

                    <!-- Water Goals -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Hydration</h3>
                        <p class="text-sm text-gray-500 mb-4">Set your water intake goals</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Daily Water Goal (ml)</label>
                                <input type="number" id="setting-water" value="${settings.waterGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Glass Size (ml)</label>
                                <input type="number" id="setting-glass" value="${settings.waterGlassSize}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Level -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Activity Level</h3>
                        <p class="text-sm text-gray-500 mb-4">How active are you on a typical day?</p>
                        
                        <div class="grid grid-cols-5 gap-3" id="activity-level-selector">
                            ${["sedentary", "light", "moderate", "active", "very_active"]
                              .map(
                                (level) => `
                                <button class="activity-level-btn px-4 py-3 rounded-xl text-center transition-all ${settings.activityLevel === level ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}" data-level="${level}">
                                    <i class="fa-solid ${this.getActivityIcon(level)} text-lg mb-1"></i>
                                    <p class="text-xs font-medium capitalize">${level.replace("_", " ")}</p>
                                </button>
                            `
                              )
                              .join("")}
                        </div>
                    </div>

                    <!-- Save Button -->
                    <button id="save-settings-btn" class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        <i class="fa-solid fa-check"></i>
                        Save Settings
                    </button>

                    <!-- Reset Data -->
                    <div class="bg-red-50 rounded-2xl p-6 border border-red-200">
                        <h3 class="text-lg font-bold text-red-700 mb-1">Danger Zone</h3>
                        <p class="text-sm text-red-600 mb-4">These actions cannot be undone</p>
                        <button id="reset-data-btn" class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>
        `;

    this.setupSettingsListeners();
  }

  getActivityIcon(level) {
    return (
      {
        sedentary: "fa-couch",
        light: "fa-person-walking",
        moderate: "fa-person-running",
        active: "fa-person-biking",
        very_active: "fa-person-swimming",
      }[level] || "fa-person"
    );
  }

  setupSettingsListeners() {
    document.querySelectorAll(".activity-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".activity-level-btn").forEach((otherBtn) => {
          otherBtn.classList.remove("bg-emerald-600", "text-white");
          otherBtn.classList.add("bg-gray-100", "text-gray-700");
        });
        btn.classList.add("bg-emerald-600", "text-white");
        btn.classList.remove("bg-gray-100", "text-gray-700");
      });
    });

    document.getElementById("save-settings-btn")?.addEventListener("click", () => {
      const newSettings = {
        age: parseInt(document.getElementById("setting-age")?.value) || 30,
        gender: document.getElementById("setting-gender")?.value || "male",
        weight: parseInt(document.getElementById("setting-weight")?.value) || 70,
        height: parseInt(document.getElementById("setting-height")?.value) || 170,
        calorieGoal: parseInt(document.getElementById("setting-calories")?.value) || 2000,
        proteinGoal: parseInt(document.getElementById("setting-protein")?.value) || 50,
        carbsGoal: parseInt(document.getElementById("setting-carbs")?.value) || 250,
        fatGoal: parseInt(document.getElementById("setting-fat")?.value) || 65,
        waterGoal: parseInt(document.getElementById("setting-water")?.value) || 2000,
        waterGlassSize: parseInt(document.getElementById("setting-glass")?.value) || 250,
        activityLevel: document.querySelector(".activity-level-btn.bg-emerald-600")?.dataset.level || "moderate",
      };

      StateStore.updateUserSettings(newSettings);
      this.showNotification("Settings saved successfully!", "success");
    });

    document.getElementById("reset-data-btn")?.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }

  showProductsPage() {
    this.toggleSections(
      [
        "search-filters-section",
        "featured-recipes-section",
        "meal-categories-section",
        "all-recipes-section",
        "meal-planning-section",
        "nutritional-insights-section",
      ],
      false
    );
    this.renderProductsSection();
  }

  async renderProductsSection() {
    let section = document.getElementById("products-section");
    if (!section) {
      section = document.createElement("section");
      section.id = "products-section";
      section.className = "px-8 py-8 bg-gray-50 min-h-screen";
      const mainContent = document.getElementById("main-content");
      const footer = document.getElementById("footer");
      mainContent.insertBefore(section, footer);
    }
    section.style.display = "";

    const categories = await OpenFoodFactsAPI.getPopularCategories();

    section.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Search Header -->
                <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
                    <h2 class="text-2xl font-bold mb-2">
                        <i class="fa-solid fa-barcode mr-2"></i>
                        Product Search & Barcode Scanner
                    </h2>
                    <p class="opacity-90 mb-4">Search for packaged food products to view nutrition information</p>
                    
                    <div class="flex gap-3">
                        <div class="flex-1 relative">
                            <input type="text" id="product-search-input" 
                                placeholder="Search by product name (e.g., Cheerios, Nutella, Coca-Cola...)" 
                                class="w-full px-5 py-3.5 pr-12 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"/>
                            <i class="fa-solid fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <button id="search-product-btn" class="px-6 py-3.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                            Search
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-4 mt-4">
                        <div class="flex-1 h-px bg-white/30"></div>
                        <span class="text-sm opacity-80">or</span>
                        <div class="flex-1 h-px bg-white/30"></div>
                    </div>
                    
                    <div class="mt-4 flex gap-3">
                        <div class="flex-1 relative">
                            <input type="text" id="barcode-input" 
                                placeholder="Enter barcode number (e.g., 7613034626844)" 
                                class="w-full px-5 py-3.5 pr-12 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"/>
                            <i class="fa-solid fa-barcode absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <button id="lookup-barcode-btn" class="px-6 py-3.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all">
                            <i class="fa-solid fa-search mr-2"></i>Lookup
                        </button>
                    </div>
                </div>
                
                <!-- Nutrition Grade Filter -->
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-sm font-medium text-gray-700">Filter by Nutri-Score:</span>
                    <div class="flex gap-2">
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200" data-grade="">All</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-green-100 text-green-700 hover:bg-green-200" data-grade="a">A</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-lime-100 text-lime-700 hover:bg-lime-200" data-grade="b">B</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-yellow-100 text-yellow-700 hover:bg-yellow-200" data-grade="c">C</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-orange-100 text-orange-700 hover:bg-orange-200" data-grade="d">D</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-red-100 text-red-700 hover:bg-red-200" data-grade="e">E</button>
                    </div>
                </div>
                
                <!-- Category Buttons -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Browse by Category</h3>
                    <div class="flex gap-3 overflow-x-auto pb-2">
                        ${categories.map((category) => UI.createProductCategoryButton(category)).join("")}
                    </div>
                </div>

                <!-- Results Info -->
                <div class="flex items-center justify-between mb-4">
                    <p id="products-count" class="text-sm text-gray-600">Search for products to see results</p>
                </div>

                <!-- Products Grid -->
                <div class="grid grid-cols-4 gap-5" id="products-grid">
                    <!-- Products will be loaded here -->
                </div>
                
                <!-- Loading State -->
                <div id="products-loading" class="hidden py-12">
                    ${UI.createLoadingSpinner()}
                </div>
                
                <!-- Empty State -->
                <div id="products-empty" class="py-12">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fa-solid fa-box-open text-gray-400 text-3xl"></i>
                        </div>
                        <p class="text-gray-500 text-lg mb-2">No products to display</p>
                        <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                    </div>
                </div>
            </div>
        `;

    this.setupProductsListeners();

    // NOTE: `setupTodayLogListeners` is not implemented anywhere in this
    // class. This call throws at runtime (after the listeners above are
    // already wired up), producing an unhandled rejection since this
    // async method isn't awaited by its caller (showProductsPage).
    // Preserved as-is from the original source.
    this.setupTodayLogListeners();
  }

  setupProductsListeners() {
    document.getElementById("search-product-btn")?.addEventListener("click", () => {
      const query = document.getElementById("product-search-input")?.value.trim();
      if (query) this.searchProducts(query);
    });

    document.getElementById("product-search-input")?.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const query = event.target.value.trim();
        if (query) this.searchProducts(query);
      }
    });

    document.getElementById("lookup-barcode-btn")?.addEventListener("click", () => {
      const barcode = document.getElementById("barcode-input")?.value.trim();
      if (barcode) this.lookupBarcode(barcode);
    });

    document.getElementById("barcode-input")?.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const barcode = event.target.value.trim();
        if (barcode) this.lookupBarcode(barcode);
      }
    });

    document.querySelectorAll(".nutri-score-filter").forEach((filterBtn) => {
      filterBtn.addEventListener("click", () => {
        document.querySelectorAll(".nutri-score-filter").forEach((btn) => {
          btn.classList.remove("ring-2", "ring-gray-900");
        });
        filterBtn.classList.add("ring-2", "ring-gray-900");

        const grade = filterBtn.dataset.grade;
        const query = document.getElementById("product-search-input")?.value.trim() || "";
        if (query) this.searchProducts(query, grade);
      });
    });

    document.querySelectorAll(".product-category-btn").forEach((categoryBtn) => {
      categoryBtn.addEventListener("click", () => {
        const category = categoryBtn.dataset.category;
        this.searchProductsByCategory(category);
      });
    });

    document.getElementById("products-grid")?.addEventListener("click", (event) => {
      const card = event.target.closest(".product-card");
      if (card) {
        const barcode = card.dataset.barcode;
        this.showProductDetail(barcode);
      }
    });
  }

  async searchProducts(query, grade = "") {
    const grid = document.getElementById("products-grid");
    const loadingEl = document.getElementById("products-loading");
    const emptyEl = document.getElementById("products-empty");
    const countEl = document.getElementById("products-count");
    if (!grid) return;

    loadingEl.classList.remove("hidden");
    emptyEl.classList.add("hidden");
    grid.innerHTML = "";

    try {
      const searchOptions = { searchTerms: query, pageSize: 24 };
      if (grade) searchOptions.nutritionGrade = grade;

      const results = await OpenFoodFactsAPI.searchProducts(searchOptions);
      loadingEl.classList.add("hidden");

      if (results.products.length > 0) {
        grid.innerHTML = results.products.map((product) => UI.createProductCard(product)).join("");
        countEl.textContent = `Found ${results.count} products for "${query}"`;
      } else {
        emptyEl.classList.remove("hidden");
        countEl.textContent = `No products found for "${query}"`;
      }

      StateStore.updateState({ searchedProducts: results.products });
    } catch (error) {
      console.error("Product search error:", error);
      loadingEl.classList.add("hidden");
      emptyEl.classList.remove("hidden");
      countEl.textContent = "Error searching products";
      this.showNotification("Failed to search products. Please try again.", "error");
    }
  }

  async searchProductsByCategory(category) {
    const grid = document.getElementById("products-grid");
    const loadingEl = document.getElementById("products-loading");
    const emptyEl = document.getElementById("products-empty");
    const countEl = document.getElementById("products-count");
    if (!grid) return;

    loadingEl.classList.remove("hidden");
    emptyEl.classList.add("hidden");
    grid.innerHTML = "";

    try {
      const results = await OpenFoodFactsAPI.getProductsByCategory(category);
      loadingEl.classList.add("hidden");

      if (results.products.length > 0) {
        grid.innerHTML = results.products.map((product) => UI.createProductCard(product)).join("");
        countEl.textContent = `Found ${results.count} products in ${category.replace(/_/g, " ")}`;
      } else {
        emptyEl.classList.remove("hidden");
        countEl.textContent = `No products found in ${category.replace(/_/g, " ")}`;
      }

      StateStore.updateState({ searchedProducts: results.products });
    } catch (error) {
      console.error("Category search error:", error);
      loadingEl.classList.add("hidden");
      emptyEl.classList.remove("hidden");
      this.showNotification("Failed to load category products.", "error");
    }
  }

  async lookupBarcode(barcode) {
    const loadingEl = document.getElementById("products-loading");
    const grid = document.getElementById("products-grid");
    const emptyEl = document.getElementById("products-empty");
    const countEl = document.getElementById("products-count");

    loadingEl.classList.remove("hidden");
    grid.innerHTML = "";
    emptyEl.classList.add("hidden");

    try {
      const product = await OpenFoodFactsAPI.getProductByBarcode(barcode);
      loadingEl.classList.add("hidden");

      if (product) {
        grid.innerHTML = UI.createProductCard(product);
        countEl.textContent = `Found product: ${product.name}`;
        StateStore.updateState({ searchedProducts: [product] });
        this.showProductDetail(barcode);
      } else {
        emptyEl.classList.remove("hidden");
        countEl.textContent = `No product found with barcode: ${barcode}`;
        this.showNotification("Product not found in database", "error");
      }
    } catch (error) {
      console.error("Barcode lookup error:", error);
      loadingEl.classList.add("hidden");
      emptyEl.classList.remove("hidden");
      this.showNotification("Failed to lookup barcode.", "error");
    }
  }

  async showProductDetail(barcode) {
    let product = StateStore.getState().searchedProducts?.find((p) => p.barcode === barcode);
    if (!product) product = await OpenFoodFactsAPI.getProductByBarcode(barcode);
    if (!product) {
      this.showNotification("Product not found", "error");
      return;
    }

    const nutriScoreInfo = OpenFoodFactsAPI.getNutriScoreInfo(product.nutritionGrade);
    const novaGroupInfo = OpenFoodFactsAPI.getNovaGroupInfo(product.novaGroup);

    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
    modal.id = "product-detail-modal";
    modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                ${UI.createProductDetailContent(product, nutriScoreInfo, novaGroupInfo)}
            </div>
        `;

    document.body.appendChild(modal);

    modal.querySelectorAll(".close-product-modal").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => modal.remove());
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove();
    });

    modal.querySelector(".add-product-to-log")?.addEventListener("click", () => {
      this.logFoodToDaily(product);
      modal.remove();
    });
  }

  logFoodToDaily(product) {
    const todayKey = StateStore.getTodayString();
    const dailyLog = StateStore.getState().dailyLog || {};

    if (!dailyLog[todayKey]) {
      dailyLog[todayKey] = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, meals: [] };
    }

    dailyLog[todayKey].totalCalories += Math.round(product.nutrition?.calories || 0);
    dailyLog[todayKey].totalProtein += Math.round(product.nutrition?.protein || 0);
    dailyLog[todayKey].totalCarbs += Math.round(product.nutrition?.carbs || 0);
    dailyLog[todayKey].totalFat += Math.round(product.nutrition?.fat || 0);
    dailyLog[todayKey].meals.push({
      type: "product",
      name: product.name,
      brand: product.brand,
      barcode: product.barcode,
      serving: "100g",
      nutrition: product.nutrition,
      loggedAt: new Date().toISOString(),
    });

    StateStore.updateState({ dailyLog }, true);
    this.showNotification(`${product.name} logged to your daily intake! 📝`, "success");
    this.updateFoodLogPage();
  }

  showLogMealModal(meal) {
    const cachedNutrition = StateStore.getState().mealNutritionCache?.[meal.idMeal];

    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
    modal.id = "log-meal-modal";
    modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-16 h-16 rounded-xl object-cover"/>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm">${meal.strMeal}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="fa-solid fa-minus text-gray-600"></i>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" 
                            class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2"/>
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="fa-solid fa-plus text-gray-600"></i>
                        </button>
                    </div>
                </div>
                
                ${
                  cachedNutrition
                    ? `
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${cachedNutrition.caloriesPerServing}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${cachedNutrition.macros?.protein?.amount || 0}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${cachedNutrition.macros?.carbs?.amount || 0}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${cachedNutrition.macros?.fat?.amount || 0}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                `
                    : `
                <div class="bg-gray-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-500 text-center">Nutrition information not available for this meal</p>
                </div>
                `
                }
                
                <div class="flex gap-3">
                    <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                    <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="fa-solid fa-clipboard-list mr-2"></i>
                        Log Meal
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    const servingsInput = modal.querySelector("#meal-servings");

    modal.querySelector("#decrease-servings")?.addEventListener("click", () => {
      const current = parseFloat(servingsInput.value);
      if (current > 0.5) servingsInput.value = (current - 0.5).toFixed(1);
    });

    modal.querySelector("#increase-servings")?.addEventListener("click", () => {
      const current = parseFloat(servingsInput.value);
      if (current < 10) servingsInput.value = (current + 0.5).toFixed(1);
    });

    modal.querySelector("#cancel-log-meal")?.addEventListener("click", () => {
      modal.remove();
    });

    modal.querySelector("#confirm-log-meal")?.addEventListener("click", () => {
      const servings = parseFloat(servingsInput.value) || 1;
      const nutritionForLog = StateStore.getState().mealNutritionCache?.[meal.idMeal] || cachedNutrition;
      this.logMealToDaily(meal, servings, nutritionForLog);
      modal.remove();
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove();
    });
  }

  logMealToDaily(meal, servings, nutrition) {
    const todayKey = StateStore.getTodayString();
    const dailyLog = StateStore.getState().dailyLog || {};

    if (!dailyLog[todayKey]) {
      dailyLog[todayKey] = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, meals: [] };
    }

    const loggedNutrition = {
      calories: nutrition ? Math.round(nutrition.caloriesPerServing * servings) : 0,
      protein: nutrition ? Math.round((nutrition.macros?.protein?.amount || 0) * servings) : 0,
      carbs: nutrition ? Math.round((nutrition.macros?.carbs?.amount || 0) * servings) : 0,
      fat: nutrition ? Math.round((nutrition.macros?.fat?.amount || 0) * servings) : 0,
    };

    dailyLog[todayKey].totalCalories += loggedNutrition.calories;
    dailyLog[todayKey].totalProtein += loggedNutrition.protein;
    dailyLog[todayKey].totalCarbs += loggedNutrition.carbs;
    dailyLog[todayKey].totalFat += loggedNutrition.fat;
    dailyLog[todayKey].meals.push({
      type: "meal",
      name: meal.strMeal,
      mealId: meal.idMeal,
      category: meal.strCategory,
      thumbnail: meal.strMealThumb,
      servings,
      nutrition: loggedNutrition,
      loggedAt: new Date().toISOString(),
    });

    StateStore.updateState({ dailyLog }, true);

    Swal.fire({
      title: "Meal Logged!",
      html: `<p class="text-gray-600">${meal.strMeal} (${servings} serving${servings !== 1 ? "s" : ""}) has been added to your daily log.</p>
                   ${loggedNutrition.calories > 0 ? `<p class="text-emerald-600 font-semibold mt-2">+${loggedNutrition.calories} calories</p>` : ""}`,
      icon: "success",
      confirmButtonColor: "#10b981",
      timer: 2000,
      showConfirmButton: false,
    });

    this.updateFoodLogPage();
  }

  showFoodLogPage() {
    this.toggleSections(
      [
        "search-filters-section",
        "featured-recipes-section",
        "meal-categories-section",
        "all-recipes-section",
        "meal-planning-section",
        "nutritional-insights-section",
      ],
      false
    );
    this.renderFoodLogSection();
  }

  renderFoodLogSection() {
    let section = document.getElementById("foodlog-section");
    if (!section) {
      section = document.createElement("section");
      section.id = "foodlog-section";
      section.className = "px-8 py-8 bg-gray-50 min-h-screen";
      const mainContent = document.getElementById("main-content");
      const footer = document.getElementById("footer");
      mainContent.insertBefore(section, footer);
    }
    section.style.display = "";

    const todaySummary = this.getTodayLogSummary();
    const weeklyData = this.getWeeklyLogData();
    const userGoals = StateStore.getState().userGoals || {
      dailyCalories: 2000,
      dailyProtein: 50,
      dailyCarbs: 250,
      dailyFat: 65,
    };

    section.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Page Header -->
                <div class="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">
                                <i class="fa-solid fa-clipboard-list mr-2"></i>
                                Daily Food Log
                            </h2>
                            <p class="opacity-90">Track and monitor your daily nutrition intake</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm opacity-80">Today</p>
                            <p class="text-xl font-bold">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Today's Summary with Progress -->
                <div id="foodlog-today-section" class="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        <i class="fa-solid fa-fire text-orange-500 mr-2"></i>
                        Today's Nutrition
                    </h3>
                    
                    <!-- Progress Bars -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        ${this.renderNutritionProgress("Calories", todaySummary.totalCalories, userGoals.dailyCalories, "kcal", "emerald")}
                        ${this.renderNutritionProgress("Protein", todaySummary.totalProtein, userGoals.dailyProtein, "g", "blue")}
                        ${this.renderNutritionProgress("Carbs", todaySummary.totalCarbs, userGoals.dailyCarbs, "g", "amber")}
                        ${this.renderNutritionProgress("Fat", todaySummary.totalFat, userGoals.dailyFat, "g", "purple")}
                    </div>
                    
                    <!-- Logged Items -->
                    <div class="border-t border-gray-200 pt-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-semibold text-gray-700">Logged Items (${todaySummary.meals?.length || 0})</h4>
                            ${
                              todaySummary.meals?.length > 0
                                ? `
                                <button id="clear-foodlog" class="text-red-500 hover:text-red-600 text-sm font-medium">
                                    <i class="fa-solid fa-trash mr-1"></i>Clear All
                                </button>
                            `
                                : ""
                            }
                        </div>
                        
                        ${this.renderLoggedItemsList(todaySummary.meals || [])}
                    </div>
                </div>
                
                <!-- Weekly Overview -->
                <div class="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        <i class="fa-solid fa-calendar-week text-indigo-500 mr-2"></i>
                        Weekly Overview
                    </h3>
                    
                    <div class="grid grid-cols-7 gap-2">
                        ${weeklyData
                          .map(
                            (day) => `
                            <div class="text-center ${day.isToday ? "bg-indigo-100 rounded-xl" : ""}">
                                <p class="text-xs text-gray-500 mb-1">${day.dayName}</p>
                                <p class="text-sm font-medium text-gray-900">${day.date}</p>
                                <div class="mt-2 ${day.calories > 0 ? "text-emerald-600" : "text-gray-300"}">
                                    <p class="text-lg font-bold">${day.calories}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                ${day.itemCount > 0 ? `<p class="text-xs text-gray-400 mt-1">${day.itemCount} items</p>` : ""}
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-chart-line text-emerald-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Weekly Average</p>
                                <p class="text-xl font-bold text-gray-900">${weeklyData.reduce((sum, day) => sum + day.calories, 0) > 0 ? Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / 7) : 0} kcal</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-utensils text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Total Items This Week</p>
                                <p class="text-xl font-bold text-gray-900">${weeklyData.reduce((sum, day) => sum + day.itemCount, 0)} items</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-bullseye text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Days On Goal</p>
                                <p class="text-xl font-bold text-gray-900">${weeklyData.filter((day) => day.calories > 0 && day.calories >= userGoals.dailyCalories * 0.8 && day.calories <= userGoals.dailyCalories * 1.2).length} / 7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.setupFoodLogListeners();
  }

  renderNutritionProgress(label, current, goal, unit, color) {
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    const isOverGoal = current > goal;

    return `
            <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">${label}</span>
                    <span class="text-xs ${isOverGoal ? "text-red-500" : `text-${color}-600`}">${percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full ${isOverGoal ? "bg-red-500" : `bg-${color}-500`}" style="width: ${percentage}%"></div>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold ${isOverGoal ? "text-red-600" : `text-${color}-600`}">${current} ${unit}</span>
                    <span class="text-gray-400">/ ${goal} ${unit}</span>
                </div>
            </div>
        `;
  }

  renderLoggedItemsList(items) {
    if (items.length === 0) {
      return `
                <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-utensils text-gray-300 text-3xl"></i>
                    </div>
                    <p class="text-gray-500 font-medium mb-2">No food logged today</p>
                    <p class="text-gray-400 text-sm mb-4">Start tracking your nutrition by logging meals or scanning products</p>
                    <div class="flex justify-center gap-3">
                        <a href="#meals" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                            <i class="fa-solid fa-plus"></i>
                            Browse Recipes
                        </a>
                        <a href="/products" class="nav-link inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            <i class="fa-solid fa-barcode"></i>
                            Scan Product
                        </a>
                    </div>
                </div>
            `;
    }

    return `
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${items
                  .map(
                    (item, index) => `
                    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            ${
                              item.type === "meal" && item.thumbnail
                                ? `<img src="${item.thumbnail}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover"/>`
                                : `<div class="w-14 h-14 ${item.type === "product" ? "bg-blue-100" : "bg-emerald-100"} rounded-xl flex items-center justify-center">
                                    <i class="fa-solid fa-${item.type === "product" ? "box" : "utensils"} ${item.type === "product" ? "text-blue-600" : "text-emerald-600"} text-xl"></i>
                                </div>`
                            }
                            <div>
                                <p class="font-semibold text-gray-900">${item.name}</p>
                                <p class="text-sm text-gray-500">
                                    ${item.type === "meal" ? `${item.servings} serving${item.servings !== 1 ? "s" : ""}` : item.brand || item.serving || "Product"}
                                    <span class="mx-1">•</span>
                                    <span class="${item.type === "product" ? "text-blue-600" : "text-emerald-600"}">${item.type === "product" ? "Product" : "Recipe"}</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${new Date(item.loggedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${item.nutrition?.calories || 0}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${item.nutrition?.protein || 0}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${item.nutrition?.carbs || 0}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${item.nutrition?.fat || 0}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
  }

  getWeeklyLogData() {
    const dailyLog = StateStore.getState().dailyLog || {};
    const today = new Date();
    const days = [];

    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      const dateKey = date.toISOString().split("T")[0];
      const dayLog = dailyLog[dateKey] || { totalCalories: 0, meals: [] };

      days.push({
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        calories: dayLog.totalCalories || 0,
        itemCount: dayLog.meals?.length || 0,
        isToday: daysAgo === 0,
      });
    }

    return days;
  }

  setupFoodLogListeners() {
    document.getElementById("clear-foodlog")?.addEventListener("click", () => {
      Swal.fire({
        title: "Clear Today's Log?",
        text: "This will remove all logged food items for today.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          this.clearTodayLog();
          this.renderFoodLogSection();
          Swal.fire({
            title: "Cleared!",
            text: "Your food log has been cleared.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    });

    document.querySelectorAll(".remove-foodlog-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        this.removeLoggedItem(index);
        this.renderFoodLogSection();
      });
    });
  }

  updateFoodLogPage() {
    const section = document.getElementById("foodlog-section");
    if (section && section.style.display !== "none") this.renderFoodLogSection();
  }

  getTodayLogSummary() {
    const todayKey = StateStore.getTodayString();
    return (
      (StateStore.getState().dailyLog || {})[todayKey] || {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
      }
    );
  }

  // NOTE: this method is not called anywhere else in the app (superseded
  // by renderFoodLogSection + renderLoggedItemsList) but is kept from the
  // original source for completeness.
  renderTodayLogContent(summary) {
    const items = summary.meals || [];
    if (items.length === 0) {
      return `
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fa-solid fa-utensils text-gray-400 text-2xl"></i>
                    </div>
                    <p class="text-gray-500">No food logged today</p>
                    <p class="text-gray-400 text-sm">Search and log products to track your intake</p>
                </div>
            `;
    }

    return `
            <!-- Nutrition Summary -->
            <div class="grid grid-cols-4 gap-4 mb-4">
                <div class="bg-emerald-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Calories</p>
                    <p class="text-2xl font-bold text-emerald-600">${summary.totalCalories}</p>
                    <p class="text-xs text-gray-400">kcal</p>
                </div>
                <div class="bg-blue-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Protein</p>
                    <p class="text-2xl font-bold text-blue-600">${summary.totalProtein}g</p>
                </div>
                <div class="bg-amber-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Carbs</p>
                    <p class="text-2xl font-bold text-amber-600">${summary.totalCarbs}g</p>
                </div>
                <div class="bg-purple-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Fat</p>
                    <p class="text-2xl font-bold text-purple-600">${summary.totalFat}g</p>
                </div>
            </div>
            
            <!-- Logged Items -->
            <div class="border-t border-gray-200 pt-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Logged Items (${items.length})</h4>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                    ${items
                      .map(
                        (item, index) => `
                        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div class="flex items-center gap-3">
                                ${
                                  item.type === "meal" && item.thumbnail
                                    ? `<img src="${item.thumbnail}" alt="${item.name}" class="w-10 h-10 rounded-lg object-cover"/>`
                                    : `<div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <i class="fa-solid fa-${item.type === "product" ? "box" : "utensils"} text-emerald-600"></i>
                                    </div>`
                                }
                                <div>
                                    <p class="font-medium text-gray-900 text-sm">${item.name}</p>
                                    <p class="text-xs text-gray-500">
                                        ${item.type === "meal" ? `${item.servings} serving${item.servings !== 1 ? "s" : ""}` : item.brand || item.serving || ""}
                                        • ${item.nutrition?.calories || 0} kcal
                                    </p>
                                </div>
                            </div>
                            <button class="remove-logged-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <button id="clear-todays-log" class="mt-3 w-full py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all">
                    <i class="fa-solid fa-trash mr-2"></i>Clear Today's Log
                </button>
            </div>
        `;
  }

  removeLoggedItem(index) {
    const todayKey = StateStore.getTodayString();
    const dailyLog = StateStore.getState().dailyLog || {};
    if (!dailyLog[todayKey] || !dailyLog[todayKey].meals[index]) return;

    const item = dailyLog[todayKey].meals[index];
    dailyLog[todayKey].totalCalories -= Math.round(item.nutrition?.calories || 0);
    dailyLog[todayKey].totalProtein -= Math.round(item.nutrition?.protein || 0);
    dailyLog[todayKey].totalCarbs -= Math.round(item.nutrition?.carbs || 0);
    dailyLog[todayKey].totalFat -= Math.round(item.nutrition?.fat || 0);

    dailyLog[todayKey].totalCalories = Math.max(0, dailyLog[todayKey].totalCalories);
    dailyLog[todayKey].totalProtein = Math.max(0, dailyLog[todayKey].totalProtein);
    dailyLog[todayKey].totalCarbs = Math.max(0, dailyLog[todayKey].totalCarbs);
    dailyLog[todayKey].totalFat = Math.max(0, dailyLog[todayKey].totalFat);

    dailyLog[todayKey].meals.splice(index, 1);
    StateStore.updateState({ dailyLog }, true);
    this.showNotification("Item removed from log", "info");
    this.updateFoodLogPage();
  }

  clearTodayLog() {
    const todayKey = StateStore.getTodayString();
    const dailyLog = StateStore.getState().dailyLog || {};
    dailyLog[todayKey] = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, meals: [] };
    StateStore.updateState({ dailyLog }, true);
    this.showNotification("Today's log cleared", "info");
    this.updateFoodLogPage();
  }
}

/* ===========================================================
 * 7. Bootstrap + demo Plotly charts
 * ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  window.nutriPlanApp = new NutriPlanApp();
});

window.addEventListener("load", function () {
  setTimeout(() => {
    try {
      // `typeof Plotly < "u"` is equivalent to `typeof Plotly !== "undefined"`
      if (typeof Plotly < "u") {
        const macroChartEl = document.getElementById("macro-chart");
        document.getElementById("calorie-chart"); // existence-checked but otherwise unused here
        if (macroChartEl && !macroChartEl.data) renderCharts();
      }
    } catch (error) {
      console.error("Chart rendering error:", error);
    }
  }, 1000);
});

// Renders the two demo Plotly charts (macro breakdown pie chart and a
// weekly-calories line chart) using static sample data.
function renderCharts() {
  try {
    const macroPieData = [
      {
        values: [42, 18, 28, 6],
        labels: ["Protein", "Carbs", "Fat", "Fiber"],
        type: "pie",
        marker: { colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"] },
        textinfo: "label+percent",
        textposition: "inside",
        hovertemplate: "<b>%{label}</b><br>%{value}g<br>%{percent}<extra></extra>",
      },
    ];
    const macroPieLayout = {
      title: { text: "", font: { size: 0 } },
      showlegend: true,
      legend: { orientation: "h", y: -0.1 },
      margin: { t: 20, r: 20, b: 60, l: 20 },
      plot_bgcolor: "#ffffff",
      paper_bgcolor: "#ffffff",
    };
    const chartConfig = { responsive: true, displayModeBar: false, displaylogo: false };
    Plotly.newPlot("macro-chart", macroPieData, macroPieLayout, chartConfig);

    const calorieLineData = [
      {
        x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        y: [1850, 1920, 1780, 2100, 1950, 2200, 2050],
        type: "scatter",
        mode: "lines+markers",
        name: "Actual",
        line: { color: "#10b981", width: 3 },
        marker: { size: 8, color: "#10b981" },
        hovertemplate: "<b>%{x}</b><br>%{y} calories<extra></extra>",
      },
      {
        x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        y: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
        type: "scatter",
        mode: "lines",
        name: "Target",
        line: { color: "#ef4444", width: 2, dash: "dash" },
        hovertemplate: "<b>Target</b><br>%{y} calories<extra></extra>",
      },
    ];
    const calorieLineLayout = {
      title: { text: "", font: { size: 0 } },
      xaxis: { title: "Day of Week" },
      yaxis: { title: "Calories" },
      margin: { t: 20, r: 20, b: 60, l: 60 },
      plot_bgcolor: "#f9fafb",
      paper_bgcolor: "#ffffff",
      showlegend: true,
      legend: { orientation: "h", y: -0.2 },
    };
    Plotly.newPlot("calorie-chart", calorieLineData, calorieLineLayout, chartConfig);
  } catch (error) {
    console.error("Initial chart rendering error:", error);
  }
}