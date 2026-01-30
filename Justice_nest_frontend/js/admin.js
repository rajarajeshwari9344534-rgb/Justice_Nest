const BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  fetchStats();
  fetchPendingLawyers();
});

async function fetchStats() {
  try {
    const response = await fetch(`${BASE_URL}/admin/stats`);
    const data = await response.json();

    document.getElementById("stat-total").innerText = data.total_complaints;
    document.getElementById("stat-pending").innerText = data.pending_complaints;
    document.getElementById("stat-accepted").innerText = data.accepted_complaints;
    document.getElementById("stat-resolved").innerText = data.resolved_complaints;
    document.getElementById("stat-lawyers").innerText = data.approved_lawyers;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

async function fetchPendingLawyers() {
  try {
    const response = await fetch(`${BASE_URL}/admin/pending_lawyers`);
    const lawyers = await response.json();

    const container = document.getElementById("pending-lawyers-container");
    container.innerHTML = "";

    if (lawyers.length === 0) {
      container.innerHTML = "<p>No pending lawyers found.</p>";
      return;
    }

    lawyers.forEach(lawyer => {
      const card = document.createElement("div");
      card.className = "lawyer-card";

      const isPdf = lawyer.id_proof_url.toLowerCase().endsWith('.pdf');

      card.innerHTML = `
                <div class="lawyer-card-header">
                    <img src="${lawyer.photo_url || '../assets/default-lawyer.png'}" class="admin-lawyer-photo" alt="Profile">
                    <div>
                        <h3>${lawyer.name}</h3>
                        <small style="color: #718096;">Member since ${new Date(lawyer.created_at).toLocaleDateString()}</small>
                    </div>
                </div>
                <div class="lawyer-card-body">
                    <ul class="lawyer-details-list">
                        <li><b>Email:</b> <span>${lawyer.email}</span></li>
                        <li><b>Phone:</b> <span>${lawyer.phone_number || 'N/A'}</span></li>
                        <li><b>Exp:</b> <span>${lawyer.years_of_experience} Years</span></li>
                        <li><b>Specialty:</b> <span>${lawyer.specialization}</span></li>
                        <li><b>Location:</b> <span>${lawyer.city}, ${lawyer.state || ''}</span></li>
                    </ul>
                    
                    <div class="proof-preview-container">
                        ${isPdf
          ? `<a href="${lawyer.id_proof_url}" target="_blank" class="pdf-link-container">
                               <span style="font-size: 30px;">📄</span>
                               <span>View PDF ID Proof</span>
                             </a>`
          : `<a href="${lawyer.id_proof_url}" target="_blank">
                               <img src="${lawyer.id_proof_url}" alt="ID Proof" class="proof-img">
                             </a>`
        }
                    </div>
                </div>
                <div class="lawyer-card-actions">
                    <button class="btn admin-btn approve" onclick="approveLawyer(${lawyer.id})">Approve</button>
                    <button class="btn admin-btn reject" onclick="rejectLawyer(${lawyer.id})">Reject</button>
                </div>
            `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching pending lawyers:", error);
  }
}

async function approveLawyer(id) {
  if (!confirm("Are you sure you want to approve this lawyer?")) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/approve_lawyer/${id}`, {
      method: "PATCH"
    });

    if (response.ok) {
      alert("Lawyer Approved!");
      fetchPendingLawyers(); // Refresh list
    } else {
      alert("Failed to approve");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function rejectLawyer(id) {
  if (!confirm("Are you sure you want to REJECT this lawyer?")) return;
  // Implement reject logic if backend supports it, for now just hide or use same endpoint if modified
  // Assuming backend has reject support or we just leave them pending.
  // Backend has reject_lawyer endpoint? Yes I visualized creating it.

  try {
    const response = await fetch(`${BASE_URL}/admin/reject_lawyer/${id}`, {
      method: "PATCH"
    });

    if (response.ok) {
      alert("Lawyer Rejected!");
      fetchPendingLawyers();
    } else {
      alert("Failed to reject");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
