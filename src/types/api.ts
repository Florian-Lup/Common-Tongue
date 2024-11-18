export interface GrammarAPIResponse {
  editedText: string;
  error?: string;
}

export interface ResponsePreviewProps {
  previewText: string;
  isProcessing: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onRegenerate: () => void;
}
