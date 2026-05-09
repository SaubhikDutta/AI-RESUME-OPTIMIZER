import { FileText, Trash2, Edit, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeCard({ resume, onEdit, onDelete, onDownload }) {
  const date = new Date(resume.createdAt).toLocaleDateString();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="resume-card glass-card"
    >
      <div className="resume-icon"><FileText size={28}/></div>
      <h4>{resume.title || "Untitled"}</h4>
      <p className="muted">{date}</p>
      <div className="badge-row">
        <span className="badge">ATS: {resume.atsScore || 0}</span>
        <span className="badge alt">{resume.template}</span>
      </div>
      <div className="card-actions">
        <button onClick={() => onEdit(resume)} title="Edit"><Edit size={16}/></button>
        <button onClick={() => onDownload(resume)} title="Download"><Download size={16}/></button>
        <button onClick={() => onDelete(resume._id)} className="danger" title="Delete"><Trash2 size={16}/></button>
      </div>
    </motion.div>
  );
}