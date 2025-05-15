export default class ElixirDetails {
    constructor() {
      this.container = document.createElement('div');
    }
  
    showDetails(elixir) {
      this.container.innerHTML = `
        <h2>${elixir.name}</h2>
        <p><strong>Effect:</strong> ${elixir.effect}</p>
        <p><strong>Ingredients:</strong> ${elixir.ingredients?.map(i => i.name).join(', ')}</p>
      `;
    }
  
    render() {
      return this.container;
    }
  }
  