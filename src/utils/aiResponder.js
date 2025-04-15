import axios from "axios";

const OPENAI_API_KEY =
  "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";

export const getAIResponse = async (prompt) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'user',
            content: 'What is the meaning of life?',
          },
        ],
      }),
    });
    const result = await response.json()
    console.log(result)
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm sorry, something went wrong while fetching the response.";
  }
};
