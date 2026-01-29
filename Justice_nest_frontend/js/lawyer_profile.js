const BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    fetchProfile();
});

async function fetchProfile() {
    const lawyer_id = localStorage.getItem("user_id");
    if (!lawyer_id) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/lawyers/${lawyer_id}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById("name").value = data.name;
            document.getElementById("email").value = data.email;
            document.getElementById("phone_number").value = data.phone_number;
            document.getElementById("city").value = data.city;
            document.getElementById("specialization").value = data.specialization;
            document.getElementById("years_of_experience").value = data.years_of_experience;
            document.getElementById("fees_range").value = data.fees_range;
            document.getElementById("current-photo").src = data.photo_url || "https://via.placeholder.com/100";
        } else {
            alert("Failed to fetch profile");
        }
    } catch (e) {
        console.error(e);
    }
}

document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const lawyer_id = localStorage.getItem("user_id");
    const formData = new FormData(e.target);

    // Remove empty photo if not selected (FormData handles file input automatically, sending empty file object if not selected)
    // Backend expects 'photo' as UploadFile = File(None). If file is empty, it might be an issue?
    // Let's check backend. `photo: Optional[UploadFile] = File(None)`.
    // If I send an empty file, `photo` might not be None but an empty object.
    // Python FastAPI `UploadFile` usually handles empty if optional properly, or I should omit it.
    // In JS FormData, if input type file is empty, it sends a file with name "" and size 0.
    // It's safer to delete it if size is 0, but FormData manipulation is tricky.
    // Let's rely on backend checking or just try.
    // Or I can reconstruct FormData.

    const cleanData = new FormData();
    cleanData.append("name", document.getElementById("name").value);
    cleanData.append("phone_number", document.getElementById("phone_number").value);
    cleanData.append("city", document.getElementById("city").value);
    cleanData.append("specialization", document.getElementById("specialization").value);
    cleanData.append("fees_range", document.getElementById("fees_range").value);
    cleanData.append("years_of_experience", document.getElementById("years_of_experience").value);

    const fileInput = document.querySelector('input[name="photo"]');
    if (fileInput.files.length > 0) {
        cleanData.append("photo", fileInput.files[0]);
    }

    try {
        const response = await fetch(`${BASE_URL}/lawyers/${lawyer_id}`, {
            method: "PUT",
            body: cleanData
        });
        const res = await response.json();

        if (response.ok) {
            alert("Profile Updated Successfully!");
            location.reload();
        } else {
            alert(res.detail || "Update Failed");
        }
    } catch (e) {
        console.error(e);
        alert("Server Error");
    }
});
