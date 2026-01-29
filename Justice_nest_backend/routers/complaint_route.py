from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional
import cloudinary.uploader
from dependencies import get_db
from models.complaint import Complaints
from schemas.complaint import ComplaintUpdate, ComplaintAccept

complaint_router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


@complaint_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_complaint(
    user_id: int = Form(...),
    name: str = Form(...),
    number: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    gender: str = Form(...),
    complaint_details: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    file_url = None
    if file:
        try:
            upload_result = cloudinary.uploader.upload(file.file)
            file_url = upload_result.get("secure_url")
        except Exception as e:
            print(f"CLOUDINARY UPLOAD ERROR: {e}")

    complaint = Complaints(
        user_id=user_id,
        name=name,
        number=number,
        city=city,
        state=state,
        gender=gender,
        complaint_details=complaint_details,
        complaint_file_url=file_url
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint created successfully",
        "complaint_id": complaint.id
    }



@complaint_router.get("/user/{user_id}")
def get_user_complaints(user_id: int,db: Session = Depends(get_db)):
    return (db.query(Complaints).filter(Complaints.user_id == user_id).all())


@complaint_router.get("/pending")
def get_pending_complaints(db: Session = Depends(get_db)):
    return (db.query(Complaints).filter(Complaints.status == "pending") .all())


@complaint_router.put("/{complaint_id}/accept")
def accept_complaint(complaint_id: int, data: ComplaintAccept, db: Session = Depends(get_db)):
    # Verify lawyer status first
    from models.lawyers import Lawyers
    lawyer = db.query(Lawyers).filter(Lawyers.id == data.lawyer_id).first()

    if not lawyer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lawyer not found")

    if lawyer.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending approval. You cannot accept cases yet."
        )

    complaint = (db.query(Complaints).filter(Complaints.id == complaint_id).first())

    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    complaint.lawyer_id = data.lawyer_id
    complaint.status = "accepted"

    db.commit()
    db.refresh(complaint)

    return {"message": "Complaint accepted successfully"}



@complaint_router.get("/lawyer/{lawyer_id}")
def get_lawyer_complaints(lawyer_id: int,db: Session = Depends(get_db)):
    return (db.query(Complaints).filter(Complaints.lawyer_id == lawyer_id).all() )


@complaint_router.put("/{complaint_id}")
async def update_complaint(
    complaint_id: int,
    number: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    complaint_details: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    complaint = (db.query(Complaints).filter(Complaints.id == complaint_id).first())

    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    if number is not None:
        complaint.number = number
    if city is not None:
        complaint.city = city
    if state is not None:
        complaint.state = state
    if gender is not None:
        complaint.gender = gender
    if complaint_details is not None:
        complaint.complaint_details = complaint_details
    if status is not None:
        complaint.status = status

    if file:
        try:
            upload_result = cloudinary.uploader.upload(file.file)
            complaint.complaint_file_url = upload_result.get("secure_url")
        except Exception as e:
            print(f"CLOUDINARY UPDATE ERROR: {e}")

    db.commit()
    db.refresh(complaint)

    return {"message": "Complaint updated successfully"}



@complaint_router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int,db: Session = Depends(get_db)):
    complaint = (db.query(Complaints).filter(Complaints.id == complaint_id).first())

    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Complaint not found")

    db.delete(complaint)
    db.commit()

    return {"message": "Complaint deleted successfully"}





