import api from "./api";

export const uploadPDF = async (formData) => {
  const response = await api.post(
  "/resume/upload-pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const analyzeResume = (data) => api.post("/resume/analyze", data);
export const matchResume = (data) => api.post("/resume/match", data);
export const optimizeResume = (data) => api.post("/resume/optimize", data);
export const saveResume = (data) => api.post("/resume/save", data);
export const getMyResumes = () => api.get("/resume/my");
export const updateResume = (id, data) => api.put(`/resume/${id}`, data);
export const deleteResume = (id) => api.delete(`/resume/${id}`);
export const downloadResume = (data) =>
  api.post("/resume/download", data, {
    responseType: "blob",
  });