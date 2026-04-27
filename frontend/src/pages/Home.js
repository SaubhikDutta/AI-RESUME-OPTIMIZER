import React, { useState } from "react";

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file); // MUST match backend

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setScore(data.score);
      } else {
        alert(data.msg || "Analysis failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>AI Resume Analyzer</h1>

      <div style={styles.card}>
        {/* FILE INPUT */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* BUTTON */}
        <button onClick={handleSubmit} style={styles.button}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* RESULT */}
        {score !== null && (
          <div style={styles.result}>
            ATS Score: {score}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    color: "white",
  },
  card: {
    marginTop: "30px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default Home;