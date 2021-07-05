import uniqid from 'uniqid';

export default class List {

  constructor(){
    this.items = [];
  }

  addItem(count,unit,ingredient){
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    return item;
  }

  deleteItem(id){

    const index = this.items.findIndex(el=> el.id === id);
    // [2,4,8] splice[1,1] -> returns 4 , original array is [2,8] - mutates the original array
    // [2,4,8]  slice[1,1] -> return 4, original array is [2,4,8] - do not mutate
    this.items.splice(index,1);
  }

  updateCount(id, newCount){
    this.items.find(el => el.id === id).count = newCount;
    //console.log('update count');
  }

}