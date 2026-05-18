# Mini CRM — заявки

Простое CRM-приложение для управления заявками клиентов.

**Стек:** React + TypeScript + Vite (фронтенд), FastAPI + Uvicorn (бэкенд), данные хранятся в `data.json`.  
**Авторизация:** JWT-токен. Учётная запись по умолчанию — `admin` / `admin`.

---

## Требования

- **Ручной запуск:** Node.js 18+, Python 3.9+
- **Docker:** Docker + Docker Compose

---

## Запуск через Docker (рекомендуется)

```bash
cd crm
docker compose up --build
```

- Фронтенд: http://localhost
- Бэкенд: http://localhost:8000  
- API docs (Swagger): http://localhost:8000/docs

Остановить: `docker compose down`

---

## Ручной запуск

### 1. Бэкенд

```bash
cd crm/backend
python -m venv venv
source venv/bin/activate      # Linux / macOS
# venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Бэкенд будет доступен на `http://localhost:8000`.

### 2. Фронтенд

Откройте второй терминал:

```bash
cd crm/frontend
npm install
npm run dev
```

Фронтенд откроется на `http://localhost:5173`.  
Запросы к `/api/*` автоматически проксируются на бэкенд.

---

## API

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/applications` | Список заявок |
| `POST` | `/api/applications` | Создать заявку |
| `PATCH` | `/api/applications/{id}/status` | Изменить статус |
| `DELETE` | `/api/applications/{id}` | Удалить заявку |

**Параметры GET:**
- `?search=текст` — поиск по имени, контакту или тексту
- `?status=Новая` — фильтр по статусу (`Новая`, `В работе`, `Завершена`)

---

## Структура проекта

```
crm/
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── data.json
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── src/
│   └── vite.config.ts
├── docker-compose.yml
├── .dockerignore
└── README.md
```

## Сборка фронтенда (без Docker)

```bash
cd crm/frontend
npm run build
npm run preview
```
