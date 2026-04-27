import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [photo, setPhoto] = useState(null);
  const [template, setTemplate] = useState("modern");

  const [output, setOutput] = useState(null);
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= OPTIMIZE =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resumeText", resume);
      formData.append("jobDesc", jd);
      if (photo) formData.append("photo", photo);

      const res = await axios.post(
        "http://localhost:5000/api/resume/optimize",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setOutput(res.data.data);
      setScore(res.data.atsScore);

    } catch (err) {
      console.error(err);
      alert("Error optimizing resume");
    } finally {
      setLoading(false);
    }
  };

  // ================= DOWNLOAD PDF (FIXED) =================
  const handleDownload = async () => {
    try {
      const formData = new FormData();

      formData.append("optimized", JSON.stringify(output));
      formData.append("template", template);

      // 🔥 IMPORTANT: send image again
      if (photo) {
        formData.append("photo", photo);
      }

      const res = await axios.post(
        "http://localhost:5000/api/resume/download",
        formData,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error(err);
      alert("PDF download failed");
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/resume/save",
        output
      );
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="container">
      <h1>CareerForge Pro 🚀</h1>

      {/* Resume Input */}
      <textarea
        placeholder="Paste Resume"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />

      {/* Job Description */}
      <textarea
        placeholder="Paste Job Description"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {/* Photo Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      {/* Template Select */}
      <select onChange={(e) => setTemplate(e.target.value)}>
        <option value="modern">Modern</option>
        <option value="simple">Simple</option>
      </select>

      {/* Button */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize Resume"}
      </button>

      {/* Output */}
      {output && (
        <div className="output">
          <h3>ATS Score: {score}%</h3>

          <h2>{output.name}</h2>
          <p>
            {output.email} | {output.phone} | {output.linkedin}
          </p>

          <h3>Professional Summary</h3>
          <p>{output.summary}</p>

          <h3>Skills</h3>
          <ul>
            {output.skills?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>Experience</h3>
          <ul>
            {output.experience?.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>

          <h3>ATS Keywords</h3>
          <p>{output.keywords?.join(", ")}</p>

          {/* ACTION BUTTONS */}
          <button onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(output, null, 2))
          }>
            Copy Resume
          </button>

          <button onClick={handleDownload}>
            Download PDF
          </button>

          <button onClick={handleSave}>
            Save Resume
          </button>
        </div>
      )}
    </div>
  );
}

export default App;