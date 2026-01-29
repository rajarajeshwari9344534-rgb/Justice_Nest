const BASE_URL = "http://127.0.0.1:8000";

function lawyerSignup(event) {
  event.preventDefault();

  const form = document.querySelector(".register-form");
  const formData = new FormData(form);

  fetch(`${BASE_URL}/lawyers/`, {
    method: "POST",
    body: formData
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        let errorMsg = "Registration failed ❌";
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map(err => err.msg).join("\n");
        }
        alert(errorMsg);
        return;
      }

      alert("Lawyer registered successfully ✅");
      window.location.href = "home.html"; // redirect to home
    })
    .catch((error) => {
      console.error(error);
      alert("Server error ❌");
    });
}
