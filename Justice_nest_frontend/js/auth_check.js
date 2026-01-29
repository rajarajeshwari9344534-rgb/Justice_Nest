document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

function updateNavbar() {
    const primaryNav = document.querySelector(".primary-nav");
    const navActions = document.querySelector(".nav-actions");

    if (!primaryNav || !navActions) return;

    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");

    // Detect if we are in the /pages/ directory
    const pathParts = window.location.pathname.split("/");
    const isInPagesFolder = pathParts.includes("pages");
    const base = isInPagesFolder ? "../" : "";
    const pBase = isInPagesFolder ? "" : "pages/";

    // 1. Update PRIMARY NAV
    let navHTML = "";

    if (token && role === "lawyer") {
        navHTML = `
            <a class="nav-link" href="${base}pages/message.html">Message</a>
            <a class="nav-link" href="${base}pages/my_cases.html">My Cases</a>
            <a class="nav-link" href="${base}pages/lawyer_profile.html">Profile</a>
        `;
    } else {
        navHTML = `
            <a class="nav-link" href="${base}index.html">Home</a>
            <a class="nav-link" href="${base}pages/lawyer.html">Find Lawyers</a>
        `;
        if (token && role === "user") {
            navHTML += `
                <a class="nav-link" href="${base}pages/list.html">My Complaints</a>
                <a class="nav-link" href="${base}pages/message.html">Messages</a>
            `;
        }
    }

    navHTML += `<a class="nav-link" href="${base}pages/about.html">About</a>`;
    primaryNav.innerHTML = navHTML;

    // 2. Update NAV ACTIONS
    if (token) {
        if (role === "lawyer") {
            navActions.innerHTML = `
                <button class="btn btn-outline" onclick="handleGlobalLogout()">Logout</button>
            `;
        } else {
            navActions.innerHTML = `
                <a class="btn btn-primary" href="${base}pages/complaint.html">Register Complaint</a>
                <button class="btn btn-outline" onclick="handleGlobalLogout()">Logout</button>
            `;
        }
    } else {
        navActions.innerHTML = `
            <a class="btn btn-primary" href="${base}pages/complaint.html">Register Complaint</a>
            <a class="btn btn-outline" href="${base}pages/login.html">Login/Signup</a>
        `;
    }
}

function handleGlobalLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("status");

    // Redirect to home page
    const pathParts = window.location.pathname.split("/");
    const isInPagesFolder = pathParts.includes("pages");
    window.location.href = isInPagesFolder ? "../index.html" : "index.html";
}
