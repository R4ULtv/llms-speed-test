import { Ollama } from "ollama/browser";

export const getOllamaClient = () => {
  const host = localStorage.getItem("ollamaHost") || "http://127.0.0.1:11434";
  return new Ollama({ host });
};

// Optional: Add a helper function to set the host
export const setOllamaHost = (newHost) => {
  localStorage.setItem("ollamaHost", newHost);
};
