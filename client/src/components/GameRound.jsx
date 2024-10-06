import { useState, useEffect } from 'react';

function GameRound({ playerName, onContinue, onGameEnd }) {
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [x3, setX3] = useState(10000);
  const [ghgData, setGhgData] = useState(null); // GHG data from backend
  const [year, setYear] = useState(null); // Start year (from /initial)
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // For error handling
  const [story, setStory] = useState(''); // Store LLM story

  // const BASE_URL = import.meta.env.VITE_BASE_URL;
  // const BASE_URL =
  //   'https://cors-anywhere.herokuapp.com/http://101.101.218.177:8000/ghg';

  const BASE_URL =
    window.location.protocol === 'https:'
      ? 'https://101.101.218.177:8000/ghg'
      : 'http://101.101.218.177:8000/ghg';

  // console.log('BASE_URL:', BASE_URL); // Debug the URL to ensure it's correct

  // Now, use the BASE_URL for making API requests:
  fetch(`${BASE_URL}/initial`)
    .then(response => response.json())
    .then(data => {
      // console.log('Fetched data:', data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  const finalYear = 2020; // The game should end after 2020

  // Fetch initial data (year 2000 and initial GHG value)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/initial`);
        if (response.ok) {
          const data = await response.json();
          setYear(data.year);
          setGhgData(data.GHG); // Set initial GHG
          setLoading(false); // Stop loading once data is fetched
        } else {
          setError('Failed to load initial data.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Error loading initial data.');
        setLoading(false); // Stop loading in case of error
      }
    };
    fetchInitialData();
  }, []);

  // Send x1, x2, x3 values to backend for GHG calculation
  const sendValuesToBackend = async (x1, x2, x3, year) => {
    try {
      const response = await fetch(`${BASE_URL}/input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x_1: x1,
          x_2: x2,
          x_3: x3,
          year: year,
        }),
      });

      if (response.ok) {
        console.log('Data processed successfully');
        return true;
      } else {
        console.error('Failed to send input data');
        return false;
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      setError('Failed to send data');
      return false;
    }
  };

  // Retrieve GHG output from backend
  const getGhgOutput = async () => {
    try {
      const response = await fetch(`${BASE_URL}/output`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data; // { GHG, story, year, certificate_level }
      } else {
        console.error('Failed to retrieve GHG output');
        setError('Failed to retrieve GHG output');
        return null;
      }
    } catch (error) {
      console.error('Error fetching GHG output:', error);
      setError('Error retrieving GHG output');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Step 1: Send x1, x2, x3, and year to the backend
    const isDataSent = await sendValuesToBackend(x1, x2, x3, year);

    if (isDataSent) {
      // Step 2: Retrieve GHG output from the backend
      const ghgOutput = await getGhgOutput();
      if (ghgOutput) {
        setGhgData(ghgOutput.GHG); // Set the updated GHG value
        setStory(ghgOutput.story); // Set the story to display on every stage

        // Step 3: Check if it's the final year (2020)
        if (year === finalYear) {
          // End the game after 2020 and show certificate
          setLoading(false); // Stop loading
          onGameEnd({
            x1,
            x2,
            x3,
            ghgValue: ghgOutput.GHG,
            certificateLevel: ghgOutput.certificate_level, // Use for the certificate
            story: ghgOutput.story, // Pass the final story
          });
        } else {
          // Continue to the next stage if it's before 2020
          const nextYear = year + 5;
          setYear(nextYear); // Progress by 5 years
          setLoading(false); // Stop loading once data is fetched
          onContinue({
            x1,
            x2,
            x3,
            ghgValue: ghgOutput.GHG,
            certificateLevel: ghgOutput.certificate_level, // Not used until 2020+
            story: ghgOutput.story, // Story now displayed on every stage
          });
        }
      } else {
        setLoading(false); // Stop loading if there's an error
        setError('Failed to load GHG data');
      }
    } else {
      setLoading(false); // Stop loading if sending data fails
      setError('Failed to send data');
    }
  };

  return (
    <div className="game-round">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>It's currently {year}</h1>
          <p>
            {ghgData
              ? `Green House Gas Emissions (GHG): ${ghgData}`
              : 'No data available'}
          </p>
          <p>{story}</p> {/* Display the story on every stage */}
          <div className="sliders">
            For the next 5 years:
            <div>
              <label>Numbers of Trees planted: {x1}</label>
              <input
                type="range"
                min="0"
                max="1000000"
                value={x1}
                onChange={e => setX1(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Flight Miles Traveled: {x2}</label>
              <input
                type="range"
                min="0"
                max="50000"
                value={x2}
                onChange={e => setX2(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Enegry Consumption (kW): {x3}</label>
              <input
                type="range"
                min="10000"
                max="100000"
                value={x3}
                onChange={e => setX3(Number(e.target.value))}
              />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
          {error && <p className="error">Error: {error}</p>}
        </>
      )}
    </div>
  );
}

export default GameRound;
