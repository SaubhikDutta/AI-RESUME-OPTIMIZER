import React, { useEffect, useState } from "react";

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);

  const [template, setTemplate] = useState("simple"); // ✅ NEW

  // ================= FETCH =================
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/resume/my", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setResumes(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/resume/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const openEditModal = (id, text) => {
    setEditId(id);
    setEditText(text);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/resume/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ text: editText }),
      });

      setShowModal(false);
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = async (text) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/resume/download",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
         body: JSON.stringify({ text, template }),
        }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= PARSER (SAFE FOR POPPLER TEXT) =================
  const parseResume = (text) => {
    const lines = text.split("\n").filter((l) => l.trim() !== "");

    return {
      name: lines[0] || "No Name",
      content: lines.slice(1).join("\n"),
    };
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>CareerForge Dashboard 🚀</h1>

      {/* TEMPLATE SELECT */}
      <div style={{ marginBottom: "20px" }}>
        <label>Choose Template: </label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="simple">Simple</option>
          <option value="modern">Modern</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p>No resumes found</p>
      ) : (
        resumes.map((r) => {
          const parsed = parseResume(r.text);

          return (
            <div
              key={r._id}
              className={`resume-card ${template}`} // ✅ TEMPLATE APPLIED
              style={{ marginBottom: "20px" }}
            >
              <p>
                <strong>ATS Score:</strong> {r.atsScore}
              </p>

              <h2>{parsed.name}</h2>

              <pre style={{ whiteSpace: "pre-wrap" }}>
                {parsed.content}
              </pre>

              {/* ACTIONS */}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => openEditModal(r._id, r.text)}>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(r._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>

                <button
                  onClick={() => handleDownload(r.text)}
                  style={{ marginLeft: "10px" }}
                >
                  Download
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#222", padding: "20px", width: "400px" }}>
            <h3>Edit Resume</h3>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: "100%", height: "150px" }}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleUpdate}>Save</button>

              <button
                onClick={() => setShowModal(false)}
                style={{ marginLeft: "10px" }}
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

export default Dashboard;