# 🚀 Campaignomatic

<p align="center">
  <b>Local-first AI marketing campaigns — no cloud, no keys, no tracking.</b>
</p>

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue">
  <img alt="LLM" src="https://img.shields.io/badge/LLM-Ollama-green">
  <img alt="Images" src="https://img.shields.io/badge/images-Stable%20Diffusion-purple">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey">
</p>

---

## ✨ What Is Campaignomatic?

**Campaignomatic** is a **local-first marketing campaign generator** designed to run entirely on your own machine.

It combines:
- 🧠 **Local LLMs** for marketing copy (via Ollama)
- 🎨 **Local image generation** for brand visuals (via Stable Diffusion)
- 📁 **Local asset storage** (no cloud APIs, no tokens)

> Everything stays on your machine — fast, private, and predictable.

---

## 🧩 What Campaignomatic Does

1. 📝 Accepts a **marketing description**
2. ✍️ Generates **one ad-ready paragraph** (LLM)
3. 🖼 Accepts a **brand image prompt**
4. 🎯 Generates **three standard ad sizes**:
   - `800 × 800` (Square)
   - `800 × 450` (Landscape)
   - `450 × 800` (Portrait)
5. 🔐 Saves assets locally under a **16-character hash folder**
6. 👀 Displays a **live preview** in the browser

---

## 🛠 Tech Stack

| Layer        | Technology |
|-------------|------------|
| 🎨 Frontend | React + TypeScript (Vite) |
| 🔧 Backend  | Node.js + TypeScript (Express) |
| 🧠 LLM      | Ollama (local) |
| 🖼 Images   | Stable Diffusion (WebUI API) |
| 💻 Platform | macOS or Linux |

---

## ✅ System Requirements

- 🖥 macOS (Apple Silicon recommended) or Linux
- 🟢 Node.js **18 or 20 LTS**
- 🧠 **Ollama**
- 🎨 **Stable Diffusion WebUI** (API enabled)

---

## ① Install Node.js

Check your version:
```bash
node -v
```
Install Node 20 if needed:
```bash
brew install node@20
```
Restart your terminal after installation.

---

## ② Install & Run Ollama

Install Ollama from the official site.

Pull a model:
```bash
ollama pull llama3.1:8b
```
Verify Ollama is running:
```bash
curl http://127.0.0.1:11434/api/tags
```

---

## ③ Install & Run Stable Diffusion
1) Clone Stable Diffusion WebUI
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
```
2) Create or edit webui-user.sh so it contains only:
```bash
export python_cmd="/opt/homebrew/opt/python@3.11/bin/python3.11"
export COMMANDLINE_ARGS="--api --skip-torch-cuda-test"
```
3) Start Stable Diffusion
```bash
./webui.sh
```
Campaignomatic expects a Stable Diffusion WebUI-compatible API.

Verify Stable Diffusion is Running
```bash
curl http://127.0.0.1:7860
```
If Stable Diffusion is unavailable, Campaignomatic will fall back to placeholder images.

---

##  Install dependencies:
```bash
npm install
npm --prefix client install
npm --prefix server install
```

## ⑥ Run the App
```bash
npm run dev
```

---

🌐 Access Points

- 🖥 Web UI http://localhost:5173
- 🔌 API http://localhost:5174
- 📁 Assets http://localhost:5174/assets

---

🧠 Philosophy

- 🚫 No cloud dependencies
- 🔐 No API keys
- 🧪 Fully reproducible
- 🧩 Hackable, inspectable, extendable

Campaignomatic is designed to be portfolio-grade, developer-friendly, and privacy-first.