from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Literal

app = FastAPI(title="SkillSync AI Engine", version="2.0.0")

class GapRequest(BaseModel):
    student_skills: list[str]
    required_skills: list[str]

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "skillsync-ai-engine"}

@app.post("/v1/resume/parse")
async def parse_resume(resume: UploadFile = File(...)) -> dict:
    content = await resume.read()
    if not content:
        raise HTTPException(status_code=400, detail="Resume is empty")
    return {"file_name": resume.filename, "status": "accepted", "extraction": {"skills": [], "education": [], "projects": [], "experience": []}}

@app.post("/v1/curriculum/analyze")
async def analyze_curriculum(syllabus: UploadFile = File(...)) -> dict:
    content = await syllabus.read()
    if not content:
        raise HTTPException(status_code=400, detail="Syllabus is empty")
    return {"file_name": syllabus.filename, "status": "accepted", "industry_match": 0, "missing_topics": [], "outdated_topics": [], "recommended_modules": []}

@app.post("/v1/skill-gap")
def skill_gap(request: GapRequest) -> dict:
    current = {skill.casefold() for skill in request.student_skills}
    gaps = [skill for skill in request.required_skills if skill.casefold() not in current]
    return {"gap_percent": round(len(gaps) / max(len(request.required_skills), 1) * 100), "gaps": gaps}
