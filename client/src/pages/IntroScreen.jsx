// import './IntroScreen.css'; // Add relevant styles

const IntroScreen = ({ onStartGame }) => {
  return (
    <div className='intro-screen'>
      <h1>The Year is 2080</h1>
      <p>
        Climate change has devastated the planet. The world is on the brink of
        collapse due to decades of unsustainable practices.
      </p>
      <p>But what if you could change the past?</p>
      <button onClick={onStartGame} className='start-button'>
        Start the Game
      </button>
    </div>
  );
};

export default IntroScreen;
