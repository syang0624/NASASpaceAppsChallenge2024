from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import logging
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 오리진 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# GZip 압축 미들웨어 추가
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# 새로운 GHG 라우터 추가
ghg_router = APIRouter()

class InputData(BaseModel):
    x_1: float
    x_2: float
    x_3: float
    year: int

class OutputData(BaseModel):
    GHG: float
    story: str
    year: int
    certificate_level: str | None = None

# 전역 변수로 데이터 저장
current_data = None

@ghg_router.post("/input")
async def input_data(data: InputData):
    global current_data
    # GHG 계산 로직 (예시)
    ghg = (data.x_1 + data.x_2 + data.x_3) * (data.year - 1999)  # 2000년부터 시작하므로 1999를 뺍니다
    story = f"In {data.year}, the GHG emission was {ghg} based on the input values."
    
    current_data = OutputData(GHG=ghg, story=story, year = data.year)
    
    return {"message": "Data processed successfully"}

@ghg_router.get("/output")
async def get_output():
    global current_data
    if not current_data:
        return {"error": "No data available"}
    
    if current_data.year > 2020:
        # 인증 레벨 결정 로직 (예시)
        if current_data.GHG < 3000:
            certificate_level = "Gold"
        elif current_data.GHG < 4000:
            certificate_level = "Silver"
        else:
            certificate_level = "Bronze"
        
        current_data.certificate_level = certificate_level
    else:
        current_data.certificate_level = None
    
    return current_data

# 새로운 라우터를 앱에 포함
app.include_router(ghg_router, prefix="/ghg")

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=58000)