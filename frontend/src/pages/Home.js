import React, { useState, useEffect } from "react";

function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [template, setTemplate] = useState("simple");

  // 🔥 NEW STATE (JOB MATCH)
  const [matchData, setMatchData] = useState(null);

  // ============================
  // 🔐 AUTH CHECK
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  // ============================
  // 🚀 OPTIMIZE
  // ============================
  const handleOptimize = async () => {
    if (!resumeText || !jobDesc) {
      alert("Fill all fields");
      return;
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
        }),
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Error optimizing resume");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 💾 SAVE
  // ============================
  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/resume/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: result.optimizedText,   // 🔥 IMPORTANT FIX
        atsScore: result.score,       // 🔥 IMPORTANT FIX
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Saved!");
    } else {
      alert(data.msg || "Save failed");
    }

  } catch (err) {
    alert("Error saving resume");
  }
};

  // ============================
  // 🔥 JOB MATCH (UPDATED)
  // ============================
  const handleMatch = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!resumeText || !jobDesc) {
        alert("Fill resume + job description");
        return;
      }

      const res = await fetch("http://localhost:5000/api/resume/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeText, jobDesc }),
      });

      const data = await res.json();

      // ❌ REMOVE alert
      // ✅ SET STATE
      setMatchData(data);

    } catch (err) {
      console.error(err);
      alert("Match error");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.logo}>CareerForge Pro 🚀</h1>

      <div style={styles.card}>
        <textarea
          placeholder="Paste Resume..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={styles.textarea}
        />

        <textarea
          placeholder="Paste Job Description..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={styles.textarea}
        />

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={styles.select}
        >
          <option value="simple">Simple</option>
          <option value="modern">Modern</option>
          <option value="professional">Professional</option>
        </select>

        <button style={styles.primaryBtn} onClick={handleOptimize}>
          {loading ? "Analyzing..." : "Optimize Resume"}
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

      {/* ================= RESULT ================= */}
      {result && (
        <div style={styles.resultCard}>
          <h2>ATS Score: {result.score}</h2>

          <pre style={styles.output}>{result.optimizedText}</pre>

          <button style={styles.primaryBtn} onClick={handleSave}>
            Save Resume
          </button>
        </div>
      )}

      {/* ================= JOB MATCH BOX ================= */}
      {matchData && (
        <div style={styles.resultCard}>
          <h2>Job Match Result</h2>

          <p><b>Score:</b> {matchData.matchScore}%</p>
          <p><b>Status:</b> {matchData.message}</p>

          <h4>Eligible Roles:</h4>
          <ul>
            {matchData.roles.map((role, i) => (
              <li key={i}>{role}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    padding: "30px",
    textAlign: "center",
    color: "white",
  },
  logo: {
    color: "#38bdf8",
    marginBottom: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
    width: "80%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    background: "#020617",
    border: "1px solid #334155",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    height: "120px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    background: "#020617",
    color: "white",
    border: "1px solid #334155",
  },
  primaryBtn: {
    background: "#3b82f6",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#9333ea",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: "20px",
    padding: "20px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  output: {
    background: "#020617",
    padding: "10px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    textAlign: "left",
  },
};

export default Home;