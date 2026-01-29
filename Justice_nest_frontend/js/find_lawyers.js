const BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    fetchApprovedLawyers();
});

async function fetchApprovedLawyers() {
    try {
        const response = await fetch(`${BASE_URL}/lawyers/`);
        const lawyers = await response.json();

        const container = document.querySelector(".lawyer-grid");
        container.innerHTML = "";

        if (lawyers.length === 0) {
            container.innerHTML = "<p>No verified lawyers found yet.</p>";
            return;
        }

        lawyers.forEach(l => {
            const card = document.createElement("div");
            card.className = "lawyer-card card";
            card.innerHTML = `
                <div class="lawyer-photo-container">
                    <img src="${l.photo_url || '../assets/default-lawyer.png'}" class="lawyer-photo" alt="Lawyer">
                </div>
                <div class="lawyer-info">
                  <div class="lawyer-header">
                    <h3>${l.name}</h3>
                    <span class="spec-tag">${l.specialization}</span>
                  </div>
                  
                  <div class="lawyer-details">
                    <p><i class="icon">📍</i> ${l.city || 'National Practice'}</p>
                    <p><i class="icon">⏳</i> ${l.years_of_experience} Years Experience</p>
                    <p><i class="icon">💳</i> Fees: ${l.fees_range}</p>
                  </div>

                  <div class="lawyer-contact-info">
                    <p><strong>📞 Phone:</strong> ${l.phone_number}</p>
                  </div>

                  <button class="btn btn-primary btn-contact" onclick="sendInquiry(${l.id}, '${l.name}')" style="width: 100%; margin-top: 20px;">
                    💬 Message Lawyer
                  </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

function sendInquiry(lawyerId, name) {
    if (!localStorage.getItem("user_id")) {
        alert("Please login as a user to message lawyers.");
        window.location.href = "login.html";
        return;
    }
    window.location.href = `message.html?lawyer_id=${lawyerId}`;
}
