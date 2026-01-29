const API_URL = "http://127.0.0.1:8000";

// Handle complaint form submission
document.addEventListener("DOMContentLoaded", function () {
  const complaintForm = document.querySelector("form");
  if (complaintForm && complaintForm.id === "complaint-form") {
    complaintForm.addEventListener("submit", handleComplaintSubmit);
  }
});

async function handleComplaintSubmit(event) {
  event.preventDefault();

  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    alert("Please login first to register a complaint");
    window.location.href = "../pages/login.html";
    return;
  }

  // Extract values for validation
  const name = document.querySelector('input[name="name"]')?.value || "";
  const number = document.querySelector('input[name="phone"]')?.value || "";
  const city = document.querySelector('input[name="city"]')?.value || "";
  const state = document.querySelector('input[name="state"]')?.value || "";
  const gender = document.querySelector('input[name="gender"]')?.value || "";
  const complaint_details = document.querySelector('textarea[name="complaint_details"]')?.value || "";

  // Validate required fields
  if (!name || !number || !city || !state || !gender || !complaint_details) {
    alert("Please fill all required fields");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("name", name);
  formData.append("number", number);
  formData.append("city", city);
  formData.append("state", state);
  formData.append("gender", gender);
  formData.append("complaint_details", complaint_details);

  const fileInput = document.getElementById("complaint_file");
  if (fileInput && fileInput.files[0]) {
    formData.append("file", fileInput.files[0]);
  }

  try {
    const response = await fetch(`${API_URL}/complaints/`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert("Complaint registered successfully! Complaint ID: " + data.complaint_id);
      event.target.reset();
      window.location.href = "../pages/list.html";
    } else {
      alert(data.detail || "Failed to register complaint");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while registering complaint");
  }
}
