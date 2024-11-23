// components/ResponsePreview.tsx

import React from "react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/editor/ResponsePreview.scss";

interface ResponsePreviewProps {
  previewText?: string;
  isProcessing?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onRegenerate?: () => void;
}

const ResponsePreview: React.FC<ResponsePreviewProps> = ({
  previewText = "Preview text will appear here...",
  isProcessing = false,
  onAccept,
  onDecline,
  onRegenerate,
}) => {
  return (
    <div className="preview-container">
      {isProcessing ? (
        <div className="loading-spinner" aria-label="Loading..." />
      ) : (
        <>
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
