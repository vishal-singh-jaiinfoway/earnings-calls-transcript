import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function ChatBox({ chats, isLoading, messagesEndRef }: any) {
  return (
    <Card className="flex-grow min-h-0 bg-white rounded-lg shadow-md border border-gray-200">
      <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[500px]">
        {chats.map((m: any, index: number) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg text-sm w-fit max-w-[75%]",
              m.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "bg-gray-200 text-gray-900"
            )}
          >
            <span className={cn("font-semibold", m.role === "user" ? "text-white" : "text-blue-600")}>
              {m.role === "user" ? "You" : "AI"}
            </span>
            <div className="prose mt-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-center space-x-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
    </Card>
  );
}

export default ChatBox;
