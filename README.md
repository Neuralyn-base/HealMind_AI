
- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide icons, Axios.
- **Backend:** FastAPI, SQLAlchemy ORM, Alembic migrations, Pydantic, httpx.
- **AI/Voice:** Ollama (local LLM), Edge TTS, WebRTC.
- **Deployment:** Docker, Nginx, Uvicorn, .env-based config.

---

## 🚀 Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/Neuralyn-base/HealMind_AI.git
cd HealMind_AI
```

### 2. **Set Up Environment Variables**

- **Backend:**  
  Create `backend/.env` (do NOT commit this file):
  ```
  OPENAI_API_KEY=your-openai-key
  DATABASE_URL=postgresql://user:password@localhost:5432/healmind
  OLLAMA_BASE_URL=http://localhost:11434
  # ...other secrets...
  ```

- **Frontend:**  
  Create `frontend/.env`:
  ```
  REACT_APP_API_URL=http://localhost:8000/api
  REACT_APP_API_KEY=your-api-key
  ```

- **Add `.env` to `.gitignore`** (already included).

### 3. **Install Dependencies**

- **Backend:**
  ```bash
  cd backend
  pip install -r requirements.txt
  ```

- **Frontend:**
  ```bash
  cd ../frontend
  yarn install
  ```

### 4. **Run the App (Dev Mode)**

- **Backend:**
  ```bash
  uvicorn server:app --reload --host 0.0.0.0 --port 8000
  ```

- **Frontend:**
  ```bash
  yarn start
  ```

- **(Optional) Docker Compose:**
  ```bash
  docker-compose up --build
  ```

---

## 🛡️ Security & Compliance

- **No secrets in git:** All API keys and secrets are in `.env` (never committed).
- **API key authentication** for backend endpoints.
- **CORS** and input validation.
- **No PHI stored:** App is a wellness tool, not a medical device.
- **Privacy-first:** User data is isolated and exportable.

---

## 🧑‍💻 Developer Guide

- **Code Structure:**
  - `frontend/` — React app (src/components, services, etc.)
  - `backend/` — FastAPI app (routers, models, middleware, etc.)
  - `Dockerfile`, `nginx.conf` — Deployment config

- **Migrations:**
  ```bash
  cd backend
  alembic upgrade head
  ```

- **Testing:**
  - Add your tests in `tests/`
  - Run with `pytest`

- **API Docs:**
  - Visit `http://localhost:8000/docs` for interactive Swagger UI.

---

## 📝 Example .env.example

**backend/.env.example**
  - OPENAI_API_KEY=your-openai-key
  - DATABASE_URL=postgresql://user:password@localhost:5432/healmind
  - OLLAMA_BASE_URL=http://localhost:11434

---

## 💡 Contributing

1. Fork the repo and create your branch.
2. Commit your changes (no secrets!).
3. Push to your fork and open a Pull Request.

---

## 📄 License

Proprietary. All rights reserved Neuralyn LLC.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Ollama](https://ollama.com/)
- [Edge TTS](https://github.com/rany2/edge-tts)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🛟 Support

For questions or support, open an issue or email [support@healmind.ai](mailto:support@healmind.ai).

---

**HealMind AI — Your AI-powered wellness companion.**
