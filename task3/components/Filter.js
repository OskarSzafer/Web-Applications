export default class Filter {
    constructor(onFilter) {
      this.onFilter = onFilter;
    }
  
    render() {
      const select = document.createElement('select');
      ['Unknown', 'Advanced', 'Moderate', 'Beginner', 'OrdinaryWizardingLevel', 'OneOfAKind'].forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        select.appendChild(option);
      });
  
      select.addEventListener('change', () => this.onFilter(select.value));
      return select;
    }
  }
  