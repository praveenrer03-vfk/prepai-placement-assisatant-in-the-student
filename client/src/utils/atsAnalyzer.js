// Advanced ATS Analyzer Utility
export const analyzeResume = (resumeData) => {
  const analysis = {
    overallScore: 0,
    sections: {},
    keywords: [],
    suggestions: [],
    formatting: {},
    readability: {}
  };

  // 1. Section Completeness Check
  const requiredSections = ['personal', 'experience', 'education', 'skills'];
  const optionalSections = ['certifications', 'projects', 'languages', 'summary'];
  
  const presentRequired = requiredSections.filter(s => 
    resumeData[s] && (Array.isArray(resumeData[s]) ? resumeData[s].length > 0 : true)
  );
  
  analysis.sections.completeness = (presentRequired.length / requiredSections.length) * 100;
  
  if (!resumeData.personal?.name) analysis.suggestions.push("Add your full name at the top");
  if (!resumeData.personal?.email) analysis.suggestions.push("Include a professional email address");
  if (!resumeData.summary) analysis.suggestions.push("Add a professional summary highlighting your key strengths");
  if (!resumeData.experience?.length) analysis.suggestions.push("List your relevant work experience");
  if (!resumeData.skills?.length) analysis.suggestions.push("Add technical skills section");
  if (!resumeData.education?.length) analysis.suggestions.push("Include your educational background");

  // 2. Keyword Analysis (based on common job descriptions)
  const industryKeywords = {
    "Software Engineer": [
      "JavaScript", "React", "Node.js", "Python", "Java", "AWS", "Docker",
      "REST API", "MongoDB", "PostgreSQL", "Git", "Agile", "Scrum"
    ],
    "Data Scientist": [
      "Python", "SQL", "Machine Learning", "TensorFlow", "Pandas",
      "Statistics", "Data Visualization", "Tableau", "Big Data"
    ],
    "Product Manager": [
      "Product Strategy", "Roadmap", "User Stories", "Agile", "Scrum",
      "Stakeholder Management", "Market Research", "MVP", "Analytics"
    ]
  };

  const allText = JSON.stringify(resumeData).toLowerCase();
  const detectedKeywords = [];
  
  Object.values(industryKeywords).forEach(keywords => {
    keywords.forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
      }
    });
  });
  
  analysis.keywords = [...new Set(detectedKeywords)];
  analysis.sections.keywordMatch = (analysis.keywords.length / 20) * 100;

  // 3. Formatting Check
  const hasBulletPoints = allText.includes('•') || allText.includes('-') || allText.includes('*');
  const hasQuantifiableAchievements = /\d+%|\d+\s*(percent|increase|reduce|improve)/i.test(allText);
  const hasActionVerbs = /(led|managed|developed|created|implemented|designed|built|improved)/i.test(allText);
  
  analysis.formatting = {
    bulletPoints: hasBulletPoints,
    quantifiable: hasQuantifiableAchievements,
    actionVerbs: hasActionVerbs
  };
  
  if (!hasBulletPoints) analysis.suggestions.push("Use bullet points for better readability");
  if (!hasQuantifiableAchievements) analysis.suggestions.push("Add quantifiable achievements (e.g., 'Improved performance by 30%')");
  if (!hasActionVerbs) analysis.suggestions.push("Start bullet points with strong action verbs");

  // 4. Length Check
  const wordCount = allText.split(/\s+/).length;
  analysis.formatting.length = wordCount;
  
  if (wordCount < 300) analysis.suggestions.push("Add more details to reach 300-500 word range");
  if (wordCount > 800) analysis.suggestions.push("Consider condensing - aim for 500-700 words");

  // 5. Calculate Overall Score
  analysis.overallScore = Math.round(
    (analysis.sections.completeness * 0.35) +
    (analysis.sections.keywordMatch * 0.35) +
    (hasBulletPoints ? 10 : 0) +
    (hasQuantifiableAchievements ? 10 : 0) +
    (hasActionVerbs ? 10 : 0)
  );
  
  // Cap at 100
  analysis.overallScore = Math.min(100, analysis.overallScore);
  
  // 6. Rating
  if (analysis.overallScore >= 85) analysis.rating = "Excellent";
  else if (analysis.overallScore >= 70) analysis.rating = "Good";
  else if (analysis.overallScore >= 50) analysis.rating = "Average";
  else analysis.rating = "Needs Improvement";
  
  return analysis;
};

// Company-specific ATS check
export const companySpecificCheck = (resumeData, company) => {
  const companyKeywords = {
    "TCS": ["Java", "Spring Boot", "Microservices", "SQL", "Agile", "Communication"],
    "Infosys": ["Python", "Django", "Cloud", "AWS", "Problem Solving", "Team Work"],
    "Amazon": ["Leadership", "Scale", "Customer Obsession", "Data Driven", "Algorithm"],
    "Google": ["Innovation", "Complex Problems", "Scalability", "Machine Learning", "C++"]
  };
  
  const keywords = companyKeywords[company] || [];
  const allText = JSON.stringify(resumeData).toLowerCase();
  const matched = keywords.filter(k => allText.includes(k.toLowerCase()));
  
  return {
    company,
    matchScore: (matched.length / keywords.length) * 100,
    matchedKeywords: matched,
    missingKeywords: keywords.filter(k => !allText.includes(k.toLowerCase()))
  };
};