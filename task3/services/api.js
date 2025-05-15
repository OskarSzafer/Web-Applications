export async function fetchElixirs() {
    try {
      const res = await fetch('https://wizard-world-api.herokuapp.com/Elixirs');
      if (!res.ok) throw new Error('Failed to fetch elixirs');
      return await res.json();
    } catch (err) {
      throw err;
    }
  }