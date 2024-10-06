# GHG Calculation API Documentation - 241005.2019.dummy

## Base URL

`http://localhost:58000/ghg`

## Endpoints

### 1. Input GHG Data

**Endpoint:** `/input`
**Method:** POST
**Description:** Receives input data for GHG calculation.

#### Request Body

```json
{
  "x_1": float,
  "x_2": float,
  "x_3": float,
  "year": int
}
```

#### Parameters

- `x_1` (float): First input parameter for GHG calculation
- `x_2` (float): Second input parameter for GHG calculation
- `x_3` (float): Third input parameter for GHG calculation
- `year` (int): Year for which the GHG is being calculated

#### Response

```json
{
  "message": "Data processed successfully"
}
```

#### Status Codes

- 200: Successful operation
- 422: Validation error (invalid input data)

### 2. Get GHG Output

**Endpoint:** `/output`
**Method:** GET
**Description:** Retrieves the calculated GHG data and certificate level (if applicable).

#### Response

```json
{
  "GHG": float,
  "story": string,
  "year": int,
  "certificate_level": string | null
}
```

#### Response Fields

- `GHG` (float): Calculated GHG value
- `story` (string): A brief description of the GHG calculation
- `year` (int): Year for which the GHG was calculated
- `certificate_level` (string | null): Certificate level based on GHG value (only for years after 2020)

#### Status Codes

- 200: Successful operation
- 404: No data available

## Usage Example

1. Send input data:

```bash
curl -X 'POST' \
  'http://localhost:8000/ghg/input' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "x_1": 10,
  "x_2": 20,
  "x_3": 30,
  "year": 2022
}'
```

2. Retrieve output data:

```bash
curl -X 'GET' \
  'http://localhost:8000/ghg/output' \
  -H 'accept: application/json'
```

## Notes

- The GHG calculation is based on the formula: `GHG = (x_1 + x_2 + x_3) * (year - 1999)`
- Certificate levels are only provided for years after 2020
- Certificate levels are determined as follows:
  - Gold: GHG < 3000
  - Silver: 3000 <= GHG < 4000
  - Bronze: GHG >= 4000
