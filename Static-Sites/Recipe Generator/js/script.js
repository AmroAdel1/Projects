/** *
 * Core feature: "Try Another Recipe" pulls a random recipe from `recipes`
 * (see data.js) with two guarantees:
 *   1. The same recipe never shows twice in a row (even across a cycle boundary).
 *   2. Within one "cycle" (one pass through all recipes), no recipe repeats —
 *      every recipe is shown exactly once before the deck reshuffles.
 *
 * This is a classic shuffle-bag: shuffle all ids, hand them out one at a time,
 * and only reshuffle once the bag is empty. Reshuffling also checks the new
 * bag's first card against the last one shown so a reshuffle can never land
 * on the same recipe that just finished the previous cycle.
 */

import recipes from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  // Fisher-Yates Shuffle algorithm
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle bag state variables
  let currentBag = [];
  let lastShownRecipeId = null;

  // Generate a fresh shuffle bag avoiding duplicates across cycle boundaries
  function generateNewBag() {
    let ids = recipes.map((recipe) => recipe.id);
    let shuffled = shuffleArray(ids);

    const lastIndex = shuffled.length - 1;

    // If the first recipe in the new bag equals the last shown, swap it
    if (
      recipes.length > 1 &&
      lastShownRecipeId !== null &&
      shuffled[lastIndex] === lastShownRecipeId // 0
    ) {
      // Pick a random index > 0 to swap with
      const swapIndex = Math.floor(Math.random() * lastIndex); // 0 to lastIndex-1
      [shuffled[lastIndex], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[lastIndex],
      ];
    }

    return shuffled;
  }

  // Pull the next recipe ID adhering to shuffle-bag rules
  function getNextRecipeId() {
    if (currentBag.length === 0) {
      currentBag = generateNewBag();
    }
    const nextId = currentBag.pop();
    lastShownRecipeId = nextId;
    return nextId;
  }

  // UI elements
  const recipeSection = document.getElementById("recipe-display-section");
  const tryAnotherBtn = document.getElementById("try-another-btn");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  const recipeImage = document.getElementById("recipe-image");
  const ratingAverage = document.getElementById("rating-average");
  const ratingQuantity = document.getElementById("rating-quantity");
  const prepTimeDisplay = document.getElementById("prep-time-display");
  const cookTimeDisplay = document.getElementById("cook-time-display");
  const servingsDisplay = document.getElementById("servings-display");
  const difficultyBadge = document.getElementById("difficulty-badge");
  const categoryBadge = document.getElementById("category-badge");
  const recipeName = document.getElementById("recipe-name");
  const recipeDescription = document.getElementById("recipe-description");
  const timeWarning = document.getElementById("time-warning");

  const ingredientsList = document.getElementById("ingredients-list");
  const instructionsList = document.getElementById("instructions-list");
  const tipsList = document.getElementById("tips-list");

  const caloriesValue = document.getElementById("calories-value");
  const proteinValue = document.getElementById("protein-value");
  const carbsValue = document.getElementById("carbs-value");
  const fatValue = document.getElementById("fat-value");
  const fiberValue = document.getElementById("fiber-value");
  const sodiumValue = document.getElementById("sodium-value");

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Render recipe DOM
  function renderRecipe(recipe) {
    recipeImage.src = recipe.image;
    recipeImage.alt = recipe.imgAlt;

    ratingAverage.textContent = recipe.rating.average;
    ratingQuantity.textContent = `(${recipe.rating.quantity} reviews)`;

    prepTimeDisplay.textContent = recipe.prepTime;
    cookTimeDisplay.textContent = recipe.cookTime;
    servingsDisplay.textContent = recipe.servings;

    difficultyBadge.textContent = recipe.difficulty;
    categoryBadge.textContent = recipe.category;

    recipeName.textContent = recipe.name;
    recipeDescription.textContent = recipe.description;

    // Time Warning logic (> 45 min)
    if (recipe.totalTime > 45) {
      timeWarning.classList.remove("hidden");
    } else {
      timeWarning.classList.add("hidden");
    }

    // Render Ingredients
    ingredientsList.innerHTML = recipe.ingredients
      .map(
        (item, idx) => `
      <li class="flex items-start">
        <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 mr-3 flex-shrink-0">
          ${idx + 1}
        </div>
        <span class="text-gray-700">${item}</span>
      </li>
    `,
      )
      .join("");

    // Render Instructions
    instructionsList.innerHTML = recipe.instructions
      .map(
        (step, idx) => `
      <div class="flex items-start">
        <div class="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mr-4 flex-shrink-0">
          ${idx + 1}
        </div>
        <div class="flex-1 pt-2">
          <p class="text-gray-700">${step}</p>
        </div>
      </div>
    `,
      )
      .join("");

    // Render Nutrition
    caloriesValue.textContent = recipe.nutrition.calories;
    proteinValue.textContent = recipe.nutrition.protein;
    carbsValue.textContent = recipe.nutrition.carbs;
    fatValue.textContent = recipe.nutrition.fat;
    fiberValue.textContent = recipe.nutrition.fiber;
    sodiumValue.textContent = recipe.nutrition.sodium;

    // Render Chef Tips
    tipsList.innerHTML = recipe.tips
      .map(
        (tip) => `
      <div class="flex items-start p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
        <i class="fa-solid fa-check-circle text-amber-600 text-xl mr-3 mt-1"></i>
        <p class="text-gray-700">${tip}</p>
      </div>
    `,
      )
      .join("");

    recipeSection.classList.remove("hidden");
  }

  // Load and display next recipe
  function showNextRecipe() {
    const nextId = getNextRecipeId();
    const recipe = recipes.find((r) => r.id === nextId);
    if (recipe) {
      renderRecipe(recipe);
    }
  }

  // Tab switching logic
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      tabButtons.forEach((btn) => {
        btn.classList.remove("text-orange-600", "border-orange-600");
        btn.classList.add("text-gray-500", "border-transparent");
      });

      button.classList.remove("text-gray-500", "border-transparent");
      button.classList.add("text-orange-600", "border-orange-600");

      tabContents.forEach((content) => {
        if (content.id === `${targetTab}-tab`) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });

  // Mobile navigation handler
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Action listeners
  tryAnotherBtn.addEventListener("click", showNextRecipe);

  // Initial load
  showNextRecipe();
});

// Fisher-Yates Shuffle
// for(let i = 0; i < recipes.length ; i++){
//   let random = Math.floor(Math.random() * recipes.length);
//   [recipes[i], recipes[random]] = [recipes[random], recipes[i]];  // swap
// }
