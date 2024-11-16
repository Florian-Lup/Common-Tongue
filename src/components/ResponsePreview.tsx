// components/ResponsePreview.tsx

import React from "react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "./styles/ResponsePreview.scss";

interface ReasoningStep {
  agent: string;
  reasoning: string;
  editedText: string;
}

interface ResponsePreviewProps {
  previewText?: string;
  reasoningSteps?: ReasoningStep[];
  isProcessing?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onRegenerate?: () => void;
}

const ResponsePreview: React.FC<ResponsePreviewProps> = ({
  previewText = "Preview text will appear here...",
  reasoningSteps = [],
  isProcessing = false,
  onAccept,
  onDecline,
  onRegenerate,
}) => {
  return (
    <div className="preview-container">
      {isProcessing ? (
        <div className="loading-spinner">Processing...</div>
      ) : (
        <>
          <div className="reasoning-steps">
            {reasoningSteps.map((step, index) => (
              <div key={index} className="reasoning-step">
                <h4>{step.agent}</h4>
                <p>{step.reasoning}</p>
              </div>
            ))}
          </div>
          <div className="preview-content">{previewText}</div>
          <div className="preview-toolbar">
            <button className="toolbar-item" onClick={onAccept} title="Accept">
              <svg className="remix">
                <use xlinkHref={`${remixiconUrl}#ri-check-line`} />
              </svg>
            </button>
            <button
              className="toolbar-item"
              onClick={onDecline}
              title="Decline"
            >
              <svg className="remix">
                <use xlinkHref={`${remixiconUrl}#ri-close-line`} />
              </svg>
            </button>
            <button
              className="toolbar-item"
              onClick={onRegenerate}
              title="Regenerate"
            >
              <svg className="remix">
                <use xlinkHref={`${remixiconUrl}#ri-refresh-line`} />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResponsePreview;
