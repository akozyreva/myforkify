import {
	elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const clearResults = () => {
	elements.searchResultList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};

export const highLightSelected = id => {
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));
	resultsArr.forEach(el => {
		el.classList.remove('results__link--active');
	});
	
	document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active');
};


// 'Pasta with tomato and spanish'
//result of split['Pasta', 'with', 'tomato', 'and', 'spanish']
/*
acc = 0 acc+cur = 5 => newTitle = ['pasta']
acc = 5 acc+cur = 9 => newTitle = ['pasta' ,'with']
acc = 9 acc+cur = 15 => newTitle = ['pasta' ,'with', 'tomato']
acc = 15 acc+cur = 19 > newTitle = ['pasta' ,'with', 'tomato']
*/
//function for cutting title of recipe
export const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);
		//return the result
		//join opposit to split
		return `${newTitle.join(' ')}...`;
	}
	return title;
};

//it's private function
const renderRecipe = recipe => {
	const markup = `
				<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
				`;
	//insert html in the Dom from 1 to 2, from 2 to 3...
	elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

//function for clearing input field after pushing enter
export const clearInput = () => elements.searchInput.value = '';


const createButton = (page, type) => `

 	<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
    </button>
`;

//private function for showing btn
const renderButtons = (page, numResults, resPerPage) => {
	//math round to the biggest part. 4.1 => 5
	const pages = Math.ceil(numResults / resPerPage);

	
	let button;
	if (page === 1 && pages > 1) {
		// btn to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		// both pages
		button = `
			${createButton(page, 'next')}
			${createButton(page, 'prev')}
		`;
	} else if (page === pages && pages > 1) {
		//btn to the prev page
		button = createButton(page, 'prev');
	}
	
	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
	
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	//start and the end of count pages
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	//slice recipe array from start to the end
	recipes.slice(start, end).forEach(renderRecipe);
	
	// render pagination btn
	renderButtons(page, recipes.length, resPerPage);

};
