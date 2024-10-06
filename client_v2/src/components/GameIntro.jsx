function GameIntro({ playerName, onNext }) {
  return (
    <div className="game-intro">
      <h1>Welcome to the Year 2024</h1>
      <p>
        Hello, <strong>{playerName}</strong>, and welcome to the year 2024. The
        world has reached a tipping point. Climate change has led to more
        frequent extreme weather, rising sea levels, and shrinking natural
        resources. Many species are at risk of disappearing, people are
        struggling, and the damage done over the past decades has left us on
        unstable ground.
      </p>
      <p>
        However, you have a unique opportunity to make a difference. You will
        travel back to the year 2000 and face critical choices that will affect
        the world’s future. With each decision, you will determine whether the
        world improves or worsens as you progress through time. Your mission is
        to navigate these difficult choices and see if you can steer the world
        toward a safer future.
      </p>
      <button onClick={onNext}>Next</button>
    </div>
  );
}

export default GameIntro;
