// components/toolbars/EditorHeader.tsx

import { useState } from "react";
import "../styles/EditorHeader.scss";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import ResponsePreview from "../ResponsePreview";
import { Editor } from "@tiptap/react";

interface EditorHeaderProps {
  editor: Editor;
}

export default function EditorHeader({ editor }: EditorHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProofread = async () => {
    setIsProcessing(true);
    setShowModal(true);

    const text = editor.getText();

    try {
      const response = await fetch("/api/grammarAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.statusText}`);
      }

      setPreviewText(data.editedText);
    } catch (error) {
      console.error("Error processing text:", error);
      setPreviewText(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred while processing the text."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = () => {
    // Replace the editor content with the edited text
    editor.commands.setContent(previewText);
    setShowModal(false);
  };

  const handleDecline = () => {
    // Close the modal without changing the editor content
    setShowModal(false);
  };

  const handleRegenerate = async () => {
    setIsProcessing(true);

    const text = editor.getText();

    try {
      const response = await fetch("/api/grammarAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.statusText}`);
      }

      setPreviewText(data.editedText);
    } catch (error) {
      console.error("Error processing text:", error);
      setPreviewText(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred while processing the text."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="editor-header">
        <div className="agent-toolbar">
          <button className="toolbar-item" onClick={handleProofread}>
            <svg className="remix">
              <use href={`${remixiconUrl}#ri-eraser-fill`} />
            </svg>
            Proofread
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ResponsePreview
              previewText={previewText}
              isProcessing={isProcessing}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      )}
    </>
  );
}
