import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check } from "lucide-react";

type CodeSnippetProps = {
  code: string;
  language: string;
  id?: string;
  showCopyButton?: boolean;
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language,
  id = "code",
  showCopyButton = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative my-2 pointer-events-auto">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: "0.375rem",
          padding: "0.75rem",
          fontSize: "0.75rem",
          lineHeight: "1.2",
        }}
      >
        {code}
      </SyntaxHighlighter>
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );
};
