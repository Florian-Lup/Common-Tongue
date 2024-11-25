// Interface representing the response from the grammar API
export interface GrammarAPIResponse {
  requestId: string;
  message: string;
  status: "PROCESSING" | "COMPLETED" | "ERROR";
  editedText?: string;
  error?: string;
}

// Interface for the properties of the ResponsePreview component
export interface ResponsePreviewProps {
  previewText: string;
  isProcessing: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onRegenerate: () => void;
  processingStatus?: string;
}
