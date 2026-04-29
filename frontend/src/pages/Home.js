import React, { useState, useEffect } from "react";

function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [template, setTemplate] = useState("simple");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

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
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ MAIN FIX IS HERE
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/resume/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: result.optimizedText,   // ✅ FIXED
          atsScore: result.score,       // ✅ FIXED
        }),
      });

      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving resume");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.logo}>CareerForge Pro 🚀</h1>

      <div style={styles.card}>
        {/* Resume */}
        <textarea
          placeholder="Paste Resume..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={styles.textarea}
        />

        {/* Job Desc */}
        <textarea
          placeholder="Paste Job Description..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={styles.textarea}
        />

        {/* Template */}
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={styles.select}
        >
          <option value="simple">Simple</option>
          <option value="modern">Modern</option>
          <option value="professional">Professional</option>
        </select>

        {/* Optimize */}
        <button style={styles.primaryBtn} onClick={handleOptimize}>
          {loading ? "Analyzing..." : "Optimize Resume"}
        </button>

        {/* Dashboard */}
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
          <h3>ATS Score: {result.score}</h3>

          <pre style={styles.output}>{result.optimizedText}</pre>

          <button style={styles.primaryBtn} onClick={handleSave}>
            Save Resume
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    padding: "30px",
    textAlign: "center",
  },

  logo: {
    color: "#38bdf8",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    width: "80%",
    margin: "20px auto",
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
    background: "#0ea5e9",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "#1e293b",
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
    margin: "20px auto",
  },

  output: {
    whiteSpace: "pre-wrap",
    textAlign: "left",
    background: "#020617",
    padding: "10px",
    borderRadius: "8px",
    color: "white",
  },
};

export default Home;