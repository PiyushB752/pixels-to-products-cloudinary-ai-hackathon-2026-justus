import api from "./api";

export const chatWithAI = async (message, conversation = []) => {
  const response = await api.post("/ai/chat", {
    message,
    conversation,
  });

  return response.data;
};