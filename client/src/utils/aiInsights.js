export const clampScore = (score) => {
  const value = Number(score);

  if (Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, Math.min(value, 100));
};

export const getScoreColor = (score) => {
  if (typeof score !== 'number') {
    return '#94a3b8';
  }

  if (score > 70) {
    return '#16a34a';
  }

  if (score >= 40) {
    return '#f97316';
  }

  return '#dc2626';
};

export const getEcoLabel = (score) => {
  if (typeof score !== 'number') {
    return 'Unavailable';
  }

  if (score > 70) {
    return 'Eco Friendly';
  }

  if (score >= 40) {
    return 'Moderate Impact';
  }

  return 'High Environmental Impact';
};

export const getWellbeingLabel = (score) => {
  if (typeof score !== 'number') {
    return 'Unavailable';
  }

  if (score > 70) {
    return 'Healthy';
  }

  if (score >= 40) {
    return 'Moderate';
  }

  return 'Unhealthy';
};

export const parseAIInsightsResponse = (payload) => {
  if (
    payload &&
    typeof payload === 'object' &&
    ('behavior' in payload || 'ecoScore' in payload || 'wellbeingScore' in payload || 'insight' in payload)
  ) {
    const ecoScore = clampScore(payload.ecoScore);
    const wellbeingScore = clampScore(payload.wellbeingScore);
    const suggestions = Array.isArray(payload.suggestions)
      ? payload.suggestions
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter(Boolean)
      : [];

    return {
      rawText: typeof payload.insight === 'string' ? payload.insight.trim() : '',
      behavior: typeof payload.behavior === 'string' ? payload.behavior.trim() : '',
      ecoScore,
      wellbeingScore,
      ecoLabel: getEcoLabel(ecoScore),
      wellbeingLabel: getWellbeingLabel(wellbeingScore),
      insight: typeof payload.insight === 'string' ? payload.insight.trim() : '',
      suggestions,
      hasStructuredData: true
    };
  }

  const rawText = typeof payload === 'string'
    ? payload.trim()
    : (payload?.aiResponse || '').trim();

  if (!rawText) {
    return null;
  }

  const behavior = rawText.match(/^Behavior:\s*(.+)$/im)?.[1]?.trim() || '';
  const ecoScore = clampScore(rawText.match(/^Eco Score:\s*(\d{1,3})$/im)?.[1]);
  const wellbeingScore = clampScore(rawText.match(/^Wellbeing Score:\s*(\d{1,3})$/im)?.[1]);

  const insightMatch = rawText.match(/Insight:\s*(?:\r?\n)+-\s*([\s\S]*?)(?=(?:\r?\n){2,}Suggestions:|(?:\r?\n)Suggestions:|$)/i);
  const suggestionsBlock = rawText.match(/Suggestions:\s*([\s\S]*)$/i)?.[1] || '';
  const suggestions = suggestionsBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-+\s*/, ''))
    .filter(Boolean);

  return {
    rawText,
    behavior,
    ecoScore,
    wellbeingScore,
    ecoLabel: getEcoLabel(ecoScore),
    wellbeingLabel: getWellbeingLabel(wellbeingScore),
    insight: insightMatch?.[1]?.trim() || '',
    suggestions,
    hasStructuredData: Boolean(behavior || typeof ecoScore === 'number' || typeof wellbeingScore === 'number')
  };
};
