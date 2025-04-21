import axios from "axios";

const OPENROUTER_API_KEY =
  "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"; // use your real one securely

export const getAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
     
      {
        model: "google/gemini-2.5-pro-exp-03-25:free",
        messages: [
          {
            role: "user",
            content: `${prompt}. Answer in one line only within 30 words`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost", // Must match your frontend URL or localhost for dev
          "X-Title": "my-openrouter-test-app", // Optional but useful
        },
      }
    );
    console.log(response.data.choices[0].message.content.trim())
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "🔥 Error fetching response from OpenRouter:",
      error?.response?.data || error.message
    );
    return "Something went wrong while contacting OpenRouter.";
  }
};

// getAIResponse("What's the capital of France?").then(console.log);