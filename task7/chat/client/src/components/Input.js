// components/Input.js
import React, { useState } from "react";

export default function Input({ send, buttonText = 'Send' }) {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      send(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={handleChange} required />
      <input type="submit" value={buttonText} />
    </form>
  );
}
