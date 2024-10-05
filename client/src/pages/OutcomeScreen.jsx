import FinalScreen from '../components/FinalScreen'; // Reuse FinalScreen component
// import './OutcomeScreen.css';

const OutcomeScreen = ({ finalOutcome, fullName, datePlayed }) => {
  return (
    <div className='outcome-screen'>
      <FinalScreen
        finalOutcome={finalOutcome}
        fullName={fullName}
        datePlayed={datePlayed}
      />
    </div>
  );
};

export default OutcomeScreen;
