import React, { useState } from 'react';
import IntroScreen from './pages/IntroScreen';
import PresentScreen from './pages/PresentScreen';
import ChallengeScreen from './pages/ChallengeScreen';
import ResultsScreen from './pages/ResultScreen';
import OutcomeScreen from './pages/OutcomeScreen';

import './styles/App.scss'; // Global styles

const App = () => {
  // State management for the game flow
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [outcomes, setOutcomes] = useState([]);
  const [finalOutcome, setFinalOutcome] = useState('');
  const [userName, setUserName] = useState('Player Name'); // Can be dynamic
  const [datePlayed] = useState(new Date().toLocaleDateString());

  // Sample challenges data
  const challenges = [
    {
      title: 'Rising Sea Levels',
      description:
        'Adjust parameters to mitigate the effects of rising sea levels.',
      parameters: {
        fossilFuel: 50,
        deforestation: 50,
        cattleFarming: 50,
        renewableEnergy: 50,
      },
    },
    {
      title: 'Decreasing Food Production',
      description: 'How will your decisions impact food production?',
      parameters: {
        fossilFuel: 40,
        deforestation: 30,
        cattleFarming: 60,
        renewableEnergy: 50,
      },
    },
    {
      title: 'Extreme Weather Conditions',
      description: 'Try to reduce the likelihood of extreme weather events.',
      parameters: {
        fossilFuel: 30,
        deforestation: 40,
        cattleFarming: 30,
        renewableEnergy: 60,
      },
    },
    {
      title: 'Wildfires',
      description: 'Tackle the causes behind rising wildfire incidents.',
      parameters: {
        fossilFuel: 20,
        deforestation: 70,
        cattleFarming: 50,
        renewableEnergy: 40,
      },
    },
  ];

  const startGame = () => {
    setCurrentScreen('present');
  };

  const proceedToChallenges = () => {
    setCurrentScreen('challenge');
  };

  const proceedToNextChallenge = (outcome) => {
    // Save the outcome from the current challenge
    setOutcomes((prevOutcomes) => [...prevOutcomes, outcome]);

    // Check if there are more challenges to proceed to
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex((prevIndex) => prevIndex + 1);
    } else {
      calculateFinalOutcome();
      setCurrentScreen('final');
    }
  };

  const calculateFinalOutcome = () => {
    // Placeholder logic to calculate the final outcome based on decisions
    const positiveOutcomes = outcomes.filter((outcome) =>
      outcome.includes('Positive')
    ).length;

    if (positiveOutcomes === challenges.length) {
      setFinalOutcome('You excelled and saved the world!');
    } else if (positiveOutcomes >= 2) {
      setFinalOutcome('You avoided disaster narrowly.');
    } else if (positiveOutcomes === 1) {
      setFinalOutcome('You made no significant impact.');
    } else {
      setFinalOutcome('You made the world even worse.');
    }
  };

  return (
    <div className='app'>
      {currentScreen === 'intro' && <IntroScreen onStartGame={startGame} />}

      {currentScreen === 'present' && (
        <PresentScreen onProceedToChallenges={proceedToChallenges} />
      )}

      {currentScreen === 'challenge' && (
        <ChallengeScreen
          challengeData={challenges[challengeIndex]}
          onNextChallenge={() => proceedToNextChallenge('Sample Outcome')}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          outcome={outcomes[challengeIndex]}
          onNextChallenge={proceedToNextChallenge}
        />
      )}

      {currentScreen === 'final' && (
        <OutcomeScreen
          finalOutcome={finalOutcome}
          fullName={userName}
          datePlayed={datePlayed}
        />
      )}
    </div>
  );
};

export default App;
