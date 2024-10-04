import React from 'react';
import Dashboard from '../components/Dashboard'; // Reuse Dashboard component
// import './PresentScreen.css';

const PresentScreen = ({ onProceedToChallenges }) => {
  return (
    <div className='present-screen'>
      <h1>Welcome Back to 2024</h1>
      <p>
        You’ve traveled back in time. The choices you make today will shape the
        future of the planet. Here’s the current state of the world.
      </p>
      <Dashboard />
      <button onClick={onProceedToChallenges} className='proceed-button'>
        Proceed to Challenges
      </button>
    </div>
  );
};

export default PresentScreen;
