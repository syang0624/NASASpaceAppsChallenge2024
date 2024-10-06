import { useState } from 'react';

function GameStart() {
  const [name, setName] = useState(''); // To capture user input
  const [startGame, setStartGame] = useState(false); // To handle screen transition

  const handleInputChange = (e) => {
    setName(e.target.value); // Update name as user types
  };

  const handleStartClick = () => {
    if (name) {
      setStartGame(true); // Only start if a name is entered
    } else {
      alert('Please enter your character name.');
    }
  };

  return (
    <div>
      {!startGame ? (
        <div className='input-screen'>
          <h3>Enter your name</h3>
          <input
            type='text'
            placeholder='Type here...'
            value={name}
            onChange={handleInputChange}
          />
          <button onClick={handleStartClick}>Start</button>
        </div>
      ) : (
        <div className='game-screen'>
          <h1>2080</h1>
          <p>
            Hello, {name}, and welcome to the year 2080. The world is very
            different now. The air is hard to breathe, and the sky is always
            gray. Cities by the ocean are underwater, and many animals we once
            knew are gone. Wildfires, floods, and storms happen all the time,
            making it difficult to live in many places.
          </p>
          <button>Game Start</button>
        </div>
      )}
    </div>
  );
}

export default GameStart;
