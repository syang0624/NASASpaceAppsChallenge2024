import { useState } from 'react';
import jsPDF from 'jspdf';
// import './FinalScreen.css'; // Assuming you have a CSS file for styling

const FinalScreen = ({ finalOutcome, fullName, datePlayed }) => {
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const generateCertificate = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Climate Change Simulation Certificate', 20, 20);
    doc.setFontSize(14);
    doc.text(`Awarded to: ${fullName}`, 20, 40);
    doc.text(`Date: ${datePlayed}`, 20, 60);
    doc.text(`Result: ${finalOutcome}`, 20, 80);

    doc.save('certificate.pdf');
    setCertificateGenerated(true);
  };

  return (
    <div className='final-screen'>
      <h1>80-Year Outcome</h1>
      <p>Based on your decisions, here’s how the world has evolved by 2080.</p>
      <div className='outcome-summary'>
        <h2>{finalOutcome}</h2>
        <p>
          {finalOutcome === 'You excelled and saved the world!'
            ? 'Your decisions led to a sustainable future, reversing the effects of climate change.'
            : finalOutcome === 'You avoided disaster narrowly.'
              ? 'Although you avoided complete collapse, the world still faces severe challenges due to climate change.'
              : finalOutcome === 'You made no significant impact.'
                ? 'The world did not improve significantly. Climate change effects continue to worsen slowly.'
                : finalOutcome === 'You made the world even worse.'
                  ? 'Your decisions accelerated the destruction of the environment, making the world uninhabitable for future generations.'
                  : 'Unknown outcome'}
        </p>
      </div>
      <div className='certificate-section'>
        <h3>Download Your Certificate</h3>
        <p>
          Based on your performance, you can download a certificate with your
          name and the result of the game.
        </p>
        <button onClick={generateCertificate} className='generate-button'>
          Generate Certificate
        </button>
        {certificateGenerated && (
          <p className='certificate-confirmation'>
            Certificate generated and downloaded!
          </p>
        )}
      </div>
    </div>
  );
};

export default FinalScreen;
