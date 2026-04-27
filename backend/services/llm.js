const axios = require("axios");

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";

async function rewriteResume(resumeText, jobDesc) {
  try {
    const response = await axios.post(
      GROQ_API,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional ATS resume optimizer. Extract and improve resume data. Always return clean JSON only."
          },
          {
            role: "user",
            content: `
Return ONLY JSON. No text, no explanation.

Format:
{
  "name": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "keywords": []
}

Instructions:
- Extract name, email, phone, linkedin from resume
- Improve summary using job description
- Convert skills into array
- Convert experience into bullet points array
- Add relevant ATS keywords

Resume:
${resumeText}

Job Description:
${jobDesc}
`
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // 🔥 CLEAN JSON RESPONSE (important)
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return cleaned;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("LLM Failed");
  }
}

module.exports = { rewriteResume };