export default class Likes {
	constructor() {
		this.likes = [];
	}

	addLike(id, title, author, img) {
		const like = {
			id,
			title,
			author,
			img
		}
		this.likes.push(like);
		
		// presist data in localStorage
		this.presistData();
		return like;
	}

	delteLike(id) {
		const index = this.likes.findIndex(el => el.id === id);
		this.likes.splice(index, 1);
		
		// presist data in localStorage
		this.presistData();
	}
	
	isLiked(id) {
		//test if the recipe is liked
		return this.likes.findIndex(el => el.id === id) !== -1;
	}
	
	getNumberLikes() {
		return this.likes.length;
	}
	
	presistData() {
		//because 2 argument can be only string!
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}
	
	readStorage() {
		//read data for showing it after reloading page
		const storage = JSON.parse(localStorage.getItem('likes'));
		
		//restore likes from the localStorage
		if(storage) this.likes = storage;
	}
}
