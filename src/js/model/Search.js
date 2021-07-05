import axios from "axios";

// export default class Search {
//   constructor(query) {
//     this.query = query;
//   }

//   async getResults() {
//     try {
//       const res = await axios(
//         `https://forkify-api.herokuapp.com/search?q=${this.query}`
//       );

//       this.result = res.data.recipes;
//       console.log(this.result);
//     } catch (error) {
//       alert(error);
//     }
//   }
// }

export default function Search(query) {
  this.query = query;
}

Search.prototype.getResults = async function () {
  try {
    const res = await axios(
      `https://forkify-api.herokuapp.com/search?q=${this.query}`
    );
    this.result = res.data.recipes;
    //console.log(this.result);
  } catch (error) {
    alert(error);
  }
};
