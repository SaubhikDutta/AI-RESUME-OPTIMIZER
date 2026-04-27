import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // =============================
  // FETCH RESUMES
  // =============================
  const fetchResumes = async () => {
    try {
      const res = await API.get("/resume/my");
      setResumes(res.data);
    } catch (err) {
      console.log(err);
      alert("Unauthorized, login again");
      localStorage.removeItem("token");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // FETCH USER
  // =============================
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // LOGOUT
  // =============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchResumes();
    fetchUser();
  }, []);

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>Your Saved Resumes</h2>
          {user && <p>Welcome: {user.email}</p>}
        </div>

        <div>
          {/* ✅ NEW BUTTON (Analyze Resume) */}
          <button
            onClick={() => (window.location.href = "/")}
            style={styles.analyzeBtn}
          >
            Analyze Resume
          </button>

          {/* LOGOUT BUTTON */}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p>No resumes found</p>
      ) : (
        resumes.map((r) => (
          <div key={r._id} style={styles.card}>
            <h3>{r.data?.name || "No Name"}</h3>
            <p>
              <strong>ATS Score:</strong> {r.atsScore || 0}%
            </p>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    marginLeft: "10px",
    padding: "8px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  analyzeBtn: {
    padding: "8px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
  },
};

export default Dashboard;