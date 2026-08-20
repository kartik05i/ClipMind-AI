from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.transcript import Transcript
from app.models.video import Video
from app.models.user import User

from app.services.learning_material_service import (
    generate_notes,
    generate_flashcards,
    generate_quiz,
)

from app.core.dependencies import require_role

from app.core.roles import EDUCATOR


router = APIRouter(
    prefix="/learning-materials",
    tags=["Learning Materials"]
)


class LearningMaterialRequest(BaseModel):
    video_id: int
    material_type: str


@router.post("/generate")
def generate_learning_material(
    request: LearningMaterialRequest,
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role([EDUCATOR])
    )
):

    # ================= VIDEO CHECK =================

    video = (
        db.query(Video)
        .filter(Video.id == request.video_id)
        .first()
    )

    if video is None:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )


    # ================= OWNERSHIP CHECK =================

    if video.uploaded_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="You can only create learning materials from your own videos"
        )


    # ================= TRANSCRIPT CHECK =================

    transcript = (
        db.query(Transcript)
        .filter(
            Transcript.video_id == request.video_id
        )
        .first()
    )

    if transcript is None:

        raise HTTPException(
            status_code=404,
            detail="Transcript not found. Generate the transcript first."
        )


    # ================= GENERATE NOTES =================

    if request.material_type == "notes":

        notes = generate_notes(
            transcript.transcript
        )

        return {
            "material_type": "notes",
            "content": notes
        }


    # ================= GENERATE FLASHCARDS =================

    elif request.material_type == "flashcards":

        flashcards = generate_flashcards(
            transcript.transcript
        )

        return {
            "material_type": "flashcards",
            "flashcards": flashcards
        }


    # ================= GENERATE QUIZ =================

    elif request.material_type == "quiz":

        questions = generate_quiz(
            transcript.transcript
        )

        return {
            "material_type": "quiz",
            "questions": questions
        }


    # ================= INVALID TYPE =================

    else:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid material type. "
                "Use notes, flashcards, or quiz."
            )
        )