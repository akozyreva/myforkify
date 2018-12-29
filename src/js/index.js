// APIKey = 15d08ce5f45a57ebabb75e518a197da1
//http://food2fork.com/api/search


import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {
	elements,
	renderLoader,
	clearLoader
} from './views/base';

/*Global state of the app
-Search object
- Current recipe
- Shopping list
- Like recipe
*/
const state = {}
// FOR TESTING
// window.state = state;

/*SEARCH CONTROLLER*/
const controlSearch = async () => {
	// 1) get he query from the view
	const query = searchView.getInput();
	//console.log(query);

	if (query) {
		// 2) New search object and add to state
		// we add to global const state!
		state.search = new Search(query);

		//3) Prepare UI for the results
		//clean the input and prev results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			//4) Seatch for the recipeis
			await state.search.getResults();

			//5) render results on UI
			//console.log(state.search.result);
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch (err) {
			console.log(err);
			clearLoader();
		}

	}
}

elements.searchForm.addEventListener('submit', event => {
	//it's for not reloading the page after push the btn
	event.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', event => {
	console.log(event.target);
	//closest method js - in this way we click only click on the btn, not icon or somth else
	const btn = event.target.closest('.btn-inline');
	if (btn) {
		//retrieve the value of property goto
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
		console.log(goToPage);
	}
});


/*RECIPE CONTROLLER*/

const controlRecipe = async () => {
	//we need to take hash, getting from event listener and delte #
	const id = window.location.hash.replace('#', '');
	//console.log(id);

	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//highlight select search item
		if (state.search) searchView.highLightSelected(id);


		//Create new recipe obj
		state.recipe = new Recipe(id);

		/*//IMPORTANT! FOR TESTING WE HAVE ACCESS TO THE STATE RECIPE OBJ AND IT WORKS!!!!
		window.r = state.recipe;
		//for cathing an error
		*/
		try {
			//Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIgredients();

			//Calculate servingd and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			//Render the recipe
			//console.log(state.recipe);
			clearLoader();
			recipeView.renderRecipe(
				state.recipe,
				state.likes.isLiked(id)
			);
		} catch (err) {
			console.log(err);
		}

	}
};



/*LIST CONTROLLER*/
const controlList = () => {
	// Create a new list if there is none yet
	if (!state.list) state.list = new List();

	// Add each ingerd to the list
	state.recipe.ingrid.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});

}

/*window.addEventListener('hashchange', controlRecipe);
//if user reloads page, we need to show recipe at all 
window.addEventListener('load', controlRecipe);
*/


//another way to write it
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));


/*LIKES CONTROLLER*/


const controlLike = () => {
	//create new arr likes in state
	if (!state.likes) state.likes = new Likes();

	const currentID = state.recipe.id;
	const isLiked = state.likes.isLiked(currentID);

	//toogle the like btn
	likesView.toggleLikeBtn(isLiked);
	//user has not yet liked cur recipe
	if (!isLiked) {
		// add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		)

		// add like to UI list
		likesView.renderLike(newLike);

	} else {
		//user has liked cur recipe
		// remove like to the state
		state.likes.delteLike(currentID);
		// romove like to UI list
		likesView.deleteLike(currentID);
	}

	likesView.toggleLikeMenu(state.likes.getNumberLikes());
};


// restore liked recipies on page load
window.addEventListener('load', () => {
	state.likes = new Likes();
	
	//restore likes
	state.likes.readStorage();

	//toggle the btn
	likesView.toggleLikeMenu(state.likes.getNumberLikes());
	
	//render existing likes
	state.likes.likes.forEach(like => likesView.renderLike(like));
})



// HANDLE DELTE AND UPTDATE LIST ITEMS EVENETS in shopping list
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	// Handle the delete btn
	if (e.target.matches('.shopping__delete,.shopping__delete * ')) {
		//delte from state
		state.list.deleteItem(id);

		//delte from ui
		listView.deleteItem(id);
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.val, 10);
		state.list.updateCount(id, val);
	}
});

// HANDLING RECIPE BTN CLICK
elements.recipe.addEventListener('click', e => {
	//mathces find all matches, that we need
	// * means all children
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// decrease btn is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
		}

	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// increase btn is clicked
		state.recipe.updateServings('inc');
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		//add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// click on like btn
		// Like ctrl
		controlLike();
	}
	recipeView.updateServingIngredients(state.recipe);
});

// for testing
//const l = new List();
//window.l = l;
