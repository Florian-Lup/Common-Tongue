// components/toolbars/EditorHeader.tsx

import { useState } from "react";
import "../../styles/editor/EditorHeader.scss";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import ResponsePreview from "../common/ResponsePreview";
import { Editor } from "@tiptap/react";
import { proofreadText } from "../../services/grammar/grammarService";

interface EditorHeaderProps {
  editor: Editor;
}

// Header component for the editor with AI-powered text processing features
// Currently implements proofreading functionality

export default function EditorHeader({ editor }: EditorHeaderProps) {
  // State for managing preview modal and processing status
  const [showModal, setShowModal] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Handler for initiating the proofreading process
  const handleProofread = async () => {
    setIsProcessing(true);
    setShowModal(true);
    setProcessingStatus("Starting text processing...");

    try {
      const editedText = await proofreadText(editor.getText());
      setPreviewText(editedText);
      setProcessingStatus("");
    } catch (error) {
      console.error("Error processing text:", error);
      setPreviewText(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred while processing the text."
      );
      setProcessingStatus("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handlers for preview actions
  const handleAccept = () => {
    // Apply the processed text to the editor
    editor.commands.setContent(previewText);
    setShowModal(false);
  };

  const handleDecline = () => {
    setShowModal(false);
  };

  const handleRegenerate = async () => {
    setIsProcessing(true);
    await handleProofread();
  };

  return (
    <>
      {/* Toolbar with AI actions */}
      <div className="editor-header">
        <div className="agent-toolbar">
          <button
            className="toolbar-item"
            onClick={handleProofread}
            disabled={isProcessing}
          >
            <svg className="remix">
              <use xlinkHref={`${remixiconUrl}#ri-eraser-fill`} />
            </svg>
            Proofread
          </button>
        </div>
      </div>

      {/* Preview modal for processed text */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ResponsePreview
              previewText={previewText}
              isProcessing={isProcessing}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onRegenerate={handleRegenerate}
              processingStatus={processingStatus}
            />
          </div>
        </div>
      )}
    </>
  );
}
