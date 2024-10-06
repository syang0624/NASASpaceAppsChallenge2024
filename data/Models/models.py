import pandas as pd
import numpy as np
import json
import logging
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_percentage_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
file_url = "NASASpaceAppsChallenge2024/data/Models/"

def load_and_preprocess_data(file_path):
    try:
        df = pd.read_csv(file_path)
        if df.empty:
            raise ValueError(f"Empty dataset: {file_path}")
            
        df_melted = df.melt(id_vars=['geo_ref'], var_name='year', value_name='emissions')
        df_melted['year'] = df_melted['year'].str.replace('Y', '').astype(int)
        
        if df_melted['emissions'].isnull().any():
            logger.warning(f"Missing values found in {file_path}")
            df_melted = df_melted.dropna()
            
        logger.info(f"Loaded {file_path}: {df_melted.shape} records")
        return df_melted
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise
    except Exception as e:
        logger.error(f"Error processing {file_path}: {str(e)}")
        raise

class EmissionsPredictor:
    def __init__(self, n_steps=5):
        self.n_steps = n_steps
        self.scalers = {
            'transport': MinMaxScaler(),
            'electricity': MinMaxScaler(),
            'agriculture': MinMaxScaler(),
            'total': MinMaxScaler()
        }
        self.model = None
        self.state_max = None
        self.combined_df = None

    def preprocess_data(self, transport_df, electricity_df, agriculture_df):
        logger.info(f"Initial shapes - Transport: {transport_df.shape}, "
                   f"Electricity: {electricity_df.shape}, "
                   f"Agriculture: {agriculture_df.shape}")

        # Merge datasets
        combined_df = pd.merge(
            transport_df, 
            electricity_df, 
            on=['geo_ref', 'year'], 
            suffixes=('_transport', '_electricity')
        )
        
        combined_df = pd.merge(
            combined_df, 
            agriculture_df, 
            on=['geo_ref', 'year']
        )

        logger.info(f"Combined shape before sorting: {combined_df.shape}")
        
        # Sort the data
        combined_df = combined_df.sort_values(['geo_ref', 'year'])
        
        # Create numpy arrays for scaling
        transport_values = combined_df['emissions_transport'].values.reshape(-1, 1)
        electricity_values = combined_df['emissions_electricity'].values.reshape(-1, 1)
        agriculture_values = combined_df['emissions'].values.reshape(-1, 1)

        # Scale the values
        combined_df['emissions_transport'] = self.scalers['transport'].fit_transform(transport_values)
        combined_df['emissions_electricity'] = self.scalers['electricity'].fit_transform(electricity_values)
        combined_df['emissions'] = self.scalers['agriculture'].fit_transform(agriculture_values)

        # Calculate total emissions
        combined_df['total_emissions'] = (
            combined_df['emissions_transport'] + 
            combined_df['emissions_electricity'] + 
            combined_df['emissions']
        )
        
        # Scale total emissions
        combined_df['total_emissions'] = self.scalers['total'].fit_transform(
            combined_df[['total_emissions']]
        )
        
        self.state_max = combined_df.groupby('geo_ref')['total_emissions'].max().to_dict()
        self.combined_df = combined_df
        
        logger.info(f"Final combined shape: {combined_df.shape}")
        return combined_df

    def prepare_sequences(self, data):
        sequences = []
        targets = []
        
        # Group by geo_ref to maintain temporal consistency
        for _, group in data.groupby('geo_ref'):
            group_values = group['total_emissions'].values
            
            for i in range(len(group_values) - self.n_steps):
                sequences.append(group_values[i:(i + self.n_steps)])
                targets.append(group_values[i + self.n_steps])
        
        return np.array(sequences), np.array(targets)

    def build_model(self):
        model = Sequential([
            LSTM(32, activation='relu', input_shape=(self.n_steps, 1), return_sequences=True),
            Dropout(0.2),
            LSTM(16, activation='relu'),
            Dropout(0.2),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
        return model

    def train(self, combined_df):
        logger.info("Preparing sequences for training...")
        X, y = self.prepare_sequences(combined_df)
        
        logger.info(f"Sequence shape: {X.shape}, Target shape: {y.shape}")
        
        # Reshape X for LSTM [samples, timesteps, features]
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        logger.info("Training model...")
        self.model = self.build_model()
        self.model.fit(
            X_train, y_train,
            epochs=100,
            batch_size=32,
            validation_split=0.2,
            verbose=0
        )
        
        return self.evaluate(X_test, y_test)

    def evaluate(self, X_test, y_test):
        # Ensure that X_test has the correct shape for the LSTM model
        if len(X_test.shape) == 2:
            # Reshape X_test to (batch_size, timesteps, features)
            X_test = X_test.reshape((X_test.shape[0], self.n_steps, 1))

        # Make predictions using the model
        y_pred = self.model.predict(X_test)

        # Inverse transform to obtain original scale values
        y_test_unscaled = self.scalers['total'].inverse_transform(y_test.reshape(-1, 1)).flatten()
        y_pred_unscaled = self.scalers['total'].inverse_transform(y_pred.reshape(-1, 1)).flatten()

        # Save visualization data
        try:
            viz_data = [{'true': float(true), 'predicted': float(pred)} for true, pred in zip(y_test_unscaled, y_pred_unscaled)]
            with open(file_url+'prediction_viz_data.json', 'w') as f:
                json.dump(viz_data, f)
            logger.info("Successfully saved visualization data")
        except Exception as e:
            logger.error(f"Error saving visualization data: {str(e)}")

        # Calculate evaluation metrics
        metrics = {
            'mse': float(mean_squared_error(y_test_unscaled, y_pred_unscaled)),
            'r2': float(r2_score(y_test_unscaled, y_pred_unscaled)),
            'mape': float(mean_absolute_percentage_error(y_test_unscaled, y_pred_unscaled)) * 100,
            'mean_true': float(np.mean(y_test_unscaled)),
            'mean_pred': float(np.mean(y_pred_unscaled)),
            'std_true': float(np.std(y_test_unscaled)),
            'std_pred': float(np.std(y_pred_unscaled)),
        }

        return metrics


    def predict_emissions(self, state, year, trees, miles, electricity):
        if not self.model or self.combined_df is None:
            raise ValueError("Model not trained or no data available")
        
        # Get the data for the specified state
        state_data = self.combined_df[self.combined_df['geo_ref'] == state]

        if len(state_data) < self.n_steps:
            raise ValueError(f"Insufficient historical data for {state}")

        # Get the last `n_steps` emissions for the state
        last_sequence = state_data['total_emissions'].values[-self.n_steps:]

        # Apply modifications based on user inputs
        impact_factor = 0.001
        decision_impact = (
            (miles * impact_factor) + 
            (electricity * impact_factor) - 
            (trees * impact_factor * 0.1)
        )

        # Add the impact to the last value in the sequence
        modified_sequence = last_sequence.copy()
        modified_sequence[-1] += decision_impact

        # Reshape the input to have the correct shape for LSTM (batch_size, timesteps, features)
        prediction_sequence = modified_sequence.reshape((1, self.n_steps, 1))

        # Make prediction and inverse transform
        prediction = self.model.predict(prediction_sequence)
        unscaled_prediction = self.scalers['total'].inverse_transform(prediction)[0][0]



        return unscaled_prediction
    
    # Method to return maximum emissions for a state
    def get_state_max(self, state):
        if self.state_max and state in self.state_max:
            return self.state_max[state]
        else:
            return None

    # Method to return model accuracy metrics
    def get_model_accuracy(self):
        if self.combined_df is None:
            return None

        # Use the trained model to predict and return evaluation metrics
        X, y = self.prepare_sequences(self.combined_df)
        X_reshaped = X.reshape((X.shape[0], self.n_steps, 1))
        y_pred = self.model.predict(X_reshaped)
        y_pred_unscaled = self.scalers['total'].inverse_transform(y_pred)
        y_test_unscaled = self.scalers['total'].inverse_transform(y.reshape(-1, 1))

        metrics = self.evaluate(X_reshaped, y_test_unscaled)
        return metrics

# Plotting functions
import matplotlib.pyplot as plt

def plot_actual_vs_predicted(y_true, y_pred):
    plt.figure(figsize=(12, 6))
    plt.scatter(y_true, y_pred, color='blue', label='Predicted vs Actual')
    plt.plot([min(y_true), max(y_true)], [min(y_true), max(y_true)], color='red', linestyle='--', label='Perfect Prediction Line')
    plt.xlabel('Actual Emissions (MMT CO2)')
    plt.ylabel('Predicted Emissions (MMT CO2)')
    plt.title('Actual vs Predicted Emissions')
    plt.legend()
    plt.savefig(file_url+'metric_plots/actual_vs_predicted.png')
    plt.close()

def plot_time_series(y_true, y_pred):
    plt.figure(figsize=(14, 6))
    plt.plot(y_true, label='Actual Emissions', color='blue', linestyle='-', marker='o')
    plt.plot(y_pred, label='Predicted Emissions', color='orange', linestyle='--', marker='x')
    plt.xlabel('Sample Index')
    plt.ylabel('Emissions (MMT CO2)')
    plt.title('Time Series of Actual vs Predicted Emissions')
    plt.legend()
    plt.savefig(file_url+'metric_plots/time_series_comparison.png')
    plt.close()


if __name__ == "__main__":
    predictor = EmissionsPredictor()
    try:
        logger.info("Loading datasets...")
        transport_df = load_and_preprocess_data(file_url+'TransportX2.csv') #file_url + 
        electricity_df = load_and_preprocess_data(file_url+'ElectricityX3.csv')
        agriculture_df = load_and_preprocess_data(file_url+'AgricultureX1.csv')
        
        logger.info("Preprocessing data...")
        combined_df = predictor.preprocess_data(transport_df, electricity_df, agriculture_df)
        
        logger.info("Training model...")
        metrics = predictor.train(combined_df)
        
        logger.info("Model metrics:")
        logger.info(f"  MSE: {metrics['mse']:.4f}")
        logger.info(f"  R²: {metrics['r2']:.4f}")
        logger.info(f"  MAPE: {metrics['mape']:.2f}%")
        logger.info(f"  Mean true value: {metrics['mean_true']:.2f}")
        logger.info(f"  Mean predicted value: {metrics['mean_pred']:.2f}")
        logger.info(f"  Std true value: {metrics['std_true']:.2f}")
        logger.info(f"  Std predicted value: {metrics['std_pred']:.2f}")
        
        prediction = predictor.predict_emissions('CA', 2022, 5000, 10000, 5000)
        logger.info(f"Predicted emissions: {prediction:.2f}")
        
        # Load predictions from the model to plot
        X, y = predictor.prepare_sequences(combined_df)
        X_reshaped = X.reshape((X.shape[0], predictor.n_steps, 1))
        y_pred = predictor.model.predict(X_reshaped)
        #y_pred_unscaled = predictor.scalers['total'].inverse_transform(y_pred.reshape(-1, 1))
        #y_test_unscaled = predictor.scalers['total'].inverse_transform(y.reshape(-1, 1))


        #Plotting the results
        plot_actual_vs_predicted(y, y_pred)
        plot_time_series(y, y_pred)



    except Exception as e:
        logger.error(f"Error in prediction pipeline: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())