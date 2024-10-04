import React from 'react';
// import './ResultsScreen.css'; // Add styling for results

const ResultScreen = ({ outcome, onNextChallenge }) => {
  return (
    <div className='results-screen'>
      <h1>Challenge Outcome</h1>
      <p>{outcome}</p>
      <button onClick={onNextChallenge} className='next-challenge-button'>
        Proceed to Next Challenge
      </button>
    </div>
  );
};

export default ResultScreen;
