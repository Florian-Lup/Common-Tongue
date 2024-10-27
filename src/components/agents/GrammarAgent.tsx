// GrammarAgent.tsx
import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"; // Ensure this import is present
import "./agentstyle.scss";

interface GrammarAgentProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const GrammarAgent: React.FC<GrammarAgentProps> = ({
  editor,
  isTyping,
  setIsTyping,
  setIsProcessing,
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processingColor = "#d3d3d3"; // Light gray

  const handleFixGrammar = async () => {
    const fullText = editor.state.doc.textBetween(
      0,
      editor.state.doc.content.size,
      " "
    );

    if (!fullText) {
      return;
    }

    try {
      setIsFixing(true);
      setIsProcessing(true);
      setErrorMessage(null);

      // Disable editing and menubar
      editor.setEditable(false);

      if (!editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }

      editor.chain().focus().setColor(processingColor).run();

      const response = await fetch("/api/fixGrammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: { manuscript: fullText },
          version: "^1.2",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { finalRevision } = data;

        editor.commands.focus();

        if (editor.isActive("strike")) {
          editor.chain().focus().toggleStrike().run();
        }

        if (editor.isActive({ color: processingColor })) {
          editor.chain().focus().unsetColor().run();
        }

        typeWriterEffect(
          editor,
          0,
          editor.state.doc.content.size,
          finalRevision
        );
      } else {
        console.error("Error fixing grammar:", data.error || data.details);
        setErrorMessage("An error occurred.");

        if (editor.isActive("strike")) {
          editor.chain().focus().toggleStrike().run();
        }

        if (editor.isActive({ color: processingColor })) {
          editor.chain().focus().unsetColor().run();
        }
      }
    } catch (error) {
      console.error("Error fixing grammar:", error);
      setErrorMessage("An error occurred.");

      if (editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }

      if (editor.isActive({ color: processingColor })) {
        editor.chain().focus().unsetColor().run();
      }
    } finally {
      setIsFixing(false);
      setIsProcessing(false);
      // Re-enable editing and menubar
      editor.setEditable(true);
    }
  };

  // Typewriter effect function
  const typeWriterEffect = (
    editor: Editor,
    from: number,
    to: number,
    text: string
  ) => {
    setIsTyping(true);

    editor.commands.deleteRange({ from, to });

    let index = 0;
    const length = text.length;

    const interval = setInterval(() => {
      if (index < length) {
        const char = text.charAt(index);
        editor.commands.insertContentAt(from + index, char);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Set the cursor position after the inserted text
        editor.commands.setTextSelection(from + length);
        editor.setEditable(true); // Re-enable editing after typewriter effect completes
      }
    }, 10); //typewriter speed
  };

  // Automatically dismiss error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Dismiss after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when errorMessage changes
    }
  }, [errorMessage]);

  return (
    <div className="grammar-agent">
      <button
        onClick={handleFixGrammar}
        disabled={isFixing || isTyping}
        className={`agent-button ${isFixing || isTyping ? "is-active" : ""}`}
        title="Fix Grammar"
      >
        <svg className="icon">
          <use href={`${remixiconUrl}#ri-eraser-fill`} />
        </svg>
      </button>
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : null}
    </div>
  );
};

export default GrammarAgent;
