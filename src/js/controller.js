import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'
import { MODAL_CLOSE_SEC } from './config.js';

// if(module.hot){
//   module.hot.accept();
// }


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////////////////



const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
    if(!id) return

    recipeView.renderSpinner();

    //0. results to mark selected search result
    resultsView.update(model.getSearchResultPage());
    
    //1. LOADING RECIPE
    await model.loadRecipe(id);
    
    //2. RENDERING RECIPES
    recipeView.render(model.state.recipe);
    
    //3. update bookmark
    bookmarksView.update(model.state.bookmarks);
  }
  catch(err){
    recipeView.renderError()
  }
};



const controlSearchResults = async function ( ){
  try {
    resultsView.renderSpinner()
    //get search query
    const query = searchView.getQuery();
    if(!query) return;

    //load search
    await model.loadSearchResult(query);
    
    //render result
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultPage())

    //render pagination
    paginationView.render(model.state.search)

  } catch (error) {
    console.log(error)
  }
}

const controlPagination = function (goToPage){
   //render new resulkt
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultPage(goToPage))

    //render new pagination
    paginationView.render(model.state.search)
}

// controlRecipes()

const controlServings = function(newServings){
  //update recipe in state
  model.updateServings(newServings)

  //update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}


const controlAddBookmark = function(){
  //add delete bookmark
  if(!model.state.recipe.bookmarked)  model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  //update bookmark
  recipeView.update(model.state.recipe);

  //render bookmark
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try {
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)
    
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage()

    //render bookmark
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message)
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  
  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('hiii')
}
init()
