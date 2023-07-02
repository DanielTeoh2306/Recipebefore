import {
  results,
  containerModal,
  favorites,
  favoritesHeading,
} from "../utils/selectors.js";
import {
  removeFromFavorites,
  addToFavorites,
  fetchRecipeByID,
  getFavorites,
  existsInFavorites,
} from "../utils/functions.js";

class UserInterface {
  static showFoodsInHTML(foods) {
    UserInterface.clearHTML(results);

    foods.forEach((food) => {
      const { idMeal: id, strMeal: name, strMealThumb: urlImg } = food;

      const foodCard = document.createElement("article");
      foodCard.classList.add("food-card");

      const img = document.createElement("img");
      img.classList.add("food-card__img");
      img.alt = `${name} image`;
      img.src = urlImg;

      foodCard.appendChild(img);

      const cardDetails = document.createElement("div");
      cardDetails.classList.add("food-card__details");

      foodCard.appendChild(cardDetails);

      const foodcardName = document.createElement("h3");
      foodcardName.classList.add("food-card__name");
      foodcardName.textContent = name;

      cardDetails.appendChild(foodcardName);

      const btn = document.createElement("button");
      btn.classList.add("button");
      btn.textContent = "Sight Recipes";
      btn.onclick = function () {
        fetchRecipeByID(id);
      };

      cardDetails.appendChild(btn);

      results.appendChild(foodCard);
    });
  }

  static clearHTML(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  static showModal(recipe) {
    const {
      idMeal,
      strMeal: name,
      strMealThumb: urlImg,
      strInstructions: text,
      strYoutube,
    } = recipe;

    containerModal.innerHTML = `
      <div class="modal" id="modal">
        <div class="modal__card">
          <div class="modal__content">
            <header class="modal__header">
              <h2 class="modal__title">${name}</h2>
            </header>
            <main class="modal__body">
              <img class="modal__image" src="${urlImg}" alt="${name} image" />
              <h3 class="modal__title">Instructions</h3>
              <p class="modal__text">${text}</p>
              <h3 class="modal__title">Ingredients and Quantities</h3>
              <ul id="modal-list" class="modal__list"></ul>
              <h3 class="modal__title">Video</h3>
              <a href="${strYoutube}" target="_blank">Watch the video on YouTube!</a>
            </main>
            <footer id="modal-footer" class="modal__footer"></footer>
          </div>
        </div>
      </div>
    `;

    const modalsList = containerModal.querySelector("#modal-list");

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && measure) {
        const li = document.createElement("li");
        li.classList.add("modal__list-item");
        li.textContent = `${ingredient} - ${measure}`;

        modalsList.appendChild(li);
      }
    }

    const modalsFooter = containerModal.querySelector("#modal-footer");

    const btnAddFav = document.createElement("button");
    btnAddFav.classList.add("button", "button--favorite");

    if (existsInFavorites(idMeal)) {
      btnAddFav.textContent = "Remove from Favourites";
    } else {
      btnAddFav.textContent = "Add to Favourites";
    }

    btnAddFav.onclick = function () {
      if (existsInFavorites(idMeal)) {
        removeFromFavorites(idMeal);
        UserInterface.showAlert("Recipe removed from Favorites", "remove");
        btnAddFav.textContent = "Add to Favourites";

        if (favorites) {
          getFavorites();
        }
      } else {
        addToFavorites({
          idMeal: idMeal,
          strMeal: name,
          strMealThumb: urlImg,
        });

        if (favorites) {
          getFavorites();
        }

        UserInterface.showAlert("Recipe added to Favourites!", "success");

        btnAddFav.textContent = "Remove from Favourites";
      }
    };

    const btnClose = document.createElement("button");
    btnClose.classList.add("button", "button--close");
    btnClose.textContent = "Abandon";
    btnClose.onclick = function () {
      UserInterface.clearHTML(containerModal);
    };

    modalsFooter.appendChild(btnAddFav);
    modalsFooter.appendChild(btnClose);
  }

  static showAlert(message, type) {
    const exist = document.querySelector(".alert");

    if (exist) return;

    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");

    if (type === "success") {
      alert.classList.add("alert--success");
    } else if (type === "remove") {
      alert.classList.add("alert--remove");
    }

    const container = document.querySelector(".modal__header");
    container.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 2000);
  }

  static setFavoriteHeadingInitialText() {
    UserInterface.clearHTML(results);
    favoritesHeading.textContent = "View your favourite recipes here";
  }
}

export default UserInterface;
