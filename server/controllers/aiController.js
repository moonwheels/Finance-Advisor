const OpenAI = require('openai');
const Transaction = require('../models/Transaction');

const FALLBACK_AI_INSIGHTS = {
  behavior: 'Unknown',
  ecoScore: 50,
  wellbeingScore: 50,
  insight: 'AI parsing failed',
  suggestions: []
};

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const fetchUserTransactions = async (userId) => {
  return Transaction.find({ user: userId })
    .select('amount category description date')
    .sort({ date: -1 })
    .limit(200)
    .lean();
};

const formatTransactionsForAI = (transactions) => {
  if (!transactions.length) {
    return 'No transactions available.';
  }

  return transactions.map((transaction) => {
    const amount = Number(transaction.amount) || 0;
    const date = transaction.date ? new Date(transaction.date) : null;
    const hour = date && !Number.isNaN(date.getTime()) ? date.getHours() : 'Unknown';

    return [
      `Amount: \u20B9${amount}`,
      `Category: ${transaction.category || 'Unknown'}`,
      `Description: ${transaction.description || 'No description'}`,
      `Time: ${hour}`
    ].join('\n');
  }).join('\n\n');
};

const extractJsonObject = (content) => {
  try {
    return JSON.parse(content);
  } catch (error) {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const clampScore = (value) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(Math.round(numericValue), 100));
};

const normalizeSuggestions = (suggestions) => {
  if (!Array.isArray(suggestions)) {
    return [];
  }

  return suggestions
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
};

const normalizeInsightsResponse = (data) => {
  const ecoScore = clampScore(data?.ecoScore);
  const wellbeingScore = clampScore(data?.wellbeingScore);
  const behavior = typeof data?.behavior === 'string' && data.behavior.trim()
    ? data.behavior.trim()
    : FALLBACK_AI_INSIGHTS.behavior;
  const insight = typeof data?.insight === 'string' && data.insight.trim()
    ? data.insight.trim()
    : FALLBACK_AI_INSIGHTS.insight;

  return {
    behavior,
    ecoScore: ecoScore ?? FALLBACK_AI_INSIGHTS.ecoScore,
    wellbeingScore: wellbeingScore ?? FALLBACK_AI_INSIGHTS.wellbeingScore,
    insight,
    suggestions: normalizeSuggestions(data?.suggestions)
  };
};

const createChatCompletion = async (messages, options = {}) => {
  const client = getOpenAIClient();

  if (!client) {
    return null;
  }

  return client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 500,
    response_format: options.responseFormat
  });
};

const buildInsightsPrompt = (formattedTransactions) => {
  return `You are a strict financial, health, and sustainability evaluator.

IMPORTANT RULES:
- Description is the MOST important field
- Junk food = unhealthy
- Do NOT assume small spending is good
- Be critical, not positive

Transactions:
${formattedTransactions}

Return ONLY valid JSON.

NO text outside JSON.

FORMAT:
{
  "behavior": "Impulse | Stress | Disciplined | Normal",
  "ecoScore": number,
  "wellbeingScore": number,
  "insight": "string",
  "suggestions": ["string", "string"]
}

RULES:
- ecoScore MUST be a number (0-100)
- wellbeingScore MUST be a number (0-100)
- NEVER return "unavailable"
- NEVER return text outside JSON`;
};

const buildBudgetSuggestionsPrompt = (transactions) => {
  return `You are a strict budgeting advisor.

Analyze the user's transactions and return ONLY valid JSON with this exact shape:
{
  "suggestions": {
    "savingsTarget": 0,
    "categoryBudgets": {
      "Category": 0
    },
    "reductionAreas": ["string"],
    "tips": ["string"]
  }
}

Rules:
- Base the response on the actual transactions
- Be critical and practical
- Keep numbers realistic
- Use only numbers for savingsTarget and category budget values

Transactions:
${transactions}`;
};

const buildSavingTipsPrompt = (transactions) => {
  return `You are a strict savings advisor.

Analyze the user's transactions and return ONLY valid JSON with this exact shape:
{
  "tips": ["string"],
  "topSpendingCategories": [["Category", 0]]
}

Rules:
- Focus on wasteful habits, impulse buying, junk food, and avoid overly positive language
- Keep the tips specific and realistic
- Return 4 to 6 tips
- topSpendingCategories must be an array of [category, amount] pairs

Transactions:
${transactions}`;
};

// @desc    Get AI-powered financial insights
// @route   POST /api/ai/insights
// @access  Private
const getFinancialInsights = async (req, res) => {
  try {
    const transactions = await fetchUserTransactions(req.user.id);
    const formattedTransactions = formatTransactionsForAI(transactions);

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        ...FALLBACK_AI_INSIGHTS,
        insight: 'AI unavailable. Please configure API key.'
      });
    }

    const response = await createChatCompletion([
      {
        role: 'system',
        content: 'You are a strict financial, health, and sustainability evaluator.'
      },
      {
        role: 'user',
        content: buildInsightsPrompt(formattedTransactions)
      }
    ], {
      maxTokens: 300,
      temperature: 0.1,
      responseFormat: { type: 'json_object' }
    });

    const content = response?.choices?.[0]?.message?.content || '';
    const parsedResponse = extractJsonObject(content);

    if (!parsedResponse) {
      return res.json(FALLBACK_AI_INSIGHTS);
    }

    const aiData = normalizeInsightsResponse(parsedResponse);
    return res.json(aiData);
  } catch (error) {
    console.error('AI insights error:', error);
    return res.status(500).json({ message: 'Error generating insights' });
  }
};

// @desc    Get budget suggestions
// @route   POST /api/ai/budget-suggestions
// @access  Private
const getBudgetSuggestions = async (req, res) => {
  try {
    const transactions = await fetchUserTransactions(req.user.id);
    const formattedTransactions = formatTransactionsForAI(transactions);
    const currentSpending = transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      const category = transaction.category || 'Unknown';

      acc.total += amount;
      acc.byCategory[category] = (acc.byCategory[category] || 0) + amount;
      return acc;
    }, {
      total: 0,
      byCategory: {}
    });

    const response = await createChatCompletion([
      {
        role: 'system',
        content: 'You are a strict budgeting advisor that returns JSON only.'
      },
      {
        role: 'user',
        content: buildBudgetSuggestionsPrompt(formattedTransactions)
      }
    ], {
      maxTokens: 500,
      temperature: 0.2,
      responseFormat: { type: 'json_object' }
    });

    if (!response) {
      return res.json({
        suggestions: {
          savingsTarget: 0,
          categoryBudgets: {},
          reductionAreas: [],
          tips: ['AI unavailable. Please configure API key.']
        },
        currentSpending
      });
    }

    const content = response.choices?.[0]?.message?.content || '';
    const parsed = extractJsonObject(content);

    if (!parsed?.suggestions) {
      return res.status(500).json({ message: 'Error generating budget suggestions' });
    }

    return res.json({
      suggestions: parsed.suggestions,
      currentSpending
    });
  } catch (error) {
    console.error('Budget suggestions error:', error);
    return res.status(500).json({ message: 'Error generating budget suggestions' });
  }
};

// @desc    Get saving tips
// @route   POST /api/ai/saving-tips
// @access  Private
const getSavingTips = async (req, res) => {
  try {
    const transactions = await fetchUserTransactions(req.user.id);
    const formattedTransactions = formatTransactionsForAI(transactions);

    const response = await createChatCompletion([
      {
        role: 'system',
        content: 'You are a strict savings advisor that returns JSON only.'
      },
      {
        role: 'user',
        content: buildSavingTipsPrompt(formattedTransactions)
      }
    ], {
      maxTokens: 450,
      temperature: 0.2,
      responseFormat: { type: 'json_object' }
    });

    if (!response) {
      return res.json({
        tips: ['AI unavailable. Please configure API key.'],
        topSpendingCategories: []
      });
    }

    const content = response.choices?.[0]?.message?.content || '';
    const parsed = extractJsonObject(content);

    if (!parsed?.tips || !Array.isArray(parsed.tips)) {
      return res.status(500).json({ message: 'Error generating saving tips' });
    }

    return res.json({
      tips: normalizeSuggestions(parsed.tips),
      topSpendingCategories: Array.isArray(parsed.topSpendingCategories) ? parsed.topSpendingCategories : []
    });
  } catch (error) {
    console.error('Saving tips error:', error);
    return res.status(500).json({ message: 'Error generating saving tips' });
  }
};

module.exports = {
  getFinancialInsights,
  getBudgetSuggestions,
  getSavingTips
};
