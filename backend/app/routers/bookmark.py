from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user

from app.models.user import User
from app.models.video import Video
from app.models.bookmark import Bookmark


router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"]
)


# ==========================================
# CREATE BOOKMARK
# ==========================================

@router.post("/save/{video_id}")
def save_bookmark(
    video_id: int,
    content_type: str,
    content: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Check if video exists
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

    # Check duplicate bookmark
    existing_bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == current_user.id,
            Bookmark.video_id == video_id,
            Bookmark.content_type == content_type
        )
        .first()
    )

    if existing_bookmark:
        return {
            "message": "Already bookmarked",
            "bookmark_id": existing_bookmark.id
        }

    # Create bookmark
    bookmark = Bookmark(
        user_id=current_user.id,
        video_id=video_id,
        content_type=content_type,
        content=content
    )

    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return {
        "message": "Bookmark saved successfully",
        "bookmark_id": bookmark.id
    }


# ==========================================
# GET ALL USER BOOKMARKS
# ==========================================

@router.get("/")
def get_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    bookmarks = (
        db.query(Bookmark)
        .filter(
            Bookmark.user_id == current_user.id
        )
        .order_by(
            Bookmark.created_at.desc()
        )
        .all()
    )

    result = []

    for item in bookmarks:

        video = (
            db.query(Video)
            .filter(Video.id == item.video_id)
            .first()
        )

        result.append({
            "bookmark_id": item.id,
            "video_id": item.video_id,
            "video_title": (
                video.title
                if video
                else "Unknown Video"
            ),
            "content_type": item.content_type,
            "content": item.content,
            "created_at": item.created_at
        })

    return result


# ==========================================
# DELETE BOOKMARK
# ==========================================

@router.delete("/{bookmark_id}")
def delete_bookmark(
    bookmark_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    bookmark = (
        db.query(Bookmark)
        .filter(
            Bookmark.id == bookmark_id,
            Bookmark.user_id == current_user.id
        )
        .first()
    )

    if not bookmark:
        raise HTTPException(
            status_code=404,
            detail="Bookmark not found"
        )

    db.delete(bookmark)
    db.commit()

    return {
        "message": "Bookmark deleted successfully"
    }