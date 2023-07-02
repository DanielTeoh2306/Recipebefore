import { categorySelect, favoritesHeading } from "./selectors.js";
import UserInterface from "../classes/UserInterface.js";

function fetchCategories() {
  const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    })
    .then((data) => {
      if (data.categories.length > 0) {
        showCategories(data.categories);
      } else {
        console.log("Error: No categories available");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function showCategories(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.strCategory;
    option.textContent = category.strCategory;

    categorySelect.appendChild(option);
  });
}

function getSelectedCategory(e) {
  const category = e.target.value;

  fetchFoodByCategory(category);
}

function fetchFoodByCategory(category) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    })
    .then((data) => {
      if (data.meals.length > 0) {
        UserInterface.showFoodsInHTML(data.meals);
      } else {
        console.log("Error: no meals found for the selected category");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchRecipeByID(id) {
  const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    })
    .then((data) => {
      if (data.meals.length > 0) {
        UserInterface.showModal(data.meals[0]);
      } else {
        console.log("No hay receta para la comida seleccionada");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function addToFavorites(food) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

  favorites.push(food);

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

  const updatedFavorites = favorites.filter((food) => food.idMeal !== id);

  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

function existsInFavorites(id) {

  const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

  return favorites.some((element) => element.idMeal === id);
}

function getFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

  if (favorites.length > 0) {
    UserInterface.showFoodsInHTML(favorites);
  } else {
    UserInterface.setFavoriteHeadingInitialText();
  }
}

export {
  fetchCategories,
  getSelectedCategory,
  fetchRecipeByID,
  addToFavorites,
  removeFromFavorites,
  existsInFavorites,
  getFavorites,
};
