import axios from 'axios';
export default class ApiService {
  #API_KEY = '37174387-4bc26f62cece3be18dd48327d';
  #BASE_URL = 'https://pixabay.com/api/';
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  setSearchQuery(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
  async getPictures() {
    const URL = `${this.#BASE_URL}/?`;
    const res = await axios.get(URL, {
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        q: this.searchQuery,
        page: this.page,
        per_page: this.per_page,
        key: this.#API_KEY,
        safesearch: true,
      },
    });
    this.incrementPage();
    return res.data;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
