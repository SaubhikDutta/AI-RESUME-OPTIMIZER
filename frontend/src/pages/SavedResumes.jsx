import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ResumeCard from "../components/ResumeCard";
import { getMyResumes, deleteResume, downloadResume } from "../services/resumeService";
import { useToast } from "../context/ToastContext";

export default function SavedResumes() {
  const [resumes, setResumes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = () => getMyResumes().then(({data}) => setResumes(data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await deleteResume(id);
    showToast("Deleted", "success");
    load();
  };

const handleDownload = async (r) => {
  try {
    const pdfBlob = await downloadResume({
      text: r.text,
      template: r.template,
      name: r.title,
    });

    const blob = new Blob([pdfBlob], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${r.title}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
    showToast("Download failed", "error");
  }
};

  const filtered = resumes.filter((r) => r.title?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1>Saved <span className="accent">Resumes</span></h1>
          <div className="search-bar glass-card">
            <Search size={16}/>
            <input placeholder="Search resumes..." value={filter} onChange={(e) => setFilter(e.target.value)}/>
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_,i) => <div key={i} className="skeleton-card"/>)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="muted center">No resumes yet.</p>
          ) : (
            <div className="grid-3">
              {filtered.map((r) => (
                <ResumeCard key={r._id} resume={r}
                  onEdit={(r) => navigate(`/editor/${r._id}`)}
                  onDelete={handleDelete}
                  onDownload={handleDownload}/>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}