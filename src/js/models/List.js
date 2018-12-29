import uniqid from 'uniqid';
//uniqid - library for generating uniqid

export default class List {
	constructor() {
		this.items = [];	
	}
	
	addItem(count, unit, ingredient) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient,
		}
		this.items.push(item);
		return item;
	}
	
	deleteItem(id) {
		//find index of el, which condition is right (callback fn)
		const index = this.items.findIndex(el => el.id === id);
		//splice mutates the original arr, deleting element, which index would be passed
		this.items.splice(index, 1);
	}
	
	//update counts of ingredints of shopping list
	updateCount(id, newCount) {
		//find return the value of element, which is ok to condition
		this.items.find(el => el.id === id).count = newCount;
	}
}