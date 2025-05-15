export default class SearchBar {
    constructor(onSearch) {
      this.onSearch = onSearch;
    }
  
    render() {
      const input = document.createElement('input');
      input.placeholder = 'Search elixirs...';
      input.addEventListener('input', () => this.onSearch(input.value));
      return input;
    }
  }
  