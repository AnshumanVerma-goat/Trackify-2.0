from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    xp: int = 0
    level: int = 1
    streak: int = 0
    last_login: Optional[datetime] = None
    
    current_burnout_score: float = 0.0
    average_fqi: float = 75.0
    relapse_risk: float = 0.0
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class UserPreferencesBase(BaseModel):
    study_hours: float
    subjects: str
    preferred_time: str
    productivity_style: str

class UserPreferencesCreate(UserPreferencesBase):
    pass

class UserPreferences(UserPreferencesBase):
    id: int
    user_id: int
    study_plan: Optional[str] = None
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    subject_tag: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: str = "medium"
    status: str = "pending"
    estimated_minutes: int = 30
    ai_priority_score: Optional[float] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class StudySessionBase(BaseModel):
    subject_tag: str
    duration_minutes: int
    focus_score: Optional[int] = None
    focus_mode: str = "Deep Work"
    interruptions: int = 0
    completed_successfully: bool = True

class StudySessionCreate(StudySessionBase):
    pass

class StudySession(StudySessionBase):
    id: int
    user_id: int
    start_time: datetime
    fqi: Optional[int] = None
    class Config:
        from_attributes = True

class HabitBase(BaseModel):
    title: str

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    user_id: int
    streak: int
    last_completed: Optional[datetime] = None
    class Config:
        from_attributes = True

class AddictionBase(BaseModel):
    title: str
    reduction_goal: Optional[str] = None

class AddictionCreate(AddictionBase):
    pass

class Addiction(AddictionBase):
    id: int
    user_id: int
    current_streak: int
    last_relapse: Optional[datetime] = None
    class Config:
        from_attributes = True
