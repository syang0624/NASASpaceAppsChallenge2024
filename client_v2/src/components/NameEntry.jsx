import { useState } from 'react';

function NameEntry({ onSubmitName }) {
  const [name, setName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (name.trim()) {
      onSubmitName(name.trim()); // Pass the name to parent component
    } else {
      alert('Please enter your name.');
    }
  };

  return (
    <div className="name-entry">
      <h1>Enter your name</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
}

export default NameEntry;
