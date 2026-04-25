def generate_fallback_insights(sessions_data: list, tasks_data: list, user_streak: int) -> str:
    total_minutes = sum([s.get('duration', 0) for s in sessions_data])
    completed_tasks = len([t for t in tasks_data if t.get('status') == 'completed'])
    total_tasks = len(tasks_data)
    
    insights = []
    
    if total_minutes > 120:
        insights.append("🔥 Great focus! You've logged over 2 hours recently.")
    elif total_minutes > 0:
        insights.append("👍 Good start, let's aim for a longer session next time.")
    else:
        insights.append("⏱️ You haven't logged any study sessions recently. Time to start!")
        
    if total_tasks > 0:
        ratio = completed_tasks / total_tasks
        if ratio > 0.8:
            insights.append("✅ Elite task completion rate!")
        elif ratio > 0.4:
            insights.append("📈 You're making steady progress on your tasks.")
        else:
            insights.append("⚠️ A lot of pending tasks. Try breaking them down.")
            
    if user_streak >= 3:
        insights.append(f"🔥 You're on a {user_streak}-day streak! Keep the momentum.")
    elif user_streak == 0:
        insights.append("⚠️ You're close to breaking your streak. Do a quick 15m session!")
        
    return "\n".join(insights)

def fallback_chat(user_message: str, context: str) -> str:
    user_message = user_message.lower()
    if 'plan' in user_message:
        return "You can view your dynamic study plan on the dashboard!"
    elif 'streak' in user_message or 'score' in user_message:
        return "Your productivity score and streak are tracked automatically as you log sessions."
    elif 'task' in user_message:
        return "Try the 'Auto Prioritize' button in your task manager to organize your day."
    else:
        return "I'm your local study assistant! Log a session or add a task to get started."

def calculate_productivity_score(user, tasks, sessions) -> int:
    score = 50 # Base score
    
    # Streak bonus (up to 20 pts)
    score += min(user.streak * 2, 20)
    
    # Task completion bonus (up to 20 pts)
    if tasks:
        completed = len([t for t in tasks if t.status == 'completed'])
        score += int((completed / len(tasks)) * 20)
        
    # Focus time bonus (up to 10 pts)
    # let's assume 120 mins a day is ideal
    from datetime import datetime, timedelta
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_sessions = [s for s in sessions if s.start_time >= yesterday]
    total_mins = sum(s.duration_minutes for s in recent_sessions)
    score += min(int((total_mins / 120) * 10), 10)
    
    return min(100, max(0, score))
def generate_fallback_study_plan(user_data=None):
    return {
        "plan": [
            "Study your core subjects for 2 hours",
            "Use Deep Work sessions (50 min focus + 10 min break)",
            "Revise weak topics",
            "Practice active recall",
        ],
        "message": "Fallback study plan (AI not available)"
    }