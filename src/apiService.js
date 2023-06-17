import axios from 'axios';

const API_KEY = '37174387-4bc26f62cece3be18dd48327d';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  setSearchQuery(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
  async getPictures() {
    const URL = `https://pixabay.com/api?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;
    const res = await axios.get(URL);
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
