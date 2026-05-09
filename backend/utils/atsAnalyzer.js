const TECH_SKILLS = [
  "javascript","typescript","react","node","express","mongodb","sql","python","java",
  "aws","docker","kubernetes","git","html","css","redux","next.js","graphql","rest",
  "tailwind","jest","cypress","ci/cd","agile","scrum","figma","linux","azure","gcp",
  "tensorflow","pytorch","machine learning","ai","data science","leadership"
];

const ACTION_VERBS = [
  "developed","designed","implemented","architected","led","optimized","built",
  "deployed","automated","reduced","increased","launched","created","engineered"
];

export const analyzeATS = (resumeText, jobDescription = "") => {
  const text = (resumeText || "").toLowerCase();
  const jd = (jobDescription || "").toLowerCase();

  // 1. Skills detection
  const foundSkills = TECH_SKILLS.filter((s) => text.includes(s));
  const skillScore = Math.min((foundSkills.length / 12) * 100, 100);

  // 2. Action verbs
  const verbsUsed = ACTION_VERBS.filter((v) => text.includes(v));
  const verbScore = Math.min((verbsUsed.length / 8) * 100, 100);

  // 3. Length scoring
  const wordCount = text.split(/\s+/).length;
  let lengthScore = 60;
  if (wordCount >= 250 && wordCount <= 900) lengthScore = 100;
  else if (wordCount > 900) lengthScore = 80;

  // 4. Sections check
  const sections = ["experience", "education", "skills", "projects"];
  const sectionScore = (sections.filter((s) => text.includes(s)).length / 4) * 100;

  // 5. JD match
  let jdMatch = 0;
  let missingKeywords = [];
  let matchedKeywords = [];
  if (jd) {
    const jdWords = [...new Set(jd.match(/[a-zA-Z]{4,}/g) || [])];
    const importantJD = jdWords.filter(
      (w) => !["with","that","this","have","your","from","they","will"].includes(w)
    ).slice(0, 30);
    matchedKeywords = importantJD.filter((w) => text.includes(w));
    missingKeywords = importantJD.filter((w) => !text.includes(w));
    jdMatch = Math.round((matchedKeywords.length / importantJD.length) * 100) || 0;
  }

  const atsScore = Math.round(
    skillScore * 0.3 + verbScore * 0.2 + lengthScore * 0.2 + sectionScore * 0.3
  );

  const suggestions = [];
  if (verbScore < 60) suggestions.push("Add more action verbs like 'developed', 'led', 'optimized'.");
  if (skillScore < 60) suggestions.push("Add more relevant technical skills to match industry standards.");
  if (sectionScore < 100) suggestions.push("Ensure you have Experience, Education, Skills & Projects sections.");
  if (wordCount < 250) suggestions.push("Resume seems too short. Aim for 400-700 words.");
  if (wordCount > 900) suggestions.push("Resume too lengthy. Keep it concise (max 1 page).");
  if (jd && jdMatch < 70) suggestions.push("Improve keyword alignment with the job description.");

  return {
    atsScore,
    skillScore: Math.round(skillScore),
    verbScore: Math.round(verbScore),
    lengthScore: Math.round(lengthScore),
    sectionScore: Math.round(sectionScore),
    foundSkills,
    matchedKeywords,
    missingKeywords,
    matchPercent: jdMatch,
    suggestions,
    wordCount,
  };
};