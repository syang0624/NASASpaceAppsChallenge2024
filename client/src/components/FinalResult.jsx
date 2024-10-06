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

    // Certificate Title - Centered
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificate of Achievement', 105, 30, { align: 'center' });

    // Subtitle and player name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(`This is to certify that ${playerName}`, 105, 45, {
      align: 'center',
    });
    doc.text(
      'has successfully completed the climate decision-making game.',
      105,
      55,
      { align: 'center' },
    );

    // Outcome and Details - Wrap the text to prevent overflow
    doc.setFontSize(14);
    const wrappedStory = doc.splitTextToSize(story, 170); // Wrap the story text
    doc.text('Outcome:', 20, 70);
    doc.text(wrappedStory, 20, 80); // Start text below the label

    // Increase space after the story to avoid overlap
    const storyEndY = 80 + wrappedStory.length * 7; // Adjusting Y position based on story length

    // Add the Final GHG and Certificate Level
    doc.text(`Final GHG (2024): ${finalGhg}`, 20, storyEndY + 10);
    doc.text(`Certificate Level: ${certificateLevel}`, 20, storyEndY + 20);

    // Footer Text - Centered
    doc.setFontSize(12);
    doc.text(
      'Awarded by Team SBN @ NASA Space Apps Challenge, 2024.',
      105,
      storyEndY + 40,
      { align: 'center' },
    );

    // Draw a border around the page for styling
    doc.setDrawColor(0); // Black border
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 270); // Rectangle border around the page

    // Save the PDF with the player's name
    doc.save(`${playerName}_certificate.pdf`);
  };

  const { finalGhg, certificateLevel } = calculateOutcome();

  return (
    <div className="final-result">
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
