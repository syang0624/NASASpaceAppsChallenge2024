import React, { useState, useRef } from 'react';
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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // Track if music is playing
  const audioRef = useRef(null); // Reference to the audio element

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

  // Toggle music play/pause
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Audio play failed:', error);
      });
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  // Determine the background class based on the screen
  const backgroundClass = !playerName ? 'name-entry-bg' : 'main-bg';

  return (
    <div className={`App ${backgroundClass}`}>
      {/* Render the appropriate screen */}
      {!playerName ? (
        <NameEntry onSubmitName={handleSubmitName} />
      ) : !isIntroShown ? (
        <GameIntro playerName={playerName} onNext={handleNextFromIntro} />
      ) : !isGameEnded ? (
        <GameRound
          playerName={playerName}
          onContinue={handleContinue}
          onGameEnd={handleGameEnd}
        />
      ) : (
        <FinalResult playerName={playerName} rounds={gameData} />
      )}

      {/* Music control button */}
      <button onClick={toggleMusic} className="music-toggle">
        {isMusicPlaying ? 'Pause Music' : 'Play Music'}
      </button>

      {/* Audio element */}
      <audio ref={audioRef} loop>
        <source
          src="/NASASpaceAppsChallenge2024/audio/testMusic.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
