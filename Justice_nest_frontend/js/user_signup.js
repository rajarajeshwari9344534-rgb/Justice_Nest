const BASE_URL = "http://127.0.0.1:8000";

async function userSignup(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: fullname,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Signup successful! Please login.");
      window.location.href = "login.html";
    } else {
      let errorMsg = "Signup failed";
      if (typeof data.detail === "string") {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map(err => err.msg).join("\n");
      }
      alert(errorMsg);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during signup.");
  }
}
