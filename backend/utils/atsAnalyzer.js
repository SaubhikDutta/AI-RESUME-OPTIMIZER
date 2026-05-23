const TECH_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "node",
  "express",
  "mongodb",
  "sql",
  "python",
  "java",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "html",
  "css",
  "redux",
  "next.js",
  "graphql",
  "rest",
  "tailwind",
  "jest",
  "cypress",
  "ci/cd",
  "agile",
  "scrum",
  "figma",
  "linux",
  "azure",
  "gcp",
  "tensorflow",
  "pytorch",
  "machine learning",
  "ai",
  "data science",
  "leadership",
];

const ACTION_VERBS = [
  "developed",
  "designed",
  "implemented",
  "architected",
  "led",
  "optimized",
  "built",
  "deployed",
  "automated",
  "reduced",
  "increased",
  "launched",
  "created",
  "engineered",
];

const STOPWORDS = [
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "have",
  "from",
  "they",
  "will",
  "your",
  "you",
  "our",
  "their",
  "about",
  "into",
  "using",
  "used",
  "required",
  "preferred",
  "responsibilities",
  "description",
  "experience",
  "knowledge",
  "skills",
  "engineer",
  "developer",
  "looking",
  "large",
  "models",
  "applications",
  "systems",
  "work",
  "team",
  "build",
  "develop",
  "deploy",
];

export const analyzeATS = (resumeText, jobDescription = "") => {
  const text = (resumeText || "").toLowerCase();
  const jd = (jobDescription || "").toLowerCase();

  // 1. Skills detection
  const foundSkills = TECH_SKILLS.filter((s) =>
    text.includes(s.toLowerCase())
  );

  const skillScore = Math.min((foundSkills.length / 12) * 100, 100);

  // 2. Action verbs
  const verbsUsed = ACTION_VERBS.filter((v) =>
    text.includes(v.toLowerCase())
  );

  const verbScore = Math.min((verbsUsed.length / 8) * 100, 100);

  // 3. Length scoring
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let lengthScore = 60;

  if (wordCount >= 250 && wordCount <= 900) {
    lengthScore = 100;
  } else if (wordCount > 900) {
    lengthScore = 80;
  }

  // 4. Sections check
  const sections = ["experience", "education", "skills", "projects"];

  const sectionScore =
    (sections.filter((s) => text.includes(s)).length / 4) * 100;

  // 5. JD Match (FIXED PROPERLY)
  let jdMatch = 0;
  let MatchedSkills = [];
  let MissingSkills = [];

  if (jd.trim()) {
    // Only detect REAL tech skills from JD
    const jdSkills = TECH_SKILLS.filter((skill) =>
      jd.includes(skill.toLowerCase())
    );

    MatchedSkills = jdSkills.filter((skill) =>
      text.includes(skill.toLowerCase())
    );

    MissingSkills = jdSkills.filter(
      (skill) => !text.includes(skill.toLowerCase())
    );

    jdMatch =
      jdSkills.length > 0
        ? Math.round((MatchedSkills.length / jdSkills.length) * 100)
        : 0;
  }

  // Final ATS score
  const atsScore = Math.round(
    skillScore * 0.3 +
      verbScore * 0.2 +
      lengthScore * 0.2 +
      sectionScore * 0.3
  );

  // Suggestions
  const suggestions = [];

  if (verbScore < 60) {
    suggestions.push(
      "Add more action verbs like 'developed', 'led', 'optimized'."
    );
  }

  if (skillScore < 60) {
    suggestions.push(
      "Add more relevant technical skills to match industry standards."
    );
  }

  if (sectionScore < 100) {
    suggestions.push(
      "Ensure you have Experience, Education, Skills & Projects sections."
    );
  }

  if (wordCount < 250) {
    suggestions.push(
      "Resume seems too short. Aim for 400-700 words."
    );
  }

  if (wordCount > 900) {
    suggestions.push(
      "Resume too lengthy. Keep it concise (max 1 page)."
    );
  }

  if (jd && jdMatch < 70) {
    suggestions.push(
      "Improve keyword alignment with the job description."
    );
  }

  return {
    atsScore,
    skillScore: Math.round(skillScore),
    verbScore: Math.round(verbScore),
    lengthScore: Math.round(lengthScore),
    sectionScore: Math.round(sectionScore),

    foundSkills,
    MatchedSkills,
    MissingSkills,

    matchPercent: jdMatch,

    suggestions,
    wordCount,
  };
}