import React from 'react';
import jsPDF from 'jspdf';

function FinalResult({ playerName, rounds }) {
  const finalRound = rounds[rounds.length - 1]; // The final round data

  // Handle undefined or missing finalRound data
  const calculateOutcome = () => {
    if (!finalRound) {
      return {
        finalGhg: 'N/A',
        certificateLevel: 'None',
        story: 'No data available',
      };
    }

    const finalGhg = finalRound.ghgValue;
    const certificateLevel = finalRound.certificateLevel || 'None'; // Ensure this uses certificateLevel from backend

    return {
      finalGhg,
      certificateLevel,
      story: finalRound.story || 'No story available',
    };
  };

  const handleDownloadCertificate = () => {
    const doc = new jsPDF();
    const { finalGhg, certificateLevel, story } = calculateOutcome();

    doc.setFontSize(16);
    doc.text(20, 20, 'Certificate of Achievement');
    doc.text(20, 30, `This is to certify that ${playerName}`);
    doc.text(
      20,
      40,
      'has successfully completed the climate decision-making game.'
    );
    doc.text(20, 50, `Outcome: ${story}`);
    doc.text(20, 60, `Final GHG (2024): ${finalGhg}`);
    doc.text(20, 70, `Certificate Level: ${certificateLevel}`);

    doc.save(`${playerName}_certificate.pdf`);
  };

  const { finalGhg, certificateLevel } = calculateOutcome();

  return (
    <div className='final-result'>
      <h1>Congratulations, {playerName}!</h1>
      <p>Your decisions have led to the following outcome:</p>
      <p>
        <strong>Final GHG (2024): {finalGhg}</strong>
      </p>
      <p>
        <strong>Certificate Level: {certificateLevel}</strong>{' '}
        {/* Correctly show the certificate level */}
      </p>
      <button onClick={handleDownloadCertificate}>Download Certificate</button>
    </div>
  );
}

export default FinalResult;
