import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from productivity_engine import generate_fallback_study_plan, fallback_prioritize_tasks
from insights_engine import generate_fallback_insights, fallback_chat

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Use gemini-1.5-flash as default model
MODEL_NAME = "gemini-1.5-flash"

def generate_study_plan(goals: str, hours: float, subjects: str, pref_time: str, style: str) -> str:
    if not GEMINI_API_KEY:
        return generate_fallback_study_plan(goals, hours, subjects, pref_time, style)
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        Act as an expert student productivity coach. 
        Create a personalized study plan for a student with the following profile:
        - Study goals: {goals}
        - Available hours/day: {hours}
        - Subjects: {subjects}
        - Preferred study time: {pref_time}
        - Productivity style: {style}
        
        Provide a brief, actionable plan and daily schedule. Keep it well-formatted.
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Failed to generate study plan: {str(e)}"

def generate_insights(sessions_data: list, tasks_data: list, user_streak: int = 0) -> str:
    if not GEMINI_API_KEY:
        return generate_fallback_insights(sessions_data, tasks_data, user_streak)
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        Analyze the following student data and provide 3 quick actionable insights and a short motivational message.
        Study Sessions (last few): {sessions_data}
        Recent Tasks: {tasks_data}
        
        Keep the response extremely concise and encouraging.
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Failed to generate insights: {str(e)}"

def chat_with_assistant(user_message: str, context: str = "") -> str:
    if not GEMINI_API_KEY:
        return fallback_chat(user_message, context)
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"You are Trackify, a highly advanced premium AI study assistant.\nContext: {context}\nStudent says: {user_message}\nReply concisely, helpfully, and with a modern, professional tone."
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "Error connecting to AI assistant."

def prioritize_tasks(tasks_data: list) -> list:
    if not GEMINI_API_KEY:
        return fallback_prioritize_tasks(tasks_data)
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are an expert AI productivity engine.
        Given the following list of tasks (as JSON), assign each an "ai_priority_score" (float 0.0 to 10.0, higher means more urgent) and sort them in descending order of urgency.
        Tasks: {json.dumps(tasks_data)}
        
        Return exactly and only a valid JSON array of objects, with each object containing "id" and "ai_priority_score". No markdown block formatting, just the raw JSON.
        """
        response = model.generate_content(prompt)
        try:
            # Strip markdown if present
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            return json.loads(text.strip())
        except Exception:
            return []
    except Exception as e:
        return []
