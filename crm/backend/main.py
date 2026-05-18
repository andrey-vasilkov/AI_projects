from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

app = FastAPI(title="CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


def load_data() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, OSError):
        return []


def save_data(data: list[dict]) -> None:
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')


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
def create_app(payload: ApplicationCreate) -> ApplicationOut:
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
def update_status(app_id: str, payload: StatusUpdate) -> ApplicationOut:
    data = load_data()
    for entry in data:
        if entry["id"] == app_id:
            entry["status"] = payload.status
            save_data(data)
            return entry
    raise HTTPException(404, "Application not found")


@app.delete("/api/applications/{app_id}", status_code=204)
def delete_app(app_id: str) -> None:
    data = load_data()
    new_data = [e for e in data if e["id"] != app_id]
    if len(new_data) == len(data):
        raise HTTPException(404, "Application not found")
    save_data(new_data)
