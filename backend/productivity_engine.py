def generate_fallback_study_plan(goals: str, hours: float, subjects: str, pref_time: str, style: str) -> str:
    subj_list = [s.strip() for s in subjects.split(',') if s.strip()]
    if not subj_list:
        subj_list = ['General Study']
    
    plan = f"### Today's Smart Plan ({hours} hrs)\n\n"
    
    # Simple logic based on time
    if pref_time == 'morning':
        start_hour = 9
    elif pref_time == 'afternoon':
        start_hour = 14
    elif pref_time == 'evening':
        start_hour = 18
    else:
        start_hour = 22

    time_per_subj = max(30, int((hours * 60) / len(subj_list)))
    
    current_time = start_hour
    for i, subj in enumerate(subj_list):
        if style == 'pomodoro':
            plan += f"- **{current_time}:00 - {current_time}:25**: {subj} (Deep Work)\n"
            plan += f"- **{current_time}:25 - {current_time}:30**: Short Break\n"
        elif style == 'deep_work':
            plan += f"- **{current_time}:00 - {current_time + 1}:30**: {subj} (Deep Focus)\n"
        else:
            plan += f"- **{current_time}:00 - {current_time + 1}:00**: {subj} (Flexible)\n"
        current_time += 1

    return plan

def fallback_prioritize_tasks(tasks_data: list) -> list:
    prioritized = []
    for idx, t in enumerate(tasks_data):
        # basic logic: prioritize shorter tasks, and fallback to original order
        score = 10.0 - (min(t.get('estimated_minutes', 30), 120) / 120.0 * 5) - (idx * 0.1)
        prioritized.append({"id": t["id"], "ai_priority_score": max(0.1, score)})
    
    return sorted(prioritized, key=lambda x: x["ai_priority_score"], reverse=True)
