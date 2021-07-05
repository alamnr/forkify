

export default class Like{

  constructor(){
    this.likes = [];
  }

  addLike(id,title,author,img) {
    const like = { id, title, author,img};
    this.likes.push(like);
    // persist data in to localStorage
    this.persistDataInLocalStorage();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index,1);
    // persist data in to localStorage
    this.persistDataInLocalStorage();
  }

  persistDataInLocalStorage(){
    localStorage.setItem('likes',JSON.stringify(this.likes));
  }

  readDataFromLocalStorage(){
    const storage = JSON.parse(localStorage.getItem('likes'));

    // restoring likes from localstorage
    if(storage){
      this.likes = storage;
    }
  }

  isLiked(id){
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes(){
    return this.likes.length;
  }



}