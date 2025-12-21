# 🚀 Campaignomatic

**Campaignomatic** is a fully local, open-source **automatic marketing campaign generator** that creates high-quality images from text prompts using open-source generative models — all running on your own machine.

No cloud APIs.  
No subscriptions.  
No data leaves your computer.

Campaignomatic is designed for **local marketing teams, agencies, and developers** who want fast, private, repeatable creative generation.

---

## ✨ Features

- 🧠 Text-to-image generation using **open-source Stable Diffusion models**
- 🌐 Simple web UI built with **TypeScript**
- 🖥️ Fully local execution (Mac-friendly)
- 🖼️ Resolution selector with common monitor / campaign sizes
- 🎯 Deterministic output via optional seed
- 📦 FastAPI backend + modern frontend
- 🔒 Privacy-first (offline-capable once models are downloaded)

Backend setup (image generation engine)
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

Start the backend:
uvicorn server:app --host 127.0.0.1 --port 8001

Verify:
curl http://127.0.0.1:8001/health

Frontend setup (web UI)
cd web
npm install
npm run dev
http://localhost:5173

Enter a marketing prompt, for example:
A clean modern coffee shop ad, warm lighting, minimalist style

🔐 Privacy & Local-First Design
	•	All generation runs on your machine
	•	No cloud calls
	•	No telemetry
	•	No prompt logging outside your system

Campaignomatic is suitable for privacy-sensitive creative work.

📜 License

MIT — free to use, modify, and distribute.

⸻

🙌 Acknowledgements
	•	Hugging Face Diffusers
	•	Stable Diffusion community
	•	FastAPI
	•	Vite + TypeScript ecosystem