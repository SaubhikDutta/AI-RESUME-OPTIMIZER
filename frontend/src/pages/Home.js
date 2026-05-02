import React, { useState, useEffect } from "react";

function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [template, setTemplate] = useState("simple");
  const [matchData, setMatchData] = useState(null);
  const [photo, setPhoto] = useState(null);

  // ============================
  // AUTH CHECK
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  // ============================
  // OPTIMIZE
  // ============================
  const handleOptimize = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      return alert("Provide Resume + Job Description");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

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
          photo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Optimization failed");
        return;
      }

      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // MATCH
  // ============================
  const handleMatch = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/resume/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeText, jobDesc }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Match failed");
        return;
      }

      setMatchData(data);

    } catch (err) {
      console.error(err);
      alert("Match failed");
    }
  };

  // ============================
  // SAVE (🔥 NEW)
  // ============================
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!result || !result.optimizedText) {
        alert("Optimize first");
        return;
      }

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

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Save failed");
        return;
      }

      alert("Resume saved successfully");

    } catch (err) {
      console.error(err);
      alert("Save error");
    }
  };

  // ============================
  // PDF UPLOAD
  // ============================
  const uploadPDF = async (file, setState, label) => {
    const token = localStorage.getItem("token");

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

      const data = await res.json();

      if (!res.ok || !data.text) {
        alert(`${label} parsing failed`);
        return;
      }

      setState(data.text);
      alert(`${label} loaded`);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadPDF(file, setResumeText, "Resume");
  };

  const handleJDUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadPDF(file, setJobDesc, "Job Description");
  };

  // ============================
  // PHOTO
  // ============================
  const handlePhoto = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  // ============================
  // DOWNLOAD
  // ============================
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/resume/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: result.optimizedText,
          photo,
        }),
      });

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

  return (
    <div style={styles.page}>
      <h1 style={styles.logo}>CareerForge Pro 🚀</h1>

      <div style={styles.card}>
        <h3>Resume</h3>
        <input type="file" accept=".pdf" onChange={handleResumeUpload} />
        <textarea
          placeholder="Paste Resume..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={styles.textarea}
        />

        <h3>Job Description</h3>
        <input type="file" accept=".pdf" onChange={handleJDUpload} />
        <textarea
          placeholder="Paste Job Description..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={styles.textarea}
        />

        <h3>Upload Photo</h3>
        <input type="file" onChange={handlePhoto} />

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={styles.select}
        >
          <option value="simple">Simple</option>
          <option value="modern">Modern</option>
          <option value="professional">Professional</option>
        </select>

        {/* BUTTONS */}
        <button style={styles.primaryBtn} onClick={handleOptimize}>
          {loading ? "Optimizing..." : "Optimize Resume"}
        </button>

        <button style={styles.secondaryBtn} onClick={handleMatch}>
          Check Job Match
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={styles.resultCard}>
          <h2>ATS Score: {result.score}</h2>
          <pre style={styles.output}>{result.optimizedText}</pre>

          <button style={styles.primaryBtn} onClick={handleSave}>
            Save Resume
          </button>

          <button style={styles.primaryBtn} onClick={handleDownload}>
            Download PDF
          </button>
        </div>
      )}

      {/* MATCH */}
      {matchData && (
        <div style={styles.resultCard}>
          <h2>Job Match</h2>
          <p>Score: {matchData.matchScore}</p>
        </div>
      )}
    </div>
  );
}

// ============================
// STYLES
// ============================
const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    padding: "30px",
    color: "white",
    textAlign: "center",
  },
  logo: { color: "#38bdf8" },
  card: {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "12px",
    width: "70%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    height: "120px",
    background: "#020617",
    color: "white",
    border: "1px solid #334155",
    padding: "10px",
  },
  select: {
    padding: "10px",
    background: "#020617",
    color: "white",
  },
  primaryBtn: {
    background: "#3b82f6",
    padding: "10px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#9333ea",
    padding: "10px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: "20px",
    padding: "20px",
    background: "#0f172a",
    width: "70%",
    marginInline: "auto",
  },
  output: {
    whiteSpace: "pre-wrap",
    textAlign: "left",
  },
};

export default Home;