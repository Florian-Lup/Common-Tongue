// components/ResponsePreview.tsx

import React from "react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/editor/ResponsePreview.scss";

// A component that displays a preview of processed text with accept/decline/regenerate actions
// Used primarily for displaying AI-processed text before confirming changes

interface ResponsePreviewProps {
  previewText?: string; // The text to be previewed
  isProcessing?: boolean; // Loading state indicator
  onAccept?: () => void; // Handler for accepting the changes
  onDecline?: () => void; // Handler for rejecting the changes
  onRegenerate?: () => void; // Handler for requesting new changes
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
      {/* Show loading spinner when processing */}
      {isProcessing ? (
        <div className="loading-spinner" aria-label="Loading..." />
      ) : (
        <>
          {/* Display the preview text and action buttons */}
          <div className="preview-content">{previewText}</div>
          {/* Toolbar with accept/decline/regenerate actions */}
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
