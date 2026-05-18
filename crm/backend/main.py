from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError
from hashlib import sha256
import json
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

JWT_SECRET = "crm-secret-key-change-in-production"
JWT_ALG = "HS256"
JWT_TTL = timedelta(days=1)

ADMIN_LOGIN = "admin"
ADMIN_PASSWORD_HASH = sha256(b"admin").hexdigest()

app = FastAPI(title="CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
DATA_FILE = Path(__file__).parent / "data.json"


class ApplicationOut(BaseModel):
    id: str
    clientName: str
    contact: str
    text: str
    status: str
    createdAt: str


class ApplicationCreate(BaseModel):
    clientName: str
    contact: str
    text: str = ""


class StatusUpdate(BaseModel):
    status: str


class LoginRequest(BaseModel):
    login: str
    password: str


class TokenResponse(BaseModel):
    token: str


def load_data() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, OSError):
        return []


def save_data(data: list[dict]) -> None:
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')


def verify_token(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> None:
    if credentials is None:
        raise HTTPException(401, "Unauthorized")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALG])
        if payload.get("login") != ADMIN_LOGIN:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid token")


@app.post("/api/auth/login")
def login(payload: LoginRequest) -> TokenResponse:
    if (
        payload.login != ADMIN_LOGIN
        or sha256(payload.password.encode()).hexdigest() != ADMIN_PASSWORD_HASH
    ):
        raise HTTPException(401, "Invalid credentials")
    token = jwt.encode(
        {"login": payload.login, "exp": datetime.now(timezone.utc) + JWT_TTL},
        JWT_SECRET,
        algorithm=JWT_ALG,
    )
    return TokenResponse(token=token)


@app.get("/api/applications")
def get_applications(search: str = "", status: str = "") -> list[ApplicationOut]:
    data = load_data()
    if status:
        data = [d for d in data if d["status"] == status]
    if search:
        q = search.lower()
        data = [
            d
            for d in data
            if q in d["clientName"].lower()
            or q in d["contact"].lower()
            or q in d["text"].lower()
        ]
    return data


@app.post("/api/applications", status_code=201)
def create_app(payload: ApplicationCreate, _=Depends(verify_token)) -> ApplicationOut:
    data = load_data()
    app_entry: ApplicationOut = {
        "id": uuid.uuid4().hex,
        "clientName": payload.clientName,
        "contact": payload.contact,
        "text": payload.text,
        "status": "Новая",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    data.insert(0, app_entry)
    save_data(data)
    return app_entry


@app.patch("/api/applications/{app_id}/status")
def update_status(app_id: str, payload: StatusUpdate, _=Depends(verify_token)) -> ApplicationOut:
    data = load_data()
    for entry in data:
        if entry["id"] == app_id:
            entry["status"] = payload.status
            save_data(data)
            return entry
    raise HTTPException(404, "Application not found")


@app.delete("/api/applications/{app_id}", status_code=204)
def delete_app(app_id: str, _=Depends(verify_token)) -> None:
    data = load_data()
    new_data = [e for e in data if e["id"] != app_id]
    if len(new_data) == len(data):
        raise HTTPException(404, "Application not found")
    save_data(new_data)
