# Mini CRM — заявки

Простое CRM-приложение для управления заявками клиентов.

**Стек:** React + TypeScript + Vite (фронтенд), FastAPI + Uvicorn (бэкенд), данные хранятся в `data.json`.

---

## Требования

- Node.js 18+
- Python 3.9+

---

## Запуск

### 1. Бэкенд

```bash
cd backend
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
cd crm           # если вы в корне репозитория
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

## Сборка

```bash
npm run build     # собрать фронтенд
npm run preview   # посмотреть сборку локально
```
