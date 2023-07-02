import { fetchCategories, getSelectedCategory, getFavorites } from "../utils/functions.js";
import { categorySelect, favorites } from "../utils/selectors.js";

class App {
  constructor() {
    this.initApp();
  }

  initApp() {
    if (categorySelect) {
      fetchCategories();
      categorySelect.addEventListener("change", getSelectedCategory);
    }

    if (favorites) {
      getFavorites();
    }
  }
}

export default App;
