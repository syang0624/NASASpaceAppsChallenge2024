import Challenge from '../components/Challenge'; // Reuse the Challenge component
// import './ChallengeScreen.css';

const ChallengeScreen = ({ challengeData, onNextChallenge }) => {
  return (
    <div className='challenge-screen'>
      <Challenge
        challengeTitle={challengeData.title}
        challengeDescription={challengeData.description}
        initialParameters={challengeData.parameters}
        onNextChallenge={onNextChallenge}
      />
    </div>
  );
};

export default ChallengeScreen;
