from flask import Flask, request, jsonify
from models import EmissionsPredictor
from models import load_and_preprocess_data

# Initialize Flask app
app = Flask(__name__)

# Create an instance of the EmissionsPredictor (make sure to load data and train the model)
predictor = EmissionsPredictor()
file_url = "NASASpaceAppsChallenge2024/data/Models/"

# Load datasets and preprocess
transport_df = load_and_preprocess_data(file_url+'TransportX2.csv') #NASASpaceAppsChallenge2024/data/Models/TransportX2.csv
electricity_df = load_and_preprocess_data(file_url+'ElectricityX3.csv')
agriculture_df = load_and_preprocess_data(file_url+'AgricultureX1.csv')
combined_df = predictor.preprocess_data(transport_df, electricity_df, agriculture_df)

# Train the model
predictor.train(combined_df)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    state = data.get('state')
    year = data.get('year')
    trees = data.get('trees', 0)
    miles = data.get('miles', 0)
    electricity = data.get('electricity', 0)
    
    try:
        prediction = predictor.predict_emissions(state, year, trees, miles, electricity)
        state_max = predictor.get_state_max(state)
        
        if state_max is None:
            return jsonify({'error': 'No historical data for the state'}), 400

        response = {
            'total_emissions': prediction,
            'state_max': state_max,
            'percentage_of_max': (prediction / state_max * 100) if state_max > 0 else 0
        }

        return jsonify(response)

    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@app.route('/state_max', methods=['GET'])
def state_maximum():
    state = request.args.get('state')
    if not state:
        return jsonify({'error': 'State parameter is required'}), 400
    
    max_value = predictor.get_state_max(state)
    if max_value is None:
        return jsonify({'error': f'No data for state: {state}'}), 404

    return jsonify({'state_max': max_value})


@app.route('/model_accuracy', methods=['GET'])
def model_accuracy():
    accuracy_metrics = predictor.get_model_accuracy()
    if accuracy_metrics is None:
        return jsonify({'error': 'Model has not been trained yet'}), 500

    return jsonify(accuracy_metrics)


if __name__ == '__main__':
    app.run(debug=True)
