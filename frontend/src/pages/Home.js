import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [template, setTemplate] = useState("simple");
  const [result, setResult] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  // ================= AUTH =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const token = localStorage.getItem("token");

  // ================= ERROR =================
  const handleAuthError = (res) => {
    if (res.status === 401) {
      alert("Session expired. Login again.");
      localStorage.removeItem("token");
      navigate("/login");
      return true;
    }
    return false;
  };

  // ================= OPTIMIZE =================
  const handleOptimize = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      return alert("Provide Resume + JD");
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/resume/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeText,
          jobDesc,
          template,
        }),
      });

      if (handleAuthError(res)) return;

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Optimization failed");
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  // ================= MATCH =================
  const handleMatch = async () => {
    if (!resumeText.trim()) return alert("Provide resume first");

    try {
      const res = await fetch("http://localhost:5000/api/resume/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeText,
          jobDesc,
        }),
      });

      if (handleAuthError(res)) return;

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Match failed");
        return;
      }

      setMatchData(data);
    } catch (err) {
      console.error(err);
      alert("Match error");
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!result) return alert("Optimize first");

    try {
      const res = await fetch("http://localhost:5000/api/resume/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: result.optimizedText,
          atsScore: result.score,
        }),
      });

      if (handleAuthError(res)) return;

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Save failed");
        return;
      }

      alert("Saved successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = async () => {
  if (!result) return alert("Optimize first");

  try {
    const res = await fetch("http://localhost:5000/api/resume/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: result.optimizedText,
        photo,
        template, // 🔥 IMPORTANT FIX
      }),
    });

    if (handleAuthError(res)) return;

    if (!res.ok) {
      alert("Download failed");
      return;
    }

    // 🔥 FIXED VERSION (no corruption)
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("Download failed");
  }
};

  // ================= FILE UPLOAD =================
  const uploadPDF = async (file, setter) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/resume/upload-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (handleAuthError(res)) return;

      const data = await res.json();

      if (!data.text) {
        alert("Parsing failed");
        return;
      }

      setter(data.text);
    } catch {
      alert("Upload error");
    }
  };

  const handleResumeUpload = (e) => {
    if (e.target.files[0]) {
      uploadPDF(e.target.files[0], setResumeText);
    }
  };

  const handleJDUpload = (e) => {
    if (e.target.files[0]) {
      uploadPDF(e.target.files[0], setJobDesc);
    }
  };

 const handlePhoto = (e) => {
  const file = e.target.files[0];

  const reader = new FileReader();
  reader.onloadend = () => {
    setPhoto(reader.result); // ✅ base64
  };

  reader.readAsDataURL(file);
};

  // ================= UI =================
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">CareerForge</h2>

        <button className="nav-item active" onClick={() => navigate("/")}>
          Dashboard
        </button>

        <button className="nav-item" onClick={() => navigate("/dashboard")}>
          Resume
        </button>

        <button className="nav-item" onClick={() => navigate("/analytics")}>
          Analytics
        </button>

        <button className="nav-item" onClick={() => navigate("/settings")}>
          Settings
        </button>
      </div>

      {/* MAIN */}
      <div className="main">
        <h1>CareerForge Pro 🚀</h1>

        <div className="main-grid">
          {/* LEFT PANEL */}
          <div className="card">
            <h3>Resume</h3>
            <input type="file" onChange={handleResumeUpload} />
            <textarea
              placeholder="Paste Resume..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />

            <h3>Job Description</h3>
            <input type="file" onChange={handleJDUpload} />
            <textarea
              placeholder="Paste Job Description..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />

            <h3>Upload Photo</h3>
            <input type="file" onChange={handlePhoto} />

            <select onChange={(e) => setTemplate(e.target.value)}>
              <option value="simple">Simple</option>
              <option value="modern">Modern</option>
              <option value="professional">Professional</option>
            </select>

            <button className="button-primary" onClick={handleOptimize}>
              {loading ? "Optimizing..." : "Optimize Resume"}
            </button>

            <button className="button-secondary" onClick={handleMatch}>
              Check Job Match
            </button>
          </div>

          {/* RIGHT PANEL */}
          {result && (
            <div className="result-card">
              <h2>ATS Score: {result.score}</h2>

              <div className="output-box">
                {result.optimizedText}
              </div>

              <button className="button-primary" onClick={handleSave}>
                Save Resume
              </button>

              <button className="button-secondary" onClick={handleDownload}>
                Download PDF
              </button>

              {matchData && (
                <div className="match-section">
                  <h3>Match Score: {matchData.matchScore}%</h3>

                  <div className="skills-section">
                    <div>
                      <h4>Matched Skills</h4>
                      <ul>
                        {matchData.matchedSkills.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4>Missing Skills</h4>
                      <ul>
                        {matchData.missingSkills.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {matchData.recommendations.map((job, i) => (
                    <div key={i} className="job-card">
                      <div className="job-row">
                        <span>{job.title}</span>
                        <span>{job.company}</span>
                      </div>

                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${job.chance}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;