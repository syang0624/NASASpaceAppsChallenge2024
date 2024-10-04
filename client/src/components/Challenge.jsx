// src/components/Challenge.jsx

import React, { useState } from 'react';
import { saveUserDecision } from '../services/gameLogic'; // Ensure correct import path

const Challenge = ({
  challengeTitle,
  challengeDescription,
  initialParameters,
  onNextChallenge,
}) => {
  const [parameters, setParameters] = useState(initialParameters);
  const [outcome, setOutcome] = useState(null);

  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    setParameters((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const calculateOutcome = () => {
    const impact = parameters.fossilFuel * 0.3 + parameters.deforestation * 0.2;
    const renewableBonus = parameters.renewableEnergy * 0.4;
    const result = impact - renewableBonus;

    if (result > 50) {
      return 'Negative Outcome: The situation has worsened.';
    } else if (result > 20) {
      return 'Moderate Outcome: Some improvement, but issues persist.';
    } else {
      return 'Positive Outcome: Significant improvement in the climate situation!';
    }
  };

  const handleLockInDecision = async () => {
    const calculatedOutcome = calculateOutcome();
    setOutcome(calculatedOutcome);

    // Save decision using mock function
    try {
      await saveUserDecision('someUserId', {
        challenge: challengeTitle,
        parameters,
        outcome: calculatedOutcome,
      });
      console.log('Decision saved successfully');
    } catch (error) {
      console.error('Error saving decision:', error);
    }

    // Optionally move to the next challenge
    if (onNextChallenge) {
      onNextChallenge();
    }
  };

  return (
    <div className='challenge'>
      <h2>{challengeTitle}</h2>
      <p>{challengeDescription}</p>
      <div className='parameters'>
        <h3>Adjust Parameters</h3>
        <label>
          Fossil Fuel Usage:
          <input
            type='range'
            name='fossilFuel'
            value={parameters.fossilFuel}
            onChange={handleParameterChange}
            min='0'
            max='100'
          />
        </label>
        <label>
          Deforestation Rate:
          <input
            type='range'
            name='deforestation'
            value={parameters.deforestation}
            onChange={handleParameterChange}
            min='0'
            max='100'
          />
        </label>
        <label>
          Cattle Farming:
          <input
            type='range'
            name='cattleFarming'
            value={parameters.cattleFarming}
            onChange={handleParameterChange}
            min='0'
            max='100'
          />
        </label>
        <label>
          Renewable Energy:
          <input
            type='range'
            name='renewableEnergy'
            value={parameters.renewableEnergy}
            onChange={handleParameterChange}
            min='0'
            max='100'
          />
        </label>
      </div>
      <button onClick={handleLockInDecision} className='lock-button'>
        Lock In Decision
      </button>

      {outcome && (
        <div className='outcome'>
          <h3>Outcome:</h3>
          <p>{outcome}</p>
        </div>
      )}
    </div>
  );
};

export default Challenge;
