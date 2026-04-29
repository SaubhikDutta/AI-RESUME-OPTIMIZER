const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function optimizeResumeWithAI(resumeText, jobDesc) {
  try {
    const prompt = `
You are an expert ATS resume optimizer.

Task:
Rewrite the given resume to match the job description.

Rules:
- Keep it professional
- Add relevant skills from job description
- Improve wording
- Keep structure clean (Skills, Projects, Education, Experience)
- Do NOT add fake experience

Resume:
${resumeText}

Job Description:
${jobDesc}

Return only the improved resume.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Groq AI Error:", err.message);
    throw err;
  }
}

module.exports = optimizeResumeWithAI;