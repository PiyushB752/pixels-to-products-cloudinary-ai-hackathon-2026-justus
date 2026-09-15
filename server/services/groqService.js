const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const generateGroqResponse = async (messages) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:
        process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages,
      temperature: 0.4,
      max_tokens: 800,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq API error:", data);

    throw new Error(
      data?.error?.message || "Groq API request failed"
    );
  }

  return data?.choices?.[0]?.message?.content || "";
};

module.exports = {
  generateGroqResponse,
};