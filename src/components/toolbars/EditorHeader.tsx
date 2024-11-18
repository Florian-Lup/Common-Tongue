// components/toolbars/EditorHeader.tsx

import { useState } from "react";
import "../styles/EditorHeader.scss";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import ResponsePreview from "../ResponsePreview";
import { Editor } from "@tiptap/react";
import { post } from "@aws-amplify/api";
import type { GrammarAPIResponse } from "../../types/api";

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
      const response = await post({
        apiName: "grammarAPI",
        path: "/grammar",
        options: {
          body: { text },
        },
      }).response;

      const data = response as unknown as GrammarAPIResponse;

      if (!data || !data.editedText) {
        throw new Error("No edited text received from the API");
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
