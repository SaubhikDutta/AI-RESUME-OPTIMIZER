import React, { useEffect, useState } from "react";

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/resume/all", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((resumes) => setData(resumes));
  }, []);

  const avgScore =
    data.length > 0
      ? (data.reduce((a, b) => a + b.atsScore, 0) / data.length).toFixed(2)
      : 0;

  return (
    <div className="main">
      <h1>Analytics</h1>

      <div className="analytics">
        <div className="analytics-card">
          <h3>Total Resumes</h3>
          <p>{data.length}</p>
        </div>

        <div className="analytics-card">
          <h3>Average ATS Score</h3>
          <p>{avgScore}</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;