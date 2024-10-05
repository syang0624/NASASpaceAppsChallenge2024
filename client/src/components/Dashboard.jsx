import { useEffect, useState } from 'react';
import { fetchNasaData } from '../services/nasaData'; // Now uses mock data

const Dashboard = () => {
  const [nasaData, setNasaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchNasaData(); // Now fetches mock data
        setNasaData(data);
      } catch (error) {
        console.error('Error fetching NASA data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading NASA Data...</div>;
  }

  return (
    <div>
      <h1>NASA Data (Mock)</h1>
      <ul>
        <li>CO2 Levels: {nasaData.co2} ppm</li>
        <li>Sea Levels: {nasaData.seaLevel} mm/year</li>
        <li>Global Temperature: {nasaData.temperature} °C</li>
        <li>Deforestation Rate: {nasaData.deforestationRate} hectares/year</li>
      </ul>
    </div>
  );
};

export default Dashboard;
