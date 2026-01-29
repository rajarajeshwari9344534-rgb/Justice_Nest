const BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    fetchMyComplaints();
});

async function fetchMyComplaints() {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("Please login to view your complaints");
        window.location.href = "../pages/login.html";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/complaints/user/${user_id}`);
        const complaints = await response.json();

        const container = document.querySelector(".complaint-container");
        container.innerHTML = "";

        if (complaints.length === 0) {
            container.innerHTML = "<p>No complaints found.</p>";
            return;
        }

        complaints.forEach(c => {
            const card = document.createElement("div");
            card.className = "complaint-card card";

            const statusClass = c.status === "resolved" ? "status resolved" : "status pending";
            const statusText = c.status ? c.status.toUpperCase() : "PENDING";

            card.innerHTML = `
                <div class="card-header">
                    <h3>${c.name} <small>(#${c.id})</small></h3>
                    <span class="${statusClass}">${statusText}</span>
                </div>
                <div class="card-body">
                    <p><strong>City:</strong> ${c.city}</p>
                    <p><strong>State:</strong> ${c.state}</p>
                    <div class="description">${c.complaint_details}</div>
                    <div class="card-footer">
                        <span>${new Date(c.created_at).toLocaleDateString()}</span>
                        <div class="actions">
                            <button class="edit-btn" onclick='openEditModal(${JSON.stringify(c)})'>Edit</button>
                            <button class="delete-btn" onclick="deleteComplaint(${c.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

async function deleteComplaint(id) {
    if (!confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) return;

    try {
        const response = await fetch(`${BASE_URL}/complaints/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Complaint deleted successfully.");
            fetchMyComplaints();
        } else {
            alert("Failed to delete complaint.");
        }
    } catch (e) {
        console.error(e);
    }
}

function openEditModal(c) {
    const modal = document.getElementById("edit-modal");
    document.getElementById("edit-id").value = c.id;
    document.getElementById("edit-name").value = c.name;
    document.getElementById("edit-city").value = c.city;
    document.getElementById("edit-state").value = c.state;
    document.getElementById("edit-details").value = c.complaint_details;

    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

async function handleEditSubmit(event) {
    event.preventDefault();
    const id = document.getElementById("edit-id").value;
    const formData = new FormData();
    formData.append("name", document.getElementById("edit-name").value);
    formData.append("city", document.getElementById("edit-city").value);
    formData.append("state", document.getElementById("edit-state").value);
    formData.append("complaint_details", document.getElementById("edit-details").value);

    const fileInput = document.getElementById("edit-file");
    if (fileInput && fileInput.files[0]) {
        formData.append("file", fileInput.files[0]);
    }

    try {
        const response = await fetch(`${BASE_URL}/complaints/${id}`, {
            method: "PUT",
            body: formData
        });

        if (response.ok) {
            alert("Complaint updated successfully!");
            closeModal();
            fetchMyComplaints();
        } else {
            alert("Update failed.");
        }
    } catch (e) {
        console.error(e);
    }
}

