from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import logging
from emissions_predictor import EmissionsPredictor, load_and_preprocess_data

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(name)

app = FastAPI()

# Initialize the EmissionsPredictor
predictor = EmissionsPredictor()

# Load and preprocess data
file_url = "NASASpaceAppsChallenge2024/data/Models/"
transport_df = load_and_preprocess_data(file_url + 'TransportX2.csv')
electricity_df = load_and_preprocess_data(file_url + 'ElectricityX3.csv')
agriculture_df = load_and_preprocess_data(file_url + 'AgricultureX1.csv')

# Preprocess and train the model
combined_df = predictor.preprocess_data(transport_df, electricity_df, agriculture_df)
metrics = predictor.train(combined_df)

class PredictionRequest(BaseModel):
    state: str
    year: int
    trees: int
    miles: float
    electricity: float

class PredictionResponse(BaseModel):
    predicted_emissions: float

@app.post("/predict", response_model=PredictionResponse)
async def predict_emissions(request: PredictionRequest):
    try:
        prediction = predictor.predict_emissions(
            request.state,
            request.year,
            request.trees,
            request.miles,
            request.electricity
        )
        return PredictionResponse(predicted_emissions=prediction)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/state_max/{state}")
async def get_state_max(state: str):
    max_emissions = predictor.get_state_max(state)
    if max_emissions is None:
        raise HTTPException(status_code=404, detail=f"No data found for state: {state}")
    return {"state": state, "max_emissions": max_emissions}

@app.get("/model_accuracy")
async def get_model_accuracy():
    accuracy = predictor.get_model_accuracy()
    if accuracy is None:
        raise HTTPException(status_code=500, detail="Model accuracy not available")
    return accuracy

if name == "main":
    uvicorn.run(app, host="0.0.0.0", port=8000)