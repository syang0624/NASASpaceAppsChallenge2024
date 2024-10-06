import React, { useState } from 'react';
import GameRound from './components/GameRound';
import FinalResult from './components/FinalResult';
import NameEntry from './components/NameEntry';
import GameIntro from './components/GameIntro';
import './index.scss'; // Import global styles

function App() {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameData, setGameData] = useState([]); // Store all the game rounds data
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [playerName, setPlayerName] = useState(''); // Store player name
  const [isIntroShown, setIsIntroShown] = useState(false); // Track if intro has been shown

  const handleContinue = roundData => {
    setGameData([...gameData, roundData]);
    setCurrentRound(prevRound => prevRound + 1);
  };

  const handleGameEnd = finalData => {
    setGameData([...gameData, finalData]); // Store final round data
    setIsGameEnded(true); // Mark the game as ended
  };

  const handleSubmitName = name => {
    setPlayerName(name); // Set player name when they submit it
  };

  const handleNextFromIntro = () => {
    setIsIntroShown(true); // Move to game rounds after the intro screen
  };

  // Determine the background class based on the screen
  const backgroundClass = !playerName ? 'name-entry-bg' : 'main-bg';

  return (
    <div className={`App ${backgroundClass}`}>
      {!playerName ? (
        <NameEntry onSubmitName={handleSubmitName} />
      ) : !isIntroShown ? (
        <GameIntro playerName={playerName} onNext={handleNextFromIntro} />
      ) : !isGameEnded ? (
        <GameRound
          playerName={playerName} // Pass player name to GameRound
          onContinue={handleContinue}
          onGameEnd={handleGameEnd} // Trigger end of game when 2020 is reached
        />
      ) : (
        <FinalResult playerName={playerName} rounds={gameData} />
      )}
    </div>
  );
}

export default App;
