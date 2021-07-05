import Search from "./model/Search";
import Recipe from "./model/Recipe";
import List from "./model/List";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import Like from "./model/Likes";

/*
  Global state of the App
  - Search Object
  - Current recipe obect
  - Shopping list object
  - Liked recipes
*/

const state = {};
/*
 * Search Controller
 */
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();
  
  if (query) {
    // 2. New search object and add  to state
    state.search = new Search(query);
    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);
    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5.Render result UI
      clearLoader();
      
      searchView.renderResults(state.search.result);
    } catch (error) {
      console.log(error);
      alert("Something went wrong :)");
    }
  }
};
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});



elements.searchRes.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResults(state.search.result, gotoPage);
    //console.log(btn);
  }
});

/*
 * Recipe Controller
 */

const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace("#", "");
  //console.log(id);
  if (id) {
    // Prepare ui for changes
    recipeView.clearRecipeView();
    renderLoader(elements.recipe);

    // Highlight selected search item
    searchView.highlightSelected(id);
    // Createnew recipe object and parse ingredients
    state.recipe = new Recipe(id);
    

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();
      // Calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      //console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Error processing recipe");
    }
  }
};

//window.addEventListener("hashchange", controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/*

* List Controller
*/

const controlList = ()  => {
  // Create a new list if there is none yet
  if(!state.list){
    state.list = new List();
  }
  // Add ingredients to the list and UI
  state.recipe.ingredients.forEach(el=>{
    const item =  state.list.addItem(el.count,el.unit,el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item  events

elements.shoping.addEventListener('click',e=>{
   const id = e.target.closest('.shopping__item').dataset.itemid;

   // Handle delete button
   if(e.target.matches('.shopping__delete,  .shopping__delete *')){
     // Delete from state
     state.list.deleteItem(id);

     // delete from UI
     listView.deleteItem(id);
     //Handle count update
   } else if(e.target.matches('.shopping__count-value')) {
     const val = parseFloat(e.target.value,10);
     state.list.updateCount(id,val);
   }
});

/*
* Like controller
*/
const controlLikes= () => {
  if(!state.likes){
    state.likes = new Like();
  }
  const currentId = state.recipe.id;
  // user has not yet liked current recipe
  if(!state.likes.isLiked(currentId)){
    // Add like to the state
    const newLike = state.likes.addLike(currentId,state.recipe.title,state.recipe.author,state.recipe.img);
    // toggle like button
    likesView.toggleLikeBtn(true);
    // Add like to the UI list
    likesView.renderLike(newLike);
  } else { // user has liked current recipe
     // Remove like to the state
      state.likes.deleteLike(currentId);
    // toggle like button
    likesView.toggleLikeBtn(false);
    // Remove like from the UI list
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore like recipes on page load
window.addEventListener('load', ()=>{
  
  state.likes = new Like();
  // restore likes
  state.likes.readDataFromLocalStorage();

  // toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // render existing likes
  state.likes.likes.forEach(like =>{
    likesView.renderLike(like);
  });


});

// Handling recipe button clicks
elements.recipe.addEventListener('click', event =>{
  if(event.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clickede.
    if(state.recipe.servings>1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
   
  } else  if(event.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if(event.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (event.target.matches('.recipe__love , .recipe__love *')) {
    // Like controller 
   // console.log('asdfsafasfasfas');
    controlLikes();
  }
 // console.log(state.recipe);
});


//window.l= new List();