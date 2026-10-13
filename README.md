# InterviewAI - Frontend Client 💻

Modern React 18 + Vite single-page web application for **InterviewAI**.

---

## 🌟 Features Included

- **AI Mock Interview Studio**:
  - Live AI interviewer persona avatar
  - Real-time speech synthesis (`SpeechSynthesisUtterance`)
  - Microphone speech-to-text (`SpeechRecognition`)
  - Instant answer evaluation with heuristic & semantic grading out of 10
  - Stopwatch timer for pacing
  - Toggleable industry model answers
- **Detailed Evaluation Scorecards**:
  - Visual score gauge (% and points)
  - Question-by-question breakdown with custom AI feedback
  - Printable PDF layout and .txt download
- **Question Bank & Filter Engine**:
  - Searchable questions across Java, Python, React, JS, Spring Boot, SQL, DBMS, System Design, DSA, and Behavioral
  - AI Model Solution reveal
  - Interactive "Test Your Answer" dialog
- **AI Sandbox**:
  - Prompt generator for any custom topic or technology
- **Auth & Session Management**:
  - Login, register, demo quick-fill, and simulated JWT session token state

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Tooling**: Vite 6
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with dark mode, glassmorphism, responsive layout
- **APIs**: Web Speech API (TTS & STT), Fetch API

---

## 🚀 How to Run Frontend

### 1. Development Mode (Hot-Reload)
From this `frontend` directory:
```bash
# Windows
npm.cmd run dev

# Linux / Mac
npm run dev
```
Navigate to: **`http://localhost:5173`**
*(API calls to `/api` are automatically proxied to backend at `http://localhost:8080`)*

### 2. Build for Production
To build static assets into the backend static resources folder:
```bash
npm.cmd run build
```
Assets will be compiled into `../backend/src/main/resources/static`.
