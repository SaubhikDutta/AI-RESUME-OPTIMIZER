import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import ATSScoreCard from "../components/ATSScoreCard";
import {
  matchResume,
  optimizeResume,
} from "../services/resumeService";
import { useToast } from "../context/ToastContext";

export default function ATSMatch() {
  const [text, setText] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const run = async () => {
    if (!text || !jd) {
      return showToast(
        "Both resume and JD required",
        "error"
      );
    }

    setLoading(true);

    try {
      const { data } = await matchResume({
        text,
        jobDescription: jd,
      });

      setResult(data);
    } catch (error) {
      console.log(error);
      showToast("Failed", "error");
    }

    setLoading(false);
  };

  const optimize = async () => {
    setLoading(true);

    try {
      const { data } = await optimizeResume({
        text,
        jobDescription: jd,
      });

      setOptimized(data);

      showToast("Resume optimized!", "success");
    } catch (error) {
      console.log(error);
      showToast("Failed", "error");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>
            JD <span className="accent">Match</span>
          </h1>

          <p className="muted">
            Compare your resume against any job
            description with AI precision.
          </p>

          <div className="grid-2">
            <GlassCard>
              <h4>Your Resume</h4>

              <textarea
                rows={10}
                className="big-textarea"
                placeholder="Paste resume text..."
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
              />
            </GlassCard>

            <GlassCard>
              <h4>Target Job Description</h4>

              <textarea
                rows={10}
                className="big-textarea"
                placeholder="Paste job description..."
                value={jd}
                onChange={(e) =>
                  setJd(e.target.value)
                }
              />
            </GlassCard>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <NeonButton
              onClick={run}
              disabled={loading}
            >
              Match Against JD
            </NeonButton>

            <NeonButton
              variant="ghost"
              onClick={optimize}
              disabled={loading || !jd}
            >
              AI Optimize
            </NeonButton>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="result-grid"
            >
              <ATSScoreCard
                score={result.matchPercent}
                label="JD Match"
              />

              <GlassCard>
                <h3>
                  Matched Keywords (
                  {result.matchedKeywords.length})
                </h3>

                <div className="chip-row">
                  {result.matchedKeywords
                    .slice(0, 20)
                    .map((k) => (
                      <span
                        key={k}
                        className="chip success"
                      >
                        {k}
                      </span>
                    ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3>
                  Missing Keywords (
                  {result.missingKeywords.length})
                </h3>

                <div className="chip-row">
                  {result.missingKeywords
                    .slice(0, 20)
                    .map((k) => (
                      <span
                        key={k}
                        className="chip danger"
                      >
                        {k}
                      </span>
                    ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {optimized && (
            <GlassCard className="optimized-block">
              <h3>
                🤖 AI Optimized Resume
              </h3>

              <p className="muted">
                New ATS Score:
                <strong>
                  {" "}
                  {
                    optimized.analysis
                      .atsScore
                  }
                  /100
                </strong>
              </p>

              <pre className="code-block">
                {optimized.optimizedText}
              </pre>

              <h4>Improvements</h4>

              <ul className="check-list">
                {optimized.improvements.map(
                  (s, i) => (
                    <li key={i}>
                      → {s}
                    </li>
                  )
                )}
              </ul>
            </GlassCard>
          )}
        </motion.div>
      </main>
    </div>
  );
}