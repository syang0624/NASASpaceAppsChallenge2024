import requests

base_url = "http://localhost:58000/ghg"

for year in range(2000, 2025, 5):
    post_data = {
        "x_1": 10,
        "x_2": 20,
        "x_3": 30,
        "year": year
    }
    post_response = requests.post(f"{base_url}/input", json=post_data)
    print(f"Year {year} POST Response:", post_response.json())

    # GET 요청
    get_response = requests.get(f"{base_url}/output")
    print(f"Year {year} GET Response:", get_response.json())
    print("---")