export default class ElixirsList {
    constructor(onSelect) {
      this.onSelect = onSelect;
      this.container = document.createElement('div');
    }
  
    updateList(elixirs) {
      this.container.innerHTML = '';
      elixirs.forEach(elixir => {
        const item = document.createElement('div');
        item.textContent = elixir.name;
        item.addEventListener('click', () => this.onSelect(elixir));
        this.container.appendChild(item);
      });
    }
  
    render() {
      return this.container;
    }
  }
  