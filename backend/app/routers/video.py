from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.session import get_db
from app.services.video_service import save_video

from app.core.dependencies import get_current_user, require_role
from app.core.roles import (
    LEARNER,
    EDUCATOR,
    CONTENT_CREATOR,
    ADMINISTRATOR,
)

from app.models.user import User
from app.models.video import Video
from app.models.audit_log import AuditLog


router = APIRouter(
    prefix="/videos",
    tags=["Videos"]
)


# ==========================================
# UPLOAD VIDEO
# Educator, Content Creator and Admin
# ==========================================

@router.post("/upload")
def upload_video(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role([
            EDUCATOR,
            CONTENT_CREATOR,
            ADMINISTRATOR,
        ])
    )
):
    video = save_video(
        db=db,
        file=file,
        title=title,
        user_id=current_user.id
    )

    # Create audit log
    audit_log = AuditLog(
    user_id=current_user.id,
    action="VIDEO_UPLOADED",
    resource="Video",
    details=f"Uploaded video: {video.title}"
)

    db.add(audit_log)
    db.commit()

    return {
        "message": "Video uploaded successfully",
        "video_id": video.id,
        "title": video.title,
        "filename": video.filename
    }

    
# ==========================================
# GET ALL VIDEOS
#
# Learner -> All visible videos
# Educator -> Own videos
# Content Creator -> Own videos
# Admin -> All videos
# ==========================================

@router.get("/")
def get_all_videos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Learner can only see visible videos
    if current_user.role == LEARNER:

        videos = (
            db.query(Video)
            .filter(Video.is_hidden == False)
            .order_by(Video.uploaded_at.desc())
            .all()
        )

    # Administrator can see all videos
    elif current_user.role == ADMINISTRATOR:

        videos = (
            db.query(Video)
            .order_by(Video.uploaded_at.desc())
            .all()
        )

    # Educator and Content Creator
    # can only see their own videos
    else:

        videos = (
            db.query(Video)
            .filter(
                Video.uploaded_by == current_user.id
            )
            .order_by(Video.uploaded_at.desc())
            .all()
        )

    return [
        {
            "video_id": video.id,
            "title": video.title,
            "filename": video.filename,
            "status": video.status,
            "is_hidden": video.is_hidden,
            "uploaded_at": video.uploaded_at,
            "uploaded_by": video.uploaded_by,
        }
        for video in videos
    ]


# ==========================================
# GET VIDEO BY ID
# ==========================================

@router.get("/{video_id}")
def get_video_by_id(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Learner cannot access hidden videos
    if (
        current_user.role == LEARNER
        and video.is_hidden
    ):
        raise HTTPException(
            status_code=403,
            detail="This video is hidden"
        )

    # Educator and Content Creator
    # can only access their own videos
    if (
        current_user.role in [
            EDUCATOR,
            CONTENT_CREATOR,
        ]
        and video.uploaded_by != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this video"
        )

    return {
        "video_id": video.id,
        "title": video.title,
        "filename": video.filename,
        "status": video.status,
        "is_hidden": video.is_hidden,
        "uploaded_at": video.uploaded_at,
        "uploaded_by": video.uploaded_by,
    }


# ==========================================
# UPDATE VIDEO TITLE
# ==========================================

@router.put("/{video_id}")
def update_video(
    video_id: int,
    title: str = Form(...),
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role([
            EDUCATOR,
            CONTENT_CREATOR,
            ADMINISTRATOR,
        ])
    )
):

    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Educator and Content Creator
    # can only edit their own videos
    if (
        current_user.role in [
            EDUCATOR,
            CONTENT_CREATOR,
        ]
        and video.uploaded_by != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own videos"
        )

    video.title = title

    db.commit()
    db.refresh(video)

    audit_log = AuditLog(
        user_id=current_user.id,
        action="VIDEO_UPDATED",
        resource="Video",
        details=f"Updated video title to: {video.title}"
    )

    db.add(audit_log)
    db.commit()

    return {
        "message": "Video updated successfully",
        "video_id": video.id,
        "title": video.title
    }


# ==========================================
# HIDE / UNHIDE VIDEO
# ==========================================

@router.patch("/{video_id}/visibility")
def toggle_video_visibility(
    video_id: int,
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role([
            EDUCATOR,
            CONTENT_CREATOR,
            ADMINISTRATOR,
        ])
    )
):

    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Educator and Content Creator
    # can only manage their own videos
    if (
        current_user.role in [
            EDUCATOR,
            CONTENT_CREATOR,
        ]
        and video.uploaded_by != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only manage your own videos"
        )

    video.is_hidden = not video.is_hidden

    db.commit()
    db.refresh(video)

    audit_log = AuditLog(
        user_id=current_user.id,
        action=(
            "VIDEO_HIDDEN"
            if video.is_hidden
            else "VIDEO_UNHIDDEN"
        ),
        resource="Video",
        details=(
            f"Hidden video: {video.title}"
            if video.is_hidden
            else f"Unhidden video: {video.title}"
        )
    )

    db.add(audit_log)
    db.commit()

    return {
        "message": (
            "Video hidden successfully"
            if video.is_hidden
            else "Video unhidden successfully"
        ),
        "video_id": video.id,
        "is_hidden": video.is_hidden
    }


# ==========================================
# DELETE VIDEO
# ==========================================

@router.delete("/{video_id}")
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role([
            EDUCATOR,
            CONTENT_CREATOR,
            ADMINISTRATOR,
        ])
    )
):

    # Find video
    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Educator and Content Creator
    # can only delete their own videos
    if (
        current_user.role in [
            EDUCATOR,
            CONTENT_CREATOR,
        ]
        and video.uploaded_by != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own videos"
        )

    try:

        # ==========================================
        # DELETE ALL DEPENDENT RECORDS FIRST
        # ==========================================


        # 1. Learning History
        db.execute(
            text("""
                DELETE FROM learning_history
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # 2. Bookmarks
        db.execute(
            text("""
                DELETE FROM bookmarks
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # 3. Key Moments
        db.execute(
            text("""
                DELETE FROM key_moments
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # 4. Highlights
        db.execute(
            text("""
                DELETE FROM highlights
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # 5. Keywords
        db.execute(
            text("""
                DELETE FROM keywords
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # 6. Summaries
        db.execute(
            text("""
                DELETE FROM summaries
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # 7. Transcripts
        db.execute(
            text("""
                DELETE FROM transcripts
                WHERE video_id = :video_id
            """),
            {"video_id": video_id}
        )


        # ==========================================
        # FINALLY DELETE THE VIDEO
        # ==========================================
        video_title = video.title

        audit_log = AuditLog(
            user_id=current_user.id,
            action="VIDEO_DELETED",
            resource="Video",
            details=f"Deleted video: {video_title}"
        )

        db.add(audit_log)

        db.delete(video)
        db.commit()

        return {
            "message": "Video deleted successfully",
            "video_id": video_id
        }


    except Exception as e:

        # Rollback if anything fails
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Error deleting video: {str(e)}"
        )