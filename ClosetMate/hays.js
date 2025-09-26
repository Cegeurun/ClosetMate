import dotenv from "dotenv";
dotenv.config();

const question = "Hello AI, recommend an outfit for a sunny day.";

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "deepseek/deepseek-chat-v3.1:free",
    messages: [
      { role: "system", content: "You are a fashion advisor." },
      { role: "user", content: question }
    ]
  })
});

const data = await response.json();
console.log(data);
