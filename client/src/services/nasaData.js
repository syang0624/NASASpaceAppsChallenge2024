// src/services/nasaData.js

// Mock function that simulates fetching NASA data
export const fetchNasaData = async () => {
  return {
    co2: 414.72, // Mock CO2 levels in ppm
    seaLevel: 3.3, // Mock sea level rise in mm/year
    temperature: 1.1, // Mock global temperature rise in °C
    deforestationRate: 10000, // Mock deforestation rate in hectares/year
  };
};
