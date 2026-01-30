const BASE_URL = "http://127.0.0.1:8000";

let isSubmitting = false;

async function handleLogin(event) {
  event.preventDefault();
  if (isSubmitting) return;

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;

  const role = form.role.value;
  const email = form.email.value;
  const password = form.password.value;

  let endpoint = "";
  if (role === "user") {
    endpoint = "/users/login";
  } else if (role === "lawyer") {
    endpoint = "/lawyers/login";
  } else {
    alert("Please select a role");
    return;
  }

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.innerText = "Logging in...";

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id || data.lawyer_id); // Handle both ID types
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", role); // Store role
      if (data.status) {
        localStorage.setItem("status", data.status);
      }

      alert("Login successful!");

      if (role === "user") {
        window.location.href = "../index.html";
      } else if (role === "lawyer") {
        if (data.status === "pending") {
          alert("Your account is pending approval by Admin.");
          // Optional: Redirect to a 'pending' page or stay here. 
          // For now, let them go to dashboard but maybe restrict actions? 
          // Or typically, don't allow login at all? 
          // The user request implies: "lawyers register panna home.html page ku poganum"
          // So we redirect home.html.
          window.location.href = "../pages/home.html";
        } else {
          window.location.href = "../pages/home.html";
        }
      }

    } else {
      alert(data.detail || "Login failed");
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerText = originalBtnText;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.innerText = originalBtnText;
  }
}
