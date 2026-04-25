# Trackify - AI-Powered Student Productivity SaaS

Trackify is a highly aesthetic, AI-first productivity and study tracking web application tailored for students. It leverages the power of Google Gemini AI to analyze study habits, generate personalized study plans, give dynamic insights, and assist students in real-time.

## Features
- **Modern UI**: Built with React, Tailwind CSS, Recharts, and Framer Motion for a premium, sleek glassmorphism design.
- **AI Onboarding**: Tell Trackify your study hours, subjects, and style, and Gemini will generate a custom study plan.
- **Pomodoro Timer**: Integrated focus timer. Sessions are tracked and scored.
- **Task Management**: Smart to-do list for your subjects and deadlines.
- **AI Insights & Analytics**: Real-time study time trends and AI-generated motivation/feedback based on your recent activity.
- **AI Chat Assistant**: Built-in intelligent coach powered by Gemini to answer your study questions instantly.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite
- **AI Integration**: Google Gemini API

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies (if you haven't already):
   ```bash
   pip install fastapi uvicorn sqlalchemy "passlib[bcrypt]" "python-jose[cryptography]" python-dotenv google-generativeai pydantic pydantic-settings
   ```
4. Create a `.env` file in the `backend` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Usage
1. Sign up for a new account.
2. Complete the onboarding flow to let the AI generate your initial study plan.
3. Access your Dashboard to manage tasks, start focus sessions, view your study trends, and chat with the AI assistant.
