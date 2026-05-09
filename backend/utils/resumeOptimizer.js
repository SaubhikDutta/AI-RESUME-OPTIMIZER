const WEAK_TO_STRONG = {
  "worked on": "engineered",
  "helped": "spearheaded",
  "made": "developed",
  "did": "executed",
  "was responsible for": "led",
  "in charge of": "managed",
  "tried to": "successfully",
  "things": "deliverables",
};

export const optimizeResume = (text, jobDescription = "") => {
  let optimized = text;
  Object.entries(WEAK_TO_STRONG).forEach(([weak, strong]) => {
    const regex = new RegExp(`\\b${weak}\\b`, "gi");
    optimized = optimized.replace(regex, strong);
  });

  // Inject JD keywords subtly
  const improvements = [];
  if (jobDescription) {
    const jdSkills = (jobDescription.match(/[A-Za-z+#.]{3,}/g) || [])
      .map((s) => s.toLowerCase())
      .filter((s, i, a) => a.indexOf(s) === i)
      .slice(0, 8);
    improvements.push(`Consider integrating these JD keywords: ${jdSkills.join(", ")}`);
  }

  improvements.push("Use quantifiable metrics (e.g., 'Increased revenue by 35%').");
  improvements.push("Lead each bullet with a strong action verb.");
  improvements.push("Mirror exact phrasing from the JD where applicable.");

  return { optimizedText: optimized, improvements };
};