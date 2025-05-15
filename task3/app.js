import { fetchElixirs } from './services/api.js';
import SearchBar from './components/SearchBar.js';
import ElixirsList from './components/ElixirsList.js';
import ElixirDetails from './components/ElixirDetails.js';
import Filter from './components/Filter.js';

const app = document.getElementById('app');
let allElixirs = [];

let currentSearch = '';
let currentFilter = 'All';

const elixirsList = new ElixirsList(showDetails);
const elixirDetails = new ElixirDetails();
const searchBar = new SearchBar(handleSearch);
const filter = new Filter(handleFilter);

const leftPanel = document.createElement('div');
leftPanel.className = 'left-panel';

const controlsWrapper = document.createElement('div');
controlsWrapper.className = 'controls-wrapper';
controlsWrapper.appendChild(searchBar.render());
controlsWrapper.appendChild(filter.render());

leftPanel.appendChild(controlsWrapper);

leftPanel.appendChild(elixirsList.render());

app.appendChild(leftPanel);
app.appendChild(elixirDetails.render());


init();

async function init() {
  try {
    app.classList.add('loading');
    allElixirs = await fetchElixirs();
    elixirsList.updateList(allElixirs);
  } catch (err) {
    app.innerHTML = `<p>Error: ${err.message}</p>`;
  } finally {
    app.classList.remove('loading');
  }
}

function handleSearch(query) {
  currentSearch = query;
  applyFilters();
}

function handleFilter(level) {
  currentFilter = level;
  applyFilters();
}

function applyFilters() {
  const filtered = allElixirs.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(currentSearch.toLowerCase());
    const matchesFilter = currentFilter === 'All' || e.difficulty === currentFilter;
    return matchesSearch && matchesFilter;
  });

  elixirsList.updateList(filtered);
}

function showDetails(elixir) {
  elixirDetails.showDetails(elixir);
}
