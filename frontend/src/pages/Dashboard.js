import React, { useEffect, useState } from "react";

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState("");

  // ============================
  // FETCH RESUMES (FIXED)
  // ============================
  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/resume/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to load resumes");
      }

      setResumes(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ============================
  // DELETE
  // ============================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/resume/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      fetchResumes();

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ============================
  // EDIT
  // ============================
  const openEditModal = (id, text) => {
    setEditId(id);
    setEditText(text);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/resume/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editText }),
        }
      );

      if (!res.ok) throw new Error();

      setShowModal(false);
      fetchResumes();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // ============================
  // DOWNLOAD
  // ============================
  const handleDownload = async (text) => {
    try {
      const token = localStorage.getItem("token");

      if (!text?.trim()) {
        alert("No resume content");
        return;
      }

      const res = await fetch("http://localhost:5000/api/resume/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();

    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // ============================
  // ATS COLOR
  // ============================
  const getATSColor = (score) => {
    if (!score) return "#64748b";
    if (score < 40) return "#ef4444";
    if (score < 70) return "#facc15";
    return "#22c55e";
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>CareerForge Pro 🚀</h1>

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => (window.location.href = "/")}
          >
            Analyze Resume
          </button>

          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <h2 style={styles.title}>Your Saved Resumes</h2>

      {loading ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p style={styles.empty}>No resumes found</p>
      ) : (
        <div style={styles.grid}>
          {resumes.map((r) => (
            <div key={r._id} style={styles.card}>
              
              <div style={styles.cardTop}>
                <span
                  style={{
                    ...styles.score,
                    background: getATSColor(r.atsScore),
                  }}
                >
                  ATS: {r.atsScore || 0}
                </span>

                <span style={styles.date}>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              <div style={styles.resume}>
                {r.text || "No resume content"}
              </div>

              <div style={styles.cardActions}>
                <button
                  style={styles.editBtn}
                  onClick={() => openEditModal(r._id, r.text)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>

                <button
                  style={styles.downloadBtn}
                  onClick={() => handleDownload(r.text)}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Resume</h3>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={styles.modalTextarea}
            />

            <div style={{ marginTop: "10px" }}>
              <button style={styles.primaryBtn} onClick={handleUpdate}>
                Save
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================
// STYLES (unchanged)
// ============================
const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#020617",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "#38bdf8" },
  actions: { display: "flex", gap: "10px" },
  primaryBtn: {
    background: "#3b82f6",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#ef4444",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  title: { marginTop: "20px" },
  empty: { opacity: 0.6 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#0f172a",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #1e293b",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  score: {
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px",
  },
  date: { fontSize: "12px", opacity: 0.7 },
  resume: {
    background: "#020617",
    padding: "10px",
    borderRadius: "6px",
    height: "150px",
    overflow: "auto",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    marginBottom: "10px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  editBtn: {
    background: "#3b82f6",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    color: "white",
  },
  deleteBtn: {
    background: "#f59e0b",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    color: "white",
  },
  downloadBtn: {
    background: "#22c55e",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    color: "white",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "10px",
    width: "60%",
  },
  modalTextarea: {
    width: "100%",
    height: "200px",
    padding: "10px",
    borderRadius: "8px",
    background: "#020617",
    color: "white",
    border: "1px solid #334155",
  },
  cancelBtn: {
    background: "#64748b",
    border: "none",
    padding: "8px",
    color: "white",
    borderRadius: "6px",
    marginLeft: "10px",
  },
};

export default Dashboard;