from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db
from models.message import Messages
from models.user import User
from models.lawyers import Lawyers
from schemas.message import MessageCreate, MessageResponse, MessageUpdate, ConversationResponse

message_router = APIRouter(prefix="/messages", tags=["Messages"])

@message_router.post("/", response_model=MessageResponse)
def send_message(msg: MessageCreate, db: Session = Depends(get_db)):
    try:
        # Pydantic v2 uses model_dump, v1 uses dict
        data = msg.model_dump() if hasattr(msg, "model_dump") else msg.dict()
        new_msg = Messages(**data)
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)
        return new_msg
    except Exception as e:
        db.rollback()
        print(f"ERROR SENDING MESSAGE: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Backend Error: {str(e)}. Ensure User ID {msg.user_id} and Lawyer ID {msg.lawyer_id} exist."
        )

@message_router.get("/{user_id}/{lawyer_id}", response_model=List[MessageResponse])
def get_chat_history(user_id: int, lawyer_id: int, db: Session = Depends(get_db)):
    return db.query(Messages).filter(
        Messages.user_id == user_id,
        Messages.lawyer_id == lawyer_id
    ).order_by(Messages.created_at.asc()).all()

@message_router.put("/{message_id}", response_model=MessageResponse)
def edit_message(message_id: int, msg_data: MessageUpdate, db: Session = Depends(get_db)):
    msg = db.query(Messages).filter(Messages.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    msg.content = msg_data.content
    db.commit()
    db.refresh(msg)
    return msg

@message_router.delete("/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    msg = db.query(Messages).filter(Messages.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(msg)
    db.commit()
    return {"message": "Message deleted successfully"}

@message_router.get("/conversations/{role}/{id}", response_model=List[ConversationResponse])
def get_conversations(role: str, id: int, db: Session = Depends(get_db)):
    if role == "user":
        # Get all lawyers this user has chatted with
        distinct_lawyers = db.query(Messages.lawyer_id).filter(Messages.user_id == id).distinct().all()
        conversations = []
        for (l_id,) in distinct_lawyers:
            lawyer = db.query(Lawyers).filter(Lawyers.id == l_id).first()
            last_msg = db.query(Messages).filter(Messages.user_id == id, Messages.lawyer_id == l_id).order_by(Messages.created_at.desc()).first()
            if lawyer and last_msg:
                conversations.append({
                    "lawyer_id": l_id,
                    "name": lawyer.name,
                    "last_message": last_msg.content,
                    "timestamp": last_msg.created_at
                })
        return sorted(conversations, key=lambda x: x["timestamp"], reverse=True)
    
    elif role == "lawyer":
        # Get all users this lawyer has chatted with
        distinct_users = db.query(Messages.user_id).filter(Messages.lawyer_id == id).distinct().all()
        conversations = []
        for (u_id,) in distinct_users:
            user = db.query(User).filter(User.id == u_id).first()
            last_msg = db.query(Messages).filter(Messages.user_id == u_id, Messages.lawyer_id == id).order_by(Messages.created_at.desc()).first()
            if user and last_msg:
                conversations.append({
                    "user_id": u_id,
                    "name": user.name,
                    "last_message": last_msg.content,
                    "timestamp": last_msg.created_at
                })
        return sorted(conversations, key=lambda x: x["timestamp"], reverse=True)
    
    return []
