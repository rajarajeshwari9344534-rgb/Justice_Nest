const BASE_URL = "http://127.0.0.1:8000";

let isSubmitting = false;

function lawyerSignup(event) {
  event.preventDefault();
  if (isSubmitting) return;

  const form = document.querySelector(".register-form");
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;

  const formData = new FormData(form);

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.innerText = "Registering...";

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
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        return;
      }

      alert("Lawyer registered successfully ✅");
      window.location.href = "home.html"; // redirect to home
    })
    .catch((error) => {
      console.error(error);
      alert("Server error ❌");
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    });
}
