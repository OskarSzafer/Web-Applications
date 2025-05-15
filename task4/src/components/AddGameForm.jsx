import React, { useState } from "react";

function AddGameForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", description: "", image: "", rating: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.image) return;
    onAdd(form);
    setForm({ name: "", description: "", image: "", rating: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Game name" value={form.name} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
      <button type="submit">Add Game</button>
    </form>
  );
}

export default AddGameForm;
