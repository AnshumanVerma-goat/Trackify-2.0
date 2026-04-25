from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas, auth, ai
from database import engine, get_db
from pydantic import BaseModel
from insights_engine import calculate_productivity_score

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trackify API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175", "http://localhost:5174", "http://localhost:5173", "http://127.0.0.1:5175", "http://127.0.0.1:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Initialize empty preferences
    pref = models.UserPreferences(user_id=new_user.id)
    db.add(pref)
    db.commit()
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    import datetime
    now = datetime.datetime.utcnow()
    # Update streak
    if db_user.last_login:
        delta = now.date() - db_user.last_login.date()
        if delta.days == 1:
            db_user.streak += 1
        elif delta.days > 1:
            db_user.streak = 1
    else:
        db_user.streak = 1
    db_user.last_login = now
    db.commit()
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/user/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

class GoalsUpdate(BaseModel):
    daily_goal_hours: float
    weekly_goal_hours: float

@app.put("/user/goals")
def update_goals(goals: GoalsUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    current_user.daily_goal_hours = goals.daily_goal_hours
    current_user.weekly_goal_hours = goals.weekly_goal_hours
    db.commit()
    return {"message": "Goals updated"}

@app.post("/user/onboard", response_model=schemas.UserPreferences)
def onboard_user(prefs: schemas.UserPreferencesCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_pref = db.query(models.UserPreferences).filter(models.UserPreferences.user_id == current_user.id).first()
    if not db_pref:
        db_pref = models.UserPreferences(user_id=current_user.id)
        db.add(db_pref)
    
    db_pref.study_hours = prefs.study_hours
    db_pref.subjects = prefs.subjects
    db_pref.preferred_time = prefs.preferred_time
    db_pref.productivity_style = prefs.productivity_style
    
    # Generate study plan using Gemini
    plan = ai.generate_study_plan(
        goals="Get better grades", # Could take from prefs if added
        hours=prefs.study_hours,
        subjects=prefs.subjects,
        pref_time=prefs.preferred_time,
        style=prefs.productivity_style
    )
    db_pref.study_plan = plan
    db.commit()
    db.refresh(db_pref)
    return db_pref

@app.get("/user/preferences", response_model=schemas.UserPreferences)
def get_preferences(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    pref = db.query(models.UserPreferences).filter(models.UserPreferences.user_id == current_user.id).first()
    if not pref:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return pref

@app.get("/tasks", response_model=list[schemas.Task])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all()

@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_task = models.Task(**task.dict(), user_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/tasks/{task_id}/status")
def update_task_status(task_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    return {"message": "Task updated"}

@app.post("/sessions", response_model=schemas.StudySession)
def create_session(session: schemas.StudySessionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Calculate XP
    xp_multiplier = 1.0
    if session.focus_mode == "Deep Work":
        xp_multiplier = 2.0
    elif session.focus_mode == "Revision":
        xp_multiplier = 1.5
    
    earned_xp = int(session.duration_minutes * xp_multiplier)
    current_user.xp += earned_xp
    
    # Level up logic
    while current_user.xp >= current_user.level * 100:
        current_user.xp -= current_user.level * 100
        current_user.level += 1
        
    new_session = models.StudySession(
        user_id=current_user.id,
        subject=session.subject_tag,
        duration_minutes=session.duration_minutes,
        focus_score=session.focus_score,
        focus_mode=session.focus_mode
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@app.get("/sessions", response_model=list[schemas.StudySession])
def get_sessions(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.StudySession).filter(models.StudySession.user_id == current_user.id).order_by(models.StudySession.start_time.desc()).all()

@app.get("/ai/insights")
def get_ai_insights(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    sessions = db.query(models.StudySession).filter(models.StudySession.user_id == current_user.id).limit(5).all()
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id).limit(5).all()
    
    session_data = [{"subject": s.subject, "duration": s.duration_minutes, "focus": s.focus_score} for s in sessions]
    task_data = [{"title": t.title, "status": t.status} for t in tasks]
    
    insights = ai.generate_insights(session_data, task_data, current_user.streak)
    return {"insights": insights}

@app.get("/user/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id).all()
    sessions = db.query(models.StudySession).filter(models.StudySession.user_id == current_user.id).all()
    
    score = calculate_productivity_score(current_user, tasks, sessions)
    
    # Subject breakdown
    subject_time = {}
    for s in sessions:
        subj = s.subject or 'General'
        subject_time[subj] = subject_time.get(subj, 0) + s.duration_minutes
        
    return {
        "productivity_score": score,
        "daily_goal": current_user.daily_goal_hours,
        "weekly_goal": current_user.weekly_goal_hours,
        "sessions_count": len(sessions),
        "tasks_completed": len([t for t in tasks if t.status == 'completed']),
        "subject_breakdown": [{"subject": k, "minutes": v} for k, v in subject_time.items()]
    }

@app.post("/ai/prioritize")
def prioritize_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id, models.Task.status != "completed").all()
    if not tasks:
        return {"message": "No tasks to prioritize"}
    
    task_data = [{"id": t.id, "title": t.title, "subject": t.subject_tag, "estimated_minutes": t.estimated_minutes} for t in tasks]
    prioritized = ai.prioritize_tasks(task_data)
    
    for p in prioritized:
        tid = p.get("id")
        score = p.get("ai_priority_score")
        if tid is not None and score is not None:
            db_task = db.query(models.Task).filter(models.Task.id == tid, models.Task.user_id == current_user.id).first()
            if db_task:
                db_task.ai_priority_score = score
    
    db.commit()
    return {"message": "Tasks prioritized successfully"}

class ChatRequest(BaseModel):
    message: str

@app.post("/ai/chat")
def chat(req: ChatRequest, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Simple context injection
    pref = db.query(models.UserPreferences).filter(models.UserPreferences.user_id == current_user.id).first()
    context = f"User studies {pref.subjects if pref else 'general subjects'}."
    reply = ai.chat_with_assistant(req.message, context)
    return {"reply": reply}
