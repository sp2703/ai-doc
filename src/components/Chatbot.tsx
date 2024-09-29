"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";

export function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Helper function to render AI messages
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // If the line starts with a single *, treat it as a list item
      if (line.trim().startsWith("*")) {
        // Extract the bold text within **, and render as <strong>
        const listItem = line
          .replace(/^\*\s*/, "")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        return (
          <li
            key={index}
            className="ml-4 list-disc"
            dangerouslySetInnerHTML={{ __html: listItem }}
          />
        );
      }

      // Otherwise, render as a normal paragraph, with bold text if needed
      const paragraph = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={index}
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      );
    });
  };

  return (
    <div className="h-96 w-full max-w-[700px] bg-gray-50 border border-gray-200 shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-4 bg-white rounded-t-lg border-b border-gray-200">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-100 text-blue-900 self-end"
                  : "bg-gray-100 text-gray-900 self-start"
              }`}
            >
              <strong>{message.role === "user" ? "You: " : "AI: "}</strong>
              {message.role !== "user" ? (
                <ul>{renderMessageContent(message.content)}</ul>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center p-4 bg-gray-50 border-t border-gray-200">
          <form className="flex-1" onSubmit={handleSubmit}>
            <Input
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </form>
          <Button
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            type="submit"
            onClick={handleSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
