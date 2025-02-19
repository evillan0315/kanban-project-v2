"use client"; // Ensure it's a client component

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { copyToClipboardAsync } from "@/utils/copyToClipboard";
import dynamic from "next/dynamic";

// ✅ Corrected dynamic import (fixes the TypeScript error)
const SyntaxHighlighter = dynamic(
  async () => {
    const mod = await import("react-syntax-highlighter");
    return mod.Prism; // ✅ Return the named export correctly
  },
  { ssr: false }
);

// ✅ Ensure you are importing a valid Prism theme
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    try {
      await copyToClipboardAsync(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCodeBlock = ({ inline, className, children }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).trim();

    return !inline && match ? (
      <div className="relative group">
        <SyntaxHighlighter
          style={a11yDark}
          language={match[1]}
          PreTag="div"
          customStyle={{
           // backgroundColor: "#1e1e1e", // ✅ Dark theme fix
            borderRadius: "5px",
            padding: "10px",
            fontSize: "14px",
          }}
        >
          {code}
        </SyntaxHighlighter>
        <IconButton
        sx={{position:"absolute", top: 1, right: 1}}
          className="absolute top-[-5px] right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 rounded"
          size="small"
          onClick={() => handleCopy(code)}
        >
          {copiedCode === code ? (
            <CheckIcon fontSize="small" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      </div>
    ) : (
      <code className={className}>{children}</code>
    );
  };

  return (
    <div className="markdown">
      <Card className="p-4  text-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ code: renderCodeBlock }}
        >
          {content}
        </ReactMarkdown>
      </Card>
    </div>
  );
};

export default MarkdownViewer;

