import { useRef, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { chatWithAI } from "../services/aiService";

import "./AIAssistant.css";

const suggestions = [
  "What assignments do I have pending?",
  "Which subject has my lowest attendance?",
  "What events are coming up?",
  "Give me a summary of my workload.",
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Campusly AI. I can help you understand your attendance, assignments, tasks, upcoming events, and campus announcements.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  const sendMessage = async (messageText = input) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || loading) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedMessage,
    };

    const conversationForApi = messages
      .filter((message) => message.id !== "welcome")
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    scrollToBottom();

    try {
      const data = await chatWithAI(
        trimmedMessage,
        conversationForApi
      );

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          data.reply || "I couldn't generate a response.",
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to get AI response"
      );

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            "Sorry, I couldn't process that request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <div className="ai-title-wrapper">
          <div className="ai-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="ai-eyebrow">Campusly Intelligence</p>
            <h1>AI Assistant</h1>
            <p>
              Ask questions about your academic and campus
              activity.
            </p>
          </div>
        </div>
      </div>

      <div className="ai-chat-container">
        <div className="ai-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message-row ${message.role}`}
            >
              <div className="ai-message-avatar">
                {message.role === "assistant" ? (
                  <Bot size={17} />
                ) : (
                  <User size={17} />
                )}
              </div>

              <div className="ai-message-bubble">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-message-row assistant">
              <div className="ai-message-avatar">
                <Bot size={17} />
              </div>

              <div className="ai-message-bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && !loading && (
          <div className="ai-suggestions">
            <p>Try asking</p>

            <div className="suggestion-list">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() =>
                    handleSuggestion(suggestion)
                  }
                >
                  <Sparkles size={15} />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          className="ai-input-area"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask Campusly AI..."
            maxLength={1000}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;