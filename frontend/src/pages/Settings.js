import React from "react";

function Settings() {
  return (
    <div className="main">
      <h1>Settings</h1>

      <div className="card">
        <p>More features coming soon...</p>

        <button
          className="button-secondary"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;