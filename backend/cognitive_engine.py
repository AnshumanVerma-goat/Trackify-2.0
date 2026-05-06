import datetime
from sqlalchemy.orm import Session

def calculate_fqi(session_duration: int, focus_score: int, mode: str, difficulty_rating: float = 1.0) -> int:
    """
    Focus Quality Index formula (0-100).
    Takes into account session length, user-rated focus score, mode type, etc.
    """
    base = min(100, focus_score * 10) if focus_score else 50
    # Mode multiplier
    multiplier = 1.0
    if mode == "Deep Work": multiplier = 1.2
    elif mode == "Pomodoro": multiplier = 1.0
    elif mode == "Revision": multiplier = 0.9
    
    duration_factor = min(1.5, session_duration / 30.0) # Peaks at 45 mins
    
    score = int(base * multiplier * duration_factor * difficulty_rating)
    return max(0, min(100, score))


def calculate_cognitive_load(sessions: list, tasks: list, habits: list, addictions: list) -> int:
    """
    Compute dynamic Cognitive Load Score (0-100).
    0-30 = Stable, 30-60 = Moderate, 60-80 = High Stress, 80-100 = Burnout Risk
    """
    # 1. recent density penalty
    recent_sessions = [s for s in sessions if (datetime.datetime.utcnow().date() - getattr(s, 'start_time', datetime.datetime.utcnow()).date()).days <= 3]
    total_recent_mins = sum(getattr(s, 'duration_minutes', 0) for s in recent_sessions)
    density_penalty = min(total_recent_mins / 300.0 * 20, 20) # Up to 20 pts if > 5 hrs in 3 days

    # 2. Overdue tasks stress
    overdue_tasks = [t for t in tasks if getattr(t, 'deadline', None) and getattr(t, 'deadline') < datetime.datetime.utcnow() and getattr(t, 'status') != 'completed']
    overdue_penalty = min(len(overdue_tasks) * 5, 25) # Up to 25 pts

    # 3. Low focus penalty
    low_focus = len([s for s in recent_sessions if getattr(s, 'focus_score', 10) < 5])
    focus_penalty = min(low_focus * 5, 15)

    # 4. Habit failures / Addiction relapses
    relapse_penalty = 0
    for a in addictions:
        if getattr(a, 'last_relapse', None):
             if (datetime.datetime.utcnow() - getattr(a, 'last_relapse')).days < 2:
                 relapse_penalty += 15

    total_load = int(20 + density_penalty + overdue_penalty + focus_penalty + relapse_penalty)
    return max(0, min(100, total_load))


def detect_relapse_risk(cognitive_load: int, addictions: list, habits: list) -> float:
    """
    Returns 0.0 to 1.0 risk of relapse based on stress, recent failures, and habits.
    """
    risk_factor = cognitive_load / 100.0
    
    recent_relapses = sum(1 for a in addictions if getattr(a, 'last_relapse') and (datetime.datetime.utcnow() - getattr(a, 'last_relapse')).days < 3)
    habit_inconsistencies = sum(1 for h in habits if getattr(h, 'streak', 0) == 0)
    
    risk = (risk_factor * 0.5) + (recent_relapses * 0.3) + (min(habit_inconsistencies, 5) * 0.05)
    return max(0.0, min(1.0, risk))

def get_relapse_substitutions(risk: float) -> list[str]:
    recs = []
    if risk > 0.7:
         recs.extend(["Take a 10-minute walk outside immediately.", "Do a 5-minute breathing exercise."])
    elif risk > 0.4:
         recs.extend(["Switch to a lighter study topic.", "Use 15-minute Pomodoro cycles."])
    else:
         recs.extend(["Maintain deep work mode.", "Keep hydrated."])
    return list(set(recs))


def calculate_adaptive_xp(duration: int, focus: int, mode: str, cl_score: int) -> int:
    """
    Rewards more XP if user performed deep work despite moderate stress.
    But caps XP if they are burning out (to discourage overworking).
    """
    base_xp = duration * (focus / 5.0 if focus else 1.0)
    if cl_score > 80:
        base_xp *= 0.5 # Discourage working in high burnout
    elif cl_score > 60:
        base_xp *= 1.2 # Reward resilience
    
    if mode == "Deep Work":
        base_xp *= 1.5
    
    return int(base_xp)

def generate_adaptive_plan(cl_score: int, fqi: int, tasks: list) -> str:
    """
    Structural adjustments BEFORE hitting AI.
    """
    pending = [t for t in tasks if t.status != 'completed']
    if cl_score > 80:
        return "Strict Burnout Protocol: Only 1 priority task today. Mandatory 20-min breaks. No deep work."
    if fqi < 40:
        return "Focus Recovery Protocol: 15-minute Pomodoro chunks. High rewards. Easy tasks first."
    
    return "Optimal State: Deep work encouraged. Tackle hardest subjects first."