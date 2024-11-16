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
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProofread = async () => {
    setIsProcessing(true);
    setShowModal(true);

    // Get the text from the editor
    const text = editor.getText();

    try {
      // Send the text to the API endpoint
      const response = await fetch("/api/proofread", {
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

      // Update the state with the edited text
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
    // Re-run the proofreading process
    setIsProcessing(true);

    const text = editor.getText();

    try {
      const response = await fetch("/api/grammar_api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      setPreviewText(data.editedText);
      setReasoningSteps(data.reasoningSteps);
    } catch (error) {
      console.error("Error processing text:", error);
      setPreviewText("An error occurred while processing the text.");
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
              reasoningSteps={reasoningSteps}
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
