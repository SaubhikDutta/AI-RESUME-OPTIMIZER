import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Download } from "lucide-react";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import { saveResume, getMyResumes, updateResume, downloadResume } from "../services/resumeService";
import { useToast } from "../context/ToastContext";

export default function Editor() {
  const { id } = useParams();
  const [title, setTitle] = useState("My Resume");
  const [text, setText] = useState("");
  const [template, setTemplate] = useState("modern");
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getMyResumes().then(({data}) => {
        const r = data.find((x) => x._id === id);
        if (r) { setText(r.text); setTitle(r.title); setTemplate(r.template); }
      });
    }
  }, [id]);

  const save = async () => {
    try {
      if (id) await updateResume(id, { text, title, template });
      else await saveResume({ text, title, template });
      showToast("Saved!", "success");
      navigate("/saved");
    } catch { showToast("Failed", "error"); }
  };

const download = async () => {
  try {

    const response = await downloadResume({
      text,
      template,
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    // CREATE URL
    const url = window.URL.createObjectURL(blob);

    // CREATE DOWNLOAD LINK
    const link = document.createElement("a");

    link.href = url;
    link.download = "careerforge_resume.pdf";

    document.body.appendChild(link);

    // TRIGGER DOWNLOAD
    link.click();

    // CLEANUP
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log("PDF DOWNLOAD ERROR:", error);
  }
};

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <div className="dash-head">
            <h1>Resume <span className="accent">Editor</span></h1>
            <div style={{display:"flex",gap:10}}>
              <NeonButton variant="ghost" onClick={download}><Download size={16}/> PDF</NeonButton>
              <NeonButton onClick={save}><Save size={16}/> Save</NeonButton>
            </div>
          </div>

          <GlassCard>
            <input className="title-input" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <select className="select-input" value={template} onChange={(e) => setTemplate(e.target.value)}>
              <option value="simple">Simple</option>
              <option value="modern">Modern</option>
              <option value="professional">Professional</option>
              <option value="dark">Dark</option>
              <option value="futuristic">Futuristic</option>
            </select>
            <textarea rows={20} className="big-textarea" value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write or paste your resume content here..."/>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}