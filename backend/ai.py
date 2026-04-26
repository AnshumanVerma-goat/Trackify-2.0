import os
import json
from dotenv import load_dotenv
from google import genai
from insights_engine import (
    generate_fallback_study_plan,
    fallback_chat,
    generate_fallback_insights,
    generate_fallback_micro_insight
)

# Use absolute path to .env if needed or just rely on dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print("Failed to initialize genai client:", e)

MODEL_NAME = "gemini-2.5-flash"

def ask_gemini(prompt: str) -> str:
    if not client:
        return None
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        if response.text:
            return response.text
        if response.candidates and response.candidates[0].content.parts:
            return response.candidates[0].content.parts[0].text
        return None
    except Exception as e:
        print("Gemini Error:", e)
        return None

def fallback_prioritize_tasks(tasks_data: list) -> list:
    prioritized = []
    for idx, t in enumerate(tasks_data):
        score = 10.0 - (min(t.get('estimated_minutes', 30), 120) / 120.0 * 5) - (idx * 0.1)
        prioritized.append({"id": t["id"], "ai_priority_score": max(0.1, score)})
    return sorted(prioritized, key=lambda x: x["ai_priority_score"], reverse=True)

def generate_study_plan(goals: str, hours: float, subjects: str, pref_time: str, style: str) -> str:
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
    res = ask_gemini(prompt)
    if res: return res
    
    # Fallback needs to return string but fallback function currently returns dict
    fb = generate_fallback_study_plan()
    if isinstance(fb, dict) and "plan" in fb:
        return "\n".join([f"- {p}" for p in fb["plan"]])
    return "Could not generate plan."

def generate_insights(sessions_data: list, tasks_data: list, user_streak: int = 0) -> str:
    prompt = f"""
    Analyze the following student data and provide 3 quick actionable insights and a short motivational message.
    Study Sessions (last few): {sessions_data}
    Recent Tasks: {tasks_data}
    
    Keep the response extremely concise and encouraging.
    """
    res = ask_gemini(prompt)
    if res: return res
    return generate_fallback_insights(sessions_data, tasks_data, user_streak)

def chat_with_assistant(user_message: str, context: str = "") -> str:
    prompt = f"You are Trackify, a highly advanced premium AI study assistant.\nContext: {context}\nStudent says: {user_message}\nReply concisely, helpfully, and with a modern, professional tone."
    res = ask_gemini(prompt)
    if res: return res
    return fallback_chat(user_message, context)

def prioritize_tasks(tasks_data: list) -> list:
    prompt = f"""
    You are an expert AI productivity engine.
    Given the following list of tasks (as JSON), assign each an "ai_priority_score" (float 0.0 to 10.0, higher means more urgent) and sort them in descending order of urgency.
    Tasks: {json.dumps(tasks_data)}
    
    Return exactly and only a valid JSON array of objects, with each object containing "id" and "ai_priority_score". No markdown block formatting, just the raw JSON.
    """
    res = ask_gemini(prompt)
    if res:
        try:
            text = res.strip()
            if text.startswith("```json"): text = text[7:-3]
            elif text.startswith("```"): text = text[3:-3]
            return json.loads(text.strip())
        except Exception:
            pass
    return fallback_prioritize_tasks(tasks_data)

def generate_daily_plan(tasks_data: list, hours: float, pref_time: str, style: str) -> str:
    prompt = f"""
    Act as an expert student productivity AI.
    Generate a highly specific schedule for today based on these pending tasks: {json.dumps(tasks_data)}
    The student has {hours} hours available, prefers studying in the {pref_time}, and uses the {style} style.
    Provide a timeline in the format "- HH:MM AM/PM: Task Description" where the tasks are broken down into time blocks. Keep it concise. Don't add extra fluff.
    """
    res = ask_gemini(prompt)
    if res: return res
    return "\n".join([f"- {t.get('estimated_minutes', 30)}m: {t.get('title', 'Task')}" for t in tasks_data]) if tasks_data else "No tasks scheduled for today."

def get_study_recommendation(tasks_data: list, goals: str, sessions_data: list) -> str:
    prompt = f"""
    Act as an expert student productivity AI.
    Based on the pending tasks {json.dumps(tasks_data)}, the student's goals '{goals}', and their recent study sessions {json.dumps(sessions_data)},
    what should they study right now? Give a short, structured recommendation with bullet points. Do not include introductory text, just the recommendations.
    """
    res = ask_gemini(prompt)
    if res: return res
    return "- Review your most urgent tasks.\n- Start a Pomodoro session for your weakest subject."

def generate_micro_insight(sessions_data: list, tasks_data: list) -> str:
    prompt = f"""
    Act as a highly observant AI productivity coach.
    Based on these recent study sessions: {json.dumps(sessions_data)}
    And pending/completed tasks: {json.dumps(tasks_data)}
    Provide exactly ONE short sentence (under 10 words) of encouraging, subtle insight about their habits or a quick tip.
    Examples: "You focus better in the evening.", "Short sessions improve retention."
    Do not use quotes.
    """
    res = ask_gemini(prompt)
    if res: return res.strip().replace('"', '')
    return generate_fallback_micro_insight(sessions_data, tasks_data)